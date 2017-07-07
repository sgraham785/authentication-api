import Chance from 'chance'
const chance = new Chance()

exports['info'] = {
  iterations: 12,
  values: 'chance.info()'
}

chance.mixin({
  'info': function () {
    return {
      uuid: chance.guid(),
      first_name: chance.first(),
      last_name: chance.last(),
      email_code: chance.hash(),
      password: chance.hash()
    }
  }
})
