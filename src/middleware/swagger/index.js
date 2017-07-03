import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  info: {
    title: 'Authentication API', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'An Auth API' // Description (optional)
  }
  // host: host, // Host (optional)
  // basePath: '/', // Base path (optional)
}

// Options for the swagger docs
let options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: [
    path.resolve(__dirname, '../../resource/**/routes.js')
  ]
}

// Initialize & export swagger-jsdoc -> returns validated swagger spec in json format
export const swaggerSpec = swaggerJSDoc(options)
