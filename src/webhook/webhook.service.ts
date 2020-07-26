import { Injectable, Param, Logger } from '@nestjs/common';
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
      Logger.log(`Trying to send webhook to ${webhook.url}`, 'Webhook');

      await axios.post(webhook.url, {
        eventName: event.name,
        content: event.payload,
      })
        .then((response) => {
          Logger.log(`Webhook post response status: ${response.status} | statusText: ${response.statusText} | url: ${response.config.url}`, 'Webhook');
        }, (error) => {
          Logger.error(error, error.stack, 'Webhook');
        });
    };
  }
}
