require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { login, createNewUser } = require('./controllers/users');
const urlValidator = require('./constants/constants');
const { requestLogger, errorLogger } = require('./midlewares/logger');
const NotFoundError = require('./errors/notFoundError');
const auth = require('./midlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

/**
 * разрешение кросс доменных запросов
 */
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * логирование запросов
 */
app.use(requestLogger);

/**
 * вход на сайт
 */
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

/**
 * регистрация
 */
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createNewUser);

/**
 * защита роутов, проверка токена
 */
app.use(auth);

/**
 * роутер запросов для юзера
 */
app.use('/users', usersRouter);
/**
 * роутер запросов для фильмов
 */
app.use('/movies', movieRouter);
/**
 * роутер для несуществующей страницы
 */
app.use('*', auth, (_, __, next) => next(new NotFoundError('Такой страницы не существует')));

/**
 * логирование ошибок
 */
app.use(errorLogger);

app.listen(PORT, () => {
  console.log('Приложение работает')
})