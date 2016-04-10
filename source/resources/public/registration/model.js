var BaseModel = require('../../../classes/base/model');

var instanceProps = {
  tableName: 'users',
  hasTimestamps: true
};

var classProps = {
  typeName: 'user',
  params: {
    first_name: function (params) {
      return this.create('first_name', params.first_name);
    },
    last_name: function (qb, value) {
      return qb.whereIn('last_name', value);
    },
    email: function (qb, value) {
      return qb.whereIn('email', value);
    },
    code: function (qb, value) {
      return qb.whereIn('code', value);
    }
  },
  filters: {
    first_name: function (qb, value) {
      return qb.whereIn('first_name', value);
    },
    last_name: function (qb, value) {
      return qb.whereIn('last_name', value);
    },
    email: function (qb, value) {
      return qb.whereIn('email', value);
    },
    code: function (qb, value) {
      return qb.whereIn('code', value);
    }
  },
  relations: []
};

console.log("classProps= " + JSON.stringify(classProps));
module.exports = BaseModel.extend(instanceProps, classProps);
