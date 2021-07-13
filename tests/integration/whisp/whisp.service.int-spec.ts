import { Logger } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';

import { IWhisp } from 'src/interfaces/whisp.interface';
import { EventService } from '../../../src/event/event.service';
import { FileService } from '../../../src/file/file.service';
import { SequenceService } from '../../../src/sequence/sequence.service';
import { whispSchema } from '../../../src/whisp/whisp.schema';
import { WhispService } from '../../../src/whisp/whisp.service';
import { DistributionService } from '../../../src/distribution/distribution.service';
import { closeInMongodConnection, rootMongooseTestModule } from '../../testUtils/mongo/MongooseTestModule';

jest.mock('../../../src/distribution/distribution.service');
jest.mock('../../../src/event/event.service');
jest.mock('../../../src/file/file.service');
jest.mock('../../../src/sequence/sequence.service');

describe('WhispService', () => {
  let whispService: WhispService;
  let whispModel: Model<IWhisp>;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: 'Whisp', schema: whispSchema }])],
      providers: [WhispService, Logger, DistributionService, FileService, SequenceService, EventService],
    }).compile();
    whispService = moduleRef.get<WhispService>(WhispService);
    whispModel = moduleRef.get<Model<IWhisp>>(getModelToken('Whisp'));
    await whispModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('create Whisp', () => {
    it('should set Timestamp when no timestamp is provided', async () => {
      const result = await whispService.create({});

      expect(result.timestamp instanceof Date).toBeTruthy();
    });
    it('should keep custom timestamp when timestamp is provided', async () => {
      const timestamp = new Date();
      const result = await whispService.create({ timestamp });

      expect(result.timestamp.valueOf()).toEqual(timestamp.valueOf());
    });
  });
  describe('Update Whisp', () => {
    it('should update timestamp when it is provided', async () => {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() + 1);
      const initialWhisp = await whispService.create({});

      const result = await whispService.update(initialWhisp._id, { timestamp });

      expect(result.timestamp.valueOf()).toEqual(timestamp.valueOf());
    });
    it('should keep timestamp when it is not provided', async () => {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() + 1);
      const initialWhisp = await whispService.create({ timestamp });

      const result = await whispService.update(initialWhisp._id, {});

      expect(result.timestamp.valueOf()).toEqual(initialWhisp.timestamp.valueOf());
    });
  });

  describe('Update Whisp', () => {
    it('should correctly countWhisps based on applicationID filter', async () => {
      const applicationID = 'SMUDGE';

      await whispService.create({ applicationID });
      await whispService.create({ applicationID });
      await whispService.create({ applicationID });

      const filter: Record<string, unknown>[] = [
        {
          applicationID: 'SMUDGE',
        },
      ];

      const result = await whispService.countWhispsGroup(filter);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].count.valueOf()).toEqual(3);
    });

    it('should correctly countWhisps with complex mongo syntax query based on applicationID filter', async () => {
      await whispService.create({ applicationID: 'SMUDGE' });
      await whispService.create({ applicationID: 'SPIFF' });
      await whispService.create({ applicationID: 'FOO' });

      const filter: Record<string, unknown>[] = [
        {
          applicationID: { $in: ['SMUDGE', 'FOO'] },
        },
      ];

      const result = await whispService.countWhispsGroup(filter);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].count.valueOf()).toEqual(2);
    });

    it('should correctly countWhisps based on timestamp filter', async () => {
      const whispDate = '2021-07-11T08:24:11.067Z';
      const timestamp = new Date(whispDate);

      await whispService.create({ timestamp });
      await whispService.create({ timestamp });
      await whispService.create({ timestamp });

      const timestampFilter: Record<string, unknown>[] = [
        {
          timestamp: '2021-07-11T08:24:11.067Z',
        },
      ];

      const result = await whispService.countWhispsGroup(timestampFilter);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].count.valueOf()).toEqual(3);
    });

    it('should correctly countWhisps with complex mongo syntax query (greater than date comparison)', async () => {
      const date1 = new Date(2020, 1, 1);
      const date2 = new Date(2019, 1, 1);
      const date3 = new Date(2018, 1, 1);
      await whispService.create({ timestamp: date1 });
      await whispService.create({ timestamp: date1 });
      await whispService.create({ timestamp: date1 });

      await whispService.create({ timestamp: date2 });
      await whispService.create({ timestamp: date2 });
      await whispService.create({ timestamp: date2 });

      await whispService.create({ timestamp: date3 });
      await whispService.create({ timestamp: date3 });
      await whispService.create({ timestamp: date3 });

      const timestampFilter: Record<string, unknown>[] = [
        {
          timestamp: {
            $gte: '2018-07-11T08:24:11.067Z',
          },
        },
      ];

      // const timestampFilter: Record<string, unknown> = {
      //   timestamp: "2021-07-11T08:24:11.067Z"
      // };

      const result = await whispService.countWhispsGroup(timestampFilter);
      // const result2 = await whispService.countWhisps(timestampFilter);

      // expect(result.valueOf()).toEqual(false);

      // expect(result2.valueOf()).toEqual(6);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].count.valueOf()).toEqual(6);
    });
  });
});
