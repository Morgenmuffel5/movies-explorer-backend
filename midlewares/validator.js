const { celebrate, Joi } = require('celebrate');
const urlValidator = require('../constants/constants');

const createFilmValidator = () => celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlValidator),
    trailerLink: Joi.string().required().pattern(urlValidator),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(urlValidator),
    movieId: Joi.number().required(),
  }),
});

const deleteFilmValidator = () => celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

const editUserValidator = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const createUserValidator = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const loginValidator = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  createFilmValidator,
  createUserValidator,
  deleteFilmValidator,
  editUserValidator,
  loginValidator,
};
