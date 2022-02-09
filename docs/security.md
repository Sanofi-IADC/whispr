# Security

## Authentication

Whispr supports authentication via JWT, and can be configured to authenticate against mutliple configurations (mutliple issuers, multiple secrets).

### Configuration

Security is implemented via an extended version of passport-jwt which allows an array of configurations to be passed on startup.

To configure, set the `AUTH_CONFIG_SECRET`

_ Note that even though the `AUTH_CONFIG_SECRET` is not necessarily a secret (in the case of config with JWKS providers), this environment variable is named `_SECRET` to ensure that it is hidden by APM tools in case it contains secret keys. _

The provided configuration is very similar to the NestJS passport-jwt example with a few modifications:
- it must be provided as a JSON string containing a `config` property which is an array of valid passport-jwt configurations
- the jwtFromRequest which tells passport-jwt where to find the JWT in the request (usually the `Authorization` header) function must be deconstructed into an object containing funcName and args properties

```js
[{
    secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
},
{
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: 'APPX_SECRET_KEY',
},
{
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: 'APPY_SECRET_KEY',
}]
```

```bash
AUTH_CONFIG_SECRET = 
# note that in a .env file this should be formatted onto one line - it is shown multiline here for easier readability
# see project example.env file for a single line config
{"config":[{
    "jwtFromRequest":{
        "funcName": "fromAuthHeaderAsBearerToken"},
        "ignoreExpiration":false,
        "secretOrKey":"APPX_SECRET_KEY"},
    {"jwtFromRequest": {
        "funcName": "fromAuthHeaderAsBearerToken"},
        "ignoreExpiration":false,
        "secretOrKey":"another_secret_key"}
    ]
}
```

## Authorisation

No specific authorisation is currently implemented in Whispr - if you are authenticated it is assumed that you should have access to all data in Whispr.