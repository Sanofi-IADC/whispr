import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { TerminusModule } from '@nestjs/terminus';
import { ApolloServerPluginLandingPageLocalDefault, AuthenticationError } from 'apollo-server-core';
import { AWSCredsModule } from './aws-creds/aws-creds.module';
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
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { GqlContext } from './auth/gql-context';
import { ConnectionParams } from './auth/connection-params';

@Module({
  imports: [
    TerminusModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: configService.get('AUTO_SCHEMA_FILE'),
        introspection: configService.get('INTROSPECTION'),
        playground: false,
        cors: false,
        plugins: configService.get('PLAYGROUND') ? [ApolloServerPluginLandingPageLocalDefault()] : [],
        installSubscriptionHandlers: true,
        context: ({
          req, res, payload, connection,
        }: GqlContext) => ({
          req,
          res,
          payload,
          connection,
        }),
        // subscriptions/webSockets authentication
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: (connectionParams: ConnectionParams) => {
              const connectionParamsLowerKeys = {} as ConnectionParams;
              // convert header keys to lowercase
              Object.keys(connectionParams).forEach((key) => {
                connectionParamsLowerKeys[key.toLowerCase()] = connectionParams[key];
              });
              // eslint-disable-next-line max-len
              const authToken: string = 'authorization' in connectionParamsLowerKeys && connectionParamsLowerKeys.authorization.split(' ')[1];
              if (authToken) {
                return { headers: connectionParamsLowerKeys };
              }
              throw new AuthenticationError('authorization token must be provided');
            },
          },
        },
      }),

      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.getMongooseOptions(),
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
    AuthModule,
  ],
  providers: [AppService],
  controllers: [AppController, HealthController],
})
export class AppModule {}
