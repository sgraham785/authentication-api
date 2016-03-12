var dirnames = __dirname.split(require("path").sep)
var thisFolderName = dirnames.pop();
var parentFolderName = dirnames.pop();

var API = require('../../../classes/api');

module.exports = new API.Controller({
  model: require('./model'),
  basePath: parentFolderName + '/' + thisFolderName
});
