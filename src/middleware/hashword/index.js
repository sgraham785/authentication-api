import bcrypt from 'bcryptjs-then'

export const encrypt = (text) => {
  console.log(text)
  return bcrypt.hash(text, 10).then(hash => {
    console.log(`hashed --> ${hash}`)
    return hash
  }).catch(err => {
    console.error(JSON.stringify(err))
  })
}

export const compare = (text, hash) => {
  bcrypt.compare(text, hash).then(valid => {
    return valid
  }).catch(err => {
    console.error(JSON.stringify(err))
  })
}
