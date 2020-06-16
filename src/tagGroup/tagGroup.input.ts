import { InputType, Field } from '@nestjs/graphql';
import { TagGroup } from './tagGroup.entity';

@InputType({ description: 'New Tag Group' })
export class TagGroupInputType implements Partial<TagGroup> {
  @Field(() => String, { nullable: true })
  _id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  metalevel: string;

  @Field({ nullable: true })
  applicationID: string;

  @Field(() => [String], { nullable: true })
  tags: string[];
}
