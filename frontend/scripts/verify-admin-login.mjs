// Verification tool: validates the admin login/session flow (BFF) end to
// end against the real environment, login via Cognito (SRP), checks that
// the httpOnly session cookie was created, that the post listing loads
// (proves the Lambda Authorizer accepts the session), and that logout
// actually invalidates the session. Not part of test:e2e (CI never runs
// this on its own, it needs real credentials); it is an on-demand tool:
// `node frontend/scripts/verify-admin-login.mjs`.
//
// Why this exists: the session BFF took several iterations to work
// correctly in production, each one only discoverable through repeated
// manual validation in the browser. This script lets the next change to
// that flow (Terraform or code) be verified in seconds, instead of a
// manual sequence of curl + CloudWatch + Playwright.
//
// Note: the session revocation check (step 7) tests on 2 fronts because of
// a known, not yet fixed CloudFront limitation, see
// memory/project_cloudfront_error_response_masks_api_403.md.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const ADMIN_URL = 'https://d11ubkpuy1di6r.cloudfront.net';
// Direct API Gateway domain, used only in the session revocation check
// (see comment on step 7). Known issue, see
// memory/project_cloudfront_error_response_masks_api_403.md: the admin
// distribution's custom_error_response (built for SPA routing) is
// distribution-wide, and masks any 403 coming from the API-Gateway-Admin
// origin with the SPA's index.html (200 OK), no real security impact (no
// data leaks), but the HTTP status becomes unreliable when measured
// through CloudFront. A proper fix (CloudFront Function) is deferred; this
// script tests the two angles that remain verifiable: no real data leaks
// via CloudFront, and the session truly dies on the server (checked
// directly against the API Gateway, with CloudFront out of the picture).
const API_GATEWAY_URL = 'https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1';

const creds = fs.readFileSync(path.join(REPO_ROOT, 'docs', 'creds.txt'), 'utf-8');
const USERNAME = creds.match(/user:\s*(\S+)/)?.[1];
const PASSWORD = creds.match(/password:\s*(\S+)/)?.[1];
if (!USERNAME || !PASSWORD) throw new Error('Não foi possível extrair credenciais de docs/creds.txt');

function assert(condition, message) {
  if (!condition) throw new Error(`FALHA: ${message}`);
  console.log(`OK: ${message}`);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // 1. No session: should redirect to /login
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    assert(page.url().endsWith('/login'), 'sem sessão prévia, a página raiz redireciona para /login');

    // The 401 from the initial checkSession() (no session yet) is expected;
    // only a 401 appearing after a successful login matters.
    consoleErrors.length = 0;

    // 2. Real login via Cognito (SRP, client-side): the SRP round-trip plus
    // exchanging the idToken for the BFF session takes a few real seconds,
    // it is not instant; wait for the actual navigation, not a fixed timeout.
    await page.getByRole('textbox', { name: /usuário|admin/i }).fill(USERNAME);
    await page.getByRole('textbox', { name: /senha|••/i }).fill(PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL((u) => !u.pathname.endsWith('/login'), { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    assert(!page.url().endsWith('/login'), 'após login, não fica preso em /login (sem loop de redirect)');

    // 3. httpOnly session cookie was created
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'admin_session');
    assert(!!sessionCookie, 'cookie admin_session foi criado');
    assert(sessionCookie?.httpOnly === true, 'cookie admin_session é httpOnly');
    assert(sessionCookie?.sameSite === 'Strict', 'cookie admin_session é SameSite=Strict');
    const sessionIdBeforeLogout = sessionCookie?.value;

    // 4. No recurring 401 (redirect loop): if the deployment trigger bug
    // ever came back, it would show up as a burst of 401 errors in the console.
    const unauthorizedErrors = consoleErrors.filter((e) => e.includes('401'));
    assert(unauthorizedErrors.length === 0, `zero erros 401 no console (achou ${unauthorizedErrors.length})`);

    // 5. Dashboard loaded real data (proves the Lambda Authorizer accepts the session)
    const postsHeading = page.getByRole('heading', { name: 'Posts' });
    await postsHeading.waitFor({ state: 'visible', timeout: 5000 });
    const bodyTextLoggedIn = await page.textContent('body');
    assert(/\d+ posts?/.test(bodyTextLoggedIn ?? ''), 'dashboard mostra contagem real de posts (não tela vazia/erro)');
    // Captures a "fingerprint" of real data (the "N posts ·" count) to
    // confirm afterward that it does NOT reappear post-logout: this is the
    // real security signal that stays verifiable despite the CloudFront
    // limitation (see step 7).
    const postsCountFingerprint = bodyTextLoggedIn.match(/\d+ posts? · \d+ publicados/)?.[0];
    assert(!!postsCountFingerprint, 'capturou a impressão digital de dado real (contagem de posts) pra checar depois');

    // 6. Logout actually invalidates the session (not just clears the client)
    await page.getByRole('button', { name: /sair/i }).click();
    await page.waitForURL((u) => u.pathname.endsWith('/login'), { timeout: 10000 });
    assert(page.url().endsWith('/login'), 'logout redireciona para /login');

    const cookiesAfterLogout = await context.cookies();
    const sessionCookieAfterLogout = cookiesAfterLogout.find((c) => c.name === 'admin_session');
    assert(!sessionCookieAfterLogout?.value, 'cookie admin_session foi limpo após logout');

    // 7. Reinforcement, in 2 parts (see API_GATEWAY_URL above for why):
    //
    // 7a. Directly against the API Gateway (no CloudFront in between): the
    // HTTP status is reliable here, so a real 401/403 is required, proving
    // the session died on the server (DynamoDB), not just that the browser
    // forgot the cookie.
    const postsResDirect = await fetch(`${API_GATEWAY_URL}/admin/posts`, {
      headers: { Cookie: `admin_session=${sessionIdBeforeLogout}` },
    });
    assert(
      [401, 403].includes(postsResDirect.status),
      `API Gateway direto, com o session_id anterior ao logout, responde ${postsResDirect.status} (sessão revogada no servidor)`,
    );

    // 7b. Via CloudFront (the real user path): the status can come back 200
    // (SPA custom_error_response masking the 403, see comment on
    // API_GATEWAY_URL), so what actually matters is checked instead: the
    // real data (post count) must NOT appear in the response body.
    const postsResCloudFront = await fetch(`${ADMIN_URL}/admin/posts`, {
      headers: { Cookie: `admin_session=${sessionIdBeforeLogout}` },
    });
    const bodyAfterLogout = await postsResCloudFront.text();
    assert(
      !bodyAfterLogout.includes(postsCountFingerprint),
      'via CloudFront, o corpo da resposta pós-logout não contém dado real de posts (nenhum vazamento, mesmo quando o status HTTP é mascarado)',
    );

    console.log('\n✅ Fluxo de login/sessão do admin validado ponta a ponta.');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
