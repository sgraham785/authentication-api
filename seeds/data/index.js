var fs = require('fs')
var path = require('path')

// Load `*.json` under current directory as properties
//  i.e., `users.json` will become `exports['users']` or `exports.users`
fs.readdirSync(path.join(__dirname, '/')).forEach(function (file) {
  if (file.match(/\.js(on)?$/) !== null && file !== 'index.js') {
    var name = file.replace(/\.js(on)?$/, '')
    exports[ name ] = require('./' + file)
  }
})
