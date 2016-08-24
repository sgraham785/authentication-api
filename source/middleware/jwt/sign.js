var fs = require('fs')
var jwt = require('jsonwebtoken')
var privateKey = fs.readFileSync('pem/jwt.key', 'utf8')

var jwtSign = function (req, res, next) {
  // sign with RSA SHA256 asynchronously
  jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function (err, token) {
    if (err) { return res.status(401).send({ status: 401, message: err }) }
    console.log(token)
  })
}

module.exports = jwtSign
