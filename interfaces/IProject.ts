import {Document, Types} from 'mongoose';

export interface IProject extends Document {
  name: string;
  tOutside: number;
  tInside: number;
  rWall: number;
  rwindow: number;
  beta: number;
  kHousehold: number;
  owner: Types.ObjectId;
  createdAt?: Date;

}
