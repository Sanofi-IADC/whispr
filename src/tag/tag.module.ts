import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistributionModule } from '../distribution/distribution.module';
import { FileModule } from '../file/file.module';
import { SequenceModule } from '../sequence/sequence.module';

import { tagSchema } from './tag.schema';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { TagController } from './tag.controller';
import { TagGroupService } from '../tagGroup/tagGroup.service';
import { tagGroupSchema } from '../tagGroup/tagGroup.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tag', schema: tagSchema }]),
    MongooseModule.forFeature([{ name: 'TagGroup', schema: tagGroupSchema }]),
    DistributionModule,
    FileModule,
    SequenceModule,
  ],
  controllers: [TagController],
  providers: [TagService, TagGroupService, TagResolver],
  exports: [TagService],
})
export class TagModule {}
