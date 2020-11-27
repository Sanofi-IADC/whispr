import { Document } from 'mongoose';
import { TagStatuses } from './status.enum';

export interface ITagGroup extends Document {
  title: string;
  metalevel: string;
  applicationID: string;
  status: TagStatuses;
}
