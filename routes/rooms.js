const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getRooms,
  createRoom,
  deleteRoom,
} = require('../controllers/rooms');

// GET -- получить комнаты
router.get('/projects/:projectId/rooms', celebrate({
  params: Joi.object().keys({
    projectId: Joi.string().length(24).hex().required(),
  }),
}), getRooms);

// POST -- создать новую комнату
router.post('/projects/:projectId/rooms', celebrate({
  body: Joi.object().keys({
    number: Joi.string().required(),
    name: Joi.string().required(),
    height: Joi.number().required(),
    width: Joi.number().required(),
    areaWall: Joi.number().required(),
    areaWindow: Joi.number().required(),
    areaRoom: Joi.number().required(),
  }),
  params: Joi.object().keys({
    projectId: Joi.string().length(24).hex().required(),
  }),
}), createRoom);

// DELETE -- удалить комнату
router.delete('/projects/:projectId/rooms/:roomId', celebrate({
  params: Joi.object().keys({
    projectId: Joi.string().length(24).hex().required(),
    roomId: Joi.string().length(24).hex().required(),
  }),
}), deleteRoom);

module.exports = router;
