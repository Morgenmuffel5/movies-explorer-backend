const router = require('express').Router();
const {loginValidator, createUserValidator} = require("../midlewares/validator");
const {login, createNewUser} = require("../controllers/users");
const auth = require("../midlewares/auth");
const usersRouter = require("./users");
const movieRouter = require("./movies");
const NotFoundError = require("../errors/NotFoundError");
const messages = require("../constants/messages");


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
router.use('*', auth, (_, __, next) => next(new NotFoundError(messages.notFound)));

module.exports = router;