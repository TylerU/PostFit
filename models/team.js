var bookshelf = require('../database').bookshelf;
var knex = require('../database').knex;
var _ = require('underscore');

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
        var teamId = this.get('id');

        var idOfCorrectVersion = knex.max('id')
            .from('teammembersversion')
            .where('team_id', teamId)
            .andWhere('start', '<=', time)
            .andWhere(function () {
                this.where('end', '>=', time).orWhere('end', '=', null)
            });

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
    }
});


module.exports = Team;
