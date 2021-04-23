import { Injectable } from '@nestjs/common';
import haiku from 'haiku-random';

import { name, version } from '../package.json';

import { Hello } from './interfaces/hello.interface';

@Injectable()
export class AppService {
  app = { version, name };

  getHello(): Hello {
    return {
      ...this.app,
      haiku: haiku.random(),
    };
  }
}
