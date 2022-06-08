// const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getMovies, deleteMovie, createMovie } = require('../controllers/movies');
// const urlRegexp = require('../utils/utils');
const { validateDeleteMovie, validateCreateMovie } = require('../middlewares/validation');

module.exports = router;

// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
router.get('/movies', getMovies);

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
router.delete('/movies/:_id', validateDeleteMovie, deleteMovie);

// # создаёт фильм
// POST /movies
router.post('/movies', validateCreateMovie, createMovie);
