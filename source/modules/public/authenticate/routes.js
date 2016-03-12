var controller = require('./controller');
var schema = require('./schema');

exports.map = {
  post: {
    '/': controller.create({
      schema: schema
    })
  }
};
