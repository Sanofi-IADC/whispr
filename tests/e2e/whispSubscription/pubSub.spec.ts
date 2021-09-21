import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { PubSubEngine, PubSub, withFilter } from 'graphql-subscriptions';
import { PubSubModule } from '../../../src/pubSub/pubSub.module';
import { DistributionService } from '../../../src/distribution/distribution.service';
import { WhispResolver } from '../../../src/whisp/whisp.resolver';
import { WhispService } from '../../../src/whisp/whisp.service';
import { createServer, IncomingMessage, ServerResponse, Server } from 'http';
import * as WebSocket from 'ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  graphql, subscribe, parse, execute,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

const subscriptionsPubSub = new PubSub();
const TEST_PUBLICATION = 'test_publication';
const WHISP_TEST_TYPE = 'UNIT_TEST';
const SUB_TEST_PORT = 4953;
const SUB_TEST_ROUTE = '/subscriptions';
const GQL_TEST_ROUTE = '/graphql';
const SUB_TEST_URL = `ws://localhost:${SUB_TEST_PORT}`;

const CREATE_WHISP_GQL = `
      mutation createWhisp($input: whispAddInput!) {   
        createWhisp(input: $input) {
          _id
        }
      }
      `;
  
const SUBCRIPTION = `
      subscription S($input: whispAddedInputType!) {
        whispAdded(input: $input) {
          whisp {
            readableID: string
            type: string
            severity: number
            description: string
            closed: boolean
            applicationID: string
            timestamp: Date
          }
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

const rootValue = {};
const VARIABLE_SUSCRIPTION = {
  input: {},
};
let networkInterface;

const data: { [key: string]: { [key: string]: string } } = {
  'Whisp1': {
    readableID: 'TEST-TEST-Whisp1',
    type: 'ACTION',
    description: 'TEST SUBSCRIPTION Whisp1',
    closed: 'false',
    applicationID: 'TEST_MY_APP',
    timestamp: new Date().toISOString()
  },
  'Whisp2': {
    readableID: 'TEST-TEST-Whisp2',
    type: 'ACTION',
    description: 'TEST SUBSCRIPTION Whisp2',
    closed: 'false',
    applicationID: 'TEST_MY_APP',
    timestamp: new Date().toISOString()
  },
  'Whisp3': {
    readableID: 'TEST-TEST-Whisp3',
    type: 'ACTION',
    description: 'TEST SUBSCRIPTION Whisp3',
    closed: 'false',
    applicationID: 'TEST_MY_APP',
    timestamp: new Date().toISOString()
  },
};

const whispType = new GraphQLObjectType({
  name: 'Whisp',
  fields: {
    readableID: { type: GraphQLString },
    type: { type: GraphQLString },
    description: { type: GraphQLString },
    closed: { type: GraphQLString },
    applicationID: { type: GraphQLString }
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      testString: { type: GraphQLString, resolve: () => 'value' },
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      user: {
        type: whispType,
        args: {
          id: { type: GraphQLString },
        },
        resolve: (_, { id }) => {
          return data[id];
        },
        subscribe: () => {
          return subscriptionsPubSub.asyncIterator('user');
        },
      },
      whispFiltered: {
        type: whispType,
        args: {
          id: { type: GraphQLString },
        },
        resolve: (_, { id }) => {
          return data[id];
        },
        subscribe: withFilter(() => subscriptionsPubSub.asyncIterator('whispFiltered'),
          (user: any, args: { [key: string]: any }) => {
            return !args['id'] || user.id === parseInt(args['id'], 10);
          }),
      },
      context: {
        type: GraphQLString,
        resolve: (root, args, ctx) => {
          return ctx;
        },
        subscribe: () => {
          return subscriptionsPubSub.asyncIterator('context');
        },
      },
      error: {
        type: GraphQLString,
        resolve: () => {
          throw new Error('E1');
        },
        subscribe: () => {
          return subscriptionsPubSub.asyncIterator('error');
        },
      },
    },
  }),
});

const subscriptionsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      testString: { type: GraphQLString, resolve: () => 'value' },
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      somethingChanged: {
        type: GraphQLString,
        resolve: payload => {
          return payload;
        },
        subscribe: () => {
          return subscriptionsPubSub.asyncIterator(TEST_PUBLICATION);
        },
      },
    },
  }),
});

const handlers = {
  onOperation: (msg: any, params: any, webSocketRequest: WebSocket) => {
    return Promise.resolve(Object.assign({}, params, { context: msg.payload.context }));
  },
};

const options = {
  schema,
  subscribe,
  execute,
  onOperation: (msg: any, params: any, webSocketRequest: WebSocket) => {
    return handlers.onOperation(msg, params, webSocketRequest);
  },
};

function notFoundRequestListener(request: IncomingMessage, response: ServerResponse) {
  response.writeHead(404);
  response.end();
}

beforeAll( async function ( ) {
  const httpServer = createServer(notFoundRequestListener);
  httpServer.listen(SUB_TEST_PORT);
  //let wsServer: WebSocket.Server;
  networkInterface = new SubscriptionClient(SUB_TEST_URL+''+SUB_TEST_ROUTE, { reconnect: true }, null);

} )

afterAll( async ( ) => {
  networkInterface.close() ;
} )

describe('GraphQL API Subscriptions', () => {
  //@Inject('PUB_SUB') pubSub;
  let testingModule: TestingModule;
  let resolver: WhispResolver;
  let distributionService: DistributionService;
  let whispService: WhispService;
  let pubSubModule: PubSubModule;
  
  it('should fire subscription listening', async () => {
    const result = await subscribe(schema, parse(SUBCRIPTION), null, null, VARIABLE_SUSCRIPTION);
    //console.log("#### result : ", result);
    networkInterface.request({
      query: SUBCRIPTION,
    }).subscribe({});
  });

  it('should publish a message while server listening ', async () => {
    networkInterface.request({
      query: SUBCRIPTION,
    }).subscribe({});
  });

});
