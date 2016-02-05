var path = require('path');
var fs = require('fs');

var dotenv = require('dotenv');
var envFile = path.join(__dirname, '..', '.env');

// load up .env file;
if (fs.existsSync(envFile)){
    dotenv.load();
}

var dbConfig = {
    client: 'pg',
    debug: true,
    connection: {
        host     : process.env.DB_HOST,
        port     : 5432,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
    }
};

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

// Reusable database connection header;
module.exports.bookshelf = bookshelf;