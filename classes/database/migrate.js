var dbConfig = require('../../knexfile')
var knex = require('knex')(dbConfig);

console.log('Running migrations...');
knex.migrate.latest(dbConfig).then(function () {
  console.log('Running seeders...');
  knex.seed.run(dbConfig);
}).then(function () {
  console.log('Done...');
  process.exit(0);
});
