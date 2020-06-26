import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class Whisp {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  readableID: string;

  @Field({ nullable: true })
  type: string;

  @Field(() => Int, { nullable: true })
  severity: number;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  closed: boolean;

  @Field({ nullable: true })
  applicationID: string;

  @Field({ nullable: true })
  plantID: string;

  @Field({ nullable: true })
  locationID: string;

  @Field({ nullable: true })
  manual: boolean;

  @Field({ nullable: true })
  openedBy: string;

  @Field({ nullable: true })
  openedById: string;

  @Field({ nullable: true })
  closedBy: string;

  @Field({ nullable: true })
  closedById: string;

  @Field({ nullable: true })
  timestamp: string;

  @Field({ nullable: true })
  updated: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  data: any;
}
