import http from 'node:http';
import { URL } from 'node:url';
import type { OIDCConfiguration, TokenResponse, IDTokenClaims } from './oidc.js';
import { exchangeCodeForTokens, decodeIdToken } from './oidc.js';
import { renderDashboard, renderError, renderWaiting } from './templates.js';

export interface ServerConfig {
  port: number;
  clientId: string;
  codeVerifier: string;
  state: string;
  oidcConfig: OIDCConfiguration;
  authorizationUrl: string;
}

interface SessionData {
  tokens?: TokenResponse;
  claims?: IDTokenClaims;
  error?: string;
  errorDetails?: string;
}

export function createServer(config: ServerConfig): http.Server {
  const redirectUri = `http://localhost:${config.port}/auth/callback`;
  const session: SessionData = {};

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://localhost:${config.port}`);
    const pathname = url.pathname;

    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

    try {
      if (pathname === '/') {
        res.writeHead(302, { Location: config.authorizationUrl });
        res.end();
        return;
      }

      if (pathname === '/auth/callback') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');

        if (error) {
          console.error(`Authorization error: ${error} - ${errorDescription}`);
          session.error = error;
          session.errorDetails = errorDescription || undefined;
          res.writeHead(302, { Location: '/error' });
          res.end();
          return;
        }

        if (state !== config.state) {
          console.error('State mismatch - possible CSRF attack');
          session.error = 'State mismatch';
          session.errorDetails = 'The state parameter does not match. This could indicate a CSRF attack.';
          res.writeHead(302, { Location: '/error' });
          res.end();
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          session.error = 'No authorization code';
          session.errorDetails = 'The authorization server did not return a code.';
          res.writeHead(302, { Location: '/error' });
          res.end();
          return;
        }

        console.log('Exchanging authorization code for tokens...');

        try {
          const tokens = await exchangeCodeForTokens(
            config.oidcConfig.token_endpoint,
            code,
            config.codeVerifier,
            redirectUri,
            config.clientId
          );

          console.log('Token exchange successful!');
          session.tokens = tokens;

          if (tokens.id_token) {
            session.claims = decodeIdToken(tokens.id_token);
            console.log('ID Token decoded successfully');
            console.log(`User: ${session.claims.email || session.claims.sub}`);
          }

          res.writeHead(302, { Location: '/dashboard' });
          res.end();
        } catch (tokenError) {
          console.error('Token exchange failed:', tokenError);
          session.error = 'Token exchange failed';
          session.errorDetails = tokenError instanceof Error ? tokenError.message : String(tokenError);
          res.writeHead(302, { Location: '/error' });
          res.end();
        }
        return;
      }

      if (pathname === '/dashboard') {
        if (!session.tokens || !session.claims) {
          res.writeHead(302, { Location: '/' });
          res.end();
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderDashboard(session.claims, session.tokens));
        return;
      }

      if (pathname === '/error') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderError(session.error || 'Unknown error', session.errorDetails));
        return;
      }

      if (pathname === '/waiting') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderWaiting());
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } catch (err) {
      console.error('Server error:', err);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(renderError('Internal server error', err instanceof Error ? err.message : String(err)));
    }
  });

  return server;
}
