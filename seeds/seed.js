var fakerDatabase = require('./data');

exports.seed = function (knex, Promise) {
  var tables = [
    'users',
    'todos'
  ];
  return Promise.each(tables, function (table) {
    return Promise.each(fakerDatabase[table], function (record) {
      return knex(table).insert(record);
    });
  });
};
