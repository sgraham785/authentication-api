import {Strategy as JwtStrategy} from 'passport-jwt'
import config from 'clickberry-config'
import User from '../../models/user'

export default passport => {
  passport.use('access-token', new JwtStrategy({
    secretOrKey: config.get('token:accessSecret')
  }, (jwtPayload, done) => {
    User.findById(jwtPayload.userId, (err, user) => {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))

  passport.use('refresh-token', new JwtStrategy({
    secretOrKey: config.get('token:refreshSecret'),
    passReqToCallback: true
  }, (req, jwtPayload, done) => {
    User.findById(jwtPayload.userId, (err, user) => {
      if (err) {
        return done(err, false)
      }
      if (user) {
        req.token = jwtPayload.token
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))

  passport.use('exchange-token', new JwtStrategy({
    secretOrKey: config.get('token:exchangeSecret'),
    passReqToCallback: true
  }, (req, jwtPayload, done) => {
    User.findById(jwtPayload.userId, (err, user) => {
      if (err) {
        return done(err, false)
      }
      if (user) {
        req.token = jwtPayload.token
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
}
