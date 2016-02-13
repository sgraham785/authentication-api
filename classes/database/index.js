var dbConfig = require('../../knexfile')

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

// Reusable database connection header;
module.exports.bookshelf = bookshelf;
