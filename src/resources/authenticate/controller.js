import Promise from 'bluebird'
import Model from '../models/User'
import { genCode } from '../models/Verify'
import { sendOne as Mailer } from '../mailer'

const app = require('express')()
const Encrypt = Promise.promisifyAll(require('../models/Encrypt'))

const authController = {

  // get JWT token for login credentials
  login (req, res) {
    const data = {
      email: req.body.email,
      password: req.body.password
    }

    Model.User.login(data.email, data.password)
      .then(user => {
        // remove sensitive info from JWT
        // delete user.attributes.email;
        delete user.get('password')

        // create JWT
        jwt.sign({ user }, (err, token) => {
          if (err) {
            return res.status(500).send({ status: 500, message: err.message })
          }
          return res.send({ token })
        })

        // TODO: redirect to todo index
        // res.status(200);
        // res.redirect('/todos');
      }).catch(Model.User.NotFoundError, () => {
        res.status(400).json({ error: true, data: { message: `${data.email} not found` } })
      }).catch(err => {
        console.error(err)
        res.status(500).json({ error: true, data: { message: err.message } })
      })
  },

  // register new login credentials;
  // curl --data "first_name=Sean&last_name=Graham&email=sgraham785\+1@gmail.com&password=temp123" http://127.0.0.1:3000/register
  register (req, res) {
    // Set data for insertion
    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      code: genCode()
    }

    Model.User.register(data)
      .then(user => {
        // set email data for mailer
        const locals = {
          email: user.get('email'),
          subject: 'Please Verify Your Email',
          name: `${user.get('first_name')} ${user.get('last_name')}`,
          link: `http://${req.get('host')}/verify/${user.get('code')}`
        }
        Mailer('verify_registration', locals, (err, message) => {
          if (err) {
            // handle error
            console.log(err)
            res.send('There was an error sending the email')
            return
          }
          return message
        })
        res.json({ error: false, data: { id: user.get('id') } })

        console.log(`User ${data.email} signed up. Verify with http://${req.get('host')}/verify/${data.code}`)
      }).catch(err => {
        console.error(err)
        res.status(500).json({ error: true, data: { message: err.message } })
      })
  },

  // verify a user
  verify (req, res) {
    // Grab ids from URL parameters
    const code = req.params.code

    Model.User.forge({
      code
    })
      .fetch()
      // TODO: check if already verified, if it matters
      .then(verify => {
        verify.save({ verified: true }, { patch: true })
          .then(() => {
            // TODO: send welcome email
            // redirect to login or set authentication
            // res.json({error: false, data: {message: 'You\'ve been verified!'}});
            res.status(200)
            res.redirect('/signin')
            // res.json({error: false, data: {message: 'You\'ve been verified!'}});
          })
      })
      .otherwise(err => {
        res.status(500).json({ error: true, data: { message: err.message } })
      })
  },
  // TODO: reissue verification
  // request a verify-reissue
  reissue (req, res) {

  },
  // TODO: logout
  // request a verify-reissue
  logout (req, res) {

  }
}

export default authController
