import test from 'ava'
// import app from '../../index'
import { truncate } from '../../../test/helpers/truncateTables'
import { post } from '../../../test/helpers/methodHelper'
import { newUser, existingUser } from '../../../test/fixtures/registration'

// test.before(async t => {
//   return require('../../index')
// })
test.after.always('db cleanup', async t => {
  t.plan(1)
  return truncate(['users.auth']).then(() => {
    t.pass()
  })
})

test('Success: POST [new user] /v1/registration', async t => {
  t.plan(3)
  const res = await post('/v1/registration', newUser)
  const response = await res.json()
  // console.log(response)
  t.is(res.status, 200)
  t.false(response.error)
  t.truthy(response.data.token)
})

test('Error: POST [existing user] /v1/registration', async t => {
  t.plan(4)
  const res = await post('/v1/registration', existingUser).then(r => {
    t.is(r.status, 200)
    const res = post('/v1/registration', existingUser)
    return res
  })
  const response = await res.json()
  // console.log(response)
  t.is(res.status, 422)
  t.true(response.error)
  t.is(response.data.message, 'Something went wrong hashing')
})

test('Error: POST [empty body] /v1/registration', async t => {
  t.plan(3)
  const res = await post('/v1/registration', {})
  const response = await res.json()
  // console.log(response)
  t.is(res.status, 422)
  t.true(response.error)
  t.is(response.data.message, 'Please fill in all required fields')
})
