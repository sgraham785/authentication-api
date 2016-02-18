var Bookshelf = require('../database').bookshelf;
var Model = require('../models/Todo');

var check = require('validator').check;
var sanitize = require('validator').sanitize;

// TODO: add user deps
var todosController = {

    // curl http://localhost:3000/api/v1/todos
    getAll: function(req, res) {

        Model.Todos.forge()
            .orderBy('id','ASC')
            .fetch()
            .then(function (collection) {
                res.json({error: false, data: collection.toJSON()});
            })
            .otherwise(function (err) {
                console.log(err);
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },

    // curl http://localhost:3000/api/v1/todos/1,2
    getOneOrMany: function(req, res) {

        // Grab ids from URL parameters
        var ids = req.params.ids;

        Bookshelf.knex.raw( "select * from items where id = any(string_to_array($1 , ',')::integer[]) order by id ASC",
                [ids] )
            .then(function (resp) {
                if (!resp) {
                    res.status(404).json({error: true, data: {}});
                }
                else {
                    res.json({error: false, data: resp.rows});
                }
            })
            .otherwise(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },

    // curl --data "text=test&complete=false" http://127.0.0.1:3000/api/v1/todos
    create: function(req, res) {
        //console.log(req);
        //process.exit(0);
        // TODO: add user support
        // Grab data from http request
        var data = {/*user_id: req.user.id,*/ text: req.body.text, complete: false};

        // TODO: sanitize text
        Model.Todo.forge({
            text: data.text,
            complete: data.complete,
            //user_id: data.user_id
        })
        .save()
            .then(function (resp) {
                res.json({error: false, data: {id: resp.get('id'),text: data.text}});
            })
            .otherwise(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },

    //  curl -X PUT --data "text=blah&complete=true" http://127.0.0.1:3000/api/v1/todos/1
    update: function(req, res) {

        // Grab data from the URL parameters
        var id = req.params.id;

        // Grab data from the http request
        var data = {text: req.body.text, complete: req.body.complete};

        Model.Todo.forge({id: id})
            .fetch({require: true})
            .then(function (resp) {
                resp.save({
                    text: data.text,
                    complete: data.complete
                })
                    .then(function(data){
                        res.json({error: false, message: 'Todo details updated', data: data});
                    })
                    .otherwise(function (err) {
                    res.status(500).json({error: true, data: {message: err.message}});
                    });
            })
            .otherwise(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },

    // curl -X DELETE http://127.0.0.1:3000/api/v1/todos/1
    delete: function(req, res) {

        // Grab data from the URL parameters
        var id = req.params.id;

        Model.Todo.forge({id: id})
            .fetch({require: true})
            .then(function (resp) {
                resp.destroy()
                    .then(function () {
                        res.json({error: false, data: {message: 'Todo successfully deleted'}});
                    })
                    .otherwise(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            })
            .otherwise(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
};

module.exports = todosController;
