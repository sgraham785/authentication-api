var express = require('express');
var router = express.Router();

var Auth = require('../../controllers/auth.js');

/*
 * Routes that can be accessed by anyone
 */
router.post('/register', Auth.register);
router.get('/verify/:code', Auth.verify);
router.post('/login', Auth.login);

module.exports = router;
