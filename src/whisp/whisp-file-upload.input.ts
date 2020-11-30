import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, ValidatePromise, IsString } from 'class-validator';
import { GraphQLUpload } from 'apollo-server-fastify';
import { GqlFileUpload } from '../interfaces/gql-file-upload.interface';

@InputType()
export class WhispFileUpload {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  oldFile?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  @ValidatePromise()
  newFile?: Promise<GqlFileUpload>;
}
