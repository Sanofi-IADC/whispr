import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionStates } from 'mongoose';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getConnectionToken(),
          useValue: {
            readyState: ConnectionStates.connected,
          },
        },
      ],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
    appController = moduleRef.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return introduction message', () => {
      expect(appController.getHello()).toContain(appService.hello);
      expect(appController.getHello()).toContain(appService.apiPath);
    });
  });
});
