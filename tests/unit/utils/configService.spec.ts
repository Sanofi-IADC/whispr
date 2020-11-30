import * as tunnel from 'tunnel';
import { ConfigService } from '../../../src/config/config.service';

const httpProxy = process.env.HTTP_PROXY;
const httpsProxy = process.env.HTTPS_PROXY;

describe('ConfigService', () => {
  let configService: ConfigService;
  beforeAll(() => {
    process.env.NODE_ENV = 'example';
    delete process.env.HTTP_PROXY;
    delete process.env.HTTPS_PROXY;
  });
  afterAll(() => {
    process.env.HTTP_PROXY = httpProxy;
    process.env.HTTPS_PROXY = httpsProxy;
  });
  describe('get', () => {
    beforeEach(() => {
      process.env.HTTPS_PROXY = 'http://test.proxy.com:3128';
      delete process.env.HTTP_PROXY;
      configService = new ConfigService();
    });
    it('should return var from process.env', () => {
      const proxy = configService.get('HTTPS_PROXY');
      expect(proxy).toEqual(process.env.HTTPS_PROXY);
    });
    it('should return var from config-file', () => {
      const proxy = configService.get('EXAMPLE_TEST');
      expect(proxy).toEqual('test');
    });
    it('should return undefined if var is not set', () => {
      const result = configService.get('HTTP_PROXY');
      expect(result).toBeUndefined();
    });
  });
  describe('getHttpsTunnel', () => {
    describe('with proxy set', () => {
      beforeEach(() => {
        process.env.HTTPS_PROXY = 'http://test.proxy.com:3128';
        configService = new ConfigService();
      });
      it('should return proxy config', () => {
        const expectedResult = tunnel.httpsOverHttp({
          ca: undefined,
          proxy: {
            host: 'test.proxy.com',
            port: 3128
          }
        });
        const result = configService.getHttpsTunnel();
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
      });
    });
    describe('without proxy set', () => {
      beforeEach(() => {
        delete process.env.HTTPS_PROXY;
        delete process.env.HTTP_PROXY;
        configService = new ConfigService();
      });
      it('should return undefined', () => {
        const result = configService.getHttpsTunnel();
        expect(result).toBeUndefined();
      });
    });
  });
});
