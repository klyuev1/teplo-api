import {Document, Types} from 'mongoose';

export interface IRoom extends Document {
  number: string;
  name: string;
  height: number;
  width: number;
  areaWall: number;
  areaWindow: number;
  areaRoom: number;
  numberFacade: number;
  heatLoss: number;
  owner: Types.ObjectId;
}
