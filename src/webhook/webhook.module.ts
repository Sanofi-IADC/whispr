import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config/config.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { webhookSchema } from './webhook.schema';
import { WebhookResolver } from './webhook.resolver';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Webhook', schema: webhookSchema }]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        proxy: false,
        httpsAgent: configService.getHttpsTunnel(),
      }),
    }),
  ],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookResolver, ConfigService],
  exports: [WebhookService, HttpModule],
})
export class WebhookModule {}
