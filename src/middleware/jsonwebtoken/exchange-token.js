import jwt from 'jsonwebtoken'
import shortid from 'shortid'
import error from 'clickberry-http-errors'
import config from 'clickberry-config'
import Signature from '../lib/signature'
const signature = new Signature(config.get('token:exchangeSecret'))

function create(req, res, next) {
  const token = shortid.generate()
  const exchangePayload = createExchangePayload(req.user, token)

  res.locals.exchangeToken = createJwtToken(exchangePayload)
  res.cookie('exchangeTokenCookie', signature.sign(token), { httpOnly: true })

  next()
}

function check(req, res, next) {
  if (!req.cookies) {
    return next(new error.Forbidden())
  }

  const result = signature.verify(req.token, req.cookies.exchangeTokenCookie)
  if (!result) {
    return next(new error.Forbidden())
  }

  next()
}

function clear(req, res, next) {
  res.clearCookie('exchangeTokenCookie')

  next()
}

export { create }
export { check }
export { clear }

function createExchangePayload(user, token) {
  return {
    userId: user._id,
    token
  }
}

function createJwtToken(payload) {
  const exchangeSecret = config.get('token:exchangeSecret')
  const exchangeTimeout = config.getInt('token:exchangeTimeout')
  return jwt.sign(payload, exchangeSecret, { expiresIn: exchangeTimeout })
}
