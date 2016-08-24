var fs = require('fs')
var path = require('path')
var jwt = require('jsonwebtoken')
var certificate = fs.readFileSync(path.join(__dirname, '/pem/jwt.crt'), 'utf8')

// // verify a token asymmetric
// jwt.verify(token, certificate, function(err, decoded) {
//   console.log(decoded.foo) // bar
// })
//
//
// // verify jwt id
// jwt.verify(token, certificate, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid' }, function(err, decoded) {
//   // if jwt id mismatch, err == invalid jwt id
// })

var jwtVerify = function (req, res, next) {
  var token
  if (req.headers.authorization && req.headers.authorization.split(' ')[ 0 ] === 'Bearer') {
    token = req.headers.authorization.split(' ')[ 1 ]
  }

  if (req.body && req.body.token) {
    token = req.body.token
  }

  if (!token) {
    return res.status(401).send({ status: 401, message: 'Token not set.' })
  }

  jwt.verify(token, certificate, function (err, decoded) {
    if (err) { return res.status(401).send({ status: 401, message: err }) }
    console.log(decoded)
    next()
  })
}

module.exports = jwtVerify
