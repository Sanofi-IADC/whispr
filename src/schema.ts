import * as mongoose from 'mongoose';

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
