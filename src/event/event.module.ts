import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [WebhookModule],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
