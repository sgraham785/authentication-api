var fs = require('fs');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var nunjucks = require('nunjucks');

var auth = require('./classes/auth');
var API = require('./classes/api');
var app = express();


app.use(favicon(__dirname + '/views/favicon.ico'));

// view engine setup for emails
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// Register & use declared endpoints
var modulesPath = path.join(__dirname, 'modules');
var resourceTypes = fs.readdirSync(modulesPath);

resourceTypes.forEach(function(resourceType) {
  var resourcesPath = path.join(__dirname, 'modules/' + resourceType);
  var resources = fs.readdirSync(resourcesPath);
  resources.forEach(function(resource) {
    app.all('/v1/public/*');
    app.all('/v1/private/*', auth.requireToken);
    API.register(resource);
    app.use(API.endpoint(resource));
  });
});

app.get('/v1', function(request, response) {
  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify(API.index(), null, 2));
});

app.get('/', function(request, response) {
  response.redirect('/v1');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
