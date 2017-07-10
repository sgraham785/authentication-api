import bcrypt from 'bcryptjs-then'
import Promise from 'bluebird'
import { Auth, Info } from '../../models/users'

export const login = (req, res) => {
  if (!req.body.email || !req.body.password) return res.status(400).send({ error: true, data: { message: 'You must provide an email and password' } })

  const data = {
    email: req.body.email,
    password: req.body.password
  }

  Auth.findOne({
    email: data.email
  })
    .then(user => {
      console.log(`data.password --> ${data.password}`)
    console.log(`user.password --> ${user.password}`)  
    return bcrypt.compare(data.password, user.password)
      .then(valid => {
        return res.send(`valid --> ${valid}`)
      // set session
      }, err => {
        console.error(`Login err--> ${JSON.stringify(err)}`)
        return res.status(422)
          .send({ error: true, data: { message: 'Profile can not be validated' } })
      })
    // return res.status(400).send({ error: false, data: { message: user } })
  })
  .catch(Auth.NotFoundError, () => {
    res.status(422)
      .send({ error: true, data: { message: 'Profile not found' } })
  })
  .catch(err => {
    console.error(err)
    res.status(500).send({ error: true, data: { message: err.message } })
  })
}
