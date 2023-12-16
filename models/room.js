const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
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
  areaRoom: {
    type: Number,
    required: true,
  },
  numberFacade: {
    type: String,
    required: true,
  },
  heatLoss: {
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'project',
  },
});

module.exports = mongoose.model('room', roomsSchema);
