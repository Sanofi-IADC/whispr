import {
  Resolver, Query, Mutation, Args, Root, ResolveField,
} from '@nestjs/graphql';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { TagInputType } from './tag.input';
import { TagGroupService } from '../tagGroup/tagGroup.service';
import { ITagGroup } from '../interfaces/tagGroup.interface';
import { ITag } from '../interfaces/tag.interface';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService, private readonly tagGroupService: TagGroupService) {}

  /**
   * Queries
   */

  @Query(() => [Tag], { nullable: true })
  async tags(@Args('tag') tagFilter: TagInputType): Promise<ITag[]> {
    return this.tagService.findAll(tagFilter);
  }

  @Query(() => Tag, { nullable: true })
  async tagById(@Args('id') id: string): Promise<ITag> {
    return this.tagService.findOne(id);
  }

  /**
   * Mutations
   */

  @Mutation(() => Tag)
  async createTag(@Args('tag') tag: TagInputType): Promise<ITag> {
    return this.tagService.create(tag);
  }

  @Mutation(() => Tag)
  async updateTag(@Args('id') id: string, @Args('tag') tag: TagInputType): Promise<ITag> {
    return this.tagService.update(id, tag);
  }

  @Mutation(() => Tag)
  async replaceTag(@Args('id') id: string, @Args('tag') tag: TagInputType): Promise<ITag> {
    return this.tagService.replace(id, tag);
  }

  @Mutation(() => Boolean)
  async deleteTag(@Args('id') id: string): Promise<boolean> {
    return this.tagService.delete(id);
  }

  /**
   * Field resolver
   */
  @ResolveField()
  async tagGroup(@Root() tag: Tag): Promise<ITagGroup> {
    // eslint-disable-next-line no-underscore-dangle
    return this.tagGroupService.findOne(tag.tagGroup._id);
  }
}
