const router = require('express').Router();
const { login, createNewUser } = require('../controllers/users');
const auth = require('../midlewares/auth');
const usersRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const message = require('../constants/messages');
const { loginValidator, createUserValidator } = require('../midlewares/validator');
/**
 * вход на сайт
 */
router.post('/signin', loginValidator, login);

/**
 * регистрация
 */
router.post('/signup', createUserValidator, createNewUser);

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
