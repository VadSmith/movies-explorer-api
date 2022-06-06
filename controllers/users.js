require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UserExistsError = require('../errors/UserExistsError');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;
const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { next(new UnauthorizedError('Неправильный email или пароль')); }

      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) { next(new UnauthorizedError('Неправильный email или пароль')); }
          const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });
          res.status(200);
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: 'none',
            secure: true, // включать на сервере
          });
          res.send({ message: 'Успешный вход' });
        })
        .catch(() => next());
    }).catch(() => next());
};

// Signout
const signout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.clearCookie('jwt', {
          sameSite: 'none',
          secure: true,
        }).send({ message: 'Успешный выход из системы' });
      }
    })
    .catch(next);
};

// Обновить профиль
const patchUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка: Введены некорректные данные'));
      } else if (err.code === 11000) {
        next(new UserExistsError('Пользователь с таким email существует'));
      } else { next(err); }
    });
};

// Возвращает информацию о пользователе(email и имя)
const getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

// Создание нового пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, email, password: hash,
      },
    ))
    .then((user) => {
      res.send(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      );
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserExistsError('Пользователь с таким email существует'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUsersMe,
  patchUser,
  login,
  signout,
  JWT_SECRET,
};
