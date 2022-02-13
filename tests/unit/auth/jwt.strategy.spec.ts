/* eslint-disable no-underscore-dangle */
// (because _ is needed to check passport-multi-jwt setup)

import { Test } from '@nestjs/testing';
import { AUTH } from '../../testUtils/testingConsts';
import { ConfigService } from '../../../src/config/config.service';
import { JwtStrategy } from '../../../src/auth/jwt.strategy';

async function getConfigService() {
  const module = await Test.createTestingModule({
    providers: [ConfigService],
  }).compile();
  return module.get(ConfigService);
}

describe('JWT Strategy', () => {
  it('Instantiates correctly with multiple passport-jwt configs', async () => {
    // Given AUTH_CONFIG_SECRET environment variable contains 4 jwt configs
    process.env.AUTH_CONFIG_SECRET = AUTH.AUTH_CONFIG_WITH_4_CONFIGS;
    const configService = await getConfigService();

    // When the JWT Strategy is instantiated
    const result = new JwtStrategy(configService);

    // Then the JWT strategy object should have 4 valid passport-jwt configurations
    expect(result.name).toEqual('jwt');
    expect(result._config).toHaveLength(4);
    result._config.map((config) => expect(config._jwtFromRequest).toBeDefined());
  });
});
