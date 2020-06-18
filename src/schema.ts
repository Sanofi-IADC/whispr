import * as mongoose from 'mongoose';

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
