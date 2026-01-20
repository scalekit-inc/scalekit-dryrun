#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { discoverOIDCConfiguration } from './oidc.js';
import { generateCodeVerifier, generateCodeChallenge, generateState } from './pkce.js';
import { createServer } from './server.js';

const PORT = 12456;
const REDIRECT_URI = `http://localhost:${PORT}/auth/callback`;
const SCOPES = 'openid email profile offline_access';

interface CLIOptions {
  env_url: string;
  client_id: string;
  mode: 'sso' | 'fsa';
  organization_id?: string;
}

function printUsage(): void {
  console.log(`
Scalekit Dryrun - Test authentication flows without code

Usage:
  npx @scalekit-sdk/dryrun --env_url=<url> --client_id=<id> [--mode=<sso|fsa>] [--organization_id=<id>]

Options:
  --env_url         Your Scalekit environment URL (e.g., env-xxxxx.scalekit.com)
  --client_id       Your OAuth client ID
  --mode            Authentication mode: 'sso' for enterprise SSO, 'fsa' for full-stack auth (default: fsa)
  --organization_id Required for SSO mode - the organization ID to authenticate against
  --help            Show this help message

Examples:
  # Full-stack authentication (default mode)
  npx @scalekit-sdk/dryrun --env_url=env-abc123.scalekit.com --client_id=skc_xxx

  # Enterprise SSO for a specific organization
  npx @scalekit-sdk/dryrun --env_url=env-abc123.scalekit.com --client_id=skc_xxx --mode=sso --organization_id=org_xxx
`);
}

function parseOptions(): CLIOptions | null {
  try {
    const { values } = parseArgs({
      options: {
        env_url: { type: 'string' },
        client_id: { type: 'string' },
        mode: { type: 'string' },
        organization_id: { type: 'string' },
        help: { type: 'boolean' },
      },
      strict: true,
    });

    if (values.help) {
      printUsage();
      return null;
    }

    if (!values.env_url) {
      console.error('Error: --env_url is required');
      printUsage();
      process.exit(1);
    }

    if (!values.client_id) {
      console.error('Error: --client_id is required');
      printUsage();
      process.exit(1);
    }

    const mode = values.mode || 'fsa';
    if (!['sso', 'fsa'].includes(mode)) {
      console.error('Error: --mode must be either "sso" or "fsa"');
      printUsage();
      process.exit(1);
    }

    if (mode === 'sso' && !values.organization_id) {
      console.error('Error: --organization_id is required when mode is "sso"');
      printUsage();
      process.exit(1);
    }

    return {
      env_url: values.env_url,
      client_id: values.client_id,
      mode: mode as 'sso' | 'fsa',
      organization_id: values.organization_id,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
    }
    printUsage();
    process.exit(1);
  }
}

function buildAuthorizationUrl(
  authEndpoint: string,
  clientId: string,
  codeChallenge: string,
  state: string,
  mode: 'sso' | 'fsa',
  organizationId?: string
): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: state,
  });

  if (mode === 'sso' && organizationId) {
    params.set('organization_id', organizationId);
  }

  return `${authEndpoint}?${params.toString()}`;
}

async function main(): Promise<void> {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                   Scalekit Dryrun                         ║
  ║           Test authentication without code                ║
  ╚═══════════════════════════════════════════════════════════╝
`);

  const options = parseOptions();
  if (!options) {
    return;
  }

  console.log('Configuration:');
  console.log(`  Environment URL: ${options.env_url}`);
  console.log(`  Client ID: ${options.client_id}`);
  console.log(`  Mode: ${options.mode}`);
  if (options.organization_id) {
    console.log(`  Organization ID: ${options.organization_id}`);
  }
  console.log(`  Redirect URI: ${REDIRECT_URI}`);
  console.log('');

  try {
    console.log('Step 1: Discovering OIDC configuration...');
    const oidcConfig = await discoverOIDCConfiguration(options.env_url);
    console.log(`  Authorization endpoint: ${oidcConfig.authorization_endpoint}`);
    console.log(`  Token endpoint: ${oidcConfig.token_endpoint}`);
    console.log('');

    console.log('Step 2: Generating PKCE parameters...');
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();
    console.log('  Code verifier and challenge generated');
    console.log('');

    console.log('Step 3: Building authorization URL...');
    const authorizationUrl = buildAuthorizationUrl(
      oidcConfig.authorization_endpoint,
      options.client_id,
      codeChallenge,
      state,
      options.mode,
      options.organization_id
    );
    console.log('');

    console.log('Step 4: Starting local server...');
    const server = createServer({
      port: PORT,
      clientId: options.client_id,
      codeVerifier,
      state,
      oidcConfig,
      authorizationUrl,
    });

    server.listen(PORT, async () => {
      console.log(`  Server running at http://localhost:${PORT}`);
      console.log('');
      console.log('Step 5: Opening browser for authentication...');

      const open = await import('open');
      await open.default(authorizationUrl);

      console.log('');
      console.log('Waiting for authentication...');
      console.log('(Press Ctrl+C to cancel)');
      console.log('');
    });

    process.on('SIGINT', () => {
      console.log('\nShutting down...');
      server.close();
      process.exit(0);
    });
  } catch (err) {
    console.error('');
    console.error('Error:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main();
