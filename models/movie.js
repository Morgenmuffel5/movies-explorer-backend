const mongoose = require('mongoose');
const validator = require('validator');

const movieModel = new mongoose.Schema({
  /**
   * страна создания фильма
   */
  country: {
    type: String,
    required: true,
  },
  /**
   * режиссёр фильма
   */
  director: {
    type: String,
    required: true,
  },
  /**
   *  длительность фильм
   */
  duration: {
    type: Number,
    required: true,
  },
  /**
   * год выпуска
   */
  year: {
    type: String,
    required: true,
  },
  /**
   * описание
   */
  description: {
    type: String,
    required: true,
  },
  /**
   * ссылка на постер к фильму
   */
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неккоректный URL',
    },
  },
  /**
   *   ссылка на трейлер фильма
   */
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неккоректный URL',
    },
  },
  /**
   *  миниатюрное изображение постера к фильму
   */
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неккоректный URL',
    },
  },
  /**
   *  _id пользователя, который сохранил фильм
   */
  owner: {
    type: String,
    required: true,
  },
  /**
   * id фильма
   */
  movieId: {
    type: String,
    required: true,
  },
  /**
   *  название фильма на русском
   */
  nameRu: {
    type: String,
    required: true,
  },
  /**
   *  название фильма на английском
   */
  nameEng: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('movie', movieModel);