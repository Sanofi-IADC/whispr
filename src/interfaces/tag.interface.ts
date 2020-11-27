import { Document } from 'mongoose';
import { TagGroupInputType } from '../tagGroup/tagGroup.input';
import { TagStatuses } from './status.enum';

export interface ITag extends Document {
  title: string;
  tagGroup: TagGroupInputType;
  status: TagStatuses;
}
