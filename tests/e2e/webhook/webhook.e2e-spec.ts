import fastify from 'fastify';
import { Model } from 'mongoose';
import request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { WhispService } from '../../../src/whisp/whisp.service';
import { WhispInputType } from '../../../src/whisp/whisp.input';
import { IWhisp } from '../../../src/interfaces/whisp.interface';
import { IWebhook } from '../../../src/interfaces/webhook.interface';
import { EventNames } from '../../../src/event/event.entity';

const CREATE_WEBHOOK_GQL = `
mutation createWebhook($webhook: WebhookInputType!) {
    createWebhook(webhook: $webhook) {
    id: _id
  }
}
`;

const WHISP_TEST_TYPE = 'E2E_TEST';

const WEBHOOK_TEST_PORT = 4134;
const WEBHOOK_TEST_ROUTE = '/webhook';
const WEBHOOK_TEST_URL = `http://localhost:${WEBHOOK_TEST_PORT}${WEBHOOK_TEST_ROUTE}`;

let whispService: WhispService;
const webhookListener = fastify();
let expectedEventName: EventNames;
let doneCallback: jest.DoneCallback;

function configWebhookListener():Promise<void> {
  return new Promise((resolve, reject) => {
    webhookListener.post(WEBHOOK_TEST_ROUTE, async (req) => {​​​
      console.log("##### webhookListener req.body ", req.body);
      try {​​​
        expect(req.body).toEqual(expect.objectContaining({​​​eventName:expectedEventName}​​​));
        doneCallback();
      }​​​
      catch (err) {​​​
        reject(err);
      }​​​
    }​​​);

    webhookListener.listen(WEBHOOK_TEST_PORT, (err) => {​​​
        if (err) {
          reject(err);
        }​​​
      }​​​);
  })
}

function setExpectedEventName(event: EventNames, done: jest.DoneCallback) {
  expectedEventName = event;
  doneCallback = done;
}

beforeAll(async () => {
  const result = new Promise(async (resolve, reject) => {
      try {​​​
        whispService = global.app.get<WhispService>('WhispService');
        //await configWebhookListener();
        resolve(configWebhookListener());
      } catch (err) {​​​
        console.warn('#### Could not start whispService', err);
        reject(err);
      }​​​
  });
  Promise.resolve(result);
});

afterAll(async () => {
  // delete created webhooks
  const resultWebHook = new Promise(async (resolve, reject) => {
    try {
      const webhookModel = global.app.get<Model<IWebhook>>(getModelToken('Webhook'));
      //await webhookModel.deleteMany({ url: WEBHOOK_TEST_URL });
      resolve(webhookModel.deleteMany({ url: WEBHOOK_TEST_URL }));
    } catch (err) {
      console.warn('#### Could not delete created webhooks', err);
      reject(err);
    }
  });
  Promise.resolve(resultWebHook);

  // delete created whisps
  const resultWhisp = new Promise(async (resolve, reject) => {
    try {
      const whispModel = global.app.get<Model<IWhisp>>(getModelToken('Whisp'));
      //await whispModel.deleteMany({ type: WHISP_TEST_TYPE });
      resolve(whispModel.deleteMany({ type: WHISP_TEST_TYPE }));
    } catch (err) {
      console.warn('#### Could not delete created whisps', err);
      reject(err);
    }
  });
  Promise.resolve(Promise.resolve(result););
  webhookListener.close();
});

describe('webhooks', () => {
  let whisp: IWhisp;

  it('should create a new webhook', async () => {
    const result = await request(global.app.getHttpServer())
      .post('/graphql')
      .send({
        query: CREATE_WEBHOOK_GQL,
        variables: {
          webhook: {
            url: WEBHOOK_TEST_URL,
            events: [EventNames.WHISP_CREATED, EventNames.WHISP_DELETED, EventNames.WHISP_UPDATED],
          },
        },
      });

    expect(result.status).toBe(200);
  });

  it('should trigger the webhook when a whisp is created', (done) => {
      setExpectedEventName(EventNames.WHISP_CREATED, done);
      const input = new WhispInputType();
      input.type = WHISP_TEST_TYPE;
      whispService.create(input).then((whispCreateed) => {
        whisp = whispCreateed;
        expect(whispCreateed.readableID).toBeTruthy();
        console.log("#### whisp CREATED", whispCreateed);
      });
  });

  it('should trigger the webhook when a whisp is updated', (done) => {
    setExpectedEventName(EventNames.WHISP_UPDATED, done);
    const update = new WhispInputType();
    update.description = 'UPDATED';
    whispService.update(whisp.id, update).then((whispUpdated) => {
      expect(whispUpdated.description).toBe('UPDATED');
    });
  });

  it('should trigger the webhook when a whisp is deleted',  (done) => {
    setExpectedEventName(EventNames.WHISP_DELETED, done);
    whispService.delete(whisp.id).then(() => {
      console.log("#### whisp DELETED ");
    });
  });

});
