var bookshelf = require('../database').bookshelf;
var Team = require('../models/team');
var knex = require('../database').knex;
var _ = require('underscore');

var Athlete = bookshelf.Model.extend({
    tableName: 'athlete',

    getTeams: function(withExtras) {
        if(!withExtras)
            return knex.select('team_id').from(Team.getCurrentMembersQuery()).where('athlete_id', this.get('id')).then(function(res) {
                return _.map(res, 'team_id');
            });
        else
            return knex.select('*').from('team').innerJoin(Team.getCurrentMembersQuery(), 'teammemberrecent.team_id', 'team.id').where('athlete_id', '=', this.get('id'));
    }
});


// Export the Mongoose model
module.exports = Athlete;
