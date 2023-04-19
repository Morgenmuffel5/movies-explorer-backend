const message = require('../constants/messages');

module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: `${message.internalServerError}: ${err.message}` });
  }
  next();
};
