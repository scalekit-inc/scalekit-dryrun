export interface OIDCConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  scopes_supported?: string[];
  response_types_supported?: string[];
  code_challenge_methods_supported?: string[];
}

export async function discoverOIDCConfiguration(envUrl: string): Promise<OIDCConfiguration> {
  const wellKnownUrl = `https://${envUrl}/.well-known/openid-configuration`;

  console.log(`Fetching OIDC configuration from: ${wellKnownUrl}`);

  const response = await fetch(wellKnownUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch OIDC configuration: ${response.status} ${response.statusText}`);
  }

  const config = await response.json() as OIDCConfiguration;

  if (!config.authorization_endpoint) {
    throw new Error('Invalid OIDC configuration: missing authorization_endpoint');
  }

  if (!config.token_endpoint) {
    throw new Error('Invalid OIDC configuration: missing token_endpoint');
  }

  return config;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

export async function exchangeCodeForTokens(
  tokenEndpoint: string,
  code: string,
  codeVerifier: string,
  redirectUri: string,
  clientId: string
): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json() as Promise<TokenResponse>;
}

export interface IDTokenClaims {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  [key: string]: unknown;
}

export function decodeIdToken(idToken: string): IDTokenClaims {
  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid ID token format');
  }

  const payload = parts[1];
  const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
  return JSON.parse(decoded) as IDTokenClaims;
}
