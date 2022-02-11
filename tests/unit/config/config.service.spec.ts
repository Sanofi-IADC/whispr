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
    it('Should return a valid object when configured with secretOrKeyProvider', async () => {
      // Given AUTH_CONFIG_SECRET environment variable is configured with secretOrKeyProvider
      process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_SECRET_JWKS;

      // When the auth configuration is retrieved
      const configService = await getConfigService();

      // Then the configuration should use the jwks secretOrKeyProvider function
      const result = configService.getAuthConfig();
      expect(result[0]).toHaveProperty('secretOrKeyProvider');
    });
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
