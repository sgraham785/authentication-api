import uuid from 'uuid'
import Promise from 'bluebird'
import Joi from 'joi'
import bcrypt from 'bcryptjs-then'
import randomString from '../../util/randomString'
import { Auth, Info } from '../../models/users'
import schema from './schema'
import Mailer from '../../middleware/mailer'

// Make schema validation a Promise
let validate = Promise.promisify(Joi.validate)
/**
 * TODOS:
 * - Delete inserted record or try again if Auth insert fails
 */

/**
 * Register new profile
 * Example: curl -k -H "Content-Type: application/json" -X POST -d '{"first_name":"John","last_name":"Smith", "email":"example@email.com","password":"s3cur3Pa$$word"}' https://0.0.0.0:8443/v1/registration
 */
export const registration = Promise.method((req, res) => {
  if (!req.body) return res.status(422).send({ error: true, data: { message: 'Missing request body' } })
  // Build registration data object
  const data = {
    uuid: uuid.v4(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    email_code: randomString(16)
  }

  validate(data, schema)
    .then(valid => {
      return bcrypt.hash(valid.password, 10).then(hash => {
        return hash
      })
      .then(hash => {
        data.password = hash
        return data
      })
    }, err => {
      console.error(`Registration Validation err--> ${JSON.stringify(err)}`)
      return res.status(422)
        .send({ error: true, data: { message: 'Please fill in all required fields' } })
    })
    .then(data => {
      return Auth
        .create({
          uuid: data.uuid,
          email: data.email.toLowerCase().trim(),
          password: data.password
        },
        { method: 'insert' })
        .then(() => {
          return Info
            .create({
              uuid: data.uuid,
              first_name: data.first_name,
              last_name: data.last_name,
              email_code: data.email_code
            })
        }, err => {
          console.error(`Hashing err--> ${JSON.stringify(err)}`)
          return res.status(422)
            .send({ error: true, data: { message: 'Something went wrong hashing' } })
        })
        .then(() => {
          // Build session data object
          let profile = {
            uuid: data.uuid,
            fist_name: data.first_name,
            last_name: data.last_name
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
          // This will block verification email from going on SQL insert error
          console.error(`Registration Insert err--> ${JSON.stringify(err)}`)
          return res.status(422)
            .send({ error: true, data: { message: 'Unable to create profile' } })
          // TODO: should delete inserted Auth record is error on Info insert, beware of email unique though, don't want to delete existing user
        })
        .then(() => {
          let timestamp = Math.round(Date.now() / 1000)
          // TODO: set this to a webpage
          let link = `https://${req.get('host')}/v1/registration/verify/${timestamp}/${data.email_code}`
          // Build mail object
          const mail = {
            email: data.email,
            subject: 'Please Verify Your Email',
            name: `${data.first_name} ${data.last_name}`,
            link
          }

          return Mailer('VerificationEmail', mail, (err, message) => {
            if (err) res.status(422).send('There was an error sending the email')
            return message
          })
        })
        .catch(err => {
          console.error(`CatchAll err --> ${err}`)
          return res.status(422)
            .send({ error: true, data: { message: 'Insert error' } })
        })
    })
    .catch(err => {
      console.error(err)
      res.status(500).send({ error: true, data: { message: err.message } })
    })
})

/**
 * TODOS:
 * - maybe send a welcome email
 */

/**
 * Verify registered email
 * Example: curl -X POST "https://0.0.0.0:8443/v1/registration/verify/1499647625/70ug5czfw2ltbj4i" -H "accept: application/json"
 */
export const verifyEmail = (req, res) => {
  // Build params object
  let data = {
    timestamp: req.params.timestamp,
    email_code: req.params.email_code
  }
  let maxTimestamp = data.timestamp + (30 * 24 * 60 * 60 * 1000)
  let nowTimestamp = Math.round(Date.now() / 1000)

  if (nowTimestamp > maxTimestamp) return res.status(422).send({ error: true, data: { message: 'Verification link is outdated' } })

  Info.findOne({
    email_code: data.email_code
  })
  .then(verify => {
    return verify.save({ email_verified: true }, { patch: true, require: true })
      .then(() => {
        res.status(200).send({ error: false, data: { message: 'You\'ve been verified!' } })
      })
    // TODO: send welcome email?
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({ error: true, data: { message: err.message } })
  })
}
