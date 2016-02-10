var dbConfig = require('../../knexfile')

// reset database at each startup
try {
  require('fs').unlinkSync(dbConfig.connection.filename);
} catch (e) {}


var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

// Reusable database connection header;
module.exports.bookshelf = bookshelf;
