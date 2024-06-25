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
  timestamp: Date,
  updated: Date,
  dataIndexKey: String,
  expirationDate: { type: Date, expires: 0 },
  timeToLiveSec: Number,
  data: Object,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  attachments: [
    {
      dataMappingPath: String,
      file: String,
    },
  ],
});

whispSchema.index({
  applicationID: 1,
  closed: 1,
  timestamp: 1,
  type: 1,
});

whispSchema.index({
  dataIndexKey: 1,
  applicationID: 1,
  closed: 1,
  type: 1
});

mongoose.model('Whisp', whispSchema);
