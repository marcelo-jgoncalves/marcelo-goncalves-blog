// Ferramenta de automação: cria um post de teste completo via admin real (login Cognito + UI),
// publica, e valida o resultado no frontend público. Não faz parte do test:e2e (CI nunca executa
// isto sozinho) — é uma ferramenta on-demand: `node frontend/scripts/create-test-post.mjs`.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const ADMIN_URL = 'https://d11ubkpuy1di6r.cloudfront.net';
const PUBLIC_URL = 'https://dsns2wusdrj9z.cloudfront.net';
const TEST_IMAGE = path.join(REPO_ROOT, 'frontend', 'public', 'static', 'foto-perfil-oculos.png');
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || path.join(__dirname, '..', '..', '.test-post-screenshots');
const REPORT_PATH = path.join(SCREENSHOT_DIR, 'report.md');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const creds = fs.readFileSync(path.join(REPO_ROOT, 'contexto', 'creds.txt'), 'utf-8');
const USERNAME = creds.match(/user:\s*(\S+)/)?.[1];
const PASSWORD = creds.match(/password:\s*(\S+)/)?.[1];
if (!USERNAME || !PASSWORD) throw new Error('Não foi possível extrair credenciais de contexto/creds.txt');

const TITLE = '[TESTE] Como Reduzir Custos de Lambda em Produção: 7 Técnicas Práticas';

// Seletores únicos para contagem de nós de conteúdo — usados tanto no HTML recarregado
// do admin (via DOMParser) quanto no DOM renderizado da página pública (via querySelectorAll),
// para que as duas contagens sejam diretamente comparáveis.
const NODE_CHECKS = {
  negrito: 'strong',
  italico: 'em',
  listaNumerada: 'ol',
  link: '.content-link',
  divisorHorizontal: 'hr',
  tabela: 'table',
  youtube: '[data-youtube-video], iframe[src*="youtube"]',
  pullQuote: '.pull',
  blocoEncerramento: '.closing',
  calloutInfo: '.callout.info',
  calloutWarn: '.callout.warn',
  calloutError: '.callout.error',
  calloutOk: '.callout.ok',
  calloutTip: '.tip',
  codeBlock: 'pre',
};

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812 },
};
const findings = [];
const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
};
const finding = (msg) => {
  findings.push(msg);
  log(`ACHADO: ${msg}`);
};

