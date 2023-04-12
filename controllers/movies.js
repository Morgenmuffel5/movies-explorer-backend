const Movie = require('../models/movie');
const NotFound = require('../errors/notFoundError');
const BadRequest = require('../errors/badRequestError');
const NotOwner = require('../errors/NotOwnerError');


/**
 * получение всех сохраненных фильмов текущего пользователя
 */
const getUserMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .then((movies) => res.send(movies))
    .catch(next);
};

/**
 * создание фильма
 */
const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId
  } = req.body;

    Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
    .then((movie) => res
      .status('201')
      .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Не удалось создать фильм, переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

/**
 * удаление сохраненного фильма
 */
const deleteMovie = async (req, res, next) => {
  try {
    const movieId = await Movie.findOne({ _id: req.params.movieId });
    const owner = req.user._id;
    if (movieId === null) {
      next(new NotFound('Переданы некорректные данные для удаления фильма'));
    } else if (movieId.owner.valueOf() === owner) {
      const movie = await Movie.findByIdAndRemove(req.params.movieId);
      res.send(movie);
    } else {
      next(new NotOwner('Невозможно удалить фильм другого пользователя'));
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequest('Невозможно удалить фильм, переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie
};