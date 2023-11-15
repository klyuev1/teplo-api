
const room = require('../models/room');

const Room = require('../models/room');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const NoRightsError = require('../errors/NoRightsError');

const CREATED = 201;

module.exports.getRooms = (req, res, next) => {
  Room.find({ owner: req.project._id })
  // Room.find({})
    .then((rooms) => {
      console.log(rooms)
      rooms.reverse();
      res.send(rooms);
    })
    .catch(next);
};

module.exports.createRoom = (req, res, next) => {
  const { name, height, width, areaWall, areaWindow, areaRoom} = req.body;

  const {tOutside, tInside, rWall, rWindow, beta, kHousehold} = req.project;

  let heatLossDesignOfWindow;
  let heatLossDesignOfWall;

  let heatLossInfiltration;
  let kTransferable = 0.3354;
  let kExpenditure = 0.35;

  let heatLossHousehold;

  heatLossDesignOfWall = ((1/rWall)*areaWall*(tInside-tOutside)*(beta));
  heatLossDesignOfWindow = ((1/rWindow)*areaWindow*(tInside-tOutside)*(beta));
  heatLossHousehold = (areaRoom*kHousehold);
  heatLossInfiltration = (height*kExpenditure*kTransferable*(tInside-tOutside)*areaRoom);

  const heatLoss = heatLossDesignOfWall + heatLossDesignOfWindow + heatLossInfiltration - heatLossHousehold;

  Room.create({
    name,
    height,
    width,
    areaWall,
    areaWindow,
    areaRoom,
    heatLoss,
    owner: req.project._id
  })
    .then((room) => res.status(CREATED).send(room))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteRoom = (req, res, next) => {
  const { roomId } = req.params;

  Room.findById(roomId)
    .then((room) => {
      if (!room) {
        throw new NotFoundError('Карточка с таким ID не найдена');
      }
      if (!room.owner.equals(req.project._id)) {
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
};