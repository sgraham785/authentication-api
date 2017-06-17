import { bookshelf as Bookshelf } from '../configs/db'
import Promise from 'bluebird'
import Joi from 'joi'
import hashword from '../middleware/hashword'
import schema from './schema'

Promise.promisifyAll(hashword)

export const User = Bookshelf.Model.extend(
  {
    tableName: 'users',
    hasTimestamps: true,

    initialize() {
      this.on('saving', this.validateSave)
    },
    validateSave() {
      return Joi.validate(`{ ${this.attributes} }`, schema)
    },
    // TODO: abstract to be reusable by other models
    orderBy(column, order) {
      return this.query(qb => {
        qb.orderBy(column, order)
      })
    }
  },
  {
    // Validate and login user
    login: Promise.method(function(email, password) {
      if (!email || !password) {
        throw new Error('Email and password are both required')
      }
      return new this({ email: email.toLowerCase().trim() })
        .fetch({ require: true })
        .tap(user => {
          if (!user) {
            throw new Error('A connection error occurred. Please try again. ')
          }
          if (!user.get('verified')) throw new Error('User not verified.')

          // validate password matches
          return hashword
            .compareAsync(password, user.get('password'))
            .then((matched, err) => {
              if (err) throw new Error('Connection error. Please try again. ')
              if (!matched) {
                throw new Error(
                  'Username or Password are invalid. Please try again. '
                )
              }

              return matched
            })
        })
    }),
    // Register new user
    register: Promise.method(data => {
      if (!data) throw new Error('Fill in required fields')

      return Joi.validate(data, schema)
        .then((validated, err) => {
          if (err) {
            throw new Error(
              'A validation error occurred. Please register again.'
            )
          }

          return validated
        })
        .then(validated => {
          console.log(validated.password)
          return hashword.hashAsync(validated.password).then((hash, err) => {
            if (err) {
              throw new Error(
                'A connection error occurred. Please register again.'
              )
            }

            delete validated.password
            return [validated, hash]
          })
        })
        .then(insertable => {
          const valid = insertable[0]
          const hashed = insertable[1]

          return User.forge({
            first_name: valid.first_name,
            last_name: valid.last_name,
            email: valid.email.toLowerCase().trim(),
            password: hashed,
            code: valid.code
          })
            .save()
            .tap(user => {
              if (!user) {
                throw new Error(
                  'A connection error occurred. Please register again. '
                )
              }
            })
        })
        .catch(err => {
          console.log(err.toJSON())
        })
    })
  }
)

export const Users = Bookshelf.Collection.extend({
  model: User,
  orderBy(column, order) {
    return this.query(qb => {
      qb.orderBy(column, order)
    })
  }
})
