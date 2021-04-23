import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';

import { name, version } from '../../package.json';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return correct application version', () => {
      expect(appController.getHello()).toHaveProperty('version');
      expect(appController.getHello()).toMatchObject({ version });
    });
  });

  describe('root', () => {
    it('should return correct application name', () => {
      expect(appController.getHello()).toHaveProperty('name');
      expect(appController.getHello()).toMatchObject({ name });
    });
  });

  describe('root', () => {
    it('should return random haiku as an array', () => {
      expect(appController.getHello()).toHaveProperty('haiku');
      expect(Array.isArray(appController.getHello().haiku)).toBeTruthy();
    });
  });
});
