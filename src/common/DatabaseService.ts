import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleDestroy() {
    await this.connection.close();
    console.log('Mongoose connection closed');
  }
}