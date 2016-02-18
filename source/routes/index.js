var express = require('express');
var router = express.Router();

var auth = require('../controllers/auth.js');
var todos = require('../controllers/todos.js');

/*
 * Routes that can be accessed only by authenticated users
 */
router.get('/api/v1/todos', todos.getAll);
router.get('/api/v1/todos/:ids', todos.getOneOrMany);
router.post('/api/v1/todos', todos.create);
router.put('/api/v1/todos/:id', todos.update);
router.delete('/api/v1/todos/:id', todos.delete);

/*
 * Routes that can be accessed by anyone
 */
router.post('/register', auth.register);
router.get('/verify/:code', auth.verify);
router.post('/login', auth.login);

/*
 * Routes that can be accessed only by authenticated & authorized users

router.get('/api/v1/admin/users', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);
 */
module.exports = router;