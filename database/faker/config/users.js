import Chance from 'chance'
const chance = new Chance()

exports['users'] = {
  iterations: 12,
  values: 'chance.users()'
}

chance.mixin({
  'users': function () {
    return {
      // id: chance.guid(),
      first_name: chance.first(),
      last_name: chance.last(),
      email: chance.email({ domain: 'example.com' }),
      password: chance.hash(),
      code: chance.string(),
      verified: chance.bool()
    }
  }
})
