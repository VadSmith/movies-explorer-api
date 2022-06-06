require('dotenv').config();

const {
  MONGODB_URL = 'mongodb://localhost:27017/moviesdb',
  EXPRESS_URL = 'http://localhost:3000',
  EXPRESS_PORT = 3000,
} = process.env;

module.exports = {
  EXPRESS_PORT,
  MONGODB_URL,
  EXPRESS_URL,
};
