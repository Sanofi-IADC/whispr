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
  let whispService: WhispService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        WhispResolver,
        {
          provide: WhispService,
          useFactory: () => ({
            findAll: jest.fn(() => true),
            findOne: jest.fn(() => true),
            create: jest.fn(() => true),
            update: jest.fn(() => true),
            countWhispsGroup: jest.fn(() => true),
          }),
        },
        {
          provide: DistributionService,
          useValue: {
            whispSubject: {
              subscribe: jest.fn(() => true),
            },
          },
        },
        {
          provide: 'PUB_SUB',
          useFactory: () => ({
            pubSub: PubSubEngine,
          }),
        },
      ],
    }).compile();
    resolver = testingModule.get(WhispResolver);
    whispService = testingModule.get(WhispService);
    distributionService = testingModule.get(DistributionService);
  });

  describe('whisps', () => {
    it('should return all whisps', async () => {
      resolver.whisps();
      expect(whispService.findAll).toHaveBeenCalled();
    });

    it('should return a whisp with an id', async () => {
      resolver.whispById('1');
      expect(whispService.findOne).toHaveBeenCalled();
    });
  });

  describe('createWhisp', () => {
    it('should call createWhisp with expected parameters', async () => {
      const params = {
        type: 'MYTYPE',
        applicationID: 'MYAPP',
        data: { item1: true, item2: 7 },
      };
      let whisp = resolver.createWhisp(params);
      console.log("#### whisp = ", whisp);
      expect(whispService.create).toHaveBeenCalledWith(params);
    });
  });

  describe('updateWhisp', () => {
    it('should update with expected parameters', async () => {
      const WHISP_TEST = {
          readableID: 'TEST-TEST-1',
          type: 'ACTION',
          description: 'TEST UPDATE WHISP',
          closed: false,
          applicationID: 'TEST_MY_APP',
          data: { item1: true, item2: 7 },
      };
      resolver.updateWhisp('1', WHISP_TEST);
      expect(whispService.update).toHaveBeenCalledWith('1', WHISP_TEST);
    });
  });

  describe('countWhisps', () => {
    it('should call countWhisps with expected parameters', async () => {
      const filter = [
        {
          applicationID: 'SMUDGE',
          'data.customData.id': '503',
        },
        {
          applicationID: 'SMUDGE',
          'data.customData.id': '504',
        },
      ];

      const group = { mainGrouping: '$data.customData.id', secondaryGrouping: '$data.customData.description' };

      resolver.countWhisps(filter, group);
      expect(whispService.countWhispsGroup).toHaveBeenCalledWith(filter, group);
    });
  });
});
