const Project = require('../models/project');
const Room = require('../models/room');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const NoRightsError = require('../errors/NoRightsError');

const CREATED = 201;

module.exports.getRooms = (req, res, next) => {
  const { projectId } = req.params;

  Room.find({ owner: projectId })
    .then((rooms) => {
      res.send(rooms);
    })
    .catch(next);
};

module.exports.createRoom = (req, res, next) => {
  const {
    number, name, height, width, areaWall, areaWindow, areaRoom, numberFacade
  } = req.body;
  const { projectId } = req.params;

  Project.findOne({ _id: projectId })
    .then((project) => {
      const {
        tOutside, tInside, rWall, rWindow, beta, kHousehold,
      } = project;

      const kTransferable = 0.3354;
      const kExpenditure = 0.35;

      const heatLossDesignOfWall = ((1 / rWall) * areaWall * (tInside - tOutside) * (beta));
      const heatLossDesignOfWindow = ((1 / rWindow) * areaWindow * (tInside - tOutside) * (beta));
      const heatLossHousehold = (areaRoom * kHousehold);
      const heatLossInfiltration = (height * kExpenditure * kTransferable * (tInside - tOutside) * areaRoom);
      const heatLoss = Math.ceil(heatLossDesignOfWall + heatLossDesignOfWindow + heatLossInfiltration - heatLossHousehold); // Итоговые теплопотери

      Room.create({
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
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Переданы некорректные данные'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.deleteRoom = (req, res, next) => {
  const { projectId, roomId } = req.params;

  Project.findById(projectId)
    .then(() => {
      Room.findById(roomId)
        .then((room) => {
          if (!room) {
            throw new NotFoundError('Карточка с таким ID не найдена');
          }
          if (!room.owner.equals(projectId)) {
            throw new NoRightsError('Невозможно удалить карту с другим ID пользователя');
          }
          room.deleteOne()
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
    })
    .catch(next);
};
