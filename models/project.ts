import mongoose, { Schema } from 'mongoose';
import { IProject } from '../interfaces/Iproject'
const projectsSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tOutside: {
    type: Number,
    required: true,
  },
  tInside: {
    type: Number,
    required: true,
  },
  rWall: {
    type: Number,
    required: true,
  },
  rWindow: {
    type: Number,
    required: true,
  },
  beta: {
    type: Number,
    required: true,
  },
  kHousehold: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProjectModel = mongoose.model<IProject>('project', projectsSchema);

export default ProjectModel;