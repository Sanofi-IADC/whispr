import { Document } from 'mongoose';

export interface ITagGroup extends Document {
  title: string;
  metalevel: string;
  applicationID: string;
  tags: string[];
  closed: boolean;
  closedBy: string;
  closedById: string;
}
