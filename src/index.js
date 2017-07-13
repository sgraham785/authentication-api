import fs from 'fs'
import path from 'path'
import express from 'express'
import redis from 'redis'
import favicon from 'serve-favicon'
import jwtSession from 'jwt-redis-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'morgan'
import https from 'https'
import { } from 'dotenv'
import Oy from 'oy-vey'
import React from 'react'
import VerificationEmail from './views/email/templates/verification'
import { corsOptions } from './config/cors'
import csp from './config/csp'
import { swaggerSpec } from './middleware/swagger'
import router from './middleware/router'
import convertGlobPaths from './util/convertGlobPaths'
import { authorizeRequest } from './middleware/authorization'
import clientCertificateAuth from 'client-certificate-auth-v2'
require('./middleware/logger')

const privateKey = fs.readFileSync('sslcert/server.key', 'utf8')
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8')
const ssl = { key: privateKey, cert: certificate }

const jwtKey = fs.readFileSync(path.resolve(__dirname, './middleware/jsonwebtoken/pem/jwt.key'), 'utf8')
// const jwtCert = fs.readFileSync('./middleware/jsonwebtoken/pem/jwt.crt', 'utf8')

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

// ======== *** CORS MIDDLEWARE ***
app.use(cors(corsOptions))

// ======== *** SECURITY MIDDLEWARE ***
app.use(helmet())
app.use(helmet.noCache())
app.use(helmet.contentSecurityPolicy(csp))

app.disable('x-powered-by')

app.use(favicon(path.resolve(__dirname, '../public/favicon.ico')))
// Setup Pug view engine for error pages
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../public/views'))

// ======== *** BODY-PARSER MIDDLEWARE ***
app.use(bodyParser.json({ type: ['application/json'] }))

// ======== *** SESSION MIDDLEWARE ***
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
    console.log(req.connection.getPeerCertificate())
    const html = Oy.renderTemplate(<VerificationEmail />, {
      title: 'This is an example',
      previewText: 'This is an example',
      bgColor: '#f7f7f7'
    })
    res.send(html)
  })
}

// ======== *** SETUP RESOURCE ROUTING ***
const checkCert = (cert) => {
  /*
   * allow access if certificate subject Common Name is 'Doug Prishpreed'.
   * this is one of many ways you can authorize only certain authenticated
   * certificate-holders; you might instead choose to check the certificate
   * fingerprint, or apply some sort of role-based security based on e.g. the OU
   * field of the certificate. You can also link into another layer of
   * auth or session middleware here; for instance, you might pass the subject CN
   * as a username to log the user in to your underlying authentication/session
   * management layer.
   */
  console.log(cert)
  // return cert.subject.CN === 'Doug Prishpreed'
}
// app.use(clientCertificateAuth(checkCert))
process.env.NODE_ENV === 'development'
  ? app.all('/*')
  : app.all('/v*', clientCertificateAuth(checkCert))

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

app = https.createServer(ssl, app)
app.listen(port, host)
console.log('Server running on, %s:%d. NODE_ENV = %s', host, port, env)
