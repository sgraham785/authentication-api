import bcrypt from 'bcryptjs'

export const encrypt = (text, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err)

    bcrypt.hash(text, salt, (err, hashed) => callback(err, hashed))
  })
}

export const compare = (text, hashed, callback) => {
  bcrypt.compare(text, hashed, (err, isMatch) => {
    if (err) {
      return callback(err)
    }
    return callback(null, isMatch)
  })
}
