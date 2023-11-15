const Project = require('../models/project');
const jwt = require('jsonwebtoken');
// const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
// const NoRightsError = require('../errors/NoRightsError');

const CREATED = 201;
const { JWT_SECRET = 'secret-word' } = process.env;

module.exports.getProjects = (req, res, next) => {
  Project.find({ owner: req.user._id })
    .then((projects) => {
      projects.reverse();
      res.send(projects);
    })
    .catch(next);
};

module.exports.createProject = (req, res, next) => {
  const {
    name,
    tOutside,
    tInside,
    rWall,
    rWindow,
    beta,
    kHousehold,
  } = req.body;

  Project.create({
    name,
    tOutside,
    tInside,
    rWall,
    rWindow,
    beta,
    kHousehold,
    owner: req.user._id,

  })
    .then((project) => {
      const proj = {
        _id: project._id,
        name: project.name,
        tOutside: project.tOutside,
        tInside: project.tInside,
        rWall: project.rWall,
        rWindow: project.rWindow,
        beta: project.beta,
        kHousehold: project.kHousehold
      };
      const tokenProj = jwt.sign(proj, JWT_SECRET, { expiresIn: '7d' })
      res.cookie('projectData', tokenProj, {
        sameSite: true,
        // httpOnly: true,
        // secure: true
      })

      res.send(project)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteProject = (req, res, next) => {
  const { projectId } = req.params;

  Project.findById(projectId)
    .then((project) => {
      if (!project) {
        throw new NotFoundError('Карточка с таким ID не найдена');
      }
      if (!project.owner.equals(req.user._id)) {
        throw new NoRightsError('Невозможно удалить карту с другим ID пользователя');
      }
      project.deleteOne()
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

module.exports.updateProject = (req, res, next) => {
  const { projectId } = req.params;
  const { name, tOutside, tInside, rWall, rWindow, beta, kHousehold } = req.body;
  const opts = { runValidators: true, new: true };

  Project.findByIdAndUpdate(projectId, { name, tOutside, tInside, rWall, rWindow, beta, kHousehold }, opts)
    .then((project) => {return res.send({ project })})
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};