const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} = require('../controllers/projects');

// GET -- получить проекты пользователя
router.get('/projects', getProjects);

// POST -- создать новый проект
router.post('/projects', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    tOutside: Joi.number().required(),
    tInside: Joi.number().required(),
    rWall: Joi.number().required(),
    rWindow: Joi.number().required(),
    beta: Joi.number().required(),
    kHousehold: Joi.number().required(),
  }),
}), createProject);

// DELETE -- удалить проект
router.delete('/projects/:projectId', celebrate({
  params: Joi.object().keys({
    projectId: Joi.string().length(24).hex().required(),
  }),
}), deleteProject);

// PATCH -- обновить данные о проекте
router.patch('/projects/:projectId', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    tOutside: Joi.number().required(),
    tInside: Joi.number().required(),
    rWall: Joi.number().required(),
    rWindow: Joi.number().required(),
    beta: Joi.number().required(),
    kHousehold: Joi.number().required(),
  }),
}), updateProject);

module.exports = router;
