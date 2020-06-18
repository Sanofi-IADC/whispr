import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { DistributionModule } from './distribution/distribution.module';
import { ConfigService } from './config/config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PubSubModule } from './pubSub/pubSub.module';
import { SequenceModule } from './sequence/sequence.module';
import { FileModule } from './file/file.module';
import { AWSCredsModule } from './auth/aws-creds.module';
import { WhispModule } from './whisp/whisp.module';
import { TagGroupModule } from './tagGroup/tagGroup.module';

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
    SequenceModule,
    ConfigModule,
    AWSCredsModule,
    FileModule,
    DistributionModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
