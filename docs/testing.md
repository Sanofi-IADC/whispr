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

## Load testing
Load testing is implemented using https://k6.io/, and can be executed locally, on a remote server or directly within the CI pipeline. The current load tests are simple and can be considered experimental. PRs for more comprehensive load tests are welcome!

To run the tests, install K6: https://k6.io/docs/getting-started/installation/.

Then run the script:

```bash
k6 run tests/load/whisp-create.load.js
```

### Execution in CI
- Load tests are executed within the CI pipeline in the K6 load tests workflow
- This is only a beta implementation and is not currently defined as a required passing action for a PR to be merged, but if it fails this is a good indication that the PR introduces performance issues which should be investigated before the PR is approved
- Due to an issue in GitHub Actions, only a simple test with a set number of VUs and duration is defined