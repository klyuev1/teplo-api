// Подгружаем плагины
const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');

// Подгружаем милдвары
const NotFoundError = require('./errors/NotFoundError');
const InternalServerError = require('./errors/InternalServerError');
const auth = require('./middlewares/auth');

// Создаем сервер, подключаемся к БД
const { PORT = 3001, DB_ADDRESS = 'mongodb://127.0.0.1:27017/teplobd' } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(cors({ origin: ['http://localhost:3000', ''], credentials: true }));

app.use(cookies());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(require('./routes/login'));
app.use(auth, require('./routes/users'));
app.use(auth, require('./routes/projects'));
app.use(auth, require('./routes/rooms'));
app.use(auth, require('./routes/facades'));

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(InternalServerError);
app.listen(PORT, () => {
  console.log(`Server pushed on port ${PORT}`);
});
