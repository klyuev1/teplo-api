// Плагины
import express from 'express';
import mongoose, {ConnectOptions} from 'mongoose';
import cookies from 'cookie-parser';
import cors from 'cors';
import { errors } from 'celebrate';

// Руты
import facadesRouter from './routes/facades';
import projectRouter from './routes/projects';
import loginRouter from './routes/login';
import UserRouter from './routes/users';

// Мидлвары
import { auth } from './middlewares/auth';

// Ошибки
import NotFoundError from './errors/NotFoundError';
import InternalServerError from './errors/InternalServerError';


// Создаем сервер, подключаемся к БД
const { PORT = 3001, DB_ADDRESS = 'mongodb://127.0.0.1:27017/teplobd' } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
} as ConnectOptions);

app.use(cors({ origin: ['http://localhost:3000', 'https://drive.google.com'], credentials: true }));

app.use(cookies());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(loginRouter);
app.use(auth, UserRouter);
app.use(auth, projectRouter);
app.use(auth, require('./routes/rooms'));
app.use(auth, facadesRouter);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(InternalServerError);
app.listen(PORT, () => {
  console.log(`Server pushed on port ${PORT}`);
});
