var host = process.env.APP_HOST || 'localhost';
var port = process.env.APP_PORT || '8080';
var express = require('express');
var app = express();

app.use(require('./source'));

app.listen(port, host);

console.log('Server running on, %s:%d', host, port);

module.exports = app;
