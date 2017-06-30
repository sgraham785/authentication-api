import Promise from 'bluebird'
import Joi from 'joi'
import { bookshelf } from '../../middleware/database'
import hashword from '../../middleware/hashword'
import schema from './schema'

// Promise.promisifyAll(hashword)

export default bookshelf.Model.extend(
  {
    tableName: 'users',
    hasTimestamps: true,

    initialize () {
      this.on('saving', this.validateSave)
    },
    validateSave () {
      return Joi.validate(`{ ${this.attributes} }`, schema)
    }
  },
  {
    // Validate and login user
    login: Promise.method(function (email, password) {
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
    })
  }
)
