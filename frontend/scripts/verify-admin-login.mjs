// Ferramenta de verificação: valida o fluxo de login/sessão do admin (BFF)
// ponta a ponta contra o ambiente real — login via Cognito (SRP), confere
// que o cookie de sessão httpOnly foi criado, que a listagem de posts
// carrega (prova que o Lambda Authorizer aceita a sessão), e que logout
// realmente invalida a sessão. Não faz parte do test:e2e (CI nunca executa
// isto sozinho, exige credenciais reais) — é uma ferramenta on-demand:
// `node frontend/scripts/verify-admin-login.mjs`.
//
// Motivação: a implementação do BFF de sessão (2026-07-24) levou 4
// iterações pra funcionar em produção, cada uma só descoberta por
// validação manual repetida no browser. Este script existe pra próxima
// mudança nesse fluxo (Terraform ou código) ser verificada em segundos,
// não em uma sequência de curl + CloudWatch + Playwright manual.
//
// Nota (2026-07-24): a checagem de revogação de sessão (passo 7) testa em
// 2 frentes por causa de uma limitação conhecida e ainda não corrigida do
// CloudFront — ver memory/project_cloudfront_error_response_masks_api_403.md.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const ADMIN_URL = 'https://d11ubkpuy1di6r.cloudfront.net';
// Domínio direto do API Gateway — usado só na checagem de revogação de
// sessão (ver comentário no passo 7). Achado real (2026-07-24, ver
// memory/project_cloudfront_error_response_masks_api_403.md): o
// custom_error_response da distribution do admin (feito pra SPA routing)
// é distribution-wide, e mascara qualquer 403 vindo do origin
// API-Gateway-Admin com o index.html do SPA (200 OK) — sem impacto de
// segurança real (nenhum dado vaza), mas o status HTTP fica não-confiável
// quando medido através do CloudFront. Correção de fundo (CloudFront
// Function) deferida; este script testa os dois ângulos que continuam
// verificáveis: nenhum dado real vaza via CloudFront, e a sessão morre
// de verdade no servidor (checado direto na API Gateway, sem o CloudFront
// no meio).
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
    // 1. Sem sessão: deve ir para /login
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    assert(page.url().endsWith('/login'), 'sem sessão prévia, a página raiz redireciona para /login');

    // O 401 do checkSession() inicial (sem sessão ainda) é esperado — só nos
    // importa que NENHUM 401 apareça depois do login bem-sucedido.
    consoleErrors.length = 0;

    // 2. Login real via Cognito (SRP, client-side) — o round-trip SRP +
    // troca do idToken pela sessão do BFF leva alguns segundos reais, não
    // é instantâneo; esperar a navegação de fato, não um timeout fixo.
    await page.getByRole('textbox', { name: /usuário|admin/i }).fill(USERNAME);
    await page.getByRole('textbox', { name: /senha|••/i }).fill(PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL((u) => !u.pathname.endsWith('/login'), { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    assert(!page.url().endsWith('/login'), 'após login, não fica preso em /login (sem loop de redirect)');

    // 3. Cookie de sessão httpOnly foi criado
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'admin_session');
    assert(!!sessionCookie, 'cookie admin_session foi criado');
    assert(sessionCookie?.httpOnly === true, 'cookie admin_session é httpOnly');
    assert(sessionCookie?.sameSite === 'Strict', 'cookie admin_session é SameSite=Strict');
    const sessionIdBeforeLogout = sessionCookie?.value;

    // 4. Nenhum 401 recorrente (loop de redirect) — se o bug do trigger de
    // deployment (sessão 2026-07-24) voltasse, isso apareceria como uma
    // rajada de erros 401 no console.
    const unauthorizedErrors = consoleErrors.filter((e) => e.includes('401'));
    assert(unauthorizedErrors.length === 0, `zero erros 401 no console (achou ${unauthorizedErrors.length})`);

    // 5. Dashboard carregou dados reais (prova que o Lambda Authorizer aceita a sessão)
    const postsHeading = page.getByRole('heading', { name: 'Posts' });
    await postsHeading.waitFor({ state: 'visible', timeout: 5000 });
    const bodyTextLoggedIn = await page.textContent('body');
    assert(/\d+ posts?/.test(bodyTextLoggedIn ?? ''), 'dashboard mostra contagem real de posts (não tela vazia/erro)');
    // Captura uma "impressão digital" de dado real (a contagem "N posts ·")
    // pra confirmar depois que ela NÃO reaparece pós-logout — é o sinal
    // real de segurança que continua verificável apesar da limitação do
    // CloudFront (ver passo 7).
    const postsCountFingerprint = bodyTextLoggedIn.match(/\d+ posts? · \d+ publicados/)?.[0];
    assert(!!postsCountFingerprint, 'capturou a impressão digital de dado real (contagem de posts) pra checar depois');

    // 6. Logout invalida a sessão de verdade (não só limpa o client)
    await page.getByRole('button', { name: /sair/i }).click();
    await page.waitForURL((u) => u.pathname.endsWith('/login'), { timeout: 10000 });
    assert(page.url().endsWith('/login'), 'logout redireciona para /login');

    const cookiesAfterLogout = await context.cookies();
    const sessionCookieAfterLogout = cookiesAfterLogout.find((c) => c.name === 'admin_session');
    assert(!sessionCookieAfterLogout?.value, 'cookie admin_session foi limpo após logout');

    // 7. Reforço, em 2 partes (ver API_GATEWAY_URL acima pro porquê):
    //
    // 7a. Direto na API Gateway (sem CloudFront no meio): o status HTTP é
    // confiável aqui, então exigimos 401/403 de verdade — prova que a
    // sessão morreu no servidor (DynamoDB), não só que o browser esqueceu
    // o cookie.
    const postsResDirect = await fetch(`${API_GATEWAY_URL}/admin/posts`, {
      headers: { Cookie: `admin_session=${sessionIdBeforeLogout}` },
    });
    assert(
      [401, 403].includes(postsResDirect.status),
      `API Gateway direto, com o session_id anterior ao logout, responde ${postsResDirect.status} (sessão revogada no servidor)`,
    );

    // 7b. Via CloudFront (o caminho real do usuário): o status pode vir 200
    // (custom_error_response do SPA mascarando o 403 — achado conhecido,
    // ver comentário de API_GATEWAY_URL), então checamos o que realmente
    // importa: o dado real (contagem de posts) NÃO pode aparecer no corpo
    // da resposta.
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
