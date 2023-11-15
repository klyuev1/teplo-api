const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getRooms, createRoom, deleteRoom } = require('../controllers/rooms');

// GET -- получить карточки
router.get('/rooms', getRooms);

// POST -- создать новую карточку
router.post('/rooms', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    height: Joi.number().required(),
    width: Joi.number().required(),
    areaWall: Joi.number().required(),
    areaWindow: Joi.number().required(),
    areaRoom: Joi.number().required(),
  }),
}), createRoom);

// DELETE -- удалить карточку
router.delete('/rooms/:roomId', celebrate({
  params: Joi.object().keys({
    roomId: Joi.string().length(24).hex().required(),
  }),
}), deleteRoom);


module.exports = router;