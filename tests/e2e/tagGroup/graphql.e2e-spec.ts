import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { AUTH } from '../../testUtils/testingConsts';
import { ITagGroup } from '../../../src/interfaces/tagGroup.interface';
import { TagGroupService } from '../../../src/tagGroup/tagGroup.service';

const CREATE_TAG_GROUP_GQL = `
mutation createTagGroup($tagGroup: TagGroupInputType!) {
    createTagGroup(tagGroup: $tagGroup) {
    id: _id
  }
}
`;

const UPDATE_TAG_GROUP_GQL = `
mutation updateTagGroup($id: String!, $tagGroup: TagGroupInputType!) {
    updateTagGroup(id: $id, tagGroup: $tagGroup) {
    id: _id
  }
}
`;

const DELETE_TAG_GROUP_GQL = `
mutation deleteTagGroup($id: String!) {
    deleteTagGroup(id: $id)
}
`;

const TAG_GROUP_TYPE = 'E2E_TEST';

let tagGroupService: TagGroupService;
let createdTagGroupId: string;
let app: INestApplication;
let token: string;

describe('TagGroup', () => {
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    tagGroupService = moduleRef.get<TagGroupService>(TagGroupService);
    const { config } = JSON.parse(AUTH.AUTH_CONFIG_SECRET_JWKS);
    const secret = config.filter((item) => item.secretOrKey !== undefined);
    token = sign({ sender: TAG_GROUP_TYPE }, secret[0]?.secretOrKey);
  });

  afterAll(async () => {
    try {
      const model = app.get<Model<ITagGroup>>(getModelToken('TagGroup'));
      await model.deleteMany({ title: TAG_GROUP_TYPE }).exec();
    } catch (err) {
      // console.info('Could not deleted created Tag Groups during tests', err);
    }
  });

  describe('createTagGroup', () => {
    it('should create a new tag group and return a 200', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: CREATE_TAG_GROUP_GQL,
          variables: {
            tagGroup: {
              title: TAG_GROUP_TYPE,
            },
          },
        });

      expect(result.status).toBe(200);
      createdTagGroupId = result.body.data.createTagGroup.id;
      const tagGroup = await tagGroupService.findOne(createdTagGroupId);
      expect(tagGroup).toBeTruthy();
    });
  });

  describe('updateTagGroup', () => {
    it('should update a new tag group and return a 200', async () => {
      const NEW_TITLE = 'New Title';
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPDATE_TAG_GROUP_GQL,
          variables: {
            id: createdTagGroupId,
            tagGroup: {
              title: NEW_TITLE,
            },
          },
        });

      expect(result.status).toBe(200);
      const tagGroup = await tagGroupService.findOne(createdTagGroupId);
      expect(tagGroup.title).toEqual(NEW_TITLE);
    });
  });

  describe('deleteTagGroup', () => {
    it('should delete a new tag group and return a 200', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: DELETE_TAG_GROUP_GQL,
          variables: {
            id: createdTagGroupId,
          },
        });

      expect(result.status).toBe(200);

      const tagGroup = await tagGroupService.findOne(createdTagGroupId);
      expect(tagGroup).toBeNull();
    });
  });
});
