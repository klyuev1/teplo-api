import { Router } from 'express';
import { celebrate, Joi, } from 'celebrate';
import {auth} from'../middlewares/auth';
import { signIn, signUp, signOut } from '../controllers/login';

const router = Router();

router.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), signUp);

router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signIn);

router.use('/signout', auth, signOut);

export default router;
