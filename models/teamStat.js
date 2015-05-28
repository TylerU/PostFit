var bookshelf = require('../database').bookshelf;

var TeamStat = bookshelf.Model.extend({
    tableName: 'team',
});


module.exports = TeamStat;
