import util from 'util'
import path from 'path'
import winston from 'winston'
const logger = new winston.Logger()
let production = (process.env.NODE_ENV || '').toLowerCase() === 'production'

export default {
  middleware (req, res, next) {
    console.info(req.method, req.url, res.statusCode)
    next()
  },
  production
}

// Override the built-in console methods with winston hooks
switch ((process.env.NODE_ENV || '').toLowerCase()) {
  case 'production':
    production = true
    logger.add(winston.transports.File, {
      filename: path.join(__dirname, '/logs/application.log'),
      handleExceptions: true,
      exitOnError: false,
      level: 'warn',
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    })
    break
  case 'test':
    // Don't set up the logger overrides
    break
  default:
    logger.add(winston.transports.Console, {
      colorize: true,
      timestamp: true,
      // handleExceptions: true,
      level: 'info'
    })
    break
}

function formatArgs (args) {
  return [ util.format.apply(util.format, Array.prototype.slice.call(args)) ]
}

console.log = function () {
  logger.info(...formatArgs(arguments))
}
console.info = function () {
  logger.info(...formatArgs(arguments))
}
console.warn = function () {
  logger.warn(...formatArgs(arguments))
}
console.error = function () {
  logger.error(...formatArgs(arguments))
}
console.debug = function () {
  logger.debug(...formatArgs(arguments))
}
