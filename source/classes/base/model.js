var Bookshelf = require('../database').Bookshelf;

var instanceProps = {
  /**
   * Orders the query by column in order
   * @param column
   * @param order
   */
  orderBy: function (column, order) {
      return this.query(function (qb) {
          qb.orderBy(column, order);
      });
  }
};
var classProps = {
  transaction: Bookshelf.transaction.bind(Bookshelf)
};

module.exports = Bookshelf.Model.extend(instanceProps, classProps);
