const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

/**
 * получение текущего пользователя
 */
userRouter.get('/me', getCurrentUser);

/**
 * редактирование пользователя
 */
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = userRouter;