
import { Response, NextFunction } from 'express';
import {AuthRequest} from '../interfaces/AuthRequest';

import ProjectModel from '../models/project';
import RoomModel from '../models/room';


// const Project = require("../models/project");
// const Room = require("../models/room");

import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import NoRightsError from'../errors/NoRightsError';
import { IRoom } from '../interfaces/IRoom';
import { ITableItem } from '../interfaces/ITableItem';

const { downloadRooms } = require("../middlewares/downloadRooms");
// const fs = require("fs");

const CREATED = 201;

export const getRooms = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  RoomModel.find({ owner: projectId })
    .then((rooms) => {
      res.send(rooms);
    })
    .catch(next);
};

export const createRoom = (req: AuthRequest, res: Response, next: NextFunction) => {

  const {
    number, name, height, width, areaWall, areaWindow, areaRoom, numberFacade
  }: IRoom = req.body;

  const { projectId } = req.params;

  ProjectModel.findOne({ _id: projectId })
    .then((project) => {
      if (!project) {
        throw new NotFoundError('Проект не найден');
      }

      const { tOutside, tInside, rWall, rWindow, beta, kHousehold } = project;

      const kTransferable = 0.3354;
      const kExpenditure = 0.35;

      const heatLossDesignOfWall =
        (1 / rWall) * areaWall * (tInside - tOutside) * beta;
      const heatLossDesignOfWindow =
        (1 / rWindow) * areaWindow * (tInside - tOutside) * beta;
      const heatLossHousehold = areaRoom * kHousehold;
      const heatLossInfiltration =
        height * kExpenditure * kTransferable * (tInside - tOutside) * areaRoom;
      const heatLoss = Math.ceil(
        heatLossDesignOfWall +
          heatLossDesignOfWindow +
          heatLossInfiltration -
          heatLossHousehold
      ); // Итоговые теплопотери

      RoomModel.create({
        number,
        name,
        height,
        width,
        areaWall,
        areaWindow,
        areaRoom,
        numberFacade,
        heatLoss,
        owner: projectId,
      })
        .then((room) => res.status(CREATED).send(room))
        .catch((err) => {
          if (err.name === "ValidationError") {
            return next(new BadRequestError("Переданы некорректные данные"));
          }
          return next(err);
        });
    })
    .catch(next);
};

export const deleteRoom = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { projectId, roomId } = req.params;

  ProjectModel.findById(projectId)
    .then(() => {
      RoomModel.findById(roomId)
        .then((room) => {
          if (!room) {
            throw new NotFoundError("Карточка с таким ID не найдена");
          }
          if (!room.owner.equals(projectId)) {
            throw new NoRightsError(
              "Невозможно удалить карту с другим ID пользователя"
            );
          }
          room
            .deleteOne()
            .then(() => {
              res.send({ message: "Карточка удалена" });
            })
            .catch(next);
        })
        .catch((err) => {
          if (err.name === "CastError") {
            return next(new BadRequestError("Переданы некорректные данные"));
          }
          return next(err);
        });
    })
    .catch(next);
};

export const generateCSV = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  const table: ITableItem[] = [];

  await ProjectModel.findOne({ _id: projectId }).then(async (project) => {

    if (!project) {
      throw new NotFoundError('Проект не найден');
    }
    const { tOutside, tInside, rWall, rWindow, beta, kHousehold } = project;

    await RoomModel.find({owner: projectId}).then((data) => {
      data.map(
        ({ number, name, height, width, areaWall, areaRoom, heatLoss }) => {
          table.push({
            tOutside,
            tInside,
            rWall,
            rWindow,
            beta,
            kHousehold,
            number,
            name,
            height,
            width,
            areaWall,
            areaRoom,
            heatLoss,
          });
        });
    });

  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  try {
    await downloadRooms(table); // Дожидаемся создания файла
    const filePath = __dirname + '/output.csv';
    // fs.readFile(filePath, 'utf8', (err, data) => {
    //   console.log(__dirname);
    // });
    res.download(filePath); // Отправляем клиенту файл для скачивания
  } catch (error) {
    console.error('Ошибка при создании CSV файла:', error);
    res.status(500).send('Ошибка при создании файла');
  }
};
