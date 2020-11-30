import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';
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

beforeAll(async () => {
  tagGroupService = global.app.get<TagGroupService>('TagGroupService');
});

afterAll(async () => {
  try {
    const model = global.app.get<Model<ITagGroup>>(getModelToken('TagGroup'));
    await model.deleteMany({ title: TAG_GROUP_TYPE });
  } catch (e) {
    console.info('Could not deleted created Tag Groups during tests', e);
  }
});

describe('createTagGroup', () => {
  it('should create a new tag group and return a 200', async () => {
    const result = await request(global.app.getHttpServer())
      .post('/graphql')
      .send({
        query: CREATE_TAG_GROUP_GQL,
        variables: {
          tagGroup: {
            title: TAG_GROUP_TYPE
          }
        }
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
      .send({
        query: UPDATE_TAG_GROUP_GQL,
        variables: {
          id: createdTagGroupId,
          tagGroup: {
            title: NEW_TITLE
          }
        }
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
      .send({
        query: DELETE_TAG_GROUP_GQL,
        variables: {
          id: createdTagGroupId
        }
      });

    expect(result.status).toBe(200);

    const tagGroup = await tagGroupService.findOne(createdTagGroupId);
    expect(tagGroup).toBeNull();
  });
});
