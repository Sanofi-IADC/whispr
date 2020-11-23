import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITagGroup } from 'src/interfaces/tagGroup.interface';
import { TagGroupService } from 'src/tagGroup/tagGroup.service';
import request from 'supertest';

const CREATE_TAG_GROUP_GQL = `
mutation createTagGroup($tagGroup: TagGroupInputType!) {
    createTagGroup(tagGroup: $tagGroup) {
    _id
  }
}
`;

const UPDATE_TAG_GROUP_GQL = `
mutation updateTagGroup($id: String!, $tagGroup: TagGroupInputType!) {
    updateTagGroup(id: $id, tagGroup: $tagGroup) {
    _id
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
  } catch {}
});

describe('createTagGroup', () => {
  it('should create a new tag group and return a 200', async () => {
    const result = await request(global.app.getHttpServer())
      .post('/graphql')
      .send({
        query: CREATE_TAG_GROUP_GQL,
        variables: {
          tagGroup: {
            title: TAG_GROUP_TYPE,
          },
        },
      });

    expect(result.status).toBe(200);
    createdTagGroupId = result.body.data.createTagGroup._id;
    const tagGroup = await tagGroupService.findOne(createdTagGroupId);
    expect(tagGroup).toBeTruthy();
  });
});

describe('updateTagGroup', () => {
  it('should update a new tag group and return a 200', async () => {
    const result = await request(global.app.getHttpServer())
      .post('/graphql')
      .send({
        query: UPDATE_TAG_GROUP_GQL,
        variables: {
          id: createdTagGroupId,
          tagGroup: {
            tags: [TAG_GROUP_TYPE],
          },
        },
      });

    expect(result.status).toBe(200);
    const tagGroup = await tagGroupService.findOne(createdTagGroupId);
    expect(tagGroup.tags).toEqual(expect.arrayContaining([TAG_GROUP_TYPE]));
  });
});

describe('deleteTagGroup', () => {
  it('should delete a new tag group and return a 200', async () => {
    const result = await request(global.app.getHttpServer())
      .post('/graphql')
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
