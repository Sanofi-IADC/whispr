import createJWKSMock, { JWKSMock } from 'mock-jwks';

export function startAuthServer(jwksServer: string): JWKSMock {
  const jwks = createJWKSMock(jwksServer);
  jwks.start();
  return jwks;
}

export function getToken(jwks: JWKSMock, authDomain: string): string {
  return jwks.token({
    iss: `${authDomain}/`,
  });
}

export function stopAuthServer(jwks: JWKSMock) {
  jwks.stop();
}
