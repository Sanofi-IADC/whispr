import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { PubSubEngine } from 'graphql-subscriptions';

import { DistributionService } from '../../../src/distribution/distribution.service';
import { WhispResolver } from '../../../src/whisp/whisp.resolver';
import { WhispService } from '../../../src/whisp/whisp.service';

jest.mock('../../../src/whisp/whisp.service');
jest.mock('../../../src/distribution/distribution.service');

describe('Whisp resolver', () => {
  let testingModule: TestingModule;
  let resolver: WhispResolver;
  let distributionService: DistributionService;
  let spyService: WhispService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        WhispResolver,
        {
          provide: WhispService,
          useFactory: () => ({
            findAll: jest.fn(() => true),
            create: jest.fn(() => true),
          }),
        },
        {
          provide: DistributionService,
          useValue: {
            whispSubject: {
              subscribe: jest.fn(() => true)
              }
          }
        },
        {
          provide: 'PUB_SUB',
          useFactory: () => ({
            pubSub: PubSubEngine
          })
        }
      ],
    }).compile();
    resolver = testingModule.get(WhispResolver);
    spyService = testingModule.get(WhispService);
    distributionService = testingModule.get(DistributionService);
  })

  describe('whisps', () => {
    it('should return all whisps', async () => {
      resolver.whisps();
      expect(spyService.findAll).toHaveBeenCalled();
    });
  });

  describe('createWhisp', () => {
    it('should create a whisp with expected parameters', async () => {
      const params = {
        type: 'MYTYPE',
        applicationID: 'MYAPP',
        data: { item1: true, item2: 7 }
      }
      resolver.createWhisp(params);
      expect(spyService.create).toHaveBeenCalledWith(params);
    });
  })
})