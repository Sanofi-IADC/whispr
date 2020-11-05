import { ConfigService } from '../../../src/config/config.service';

describe('ConfigService', () => {
  let configService: ConfigService;
  beforeEach(() => {
    process.env.NODE_ENV = 'example';
  });
  describe('get', () => {
    beforeEach(() => {
      process.env.HTTPS_PROXY = 'http://test.proxy.com:3128';
      configService = new ConfigService();
    });
    it('should return var from process.env', () => {
      const proxy = configService.get('HTTPS_PROXY');
      expect(proxy).toEqual(process.env.HTTPS_PROXY);
    });
    it('should return var from config-file', () => {
      const proxy = configService.get('MONGOOSE_HOST');
      expect(proxy).toEqual('mongo1');
    });
    it('should return undefined if var is not set', () => {
      const result = configService.get('HTTP_PROXY');
      expect(result).toBeUndefined();
    });
  });
  describe('getProxyConfig', () => {
    describe('with proxy set', () => {
      beforeEach(() => {
        process.env.HTTPS_PROXY = 'http://test.proxy.com:3128';
        configService = new ConfigService();
      });
      it('should return proxy config', () => {
        const expectedResult = {
          host: 'test.proxy.com',
          port: 3128,
        };
        const result = configService.getProxyConfig();
        expect(result).toEqual(expectedResult);
      });
    });
    describe('without proxy set', () => {
      beforeEach(() => {
        delete process.env.HTTPS_PROXY;
        configService = new ConfigService();
      });
      it('should return undefined', () => {
        const result = configService.getProxyConfig();
        expect(result).toBeUndefined();
      });
    });
  });
});
