import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';
import { IWhisp } from 'src/interfaces/whisp.interface';
import { WhispService } from 'src/whisp/whisp.service';
import { PubSubModule } from '../../../src/pubSub/pubSub.module';

const CREATE_WHISP_GQL = `
    mutation createWhisp($whisp: WhispInputType!) {
      createWhisp(whisp: $whisp) {
        _id
      }
    }
    `;

const SUBSCRIPTION_GQL = `
    subscription whispSubscription($filter: JSONObject!) {
      whispAdded(filter: $filter) {
        _id
      }
    }
  `;

const WHISP_TEST_TYPE = 'E2E_TEST_SUBSCRIPTION';

describe('GraphQL API Subscriptions', () => {
  let whispService: WhispService;
  let createdWhispId: string;

  beforeAll(async () => {
    whispService = global.app.get<WhispService>(WhispService);
    const module = await Test.createTestingModule({
      imports: [PubSubModule],
    }).compile();
    module.get<PubSubModule>(PubSubModule);
  });

  afterAll(async () => {
    try {
      const model = global.app.get<Model<IWhisp>>(getModelToken('Whisp'));
      await model.deleteMany({ type: WHISP_TEST_TYPE }).exec();
    } catch (e) {
      console.warn('Could not delete created whisps', e);
    }
  });

  describe('Whisp creation and subscription ', () => {
    let subscriptionsCount = 0;
    let resultListening;
    // SUBSCRIPTION
    it('should fire subscription and start listening', async () => {
      resultListening = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: SUBSCRIPTION_GQL,
          variables: {
            filter: {
              type: WHISP_TEST_TYPE,
            },
          },
        });
      if (resultListening.status === 200) {
        subscriptionsCount += 1;
      }
      expect(resultListening.status).toBe(200);
      expect(subscriptionsCount).toBe(1);
    });

    // MUTATION
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

    describe('Whisp subscription and publishing mutation', () => {
      // SUBSCRIPTION RECEIVED EVENT
      it('should successfully get data from subscription after publishing mutation', async () => {
        await request(global.app.getHttpServer())
          .post('/graphql')
          .send({
            query: SUBSCRIPTION_GQL,
            variables: {
              filter: {
                type: WHISP_TEST_TYPE,
              },
            },
          });

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

        createdWhispId = result.body.data.createWhisp._id;
        await whispService.findOne(result.body.data.createWhisp._id);
      });
    });
  });
});
