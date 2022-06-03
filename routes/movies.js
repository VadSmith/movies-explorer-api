
// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
// POST / movies

const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/card');
module.exports = router;

// # возвращает все сохранённые текущим  пользователем фильмы
// GET / movies
router.get('/movies', getMovies);

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteCard);
// router.delete('/cards/:cardId', deleteCard);

// router.post('/cards', createCard);
// router.put('/cards/:cardId/likes', likeCard);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    }).messages({ 'string.pattern': 'Должен быть корректный URL' }),

  }),
  createCard,
);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);
