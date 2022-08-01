require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/ratelimiter');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('./middlewares/cors');
const { EXPRESS_URL, EXPRESS_PORT, MONGODB_URL } = require('./config');

const app = express();

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, family: 4 });
// mongoose.connect(MONGODB_URL, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(cors);

app.use(require('./routes'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(EXPRESS_PORT, () => {
  console.log('Express is on port 3000!', EXPRESS_URL);
});
