import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { TagGroupInputType } from '../tagGroup/tagGroup.input';
import { TagStatuses } from '../interfaces/status.enum';

@InputType({ description: 'New Tag' })
export class TagInputType {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  _id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  status?: TagStatuses;

  @Field(() => TagGroupInputType, { nullable: true })
  @IsString()
  @IsOptional()
  tagGroup?: TagGroupInputType;
}
