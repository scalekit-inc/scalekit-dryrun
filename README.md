# scalekit-dryrun

Test your Scalekit authentication setup without writing a single line of code.

This CLI tool creates a complete PKCE-based OAuth flow, letting you verify your Scalekit configuration is working correctly before integrating into your application.

## Prerequisites

- Node.js 20 or higher
- A Scalekit account with an environment configured
- A redirect URI registered in the Scalekit Dashboard (see Setup below)

## Setup

Before running the tool, register the redirect URI in the Scalekit Dashboard:

1. Go to the [Scalekit Dashboard](https://app.scalekit.com)
2. Navigate to **Authentication** > **Redirect URIs**
3. Add `http://localhost:8080/auth/callback`
4. Save changes

You must complete this step before proceeding to run the command.

## Usage

**Before running the command:** Ensure you have registered `http://localhost:8080/auth/callback` as a redirect URI in the [Scalekit Dashboard](https://app.scalekit.com) under **Authentication** > **Redirect URIs**.

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
3. Starts a local server on port `8080`
4. Opens your browser to begin authentication
5. After successful login, displays a dashboard with your user information

## Dashboard

After successful authentication, you'll see:

- User profile information (name, email, avatar)
- All ID token claims
- Option to view the raw token response

## Troubleshooting

### "redirect_uri mismatch" error

Ensure `http://localhost:8080/auth/callback` is added as a redirect URI in the Scalekit Dashboard (app.scalekit.com) under **Authentication** > **Redirect URIs**.

### "Invalid client_id" error

Verify your `--client_id` matches the one in your Scalekit dashboard.

### Port 8080 already in use

Another process is using port 8080. Stop that process or wait for it to complete.

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
- [Scalekit Community](https://join.slack.com/t/scalekit-community/shared_invite/zt-3gsxwr4hc-0tvhwT2b_qgVSIZQBQCWRw)
- [Scalekit Dashboard](https://app.scalekit.com)
- [GitHub Issues](https://github.com/scalekit-inc/scalekit-dryrun/issues)

## License

MIT
