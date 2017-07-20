import jwt from '../jwt'

export default (req, res, next) => {
  // Check that the client request is encrypted
  if (!req.client.encrypted) {
    return res.status(401)
      .send({ error: true, message: 'Client sent plain text' })
  }
  if (!req.headers.authorization && process.env.NODE_ENV === 'development') {
    req.headers.authorization = `Bearer ${jwt.sign()}`
  }
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    let token = req.headers.authorization.split(' ')[1]
    jwt.verify(token)
    next()
  } else {
    return res.status(401)
      .send({ error: true, message: 'Authorization failed' })
  }
}
