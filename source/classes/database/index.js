var dbconf = require('../../_configs/knexfile');

var Knex = require('knex')(dbconf);
var Bookshelf = require('bookshelf')(Knex);

// Reusable database connection header;
module.exports.Bookshelf = Bookshelf;
