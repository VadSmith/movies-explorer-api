const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');

router.post('/signin', validateLogin, login);

router.post('/signup', validateCreateUser, createUser);

module.exports = router;
