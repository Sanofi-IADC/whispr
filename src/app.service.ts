import { Injectable } from '@nestjs/common';
import haiku from 'haiku-random';

import { name, version } from '../package.json';

const getHaikuAsText = () => haiku.random().join('\n');

@Injectable()
export class AppService {
  hello = `Welcome to ${name}!\nVersion: ${version}`;

  apiPath = 'If you are looking for the API, go to .../graphql';

  getHello(): string {
    return `${this.hello}\n\n${getHaikuAsText()}\n\n${this.apiPath}`;
  }
}
