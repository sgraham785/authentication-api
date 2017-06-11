import jwt from 'jsonwebtoken'
import shortid from 'shortid'
import error from 'clickberry-http-errors'
import config from 'clickberry-config'

function create (req, res, next) {
  const user = req.user
  const refreshPayload = createRefreshPayload(user)

  user.refreshTokens = user.refreshTokens || []

    // delete token if quantity is overflow
  const maxSessions = config.getInt('token:maxSessions') || 10
  if (user.refreshTokens.length >= maxSessions) {
    user.refreshTokens.shift()
  }

    // add new token
  user.refreshTokens.push(refreshPayload.token)

  res.locals.refreshToken = createRefreshToken(refreshPayload)
  next()
}

function check (req, res, next) {
  const user = req.user
  const token = req.token

  const isExist = user.refreshTokens.some(item => item === token)

  if (isExist) {
    next()
  } else {
    const err = new error.Unauthorized()
    next(err)
  }
}

function remove (req, res, next) {
  const user = req.user
  const token = req.token

  user.refreshTokens = user.refreshTokens || []

    // remove token
  user.refreshTokens.some((item, i, array) => {
    if (item === token) {
      array.splice(i, 1)
      return true
    }
    return false
  })

  next()
}

function removeAll (req, res, next) {
  const user = req.user
  user.refreshTokens = []

  next()
}

export {create}
export {check}
export {remove}
export {removeAll}

function createRefreshPayload (user) {
  return {
    token: shortid.generate(),
    userId: user._id
  }
}

function createRefreshToken (payload) {
  const refreshSecret = config.get('token:refreshSecret')
  const refreshTimeout = config.getInt('token:refreshTimeout')
  return jwt.sign(payload, refreshSecret, {expiresIn: refreshTimeout})
}
