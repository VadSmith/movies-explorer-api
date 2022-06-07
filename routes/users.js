// const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  patchUser, getUsersMe, signout,
} = require('../controllers/users');
const { validatePatchUser } = require('../middlewares/validation');

module.exports = router;

// # возвращает информацию оbn пользователе(email и имя)
// GET /users/me
router.get('/users/me', getUsersMe);

// # обновляет информацию о пользователе(email и имя)
// PATCH /users/me
router.patch('/users/me', validatePatchUser, patchUser);

router.get('/signout', signout);
