import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { IsString, IsOptional, IsObject } from 'class-validator';

@InputType()
export class WebhookInputType {
  @Field(() => String)
  @IsString()
  url: string;

  @Field(() => [String])
  @IsString({ each: true })
  events: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @IsObject()
  filter: Record<string, unknown>;
}
