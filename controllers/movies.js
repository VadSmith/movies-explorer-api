require('dotenv').config();
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');
const Movie = require('../models/movies');

// Получение списка карточек
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (!movies) {
        next(new NotFoundError('Фильмы не найдены'));
      }
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

// Создание фильма
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN, thumbnail, movieId
const createMovie = (req, res, next) => {
  const {
    movieId, country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail,
  } = req.body;

  Movie.create({
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка: Введены некорректные данные'));
      }
      next(err);
    });
};

// Удаление фильма
const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .orFail(() => new NotFoundError('Фильм с этим ID не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужой фильм'));
      }
      return movie.remove()
        .then(() => res.send({ message: 'Фильм удален' }));
    }).catch(next);
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
