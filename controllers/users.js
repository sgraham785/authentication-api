var Bookshelf = require('../configs/db').bookshelf;
var Model = require('../models/User');

var users = {

    // curl http://localhost:3000/api/v1/users
    getAll: function(req, res) {

        // SQL Query > Select Data
        db.query( "select * from users" )
            .then(function(data){
                res.json(data); // build response;
                console.log(data); // display found records;
            }, function(reason){
                console.log(reason); // display reason failed;
            })
    },

    // curl http://localhost:3000/api/v1/users/1,2
    getOneOrMany: function(req, res) {

        // Grab ids from URL parameters
        var ids = req.params.ids;

        // SQL Query > Select Data
        db.query( "select * from users where id = any(string_to_array($1 , ',')::integer[])",
            [ids] )
            .then(function(data){
                res.json(data); // build response;
                console.log(data); // display found records;
            }, function(reason){
                console.log(reason); // display reason failed;
            })
    },

    // curl --data "text=test&complete=false" http://127.0.0.1:3000/api/v1/users
    create: function(req, res) {

        // Grab data from http request
        var data = {email: req.body.email, password: req.body.password};

        db.query( "select * from users where email = $1",
            [data.email], one )
            .then(function(data){
                if (data !== null){
                    return res.status(500).send('User already exists');
                } else {

                    // SQL Query > Insert Data
                    db.query( "insert into users(email, password, code) values($1, $2, $3)",
                        [data.email, data.password, data.code] )
                        .then(function() {
                            // get all items for response;
                            return db.query( "select * from users order by id ASC" );
                        })
                }
            .then(function(data){
                res.json(data);  // build response;
                console.log(data); // display found records;
            }, function(reason){
                console.log(reason); // display reason failed;
            });
    },

    //  curl -X PUT --data "text=blah&complete=true" http://127.0.0.1:3000/api/v1/todos/1
    update: function(req, res) {

        // Grab data from the URL parameters
        var id = req.params.id;

        // Grab data from the http request
        var data = {text: req.body.text, complete: req.body.complete};

        // SQL Query > Update Data
        db.query( "update users set email=($1), password=($2) where id=($3)",
            [data.text, data.complete, id] )
            .then(function(){
                // get all items for response;
                return db.query( "select * from users order by id ASC" );
            })
            .then(function(data){
                res.json(data); // build response;
                console.log(data); // display found records;
            }, function(reason){
                console.log(reason); // display reason failed;
            });
    },

    // curl -X DELETE http://127.0.0.1:3000/api/v1/todos/1
    delete: function(req, res) {

        // Grab data from the URL parameters
        var id = req.params.id;

        // SQL Query > Delete Data
        db.query( "delete from items where id=($1)",
            [id] )
            .then(function(){
                // get all items for response;
                return db.query( "select * from items order by id ASC" );
            })
            .then(function(data){
                res.json(data); // build response;
                console.log(data); // display found records;
            }, function(reason){
                console.log(reason); // display reason failed;
            });
    }
};

module.exports = users;