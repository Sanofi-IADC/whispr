import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Agent } from 'http';
import * as tunnel from 'tunnel';
import validationSchema from './environmentValidationSchema';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  private readonly logLevels: string[] = ['error', 'warn', 'log', 'verbose', 'debug'];

  constructor() {
    const dotEnvFilename = `${process.env.NODE_ENV || 'local'}.env`;
    const dotEnvConfig = fs.existsSync(dotEnvFilename) ? dotenv.parse(fs.readFileSync(dotEnvFilename)) : {};
    const configFromEnv = ConfigService.buildConfigFromEnv();
    const mergedConfig = {
      ...dotEnvConfig,
      ...configFromEnv // Environment variables override .env config
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

  static validateSchemaAndApplyDefaultValues(providedEnvConfig: Record<string, string>): Record<string, string> {
    const { value, error } = validationSchema.validate(providedEnvConfig, {
      abortEarly: false,
      allowUnknown: true
    });
    if (error) {
      throw error;
    }
    return value;
  }

  get(key: string): any {
    return this.envConfig[key];
  }

  getMongooseURI(): string {
    return this.get('REPLICASET') !== undefined
      ? `mongodb://${this.get('MONGOOSE_HOST')}:${this.get('MONGOOSE_PORT')},${this.get('MONGOOSE_HOST_READ')}:${this.get(
          'MONGOOSE_PORT_READ'
        )}`
      : `mongodb://${this.get('MONGOOSE_HOST')}:${this.get('MONGOOSE_PORT')}`;
  }

  getMongooseOptions(): MongooseModuleOptions {
    const options: MongooseModuleOptions = {
      uri: this.getMongooseURI(),
      dbName: 'whisps',
      readPreference: this.get('REPLICASET') !== undefined ? 'primary' : null,
      user: this.get('MONGOOSE_USERNAME'),
      pass: this.get('MONGOOSE_PASSWORD'),
      replicaSet: this.get('REPLICASET'),
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    if (this.get('SSL_VALIDATE') === true) {
      const ca = fs.readFileSync(this.get('PATH_TO_SSL_CERTIFICATE'));
      options.server = {
        ssl: true,
        sslValidate: true,
        sslCA: ca
      };
    }
    return options;
  }

  getHttpsTunnel(): Agent | undefined {
    const proxy = this.get('HTTP_PROXY') || this.get('HTTPS_PROXY');
    if (!proxy) {
      return undefined;
    }
    const host = proxy.split(':')[1].slice(2);
    const port = parseInt(proxy.split(':')[2], 10);
    return tunnel.httpsOverHttp({
      ca: this.get('CA_CERTIFICATE_PATH')
        ? this.get('CA_CERTIFICATE_PATH')
            .split(',')
            .map((path: string) => path.trim())
            .map((path) => fs.readFileSync(path))
        : undefined,
      proxy: {
        host,
        port
      }
    });
  }

  getLogLevel(): any {
    return this.logLevels.slice(0, this.get('LOG_LEVEL'));
  }
}
