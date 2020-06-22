import {
  Resolver, Query, Mutation, Args, Subscription, Int,
} from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { isEqual } from 'lodash';
import { Whisp } from './whisp.entity';
import { WhispService } from './whisp.service';
import { WhispInputType } from './whisp.input';
import { DistributionService } from '../distribution/distribution.service';

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
    @Args('filter', { type: () => GraphQLJSONObject, nullable: true }) filter?: object,
    @Args('sort', { type: () => GraphQLJSONObject, nullable: true }) sort?: object,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.whispService.findAll(filter, sort, limit);
  }

  @Query(() => Number)
  async whispsCount(
    @Args('filter', { type: () => GraphQLJSONObject, nullable: true }) filter?: object
  ) {
    return (await this.whisps(filter)).length;
  }

  /**
   * Mutations
   */

  @Mutation(() => Whisp)
  async createWhisp(@Args('whisp') whisp: WhispInputType) {
    return this.whispService.create(whisp);
  }

  @Mutation(() => Whisp)
  async updateWhisp(
    @Args('id') id: string,
    @Args('whisp') whisp: WhispInputType,
  ) {
    return this.whispService.update(id, whisp);
  }

  @Mutation(() => Whisp)
  async replaceWhisp(
    @Args('id') id: string,
    @Args('whisp') whisp: WhispInputType,
  ) {
    return this.whispService.replace(id, whisp);
  }

  @Mutation(() => Boolean)
  async deleteWhisp(@Args('id') id: string) {
    await this.whispService.delete(id);
    return true;
  }

  /**
   * Subscriptions
   */

  @Subscription(() => Whisp, {
    filter: (payload, variables) => WhispResolver.filter(variables.filter, payload.whispAdded),
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  whispAdded(@Args('filter', { type: () => GraphQLJSONObject }) filter: object) {
    return this.pubSub.asyncIterator('whispAdded');
  }

  /**
   * functions
   */
  public static filter(filter, payload) {
    if (!filter) {
      return true;
    }

    return Object.keys(filter).every((key) => {
      const filterValue = filter[key];

      if (filterValue === undefined || payload === undefined) {
        return false;
      }

      const keyArray = key.split('.');
      if (keyArray.length !== 1) {
        return this.payloadMatchesNestedValue(keyArray, filterValue, payload);
      }

      return this.matches(filterValue, payload[key]);
    });
  }

  public static matches(filterValue, elementValue) {
    if (Array.isArray(filterValue)) {
      return filterValue.some((value) => this.matches(value, elementValue));
    }

    return isEqual(filterValue, elementValue);
  }

  public static payloadMatchesNestedValue(keyArray, nestedValue, payload) {
    let currentObj = payload;

    while (keyArray.length > 1) {
      const key = keyArray.shift();

      if (!currentObj[key]) {
        return false;
      }
      currentObj = currentObj[key];
    }

    return this.matches(nestedValue, currentObj[keyArray.shift()]);
  }
}
