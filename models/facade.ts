import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { IFacade } from '../interfaces/IFacade';

const facadesSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
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

const FacadeModel = mongoose.model<IFacade>('facade', facadesSchema);

export default FacadeModel;