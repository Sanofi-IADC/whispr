import Joi from '@hapi/joi';

export default Joi.object({
  AUTO_SCHEMA_FILE: Joi.string().default('schema.gql'),
  INTROSPECTION: Joi.boolean().default(true),
  PLAYGROUND: Joi.boolean().default(true),

  SSL_VALIDATE: Joi.boolean().default(false),
  PATH_TO_SSL_CERTIFICATE: Joi.string().when('SSL_VALIDATE', {
    is: true,
    then: Joi.required(),
  }),

  LOG_LEVEL: Joi.number()
    .min(0)
    .max(5)
    .default(5),
  REPLICASET: Joi.string().default('rs0'),

  MONGOOSE_HOST: Joi.string().required(),
  MONGOOSE_PORT: Joi.number().default(27017),
  MONGOOSE_HOST_READ: Joi.string().required(),
  MONGOOSE_PORT_READ: Joi.number().default(27017),
  MONGOOSE_USERNAME: Joi.string(),
  MONGOOSE_PASSWORD: Joi.string(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_HOST_READ: Joi.string().required(),
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
});
