import { Strategy as LocalStrategy } from 'passport-local'
import User from '../../models/user'

export default passport => {
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      (req, email, password, done) => {
        email = email.toLowerCase()
        User.findOne(
          { 'memberships.provider': 'email', 'memberships.id': email },
          (err, user) => {
            if (err) {
              return done(err)
            }

            if (user) {
              return done(null, false)
            } else {
              const newUser = new User()
              newUser.generateHash(password, (err, hash) => {
                if (err) {
                  return done(err)
                }

                const membership = {
                  id: email,
                  provider: 'email',
                  email,
                  password: hash
                }
                newUser.role = 'user'
                newUser.memberships.push(membership)

                newUser.save(err => {
                  if (err) {
                    return done(err)
                  }

                  req.authData = {
                    membership,
                    isNewUser: true
                  }
                  return done(null, newUser)
                })
              })
            }
          }
        )
      }
    )
  )

  passport.use(
    'local-signin',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      (req, email, password, done) => {
        email = email.toLowerCase()
        User.findOne(
          {
            memberships: {
              $elemMatch: {
                provider: 'email',
                id: email
              }
            }
          },
          {
            role: 1,
            created: 1,
            refreshTokens: 1,
            'memberships.$': 1
          },
          (err, user) => {
            if (err) {
              return done(err)
            }

            if (!user) {
              return done(null, false)
            }

            const membership = user.memberships[0]
            user.validatePassword(
              password,
              membership.password,
              (err, isValid) => {
                if (err) {
                  return done(err)
                }

                if (isValid) {
                  req.authData = {
                    membership,
                    isNewUser: true
                  }
                  done(null, user)
                } else {
                  done(null, false)
                }
              }
            )
          }
        )
      }
    )
  )
}
