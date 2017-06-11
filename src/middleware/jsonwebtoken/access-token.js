import jwt from 'jsonwebtoken'
import config from 'clickberry-config'

export function create (req, res, next) {
  const user = req.user
  const accessPayload = createAccessPayload(user)

  res.locals.accessToken = createAccessToken(accessPayload)
  next()
}

export function verify (tokenName) {
  return (req, res, next) => {
    jwt.verify(req.body[tokenName], config.get('token:accessSecret'), (err, payloud) => {
      if (err) { return next(err) }

      req.tokens = req.tokens || {}
      req.tokens[tokenName] = payloud

      next()
    })
  }
}

function createAccessPayload (user) {
  return {
    userId: user._id,
    role: user.role
  }
}

function createAccessToken (payload) {
  const accessSecret = config.get('token:accessSecret')
  const accessTimeout = config.getInt('token:accessTimeout')
  return jwt.sign(payload, accessSecret, {expiresIn: accessTimeout})
}
