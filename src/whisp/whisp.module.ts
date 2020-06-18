import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistributionModule } from '../distribution/distribution.module';
import { FileModule } from '../file/file.module';
import { SequenceModule } from '../sequence/sequence.module';
import { PubSubModule } from '../pubSub/pubSub.module';

import { whispSchema } from './whisp.schema';
import { WhispService } from './whisp.service';
import { WhispResolver } from './whisp.resolver';
import { WhispController } from './whisp.controller';

@Module({
  imports: [
    PubSubModule,
    MongooseModule.forFeature([{ name: 'Whisp', schema: whispSchema }]),
    DistributionModule,
    FileModule,
    SequenceModule,
  ],
  controllers: [WhispController],
  providers: [WhispService, WhispResolver],
  exports: [WhispService],
})
export class WhispModule {}
