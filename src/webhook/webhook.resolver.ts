import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Webhook } from './webhook.entity';
import { WebhookInputType } from './webhook.input';
import { IWebhook } from '../interfaces/webhook.interface';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';

@Resolver(() => Webhook)
@UseGuards(GqlJwtAuthGuard)
export class WebhookResolver {
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * Queries
   */
  @Query(() => [Webhook], { nullable: true })
  async webhooks(): Promise<IWebhook[]> {
    return this.webhookService.findAll();
  }

  /**
   * Mutations
   */
  @Mutation(() => Webhook)
  async createWebhook(
    @Args('webhook') webhook: WebhookInputType,
  ): Promise<IWebhook> {
    return this.webhookService.create(webhook);
  }

  @Mutation(() => Boolean)
  async deleteWebhook(@Args('id') id: string): Promise<boolean> {
    return this.webhookService.delete(id);
  }
}
