var BaseModel = require('../../../classes/base/model');

var instanceProps = {
  tableName: 'todos',
  hasTimestamps: true,
  users: function () {
      return this.belongsTo(require('../users/model'));
  }
};

var classProps = {
  typeName: 'todos',
  filters: {
    id: function (qb, value) {
      return qb.whereIn('id', value);
    },
    text: function (qb, value) {
      return qb.whereIn('text', value);
    },
    complete: function (qb, value) {
      return qb.whereIn('complete', value);
    }
  },
  relations: [
    'users'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
