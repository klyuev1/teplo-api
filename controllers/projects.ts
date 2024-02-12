import { Response, NextFunction } from 'express';

import ProjectModel from '../models/project';
import {AuthRequest} from '../interfaces/AuthRequest';

import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import NoRightsError from'../errors/NoRightsError';



export const getProjects = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new NotFoundError('Пользователь не авторизован'));
  }

  ProjectModel.find({ owner: req.user._id })
    .then((projects) => {
      projects.reverse();
      res.send(projects);
    })
    .catch(next);
};

export const createProject = (req: AuthRequest, res: Response, next: NextFunction) => {
  const {
    name,
    tOutside,
    tInside,
    rWall,
    rWindow,
    beta,
    kHousehold,
  } = req.body;

  ProjectModel.create({
    name,
    tOutside,
    tInside,
    rWall,
    rWindow,
    beta,
    kHousehold,
    owner: req.user?._id,

  })
    .then((project) => {
      res.send(project);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const deleteProject = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { projectId } = req.params;

  ProjectModel.findById(projectId)
    .then((project) => {
      if (!project) {
        throw new NotFoundError('Карточка с таким ID не найдена');
      }
      if (typeof req.user !=='undefined') {
        if (!project.owner.equals(req.user._id)) {
          throw new NoRightsError('Невозможно удалить карту с другим ID пользователя');
        }
      }
      project.deleteOne()
        .then(() => {
          res.send({ message: 'Карточка удалена' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const updateProject = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  const {
    name, tOutside, tInside, rWall, rWindow, beta, kHousehold,
  } = req.body;

  const opts = { runValidators: true, new: true };

  ProjectModel.findByIdAndUpdate(projectId, { name, tOutside, tInside, rWall, rWindow, beta, kHousehold }, opts)
    .then((project) => res.send({ project }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
