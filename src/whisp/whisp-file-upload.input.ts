import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, ValidatePromise, IsString } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class WhispFileUpload {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  oldFile?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  @ValidatePromise()
  newFile?: Promise<FileUpload>;
}
