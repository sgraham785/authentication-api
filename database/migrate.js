var Bookshelf = require('../configs/db').bookshelf;
var Schema = require('./schema');
var sequence = require('when/sequence');
var _ = require('lodash');

var schemaTables = _.keys(Schema);

// Run the file from the command-line `node database/migrate <command>`.
var argv = require('yargs').argv;

var help = 'Usage: node /path/to/migrate --run [drop] [create] \n ' +
        ' drop = Drops database tables defined in Schema. \n ' +
        '\t Only available where NODE_ENV === \'develop\' \n ' +
        ' create = Creates database defined in Schema ';

if ((argv.h)||(argv.help)) {
    console.log(help);
    process.exit(0);
}

// TODO: spit to run multiple file in ./migrations and seeders

switch (argv.run) {
    case 'create':

    function createTable(tableName) {

        return Bookshelf.knex.schema.createTable(tableName, function (table) {

            var column;
            var columnKeys = _.keys(Schema[tableName]);

            _.each(columnKeys, function (key) {
                // creation distinguishes between text with fieldtype, string with maxlength and all others
                if (Schema[tableName][key].type === 'text' && Schema[tableName][key].hasOwnProperty('fieldtype')) {
                    column = table[Schema[tableName][key].type](key, Schema[tableName][key].fieldtype);
                }
                else if (Schema[tableName][key].type === 'string' && Schema[tableName][key].hasOwnProperty('maxlength')) {
                    column = table[Schema[tableName][key].type](key, Schema[tableName][key].maxlength);
                }
                else {
                    column = table[Schema[tableName][key].type](key);
                }

                if (Schema[tableName][key].hasOwnProperty('nullable') && Schema[tableName][key].nullable === true) {
                    column.nullable();
                }
                else {
                    column.notNullable();
                }

                if (Schema[tableName][key].hasOwnProperty('primary') && Schema[tableName][key].primary === true) {
                    column.primary();
                }

                if (Schema[tableName][key].hasOwnProperty('unique') && Schema[tableName][key].unique) {
                    column.unique();
                }

                if (Schema[tableName][key].hasOwnProperty('unsigned') && Schema[tableName][key].unsigned) {
                    column.unsigned();
                }

                if (Schema[tableName][key].hasOwnProperty('references')) {
                    //check if table exists?
                    column.references(Schema[tableName][key].references);
                }

                if (Schema[tableName][key].hasOwnProperty('defaultTo')) {
                    column.defaultTo(Schema[tableName][key].defaultTo);
                }
            });
        })
    }

    function createTables() {

        var tables = _.map(schemaTables, function (tableName) {
            return function () {
                return createTable(tableName);
            };
        });

        console.log('Creating tables...');

        return sequence(tables);
    }

        createTables()
            .then(function() {
                console.log('Tables created!!');
                process.exit(0);
            })
            .otherwise(function (error) {
                throw error;
            });

        break;
    case 'drop':

        if (process.env.NODE_ENV === 'develop') {

            function dropTable(tableName) {

                return Bookshelf.knex.schema.dropTableIfExists(tableName)

            }

            function dropTables() {

                var tables = _.map(schemaTables, function (tableName) {
                    return function () {
                        return dropTable(tableName);
                    };
                }).reverse();

                console.log('Dropping tables...');

                return sequence(tables);
            }

            dropTables()
                .then(function () {
                    console.log('Tables dropped!!');
                    process.exit(0);
                })
                .otherwise(function (error) {
                    throw error;
                });
        } else {
            console.log('This script is disabled, except where NODE_ENV === \'develop\'');
            process.exit(0);
        }
            break;

            default:
                console.log(help);
                process.exit(0);

}