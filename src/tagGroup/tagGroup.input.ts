import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { TagGroup } from './tagGroup.entity';

@InputType({ description: 'New Tag Group' })
export class TagGroupInputType implements Partial<TagGroup> {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  _id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  metalevel: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  applicationID: string;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}
