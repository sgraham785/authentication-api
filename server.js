var host = process.env.APP_HOST || 'localhost';
var port = process.env.APP_PORT || '8080';
var env = process.env.NODE_ENV || 'development';
var express = require('express');
var server = express();

server.use(require('./source'));

server.listen(port, host);

console.log('Server running on, %s:%d. NODE_ENV = %s', host, port, env);

module.exports = server;
