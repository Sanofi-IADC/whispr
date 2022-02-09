import { Injectable, Param, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { stringify } from 'flatted';
import { HttpService } from '@nestjs/axios';
import { IWebhook } from '../interfaces/webhook.interface';
import { Event } from '../event/event.entity';
import { WebhookInputType } from './webhook.input';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel('Webhook') private readonly webhookModel: Model<IWebhook>,
    private readonly httpService: HttpService,
  ) {}

  async create(webhook: WebhookInputType): Promise<IWebhook> {
    const newHook = { ...webhook, filter: JSON.stringify(webhook.filter) };
    const insertedModel = (await this.webhookModel.create(newHook)).toObject();
    insertedModel.filter = JSON.parse(insertedModel.filter);
    return insertedModel as IWebhook;
  }

  async findAll(): Promise<IWebhook[]> {
    const dbresponse = await this.webhookModel.find().exec();
    const returnHooks = [];
    dbresponse.forEach((wh) => {
      const webhook = wh;
      webhook.filter = JSON.parse(wh.filter);
      returnHooks.push(webhook);
    });
    return returnHooks;
  }

  async delete(@Param('id') id: string): Promise<boolean> {
    const { n: countOfDeletedWebhooks } = await this.webhookModel
      .deleteOne({ _id: id })
      .exec();

    return countOfDeletedWebhooks === 1;
  }

  getCallFunction(webhook: IWebhook) {
    return async (event: Event): Promise<void> => {
      Logger.log(`Trying to send webhook to ${webhook.url}`, 'Webhook');

      await this.httpService
        .post(webhook.url, {
          eventName: event.name,
          content: event.payload,
        })
        .toPromise()
        .then(
          (response) => {
            Logger.log(
              `Webhook post response status: ${response.status} | 
              statusText: ${response.statusText} | 
              url: ${response.config.url}`,
              'Webhook',
            );
          },
          (error) => {
            Logger.error(stringify(error), error.stack, 'Webhook');
          },
        );
    };
  }
}
