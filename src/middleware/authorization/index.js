// require an auth-token middleware
export const authorizeRequest = (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1]
  }

  if (req.body && req.body.token) {
    token = req.body.token
  }

  if (!token) {
    return res.status(401).send({ status: 401, message: 'Token not set.' })
  }

  jwt.verify(token, (err, data) => {
    if (err) { return res.status(401).send({ status: 401, message: err }) }
    req.user = data.claims.user
    delete req.user.password
    next()
  })
}
