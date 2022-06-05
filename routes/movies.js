const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getMovies, deleteMovie, createMovie } = require('../controllers/movies');
// const urlRegexp = require('../utils/utils');

module.exports = router;

// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
router.get('/movies', getMovies);

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

// # создаёт фильм
// POST /movies
router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      director: Joi.string().required(),
      country: Joi.string().required(),
      year: Joi.string().required(),
      duration: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
      trailerLink: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
      thumbnail: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    }).messages({ 'string.pattern': 'Некорректный URL' }),
  }),
  createMovie,
);
