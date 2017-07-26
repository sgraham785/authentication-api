import test from 'ava'
import path from 'path'
import www from '../bin/www'
import { get } from './helpers/methodHelper'
import convertGlobPaths from '../src/util/convertGlobPaths'
import importTests from './helpers/importTests'

const testPaths = convertGlobPaths([path.resolve(__dirname, '../src/resource/**/test.js')])

test.beforeEach(t => {
  return www
})

importTests(testPaths)

test('404 / route', async t => {
  t.plan(2)
  const res = await get('/')
  // console.log(`res--> ${JSON.stringify(res)}`)
  t.is(res.status, 404)
  t.is(res.statusText, 'Not Found')
})

test('404 /v1 route', async t => {
  t.plan(2)
  const res = await get('/')
  // console.log(`res--> ${JSON.stringify(res)}`)
  t.is(res.status, 404)
  t.is(res.statusText, 'Not Found')
})
