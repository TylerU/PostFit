var bookshelf = require('../database').bookshelf;

var School = bookshelf.Model.extend({
    tableName: 'school',
});

console.log(School);

module.exports = School;
