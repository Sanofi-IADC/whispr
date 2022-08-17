import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { IWhisp } from '../../../src/interfaces/whisp.interface';
import { EventService } from '../../../src/event/event.service';
import { FileService } from '../../../src/file/file.service';
import { SequenceService } from '../../../src/sequence/sequence.service';
import { WhispService } from '../../../src/whisp/whisp.service';
import { DistributionService } from '../../../src/distribution/distribution.service';

jest.mock('../../../src/distribution/distribution.service');
jest.mock('../../../src/event/event.service');
jest.mock('../../../src/file/file.service');
jest.mock('../../../src/sequence/sequence.service');

describe('WhispService', () => {
  let whispService: WhispService;
  let whispModel: Model<IWhisp>;
  const OBJECT_ID = '56cb91bdc3464f14678934ca';

  beforeEach(async () => {
    // function to retrieve input of the called function
    const passThrough = (data) =>
      new Promise((resolve) => {
        resolve(data);
      });

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('Whisp'),
          useFactory: () => ({
            findOneAndUpdate: jest.fn().mockReturnThis(),
            create: jest.fn().mockImplementation(passThrough),
            update: jest.fn(),
            aggregate: jest.fn().mockReturnThis(),
            allowDiskUse: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          }),
        },
        WhispService,
        Logger,
        {
          provide: DistributionService,
          useFactory: () => ({
            distributeWhisp: jest.fn(() => true),
          }),
        },
        FileService,
        SequenceService,
        EventService,
      ],
    }).compile();
    whispService = moduleRef.get<WhispService>(WhispService);
    whispModel = moduleRef.get<Model<IWhisp>>(getModelToken('Whisp'));
  });

  describe('create Whisp', () => {
    it('should set Timestamp when no timestamp is provided', async () => {
      await whispService.create({});

      expect(whispModel.create).toBeCalledWith(
        expect.objectContaining({
          timestamp: expect.any(Date),
        }),
      );
    });

    it('should keep custom timestamp when timestamp is provided', async () => {
      const timestamp = new Date();
      await whispService.create({ timestamp });

      expect(whispModel.create).toBeCalledWith(
        expect.objectContaining({
          timestamp,
        }),
      );
    });

    it('when ttl is provided expirationDate should be generate and be equal to updated date plus ttl duration', async () => {
      const timeToLive = '2min';
      const expectedTimeToLiveSec = 120;
      const whisp = await whispService.create({ timeToLive });

      const { updated: updatedDate, expirationDate, timeToLiveSec } = whisp;

      const expectedExpirationDate = new Date();
      expectedExpirationDate.setSeconds(updatedDate.getSeconds() + timeToLiveSec);
      expectedExpirationDate.setMilliseconds(updatedDate.getMilliseconds());

      expect(expirationDate).toStrictEqual(expectedExpirationDate);
      expect(timeToLiveSec).toBe(expectedTimeToLiveSec);
    });

    it('negative ttl are forbidden', async () => {
      const timeToLive = '-2';
      await expect(whispService.create({ timeToLive })).rejects.toThrow(
        'time to live must be positive number of seconds or a parsable time string like 2min,1hour',
      );
    });

    it('none time string are forbidden', async () => {
      const timeToLive = 'hello';
      await expect(whispService.create({ timeToLive })).rejects.toThrow(
        'time to live must be positive number of seconds or a parsable time string like 2min,1hour',
      );
    });
    it('expirationDate override ttl', async () => {
      const now = new Date();
      now.setSeconds(now.getSeconds() + 2);
      const expirationDateField = now;
      const whisp = await whispService.create({ expirationDate: expirationDateField });
      const { expirationDate, timeToLiveSec } = whisp;
      expect(expirationDate).toStrictEqual(expirationDateField);
      expect(timeToLiveSec).toBeNull();
    });
  });

  describe('Update Whisp', () => {
    it('should update timestamp when it is provided', async () => {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() + 1);

      await whispService.update(OBJECT_ID, { timestamp });
      expect(whispModel.findOneAndUpdate).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          timestamp,
        }),
        expect.anything(),
      );
    });

    it('should keep timestamp when it is not provided', async () => {
      await whispService.update(OBJECT_ID, {});
      expect(whispModel.findOneAndUpdate).toBeCalledWith(
        expect.anything(),
        expect.not.objectContaining({
          timestamp: expect.any(Date),
        }),
        expect.anything(),
      );
    });
  });

  describe('Count Whisp', () => {
    it('calls mongo aggregate with empty match and group when they are not passed as parameters', async () => {
      await whispService.countWhispsGroup();
      const expectedMatch = { $match: {} };
      const expectedGroup = { $group: { _id: undefined, count: { $sum: 1 } } };

      expect(whispModel.aggregate).toBeCalledWith([expectedMatch, expectedGroup]);
    });

    it('calls mongo aggregate with given match when defined', async () => {
      const matchParam = [
        {
          applicationID: 'SMUDGE',
          'data.customData.id': '503',
        },
        {
          applicationID: 'SMUDGE',
          'data.customData.id': '504',
        },
      ];

      await whispService.countWhispsGroup(matchParam, undefined);
      const expectedMatch = {
        $match: {
          $or: [
            {
              applicationID: 'SMUDGE',
              'data.customData.id': '503',
            },
            {
              applicationID: 'SMUDGE',
              'data.customData.id': '504',
            },
          ],
        },
      };

      const expectedGroup = { $group: { _id: undefined, count: { $sum: 1 } } };

      expect(whispModel.aggregate).toBeCalledWith([expectedMatch, expectedGroup]);
    });

    it('calls mongo aggregate with given group when defined', async () => {
      const groupParam = {
        mainGrouping: '$data.customData.id',
        secondaryGrouping: '$data.customData.description',
      };

      await whispService.countWhispsGroup(undefined, groupParam);
      const expectedMatch = { $match: {} };

      const expectedGroup = {
        $group: {
          _id: {
            mainGrouping: '$data.customData.id',
            secondaryGrouping: '$data.customData.description',
          },
          count: { $sum: 1 },
        },
      };

      expect(whispModel.aggregate).toBeCalledWith([expectedMatch, expectedGroup]);
    });

    it('calls mongo aggregate with given match and group when both are defined', async () => {
      const matchParam = [
        {
          applicationID: 'SMUDGE',
          'data.customData.id': '503',
        },
        {
          applicationID: 'SMUDGE',
          'data.customData.id': '504',
        },
      ];
      const groupParam = {
        mainGrouping: '$data.customData.id',
        secondaryGrouping: '$data.customData.description',
      };
      await whispService.countWhispsGroup(matchParam, groupParam);

      const expectedMatch = {
        $match: {
          $or: [
            {
              applicationID: 'SMUDGE',
              'data.customData.id': '503',
            },
            {
              applicationID: 'SMUDGE',
              'data.customData.id': '504',
            },
          ],
        },
      };

      const expectedGroup = {
        $group: {
          _id: {
            mainGrouping: '$data.customData.id',
            secondaryGrouping: '$data.customData.description',
          },
          count: { $sum: 1 },
        },
      };

      expect(whispModel.aggregate).toBeCalledWith([expectedMatch, expectedGroup]);
    });
  });
});
