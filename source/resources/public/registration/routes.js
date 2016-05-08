var controller = require('./controller')
var schema = require('./schema')

exports.map = {
  post: {
    '/': controller.create({
      schema: schema
    })
  },
  get: {
    '/': controller.read()
  },
  patch: {
    '/verify/:code': controller.update({
      schema: schema
    })
  }
}
