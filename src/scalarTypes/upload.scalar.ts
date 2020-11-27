import { Scalar } from '@nestjs/graphql';
import { isUndefined } from 'util';
import { GraphQLError } from 'graphql';
import * as FileType from 'file-type';
import { FileUpload } from '../file/file.service';

@Scalar('Upload')
export class UploadScalar {
  description = 'File upload scalar type';

  // TODO: remove eslint-disable during code cleaned-up
  /* eslint-disable class-methods-use-this */
  async parseValue(value: Promise<FileUpload>) {
    const upload = await value;
    const stream = upload.createReadStream();
    const fileType = await FileType.fromStream(stream);

    if (isUndefined(fileType)) throw new GraphQLError('Mime type is unknown.');

    if (fileType?.mime !== upload.mimetype)
      throw new GraphQLError('Mime type does not match file content.');

    return upload;
  }

  parseLiteral(ast): void {
    throw new GraphQLError('Upload literal unsupported.', ast);
  }

  serialize(): void {
    throw new GraphQLError('Upload serialization unsupported.');
  }
}
