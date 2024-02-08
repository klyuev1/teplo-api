import { Router } from 'express';
import { celebrate, Joi, } from 'celebrate';
import { getFacades, createFacade, deleteFacade } from '../controllers/facades'

const router = Router();

// GET -- получить фасады
router.get('/facades', getFacades);

// POST -- создать новый фасад
router.post('/facades', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(1).max(20),
    link: Joi.string().required().regex(/^(https?:\/\/)?([a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,}\/?([^\s]*)$/),
    height: Joi.number().required(),
    width: Joi.number().required(),
    areaWindow: Joi.number().required(),
  }),
}), createFacade);

// DELETE -- удалить фасад
router.delete('/facades/:facadeId', celebrate({
  params: Joi.object().keys({
    facadeId: Joi.string().length(24).hex().required(),
  }),
}), deleteFacade);

export default router;
