import {
  Resolver, Query, Mutation, Args, Subscription, Int,
} from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { Whisp } from './whisp.entity';
import { WhispService } from './whisp.service';
import { WhispInputType } from './whisp.input';
import { DistributionService } from '../distribution/distribution.service';
import { filterPayload } from '../utils/filterPayload.service';

@Resolver(() => Whisp)
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
  async whispById(@Args('id') id: string) {
    return this.whispService.findOne(id);
  }

  @Query(() => [Whisp], { nullable: true })
  async whisps(
    @Args('filter', { type: () => GraphQLJSONObject, nullable: true })
      filter?: Record<string, unknown>,
    @Args('sort', { type: () => GraphQLJSONObject, nullable: true })
      sort?: Record<string, unknown>,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.whispService.findAll(filter, sort, limit);
  }

  @Query(() => Number)
  async whispsCount(
    @Args('filter', { type: () => GraphQLJSONObject, nullable: true })
      filter?: Record<string, unknown>,
  ) {
    return this.whispService.countWhisps(filter);
  }

  /**
   * Mutations
   */

  @Mutation(() => Whisp)
  async createWhisp(@Args('whisp') whisp: WhispInputType) {
    return this.whispService.create(whisp);
  }

  @Mutation(() => Whisp)
  async updateWhisp(@Args('id') id: string, @Args('whisp') whisp: WhispInputType) {
    return this.whispService.update(id, whisp);
  }

  @Mutation(() => Whisp)
  async replaceWhisp(@Args('id') id: string, @Args('whisp') whisp: WhispInputType) {
    return this.whispService.replace(id, whisp);
  }

  @Mutation(() => Boolean)
  async deleteWhisp(@Args('id') id: string) {
    return this.whispService.delete(id);
  }

  /**
   * Subscriptions
   */

  @Subscription(() => Whisp, {
    filter: (payload, variables) => filterPayload(variables.filter, payload.whispAdded),
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  whispAdded(@Args('filter', { type: () => GraphQLJSONObject }) filter: Record<string, unknown>) {
    return this.pubSub.asyncIterator('whispAdded');
  }
}
