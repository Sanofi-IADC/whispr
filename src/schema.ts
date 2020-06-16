import * as mongoose from 'mongoose';

export const whispSchema = new mongoose.Schema({
  readableID: String,
  type: String,
  severity: Number,
  description: String,
  closed: Boolean,
  applicationID: String,
  plantID: String,
  locationID: String,
  manual: Boolean,
  openedBy: String,
  openedById: String,
  closedBy: String,
  closedById: String,
  timestamp: String,
  updated: String,
  data: Object,
});

export const whispModel = mongoose.model('Whisp', whispSchema);

export const sequenceSchema = new mongoose.Schema({
  sequenceName: String,
  sequenceValue: Number,
});

export const sequenceModel = mongoose.model('Sequence', sequenceSchema);

export const tagGroupSchema = new mongoose.Schema({
  title: String,
  metalevel: String,
  applicationID: String,
  tags: [
    {
      type: String,
    },
  ],
});

export const tagGroupModel = mongoose.model('TagGroup', tagGroupSchema);
