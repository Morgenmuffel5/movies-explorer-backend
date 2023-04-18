require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
/*const cors = require('cors');*/
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { login, createNewUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./midlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./midlewares/auth');
const cors = require('./midlewares/cors');
const errorMethood = require('./midlewares/errorMethood');
const messages = require('./constants/messages');
const {
  createUserValidator,
  loginValidator,
} = require('./midlewares/validator');
const router = require('./routes/index')

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

/**
 * разрешение кросс доменных запросов
 */
/*app.use(cors());*/
app.use(cors);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * логирование запросов
 */
app.use(requestLogger);

/**
 * подключение роутов
 */

app.use(router);

/**
 * логирование ошибок
 */
app.use(errorLogger);

/**
 * celebrate ошибки
 */
app.use(errors());

/**
 * Обработчик ошибок
 */
app.use(errorMethood)




app.listen(PORT, () => {
  console.log('Приложение работает')
})