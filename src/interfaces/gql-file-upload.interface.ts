import { Readable } from 'stream';

/**
 * FileUpload Object for Graphql
 */
export interface GqlFileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}
