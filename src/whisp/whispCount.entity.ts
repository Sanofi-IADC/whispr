/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Field, ID, Int, ObjectType,
} from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class WhispCount {
  @Field(() => GraphQLJSONObject, { nullable: true }) 
  _id: any;

  @Field(() => Int)
  count: number;
}