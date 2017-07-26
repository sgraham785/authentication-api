import uuid from 'uuid'
import randomString from '../../src/util/randomString'

export const newUser = {
  uuid: uuid.v4(),
  first_name: 'New',
  last_name: 'User',
  email: 'new.user@email.com',
  password: 's3cur3Pa$$word',
  email_code: randomString(16)
}

export const existingUser = {
  uuid: uuid.v4(),
  first_name: 'Existing',
  last_name: 'User',
  email: 'existing.user@email.com',
  password: 's3cur3Pa$$word',
  email_code: randomString(16)
}
