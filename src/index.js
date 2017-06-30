import fs from 'fs'
import path from 'path'
import express from 'express'
import favicon from 'serve-favicon'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import csurf from 'csurf'
import logger from 'morgan'
import https from 'https'
import { } from 'dotenv'
import swagger from 'swagger-jsdoc'
import router from './middleware/router'
import convertGlobPaths from './util/convertGlobPaths'
import jwtVerify from './middleware/jsonwebtoken/verify'
import { authorizeRequest } from './middleware/authorization'
require('./middleware/logger')

const privateKey = fs.readFileSync('sslcert/server.key', 'utf8')
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}

const host = process.env.SERVER_HOST || 'localhost'
const port = process.env.SERVER_port || '8443'
const env = process.env.NODE_ENV || 'development'

/**
 * TODOs:
 * - Validate request is from https
 * - Validate authorized request
 * - Set session & JWT to REDIS
 */

export let app = express()
app.disable('x-powered-by')

app.use(favicon(path.resolve(__dirname, 'views/favicon.ico')))

// ======== *** BODY-PARSER MIDDLEWARE ***
app.use(
  bodyParser.urlencoded({
    extended: false,
    type: 'application/x-www-form-urlencoded'
  })
)
app.use(
  bodyParser.json({
    type: ['application/json', 'application/vnd.api+json']
  })
)

// ======== *** SESSION MIDDLEWARE ***
// TODO: implement session store:
// https://www.npmjs.com/package/connect-session-knex
// https://www.npmjs.com/package/connect-redis
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // store: ,
    resave: false,
    saveUninitialized: true,
    expires: new Date(Date.now() + 3600000), // 1 Hour
    cookie: {httpOnly: true, secure: true}
  })
)

// ======== *** CORS MIDDLEWARE ***
// TODO: fix multi origin
// var corsWhitelist = ['localhost', 'http://example2.com']

// Set CORS
app.use(
  cors({
    origin: host,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD'],
    allowedHeaders: ['Content-type', 'Accept', 'X-Access-Token', 'X-Key'],
    credentials: true,
    maxAge: 3600
  })
)

// ======== *** SECURITY MIDDLEWARE ***
app.use(helmet())
// set CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'localhost'],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'ajax.googleapis.com',
        'www.google-analytics.com'
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'ajax.googleapis.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"]
    },
    // This module will detect common mistakes in your directives and throw errors
    // if it finds any. To disable this, enable "loose mode".
    loose: false,

    // Set to true if you only want browsers to report errors, not block them.
    // You may also set this to a function(req, res) in order to decide dynamically
    // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
    reportOnly: false,

    // Set to true if you want to blindly set all headers: Content-Security-Policy,
    // X-WebKit-CSP, and X-Content-Security-Policy.
    setAllHeaders: false,

    // Set to true if you want to disable CSP on Android where it can be buggy.
    disableAndroid: false,

    // Set to false if you want to completely disable any user-agent sniffing.
    // This may make the headers less compatible but it will be much faster.
    // This defaults to `true`.
    browserSniff: true
  })
)

// ======== *** CSURF MIDDLEWARE ***
const valueFunction = req => {
  const result =
    (req.body && req.body._csrf) ||
    (req.query && req.query._csrf) ||
    (req.cookies && req.cookies['XSRF-TOKEN']) ||
    req.headers['csrf-token'] ||
    req.headers['xsrf-token'] ||
    req.headers['x-csrf-token'] ||
    req.headers['x-xsrf-token']

  return result
}
// set CSURF
app.use(csurf({value: valueFunction}))

app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.locals.csrftoken = req.csrfToken()
  next()
})

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
  app.use(logger('dev'))
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })
  app.use(
    logger('common', {
      skip (req, res) {
        return res.statusCode < 400
      },
      stream: path.resolve(__dirname, '/../app_errors.log')
    })
  )
}
// TODO: Abtract to ./middleware
// Setup Swagger on Development
if (process.env.NODE_ENV === 'development') {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Authentication API', // Title (required)
        version: '1.0.0' // Version (required)
      }
    },
    apis: [
      // Path to the API docs
      path.resolve(__dirname, 'resources/**/routes.js')
    ]
  }

  const swaggerSpec = swagger(swaggerOptions)

  app.get('/api-docs.json', (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    response.send(swaggerSpec)
  })
}

// URI handling
app.get('/', (request, response) => {
  response.set('Content-Type', 'application/json')
  response.status(200).send('Here and healthy!')
})

process.env.NODE_ENV === 'development'
  ? app.all('/*')
  : app.all('/*', authorizeRequest)

let routePaths = convertGlobPaths([path.resolve(__dirname, 'resource/**/routes.js')])

router(app, routePaths)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app = https.createServer(credentials, app)
app.listen(port, host)
console.log('Server running on, %s:%d. NODE_ENV = %s', host, port, env)
