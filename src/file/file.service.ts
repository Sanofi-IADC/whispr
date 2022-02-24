import { Injectable, Logger } from '@nestjs/common';

import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { FileUpload } from 'graphql-upload';
import { AWSCredsService } from '../aws-creds/aws-creds.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class FileService {
  constructor(private awsCredentialService: AWSCredsService, private configService: ConfigService) {}

  async getFile(url: string): Promise<GetObjectOutput> {
    const aws = await this.awsCredentialService.getAWS();
    const s3client = new aws.S3({
      endpoint: this.configService.get('AWS_S3_ENDPOINT'),
      s3ForcePathStyle: true,
    });
    return new Promise((resolve, reject) => {
      s3client.getObject(
        {
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: url,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
      );
    });
  }

  async saveFile(file: FileUpload, path: string): Promise<string> {
    const aws = await this.awsCredentialService.getAWS();
    const s3client = new aws.S3({
      endpoint: this.configService.get('AWS_S3_ENDPOINT'),
      s3ForcePathStyle: true,
    });
    return new Promise((resolve, reject) => {
      s3client.upload(
        {
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: `${path}/${file.filename}`,
          Body: file.createReadStream(),
          ContentType: file.mimetype,
          ContentEncoding: file.encoding,
        },
        (err, response) => {
          if (err) {
            Logger.error(err);
            reject(err);
          } else {
            resolve(response.Key);
          }
        },
      );
    });
  }
}
