import {
  Controller, Post, Get, Body, HttpCode, Delete, Param, UsePipes, ValidationPipe, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WebhookService } from './webhook.service';
import { WebhookInputType } from './webhook.input';
import { IWebhook } from '../interfaces/webhook.interface';

@Controller('webhook')
@UseGuards(JwtAuthGuard)
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() webhook: WebhookInputType): Promise<IWebhook> {
    return this.webhookService.create(webhook);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<IWebhook[]> {
    return this.webhookService.findAll();
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: string): Promise<void> {
    this.webhookService.delete(id);
  }
}
