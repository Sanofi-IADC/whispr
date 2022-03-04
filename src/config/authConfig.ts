interface ConfigItem {
  jwksUri: string;
  jwtFromRequest: {
    funcName:
      | 'fromHeader'
      | 'fromBodyField'
      | 'fromUrlQueryParameter'
      | 'fromAuthHeaderWithScheme'
      | 'fromAuthHeaderAsBearerToken';
    args: string;
  };
  ignoreExpiration?: boolean;
  passReqToCallback?: boolean;

  secretOrKey?: string;
  secretOrKeyFromEnv?: string;
  secretOrKeyProvider?: {
    cache: boolean;
    rateLimit: boolean;
    jwksRequestsPerMinute: number;
    jwksUri: string;
  };

  requestAgent: object;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AuthConfig {
  config: ConfigItem[];
}
