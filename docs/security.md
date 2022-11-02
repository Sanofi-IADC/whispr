# Security

## Authentication

Whispr supports authentication via JWT, and can be configured to authenticate against mutliple configurations (mutliple issuers, multiple secrets).

### Configuration

Security is implemented via an extended version of passport-jwt which allows an array of configurations to be passed on startup.

To configure, set the `AUTH_CONFIG_SECRET`

_ Note that even though the `AUTH_CONFIG_SECRET` is not necessarily a secret (in the case of config with JWKS providers), this environment variable is named `_SECRET` to ensure that it is hidden by APM tools in case it contains secret keys. _

The provided configuration is very similar to the NestJS passport-jwt example with a few modifications:
- it must be provided as a JSON string containing a `config` property which is an array of valid passport-jwt configurations
- the `jwtFromRequest` function which tells passport-jwt where to find the JWT in the request (usually the `Authorization` header) function must be deconstructed into an object containing funcName and args properties
- `passportJwtSecret` function should not be written in the configuration file, only the arguments are required in the `passportJwtSecret` object

### passthrough (disable authentication)

For debug purpose or deployability (feature flag). Authentication can be disable by providing to passport-multi-jwt a "passthrough":true to a given configuration

### Examples

This is an example for multiple passport JWT configurations as they would be configured in Javascript.

```js
[{
    secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://auth.issuer.com",
    }),

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    audience: 'MY_APP_AUDIENCE',
    issuer: `https://auth.issuer.com/`,
    algorithms: ['RS256'],
},
{
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: 'APPX_SECRET_KEY',
},
{
    jwtFromRequest: ExtractJwt.fromBodyField('USER_JWT'),
    ignoreExpiration: false,
    secretOrKey: 'APPY_SECRET_KEY',
}]
```

And an example env file configuration for `AUTH_CONFIG_SECRET` based on the configuration above.

```bash
AUTH_CONFIG_SECRET = 
# note that in a .env file this should be formatted onto one line - it is shown multiline here for easier readability
# see project example.env file for a single line config
{"config":[{
        "secretOrKeyProvider": {
            "cache": true,
            "rateLimit": true,
            "jwksRequestsPerMinute": 5,
            "jwksUri": "https://uri.com"
            },
        "jwtFromRequest":{"funcName": "fromAuthHeaderAsBearerToken"},
        "audience": "MY_APP_AUDIENCE",
        "issuer":"https://fact.cognito.com/",
        "algorithms": ['RS256']
    },
    {
        "jwtFromRequest":{"funcName": "fromAuthHeaderAsBearerToken"},
        "ignoreExpiration":false,
        "secretOrKey":"APPX_SECRET_KEY"},
    {
        "jwtFromRequest": {"funcName": "fromBodyField", args: 'USER_JWT'},
        "ignoreExpiration":false,
        "secretOrKey":"APPY_SECRET_KEY"}
    ]
}
```

### Secret passed through environment variable

Good practice imposed to not store secret in version control managment system and retrieve it from an environment variable instead.
Do so and setup the `secretOrKeyFromEnv` config property with the name of an environment variable of your choice and leave `secretOrKey` empty.  `secretOrKey` will then be automatically filled with your environment variable's value.

## Authorisation

No specific authorisation is currently implemented in Whispr - if you are authenticated it is assumed that you should have access to all data in Whispr.