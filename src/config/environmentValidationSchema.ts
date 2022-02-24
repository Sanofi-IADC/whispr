import Joi from 'joi';
import { Logger } from '@nestjs/common';

// custom object implementing JSON.parse in the coerce method so Joi can read JSON string
const custom = Joi.extend((joi) => ({
  type: 'object',
  base: joi.object(),
  // eslint-disable-next-line consistent-return
  coerce(value) {
    try {
      return { value: JSON.parse(value) };
    } catch (err) {
      // log error, don't return
      Logger.error(err);
    }
  },
}));

const jwtFromRequest = Joi.object({
  funcName: Joi.string()
    .required()
    // fromExtractors function is not currently supported due to implementation complexity
    .valid('fromHeader', 'fromBodyField', 'fromUrlQueryParameter', 'fromAuthHeaderWithScheme', 'fromAuthHeaderAsBearerToken'),
  args: Joi.string().when('funcName', { is: 'fromAuthHeaderAsBearerToken', then: Joi.optional(), otherwise: Joi.required() }),
}).required();

const authConfig = Joi.array()
  .items(
    Joi.object({
      jwtFromRequest,
      ignoreExpiration: Joi.boolean(),
      passReqToCallback: Joi.boolean(),
      secretOrKey: Joi.string(),
      secretOrKeyProvider: Joi.object({
        passportJwtSecret: Joi.object({
          cache: Joi.boolean(),
          rateLimit: Joi.boolean(),
          jwksRequestsPerMinute: Joi.number(),
          jwksUri: Joi.string(),
        }),
      }),
      issuer: Joi.string(),
      audience: Joi.string(),
      algorithms: Joi.array().items(Joi.string()),
    }).xor('secretOrKey', 'secretOrKeyProvider'),
  )
  .required();

export const auth = custom.object({
  config: authConfig,
});

export default Joi.object({
  AUTO_SCHEMA_FILE: Joi.string().default('schema.gql'),
  INTROSPECTION: Joi.boolean().default(true),
  PLAYGROUND: Joi.boolean().default(true),

  SSL_VALIDATE: Joi.boolean().default(false),
  PATH_TO_SSL_CERTIFICATE: Joi.string().when('SSL_VALIDATE', {
    is: true,
    then: Joi.required(),
  }),

  LOG_LEVEL: Joi.number().min(0).max(5).default(5),
  REPLICASET: Joi.string(),

  MONGOOSE_HOST: Joi.string().required(),
  MONGOOSE_PORT: Joi.number().default(27017),
  MONGOOSE_HOST_READ: Joi.string().when('REPLICASET', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
  MONGOOSE_PORT_READ: Joi.number().default(27017),
  MONGOOSE_USERNAME: Joi.string(),
  MONGOOSE_PASSWORD: Joi.string(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_HOST_READ: Joi.string().when('REPLICASET', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
  REDIS_PORT_READ: Joi.number().default(6379),

  COGNITO_ADMIN_USER: Joi.string(),
  COGNITO_ADMIN_PW: Joi.string(),
  COGNITO_USER_POOL_ID: Joi.string(),
  COGNITO_CLIENT_ID_ADMIN: Joi.string(),
  COGNITO_REGION: Joi.string(),
  COGNITO_IDENTITY_POOL_ID: Joi.string(),
  AWS_CONTAINER_CREDENTIALS_RELATIVE_URI: Joi.string(),
  AWS_S3_ENDPOINT: Joi.string(),
  AWS_BUCKET_NAME: Joi.string(),

  HTTP_PROXY: Joi.string(),
  HTTPS_PROXY: Joi.string(),
  CA_CERTIFICATE_PATH: Joi.string(),
  AUTH_CONFIG_SECRET: auth,
});
