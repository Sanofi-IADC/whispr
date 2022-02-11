import { Test } from '@nestjs/testing';
import { AUTH } from '../../testUtils/testingConsts';
import { ConfigService } from '../../../src/config/config.service';

async function getConfigService() {
  const module = await Test.createTestingModule({
    providers: [ConfigService],
  }).compile();
  return module.get(ConfigService);
}

describe('ConfigService', () => {
  describe('When getting authConfig()', () => {
    it('Correctly configures secretOrKeyProvider', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured with secretOrKeyProvider
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_JWKS;

      // When the auth configuration is retrieved
      const configService = await getConfigService();

      // Then the configuration should use the jwks secretOrKeyProvider function
      const result = configService.getAuthConfig();
      expect(result[0]).toHaveProperty('secretOrKeyProvider');
    });
  });

  it('Should correctly configure secretOrKey', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using fromAuthHeaderAsBearerToken
    process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_secretOrKey;

    // When the auth configuration is retrieved
    const configService = await getConfigService();

    // It should have a secretOrKeyProvider
    const result = configService.getAuthConfig();
    expect(result[0]).toHaveProperty('secretOrKey');
    expect(result[0].secretOrKey).toBe('A_SECRET');
  });

  it('Should throw an error if AUTH_CONFIG is empty', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is an empty string
    process.env.AUTH_CONFIG_SECRET = '';

    // When the auth configuration is retrieved
    try {
      await getConfigService();
    } catch (err) {
      // Then a 'must be of type object' error should be thrown
      console.log(err);
      expect(err.stack).toContain('ValidationError');
      expect(err.stack).toContain('AUTH_CONFIG_SECRET');
      expect(err.stack).toContain('must be of type object');
    }
  });

  it('Should throw an error if AUTH_CONFIG is empty', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is a simple object with non-array config property
    process.env.AUTH_CONFIG_SECRET = '{ "config": "smudge"}';

    // When the auth configuration is retrieved
    try {
      await getConfigService();
    } catch (err) {
      // Then a 'must be an array' error should be thrown
      console.log(err);
      expect(err.stack).toContain('ValidationError');
      expect(err.stack).toContain('AUTH_CONFIG_SECRET.config');
      expect(err.stack).toContain('must be an array');
    }
  });

  it('Should correctly set jwtFromRequest: fromAuthHeaderAsBearerToken', async () => {
    // Given AUTH_CONFIG_SECRET environment variable is configured to extract the JWT using fromAuthHeaderAsBearerToken
    process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_fromAuthHeaderAsBearerToken;

    // When the auth configuration is retrieved
    const configService = await getConfigService();

    // Then the configuration should
    const result = configService.getAuthConfig();
    expect(result[0]).toHaveProperty('jwtFromRequest'); // TODO check function
  });
});
