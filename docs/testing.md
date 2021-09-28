# Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Unit Tests
The unit test is a way of testing a unit , the smallest possible unit of code that can be logically isolated in a system. These units are tested to determine if there are any issues 
when the developer make the change in the code base.
It should count for the majority of the tests we can have. Normally, only test one method each. 
Example : Whisp, Subscription 
To run the unit test locally :npm run test:unit:cov

## Integration Tests
Integration tests which are tests designed to verify the integration of different parts of separate components of a software system together. 
Example :Whisp service & MongoDb
To run the integration test locally : npm run test:integration

## End to End Tests  
End-to-end tests which are tests that verify an application’s workflow of code base from beginning to end.This method basically aims to replicate real user scenarios so that the system can be validated for integration and data integrity.
Example : Webhook, TagGroup, WhispSubscription 
To run the end to end test locally :  npm run test:e2e

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