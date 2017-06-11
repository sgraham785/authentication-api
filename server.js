import fs from 'fs'
import path from 'path'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import csurf from 'csurf'
import logger from 'morgan'
import https from 'https'
import { } from 'dotenv'

const privateKey = fs.readFileSync('sslcert/server.key', 'utf8')
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8')
const credentials = { key: privateKey, cert: certificate }

const host = process.env.SERVER_HOST || 'localhost'
const port = process.env.SERVER_port || '8443'
const env = process.env.NODE_ENV || 'development'

let server = express()
server.disable('x-powered-by')

// ======== *** BODY-PARSER MIDDLEWARE ***
server.use(bodyParser.urlencoded({
  extended: false,
  type: 'application/x-www-form-urlencoded'
}))
server.use(bodyParser.json({
  type: [ 'application/json', 'application/vnd.api+json' ]
}))

// ======== *** SESSION MIDDLEWARE ***
// TODO: implement session store:
// https://www.npmjs.com/package/connect-session-knex
// https://www.npmjs.com/package/connect-redis
server.use(session({
  secret: process.env.SESSION_SECRET,
  // store: ,
  resave: false,
  saveUninitialized: true,
  expires: new Date(Date.now() + 3600000), // 1 Hour
  cookie: { httpOnly: true, secure: true }
}))

// ======== *** CORS MIDDLEWARE ***
// TODO: fix multi origin
// var corsWhitelist = ['localhost', 'http://example2.com']

// Set CORS
server.use(cors({
  origin: host,
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD'],
  allowedHeaders: ['Content-type', 'Accept', 'X-Access-Token', 'X-Key'],
  credentials: true,
  maxAge: 3600
}))

// ======== *** SECURITY MIDDLEWARE ***
server.use(helmet())
// set CSP
server.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [ "'self'" ],
    scriptSrc: [ "'self'", "'unsafe-inline'", "'unsafe-eval'",
      'ajax.googleapis.com', 'www.google-analytics.com' ],
    styleSrc: [ "'self'", "'unsafe-inline'", 'ajax.googleapis.com' ],
    imgSrc: [ "'self'", 'data:' ],
    connectSrc: [ "'self'" ],
    reportOnly: false,
    setAllHeaders: false,
    safari5: false
  }
}))

// ======== *** CSURF MIDDLEWARE ***
const valueFunction = req => {
  const result = (req.body && req.body._csrf) ||
    (req.query && req.query._csrf) ||
    (req.cookies && req.cookies[ 'XSRF-TOKEN' ]) ||
    (req.headers[ 'csrf-token' ]) ||
    (req.headers[ 'xsrf-token' ]) ||
    (req.headers[ 'x-csrf-token' ]) ||
    (req.headers[ 'x-xsrf-token' ])

  return result
}
// set CSURF
server.use(csurf({ value: valueFunction }))

server.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.locals.csrftoken = req.csrfToken()
  next()
})

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  server.use((err, req, res, next) => {
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
  server.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })
  server.use(logger('common', {
    skip (req, res) {
      return res.statusCode < 400
    },
    stream: path.resolve(__dirname, '/../app_errors.log')
  }))
}

server.use(require('./src'))

server = https.createServer(credentials, server)
server.listen(port, host)
console.log('Server running on, %s:%d. NODE_ENV = %s', host, port, env)

export default server
