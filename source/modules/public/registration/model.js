var BaseModel = require('../../../classes/base/model');

var instanceProps = {
  tableName: 'users',
  hasTimestamps: true
};

var classProps = {
  typeName: 'users',
  filters: {
    email: function (qb, value) {
      return qb.whereIn('email', value);
    },
    code: function (qb, value) {
      return qb.whereIn('code', value);
    }
  },
  relations: []
};

module.exports = BaseModel.extend(instanceProps, classProps);
