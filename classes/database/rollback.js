var dbConfig = require('../../_configurations/knexfile')
var knex = require('knex')(dbConfig);

console.log('Running rollback...');
knex.migrate.rollback(dbConfig).then(function () {
  console.log('Done...');
  process.exit(0);
});
