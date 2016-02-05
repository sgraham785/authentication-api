var app = require('express')();
var JWT = require('jwt-async');
var Promise = require('bluebird');
var Checkit = require('checkit');

var Model = require('../models/User');
var Encrypt = Promise.promisifyAll(require('../models/Encrypt'));
var genCode = require('../models/Verify').genCode;
var Mailer = require('../models/Mailer').sendOne;

var jwt = new JWT({
    crypto: {
        algorithm: 'HS512',
        secret: process.env.TOKEN_SECRET || "NOT A SECRET AT ALL, YOU SHOULD CHANGE IT"
    }
});

var authController = {

    // require an auth-token middleware
    requireToken: function(req,res,next){
        var token;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        }

        if (req.body && req.body.token) {
            token = req.body.token;
        }

        if (!token){
            return res.status(401).send({status: 401,message:'Token not set.'});
        }

        jwt.verify(token, function (err, data) {
            if (err){ return res.status(401).send({status: 401,message: err}); }
            req.user = data.claims.user;
            delete req.user.password;
            next();
        });
    },

    // get JWT token for login credentials
    login: function(req, res){

        var data = {
            email: req.body.email,
            password: req.body.password
        };

        Model.User.login(data.email, data.password)
            .then( function(user) {
                // remove sensitive info from JWT
                // delete user.attributes.email;
                delete user.get('password');

                // create JWT
                jwt.sign({user: user}, function (err, token) {
                    if (err) {
                        return res.status(500).send({status: 500, message: err.message});
                    }
                    return res.send({token: token});
                });

                //TODO: redirect to todo index
                //res.status(200);
                //res.redirect('/todos');

            }).catch( Model.User.NotFoundError, function() {
                res.status(400).json({error: true, data: {message: data.email + ' not found'}});
            }).catch( function(err) {
                console.error(err);
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },

    // register new login credentials;
    // curl --data "first_name=Sean&last_name=Graham&email=sgraham785\+1@gmail.com&password=temp123" http://127.0.0.1:3000/register
    register: function(req, res){

        // Set data for insertion
        var data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            code: genCode()
        };

        Model.User.register(data)
            .then( function(user) {
                // set email data for mailer
                var locals = {
                    email: user.get('email'),
                    subject: 'Please Verify Your Email',
                    name: user.get('first_name') +' '+ user.get('last_name'),
                    link: "http://"+req.get('host')+"/verify/" + user.get('code')
                };
                Mailer('verify_registration', locals, function(err,message) {
                    if (err) {
                        // handle error
                        console.log(err);
                        res.send('There was an error sending the email');
                        return;
                    }
                    return message;
                });
                res.json({error: false, data: {id: user.get('id')}});

                console.log('User ' + data.email + ' signed up. Verify with http://'+req.get('host')+'/verify/' + data.code);

            }).catch( function(err) {
                console.error(err);
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },

    // verify a user
    verify: function(req,res){

        // Grab ids from URL parameters
        var code = req.params.code;

        Model.User.forge({
            code: code
        })
        .fetch()
            // TODO: check if already verified, if it matters
            .then(function(verify){
                verify.save({ verified: true }, {patch: true})
                    .then(function(){
                        // TODO: send welcome email
                        // redirect to login or set authentication
                        //res.json({error: false, data: {message: 'You\'ve been verified!'}});
                        res.status(200);
                        res.redirect('/signin')
                        //res.json({error: false, data: {message: 'You\'ve been verified!'}});
                    })
            })
            .otherwise(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    },
    // TODO: reissue verification
    // request a verify-reissue
    reissue: function(req,res){

    },
    // TODO: logout
    // request a verify-reissue
    logout: function(req,res){

    }
}

module.exports = authController;
