import fs from 'fs'
import jsonwebtoken from 'jsonwebtoken'
const privateKey = fs.readFileSync('./pem/jwt.key', 'utf8')
const certificate = fs.readFileSync('./pem/jwt.crt', 'utf8')

export const jwt = (module.exports = {})

jwt.verify = token => jsonwebtoken.verify(token, certificate)
jwt.sign = data => {
  if (!data) data = { id: 'test' }
  return jsonwebtoken.sign({ data }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1h'
  })
}
