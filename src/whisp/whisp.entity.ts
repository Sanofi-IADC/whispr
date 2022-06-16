/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Tag } from '../tag/tag.entity';
import { WhispAttachment } from './whisp-attachment.entity';

@ObjectType()
export class Whisp {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  readableID?: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => Int, { nullable: true })
  severity?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  closed?: boolean;

  @Field({ nullable: true })
  applicationID?: string;

  @Field({ nullable: true })
  plantID?: string;

  @Field({ nullable: true })
  locationID?: string;

  @Field({ nullable: true })
  manual?: boolean;

  @Field({ nullable: true })
  openedBy?: string;

  @Field({ nullable: true })
  openedById?: string;

  @Field({ nullable: true })
  closedBy?: string;

  @Field({ nullable: true })
  closedById?: string;

  @Field({ nullable: true })
  timestamp?: Date;

  @Field({ nullable: true })
  updated?: Date;

  @Field({ nullable: true })
  expirationDate?: Date;

  @Field({ nullable: true })
  timeToLiveSec?: number;

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  data?: any;

  @Field(() => [WhispAttachment], { nullable: true })
  attachments?: WhispAttachment[];
}
