import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TagGroup {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  metalevel: string;

  @Field()
  applicationID: string;

  @Field(() => [String])
  tags: string[];
}
