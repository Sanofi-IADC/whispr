export const AUTH = {
  // JWT signed with key shown in variable name 'VALID_SECRET KEY/NON_VALID_SECRET KEY
  // keys expire in the year 2999 - the test should be updated before that
  JWT_SIGNED_WITH_VALID_SECRET_KEY:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDQwMTE3NTksImV4cCI6MzI0NzUxNjA1ODksImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.uU2m8A1nz1qYjp_ncDCSxhRmqF-qkQ1Gcs8jo5-vO-o', // eslint-disable-line max-len
  JWT_SIGNED_WITH_NON_VALID_SECRET_KEY:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDQwMTE3NTksImV4cCI6MzI0NzUxNjA1ODksImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DYo6Q3J9JFDsiKq-MDMqV0NFzIEWNsiAMYsQrWBSHAo', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_JWKS:
    '{"config":[{"jwtFromRequest":{"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKeyProvider": { "cache": true, "rateLimit": true, "jwksRequestsPerMinute": 5, "jwksUri": "https://uri.com"}},{"jwtFromRequest": {"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKey":"another_secret_key"}]}', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_secretOrKey:
    '{"config":[{"jwtFromRequest": {"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKey":"A_SECRET"}]}', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_secretOrKeyFromEnv:
    '{"config":[{"jwtFromRequest": {"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKeyFromEnv":"ENV_VAR_STORING_THE_SECRET"}]}', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_secretOrKeyFromEnvAndsecretOrKey:
    '{"config":[{"jwtFromRequest": {"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKeyFromEnv":"ENV_VAR_STORING_THE_SECRET","secretOrKey":"A_SECRET"}]}', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_fromAuthHeaderAsBearerToken:
    '{"config":[{"jwtFromRequest":{"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKeyProvider": { "cache": true, "rateLimit": true, "jwksRequestsPerMinute": 5, "jwksUri": "https://uri.com"}}]}', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_fromHeader:
    '{"config":[{"jwtFromRequest":{"funcName": "fromHeader", "args": "fieldName"},"ignoreExpiration":false,"secretOrKeyProvider": { "cache": true, "rateLimit": true, "jwksRequestsPerMinute": 5, "jwksUri": "https://uri.com"}}]}', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_fromBodyField:
    '{"config":[{"jwtFromRequest":{"funcName": "fromBodyField", "args": "fieldName"},"ignoreExpiration":false,"secretOrKeyProvider": { "cache": true, "rateLimit": true, "jwksRequestsPerMinute": 5, "jwksUri": "https://uri.com"}}]}', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_fromUrlQueryParameter:
    '{"config":[{"jwtFromRequest":{"funcName": "fromUrlQueryParameter", "args": "paramName"},"ignoreExpiration":false,"secretOrKeyProvider": { "cache": true, "rateLimit": true, "jwksRequestsPerMinute": 5, "jwksUri": "https://uri.com"}}]}', // eslint-disable-line max-len
  AUTH_CONFIG_SECRET_fromAuthHeaderWithScheme:
    '{"config":[{"jwtFromRequest":{"funcName": "fromAuthHeaderWithScheme", "args": "schemeName"},"ignoreExpiration":false,"secretOrKeyProvider": { "cache": true, "rateLimit": true, "jwksRequestsPerMinute": 5, "jwksUri": "https://uri.com"}}]}', // eslint-disable-line max-len
  AUTH_CONFIG_WITH_4_CONFIGS:
    '{"config":[{"jwtFromRequest":{"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKeyProvider": { "cache": true, "rateLimit": true, "jwksRequestsPerMinute": 5, "jwksUri": "https://uri.com"}},{"jwtFromRequest": {"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKey":"another_secret_key"},{"jwtFromRequest":{"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKeyProvider": { "cache": true, "rateLimit": true, "jwksRequestsPerMinute": 5, "jwksUri": "https://uri.com"}},{"jwtFromRequest": {"funcName": "fromAuthHeaderAsBearerToken"},"ignoreExpiration":false,"secretOrKey":"another_secret_key"}]}', // eslint-disable-line max-len
};
