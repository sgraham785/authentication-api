import Promise from 'bluebird'
import { bookshelf } from '../../src/middleware/database'

export const truncate = (tables) => {
  return Promise.each(tables, function (table) {
    return bookshelf.knex.raw(`truncate table ${table} cascade`)
  })
}
