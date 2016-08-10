var BaseModel = require('../../../middleware/base/model')

var instanceProps = {
  tableName: 'todos',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo(require('../users/model'))
  }
}

var classProps = {
  typeName: 'todo',
  filters: {
    id: function (qb, value) {
      return qb.whereIn('id', value)
    },
    text: function (qb, value) {
      return qb.whereIn('text', value)
    },
    complete: function (qb, value) {
      return qb.whereIn('complete', value)
    }
  },
  relations: [
    'user'
  ]
}

module.exports = BaseModel.extend(instanceProps, classProps)
