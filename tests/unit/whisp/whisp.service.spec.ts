import { Logger } from '@nestjs/common';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import dotenv from 'dotenv';
import { Connection, deleteModel, Model } from 'mongoose';
import { IWhisp } from 'src/interfaces/whisp.interface';
import { EventService } from '../../../src/event/event.service';
import { FileService } from '../../../src/file/file.service';
import { SequenceService } from '../../../src/sequence/sequence.service';
import { whispSchema } from '../../../src/whisp/whisp.schema';
import { WhispService } from '../../../src/whisp/whisp.service';
import { DistributionService } from '../../../src/distribution/distribution.service';

jest.mock('../../../src/distribution/distribution.service');
jest.mock('../../../src/event/event.service');
jest.mock('../../../src/file/file.service');
jest.mock('../../../src/sequence/sequence.service');
dotenv.config({ path: 'test.env' });
describe('WhispService', () => {
  let distributionService: DistributionService;
  let eventService: EventService;
  let fileService: FileService;
  let sequenceService: SequenceService;
  let whispService: WhispService;
  let whispModel: Model<IWhisp>;
  let dbConnection: Connection;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(`mongodb://${process.env.MONGOOSE_HOST}`, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        MongooseModule.forFeature([{ name: 'Whisp', schema: whispSchema }]),
      ],
      providers: [WhispService, Logger, DistributionService, FileService, SequenceService, EventService],
    }).compile();
    distributionService = moduleRef.get<DistributionService>(DistributionService);
    eventService = moduleRef.get<EventService>(EventService);
    fileService = moduleRef.get<FileService>(FileService);
    sequenceService = moduleRef.get<SequenceService>(SequenceService);
    whispService = moduleRef.get<WhispService>(WhispService);
    whispModel = moduleRef.get<Model<IWhisp>>(getModelToken('Whisp'));
    dbConnection = moduleRef.get<Connection>(getConnectionToken());
    await whispModel.deleteMany({});
  });
  afterEach(async () => {
    await dbConnection.close();
  });
  afterAll(() => {
    dbConnection.modelNames().forEach((modelName) => {
      deleteModel(modelName);
    });
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
});
