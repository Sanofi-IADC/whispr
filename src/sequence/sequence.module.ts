import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { sequenceSchema } from './sequence.schema';
import { SequenceService } from './sequence.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sequence', schema: sequenceSchema }]),
  ],
  providers: [SequenceService],
  exports: [SequenceService],
})
export class SequenceModule {}
