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

mongoose.model('TagGroup', tagGroupSchema);
