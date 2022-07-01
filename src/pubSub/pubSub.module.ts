import { Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

const dateReviver = (key, value) => {
  const isISO8601Z =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
  if (typeof value === 'string' && isISO8601Z.test(value)) {
    const tempDateNumber = Date.parse(value);
    if (!Number.isNaN(tempDateNumber)) {
      return new Date(tempDateNumber);
    }
  }
  return value;
};

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
          reviver: dateReviver,
        }),
    },
  ],
  exports: ['PUB_SUB'],
})
export class PubSubModule {
  public static dateReviver(reviver: string) {
    const datereviver = dateReviver(null, reviver);
    return datereviver;
  }
}
