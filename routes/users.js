const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  patchUser, getUsersMe,
} = require('../controllers/users');

module.exports = router;

// # возвращает информацию о пользователе(email и имя)
// GET /users/me
router.get('/users/me', getUsersMe);

// # обновляет информацию о пользователе(email и имя)
// PATCH /users/me
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string(),
  }),
}), patchUser);
