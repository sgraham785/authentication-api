import 'dotenv/config'
import test from 'ava'
import path from 'path'
import { exec } from 'child_process'
import { truncate } from './helpers/truncateTables'
import { get } from './helpers/methodHelper'
import convertGlobPaths from '../src/util/convertGlobPaths'
import importTests from './helpers/importTests'

const testPaths = convertGlobPaths([path.resolve(__dirname, '../src/resource/**/test.js')])
const OSX = process.env.OSX ? '--osx' : ''

importTests(testPaths)

test.beforeEach(t => {
  exec(`${path.resolve(__dirname, '../scripts/wait-for-it.sh')} -h ${process.env.SERVER_HOST} -p ${process.env.SERVER_HTTPS_PORT} ${OSX}`,
    (error, stdout, stderr) => {
      console.log('stdout: ' + stdout)
      console.log('stderr: ' + stderr)
      if (error !== null) {
        console.log('exec error: ' + error)
      }
    })
})

test.after.always('db cleanup', async t => {
  t.plan(1)
  return truncate(['users.auth']).then(() => {
    t.pass()
  })
})

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
