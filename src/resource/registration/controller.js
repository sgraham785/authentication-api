import uuid from 'uuid'
import model from './model'
import Mailer from '../../middleware/mailer'

// register new login credentials;
// curl --data "first_name=Sean&last_name=Graham&email=sgraham785\+1@gmail.com&password=temp123" http://127.0.0.1:3000/registration
export const register = (req, res) => {
  // Set data for insertion
  const data = {
    uuid: uuid.v4(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    email_code: Math.random().toString(36).slice(-8)
  }

  model.registration(data)
    .then(user => {
      console.log(user)
      // set email data for mailer
      const mail = {
        email: user.get('email'),
        subject: 'Please Verify Your Email',
        name: `${user.get('first_name')} ${user.get('last_name')}`,
        link: `http://${req.get('host')}/verify/${user.get('code')}`
      }

      Mailer('verify_registration', mail, (err, message) => {
        if (err) {
          // handle error
          console.log(err)
          res.send('There was an error sending the email')
          return
        }
        return message
      })
      res.json({
        error: false,
        data: {
          id: user.get('id'),
          first_name: user.get('first_name'),
          email: user.get('email')
        }
      })

      console.log(
        `User ${data.email} signed up. Verify with http://${req.get(
          'host'
        )}/verify/${data.code}`
      )
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: true, data: { message: err.message } })
    })
}

export const verify = (req, res) => {
  // Grab ids from URL parameters
  const code = req.params.code

  model.forge({
    code
  })
    .fetch()
    // TODO: check if already verified, if it matters
    .then(verify => {
      verify.save({ verified: true }, { patch: true }).then(() => {
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
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: true, data: { message: err.message } })
    })
}
