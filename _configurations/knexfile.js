var path = require('path');
var fs = require('fs');

var dotenv = require('dotenv');
var envFile = path.join(__dirname, '../', '.env');

// load up .env file;
if (fs.existsSync(envFile)){
    dotenv.load();
}

var dbConfig = {
   client: 'pg',
   debug: true,
   connection: {
       host     : process.env.DB_HOST,
       port     : process.env.DB_PORT,
       user     : process.env.DB_USER,
       password : process.env.DB_PASS,
       database : process.env.DB_NAME
   }
 };

module.exports = dbConfig;
