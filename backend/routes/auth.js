const router = require('express').Router();
const AuthController = require('../controllers/authController');
const authentication = require('../middleware/middleware.auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router; 