var BaseModel = require('../../../middleware/base/model')

var instanceProps = {
  tableName: 'users',
  hasTimestamps: true
}

var classProps = {
  typeName: 'users',
  filters: {},
  relations: []
}

module.exports = BaseModel.extend(instanceProps, classProps)
