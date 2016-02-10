var path = require('path');
var fs = require('fs');

var dotenv = require('dotenv');
var envFile = path.join(__dirname, '../', '.env');

// load up .env file;
if (fs.existsSync(envFile)){
    dotenv.load();
}

console.log(process.env.DB_HOST);

var dbConfig = {
   client: 'pg',
   debug: true,
   connection: {
       host     : '192.168.99.100', //process.env.DB_HOST,
       port     : 32768, //process.env.DB_PORT,
       user     : 'postgres', //process.env.DB_USER,
       password : process.env.DB_PASS,
       database : 'todos' //process.env.DB_NAME
   }
 };



module.exports = dbConfig;
