import http from 'http'
import assert from 'assert'

import '../bin/www'

const protocol = process.env.SERVER_PROTOCOL || 'http'
const hostname = process.env.SERVER_HOST || 'localhost'
const port = process.env.SERVER_PORT || '8443'

describe('Test Server', () => {
  it('should return 404', done => {
    http.get(`${protocol}://${hostname}:${port}`, res => {
      assert.equal(404, res.statusCode)
      done()
    })
  })
})
