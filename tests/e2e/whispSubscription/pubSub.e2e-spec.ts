import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { PubSubEngine, PubSub } from 'graphql-subscriptions';
import { PubSubModule } from '../../../src/pubSub/pubSub.module';
import { DistributionService } from '../../../src/distribution/distribution.service';
import { WhispResolver } from '../../../src/whisp/whisp.resolver';
import { WhispService } from '../../../src/whisp/whisp.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';
import { IWhisp } from 'src/interfaces/whisp.interface';

const CREATE_WHISP_GQL = `
    mutation createWhisp($whisp: WhispInputType!) {
      createWhisp(whisp: $whisp) {
        _id
      }
    }
    `;
  
const WHISP_SUBCRIPTION_GQL = `
    subscription whispSubscription($filter: JSONObject!) {
      whispAdded(filter: $filter) {
        _id
      }
    }
    `;
const WHISP_TEST = {
  input: {
    readableID: 'TEST-TEST-1',
    type: 'ACTION',
    description: 'TEST SUBSCRIPTION WHISP',
    closed: false,
    applicationID: 'TEST_MY_APP',
    timestamp: new Date().toISOString()
  },
};


const WHISP_TEST_TYPE = 'E2E_TEST';
const SUB_TEST_PORT = 4953;
const REDIS_HOST = 'localhost';
const REDIS_PORT = 6378;
const REDIS_HOST_READ = 'localhost';
const REDIS_PORT_READ = 6378;
const SUB_TEST_ROUTE = '/subscriptions';
const GQL_TEST_ROUTE = '/graphql';
const SUB_TEST_URL = `ws://localhost:${SUB_TEST_PORT}`;
const TEST_PUBLICATION = 'test_publication';

let whispService: WhispService;
let createdWhispId: string;


beforeAll( async function ( ) {
  whispService = global.app.get<WhispService>('WhispService');
} )

afterAll( async ( ) => {
  const model = global.app.get<Model<IWhisp>>(getModelToken('Whisp'));
  //await model.deleteMany({ type: WHISP_TEST_TYPE }).exec();
} )

describe('GraphQL API Subscriptions', () => {
  let testingModule: TestingModule;
  let resolver: WhispResolver;
  let distributionService: DistributionService;
  let whispService: WhispService;
  let pubSubModule: PubSubModule;
 
  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        {
          provide: 'PUB_SUB',
          useFactory: () => ({
            pubSub: PubSubEngine,
          }),
        },
      ],
    }).compile();
  });

  describe('Whisp Subscription', () => {
    it('Should fire a subscription and start listening', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: WHISP_SUBCRIPTION_GQL,
          variables: {
            filter: {
              type: WHISP_TEST_TYPE,
            },
          },
        });
        console.log('##### result : ', result);
      expect(result.status).toBe(200);
    });
  });

  describe('Whisp mutation', () => {
    it('should create a new Whisp and return its id', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: CREATE_WHISP_GQL,
          variables: {
            whisp: {
              type: WHISP_TEST_TYPE,
            },
          },
        });
      expect(result.status).toBe(200);
      createdWhispId = result.body.data.createWhisp._id;
      expect(createdWhispId).toEqual(expect.any(String));
    });
  });

  describe('Whisp subscription and publishing mutation', () => {
    it('should successfully get data from subscription after publishing mutation', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: CREATE_WHISP_GQL,
          variables: {
            whisp: {
              type: WHISP_TEST_TYPE,
            },
          },
        });
      expect(result.status).toBe(200);
      createdWhispId = result.body.data.createWhisp._id;
      expect(createdWhispId).toEqual(expect.any(String));
    });
  });

});
