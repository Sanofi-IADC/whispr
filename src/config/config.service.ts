import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import validationSchema from './environmentValidationSchema';
@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  private readonly logLevels: string[] = ['error', 'warn', 'log', 'verbose', 'debug'];

  constructor() {
    const dotEnvFilename = `${process.env.NODE_ENV || 'local'}.env`;
    const dotEnvConfig = fs.existsSync(dotEnvFilename)
      ? dotenv.parse(fs.readFileSync(dotEnvFilename))
      : {};
    const configFromEnv = ConfigService.buildConfigFromEnv();
    const mergedConfig = {
      ...dotEnvConfig,
      ...configFromEnv, // Environment variables override .env config
    };
    this.envConfig = ConfigService.validateSchemaAndApplyDefaultValues(mergedConfig);
  }

  static buildConfigFromEnv(): Record<string, string> {
    const schemaKeys = Object.keys(validationSchema.describe().keys);
    const res = {};
    schemaKeys.forEach((key) => {
      if (process.env[key] !== undefined) {
        res[key] = process.env[key];
      }
    });
    return res;
  }

  static validateSchemaAndApplyDefaultValues(
    providedEnvConfig: Record<string, string>,
  ): Record<string, string> {
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
    return this.envConfig[key];
  }

  getMongooseURI(): any {
    return `mongodb://${this.get('MONGOOSE_HOST')}:${this.get('MONGOOSE_PORT')},${this.get(
      'MONGOOSE_HOST_READ',
    )}:${this.get('MONGOOSE_PORT_READ')}`;
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
    if (this.get('SSL_VALIDATE') === true) {
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