let shotIdx = 0;
async function shot(page, name) {
  shotIdx += 1;
  const file = path.join(SCREENSHOT_DIR, `${String(shotIdx).padStart(2, '0')}-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

// Callout/pullQuote/table/closingFlourish são nodes "isolating" (Callout.ts,
// PullQuote.ts) — clicar dentro deles, mesmo perto da borda inferior, mantém a
// seleção PRESA lá dentro (confirmado ao vivo: todo o texto de negrito/lista/
// link acabou digitado dentro do 1º callout por causa disso). O jeito correto de
// escapar é o gap cursor do ProseMirror (Gapcursor vem no @tiptap/starter-kit):
// clicar dentro do último bloco e apertar ArrowDown move a seleção para depois
// dele quando é o último nó do documento — aí já dá pra digitar normalmente.
async function clickDocEnd(page) {
  const editor = page.locator('.tiptap-content .ProseMirror');
  const lastChild = editor.locator('> *').last();
  await lastChild.scrollIntoViewIfNeeded();
  // Callout tem título+ícone (contenteditable="false") no topo — clicar perto do
  // fundo do bloco tem mais chance de acertar texto editável (parágrafo/célula)
  // em qualquer um dos nodes isolating usados aqui.
  const box = await lastChild.boundingBox();
  if (box) {
    await page.mouse.click(box.x + 10, box.y + Math.max(box.height - 8, 5));
  } else {
    await lastChild.click();
  }
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
}

// Seleciona as últimas `len` posições de caractere digitadas (shift+seta-esquerda),
// usado para aplicar marks (bold/italic/link) num trecho específico via toolbar/atalho.
async function selectLastChars(page, len) {
  for (let i = 0; i < len; i++) await page.keyboard.press('Shift+ArrowLeft');
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.on('console', (msg) => {
    if (msg.type() === 'error') log(`[browser console error] ${msg.text()}`);
  });
  page.on('pageerror', (err) => log(`[browser pageerror] ${err.message}`));
  page.on('response', (res) => {
    if (res.status() >= 400) {
      finding(`Admin: requisição de rede falhou — ${res.status()} ${res.request().method()} ${res.url()}`);
    }
  });

  let slug = null;
  let adminNodeCounts = null;

  try {
    log('Navegando para tela de login do admin...');
    await page.goto(`${ADMIN_URL}/login`);
    await page.locator('input[type="text"]').fill(USERNAME);
    await page.locator('input[type="password"]').fill(PASSWORD);
    await shot(page, 'login-filled');
    await page.locator('button:has-text("Entrar")').click();

    await page.waitForSelector('h1:has-text("Posts")', { timeout: 20000 });
    log('Login OK — dashboard carregado.');
    await shot(page, 'dashboard');

    log('Abrindo novo post...');
    await page.locator('button:has-text("Novo post")').click();
    await page.waitForSelector('.ia-title');

    // Título é uma div contenteditable (EditorView.vue) — não um <input> —
    // desde o redesign full-bleed do editor (sessões 39-41). keyboard.type()
    // caractere-por-caractere embaralhou o texto de verdade num teste real
    // (acentos + delay entre teclas colidem com o timing do CDP em
    // contenteditable) — setar innerText de uma vez e disparar 'input' é
    // atômico e evita a corrida.
    await page.locator('.ia-title').click();
    await page.evaluate((text) => {
      const el = document.querySelector('.ia-title');
      el.innerText = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, TITLE);

    // Slug só é visível na gaveta de configurações (SettingsDrawer.vue) —
    // abre para ler o valor gerado.
    await page.locator('button[aria-label="Configurações do post"]').click();
    await page.waitForSelector('.ia-drawer');
    const slugInput = page.locator('.ia-slug-input');
    slug = await slugInput.inputValue();
    log(`Slug auto-gerado: "${slug}"`);
    if (!slug || !slug.startsWith('teste')) {
      finding(`Slug auto-gerado a partir do título "${TITLE}" não começa com "teste": "${slug}" — slugify() pode não remover colchetes/acentos como esperado.`);
    }
    await page.locator('button[aria-label="Fechar configurações"]').click();
    await page.waitForSelector('.ia-drawer', { state: 'detached' });

    // ---- Conteúdo via editor real (Tiptap), usando input rules estilo markdown ----
    const editor = page.locator('.tiptap-content .ProseMirror');
    await editor.click();

    await page.keyboard.type(
      'O custo de execução de funções Lambda em produção costuma ser invisível até a fatura mensal chegar. Neste artigo, reunimos sete técnicas práticas e testadas para reduzir esse custo sem sacrificar performance.',
      { delay: 4 }
    );
    await page.keyboard.press('Enter');

    await page.keyboard.type('## Por que o cold start ainda pesa no bolso', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type(
      'Cold starts não são só um problema de latência — cada milissegundo extra de inicialização é cobrado como tempo de execução. Em funções com Provisioned Concurrency desligado, esse custo se acumula rápido em ambientes de baixo tráfego.',
      { delay: 4 }
    );
    await page.keyboard.press('Enter');

    await page.keyboard.type('### As 7 técnicas', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('Antes de qualquer otimização de código, vale revisar a configuração de memória e timeout — é o ajuste de maior impacto por menor esforço.', { delay: 4 });
    await page.keyboard.press('Enter');

    await page.keyboard.type('- Ajustar memória alocada com base no profiling real (não no padrão de 128MB)', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('Reduzir o tamanho do pacote de deploy (tree-shaking, dependências de produção apenas)', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('Usar ARM/Graviton2 quando o runtime suportar', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter'); // sai da lista (liftEmptyBlock)

    await page.keyboard.type('> Medir antes de otimizar: CloudWatch Lambda Insights mostra exatamente onde o tempo (e o dinheiro) está sendo gasto.', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter'); // sai do blockquote

    await page.keyboard.type('```python', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('# Exemplo: leitura lazy de dependência pesada só quando necessário', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('def handler(event, context):', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('    import boto3  # import dentro do handler evita custo no cold start de invocações que não usam boto3', { delay: 4 });
    await page.keyboard.press('Control+Enter'); // exitCode

    await page.keyboard.type('Com essas mudanças aplicadas em conjunto, é comum observar reduções de 30-50% na fatura do Lambda sem qualquer perda perceptível de performance para o usuário final.', { delay: 4 });
    await page.keyboard.press('Enter');

    // ---- Imagem inline via upload real ----
    log('Inserindo imagem inline via upload real...');
    await page.locator('.tiptap-toolbar button[title="Inserir Imagem"]').click();
    await page.waitForSelector('.modal-overlay');
    await page.locator('.file-input-hidden').setInputFiles(TEST_IMAGE);
    const modalGone = await page.locator('.modal-overlay').waitFor({ state: 'detached', timeout: 20000 }).then(() => true).catch(() => false);
    if (!modalGone) {
      finding('Upload de imagem inline não fechou o modal em 20s — possível lentidão ou erro silencioso no upload.');
      await shot(page, 'inline-image-upload-stuck');
    } else {
      log('Imagem inline inserida.');
    }
    await page.keyboard.press('Enter');
    await page.keyboard.type('Conclusão: monitoramento de custo deveria ser parte do pipeline de CI/CD, não uma surpresa trimestral.', { delay: 4 });

    await shot(page, 'editor-content-filled');

    // ---- Callout (testa node customizado do Tiptap) — best-effort, não bloqueia o fluxo ----
    // Callout.ts (admin/src/components/Callout.ts) dá um tratamento especial ao tipo
    // "tip": wrapperClass = type==='tip' ? 'tip' : `callout ${type}` — só tip NÃO leva
    // o prefixo "callout" na classe (os outros 4 tipos levam). Confirmado rodando
    // contra o admin real: o node é inserido corretamente, só o seletor estava errado.
    const htmlBeforeCallout = await page.locator('.tiptap-content .ProseMirror').innerHTML();
    await page.locator('.tiptap-toolbar button[title="Callout: Dica de bastidor"]').click();
    const calloutAppeared = await page.locator('.ProseMirror .tip p').last()
      .click({ clickCount: 3, timeout: 8000 }).then(() => true).catch(() => false);
    if (!calloutAppeared) {
      const htmlAfterCallout = await page.locator('.tiptap-content .ProseMirror').innerHTML();
      finding('Inserção de Callout via toolbar não produziu um nó ".tip p" em 8s — possível falha silenciosa no addCallout/insertContent.');
      fs.writeFileSync(path.join(SCREENSHOT_DIR, 'callout-debug-before.html'), htmlBeforeCallout, 'utf-8');
      fs.writeFileSync(path.join(SCREENSHOT_DIR, 'callout-debug-after.html'), htmlAfterCallout, 'utf-8');
      if (!htmlAfterCallout.includes('Conclusão: monitoramento')) {
        finding('CRÍTICO: o parágrafo de conclusão digitado antes do clique no Callout desapareceu do documento após a tentativa — possível perda de conteúdo no editor.');
      }
    } else {
      await page.keyboard.type('Dica de bastidor: o AWS Cost Explorer com filtro por tag de função já é suficiente pra começar — não precisa de ferramenta paga no dia 1.', { delay: 4 });
    }

    // ---- Negrito / itálico via seleção + atalho de teclado ----
    log('Aplicando negrito e itálico...');
    await clickDocEnd(page);
    await page.keyboard.type('Vale reforçar: o ajuste de memória é ', { delay: 4 });
    const boldWord = 'sempre';
    await page.keyboard.type(boldWord, { delay: 4 });
    await selectLastChars(page, boldWord.length);
    await page.keyboard.press('Control+b');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type(' o primeiro passo, e o profiling deve ser feito de forma ', { delay: 4 });
    const italicWord = 'contínua';
    await page.keyboard.type(italicWord, { delay: 4 });
    await selectLastChars(page, italicWord.length);
    await page.keyboard.press('Control+i');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type(', não só na primeira configuração.', { delay: 4 });
    await page.keyboard.press('Enter');

    // ---- Lista numerada (input rule "1. ") ----
    log('Inserindo lista numerada...');
    await page.keyboard.type('Roteiro sugerido para aplicar as técnicas, em ordem:', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('1. Medir o consumo atual com CloudWatch Lambda Insights', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('Ajustar a memória alocada com base no profiling real', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.type('Validar o impacto comparando a fatura do mês seguinte', { delay: 4 });
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter'); // sai da lista

    // ---- Link via toolbar (window.prompt) ----
    log('Inserindo link via toolbar...');
    await page.keyboard.type('Para detalhes oficiais sobre limites, consulte a ', { delay: 4 });
    const linkText = 'documentação da AWS';
    await page.keyboard.type(linkText, { delay: 4 });
    await selectLastChars(page, linkText.length);
    page.once('dialog', (d) => d.accept('https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html'));
    await page.locator('.tiptap-toolbar button[title="Inserir Link"]').click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type('.', { delay: 4 });
    await page.keyboard.press('Enter');

    // ---- Divisor horizontal ----
    log('Inserindo divisor horizontal...');
    await page.locator('.tiptap-toolbar button[title="Divisor Horizontal"]').click();

    // ---- Callouts restantes (info, warn, error, ok) — "tip" já foi exercitado acima ----
    const remainingCallouts = [
      { type: 'info', title: 'Callout: Saiba mais', text: 'Saiba mais: a documentação da AWS detalha o cálculo exato de GB-segundo usado na cobrança.' },
      { type: 'warn', title: 'Callout: Atenção', text: 'Atenção: reduzir memória sem medir antes pode aumentar a duração da execução e anular a economia.' },
      { type: 'error', title: 'Callout: Evite', text: 'Evite: alocar memória de forma genérica para todas as funções, ignorando o perfil de cada uma.' },
      { type: 'ok', title: 'Callout: Boa prática', text: 'Boa prática: revisar a configuração de memória a cada novo release com mudança relevante de código.' },
    ];
    for (const c of remainingCallouts) {
      await clickDocEnd(page);
      await page.locator(`.tiptap-toolbar button[title="${c.title}"]`).click();
      const filled = await page.locator(`.ProseMirror .callout.${c.type} p`).last()
        .click({ clickCount: 3, timeout: 5000 }).then(() => true).catch(() => false);
      if (filled) {
        await page.keyboard.type(c.text, { delay: 4 });
      } else {
        finding(`Callout "${c.title}" não produziu um nó ".callout.${c.type} p" clicável em 5s.`);
      }
    }

    // ---- Citação em destaque (pull quote) ----
    log('Inserindo citação em destaque (pull quote)...');
    await clickDocEnd(page);
    await page.locator('.tiptap-toolbar button[title="Citação em destaque"]').click();
    const pullFilled = await page.locator('.ProseMirror .pull p').last()
      .click({ clickCount: 3, timeout: 5000 }).then(() => true).catch(() => false);
    if (pullFilled) {
      await page.keyboard.type('Otimizar Lambda não é sobre cortar custo a qualquer preço — é sobre pagar exatamente pelo que a função realmente precisa.', { delay: 4 });
      await page.locator('.tiptap-toolbar button[title="Editar atribuição da citação"]').click();
    } else {
      finding('Citação em destaque (pull quote) não produziu um nó ".pull p" clicável em 5s.');
    }

    // ---- Tabela ----
    log('Inserindo tabela...');
    await clickDocEnd(page);
    await page.locator('.tiptap-toolbar button[title="Inserir Tabela"]').click();
    const tableCells = page.locator('.tiptap-content .ProseMirror table th, .tiptap-content .ProseMirror table td');
    const tableHasCells = await tableCells.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (tableHasCells) {
      const tableValues = ['Técnica', 'Esforço', 'Impacto', 'Ajuste de memória', 'Baixo', 'Alto', 'ARM/Graviton2', 'Médio', 'Alto'];
      await tableCells.nth(0).click();
      for (let i = 0; i < tableValues.length; i++) {
        await page.keyboard.type(tableValues[i], { delay: 4 });
        if (i < tableValues.length - 1) await page.keyboard.press('Tab');
      }
    } else {
      finding('Inserção de Tabela via toolbar não produziu células visíveis em 5s.');
    }

    // ---- Vídeo do YouTube ----
    log('Inserindo vídeo do YouTube...');
    await clickDocEnd(page);
    page.once('dialog', (d) => d.accept('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));
    await page.locator('.tiptap-toolbar button[title="Inserir Vídeo do YouTube"]').click();
    const youtubeInserted = await page.locator('.tiptap-content .ProseMirror [data-youtube-video]').last()
      .waitFor({ state: 'attached', timeout: 8000 }).then(() => true).catch(() => false);
    if (!youtubeInserted) {
      finding('Inserção de vídeo do YouTube via toolbar não produziu um nó "[data-youtube-video]" em 8s.');
    }

    // ---- Bloco de encerramento (closing flourish) ----
    log('Inserindo bloco de encerramento...');
    await clickDocEnd(page);
    await page.locator('.tiptap-toolbar button[title="Bloco de encerramento"]').click();
    const closingInserted = await page.locator('.tiptap-content .ProseMirror .closing').last()
      .waitFor({ state: 'attached', timeout: 5000 }).then(() => true).catch(() => false);
    if (!closingInserted) {
      finding('Inserção de bloco de encerramento via toolbar não produziu um nó ".closing" em 5s.');
    }

    await shot(page, 'editor-content-full-coverage');

    // ---- Imagem de destaque via upload real ----
    // Botão de capa vive na folha do editor (fora da gaveta), não num "panel"
    // — post novo sempre começa sem capa, então é ".ia-add-cover".
    log('Inserindo imagem de destaque via upload real...');
    await page.locator('.ia-add-cover').click();
    await page.waitForSelector('.modal-overlay');
    await page.locator('.file-input-hidden').setInputFiles(TEST_IMAGE);
    await page.locator('.modal-overlay').waitFor({ state: 'detached', timeout: 20000 }).catch(() =>
      finding('Upload de imagem de destaque não fechou o modal em 20s.')
    );

    // ---- Campos restantes do formulário — todos na gaveta de configurações ----
    await page.locator('button[aria-label="Configurações do post"]').click();
    await page.waitForSelector('.ia-drawer');

    await page.locator('.ia-rail-card:has-text("URL") textarea').fill(
      'Sete técnicas práticas, testadas em produção, para reduzir o custo de execução de funções Lambda sem sacrificar performance.'
    );

    const metaTitulo = page.locator('.ia-rail-card:has-text("SEO") input[type="text"]');
    await metaTitulo.fill('Reduzir Custos de Lambda em Produção: 7 Técnicas | Marcelo Gonçalves');
    const metaDesc = page.locator('.ia-rail-card:has-text("SEO") textarea');
    await metaDesc.fill('Guia prático com 7 técnicas testadas para reduzir o custo de execução de funções AWS Lambda em produção sem perder performance.');

    // Categoria — tenta achar "DevOps", senão mantém o default carregado da API
    const categoriaSelect = page.locator('.ia-rail-card:has-text("Categoria") select').first();
    const categoriaOptions = await categoriaSelect.locator('option').allTextContents();
    const devopsOption = categoriaOptions.find((t) => /devops/i.test(t));
    if (devopsOption) {
      await categoriaSelect.selectOption({ label: devopsOption });
      log(`Categoria selecionada: ${devopsOption}`);
    } else {
      log(`Categoria "DevOps" não encontrada nas opções (${categoriaOptions.join(', ')}); mantendo default.`);
    }

    const altTextInput = page.locator('.ia-rail-card:has-text("Imagem de destaque") input[type="text"]');
    await altTextInput.fill('Painel de monitoramento de custos AWS Lambda com gráfico de execução por função');

    await page.locator('button[aria-label="Fechar configurações"]').click();
    await page.waitForSelector('.ia-drawer', { state: 'detached' });
    await shot(page, 'form-filled-complete');

    // ---- Salvar como Rascunho primeiro (fluxo real de criação) ----
    // Post novo: save() faz create() + router.replace (mesma view, sem navegar
    // para o dashboard) — diferente do fluxo antigo, que navegava de volta.
    log('Salvando como Rascunho...');
    await page.locator('.ia-btn-save').click();
    const toastOk = await page.waitForSelector('.ia-toast--success', { timeout: 15000 }).then(() => true).catch(() => false);
    if (!toastOk) {
      finding('Toast de sucesso não apareceu após salvar — possível erro silencioso ou lentidão na API.');
      await shot(page, 'save-no-toast');
    }
    await page.waitForURL(`${ADMIN_URL}/post/${slug}`, { timeout: 15000 });
    log('Post salvo como Rascunho.');
    await shot(page, 'after-draft-save');

    // ---- Recarregar via navegação real (exercita o round-trip com o servidor) ----
    log(`Recarregando /post/${slug} a partir do servidor...`);
    await page.goto(`${ADMIN_URL}/post/${slug}`);
    await page.waitForFunction(() => {
      const el = document.querySelector('.ia-title');
      return el && el.textContent && el.textContent.length > 0;
    });
    // Título (form state) e conteúdo (Tiptap, inicializado separadamente a partir
    // do mesmo onMounted) não populam no mesmo tick — ler o HTML cedo demais já
    // pegou o vídeo do YouTube ausente numa rodada real, mesmo ele tendo sido
    // salvo corretamente (confirmado pela validação da página pública, que não
    // acusou o mesmo problema). Espera por um marcador presente e pesado (tabela)
    // antes de considerar o conteúdo estável pra ler.
    await page.waitForFunction(() => {
      const el = document.querySelector('.tiptap-content .ProseMirror');
      return el && el.innerHTML.includes('<table');
    }, { timeout: 10000 }).catch(() => {});
    const reloadedTitle = await page.locator('.ia-title').textContent();
    if (reloadedTitle !== TITLE) {
      finding(`Título recarregado ("${reloadedTitle}") difere do salvo ("${TITLE}") — possível problema de round-trip.`);
    }
    const reloadedHtml = await page.locator('.tiptap-content .ProseMirror').innerHTML();
    if (!reloadedHtml.includes('callout') || !reloadedHtml.includes('<pre')) {
      finding('Conteúdo recarregado do servidor não contém callout e/ou bloco de código esperados — possível perda de sanitização.');
    }
    if (!reloadedHtml.includes('<img')) {
      finding('Imagem inline não está presente no HTML recarregado do servidor — pode não ter sido persistida.');
    }
    const expectedNodes = [
      ['<strong', 'negrito'],
      ['<em', 'itálico'],
      ['<ol', 'lista numerada'],
      ['content-link', 'link'],
      ['<hr', 'divisor horizontal'],
      ['<table', 'tabela'],
      ['data-youtube-video', 'vídeo do YouTube'],
      ['pull', 'citação em destaque (pull quote)'],
      ['closing', 'bloco de encerramento'],
    ];
    for (const [needle, label] of expectedNodes) {
      if (!reloadedHtml.includes(needle)) {
        finding(`Conteúdo recarregado do servidor não contém ${label} ("${needle}") — possível perda de sanitização ou falha na inserção.`);
      }
    }
    for (const type of ['info', 'warn', 'error', 'ok']) {
      if (!reloadedHtml.includes(`callout ${type}`)) {
        finding(`Callout do tipo "${type}" (class="callout ${type}") não encontrado no HTML recarregado do servidor.`);
      }
    }

    // Contagem de nós via DOMParser sobre o HTML recarregado do servidor — baseline
    // para comparar com o que a página pública efetivamente renderiza (ver validateRendered).
    // page.evaluate(fn, arg) só aceita 1 argumento — passar (selectors, html) como
    // 2 args posicionais nunca funcionou ("Too many arguments"), nunca tinha
    // rodado de verdade pra pegar isso antes. Empacota num objeto só.
    adminNodeCounts = await page.evaluate(({ selectors, html }) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const out = {};
      for (const [label, selector] of Object.entries(selectors)) {
        out[label] = doc.querySelectorAll(selector).length;
      }
      return out;
    }, { selectors: NODE_CHECKS, html: reloadedHtml });

    await shot(page, 'before-publish');

    // publish() (usePostForm.ts) já força form.status='Publicado' antes de
    // salvar (a menos que seja 'Programado') — não precisa abrir a gaveta e
    // clicar no radio manualmente, o botão "Publicar" sozinho já faz isso.
    log('Publicando...');
    await page.locator('.ia-btn-publish').click();
    await page.waitForSelector('.ia-toast--success', { timeout: 15000 }).catch(() =>
      finding('Toast de sucesso não apareceu após publicar.')
    );
    await page.waitForURL(`${ADMIN_URL}/`, { timeout: 15000 });
    log('Post publicado.');
    await shot(page, 'dashboard-after-publish');

    // Confere status na listagem — DashboardView.vue usa divs (.ia-row), não <table>/<tr>.
    const statusBadge = page.locator(`.ia-row:has(a[href="/post/${slug}"]) .ia-status-pill`);
    const badgeText = await statusBadge.textContent().catch(() => null);
    if (badgeText?.trim() !== 'Publicado') {
      finding(`Badge de status na listagem mostra "${badgeText}" em vez de "Publicado" — pode ser cache de UI desatualizado.`);
    }
  } catch (err) {
    log(`ERRO FATAL: ${err.message}`);
    await shot(page, 'fatal-error').catch(() => {});
    findings.push(`ERRO FATAL durante automação: ${err.message}`);
  } finally {
    await browser.close();
  }

  return { slug, adminNodeCounts };
}

// Valida pelo HTTP bruto o que é barato e não depende de renderização: status,
// cache headers e presença de um trecho. Erros aqui ocorrem antes de qualquer CSS/JS rodar.
async function validateHttp(slug) {
  const postUrl = `${PUBLIC_URL}/post/${slug}`;
  log(`Validando HTTP ${postUrl} ...`);
  const res = await fetch(postUrl);
  log(`Status: ${res.status} | Cache-Control: ${res.headers.get('cache-control')} | X-Cache: ${res.headers.get('x-cache')}`);
  if (res.status !== 200) {
    finding(`GET ${postUrl} retornou ${res.status} em vez de 200.`);
  }

  const artigosRes = await fetch(`${PUBLIC_URL}/artigos`);
  const artigosHtml = await artigosRes.text();
  if (!artigosHtml.includes(`/post/${slug}`)) {
    finding(`Post não aparece em /artigos (página 1) — pode ser questão de ordenação/paginação, não necessariamente bug.`);
  } else {
    log('Post encontrado em /artigos (página 1).');
  }
}

// Valida o DOM renderizado de verdade (pós-CSS/JS) no browser, no mesmo padrão de
// frontend/scripts/inspect-card-spacing.js: getBoundingClientRect()/getComputedStyle()
// em vez de string-match no HTML bruto. Pega uma classe de bug que o fetch() não pega —
// nó presente na marcação mas invisível, vazio, ou com imagem que não decodificou.
async function validateRendered(slug, viewportLabel, viewport, adminNodeCounts) {
  const postUrl = `${PUBLIC_URL}/post/${slug}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  page.on('pageerror', (err) => finding(`[${viewportLabel}] Erro JS no client da página pública: ${err.message}`));
  page.on('response', (res) => {
    if (res.status() >= 400) {
      finding(`[${viewportLabel}] Requisição de rede falhou — ${res.status()} ${res.request().method()} ${res.url()}`);
    }
  });

  try {
    log(`[${viewportLabel}] Abrindo ${postUrl} (${viewport.width}x${viewport.height}) para validação renderizada...`);
    const res = await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
    if (!res || res.status() !== 200) {
      finding(`[${viewportLabel}] page.goto(${postUrl}) retornou status ${res?.status()}.`);
    }
    await shot(page, `public-post-rendered-${viewportLabel}`);

    const result = await page.evaluate((nodeChecks) => {
      const visible = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden';
      };
      const nonEmptyText = (el) => !!el && el.textContent.trim().length > 0;

      const out = {};

      out.title = (() => {
        const el = document.querySelector('h1');
        return { found: !!el, visible: visible(el), text: el?.textContent?.trim() || null };
      })();

      out.coverImage = (() => {
        // postCoverFrame é CSS Module (post.module.css) — a classe real é hasheada;
        // [data-audit] é o hook estável mantido de propósito para casos assim.
        const img = document.querySelector('[data-audit="post-cover-frame"] img');
        if (!img) return { found: false };
        return {
          found: true,
          visible: visible(img),
          naturalWidth: img.naturalWidth,
          complete: img.complete,
          currentSrc: img.currentSrc || img.src,
        };
      })();

      out.jsonLd = (() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        const parsed = scripts.map((s) => {
          try {
            return JSON.parse(s.textContent);
          } catch {
            return { __parseError: true, raw: s.textContent.slice(0, 80) };
          }
        });
        return {
          count: parsed.length,
          types: parsed.map((p) => p['@type'] || p.__parseError),
        };
      })();

      const content = document.querySelector('.post-content');
      out.contentFound = !!content;

      out.nodes = {};
      for (const [label, selector] of Object.entries(nodeChecks)) {
        const els = Array.from((content || document).querySelectorAll(selector));
        out.nodes[label] = {
          count: els.length,
          visible: els.some(visible),
          hasText: els.some(nonEmptyText),
        };
      }

      out.toc = (() => {
        const items = document.querySelectorAll('.post-toc-item');
        return { count: items.length, visible: items.length > 0 && visible(items[0]) };
      })();

      return out;
    }, NODE_CHECKS);

    if (!result.title.found || !result.title.visible) {
      finding('H1 do post não encontrado ou invisível no DOM renderizado.');
    } else if (!result.title.text.includes(TITLE.replace('[TESTE] ', ''))) {
      finding(`H1 renderizado ("${result.title.text}") não bate com o título esperado.`);
    }

    if (!result.coverImage.found) {
      finding('Imagem de destaque ([data-audit="post-cover-frame"] img) não encontrada no DOM.');
    } else if (!result.coverImage.complete || result.coverImage.naturalWidth === 0) {
      finding(`Imagem de destaque não decodificou (naturalWidth=${result.coverImage.naturalWidth}, complete=${result.coverImage.complete}) — src: ${result.coverImage.currentSrc}`);
    }

    if (!result.jsonLd.types.includes('BlogPosting')) {
      finding(`JSON-LD "BlogPosting" ausente ou malformado. Tipos encontrados: ${JSON.stringify(result.jsonLd.types)}`);
    }
    if (!result.jsonLd.types.includes('BreadcrumbList')) {
      finding(`JSON-LD "BreadcrumbList" ausente ou malformado. Tipos encontrados: ${JSON.stringify(result.jsonLd.types)}`);
    }

    if (!result.contentFound) {
      finding('Container ".post-content" não encontrado — página pode ter falhado em renderizar o corpo do artigo.');
    }

    for (const [label, data] of Object.entries(result.nodes)) {
      if (data.count === 0) {
        finding(`[${viewportLabel}] Renderização pública: nenhum nó "${label}" encontrado no DOM (esperado pelo conteúdo de teste inserido).`);
      } else if (!data.visible) {
        finding(`[${viewportLabel}] Renderização pública: "${label}" existe no DOM (${data.count}x) mas nenhuma instância está visível (display/visibility/size zero) — possível CSS quebrado.`);
      } else if (!data.hasText && !['divisorHorizontal', 'tabela', 'youtube'].includes(label)) {
        finding(`[${viewportLabel}] Renderização pública: "${label}" está visível mas sem texto — possível nó vazio.`);
      }

      // Compara com a contagem extraída do HTML recarregado no admin (mesma fonte de
      // verdade, antes do CloudFront/SSR) — isola se a perda aconteceu na transição
      // admin → público (cache, sanitização, hidratação) em vez de na inserção do editor.
      const adminCount = adminNodeCounts?.[label];
      if (adminCount != null && data.count < adminCount) {
        finding(`[${viewportLabel}] "${label}": admin tinha ${adminCount} nó(s) pós-save, público renderizou só ${data.count} — perda entre admin e renderização pública.`);
      }
    }

    if (result.toc.count === 0) {
      finding(`[${viewportLabel}] Tabela de conteúdo (TOC) não encontrada no DOM — verificar se headings geraram entradas.`);
    }
  } catch (err) {
    finding(`[${viewportLabel}] ERRO durante validação renderizada: ${err.message}`);
  } finally {
    await browser.close();
  }
}

async function validateFrontend(slug, adminNodeCounts) {
  if (!slug) {
    log('Sem slug — pulando validação de frontend.');
    return;
  }
  log('Aguardando propagação (invalidação de cache CloudFront + variantes de imagem)...');
  await new Promise((r) => setTimeout(r, 5000));

  await validateHttp(slug);
  for (const [label, viewport] of Object.entries(VIEWPORTS)) {
    await validateRendered(slug, label, viewport, adminNodeCounts);
  }
}

const { slug, adminNodeCounts } = await run();
await validateFrontend(slug, adminNodeCounts);

const report = [
  `# Relatório de criação de post de teste — ${new Date().toISOString()}`,
  '',
  `Slug: \`${slug}\``,
  `Admin (edição): ${ADMIN_URL}/post/${slug}`,
  `Público: ${PUBLIC_URL}/post/${slug}`,
  '',
  '## Achados',
  findings.length ? findings.map((f) => `- ${f}`).join('\n') : '- Nenhum achado — fluxo completo sem fricção detectada.',
  '',
  `Screenshots em: ${SCREENSHOT_DIR}`,
].join('\n');
fs.writeFileSync(REPORT_PATH, report, 'utf-8');
console.log('\n' + report);
console.log(`\nSLUG_RESULT=${slug}`);
