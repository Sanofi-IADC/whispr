import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistributionService } from '../distribution/distribution.service';
import { FileModule } from '../file/file.module';
import { SequenceService } from '../sequence/sequence.service';

import { whispSchema } from './whisp.schema';
import { WhispService } from './whisp.service';
import { WhispController } from './whisp.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Whisp', schema: whispSchema }]),
    DistributionService,
    FileModule,
    SequenceService,
  ],
  controllers: [WhispController],
  providers: [WhispService],
  exports: [WhispService],
})
export class WhispModule {}
