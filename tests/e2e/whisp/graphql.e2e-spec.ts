import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { AUTH } from '../../testUtils/testingConsts';
import { FileService } from '../../../src/file/file.service';
import { IWhisp } from '../../../src/interfaces/whisp.interface';
import { WhispService } from '../../../src/whisp/whisp.service';

const CREATE_WHISP_GQL = `
mutation createWhisp($whisp: WhispInputType!) {
  createWhisp(whisp: $whisp) {
    _id
    timestamp
  }
}
`;

const UPDATE_WHISP_GQL = `
mutation updateWhisp($id: String!, $whisp: WhispInputType!) {
  updateWhisp(id: $id, whisp: $whisp) {
    id: _id
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
let token: string;

describe('Whisps', () => {
  let moduleRef: TestingModule;
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    whispService = moduleRef.get<WhispService>(WhispService);
    fileService = moduleRef.get<FileService>(FileService);
    const { config } = JSON.parse(AUTH.AUTH_CONFIG_SECRET_JWKS);
    const secret = config.filter((item) => item.secretOrKey !== undefined);
    token = sign({ sender: WHISP_TEST_TYPE }, secret[0]?.secretOrKey);
  });

  afterAll(async () => {
    const model = moduleRef.get<Model<IWhisp>>(getModelToken('Whisp'));
    await model.deleteMany({ type: WHISP_TEST_TYPE }).exec();
  });

  describe('GRAPHQL WhispModule (e2e)', () => {
    describe('createWhisp', () => {
      it('should return a 200 and create a new Whisp and return its id', async () => {
        const result = await request(global.app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
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
      it('should keep ISO-String when a timestamp is provided', async () => {
        const now = new Date();
        const result = await request(global.app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query: CREATE_WHISP_GQL,
            variables: {
              whisp: {
                type: WHISP_TEST_TYPE,
                timestamp: now,
              },
            },
          });

        expect(result.status).toBe(200);
        const createdWhispTimestamp = result.body.data.createWhisp.timestamp;
        expect(createdWhispTimestamp).toEqual(now.toISOString());
      });

      function runFileTest(fileName: string, filePath: string, fileLength: number) {
        it(`should upload ${fileName} to S3 when attached`, async () => {
          const result = await request(global.app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
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
            .attach('file', filePath);

          expect(result.status).toBe(200);
          const whisp = await whispService.findOne(result.body.data.createWhisp._id);
          const file = await fileService.getFile(whisp.attachments[0].file);

          expect(file.ContentLength).toBe(fileLength);
        });
      }
      runFileTest('attached-file-1.png', 'tests/e2e/whisp/attached-file-1.png', 14948);
      runFileTest('attached-file-2.txt', 'tests/e2e/whisp/attached-file-2.txt', 19);
    });

    describe('updateWhisp', () => {
      it('should change any field on a whisp and return a 200', async () => {
        const result = await request(global.app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
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

      it('should preserve attachment field when not provided', async () => {
        const createResult = await request(global.app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
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
          .attach('file', 'tests/e2e/whisp/attached-file-1.png');
        await request(global.app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query: UPDATE_WHISP_GQL,
            variables: {
              id: createResult.body.data.createWhisp._id,
              whisp: {
                description: WHISP_TEST_TYPE,
              },
            },
          });

        const whisp = await whispService.findOne(createResult.body.data.createWhisp._id);
        expect(whisp.attachments).toHaveLength(1);
      });
    });

    describe('deleteWhisp', () => {
      it('should delete the whisp and return a 200', async () => {
        const result = await request(global.app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
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
});
