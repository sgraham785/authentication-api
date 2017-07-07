import Chance from 'chance'
const chance = new Chance()

exports['auth'] = {
  iterations: 12,
  values: 'chance.auth()'
}

chance.mixin({
  'auth': function () {
    return {
      uuid: chance.guid(),
      email: chance.email({ domain: 'example.com' }),
      password: chance.hash()
    }
  }
})
