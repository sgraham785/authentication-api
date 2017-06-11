import {Strategy as FacebookStrategy} from 'passport-facebook'
import {Strategy as TwitterStrategy} from 'passport-twitter'
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth'
import {Strategy as GithubStrategy} from 'passport-github'
import config from 'clickberry-config'
import User from '../../models/user'

export default passport => {
  passport.use(new FacebookStrategy({
    clientID: config.get('facebook:clientID'),
    clientSecret: config.get('facebook:clientSecret'),
    callbackURL: config.getUrl('facebook:callbackURL'),
    passReqToCallback: true
  },
  (req, token, refreshToken, profile, done) => {
    getUser(profile, token, (err, user, authData) => {
      req.authData = authData
      done(err, user)
    })
  }))

  passport.use(new TwitterStrategy({
    consumerKey: config.get('twitter:consumerKey'),
    consumerSecret: config.get('twitter:consumerSecret'),
    callbackURL: config.getUrl('twitter:callbackURL'),
    passReqToCallback: true
  },
  (req, token, refreshToken, profile, done) => {
    getUser(profile, token, (err, user, authData) => {
      req.authData = authData
      done(err, user)
    })
  }))

  passport.use(new GoogleStrategy({
    clientID: config.get('google:clientID'),
    clientSecret: config.get('google:clientSecret'),
    callbackURL: config.getUrl('google:callbackURL'),
    passReqToCallback: true
  },
  (req, token, tokenSecret, profile, done) => {
    getUser(profile, token, (err, user, authData) => {
      req.authData = authData
      done(err, user)
    })
  }
    ))

  passport.use(new GithubStrategy({
    clientID: config.get('vk:clientID'),
    clientSecret: config.get('vk:clientSecret'),
    callbackURL: config.getUrl('vk:callbackURL'),
    passReqToCallback: true
  },
  (req, token, tokenSecret, profile, done) => {
    getUser(profile, token, (err, user, authData) => {
      req.authData = authData
      done(err, user)
    })
  }
    ))

  function getUser (profile, token, callback) {
    User.findOne({'memberships.provider': profile.provider, 'memberships.id': profile.id}, (err, user) => {
      if (err) {
        callback(err)
      }

      const authData = {}
      const membership = authData.membership = createMembership(profile, token)
      authData.isNewUser = false

      if (!user) {
        user = createUser(membership)
        authData.isNewUser = true
      }

      callback(err, user, authData)
    })
  }

  function createUser (membership) {
    const newUser = new User()
    newUser.role = 'user'
    newUser.memberships.push(membership)

    return newUser
  }

  function createMembership (profile, token) {
    const membership = {
      id: profile.id,
      provider: profile.provider,
      token,
      name: profile.displayName,
      email: profile.emails && profile.emails[0].value
    }
    return membership
  }
}
