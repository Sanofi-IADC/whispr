import { Field, ID, ObjectType } from '@nestjs/graphql';
// eslint-disable-next-line import/no-cycle
import { TagGroup } from '../tagGroup/tagGroup.entity';
import { TagStatuses } from '../interfaces/status.enum';

@ObjectType()
export class Tag {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  status: TagStatuses;

  // @Field(() => String)
  // tagGroupId: string;

  @Field(() => TagGroup)
  tagGroup: TagGroup;
}
