import { Document } from 'mongoose';

export interface ISequence extends Document {
  sequenceName: string;
  sequenceValue: number;
}
