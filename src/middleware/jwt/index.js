import fs from 'fs'
import path from 'path'
import jsonwebtoken from 'jsonwebtoken'
const privateKey = fs.readFileSync(path.resolve(__dirname, './pem/jwt.key'), 'utf8')
const certificate = fs.readFileSync(path.resolve(__dirname, './pem/jwt.crt'), 'utf8')

export default {
  verify: token => jsonwebtoken.verify(token, certificate),
  sign: claims => {
    if (!claims) claims = { valid: true }
    return jsonwebtoken.sign({ claims }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1m'
    })
  }
}
