var Bookshelf = require('../configs/db').bookshelf;

var Todo = Bookshelf.Model.extend({
    tableName: 'todos',
    hasTimestamps: true,
    author: function () {
        return this.belongsTo(User);
    },
    // TODO: abstract
    orderBy: function (column, order) {
        return this.query(function (qb) {
            qb.orderBy(column, order);
        });
    }
});

var Todos = Bookshelf.Collection.extend({
    model: Todo,
    // TODO: abstract
    orderBy: function (column, order) {
        return this.query(function (qb) {
            qb.orderBy(column, order);
        });
    }
});

module.exports = {
    Todo: Todo,
    Todos: Todos
};