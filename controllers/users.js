const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequestError');
const EmailDoubleError = require('../errors/EmailDoubleError');
const messages = require('../constants/messages');


const { NODE_ENV, JWT_SECRET } = process.env;

/**
 * получение текущего юзера
 */
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        return next(new NotFound(messages.userNotFound));
      }
    })
    .catch(next);
};

/**
 * редактирование данных пользователя
 */
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        return next(new NotFound(messages.userNotFound));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(messages.updateUserBadRequest));
      }
      if (err.code === 11000) {
        return next(new EmailDoubleError(messages.emailDouble));
      } else {
        return  next(err);
      }
    });
};

/**
 * создание пользователя
 */
const createNewUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
      name, email, password: hash,
    }))
    .then((userdata) => res
      .status('201').send({
        name: userdata.name,
        email: userdata.email,
        _id: userdata._id,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(messages.createUserBadRequest));
      } else if (err.code === 11000) {
        return next(new EmailDoubleError(messages.emailDouble));
      } else {
        next(err);
      }
    });
};

/**
 * авторизация
 */
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'corolina-ripper',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};


module.exports = {
  getCurrentUser,
  createNewUser,
  updateUser,
  login
};
