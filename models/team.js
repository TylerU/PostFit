var bookshelf = require('../database').bookshelf;

var Team = bookshelf.Model.extend({
    tableName: 'team',
});


module.exports = Team;
