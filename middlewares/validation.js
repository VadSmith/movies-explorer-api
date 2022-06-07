const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validatePatchUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().custom((value, helpers) => {
      if (isUrl(value)) {
        return value;
      }
      return helpers.message('Некорректный URL в поле image');
    }).required(),
    trailerLink: Joi.string().custom((value, helpers) => {
      if (isUrl(value)) {
        return value;
      }
      return helpers.message('Некорректный URL в поле trailerLink');
    }).required(),
    thumbnail: Joi.string().custom((value, helpers) => {
      if (isUrl(value)) {
        return value;
      }
      return helpers.message('Некорректный URL в поле thumbnail');
    }).required(),
  }),
});
