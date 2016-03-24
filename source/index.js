var fs = require('fs');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
//var routeBuilder = require('express-routebuilder');
var cors = require('cors');
var logger = require('morgan');
var nunjucks = require('nunjucks');
var dotenv = require('dotenv');
var env = path.join(__dirname, '..', '.env');
var auth = require('./classes/auth');
var API = require('./classes/api');
var app = express();
var helmet = require('helmet');

// load up .env file
if (fs.existsSync(env)) {
  dotenv.load();
}

// view engine setup for emails
// nunjucks.configure('views', {
//     autoescape: true,
//     express: app
// });
app.use(favicon(__dirname + '/views/favicon.ico'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// ======== *** SECURITY MIDDLEWARE ***

app.use(helmet());

//setting CSP
var scriptSources = ["'self'", "'unsafe-inline'", "'unsafe-eval'", "ajax.googleapis.com", "www.google-analytics.com"];
var styleSources = ["'self'", "'unsafe-inline'", "ajax.googleapis.com"];
var connectSources = ["'self'"];

app.use(helmet.contentSecurityPolicy({
    defaultSrc: ["'self'"],
    scriptSrc: scriptSources,
    styleSrc: styleSources,
    connectSrc: connectSources,
    reportOnly: false,
    setAllHeaders: false,
    safari5: false
}));

//app.use(methodOverride());

app.use(bodyParser.urlencoded({
  extended: false,
  type: 'application/x-www-form-urlencoded'
}));
app.use(bodyParser.json({
  type: ['application/json', 'application/vnd.api+json']
}));

var corsOptions = {
  origins: '*', // restrict it to the required domain
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-type,Accept,X-Access-Token,X-Key',
  maxAge: 3600
};
// Enable ALL CORS for requests
app.use(cors(corsOptions));
// Fix res for OPTIONS CORS
app.all('/*', function(req, res, next) {
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

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

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  app.use(logger('dev'));
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
  app.use(logger('common', {
    skip: function(req, res) {
      return res.statusCode < 400;
    },
    stream: __dirname + '/../app_errors.log'
  }));
}

module.exports = app;
