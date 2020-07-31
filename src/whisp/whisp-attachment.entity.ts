import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, ValidatePromise } from 'class-validator';

@ObjectType()
export class WhispAttachment {
  @Field({ description: 'Mapping of the file to a location in the data attribute', nullable: true })
  @IsString()
  dataMappingPath?: string;

  @Field({ description: 'Key in S3-Bucket. Call via API: <whispr-Backend>/file/<S3-Key>' })
  @ValidatePromise()
  file: string;
}
