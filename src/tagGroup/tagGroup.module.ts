import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistributionModule } from '../distribution/distribution.module';
import { FileModule } from '../file/file.module';
import { SequenceModule } from '../sequence/sequence.module';

import { tagGroupSchema } from './tagGroup.schema';
import { TagGroupService } from './tagGroup.service';
import { TagGroupResolver } from './tagGroup.resolver';
import { TagGroupController } from './tagGroup.controller';
import { TagService } from '../tag/tag.service';
import { tagSchema } from '../tag/tag.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TagGroup', schema: tagGroupSchema }]),
    MongooseModule.forFeature([{ name: 'Tag', schema: tagSchema }]),
    DistributionModule,
    FileModule,
    SequenceModule
  ],
  controllers: [TagGroupController],
  providers: [TagGroupService, TagService, TagGroupResolver],
  exports: [TagGroupService]
})
export class TagGroupModule {}
