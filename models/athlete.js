var bookshelf = require('../database').bookshelf;

var Athlete = bookshelf.Model.extend({
    tableName: 'athlete',
});


// Export the Mongoose model
module.exports = Athlete;
