
var knex = require('knex')({
  client: 'mysql',
  connection: process.env.CLEARDB_DATABASE_URL ||  {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'postfit',
    charset  : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

module.exports = {
  knex: knex,
  bookshelf: bookshelf
};