import { Document } from 'mongoose';

export interface IWebhook extends Document {
  url: string;
  events: string[];
  filter: string;
}
