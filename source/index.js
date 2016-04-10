var fs = require('fs');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var nunjucks = require('nunjucks');
var jade = require('jade');

var auth = require('./classes/auth');
var API = require('./classes/api');
var app = express();


app.use(favicon(__dirname + '/views/favicon.ico'));

// view engine setup for emails
// nunjucks.configure('views', {
//     autoescape: true,
//     express: app
// });


// Register & use declared resource naming
var resourcesPath = path.join(__dirname, 'resources');
var resourceTypes = fs.readdirSync(resourcesPath);

resourceTypes.forEach(function(resourceType) {
  var resourcesTypePath = resourcesPath + resourceType;
  var resources = fs.readdirSync(resourcesTypePath);
  resources.forEach(function(resource) {
    API.register(resource);
    app.use(API.endpoint(resource));
  });
});

// URI handling
app.get('/', function(request, response) {
  response.redirect('/v1');
});

app.get('/v1', function(request, response) {
  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify(API.index(), null, 2));
});

app.all('/v1/public/*');
app.all('/v1/private/*', auth.requireToken);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
