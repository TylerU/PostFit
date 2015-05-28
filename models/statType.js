var bookshelf = require('../database').bookshelf;

var StatType = bookshelf.Model.extend({
    tableName: 'stattype',
});


module.exports = StatType;
