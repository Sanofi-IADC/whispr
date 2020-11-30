import * as mongoose from 'mongoose';
import { TagStatuses } from '../interfaces/status.enum';

export const tagSchema = new mongoose.Schema({
  title: String,
  tagGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'TagGroup' },
  status: {
    type: String,
    enum: [TagStatuses.ACTIVE, TagStatuses.ARCHIVED]
  }
});

mongoose.model('Tag', tagSchema);
