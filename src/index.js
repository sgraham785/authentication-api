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
import { corsOptions } from './middleware/cors'
import csp from './middleware/csp'
import { csurfFunc } from './middleware/csurf'
import { swaggerSpec } from './middleware/swagger'
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

app.use(favicon(path.resolve(__dirname, 'public/favicon.ico')))

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
app.use(cors(corsOptions))

// ======== *** SECURITY MIDDLEWARE ***
app.use(helmet())
app.use(helmet.contentSecurityPolicy(csp))

// ======== *** CSURF MIDDLEWARE ***
app.use(csurf({ value: csurfFunc }))

app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.locals.csrftoken = req.csrfToken()
  next()
})

// ======== *** ERROR HANDLER MIDDLEWARE ***
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

// Setup Swagger in Development
if (process.env.NODE_ENV === 'development') {
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

process.env.NODE_ENV === 'development'
  ? app.all('/*')
  : app.all('/v*', authorizeRequest)

const routePaths = convertGlobPaths([path.resolve(__dirname, 'resource/**/routes.js')])

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
