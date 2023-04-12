const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlValidator = require('../constants/constants');

const {
  getUserMovies,
  createMovie,
  deleteMovie
} = require('../controllers/movies');

/**
 * получение сохраненных фильмов пользователя
 */
movieRouter.get('/', getUserMovies);

/**
 * создание фильма
 */
movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlValidator),
    trailer: Joi.string().required().pattern(urlValidator),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(urlValidator),
    movieId: Joi.string().required(),
  }),
}), createMovie);

/**
 * удаление фильма
 */
movieRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = movieRouter;