const Movie = require('../models/movie');
const NotFound = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequestError');
const NotOwner = require('../errors/NotOwnerError');
const message = require('../constants/messages');

/**
 * получение всех сохраненных фильмов текущего пользователя
 */
const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

/**
 * создание фильма
 */
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  }).then((movie) => res
    .status('201')
    .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(message.badRequestCreateFilm));
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
      next(new NotFound(message.filmNotFound));
    } else if (movieId.owner.valueOf() === owner) {
      const movie = await Movie.findByIdAndRemove(req.params.movieId);
      res.send(movie);
    } else {
      next(new NotOwner(message.forbidden));
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequest(message.badRequestDeleteFilm));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
};
