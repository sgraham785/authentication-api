module.exports = function transaction (fn) {
  return function _transaction (knex, Promise) {
    return knex.transaction(function (trx) {
      return trx
        .raw('SET foreign_key_checks = 0')
        .then(function () {
          return fn(trx, Promise)
        })
        .finally(function () {
          return trx.raw('SET foreign_key_checks = 1')
        })
    })
  }
}
