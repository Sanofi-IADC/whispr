import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  retString = 'Hello World!';

  getHello(): string {
    return this.retString;
  }
}
