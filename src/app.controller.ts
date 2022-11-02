import {
  Controller, Get, HttpException, HttpStatus,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    if (this.connection.readyState !== ConnectionStates.connected) {
      throw new HttpException(
        `Connection to DB lost \n ${this.appService.getHello()}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    return this.appService.getHello();
  }
}
