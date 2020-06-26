import {
  Resolver, Query, Mutation, Args,
} from '@nestjs/graphql';
import { WebhookService } from './webhook.service';
import { Webhook } from './webhook.entity';
import { WebhookInputType } from './webhook.input';

@Resolver(() => Webhook)
export class WebhookResolver {
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * Queries
   */
  @Query(() => [Webhook], { nullable: true })
  async webhooks() {
    return this.webhookService.findAll();
  }

  /**
   * Mutations
   */
  @Mutation(() => Webhook)
  async createWebhook(@Args('webhook') webhook: WebhookInputType) {
    return this.webhookService.create(webhook);
  }

  @Mutation(() => Boolean)
  async deleteWebhook(@Args('id') id: string) {
    return this.webhookService.delete(id);
  }
}
