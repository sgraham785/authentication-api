var fs = require('fs')
var path = require('path')
var express = require('express')
var favicon = require('serve-favicon')
var nunjucks = require('nunjucks')
var swaggerJSDoc = require('swagger-jsdoc')
require('../logging')

var jwtVerify = require('./middleware/jsonwebtoken/verify')
var API = require('./middleware/base/api')

var app = express()
app.disable('x-powered-by')

app.use(favicon(path.resolve(__dirname, 'views/favicon.ico')))

// view engine setup for emails
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

if (process.env.NODE_ENV === 'development') {
  var swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Todo API', // Title (required)
        version: '1.0.0' // Version (required)
      }
    },
    apis: [ // Path to the API docs
      path.resolve(__dirname, 'resources/private/**/routes.js'),
      path.resolve(__dirname, 'resources/public/**/routes.js')
    ]
  }

  var swaggerSpec = swaggerJSDoc(swaggerOptions)

  app.get('/api-docs.json', function (request, response) {
    response.setHeader('Content-Type', 'application/json')
    response.send(swaggerSpec)
  })
}

// URI handling
app.get('/', function (request, response) {
  response.redirect('/v1')
})

app.get('/v1', function (request, response) {
  response.set('Content-Type', 'application/json')
  response.send(JSON.stringify(API.index(), null, 2))
})

app.all('/v1/public/*')
process.env.NODE_ENV === 'development' ? app.all('/v1/private/*') : app.all('/v1/private/*', jwtVerify)

// Register & use declared resource naming
var resourcesPath = path.join(__dirname, 'resources')
var resourceTypes = fs.readdirSync(resourcesPath)

resourceTypes.forEach(function (resourceType) {
  var resourcesTypePath = path.join(resourcesPath, resourceType)
  var resources = fs.readdirSync(resourcesTypePath)
  resources.forEach(function (resource) {
    API.register(resource)
    app.use(API.endpoint(resource))
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

module.exports = app
