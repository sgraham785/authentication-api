import Promise from 'bluebird'
import Joi from 'joi'
import bcrypt from 'bcryptjs-then'
import { Auth } from '../../models/users'
import schema from './schema'

// Make schema validation a Promise
let validate = Promise.promisify(Joi.validate)
/**
 * TODOS:
 */
export const login = Promise.method((req, res) => {
  if (!req.body.email || !req.body.password) return res.status(422).send({ error: true, data: { message: 'You must provide an email and password' } })

  const data = Object.freeze({
    email: req.body.email.toLowerCase().trim(),
    password: req.body.password
  })

  validate(data, schema)
    .then(validated => {
      return Auth
        .findOne({
          email: validated.email
        })
        .then(user => {
          return bcrypt.compare(validated.password, user.get('password'))
          .then(valid => {
            // Build session data object
            let profile = {
              uuid: user.get('uuid')
            }
            // this will be stored in redis
            req.session.profile = profile

            // this will be attached to the JWT
            let claims = {
              iss: process.env.SERVER_HOST,
              aud: process.env.SERVER_HOST
            }

            req.session.create(claims, (err, token) => {
              if (err) console.error(`Set Token err --> ${err}`)
              res.status(200).send({ error: false, data: { token: token } })
            })
          }, err => {
            console.error(`Login err--> ${JSON.stringify(err)}`)
            return res.status(422)
              .send({ error: true, data: { message: 'Profile can not be validated' } })
          })
        })
        .catch(Auth.NotFoundError, () => {
          res.status(422)
            .send({ error: true, data: { message: 'Profile not found' } })
        })
    }, err => {
      console.error(`Registration Validation err--> ${JSON.stringify(err)}`)
      return res.status(422)
        .send({ error: true, data: { message: 'Please fill in all required fields' } })
    })
    .catch(err => {
      console.error(err)
      res.status(500).send({ error: true, data: { message: err.message } })
    })
})

export const refresh = (req, res) => {
  req.session.touch(err => {
    if (err) console.error(`Session refresh err --> ${err}`)
    res.status(200).send({ error: false, data: { message: req.session.toJSON() } })
  })
}

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(`Session destroy err --> ${err}`)
    res.status(200).send({ error: false, data: { message: 'You\'ve successfully been logged out!' } })
  })
}
