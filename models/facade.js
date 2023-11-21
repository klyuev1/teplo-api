const mongoose = require('mongoose');
const validator = require('validator');

const facadesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  height: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  areaWall: {
    type: Number,
    required: true,
  },
  areaWindow: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('facade', facadesSchema);
