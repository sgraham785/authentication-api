var Bookshelf = require('../configs/db').bookshelf;

var Base = Bookshelf.Model.extend({

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
});