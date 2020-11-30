import * as mongoose from 'mongoose';

export const webhookSchema = new mongoose.Schema({
  url: String,
  events: [String],
  filter: { type: Object, default: {} }
});

mongoose.model('Webhook', webhookSchema);
