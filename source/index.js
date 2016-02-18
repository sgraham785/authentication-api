var fs = require('fs');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var routeBuilder = require('express-routebuilder');
var cors = require('cors');
var logger = require('morgan');
var nunjucks = require('nunjucks');
var dotenv = require('dotenv');
var env = path.join(__dirname, '..', '.env');

var modulePath = path.join(__dirname, 'modules');
var resources = fs.readdirSync(modulePath);

var auth = require('./controllers/auth');

var app = express();
var API = require('./classes/api');

var corsOptions = {
  origins: '*', // restrict it to the required domain
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-type,Accept,X-Access-Token,X-Key',
  maxAge: 3600
};

// load up .env file
if (fs.existsSync(env)){
    dotenv.load();
}

// view engine setup for emails
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (process.env.NODE_ENV === 'production') {
  app.use(logger('common', { skip: function(req, res) { return res.statusCode < 400; }, stream: __dirname + '/../app_errors.log' }));
} else {
  app.use(logger('dev'));
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
  type: ['application/json', 'application/vnd.api+json']
}));


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
resources.forEach(function (resource) {
  API.register(resource);
  app.use(API.endpoint(resource));
});

app.get('/v1', function (request, response) {
  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify(API.index(), null, 2));
});

app.get('/', function (request, response) {
  response.redirect('/v1');
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
//app.all('/api/v1/*', auth.requireToken);
app.all('/v1/*');

app.use('/', require('./public/routes'));

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
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
