import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { TagStatuses } from '../interfaces/status.enum';

@InputType({ description: 'New Tag Group' })
export class TagGroupInputType {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  _id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  metalevel?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  applicationID?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  status?: TagStatuses;
}
