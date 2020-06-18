import { Module } from '@nestjs/common';
import Redis = require('ioredis');

import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PUB_SUB',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        new RedisPubSub({
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
  ],
  exports: ['PUB_SUB'],
})
export class PubSubModule {}
