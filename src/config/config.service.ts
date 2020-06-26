import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import validationSchema from './environmentValidationSchema';
@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  private readonly logLevels: string[] = [
    'error',
    'warn',
    'log',
    'verbose',
    'debug',
  ];

  constructor() {
    const providedEnvConfig = dotenv.parse(
      fs.readFileSync(`${process.env.NODE_ENV || 'local'}.env`),
    );
    this.envConfig = ConfigService.validateSchemaAndApplyDefaultValues(
      providedEnvConfig,
    );
  }

  static validateSchemaAndApplyDefaultValues(providedEnvConfig) {
    const { value, error } = validationSchema.validate(providedEnvConfig, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      throw error;
    }
    return value;
  }

  get(key: string): any {
    return process.env[key] ? process.env[key] : this.envConfig[key];
  }

  getMongooseURI(): any {
    return `mongodb://${this.get('MONGOOSE_HOST')}:${this.get(
      'MONGOOSE_PORT',
    )},${this.get('MONGOOSE_HOST_READ')}:${this.get('MONGOOSE_PORT_READ')}`;
  }

  getMongooseOptions(): any {
    const options: any = {
      uri: this.getMongooseURI(),
      dbName: 'whisps',
      readPreference: 'primary',
      user: this.get('MONGOOSE_USERNAME'),
      pass: this.get('MONGOOSE_PASSWORD'),
      replicaSet: this.get('REPLICASET'),
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    if (this.get('SSL_VALIDATE') === 'true') {
      const ca = fs.readFileSync(this.get('PATH_TO_SSL_CERTIFICATE'));
      options.server = {
        ssl: true,
        sslValidate: true,
        sslCA: ca,
      };
    }
    return options;
  }

  getLogLevel(): any {
    return this.logLevels.slice(0, this.get('LOG_LEVEL'));
  }
}
