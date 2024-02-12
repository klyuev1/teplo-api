import { Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import { AuthRequest } from '../interfaces/AuthRequest';

import AuthorizationError from '../errors/AuthorizationError';

const { JWT_SECRET = 'secret-word' } = process.env;

interface IUserPayload {
  _id: string;
  email: string;
  password: string;
}


export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token: string = req.cookies.jwt;

  if (!token) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  let payload: IUserPayload;

  try {
    payload = jwt.verify(token, JWT_SECRET) as IUserPayload;
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }



  req.user = payload;

  next();
};
