/* eslint-disable class-methods-use-this */
// TODO : remove when this issue is fixed https://github.com/typescript-eslint/typescript-eslint/issues/1103

import { CustomScalar, Scalar } from '@nestjs/graphql';
import { isUndefined } from 'util';
import { GraphQLError, ValueNode } from 'graphql';
import * as FileType from 'file-type';
import { FileUpload } from '../file/file.service';

@Scalar('Upload')
export class UploadScalar implements CustomScalar<Promise<FileUpload>, Promise<FileUpload>> {
  description = 'File upload scalar type';

  async parseValue(value: Promise<FileUpload>): Promise<FileUpload> {
    const upload = await value;
    const stream = upload.createReadStream();
    const fileType = await FileType.fromStream(stream);

    if (isUndefined(fileType)) throw new GraphQLError('Mime type is unknown.');

    if (fileType?.mime !== upload.mimetype) throw new GraphQLError('Mime type does not match file content.');

    return upload;
  }

  parseLiteral(ast: ValueNode): Promise<FileUpload> {
    throw new GraphQLError('Upload literal unsupported.', ast);
  }

  serialize(): Promise<FileUpload> {
    throw new GraphQLError('Upload serialization unsupported.');
  }
}
