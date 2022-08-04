/* eslint-disable class-methods-use-this */
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { FileUpload } from 'graphql-upload';
import { WhispAttachment } from '../../../src/whisp/whisp-attachment.entity';
import { FileService } from '../../../src/file/file.service';
import { WhispService } from '../../../src/whisp/whisp.service';
import { WhispAttachmentInput } from '../../../src/whisp/whisp-attachment.input';

class MockFileService extends FileService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getFile(url: string): Promise<GetObjectOutput> {
    throw Error('This function should me mocked');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async saveFile(file: FileUpload, path: string): Promise<string> {
    throw Error('this function should be mocked');
  }
}

describe('Whisp-Service', () => {
  let fileService: FileService;
  let whispService: WhispService;
  beforeEach(async () => {
    fileService = new MockFileService(undefined, undefined);
    whispService = new WhispService(undefined, undefined, fileService, undefined, undefined);
  });

  describe('replaceFiles', () => {
    const S3Key = 'S3TestKey';
    const readableId = 'readableId';

    beforeEach(() => {
      jest.spyOn(fileService, 'saveFile').mockResolvedValue(S3Key);
    });

    it('should return undefined if no Array was passed as attachment', async () => {
      const attachments = {} as any;

      const result = await whispService.replaceFiles(attachments, readableId);

      expect(result).toBeUndefined();
    });

    it('should return Attachment if "old"-AttachmentInput is passed', async () => {
      const attachments: WhispAttachmentInput[] = [
        {
          dataMappingPath: 'TestPath',
          file: {
            oldFile: 'OldFile.jpg',
          },
        },
      ];
      const expectedResult: WhispAttachment[] = [
        {
          dataMappingPath: 'TestPath',
          file: 'OldFile.jpg',
        },
      ];

      const result = await whispService.replaceFiles(attachments, readableId);

      expect(result).toEqual(expectedResult);
    });

    it('should call fileService if "new"-AttachmentInput is passed', async () => {
      const file = { test: 'TestFile' } as any;
      const attachments: WhispAttachmentInput[] = [
        {
          dataMappingPath: 'TestPath',
          file: {
            newFile: Promise.resolve(file),
          },
        },
      ];

      await whispService.replaceFiles(attachments, readableId);

      expect(fileService.saveFile).toHaveBeenCalledTimes(1);
      expect(fileService.saveFile).toHaveBeenCalledWith(
        file,
        `${readableId}/${attachments[0].dataMappingPath}`,
      );
    });

    it('should return attachment if "new"-AttachmentInput is passed', async () => {
      const file = { test: 'TestFile' } as any;
      const attachments: WhispAttachmentInput[] = [
        {
          dataMappingPath: 'TestPath',
          file: {
            newFile: Promise.resolve(file),
          },
        },
      ];
      const expectedResult: WhispAttachment[] = [
        {
          dataMappingPath: 'TestPath',
          file: S3Key,
        },
      ];

      const result = await whispService.replaceFiles(attachments, readableId);

      expect(result).toEqual(expectedResult);
    });
  });
});
