import bcrypt from 'bcryptjs-then'
import { Auth } from '../../models/users'

/**
 * TODOS:
 * - add better schema validation
 */
export const login = (req, res) => {
  if (!req.body.email || !req.body.password) return res.status(400).send({ error: true, data: { message: 'You must provide an email and password' } })

  const data = {
    email: req.body.email.toLowerCase().trim(),
    password: req.body.password
  }

  Auth.findOne({
    email: data.email
  })
  .then(user => {
    return bcrypt.compare(data.password, user.get('password'))
    .then(valid => {
      if (valid) {
        // Build session data object
        let profile = {
          uuid: user.get('uuid')
        }
        // this will be stored in redis
        req.jwtSession.profile = profile

        // this will be attached to the JWT
        let claims = {
          iss: process.env.SERVER_HOST,
          aud: process.env.SERVER_HOST
        }

        req.jwtSession.create(claims, (err, token) => {
          if (err) console.error(`Set Token err --> ${err}`)
          res.status(200).send({ error: false, data: { token: token } })
        })
      } else {
        return res.status(422)
          .send({ error: true, data: { message: 'Profile cannot be validated' } })
      }
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
  .catch(err => {
    console.error(err)
    res.status(500).send({ error: true, data: { message: err.message } })
  })
}

export const refresh = (req, res) => {
  req.jwtSession.touch(err => {
    if (err) console.error(`Session refresh err --> ${err}`)
    res.status(200).send({ error: false, data: { message: req.jwtSession.toJSON() } })
  })
}

export const logout = (req, res) => {
  req.jwtSession.destroy(err => {
    if (err) console.error(`Session destroy err --> ${err}`)
    res.status(200).send({ error: false, data: { message: 'You\'ve successfully been logged out!' } })
  })
}
