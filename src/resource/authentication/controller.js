import Promise from 'bluebird'
import model from './model'

// const app = require('express')()
// const Encrypt = Promise.promisifyAll(require('../models/Encrypt'))

// get JWT token for login credentials
export const login = (req, res) => {
  console.log(req)
  if (!req.body.email || !req.body.password) {
    return res.status(400)
      .json({ error: true, data: { message: 'You must provide email, password and name' } })
  }
  const data = {
    email: req.body.email,
    password: req.body.password
  }

  model.login(data.email, data.password)
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
    })
    .catch(model.NotFoundError, () => {
      res.status(422)
        .json({ error: true, data: { message: `${data.email} not found` } })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: true, data: { message: err.message } })
    })
}
