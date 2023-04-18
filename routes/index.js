const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createNewUser } = require('../controllers/users');
const auth = require('../midlewares/auth');
const usersRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const message = require('../constants/messages');

/**
 * вход на сайт
 */
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

/**
 * регистрация
 */
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createNewUser);

/**
 * защита роутов, проверка токена
 */
router.use(auth);

/**
 * роутер запросов для юзера
 */
router.use('/users', usersRouter);
/**
 * роутер запросов для фильмов
 */
router.use('/movies', movieRouter);
/**
 * роутер для несуществующей страницы
 */
router.use('*', auth, (_, __, next) => next(new NotFoundError(message.notFound)));

module.exports = router;
