const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const validPassword = require('../middleware/valid-password');
const rateLimiter = require('../middleware/rate-limiter');

router.post('/signin', validPassword, userController.signin);

router.post('/login', rateLimiter, userController.login);


module.exports = router;