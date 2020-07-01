import { Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

import { IWebhook } from '../interfaces/webhook.interface';
import { Event } from '../event/event.entity';
import { WebhookInputType } from './webhook.input';

@Injectable()
export class WebhookService {
  constructor(@InjectModel('Webhook') private readonly webhookModel: Model<IWebhook>) {}

  async create(webhook: WebhookInputType): Promise<IWebhook> {
    return this.webhookModel.create(webhook);
  }

  async findAll(): Promise<IWebhook[]> {
    return this.webhookModel.find();
  }

  async delete(@Param('id') id: string): Promise<boolean> {
    const { n: countOfDeletedWebhooks } = await this.webhookModel.deleteOne({ _id: id }).exec();

    return countOfDeletedWebhooks === 1;
  }

  static getCallFunction(webhook: IWebhook) {
    return async (event: Event): Promise<void> => {
      await axios.post(webhook.url, {
        eventName: event.name,
        content: event.payload,
      });
    };
  }
}
