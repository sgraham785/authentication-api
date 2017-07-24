import test from 'ava'
import '../../../bin/www'
import postJson from '../../../test/util/postJson'
import { registationObj } from '../../../test/fixture/registration'

test.serial('Success: POST [new user] /v1/registration', async t => {
  t.plan(3)
  const res = await postJson('/v1/registration', registationObj)
  const response = await res.json()
  console.log(response)
  t.is(res.status, 200)
  t.false(response.error)
  t.truthy(response.data.token)
})

test('Error: POST [existing user] /v1/registration', async t => {
  t.plan(3)
  const res = await postJson('/v1/registration', registationObj)
  const response = await res.json()
  console.log(response)
  t.is(res.status, 422)
  t.true(response.error)
  t.is(response.data.message, 'Something went wrong hashing')
})

test('Error: POST [empty body] /v1/registration', async t => {
  t.plan(3)
  const res = await postJson('/v1/registration', {})
  const response = await res.json()
  console.log(response)
  t.is(res.status, 422)
  t.true(response.error)
  t.is(response.data.message, 'Please fill in all required fields')
})

test.todo('bad validation')

test.todo('before delete user to setup test')
