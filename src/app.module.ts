import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { DistributionService } from './distribution/distribution.service';
import { WhispService } from './whisp/whisp.service';
import { WhispController } from './whisp/whisp.controller';
import { ConfigService } from './config/config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { WhispResolver } from './whisp/whisp.resolver';
import { whispSchema, sequenceSchema, tagGroupSchema } from './schema';
import { SequenceService } from './sequence/sequence.service';
import { TagGroupController } from './tagGroup/tagGroup.controller';
import { TagGroupService } from './tagGroup/tagGroup.service';
import { TagGroupResolver } from './tagGroup/tagGroup.resolver';
import { FileService } from './file/file.service';
import { FileController } from './file/file.controller';
import { AWSCredsModule } from './auth/aws-creds.module';

import Redis = require('ioredis');

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
      useFactory: async (configService: ConfigService) => configService.getMongooseOptions(),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Whisp', schema: whispSchema },
      { name: 'Sequence', schema: sequenceSchema },
      { name: 'TagGroup', schema: tagGroupSchema },
    ]),
    ConfigModule,
    AWSCredsModule,
  ],
  providers: [
    AppService,
    ConfigService,
    WhispService,
    DistributionService,
    FileService,
    WhispResolver,
    SequenceService,
    {
      provide: 'PUB_SUB',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => new RedisPubSub({
        publisher: new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        }),
        subscriber: new Redis({
          host: configService.get('REDIS_HOST_READ'),
          port: configService.get('REDIS_PORT_READ'),
        }),
      }),
    },
    TagGroupService,
    TagGroupResolver,
  ],
  controllers: [AppController, WhispController, FileController, TagGroupController],
})
export class AppModule { }
