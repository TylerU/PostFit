// Load required packages
var Team = require('../models/team');
var _ = require('../lib/underscore');
var Stat = require('../models/stat');
var Athlete = require('../models/athlete');
var StatType = require('../models/statType');
var knex = require('../database').knex;
var Promise = require('bluebird');
var moment = require('moment');

exports.postTeam = function(req, res) {
    var team = {};
    var schoolId = parseInt(req.params.school_id);

    team.name = req.body.name;
    team.school_id = schoolId;

    Team.forge(team).save().then(function(team) {
        res.json({ success: true, message: 'Team created!', data: team.toJSON() });
    }, function(err) {
        res.send(err);
    });
};

exports.getTeams = function(req, res) {
    var schoolId = parseInt(req.params.school_id);

    Team.query({
        where: {
            school_id: schoolId
        }
    }).fetchAll().then(function(teams) {
        res.json(teams.toJSON());
    }, function(err) {
        res.send(err);
    });
};

// Create endpoint /api/teams/:team_id for GET
exports.getTeam = function(req, res) {
    var teamId = req.params.team_id;
    var team = new Team({id: teamId});

    var result = {
        team: {}
    };
    var arr = [];
    arr.push(team.fetch().then(function(resTeam) {
        result.team = resTeam.toJSON();
    }, function(err){
    }));

    arr.push(team.getStatTypesIds().then(function(types){
        result.stats = types;
    }));

    arr.push(team.getMembers().then(function(members){
        result.members = members;
    }));

    Promise.all(arr).then(function() {
        result.team.stats = result.stats;
        result.team.members = result.members;

        res.json(result.team);
    }, function(err) {
        res.send(err);
    });

};

// Create endpoint /api/teams/:team_id for PUT
exports.putTeam = function(req, res) {
    var teamId = req.params.team_id;

    // TODO: Validate
    var newObj = _.pick(req.body, 'id', 'name', 'members', 'stats');


    var all = [];
    // Update name
    if(newObj.name) {
        all.push(
            new Team({id: teamId})
                .save({name: newObj.name}, {patch: true})
                .then(_.noop));

    }

    // Update Stats
    if(newObj.stats) {
        all.push(
            knex('teamstat').where('team_id', teamId).del().then(function(){
                var statObjects = _.map(newObj.stats, function(stat) {
                    return {team_id: teamId, stattype_id: stat};
                });
                return knex('teamstat').insert(statObjects).then(_.noop);
            }));
    }

    // Update members
    if(newObj.members) {
        // Get the version of the team we care about
        all.push(
            new Team({id: teamId}).setMembersAndSave(newObj.members)
        );
    }

    // Wait for everything to happen
    Promise.all(all).then(function() {
        res.send({
            success: true,
            data: newObj
        });
    }, function(err) {
        res.send(err);
    });
};

function getSummaryOfStatValues(stat, values) {
    // Average
    var sum = _.reduce(values, function(memo, num){ return memo + (num || 0); }, 0);
    return sum / values.length;
}

function getLatestStatValueAtTime(athlete, stat, upperBound) {
    return knex('stat')
        .select('value', 'time', 'id')
        .orderBy('time', 'desc')
        .limit(1)
        .where({stattype_id: stat.id, athlete_id: athlete.id})
        .andWhere('time', '<=', upperBound)
        .then(_.noop);
}

exports.getTeamSummary = function(req, res) {
    var teamId = req.params.team_id;
    var finalObj = {};

    var team = new Team({id: teamId});

    var stats = team.getTeamStats();
    var allPromises = [];

    for(var i = 12; i >= 0; i--) {

        var ubound = moment().subtract(i, "months").toDate();
        (function(upperBound) {
            var teamMembers = team.getMembers(upperBound);

            allPromises.push(teamMembers.then(function (athletes) {
                return stats.then(function (allStats) {
                    var all = [];
                    _.forEach(allStats, function (stat) {

                        if (!finalObj[stat.id]) {
                            finalObj[stat.id] = {
                                metadata: stat,
                                data: [],
                            };
                        }

                        var values = [];
                        _.forEach(athletes, function (athlete) {
                            var value = getLatestStatValueAtTime(athlete, stat, upperBound);
                            values.push(value);
                        });

                        all.push(Promise.all(values).then(function (resultValues) {
                            var result = getSummaryOfStatValues(stat, resultValues) || 0;
                            finalObj[stat.id].data.push({value: result, time: upperBound});
                            return finalObj;
                        }));
                    });

                    return Promise.all(all);
                });
            }));
        })(ubound);
    }

    Promise.all(allPromises).then(function() {
        res.json(finalObj);
    }, function(err) {
        res.send(err);
    });
};

exports.getTeamMembersStats = function(req, res) {
    var teamId = req.params.team_id;

    var finalObj = {};
    var allCallbacks = [];
    finalObj.statsMetadata = [];
    finalObj.athletesData = {};

    var relevantStatIdsQuery = knex.select('stattype_id').from('teamstat').where('team_id', teamId);
    var outerQuery = knex.select('*').from('stattype').whereIn('id', relevantStatIdsQuery);

    // Get stat metadata
    allCallbacks.push(outerQuery.then(function(statTypes) {
        finalObj.statsMetadata = statTypes;
    }));

    var relevantStatIds = relevantStatIdsQuery.then(function(ids) {
        var ids = _.map(ids, function(id) {return _.values(id)[0]});
        return ids;
    });

    // Get team member data
    var idOfMaxVersionQuery = knex.max('id').from('teammembersversion').where('team_id', teamId);
    var memberIdsQuery = knex('athlete').join('teammember', 'athlete.id', 'teammember.athlete_id')
        .whereIn('version_id', idOfMaxVersionQuery)
        .select('firstName', 'lastName', 'year', 'id')
        .then(function(athletes) {
            return relevantStatIds.then(function(statIds) {
                var promises = [];
                _.forEach(athletes, function(athlete) {
                    if(!finalObj.athletesData[athlete.id]) {
                        finalObj.athletesData[athlete.id] = {};
                    }

                    finalObj.athletesData[athlete.id]['metadata'] = athlete;

                    promises = promises.concat(_.map(statIds, function(statId) {
                        return knex('stat')
                            .select('value', 'time')
                            .orderBy('time', 'desc')
                            .limit(1)
                            .where({stattype_id: statId, athlete_id: athlete.id})
                            .then(function(stat) {
                                if(stat.length == 1) {
                                    stat = stat[0];
                                    finalObj.athletesData[athlete.id][statId] = stat;
                                }
                            });
                    }));
                });
                return Promise.all(promises);
            });
        });
    allCallbacks.push(memberIdsQuery);

    Promise.all(allCallbacks).then(function() {
        res.json(finalObj);
    }, function(err) {
        res.send(err);
    });
};
