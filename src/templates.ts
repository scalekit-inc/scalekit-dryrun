import type { IDTokenClaims } from './oidc.js';

export function renderDashboard(claims: IDTokenClaims, rawTokens: object): string {
  const displayName = claims.name || claims.email || claims.sub;
  const initials = getInitials(displayName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scalekit Dryrun - Login Successful</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 600px;
      width: 100%;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 32px;
      text-align: center;
      color: white;
    }
    .success-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 32px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .header p {
      opacity: 0.9;
      font-size: 14px;
    }
    .content {
      padding: 32px;
    }
    .user-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      margin-bottom: 24px;
    }
    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    .user-info h2 {
      font-size: 18px;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .user-info p {
      color: #64748b;
      font-size: 14px;
    }
    .claims-section h3 {
      font-size: 14px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .claims-grid {
      display: grid;
      gap: 12px;
    }
    .claim-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 14px;
    }
    .claim-key {
      color: #64748b;
      font-weight: 500;
    }
    .claim-value {
      color: #1e293b;
      font-weight: 500;
      text-align: right;
      word-break: break-all;
      max-width: 60%;
    }
    .raw-toggle {
      margin-top: 24px;
      text-align: center;
    }
    .raw-toggle button {
      background: none;
      border: 1px solid #e2e8f0;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #64748b;
      transition: all 0.2s;
    }
    .raw-toggle button:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .raw-json {
      display: none;
      margin-top: 16px;
      padding: 16px;
      background: #1e293b;
      border-radius: 8px;
      overflow-x: auto;
    }
    .raw-json.visible {
      display: block;
    }
    .raw-json pre {
      color: #e2e8f0;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .footer {
      padding: 16px 32px;
      background: #f8fafc;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      color: #94a3b8;
      font-size: 12px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">&#10003;</div>
      <h1>Login Successful!</h1>
      <p>Authentication completed via Scalekit</p>
    </div>
    <div class="content">
      <div class="user-card">
        <div class="avatar">
          ${claims.picture ? `<img src="${escapeHtml(claims.picture)}" alt="Avatar">` : initials}
        </div>
        <div class="user-info">
          <h2>${escapeHtml(displayName)}</h2>
          ${claims.email ? `<p>${escapeHtml(claims.email)}</p>` : ''}
        </div>
      </div>
      <div class="claims-section">
        <h3>ID Token Claims</h3>
        <div class="claims-grid">
          ${renderClaimsGrid(claims)}
        </div>
      </div>
      <div class="raw-toggle">
        <button onclick="toggleRaw()">View Raw Response</button>
      </div>
      <div class="raw-json" id="rawJson">
        <pre>${escapeHtml(JSON.stringify(rawTokens, null, 2))}</pre>
      </div>
    </div>
    <div class="footer">
      <p>Powered by <a href="https://scalekit.com" target="_blank">Scalekit</a> | This is a test environment</p>
    </div>
  </div>
  <script>
    function toggleRaw() {
      const rawJson = document.getElementById('rawJson');
      rawJson.classList.toggle('visible');
    }
  </script>
</body>
</html>`;
}

export function renderError(error: string, details?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scalekit Dryrun - Error</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 500px;
      width: 100%;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      padding: 32px;
      text-align: center;
      color: white;
    }
    .error-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 32px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .content {
      padding: 32px;
      text-align: center;
    }
    .error-message {
      font-size: 16px;
      color: #1e293b;
      margin-bottom: 16px;
    }
    .error-details {
      padding: 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 12px;
      color: #991b1b;
      text-align: left;
      word-break: break-all;
      white-space: pre-wrap;
    }
    .retry-button {
      margin-top: 24px;
    }
    .retry-button a {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: transform 0.2s;
    }
    .retry-button a:hover {
      transform: translateY(-2px);
    }
    .footer {
      padding: 16px 32px;
      background: #f8fafc;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      color: #94a3b8;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="error-icon">&#10007;</div>
      <h1>Authentication Failed</h1>
    </div>
    <div class="content">
      <p class="error-message">${escapeHtml(error)}</p>
      ${details ? `<div class="error-details">${escapeHtml(details)}</div>` : ''}
      <div class="retry-button">
        <a href="/">Try Again</a>
      </div>
    </div>
    <div class="footer">
      <p>Check your terminal for more details</p>
    </div>
  </div>
</body>
</html>`;
}

export function renderWaiting(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scalekit Dryrun - Starting...</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 400px;
      width: 100%;
      padding: 48px;
      text-align: center;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e2e8f0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 24px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h1 {
      font-size: 20px;
      color: #1e293b;
      margin-bottom: 8px;
    }
    p {
      color: #64748b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <h1>Redirecting to Login...</h1>
    <p>Please complete authentication in your browser</p>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

function getInitials(name: string): string {
  const parts = name.split(/[\s@]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function renderClaimsGrid(claims: IDTokenClaims): string {
  const priorityKeys = ['sub', 'email', 'name', 'given_name', 'family_name', 'iss', 'aud', 'iat', 'exp'];
  const skipKeys = ['picture'];

  const items: string[] = [];

  for (const key of priorityKeys) {
    if (key in claims && !skipKeys.includes(key)) {
      items.push(renderClaimItem(key, claims[key]));
    }
  }

  for (const [key, value] of Object.entries(claims)) {
    if (!priorityKeys.includes(key) && !skipKeys.includes(key)) {
      items.push(renderClaimItem(key, value));
    }
  }

  return items.join('');
}

function renderClaimItem(key: string, value: unknown): string {
  let displayValue = String(value);

  if (key === 'iat' || key === 'exp') {
    const date = new Date(Number(value) * 1000);
    displayValue = date.toLocaleString();
  } else if (Array.isArray(value)) {
    displayValue = value.join(', ');
  } else if (typeof value === 'object' && value !== null) {
    displayValue = JSON.stringify(value);
  }

  return `<div class="claim-item">
    <span class="claim-key">${escapeHtml(key)}</span>
    <span class="claim-value">${escapeHtml(displayValue)}</span>
  </div>`;
}
