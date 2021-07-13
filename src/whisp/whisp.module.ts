import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistributionModule } from '../distribution/distribution.module';
import { FileModule } from '../file/file.module';
import { SequenceModule } from '../sequence/sequence.module';
import { PubSubModule } from '../pubSub/pubSub.module';
import { EventModule } from '../event/event.module';

import { whispSchema } from './whisp.schema';
import { WhispService } from './whisp.service';
import { WhispResolver } from './whisp.resolver';
import { WhispController } from './whisp.controller';

@Module({
  imports: [
    PubSubModule,
    MongooseModule.forFeatureAsync([{
      name: 'Whisp', useFactory: () => {
        const schema = whispSchema
        schema.plugin(require('mongoose-cast-aggregation'));
        return schema;
      },
    }]),
    DistributionModule,
    FileModule,
    SequenceModule,
    EventModule,
  ],
  controllers: [WhispController],
  providers: [WhispService, WhispResolver],
  exports: [WhispService],
})
export class WhispModule { }
