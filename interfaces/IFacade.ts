import { Document } from 'mongoose';

export interface IFacade extends Document {
  name: string;
  link: string;
  height: number;
  width: number;
  areaWall: number;
  areaWindow: number;
}

