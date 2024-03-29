import { Test } from '@nestjs/testing';
import { ExtractJwt } from '@sanofi-iadc/passport-multi-jwt';
import JwksRsa, { passportJwtSecret } from 'jwks-rsa';
import { AUTH } from '../../testUtils/testingConsts';
import { ConfigService } from '../../../src/config/config.service';

async function getConfigService() {
  const module = await Test.createTestingModule({
    providers: [ConfigService],
  }).compile();
  return module.get(ConfigService);
}

describe('ConfigService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Correctly configures secretOrKeyProvider', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is configured with secretOrKeyProvider
    process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_JWKS;

    // When the auth configuration is retrieved
    const configService = await getConfigService();
    const result = configService.getAuthConfig();

    // Then the configuration should use the jwks passportJwtSecret function
    const expectedFunc = passportJwtSecret({ jwksUri: 'uri' });
    expect(result[0].secretOrKeyProvider.toString()).toEqual(expectedFunc.toString());
    expect(result[0].secretOrKeyProvider).toEqual(expect.any(Function));
  });

  it('Should correctly configure secretOrKey', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using fromAuthHeaderAsBearerToken
    process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_secretOrKey;

    // When the auth configuration is retrieved
    const configService = await getConfigService();
    const result = configService.getAuthConfig();

    // It should have a secretOrKeyProvider
    expect(result[0]).toHaveProperty('secretOrKey');
    expect(result[0].secretOrKey).toBe('A_SECRET');
  });

  it('Should process all configs when the array contains multiple configurations', async () => {
    // Given AUTH_CONFIG_SECRET environment variable contains multiple configurations
    process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_WITH_4_CONFIGS;

    // When the auth configuration is retrieved
    const configService = await getConfigService();
    const result = configService.getAuthConfig();

    // Each elemtn in the array should have a secretOrKeyProvider (basic check to ensure that the config was processed)
    expect(result).toHaveLength(4);
    result.map((config) => expect(config).toHaveProperty('jwtFromRequest'));
  });

  it('Should throw an error if AUTH_CONFIG is empty', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is an empty string
    process.env.AUTH_CONFIG_SECRET = '';

    // When the auth configuration is retrieved
    try {
      await getConfigService();
    } catch (err) {
      // Then a 'must be of type object' error should be thrown
      expect(err.stack).toContain('ValidationError');
      expect(err.stack).toContain('AUTH_CONFIG_SECRET');
      expect(err.stack).toContain('must be of type object');
    }
  });

  it('Should throw an error if AUTH_CONFIG.config is not an array', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is a simple object with non-array config property
    process.env.AUTH_CONFIG_SECRET = '{ "config": "smudge"}';

    // When the auth configuration is retrieved
    try {
      await getConfigService();
    } catch (err) {
      // Then a 'must be an array' error should be thrown
      expect(err.stack).toContain('ValidationError');
      expect(err.stack).toContain('AUTH_CONFIG_SECRET.config');
      expect(err.stack).toContain('must be an array');
    }
  });

  it('Should correctly configure proxy if available', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is configured with secretOrKeyProvider
    process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_JWKS;
    process.env.HTTP_PROXY = 'https://proxy_uri:port';
    const spy = jest.spyOn(JwksRsa, 'passportJwtSecret');

    // When the auth configuration is retrieved
    const configService = await getConfigService();
    configService.getAuthConfig();

    // (passportJwtSecret as jest.Mock).mockReturnValue(() => {});
    // Then the configuration should use the jwks passportJwtSecret function
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        requestAgent: expect.objectContaining({
          proxy: expect.objectContaining({
            protocol: 'https:',
            host: 'proxy_uri',
            port: 443,
            hostname: 'proxy_uri',
            href: 'https://proxy_uri/:port',
          }),
        }),
      }),
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Should correctly configure proxy if not available', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is configured with secretOrKeyProvider
    process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_JWKS;
    delete process.env.HTTP_PROXY;
    delete process.env.HTTPS_PROXY;
    const spy = jest.spyOn(JwksRsa, 'passportJwtSecret');

    // When the auth configuration is retrieved
    const configService = await getConfigService();
    configService.getAuthConfig();

    // (passportJwtSecret as jest.Mock).mockReturnValue(() => {});
    // Then the configuration should use the jwks passportJwtSecret function
    expect(spy).toBeCalledWith(
      expect.not.objectContaining({
        requestAgent: expect.anything(),
      }),
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('JWT extractors', () => {
    it('Should correctly set JWT extraction method jwtFromRequest: fromAuthHeaderAsBearerToken', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using fromAuthHeaderAsBearerToken
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_fromAuthHeaderAsBearerToken;
      const spy = jest.spyOn(ExtractJwt, 'fromAuthHeaderAsBearerToken');

      // When the auth configuration is retrieved
      const configService = await getConfigService();
      const result = configService.getAuthConfig();

      // Then the configuration jwtFromRequest should call ExtractJwt.fromAuthHeaderAsBearerToken
      const expectedFunc = ExtractJwt.fromAuthHeaderAsBearerToken();
      expect(result[0].jwtFromRequest.toString()).toEqual(expectedFunc.toString());
      expect(spy).toHaveBeenCalled();
      expect(result[0].jwtFromRequest).toEqual(expect.any(Function));
    });

    it('Should correctly set JWT extraction method jwtFromRequest: fromHeader', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using fromAuthHeaderAsBearerToken
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_fromHeader;
      const spy = jest.spyOn(ExtractJwt, 'fromHeader');

      // When the auth configuration is retrieved
      const configService = await getConfigService();
      const result = configService.getAuthConfig();

      // Then the configuration jwtFromRequest should call ExtractJwt.fromHeader with the correct argument
      const expectedFunc = ExtractJwt.fromHeader('fieldName');
      expect(result[0].jwtFromRequest.toString()).toEqual(expectedFunc.toString());
      expect(spy).toHaveBeenCalledWith('fieldName');
      expect(result[0].jwtFromRequest).toEqual(expect.any(Function));
    });

    it('Should correctly set JWT extraction method jwtFromRequest: fromAuthHeaderWithScheme', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using fromAuthHeaderAsBearerToken
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_fromAuthHeaderWithScheme;
      const spy = jest.spyOn(ExtractJwt, 'fromAuthHeaderWithScheme');

      // When the auth configuration is retrieved
      const configService = await getConfigService();
      const result = configService.getAuthConfig();

      // Then the configuration jwtFromRequest should call ExtractJwt.fromAuthHeaderWithScheme with the correct argument
      const expectedFunc = ExtractJwt.fromAuthHeaderWithScheme('schemeName');
      expect(result[0].jwtFromRequest.toString()).toEqual(expectedFunc.toString());
      expect(spy).toHaveBeenCalledWith('schemeName');
      expect(result[0].jwtFromRequest).toEqual(expect.any(Function));
    });

    it('Should correctly set JWT extraction method jwtFromRequest: fromUrlQueryParameter', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using fromAuthHeaderAsBearerToken
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_fromUrlQueryParameter;
      const spy = jest.spyOn(ExtractJwt, 'fromUrlQueryParameter');

      // When the auth configuration is retrieved
      const configService = await getConfigService();
      const result = configService.getAuthConfig();

      // Then the configuration jwtFromRequest should call ExtractJwt.fromUrlQueryParameter with the correct argument
      const expectedFunc = ExtractJwt.fromUrlQueryParameter('paramName');
      expect(result[0].jwtFromRequest.toString()).toEqual(expectedFunc.toString());
      expect(spy).toHaveBeenCalledWith('paramName');
      expect(result[0].jwtFromRequest).toEqual(expect.any(Function));
    });

    it('Should correctly set JWT extraction method jwtFromRequest: fromBodyField', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using fromAuthHeaderAsBearerToken
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_fromBodyField;
      const spy = jest.spyOn(ExtractJwt, 'fromBodyField');

      // When the auth configuration is retrieved
      const configService = await getConfigService();
      const result = configService.getAuthConfig();

      // Then the configuration jwtFromRequest should call ExtractJwt.fromBodyField with the correct argument
      const expectedFunc = ExtractJwt.fromBodyField('fieldName');
      expect(result[0].jwtFromRequest.toString()).toEqual(expectedFunc.toString());
      expect(spy).toHaveBeenCalledWith('fieldName');
      expect(result[0].jwtFromRequest).toEqual(expect.any(Function));
    });

    it('Should fill secretOrKey with env variable value which key equals content of secretOrKeyFromEnv', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using AUTH_CONFIG_SECRET_secretOrKey
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_secretOrKeyFromEnv;
      const secret = 'secret stored in env variable';
      process.env.ENV_VAR_STORING_THE_SECRET = secret;

      // When the auth configuration is retrieved
      const configService = await getConfigService();
      const confs = configService.fillSecretFromEnv();
      expect(confs.config[0].secretOrKey).toEqual(secret);
    });

    it(
      'Should fill secretOrKey with empty string '
        + 'if no env variable with key equals'
        + ' content of secretOrKeyFromEnv is found',
      async () => {
        // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using AUTH_CONFIG_SECRET_secretOrKey
        process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_secretOrKeyFromEnv;
        delete process.env.ENV_VAR_STORING_THE_SECRET;

        // When the auth configuration is retrieved
        const configService = await getConfigService();
        const confs = configService.fillSecretFromEnv();
        expect(confs.config[0].secretOrKey).toEqual('');
      },
    );

    it('Fill both secretOrKey and  secretOrKeyFromEnv should raise an exception', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using AUTH_CONFIG_SECRET_secretOrKey
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_secretOrKeyFromEnvAndsecretOrKey;

      // When the auth configuration is retrieved
      try {
        await getConfigService();
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toContain('contains a conflict between exclusive peers');
      }
    });
  });
});
