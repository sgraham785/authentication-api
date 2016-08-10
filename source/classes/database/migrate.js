var dbconf = require('../../_configs/knexfile')
var knex = require('knex')(dbconf)

console.log('Running migrations...')
knex.migrate.latest(dbconf).then(function () {
  console.log('Running seeders...')
  return knex.seed.run(dbconf)
}).then(function () {
  console.log('Done...')
  process.exit(0)
})
