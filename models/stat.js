var bookshelf = require('../database').bookshelf;

var Stat = bookshelf.Model.extend({
    tableName: 'stat',
});


module.exports = Stat;
