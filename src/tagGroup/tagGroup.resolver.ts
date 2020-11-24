import {
  Resolver, Query, Mutation, Args,
} from '@nestjs/graphql';
import { ITagGroup } from '../interfaces/tagGroup.interface';
import { TagGroup } from './tagGroup.entity';
import { TagGroupService } from './tagGroup.service';
import { TagGroupInputType } from './tagGroup.input';

@Resolver(() => TagGroup)
export class TagGroupResolver {
  constructor(private tagGroupService: TagGroupService) {}

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
  async updateTagGroup(@Args('id') id: string, @Args('tagGroup') tagGroup: TagGroupInputType): Promise<ITagGroup> {
    return this.tagGroupService.update(id, tagGroup);
  }

  @Mutation(() => TagGroup)
  async replaceTagGroup(@Args('id') id: string, @Args('tagGroup') tagGroup: TagGroupInputType): Promise<ITagGroup> {
    return this.tagGroupService.replace(id, tagGroup);
  }

  @Mutation(() => Boolean)
  async deleteTagGroup(@Args('id') id: string): Promise<boolean> {
    await this.tagGroupService.delete(id);
    return true;
  }
}
