import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { IWhisp } from 'src/interfaces/whisp.interface';
import { WhispService } from 'src/whisp/whisp.service';
import request from 'supertest';

const CREATE_WHISP_GQL = `
mutation createWhisp($whisp: WhispInputType!) {
  createWhisp(whisp: $whisp) {
    _id
  }
}
`;

const WHISP_TEST_TYPE = 'E2E_TEST';
const TEST_ATTACHED_FILE_PATH = 'tests/e2e/whisp/attached-file-1.png';
const TEST_ATTACHED_FILE_CONTENT_LENGTH = 14948;

let fileService: FileService;
let whispService: WhispService;

beforeAll(async () => {
  whispService = global.app.get<WhispService>('WhispService');
  fileService = global.app.get<FileService>('FileService');
});

afterAll(async () => {
  try {
    const model = global.app.get<Model<IWhisp>>(getModelToken('Whisp'));
    await model.deleteMany({ type: WHISP_TEST_TYPE });
  } catch {}
});

describe('GRAPHQL WhispModule (e2e)', () => {
  describe('createWhisp', () => {
    it('should return a 200 and create a new Whisp and return its id', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: CREATE_WHISP_GQL,
          variables: {
            whisp: {
              type: WHISP_TEST_TYPE,
            },
          },
        });

      expect(result.status).toBe(200);
      expect(result.body).toEqual(
        expect.objectContaining({
          data: { createWhisp: { _id: expect.any(String) } },
        }),
      );
    });

    it('should upload a file to S3 when attached', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .field(
          'operations',
          JSON.stringify({
            query: CREATE_WHISP_GQL,
            variables: {
              whisp: {
                type: WHISP_TEST_TYPE,
                attachments: [{ file: { newFile: null } }],
              },
            },
          }),
        )
        .field(
          'map',
          JSON.stringify({
            file: ['variables.whisp.attachments.0.file.newFile'],
          }),
        )
        .attach('file', TEST_ATTACHED_FILE_PATH);

      expect(result.status).toBe(200);

      const whisp = await whispService.findOne(result.body.data.createWhisp._id);
      const file = await fileService.getFile(whisp.attachments[0].file);

      expect(file.ContentLength).toBe(TEST_ATTACHED_FILE_CONTENT_LENGTH);
    });
  });
});
