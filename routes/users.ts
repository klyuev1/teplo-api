import { Router } from 'express';
import { celebrate, Joi, } from 'celebrate';

import { getUserMe, updateUser } from '../controllers/users';

const router = Router();

// GET -- получить пользователей
router.get('/users/me', getUserMe);

// PATCH -- обновить данные о себе
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

export default router;
