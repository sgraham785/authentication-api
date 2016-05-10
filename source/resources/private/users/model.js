var BaseModel = require('../../../classes/base/model')

var instanceProps = {
  tableName: 'users',
  hasTimestamps: true,
  todos: function () {
    return this.hasMany(require('../todos/model'))
  }
}

var classProps = {
  typeName: 'user',
  filters: {
    id: function (qb, value) {
      return qb.whereIn('id', value)
    },
    first_name: function (qb, value) {
      return qb.whereIn('first_name', value)
    },
    last_name: function (qb, value) {
      return qb.whereIn('last_name', value)
    },
    email: function (qb, value) {
      return qb.whereIn('email', value)
    },
    verified: function (qb, value) {
      return qb.whereIn('verified', value)
    }
  },
  relations: [
    'todos'
  ]
}

module.exports = BaseModel.extend(instanceProps, classProps)
