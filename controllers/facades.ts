import { Request, Response, NextFunction } from 'express';
import { IFacade } from '../interfaces/IFacade';
import FacadeModel from '../models/facade';

import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import ArithmeticError from '../errors/ArithmeticError';

const CREATED: number = 201;

export const getFacades = (req: Request, res: Response, next: NextFunction) => {
  FacadeModel.find({})
    .then((facades: IFacade[]) => res.send(facades))
    .catch(next);
};

export const createFacade = (req: Request, res: Response, next: NextFunction) => {

  const {
    name, link, height, width, areaWindow,
  } = req.body;

  // Проверка входных данных
  const areaWall: number = (((height * width) / 1000000) - areaWindow);
  if (areaWall < 0) {
    throw new ArithmeticError('Площадь стены не может быть меньше 0');
  }
  FacadeModel.create({
    name, link, height, width, areaWall, areaWindow,
  })
    .then((facade: IFacade) => res.status(CREATED).send(facade))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    })

}

export const deleteFacade = (req: Request, res: Response, next: NextFunction) => {
  const { facadeId } = req.params;

  FacadeModel.findById(facadeId)
    .then((facade: IFacade | null) => {
      if (!facade) {
        next(new NotFoundError('Фасад с таким ID не найден'));
        return;
      };
      return FacadeModel.deleteOne({ _id: facadeId })
    })
    .then(() => {
      res.send({ message: 'Файл удален' })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
}
