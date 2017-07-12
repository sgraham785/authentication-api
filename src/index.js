import fs from 'fs'
import path from 'path'
import express from 'express'
import redis from 'redis'
import favicon from 'serve-favicon'
import cookieSession from 'express-session'
import jwtSession from 'jwt-redis-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import csurf from 'csurf'
import logger from 'morgan'
import https from 'https'
import { } from 'dotenv'
import Oy from 'oy-vey'
import React from 'react'
import VerificationEmail from './views/email/templates/verification'
import { corsOptions } from './config/cors'
import csp from './config/csp'
import { csurfFunc } from './middleware/csurf'
import { swaggerSpec } from './middleware/swagger'
import router from './middleware/router'
import convertGlobPaths from './util/convertGlobPaths'
import { authorizeRequest } from './middleware/authorization'
require('./middleware/logger')

const privateKey = fs.readFileSync('sslcert/server.key', 'utf8')
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8')
const credentials = { key: privateKey, cert: certificate }

const jwtKey = fs.readFileSync('./middleware/jsonwebtoken/pem/jwt.key', 'utf8')
const jwtCert = fs.readFileSync('./middleware/jsonwebtoken/pem/jwt.crt', 'utf8')

const host = process.env.SERVER_HOST || 'localhost'
const port = process.env.SERVER_port || '8443'
const env = process.env.NODE_ENV || 'development'

/**
 * TODOs:
 * - Validate request is from https
 * - Validate authorized request
 * - Fix logging
 */

export let app = express()
app.disable('x-powered-by')

app.use(favicon(path.resolve(__dirname, '../public/favicon.ico')))
// Setup Pug view engine for error pages
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../public/views'))

// ======== *** BODY-PARSER MIDDLEWARE ***
app.use(bodyParser.json({ type: ['application/json'] }))

// ======== *** SESSION MIDDLEWARE ***
app.use(
  cookieSession({
    secret: process.env.SESSION_SECRET,
    // store: ,
    resave: false,
    saveUninitialized: true,
    expires: new Date(Date.now() + 3600000), // 1 Hour
    cookie: { httpOnly: true, secure: true }
  })
)

app.use(
  jwtSession({
    client: redis.createClient({ host: process.env.REDIS_HOST }),
    secret: jwtKey,
    keyspace: 'sess:',
    maxAge: 86400,
    algorithm: 'HS256',
    requestKey: 'session',
    requestArg: 'accessToken'
  })
)

// ======== *** CORS MIDDLEWARE ***
app.use(cors(corsOptions))

// ======== *** SECURITY MIDDLEWARE ***
app.use(helmet())
app.use(helmet.contentSecurityPolicy(csp))

// TODO: remove CSURF, no point if only JSON api
// ======== *** CSURF MIDDLEWARE ***
if (process.env.NODE_ENV !== 'development') {
  app.use(csurf({ value: csurfFunc }))

  app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    res.locals.csrftoken = req.csrfToken()
    next()
  })
}

// ======== *** SWAGGER JSDOC MIDDLEWARE ***
if (process.env.NODE_ENV === 'development') {
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

// ======== *** EMAIL VIEW ROUTES ***
if (process.env.NODE_ENV === 'development') {
  app.get('/email/verification', (req, res) => {
    const html = Oy.renderTemplate(<VerificationEmail />, {
      title: 'This is an example',
      previewText: 'This is an example',
      bgColor: '#f7f7f7'
    })

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.send(html)
  })
}

// ======== *** SETUP RESOURCE ROUTING ***
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
      stream: path.resolve(__dirname, '../app_errors.log')
    })
  )
}

app = https.createServer(credentials, app)
app.listen(port, host)
console.log('Server running on, %s:%d. NODE_ENV = %s', host, port, env)
