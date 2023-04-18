const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const {
  editUserValidator,
} = require('../midlewares/validator');

/**
 * получение текущего пользователя
 */
userRouter.get('/me', getCurrentUser);

/**
 * редактирование пользователя
 */
userRouter.patch('/me', editUserValidator, updateUser);

module.exports = userRouter;