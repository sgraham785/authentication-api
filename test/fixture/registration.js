import uuid from 'uuid'
import randomString from '../../src/util/randomString'

export const registationObj = {
  uuid: uuid.v4(),
  first_name: 'John',
  last_name: 'Smith',
  email: 'example@email.com',
  password: 's3cur3Pa$$word',
  email_code: randomString(16)
}
