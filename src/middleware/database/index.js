import knexfile from '../../config/knexfile'
const Knex = require('knex')(knexfile)

// Reusable database connection header
export const bookshelf = require('bookshelf')(Knex)
