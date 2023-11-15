const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictingRequestError = require('../errors/ConflictingRequestError');

const CREATED = 201;

const { JWT_SECRET = 'secret-word' } = process.env;

module.exports.signUp = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(CREATED).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      if (err.code === 11000) {
        return next(new ConflictingRequestError('Пользователь с текущим email уже занят'));
      }
      return next(err);
    });
};

module.exports.signIn = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        // httpOnly: true,
        sameSite: true,
        // secure: true
      });
      return res.send({ user: payload });
    })
    .catch(next);
};

module.exports.signOut = (req, res) => {
  // res.clearCookie('jwt').send({ message: 'See you soon' })
  res.clearCookie('jwt');
  res.clearCookie('projectData');
  res.clearCookie('project-data');
  res.send("cleared");
};