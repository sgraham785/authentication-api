import Promise from 'bluebird'
import Joi from 'joi'
import { bookshelf } from '../../middleware/database'
import hashword from '../../middleware/hashword'
import schema from './schema'

// Promise.promisifyAll(hashword)

export const model = bookshelf.Model.extend(
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
    // Register new user
    registration: Promise.method(data => {
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
          return hashword
            .hashAsync(validated.password)
            .then((hashedword, err) => {
              if (err) {
                throw new Error(
                  'A connection error occurred. Please register again.'
                )
              }
              console.log(validated)
              delete validated.password
              validated.password.push(hashedword)
              console.log(validated)
              return [validated, hashedword]
            })
        })
        .then(insertable => {
          const valid = insertable[0]
          const hashed = insertable[1]

          return model
            .forge({
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
