var bookshelf = require('../database').bookshelf;

var School = bookshelf.Model.extend({
    tableName: 'school',
});


module.exports = School;
