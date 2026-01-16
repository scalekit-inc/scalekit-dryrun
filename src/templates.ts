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
    :root {
      --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
      --color-bg: #fafafb;
      --color-surface: #f8f9fb;
      --color-surface-hover: #f1f3f6;
      --color-border: #e4e7ec;
      --color-border-subtle: #eceef2;
      --color-text: #1a1d24;
      --color-text-secondary: #5c6370;
      --color-text-tertiary: #8b919d;
      --color-primary: #667eea;
      --color-primary-dark: #5a6fd6;
      --color-success: #10b981;
      --color-success-dark: #059669;
      --focus-ring: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-primary);
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      background: var(--color-bg);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 600px;
      width: 100%;
      overflow: hidden;
      animation: containerIn 600ms var(--ease-out-expo) forwards;
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    @keyframes containerIn {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .header {
      background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%);
      padding: 32px;
      text-align: center;
      color: #fff;
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
      animation: iconPop 500ms var(--ease-out-expo) 200ms forwards;
      opacity: 0;
      transform: scale(0.5);
    }
    @keyframes iconPop {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .success-icon svg {
      width: 32px;
      height: 32px;
      stroke: #fff;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }
    .success-icon svg path {
      stroke-dasharray: 30;
      stroke-dashoffset: 30;
      animation: checkDraw 400ms var(--ease-out-quart) 400ms forwards;
    }
    @keyframes checkDraw {
      to {
        stroke-dashoffset: 0;
      }
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      line-height: 1.3;
      animation: fadeSlideUp 400ms var(--ease-out-quart) 300ms forwards;
      opacity: 0;
      transform: translateY(10px);
    }
    .header p {
      opacity: 0;
      font-size: 14px;
      line-height: 1.5;
      animation: fadeSlideUp 400ms var(--ease-out-quart) 400ms forwards;
      transform: translateY(10px);
    }
    @keyframes fadeSlideUp {
      to {
        opacity: 0.92;
        transform: translateY(0);
      }
    }
    .content {
      padding: 32px;
    }
    .user-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--color-surface);
      border-radius: 12px;
      margin-bottom: 24px;
      animation: cardIn 500ms var(--ease-out-expo) 450ms forwards;
      opacity: 0;
      transform: translateY(15px);
    }
    @keyframes cardIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 20px;
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
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .user-info p {
      color: var(--color-text-secondary);
      font-size: 14px;
      line-height: 1.4;
    }
    .claims-section {
      animation: sectionIn 500ms var(--ease-out-expo) 550ms forwards;
      opacity: 0;
      transform: translateY(15px);
    }
    @keyframes sectionIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .claims-section h3 {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 12px;
    }
    .claims-grid {
      display: grid;
      gap: 8px;
    }
    .claim-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px 16px;
      background: var(--color-surface);
      border-radius: 8px;
      font-size: 14px;
      transition: background-color 200ms var(--ease-out-quart), transform 200ms var(--ease-out-quart);
    }
    .claim-item:hover {
      background: var(--color-surface-hover);
      transform: translateX(4px);
    }
    .claim-key {
      color: var(--color-text-secondary);
      font-weight: 500;
      flex-shrink: 0;
    }
    .claim-value {
      color: var(--color-text);
      font-weight: 500;
      text-align: right;
      word-break: break-all;
      max-width: 60%;
      line-height: 1.4;
    }
    .raw-toggle {
      margin-top: 24px;
      text-align: center;
      animation: sectionIn 500ms var(--ease-out-expo) 650ms forwards;
      opacity: 0;
      transform: translateY(15px);
    }
    .raw-toggle button {
      font-family: inherit;
      background: transparent;
      border: 1px solid var(--color-border);
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-secondary);
      transition: background-color 200ms var(--ease-out-quart),
                  border-color 200ms var(--ease-out-quart),
                  transform 200ms var(--ease-out-quart);
      min-height: 44px;
    }
    .raw-toggle button:hover {
      background: var(--color-surface);
      border-color: var(--color-border-subtle);
      transform: translateY(-1px);
    }
    .raw-toggle button:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .raw-toggle button:active {
      transform: translateY(0);
    }
    .raw-json-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 350ms var(--ease-out-expo);
      margin-top: 16px;
    }
    .raw-json-wrapper.visible {
      grid-template-rows: 1fr;
    }
    .raw-json {
      overflow: hidden;
    }
    .raw-json-inner {
      padding: 16px;
      background: var(--color-text);
      border-radius: 8px;
      overflow-x: auto;
    }
    .raw-json pre {
      color: #e2e5eb;
      font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .footer {
      padding: 16px 32px;
      background: var(--color-surface);
      text-align: center;
      border-top: 1px solid var(--color-border-subtle);
      animation: footerIn 400ms var(--ease-out-quart) 700ms forwards;
      opacity: 0;
    }
    @keyframes footerIn {
      to {
        opacity: 1;
      }
    }
    .footer p {
      color: var(--color-text-tertiary);
      font-size: 13px;
      line-height: 1.5;
    }
    .footer a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 150ms var(--ease-out-quart);
    }
    .footer a:hover {
      color: var(--color-primary-dark);
    }
    .footer a:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
      border-radius: 2px;
    }
    @media (max-width: 480px) {
      body {
        padding: 16px;
      }
      .content {
        padding: 24px;
      }
      .user-card {
        padding: 12px;
      }
      .avatar {
        width: 48px;
        height: 48px;
        font-size: 18px;
      }
      .user-info h2 {
        font-size: 16px;
      }
      .claim-item {
        flex-direction: column;
        gap: 4px;
      }
      .claim-value {
        text-align: left;
        max-width: 100%;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .container, .success-icon, .header h1, .header p,
      .user-card, .claims-section, .raw-toggle, .footer {
        opacity: 1;
        transform: none;
      }
      .success-icon svg path {
        stroke-dashoffset: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon" role="img" aria-label="Success">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L19 7"/></svg>
      </div>
      <h1>Login Successful</h1>
      <p>Authentication completed via Scalekit</p>
    </div>
    <div class="content">
      <div class="user-card">
        <div class="avatar" role="img" aria-label="User avatar">
          ${claims.picture ? `<img src="${escapeHtml(claims.picture)}" alt="${escapeHtml(displayName)}'s avatar">` : initials}
        </div>
        <div class="user-info">
          <h2>${escapeHtml(displayName)}</h2>
          ${claims.email ? `<p>${escapeHtml(claims.email)}</p>` : ''}
        </div>
      </div>
      <section class="claims-section" aria-labelledby="claims-heading">
        <h3 id="claims-heading">ID Token Claims</h3>
        <div class="claims-grid" role="list">
          ${renderClaimsGrid(claims)}
        </div>
      </section>
      <div class="raw-toggle">
        <button type="button" onclick="toggleRaw()" id="toggleBtn" aria-expanded="false" aria-controls="rawJsonWrapper">View Raw Response</button>
      </div>
      <div class="raw-json-wrapper" id="rawJsonWrapper" aria-hidden="true">
        <div class="raw-json">
          <div class="raw-json-inner">
            <pre><code>${escapeHtml(JSON.stringify(rawTokens, null, 2))}</code></pre>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <p>Powered by <a href="https://scalekit.com" target="_blank" rel="noopener noreferrer">Scalekit</a></p>
    </footer>
  </div>
  <script>
    function toggleRaw() {
      const wrapper = document.getElementById('rawJsonWrapper');
      const btn = document.getElementById('toggleBtn');
      const isVisible = wrapper.classList.toggle('visible');
      btn.textContent = isVisible ? 'Hide Raw Response' : 'View Raw Response';
      btn.setAttribute('aria-expanded', isVisible);
      wrapper.setAttribute('aria-hidden', !isVisible);
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
    :root {
      --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
      --color-bg: #fafafb;
      --color-surface: #f8f9fb;
      --color-border-subtle: #eceef2;
      --color-text: #1a1d24;
      --color-text-tertiary: #8b919d;
      --color-primary: #667eea;
      --color-error: #ef4444;
      --color-error-dark: #dc2626;
      --color-error-bg: #fef2f2;
      --color-error-border: #fecaca;
      --color-error-text: #991b1b;
      --focus-ring: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-primary);
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      background: var(--color-bg);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 500px;
      width: 100%;
      overflow: hidden;
      animation: containerIn 600ms var(--ease-out-expo) forwards;
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    @keyframes containerIn {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .header {
      background: linear-gradient(135deg, var(--color-error) 0%, var(--color-error-dark) 100%);
      padding: 32px;
      text-align: center;
      color: #fff;
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
      animation: iconShake 500ms var(--ease-out-expo) 300ms forwards;
      opacity: 0;
    }
    @keyframes iconShake {
      0% { opacity: 0; transform: translateX(-8px); }
      20% { opacity: 1; transform: translateX(6px); }
      40% { transform: translateX(-4px); }
      60% { transform: translateX(2px); }
      80% { transform: translateX(-1px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    .error-icon svg {
      width: 28px;
      height: 28px;
      stroke: #fff;
      stroke-width: 3;
      stroke-linecap: round;
      fill: none;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      line-height: 1.3;
      animation: fadeIn 400ms var(--ease-out-quart) 400ms forwards;
      opacity: 0;
    }
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    .content {
      padding: 32px;
      text-align: center;
      animation: contentIn 500ms var(--ease-out-expo) 450ms forwards;
      opacity: 0;
      transform: translateY(15px);
    }
    @keyframes contentIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .error-message {
      font-size: 16px;
      color: var(--color-text);
      margin-bottom: 16px;
      line-height: 1.5;
    }
    .error-details {
      padding: 16px;
      background: var(--color-error-bg);
      border: 1px solid var(--color-error-border);
      border-radius: 8px;
      font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace;
      font-size: 12px;
      line-height: 1.6;
      color: var(--color-error-text);
      text-align: left;
      word-break: break-all;
      white-space: pre-wrap;
    }
    .retry-button {
      margin-top: 24px;
    }
    .retry-button a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%);
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      min-height: 44px;
      min-width: 120px;
      transition: transform 200ms var(--ease-out-quart), box-shadow 200ms var(--ease-out-quart);
    }
    .retry-button a:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    .retry-button a:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .retry-button a:active {
      transform: translateY(0);
    }
    .footer {
      padding: 16px 32px;
      background: var(--color-surface);
      text-align: center;
      border-top: 1px solid var(--color-border-subtle);
      animation: fadeIn 400ms var(--ease-out-quart) 600ms forwards;
      opacity: 0;
    }
    .footer p {
      color: var(--color-text-tertiary);
      font-size: 13px;
      line-height: 1.5;
    }
    @media (max-width: 480px) {
      body {
        padding: 16px;
      }
      .content {
        padding: 24px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .container, .error-icon, .header h1, .content, .footer {
        opacity: 1;
        transform: none;
      }
    }
  </style>
</head>
<body>
  <div class="container" role="alert">
    <div class="header">
      <div class="error-icon" role="img" aria-label="Error">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </div>
      <h1>Authentication Failed</h1>
    </div>
    <div class="content">
      <p class="error-message">${escapeHtml(error)}</p>
      ${details ? `<div class="error-details" role="region" aria-label="Error details"><code>${escapeHtml(details)}</code></div>` : ''}
      <div class="retry-button">
        <a href="/">Try Again</a>
      </div>
    </div>
    <footer class="footer">
      <p>Check your terminal for more details</p>
    </footer>
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
    :root {
      --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
      --color-bg: #fafafb;
      --color-surface: #f1f3f6;
      --color-text: #1a1d24;
      --color-text-secondary: #5c6370;
      --color-primary: #667eea;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      background: var(--color-bg);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 400px;
      width: 100%;
      padding: 48px 32px;
      text-align: center;
      animation: containerIn 500ms var(--ease-out-expo) forwards;
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    @keyframes containerIn {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .spinner-wrapper {
      width: 56px;
      height: 56px;
      margin: 0 auto 24px;
      position: relative;
      animation: spinnerIn 400ms var(--ease-out-expo) 200ms forwards;
      opacity: 0;
      transform: scale(0.8);
    }
    @keyframes spinnerIn {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .spinner {
      width: 100%;
      height: 100%;
      border: 3px solid var(--color-surface);
      border-radius: 50%;
      position: absolute;
    }
    .spinner-arc {
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 1s var(--ease-out-quart) infinite;
      position: absolute;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .spinner-dot {
      width: 8px;
      height: 8px;
      background: var(--color-primary);
      border-radius: 50%;
      position: absolute;
      top: -2px;
      left: 50%;
      margin-left: -4px;
      animation: spin 1s var(--ease-out-quart) infinite;
      transform-origin: 4px 30px;
    }
    h1 {
      font-size: 20px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 8px;
      line-height: 1.3;
      animation: textIn 400ms var(--ease-out-quart) 300ms forwards;
      opacity: 0;
      transform: translateY(10px);
    }
    @keyframes textIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    p {
      color: var(--color-text-secondary);
      font-size: 14px;
      line-height: 1.5;
      animation: textIn 400ms var(--ease-out-quart) 400ms forwards;
      opacity: 0;
      transform: translateY(10px);
    }
    .dots {
      display: inline-block;
    }
    .dots span {
      animation: dotPulse 1.4s infinite;
      opacity: 0;
    }
    .dots span:nth-child(2) { animation-delay: 0.2s; }
    .dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dotPulse {
      0%, 60%, 100% { opacity: 0; }
      30% { opacity: 1; }
    }
    @media (max-width: 480px) {
      body {
        padding: 16px;
      }
      .container {
        padding: 40px 24px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .container, .spinner-wrapper, h1, p {
        opacity: 1;
        transform: none;
      }
      .spinner-arc, .spinner-dot {
        animation: spin 2s linear infinite !important;
      }
      .dots span {
        opacity: 1;
      }
    }
  </style>
</head>
<body>
  <main class="container" role="status" aria-live="polite">
    <div class="spinner-wrapper" aria-hidden="true">
      <div class="spinner"></div>
      <div class="spinner-arc"></div>
      <div class="spinner-dot"></div>
    </div>
    <h1>Redirecting to Login<span class="dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></h1>
    <p>Please complete authentication in your browser</p>
  </main>
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

  return `<div class="claim-item" role="listitem">
    <span class="claim-key">${escapeHtml(key)}</span>
    <span class="claim-value">${escapeHtml(displayValue)}</span>
  </div>`;
}
