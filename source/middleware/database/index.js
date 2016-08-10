var dbconf = require('../../configurations/knexfile')

var Knex = require('knex')(dbconf)
var Bookshelf = require('bookshelf')(Knex)

// Reusable database connection header
module.exports.Bookshelf = Bookshelf
