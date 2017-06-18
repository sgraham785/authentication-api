import fs from 'fs'
import path from 'path'
import express from 'express'
import favicon from 'serve-favicon'
import swagger from 'swagger-jsdoc'
import jwtVerify from './middleware/jsonwebtoken/verify'
import { authorizeRequest } from './middleware/authorization'
require('./middleware/logger')

/**
 * TODOs:
 * - Validate request is from https
 * - Validate authorized request
 * - Set session & JWT to REDIS
 */

export const app = express()
app.disable('x-powered-by')

app.use(favicon(path.resolve(__dirname, 'views/favicon.ico')))

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
  response.redirect('/v1')
})

app.get('/v1', (request, response) => {
  response.set('Content-Type', 'application/json')
  response.send(200, 'Here and healthy!')
})

process.env.NODE_ENV === 'development'
  ? app.all('/v1/private/*')
  : app.all('/v1/private/*', authorizeRequest)

// Register & use declared resource naming
const resources = fs.readdirSync(path.join(__dirname, 'resources'))
resources.forEach(resource => {
  console.log(resource)
  // API.register(resource)
  // app.use(API.endpoint(resource))
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})
