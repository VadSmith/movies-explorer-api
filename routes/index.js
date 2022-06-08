const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const routesWithoutAuth = require('./routesWithoutAuth');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');

router.use(routesWithoutAuth);

router.use(auth);

router.use(users);
router.use(movies);

router.use(() => { throw new NotFoundError('Страница не найдена'); });

module.exports = router;
