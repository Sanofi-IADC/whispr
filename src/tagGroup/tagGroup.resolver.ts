import {
  Resolver, Query, Mutation, Args, ResolveField, Root,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ITagGroup } from '../interfaces/tagGroup.interface';
import { TagGroup } from './tagGroup.entity';
import { TagGroupService } from './tagGroup.service';
import { TagGroupInputType } from './tagGroup.input';
import { Tag } from '../tag/tag.entity';
import { TagService } from '../tag/tag.service';
import { ITag } from '../interfaces/tag.interface';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';

@Resolver(() => TagGroup)
@UseGuards(GqlJwtAuthGuard)
export class TagGroupResolver {
  constructor(
    private readonly tagGroupService: TagGroupService,
    private readonly tagService: TagService,
  ) {}

  /**
   * Queries
   */

  @Query(() => [TagGroup], { nullable: true })
  async tagGroups(@Args('tagGroup') tagGroupFilter: TagGroupInputType): Promise<ITagGroup[]> {
    return this.tagGroupService.findAll(tagGroupFilter);
  }

  @Query(() => TagGroup, { nullable: true })
  async tagGroupById(@Args('id') id: string): Promise<ITagGroup> {
    return this.tagGroupService.findOne(id);
  }

  /**
   * Mutations
   */

  @Mutation(() => TagGroup)
  async createTagGroup(@Args('tagGroup') tagGroup: TagGroupInputType): Promise<ITagGroup> {
    return this.tagGroupService.create(tagGroup);
  }

  @Mutation(() => TagGroup)
  async updateTagGroup(
    @Args('id') id: string,
    @Args('tagGroup') tagGroup: TagGroupInputType,
  ): Promise<ITagGroup> {
    return this.tagGroupService.update(id, tagGroup);
  }

  @Mutation(() => TagGroup)
  async replaceTagGroup(
    @Args('id') id: string,
    @Args('tagGroup') tagGroup: TagGroupInputType,
  ): Promise<ITagGroup> {
    return this.tagGroupService.replace(id, tagGroup);
  }

  @Mutation(() => Boolean)
  async deleteTagGroup(@Args('id') id: string): Promise<boolean> {
    return this.tagGroupService.delete(id);
  }

  /**
   * Field resolver
   */
  @ResolveField(() => [Tag])
  async tags(@Root() tagGroup: TagGroup): Promise<ITag[]> {
    // eslint-disable-next-line no-underscore-dangle
    return this.tagService.findAll({ tagGroup: { _id: tagGroup._id } });
  }
}
