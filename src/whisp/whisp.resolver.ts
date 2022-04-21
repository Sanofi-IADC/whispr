import {
  Resolver, Query, Mutation, Args, Subscription, Int, ResolveField, Root,
} from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { IWhisp } from '../interfaces/whisp.interface';
import { Whisp } from './whisp.entity';
import { WhispService } from './whisp.service';
import { WhispInputType } from './whisp.input';
import { DistributionService } from '../distribution/distribution.service';
import { filterPayload } from '../utils/filterPayload.service';
import { Tag } from '../tag/tag.entity';
import { TagInputType } from '../tag/tag.input';
import { WhispCount } from './whispCount.entity';

@Resolver(() => Whisp)
@UseGuards(GqlJwtAuthGuard)
export class WhispResolver {
  constructor(
    private readonly whispService: WhispService,
    private readonly distributionService: DistributionService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {
    this.distributionService.whispSubject.subscribe((whisp) => {
      pubSub.publish('whispAdded', { whispAdded: whisp });
    });
  }

  /**
   * Queries
   */

  @Query(() => Whisp, { nullable: true })
  async whispById(@Args('id') id: string): Promise<IWhisp> {
    return this.whispService.findOne(id);
  }

  @Query(() => [Whisp], { nullable: true })
  async whisps(
    @Args('filter', { type: () => GraphQLJSONObject, nullable: true })
      filter?: Record<string, unknown>,
    @Args('sort', { type: () => GraphQLJSONObject, nullable: true })
      sort?: Record<string, unknown>,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<IWhisp[]> {
    return this.whispService.findAll(filter, sort, limit);
  }

  @Query(() => [Whisp], { nullable: true })
  async whispsAuthBeta(
    @Args('filter', { type: () => GraphQLJSONObject, nullable: true })
      filter?: Record<string, unknown>,
    @Args('sort', { type: () => GraphQLJSONObject, nullable: true })
      sort?: Record<string, unknown>,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<IWhisp[]> {
    return this.whispService.findAll(filter, sort, limit);
  }

  @Query(() => [WhispCount])
  async countWhisps(
    @Args('filter', { type: () => [GraphQLJSONObject], nullable: true })
      filter: Record<string, unknown>[],
    @Args('group', { type: () => GraphQLJSONObject, nullable: true })
      group: Record<string, unknown>,
  ): Promise<WhispCount[]> {
    return this.whispService.countWhispsGroup(filter, group);
  }

  /**
   * Mutations
   */

  @Mutation(() => Whisp)
  async createWhisp(@Args('whisp') whisp: WhispInputType): Promise<IWhisp> {
    return this.whispService.create(whisp);
  }

  @Mutation(() => Whisp)
  async updateWhisp(@Args('id') id: string, @Args('whisp') whisp: WhispInputType): Promise<IWhisp> {
    return this.whispService.update(id, whisp);
  }

  @Mutation(() => Whisp)
  async replaceWhisp(@Args('id') id: string, @Args('whisp') whisp: WhispInputType): Promise<IWhisp> {
    return this.whispService.replace(id, whisp);
  }

  @Mutation(() => Boolean)
  async deleteWhisp(@Args('id') id: string): Promise<boolean> {
    return this.whispService.delete(id);
  }

  /**
   * Subscriptions
   */

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Subscription(() => Whisp, {
    filter: (payload, variables) => filterPayload(variables.filter, payload.whispAdded),
  })
  whispAdded(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('filter', { type: () => GraphQLJSONObject }) filter: Record<string, unknown>,
  ): AsyncIterator<IWhisp> {
    return this.pubSub.asyncIterator('whispAdded');
  }

  /**
   * Field resolver
   */
  @ResolveField(() => [Tag])
  async tags(@Root() whisp: Whisp): Promise<TagInputType[]> {
    // eslint-disable-next-line no-underscore-dangle
    return this.whispService.findTagsByWhispId(whisp._id);
  }
}
