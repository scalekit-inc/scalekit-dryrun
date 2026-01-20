# scalekit-dryrun

Test your Scalekit authentication setup without writing a single line of code.

This CLI tool creates a complete PKCE-based OAuth flow, letting you verify your Scalekit configuration is working correctly before integrating into your application.

## Prerequisites

- Node.js 20 or higher
- A Scalekit account with an environment configured
- `http://localhost:12456/auth/callback` added as a redirect URI in your Scalekit dashboard

## Setup

Before using this tool, add the redirect URI to your Scalekit application:

1. Go to your [Scalekit Dashboard](https://app.scalekit.com)
2. Navigate to **API Config** > **Redirect URIs**
3. Add `http://localhost:12456/auth/callback`
4. Save changes

## Usage

```bash
npx @scalekit-sdk/dryrun --env_url=<url> --client_id=<id> [--mode=<sso|fsa>] [--organization_id=<id>]
```

### Options

| Option | Required | Description |
|--------|----------|-------------|
| `--env_url` | Yes | Your Scalekit environment URL (e.g., `env-xxxxx.scalekit.cloud`) |
| `--client_id` | Yes | Your OAuth client ID (starts with `skc_`) |
| `--mode` | No | `fsa` for full-stack authentication, `sso` for enterprise SSO (default: `fsa`) |
| `--organization_id` | SSO only | Required when mode is `sso` - the organization ID to authenticate against |
| `--help` | No | Show help message |

### Examples

**Full-Stack Authentication (FSA)**

Test the complete authentication flow managed by Scalekit:

```bash
npx @scalekit-sdk/dryrun \
  --env_url=env-abc123.scalekit.cloud \
  --client_id=skc_12345678901234567
```

**Enterprise SSO**

Test SSO authentication for a specific organization:

```bash
npx @scalekit-sdk/dryrun \
  --env_url=env-abc123.scalekit.cloud \
  --client_id=skc_12345678901234567 \
  --mode=sso \
  --organization_id=org_98765432109876543
```

## What Happens

1. The CLI fetches your OIDC configuration from Scalekit
2. Generates secure PKCE parameters (code verifier and challenge)
3. Starts a local server on port `12456`
4. Opens your browser to begin authentication
5. After successful login, displays a dashboard with your user information

## Dashboard

After successful authentication, you'll see:

- User profile information (name, email, avatar)
- All ID token claims
- Option to view the raw token response

## Troubleshooting

### "redirect_uri mismatch" error

Ensure `http://localhost:12456/auth/callback` is added as a redirect URI in your Scalekit dashboard.

### "Invalid client_id" error

Verify your `--client_id` matches the one in your Scalekit dashboard.

### Port 12456 already in use

Another process is using port 12456. Stop that process or wait for it to complete.

### Organization not found (SSO mode)

Verify the `--organization_id` exists and has SSO configured in your Scalekit dashboard.

## Security

This tool is designed for **testing purposes only**. It:

- Uses PKCE for secure authorization code exchange
- Runs entirely on localhost
- Does not store any tokens or credentials
- Shuts down after you press Ctrl+C

## Support

- [Scalekit Documentation](https://docs.scalekit.com)
- [Scalekit Dashboard](https://app.scalekit.com)
- [GitHub Issues](https://github.com/scalekit-inc/scalekit-dryrun/issues)

## License

MIT
