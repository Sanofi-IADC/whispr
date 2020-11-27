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
  openedBy: string;
  openedById: string;
  closedBy: string;
  closedById: string;
  timestamp: Date;
  updated: Date;
  data: Record<string, unknown>;
  attachments: [
    {
      path: string;
      file: string;
    }
  ];
}
