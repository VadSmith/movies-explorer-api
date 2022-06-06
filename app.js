require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, signout, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const limiter = require('./utils/ratelimiter');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const cors = require('./middlewares/cors');
const { EXPRESS_URL, EXPRESS_PORT, MONGODB_URL } = require('./config');

const app = express();

mongoose.connect(MONGODB_URL, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(cors);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.get('/signout', signout);
app.use(require('./routes/movies'));
app.use(require('./routes/users'));

app.use(() => { throw new NotFoundError('Страница не найдена'); });

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(EXPRESS_PORT, () => {
  console.log('Express is on port 3000!', EXPRESS_URL);
});
