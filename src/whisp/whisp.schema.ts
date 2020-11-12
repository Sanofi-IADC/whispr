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
  attachments: [
    {
      dataMappingPath: String,
      file: String,
    },
  ],
});

whispSchema.index({ applicationID: 1, closed: -1 });

mongoose.model('Whisp', whispSchema);
