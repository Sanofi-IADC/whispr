import * as mongoose from 'mongoose';
import { TagStatuses } from '../interfaces/status.enum';

export const tagGroupSchema = new mongoose.Schema({
  title: String,
  metalevel: String,
  applicationID: String,
  status: {
    type: String,
    default: TagStatuses.ACTIVE,
    enum: [TagStatuses.ACTIVE, TagStatuses.ARCHIVED],
  },
});

mongoose.model('TagGroup', tagGroupSchema);
