import mongoose, { Schema } from 'mongoose';
import { IRoom } from '../interfaces/IRoom';

const roomsSchema: Schema = new mongoose.Schema({
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

const RoomModel = mongoose.model<IRoom>('room', roomsSchema);

export default RoomModel;