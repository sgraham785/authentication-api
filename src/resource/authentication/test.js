import test from 'ava'
import { post } from '../../../test/helpers/methodHelper'
import { loginUser } from '../../../test/fixtures/authentication'

test('Error: POST [login] /v1/authentication', async t => {
  t.plan(4)
  const res = await post('/v1/registration', loginUser).then(r => {
    t.is(r.status, 200)
    const res = post('/v1/authentication', { email: loginUser.email, password: loginUser.password })
    return res
  })
  const response = await res.json()
  // console.log(response)
  t.is(res.status, 200)
  t.false(response.error)
  t.truthy(response.data.token)
})

test('Error: POST [empty body] /v1/authentication', async t => {
  t.plan(3)
  const res = await post('/v1/authentication', {})
  const response = await res.json()
  // console.log(response)
  t.is(res.status, 422)
  t.true(response.error)
  t.is(response.data.message, 'You must provide an email and password')
})

test.todo('bad schema validation')

test.todo('before delete user to setup test')
