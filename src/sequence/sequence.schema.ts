import * as mongoose from 'mongoose';

export const sequenceSchema = new mongoose.Schema({
  sequenceName: String,
  sequenceValue: Number
});

mongoose.model('Sequence', sequenceSchema);
