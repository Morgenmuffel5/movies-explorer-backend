require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
/* const cors = require('cors'); */
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./midlewares/logger');
const cors = require('./midlewares/cors');
const router = require('./routes/index');
const errorHandler = require('./midlewares/errorConstructor');
const limiter = require('./midlewares/limiter');

const { PORT = 3000, MONGO, NODE_ENV } = process.env;

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(NODE_ENV === 'production' ? MONGO : 'mongodb://127.0.0.1:27017/bitfilmsdb');

/**
 * разрешение кросс доменных запросов
 */
/* app.use(cors()); */
app.use(cors);

/**
 * helmet
 */
app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * логирование запросов
 */
app.use(requestLogger);

/**
 * ограничение запросов
 */
app.use(limiter);

/**
 * все роуты
 */
app.use('/', router);

/**
 * логирование ошибок
 */
app.use(errorLogger);

/**
 * ошибки celebrate
 */
app.use(errors());

/**
 * обработчик ошибок
 */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Приложение работает');
});
