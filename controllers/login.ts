import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import {IUser} from '../interfaces/IUser'

import BadRequestError from '../errors/BadRequestError';
import ConflictingRequestError from '../errors/ConflictingRequestError';

const CREATED: number = 201;
const { JWT_SECRET = 'secret-word' } = process.env;

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name }: IUser = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });
    res.status(CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const validationErrors = err.errors as { [key: string]: { message: string } };
      const errorMessage = Object.values(validationErrors).map((error) => error.message).join(', ');
      return next(new BadRequestError(errorMessage));
    }

    if (err.code === 11000) {
      return next(new ConflictingRequestError('Пользователь с текущим email уже занят'));
    }

    return next(err);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: IUser = req.body;
    const user = await UserModel.findUserByCredentials(email, password);

    if (!user) {
      return next(new BadRequestError('Неправильные почта или пароль'));
    }

    const payload = { _id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      sameSite: true,
    });
    res.send({ user: payload });
  } catch (err) {
    next(err);
  }
};

export const signOut = (req: Request, res: Response) => {
  res.clearCookie('jwt').send({ message: 'See you soon' });
};
