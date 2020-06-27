import { Document } from 'mongoose';

export interface IWhisp extends Document {
  readableID: string;
  type: string;
  severity: number;
  description: string;
  closed: boolean;
  applicationID: string;
  plantID: string;
  locationID: string;
  manual: boolean;
  user: string;
  timestamp: Date;
  updated: Date;
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: object;
  openedBy: string;
  openedById: string;
  closedBy: string;
  closedById: string;
}
