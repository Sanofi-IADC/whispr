/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, Int, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  IsBoolean, IsInt, IsObject, IsOptional, IsString, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WhispAttachmentInput } from './whisp-attachment.input';
import { TagInputType } from '../tag/tag.input';

@InputType({ description: 'New whisp data' })
export class WhispInputType {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  readableID: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  type: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  severity: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  closed: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  applicationID: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  plantID: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  locationID: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  manual: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  openedBy: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  openedById: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  closedBy: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  closedById: string;

  @Field(() => Date, { nullable: true })
  @IsString()
  @IsOptional()
  timestamp: Date;

  @Field(() => Date, { nullable: true })
  @IsString()
  @IsOptional()
  updated: Date;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsObject()
  @IsOptional()
  data: any;

  @Field(() => [WhispAttachmentInput], { nullable: true })
  @IsObject({ each: true })
  @IsOptional({ each: true })
  @ValidateNested({ each: true })
  @Type(() => WhispAttachmentInput)
  attachments: WhispAttachmentInput[];

  @Field(() => [TagInputType], { nullable: true })
  @IsObject()
  @IsOptional()
  tags: TagInputType[];
}
