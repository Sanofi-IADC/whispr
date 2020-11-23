# Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## End to End Tests

In order to run end to end tests you need `mongo`, `redis` and `localstack` to be up and running. In order to do that you up the dockers in `docker-compose.dev.yml`

```bash
docker-compose -f docker-compose.dev.yml up -d
```

> **Note** : Be aware that it will create entities in the DB and in the S3 bucket. This could interfere with your local data.

## Debugging tests

You can debug the tests in your IDE by running `npm run test:debug` or `npm run test:e2e:debug` and the launching `Attach to Node process` in the debugging tab in VSCode
