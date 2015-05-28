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
        res.json({ message: 'Team created!', data: team.toJSON() });
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
    // TODO - fetch team members and relevant stats.
    new Team({id: teamId}).fetch().then(function(team) {
        res.json(team);
    }, function(err) {
        res.send(err);
    });
};

// Create endpoint /api/teams/:team_id for PUT
exports.putTeam = function(req, res) {
    var teamId = req.params.team_id;

    // TODO: Validate
    var newObj = _.pick(req.body, 'name', 'members', 'stats');


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
        newObj.stats = JSON.parse(newObj.stats);
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
        newObj.members = JSON.parse(newObj.members);

        // Get the version of the team we care about
        all.push(
            knex.max('version').from('teammembersversion').where('team_id', teamId).then(function(maxVersion) {
                var maxVersion = _.values(maxVersion[0])[0];
                var now = new Date();
                var nestedOperations = [];

                // Update the old version with end time
                nestedOperations.push(
                    knex('teammembersversion')
                        .where({
                            team_id: teamId,
                            version: maxVersion
                        })
                        .update('end', now).then(_.noop));


                // Create a new version of this team's membership
                nestedOperations.push(knex('teammembersversion').insert({
                    version: maxVersion + 1,
                    team_id: teamId,
                    start: now
                }).then(function(newId) {
                    // Insert all members in the membership table

                    newId = newId[0];
                    var memberObjects = _.map(newObj.members, function(athlete) {
                        return {
                            version_id: newId,
                            athlete_id: athlete
                        };
                    });

                    return knex('teammember').insert(memberObjects).then(_.noop);
                }));

                return Promise.all(nestedOperations);
            }));
    }

    // Wait for everything to happen
    Promise.all(all).then(function() {
        res.send(newObj);
    }, function(err) {
        res.send(err);
    });
};

function getSummaryOfStatValues(stat, values) {
    // Average
    var sum = _.reduce(values, function(memo, num){ return memo + (num || 0); }, 0);
    return sum / values.length;
}

function getTeamMembers(teamId, time) {
    var idOfCorrectVersion = knex.max('id')
        .from('teammembersversion')
        .where('team_id', teamId)
        .andWhere('start', '<=', time)
        .andWhere(function() {
            this.where('end', '>=', time).orWhere('end', '=', null)
        });

    var membersQuery = knex('athlete').join('teammember', 'athlete.id', 'teammember.athlete_id')
        .whereIn('version_id', idOfCorrectVersion)
        .select('*')
        .then(function (athletes) {
            return _.map(athletes, function(athlete) {
                return _.omit(athlete, 'athlete_id', 'version_id');
            });
        });
    return membersQuery;
}

function getTeamStats(teamId) {
    var relevantStatIdsQuery = knex.select('stattype_id').from('teamstat').where('team_id', teamId);
    var outerQuery = knex.select('*').from('stattype').whereIn('id', relevantStatIdsQuery);
    return outerQuery.tap();
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

    var stats = getTeamStats(teamId);
    var allPromises = [];

    for(var i = 12; i >= 0; i--) {

        var ubound = moment().subtract(i, "months").toDate();
        (function(upperBound) {
            var teamMembers = getTeamMembers(teamId, upperBound);

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
