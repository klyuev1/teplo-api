const Facade = require('../models/facade');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const CREATED = 201;

module.exports.getFacades = (req, res, next) => {
  Facade.find({})
    .then((facades) => {
      facades.reverse();
      res.send(facades);
    })
    .catch(next);
};

module.exports.createFacade = (req, res, next) => {
  const {
    name, link, height, width, areaWall, areaWindow,
  } = req.body;

  Facade.create({
    name, link, height, width, areaWall, areaWindow,
  })
    .then((facade) => res.status(CREATED).send(facade))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteFacade = (req, res, next) => {
  const { facadeId } = req.params;

  Facade.findById(facadeId)
    .then((facade) => {
      if (!facade) {
        throw new NotFoundError('Фасад с таким ID не найден');
      }
      facade.deleteOne()
        .then(() => {
          res.send({ message: 'Фасад удален' });
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
