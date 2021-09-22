import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { PubSubModule } from '../../../src/pubSub/pubSub.module';

const REDIS_HOST = 'localhost';
const REDIS_PORT = 6378;
const REDIS_HOST_READ = 'localhost';
const REDIS_PORT_READ = 6378;

describe('PUB_SUB', () => {
  let testingModule: TestingModule;
  let pubSubModule: PubSubModule;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
       imports: [PubSubModule]
    }).compile();

    pubSubModule = module.get<PubSubModule>(PubSubModule);
  });

  it('should initialize the PUB_SUB module successfully', async () => {
    expect(pubSubModule instanceof PubSubModule).toBeTruthy;
  });

  it('should be defined successfully', () => {
    expect(pubSubModule).toBeDefined();
  });

  it('should dateReviver be defined', async () => {
    expect(PubSubModule.dateReviver).toBeUndefined;
  });

  it('should dateReviver return a not null value', async () => {
    expect(PubSubModule.dateReviver(20)).toEqual(20);
  });

  it('should dateReviver return a String', async () => {
    expect(PubSubModule.dateReviver('MYAPP')).toEqual('MYAPP');
  });

  it('should return a date', async () => {
    const dateReviver = "2021-09-01T15:51:20.860Z";
    expect(PubSubModule.dateReviver(dateReviver).toString()).toEqual("Wed Sep 01 2021 17:51:20 GMT+0200 (heure d’été d’Europe centrale)");
  });
});
