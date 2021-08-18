import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITag } from 'src/interfaces/tag.interface';
import { TagService } from 'src/tag/tag.service';
import { TagGroupService } from 'src/tagGroup/tagGroup.service';
import request from 'supertest';

const CREATE_TAG_GQL = `
mutation createTag($tag: TagInputType!) {
    createTag(tag: $tag) {
    id: _id
  }
}
`;

const UPDATE_TAG_GQL = `
mutation updateTag($id: String!, $tag: TagInputType!) {
    updateTag(id: $id, tag: $tag) {
    id: _id
  }
}
`;

const DELETE_TAG_GQL = `
mutation deleteTag($id: String!) {
    deleteTag(id: $id)
}
`;

const TAG_TITLE = 'E2E_TEST';

let tagService: TagService;
let tagGroupService: TagGroupService;
let createdTagId: string;
let tagGroupId: string;

describe ('Tags', () => {
  beforeAll(async () => {
    tagService = global.app.get<TagService>('TagService');
    tagGroupService = global.app.get<TagGroupService>('TagGroupService');

    const tagGroup = await tagGroupService.create({
      title: TAG_TITLE,
    });
    // eslint-disable-next-line no-underscore-dangle
    tagGroupId = tagGroup._id;
  });

  afterAll(async () => {
    try {
      const model = global.app.get<Model<ITag>>(getModelToken('Tag'));
      await model.deleteMany({ title: TAG_TITLE }).exec();
    } catch (e) {
      console.info('Could not deleted created Tag Groups during tests', e);
    }
  });

  describe('createTag', () => {
    it('should create a new tag and return a 200', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: CREATE_TAG_GQL,
          variables: {
            tag: {
              title: TAG_TITLE,
              tagGroup: {
                _id: tagGroupId,
              },
            },
          },
        });

      expect(result.status).toBe(200);
      createdTagId = result.body.data.createTag.id;
      const tag = await tagService.findOne(createdTagId);
      expect(tag).toBeTruthy();
    });
  });

  describe('updateTag', () => {
    it('should update a new tag and return a 200', async () => {
      const NEW_TITLE = 'New Title';
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: UPDATE_TAG_GQL,
          variables: {
            id: createdTagId,
            tag: {
              title: NEW_TITLE,
            },
          },
        });

      expect(result.status).toBe(200);
      const tag = await tagService.findOne(createdTagId);
      expect(tag.title).toEqual(NEW_TITLE);
    });
  });

  describe('deleteTag', () => {
    it('should delete a new tag and return a 200', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: DELETE_TAG_GQL,
          variables: {
            id: createdTagId,
          },
        });

      expect(result.status).toBe(200);

      const tag = await tagService.findOne(createdTagId);
      expect(tag).toBeNull();
    });
  });
});
