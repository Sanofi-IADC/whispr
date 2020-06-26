import { Field, Int, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Whisp } from './whisp.entity';

@InputType({ description: 'New whisp data' })
export class WhispInputType implements Partial<Whisp> {
  @Field(() => String, { nullable: true })
  _id: string;

  @Field(() => String, { nullable: true })
  readableID: string;

  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => Int, { nullable: true })
  severity: number;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Boolean, { nullable: true })
  closed: boolean;

  @Field(() => String, { nullable: true })
  applicationID: string;

  @Field(() => String, { nullable: true })
  plantID: string;

  @Field(() => String, { nullable: true })
  locationID: string;

  @Field(() => Boolean, { nullable: true })
  manual: boolean;

  @Field(() => String, { nullable: true })
  openedBy: string;

  @Field(() => String, { nullable: true })
  openedById: string;

  @Field(() => String, { nullable: true })
  closedBy: string;

  @Field(() => String, { nullable: true })
  closedById: string;

  @Field(() => Date, { nullable: true })
  timestamp: string;

  @Field(() => Date, { nullable: true })
  updated: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  data: any;
}
