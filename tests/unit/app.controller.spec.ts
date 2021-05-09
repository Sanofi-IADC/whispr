import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
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
