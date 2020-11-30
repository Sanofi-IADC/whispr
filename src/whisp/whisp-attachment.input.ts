import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { WhispFileUpload } from './whisp-file-upload.input';

@InputType()
export class WhispAttachmentInput {
  @Field({
    description: 'Mapping of the file to a location in the data attribute',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  dataMappingPath?: string;

  @Field()
  @Type(() => WhispFileUpload)
  @IsObject()
  file: WhispFileUpload;
}
