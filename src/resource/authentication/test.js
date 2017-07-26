import test from 'ava'
// import '../../../bin/www'
import { post } from '../../../test/helpers/methodHelper'
import { authenticationObj } from '../../../test/fixtures/authentication'

test.serial('Success: POST [login] /v1/authentication', async t => {
  t.plan(3)
  const res = await post('/v1/authentication', authenticationObj)
  const response = await res.json()
  console.log(response)
  t.is(res.status, 200)
  t.false(response.error)
  t.truthy(response.data.token)
})

test('Error: POST [existing user] /v1/authentication', async t => {
  t.plan(3)
  const res = await post('/v1/authentication', authenticationObj)
  const response = await res.json()
  console.log(response)
  t.is(res.status, 422)
  t.true(response.error)
  t.is(response.data.message, 'Something went wrong hashing')
})

test('Error: POST [empty body] /v1/authentication', async t => {
  t.plan(3)
  const res = await post('/v1/authentication', {})
  const response = await res.json()
  console.log(response)
  t.is(res.status, 422)
  t.true(response.error)
  t.is(response.data.message, 'Please fill in all required fields')
})

test.todo('bad schema validation')

test.todo('before delete user to setup test')
