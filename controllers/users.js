const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/notFoundError');
const BadRequest = require('../errors/badRequestError');
const EmailDoubleError = require('../errors/EmailDoubleError');


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
        next(new NotFound('Пользователь не найден'));
      }
    })
    .catch(next);
};

/**
 * редактирование данных пользователя
 */
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFound('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные пользователя'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный id пользователя'));
      } else {
        next(err);
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
        next(new BadRequest('Неверный email или пароль'));
      } else if (err.code === 11000) {
        next(new EmailDoubleError('Пользователь с таким email уже существует'));
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
