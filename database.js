
var knex = require('knex')({
    client: 'mysql',
    connection: process.env.CLEARDB_DATABASE_URL
});

var bookshelf = require('bookshelf')(knex);

module.exports = {
    knex: knex,
    bookshelf: bookshelf
};