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

const UPDATE_WHISP_GQL = `
mutation updateWhisp($id: String!, $whisp: WhispInputType!) {
  updateWhisp(id: $id, whisp: $whisp) {
    _id
  }
}
`;

const DELETE_WHISP_GQL = `
mutation deleteWhisp($id: String!) {
  deleteWhisp(id: $id)
}
`;

const WHISP_TEST_TYPE = 'E2E_TEST';

let fileService: FileService;
let whispService: WhispService;
let createdWhispId: string;

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
      createdWhispId = result.body.data.createWhisp._id;
      expect(createdWhispId).toEqual(expect.any(String));
    });

    it('should upload a file to S3 when attached', async () => {
      const TEST_ATTACHED_FILE_PATH = 'tests/e2e/whisp/attached-file-1.png';
      const TEST_ATTACHED_FILE_CONTENT_LENGTH = 14948;
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

    it('should upload a file which has no MimeType', async () => {
      const TEST_ATTACHED_FILE_PATH = 'tests/e2e/whisp/attached-file-2.txt';
      const TEST_ATTACHED_FILE_CONTENT_LENGTH = 19;
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

  describe('updateWhisp', () => {
    it('should change any field on a whisp and return a 200', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: UPDATE_WHISP_GQL,
          variables: {
            id: createdWhispId,
            whisp: {
              description: WHISP_TEST_TYPE,
            },
          },
        });

      expect(result.status).toBe(200);

      const whisp = await whispService.findOne(createdWhispId);
      expect(whisp.description).toBe(WHISP_TEST_TYPE);
    });
  });

  describe('deleteWhisp', () => {
    it('should delete the whisp and return a 200', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: DELETE_WHISP_GQL,
          variables: {
            id: createdWhispId,
          },
        });

      expect(result.status).toBe(200);
      const whisp = await whispService.findOne(createdWhispId);
      expect(whisp).toBeNull();
    });
  });
});
