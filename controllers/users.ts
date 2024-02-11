import { Response, NextFunction } from 'express';

import UserModel from '../models/user';
import {AuthRequest} from '../interfaces/AuthRequest';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import ConflictingRequestError from'../errors/ConflictingRequestError';

export const getUserMe = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  UserModel.findById(userId)
    .orFail(new NotFoundError('Пользоваетеля с таким id нет'))
    .then(({ name, email }) => res.status(200).send({ name, email }))
    .catch(next);
};

export const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const opts = { runValidators: true, new: true };

  UserModel.findByIdAndUpdate(req.user?._id, { email, name }, opts)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким ID не найден');
      }
      return res.status(200).send({ message: 'Пользователь успешно обновлен' });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictingRequestError('Пользователь с таким адресом электронной почты уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
