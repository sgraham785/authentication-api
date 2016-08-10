require('dotenv').config()
require('./logging')
var path = require('path')
var express = require('express')
var methodOverride = require('method-override')
var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var cors = require('cors')
var helmet = require('helmet')
var csurf = require('csurf')
var logger = require('morgan')
var jade = require('jade')

var host = process.env.APP_HOST || 'localhost'
var port = process.env.APP_PORT || '8080'
var env = process.env.NODE_ENV || 'development'

var server = express()

// set views and engine for errors
server.set('views', __dirname + '/source/views')
server.set('view engine', 'jade')

server.use(methodOverride())

server.use(bodyParser.urlencoded({
  extended: false,
  type: 'application/x-www-form-urlencoded'
}))
server.use(bodyParser.json({
  type: [ 'application/json', 'application/vnd.api+json' ]
}))

// setup express sessions
server.use(cookieParser())
server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  expires: new Date(Date.now() + 3600000), // 1 Hour
  cookie: { httpOnly: true, secure: true }
}))

var corsOptions = {
  origins: '*', // restrict it to the required domain
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-type,Accept,X-Access-Token,X-Key',
  maxAge: 3600
}
// Enable ALL CORS for requests
server.use(cors(corsOptions))
// Fix res for OPTIONS CORS
server.all('/*', function (req, res, next) {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

// ======== *** SECURITY MIDDLEWARE ***

server.use(helmet())

// setting CSP
var scriptSources = [ 'self', 'unsafe-inline', 'unsafe-eval', 'ajax.googleapis.com', 'www.google-analytics.com' ]
var styleSources = [ 'self', 'unsafe-inline', 'ajax.googleapis.com' ]
var connectSources = [ 'self' ]

server.use(helmet.contentSecurityPolicy({
  defaultSrc: [ 'self' ],
  scriptSrc: scriptSources,
  styleSrc: styleSources,
  connectSrc: connectSources,
  reportOnly: false,
  setAllHeaders: false,
  safari5: false
}))

if (process.env.NODE_ENV !== 'development' || process.env.NODE_ENV === 'production') {
  // CSURF
  console.log('ADDING CSURF: true')
  var valueFunction = function (req) {
    var result = (req.body && req.body._csrf) ||
      (req.query && req.query._csrf) ||
      (req.cookies && req.cookies[ 'XSRF-TOKEN' ]) ||
      (req.headers[ 'csrf-token' ]) ||
      (req.headers[ 'xsrf-token' ]) ||
      (req.headers[ 'x-csrf-token' ]) ||
      (req.headers[ 'x-xsrf-token' ])

    return result
  }

  server.use(csurf({ value: valueFunction }))

  server.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    res.locals.csrftoken = req.csrfToken()
    next()
  })
} else {
  console.log('ADDING CSURF: false')
}

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  server.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
  server.use(logger('dev'))
} else {
  // production error handler
  // no stacktraces leaked to user
  server.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })
  server.use(logger('common', {
    skip: function (req, res) {
      return res.statusCode < 400
    },
    stream: path.resolve(__dirname, '/../app_errors.log')
  }))
}

server.use(require('./source'))

server.listen(port, host)

console.log('Server running on, %s:%d. NODE_ENV = %s', host, port, env)

module.exports = server
