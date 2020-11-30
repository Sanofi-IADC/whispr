import { Field, ID, ObjectType } from '@nestjs/graphql';
// eslint-disable-next-line import/no-cycle
import { Tag } from '../tag/tag.entity';
import { TagStatuses } from '../interfaces/status.enum';

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

  @Field(() => String)
  status: TagStatuses;

  @Field(() => [Tag])
  tags: Tag[];
}
