import uuid from 'uuid'
import randomString from '../../src/util/randomString'

export const loginUser = {
  uuid: uuid.v4(),
  first_name: 'Login',
  last_name: 'User',
  email: 'login.user@email.com',
  password: 's3cur3Pa$$word',
  email_code: randomString(16)
}

export const User = {
  uuid: uuid.v4(),
  first_name: 'Existing',
  last_name: 'User',
  email: 'existing.user@email.com',
  password: 's3cur3Pa$$word',
  email_code: randomString(16)
}
