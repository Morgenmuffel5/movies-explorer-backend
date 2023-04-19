const movieRouter = require('express').Router();
const {
  getUserMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { createFilmValidator, deleteFilmValidator } = require('../midlewares/validator');

/**
 * получение сохраненных фильмов пользователя
 */
movieRouter.get('/', getUserMovies);

/**
 * создание фильма
 */
movieRouter.post('/', createFilmValidator, createMovie);

/**
 * удаление фильма
 */
movieRouter.delete('/:movieId', deleteFilmValidator, deleteMovie);

module.exports = movieRouter;
