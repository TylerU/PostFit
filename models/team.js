var bookshelf = require('../database').bookshelf;
var knex = require('../database').knex;
var _ = require('underscore');
var Promise = require('bluebird');
var moment = require('moment');

var Team = bookshelf.Model.extend({
    tableName: 'team',

    getStatTypesIds: function() {
        return this.getStatTypes().then(function(types) {
            return _.map(types, function(type) {
                return type.id;
            });
        });
    },

    getMembers: function(time) {
        if(!time) {
            time = moment().toDate();
        }

        var teamId = this.get('id');

        var idOfCorrectVersion = knex.max('id')
            .from('teammembersversion')
            .where(function () {
                this.whereNull('end').orWhere('end', '>=', time);
            })
            .andWhere('team_id', teamId)
            .andWhere('start', '<=', time);

        var membersQuery = knex('athlete').join('teammember', 'athlete.id', 'teammember.athlete_id')
            .whereIn('version_id', idOfCorrectVersion)
            .select('*')
            .then(function (athletes) {
                return _.map(athletes, function (athlete) {
                    return _.omit(athlete, 'athlete_id', 'version_id');
                });
            });
        return membersQuery;
    },

    getStatTypes: function () {
        var teamId = this.get('id');

        var relevantStatIdsQuery = knex.select('stattype_id').from('teamstat').where('team_id', teamId);
        var outerQuery = knex.select('*').from('stattype').whereIn('id', relevantStatIdsQuery);
        return outerQuery.tap();
    },

    setMembersAndSave: function(membersArr) {
        var teamId = this.get('id');
        return knex.max('version').from('teammembersversion').where('team_id', teamId).then(function(maxVersion) {
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
                var memberObjects = _.map(membersArr, function(athlete) {
                    return {
                        version_id: newId,
                        athlete_id: athlete
                    };
                });
                if(memberObjects.length > 0)
                    return knex('teammember').insert(memberObjects).then(_.noop);
            }));

            return Promise.all(nestedOperations);
        })
    },

    addAthleteAndSave: function(athleteId) {
        athleteId = parseInt(athleteId);
        return this.getMembers().then(function(members) {
            if(_.where(members, {id: athleteId}).length == 0) {
                // Add to the list
                var newArr = _.map(members, function(athlete) {
                    return athlete.id;
                });
                newArr.push(athleteId);
                return this.setMembersAndSave(newArr);
            }
            return true;
        }.bind(this));
    },

    removeAthleteAndSave: function(athleteId) {
        athleteId = parseInt(athleteId);
        return this.getMembers().then(function(members) {
            if(_.where(members, {id: athleteId}).length > 0) {
                // Remove from the list
                var newArr = _.chain(members).map(function(athlete) {
                    return athlete.id;
                }).filter(function(athlete) {
                    return athlete != athleteId;
                }).value();

                return this.setMembersAndSave(newArr);
            }
            return true;
        }.bind(this));
    }
});

Team.getCurrentMembersQuery = function() {
    return knex.raw("SELECT athlete_id, team_id FROM teammember t inner join (SELECT * FROM teammembersversion WHERE (team_id, version) IN ( SELECT team_id, MAX(version) FROM teammembersversion GROUP BY team_id )) v on ( version_id = id )").wrap('(', ') teammemberrecent');
};
/*
 SELECT athlete_id, team_id FROM teammember t inner join (SELECT * FROM `teammembersversion` WHERE (team_id, version) IN (
 SELECT team_id, MAX(version)
 FROM `teammembersversion`
 GROUP BY team_id
 )) v on ( version_id = id );
 */

module.exports = Team;
