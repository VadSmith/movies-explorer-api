require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UserExistsError = require('../errors/UserExistsError');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;
const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

// eslint-disable-next-line consistent-return
const login = (req, res, next) => {
  const { email, password } = req.body;
  // console.log(`in login: email=${email} password=${password}`);

  if (!email || !password) { return next(new CastError('Email или пароль не могут быть пустыми')); }

  User.findOne({ email }).select('+password')
    .then((user) => {
      console.log(`in login findOne: user=${user}`);
      if (!user) { return next(new UnauthorizedError('Неправильный email или пароль')); }

      return bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((isValidPassword) => {
          if (!isValidPassword) { return next(new UnauthorizedError('Неправильный email или пароль')); }
          const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });
          // console.log(`in login token: ${token}`);
          res.status(200);
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: 'none',
            // secure: true, //включить потом на домене
          });
          res.send({ message: 'Успешный вход' });
        })
        .catch(() => next());
    });
};

// Logout
const logout = (req, res, next) => {
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
    { name: req.body.name, about: req.body.about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      res.send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка: Введены некорректные данные'));
      }
      next(err);
    });
};

// Возвращает информацию о пользователе(email и имя)
const getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return next(new CastError('Ошибка: Введен некорректный id пользователя!'));
      // }
      next(err);
    });
};

// Создание нового пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // console.log(`in createuser: name=${name} email=${email} password=${password}`);
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
  logout,
  JWT_SECRET,
};
