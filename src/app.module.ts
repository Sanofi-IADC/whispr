import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { AWSCredsModule } from './auth/aws-creds.module';
import { ConfigModule } from './config/config.module';
import { DistributionModule } from './distribution/distribution.module';
import { EventModule } from './event/event.module';
import { FileModule } from './file/file.module';
import { PubSubModule } from './pubSub/pubSub.module';
import { SequenceModule } from './sequence/sequence.module';
import { TagGroupModule } from './tagGroup/tagGroup.module';
import { WhispModule } from './whisp/whisp.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { WebhookModule } from './webhook/webhook.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: configService.get('AUTO_SCHEMA_FILE'),
        introspection: configService.get('INTROSPECTION'),
        playground: configService.get('PLAYGROUND'),
        installSubscriptionHandlers: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.getMongooseOptions(),
      inject: [ConfigService],
    }),
    PubSubModule,
    WhispModule,
    TagGroupModule,
    TagModule,
    SequenceModule,
    ConfigModule,
    AWSCredsModule,
    FileModule,
    DistributionModule,
    EventModule,
    WebhookModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
