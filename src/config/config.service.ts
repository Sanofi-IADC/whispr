import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Agent } from 'http';
import * as tunnel from 'tunnel';
import { ExtractJwt } from '@sanofi-iadc/passport-multi-jwt';
import { passportJwtSecret, ExpressJwtOptions } from 'jwks-rsa';
import createHttpsProxyAgent from 'https-proxy-agent';
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

  getMongooseURI(): string {
    return this.get('REPLICASET') !== undefined
      ? `mongodb://${this.get('MONGOOSE_HOST')}:${this.get('MONGOOSE_PORT')},`
          + `${this.get('MONGOOSE_HOST_READ')}:${this.get('MONGOOSE_PORT_READ')}`
      : `mongodb://${this.get('MONGOOSE_HOST')}:${this.get('MONGOOSE_PORT')}`;
  }

  getMongooseOptions(): MongooseModuleOptions {
    const readPreference = this.get('MONGOOSE_READ_PREFERENCE')
      ? this.get('MONGOOSE_READ_PREFERENCE')
      : 'secondaryPreferred';
    let options: MongooseModuleOptions = {
      uri: this.getMongooseURI(),
      dbName: 'whisps',
      readPreference: this.get('REPLICASET') !== undefined ? readPreference : null,
      user: this.get('MONGOOSE_USERNAME'),
      pass: this.get('MONGOOSE_PASSWORD'),
    };
    if (this.get('SSL_VALIDATE') === true) {
      options = {
        ...options,
        ssl: true,
        sslValidate: true,
        sslCA: this.get('PATH_TO_SSL_CERTIFICATE'),
      };
    }
    return options;
  }

  getProxy(): string | undefined {
    return this.get('HTTP_PROXY') || this.get('HTTPS_PROXY');
  }

  getHttpsTunnel(): Agent | undefined {
    const proxy = this.getProxy();
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
        port,
      },
    });
  }

  getLogLevel(): any {
    return this.logLevels.slice(0, this.get('LOG_LEVEL'));
  }

  fillSecretFromEnv(): AuthConfig {
    const authConfig: AuthConfig = this.get('AUTH_CONFIG_SECRET');
    const result: AuthConfig = { config: [] };

    authConfig.config.forEach((config) => {
      if (config.secretOrKeyFromEnv) {
        result.config.push({
          ...config,
          secretOrKey: process.env[config.secretOrKeyFromEnv] || '',
        });
      } else {
        result.config.push({ ...config });
      }
    });

    return result;
  }

  getAuthConfig(): any {
    const authConfig = this.fillSecretFromEnv();

    const proxy = this.getProxy();
    let agent: createHttpsProxyAgent.HttpsProxyAgent | null = null;
    if (proxy) {
      agent = createHttpsProxyAgent(proxy);
    }
    // patch in ExtractJwt and passportJwtSecret function calls as they cannot be enocded in JSON
    return authConfig.config.map((configuration) => {
      const option: ExpressJwtOptions = { ...configuration.secretOrKeyProvider };
      if (proxy) {
        option.requestAgent = agent;
      }
      return {
        ...configuration,
        ...(configuration.secretOrKeyProvider
          ? { secretOrKeyProvider: passportJwtSecret(option) }
          : {}),
        jwtFromRequest: ExtractJwt[configuration.jwtFromRequest.funcName](
          configuration.jwtFromRequest.args,
        ),
      };
    });
  }
}
