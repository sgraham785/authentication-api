const jwt = module.exports = { }

import fs from 'fs'
import path from 'path'
import jsonwebtoken from 'jsonwebtoken'
const privateKey = fs.readFileSync(path.join(__dirname, '../../sslcerts/jwt.key'), 'utf8')
const certificate = fs.readFileSync(path.join(__dirname, '../../sslcerts/jwt.crt'), 'utf8')

jwt.verify = token => jsonwebtoken.verify(token, certificate)
jwt.sign = data => {
  if (!data) data = {id: 'test'}
  return jsonwebtoken.sign({ data }, privateKey, { algorithm: 'RS256', expiresIn: '1h' })
}
