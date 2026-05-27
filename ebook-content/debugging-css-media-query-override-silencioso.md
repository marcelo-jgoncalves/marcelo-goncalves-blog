# Caso de Estudo: O Override Silencioso — Quando Tokens CSS São Ignorados por Media Queries

> **Episódio real de debugging — Sessão 37 do Blog Marcelo Gonçalves**  
> **Data:** 2026-05-26  
> **Nível:** Intermediário / Avançado  
> **Tags:** CSS, Design Tokens, Media Queries, Playwright, Debugging, IA pair programming

---

## O Cenário

Estávamos trabalhando na unificação do sistema tipográfico do blog. O objetivo era simples: fazer o corpo do texto dos artigos (`post-content`) usar o mesmo tamanho de fonte do texto de introdução (`post-lead`), usando nosso sistema de tokens CSS.

O token em questão: `--text-xl`.

---

## O Problema

### Estado inicial

O texto de introdução (`.post-lead`) usava `1.375rem` — tamanho razoável mas sem aderência ao sistema de tokens.  
O corpo do post (`.post-content`) usava `var(--body-text-size)` — um token paralelo com valor `17px`.

Decidimos:
1. Consolidar ambos usando `var(--text-xl)`
2. Ajustar `--text-xl` de `1.5rem` para `1.25rem` para encontrar o ponto certo
3. Eliminar o sistema paralelo `--body-text-size/weight/spacing`

### O que fizemos (corretamente)

Atualizamos `globals.css`:
```css
/* ANTES */
--text-xl: 1.5rem;
--body-text-size: 17px;
--body-text-weight: 400;
--body-text-spacing: 0.02em;

/* DEPOIS */
--text-xl: 1.25rem;
/* tokens paralelos: removidos */
```

Atualizamos `post.css`:
```css
/* ANTES */
.post-content {
  font-size: var(--body-text-size);
  /* ... */
}

/* DEPOIS */
.post-content {
  font-size: var(--text-xl);
  /* ... */
}
```

### O que aconteceu

**Nada.** O texto continuava com 17px no browser.

---

## A Postura Inicial: Guessing Cego

Sem dados concretos, começamos a adivinhar:

**Hipótese 1 — Cache do browser**  
"Talvez seja cache do Turbopack ou do browser."  
→ Fizemos hard-refresh (`Ctrl+Shift+R`). Sem efeito.

**Hipótese 2 — Cache do Next.js**  
"Talvez o Turbopack não recompilou corretamente."  
→ Observamos os logs do servidor. Compilação confirmada. Sem efeito.

**Hipótese 3 — Token não aplicado**  
"Talvez `var(--text-xl)` não esteja chegando ao elemento."  
→ Ajustamos de `1.25rem` para `1.5rem` (original). Sem diferença visível.

**Resultado:** 3 hipóteses, 0 dados, 0 progresso. O texto teimava em aparecer com 17px.

---

## O Ponto de Virada: Protocolo de Investigação

Após as tentativas cegas falharem, Marcelo invocou a estratégia padrão de debugging com Playwright. A partir desse momento, a postura mudou radicalmente:

> **Parar de adivinhar. Observar a realidade. Formar hipótese baseada em dados.**

O princípio fundamental do nosso protocolo:

```
ANTES  → estado atual do código (o que dizemos que é)
↓
DIAGNÓSTICO → o que realmente está acontecendo no runtime
↓
HIPÓTESE → por que existe essa diferença
↓
MUDANÇA MÍNIMA → uma alteração, testável isoladamente
↓
DEPOIS → resultado observado
↓
APRENDIZADO → modelo mental atualizado
```

---

## Os Scripts de Diagnóstico

### Script 1: Localizar um Post Válido

Primeiro problema prático: precisávamos da URL de um post real para inspecionar. Não podíamos hardcodar `/post/slug-inventado` — o script falharia se o slug não existisse.

Criamos o arquivo `frontend/scripts/inspect-post-font.js`:

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navegando para a home para encontrar um post válido...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  
  // Encontrar links de posts reais
  const postLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/post/"]'));
    return links.slice(0, 3).map(a => a.href);
  });
  
  console.log('Posts encontrados:', postLinks);
  await browser.close();
})();
```

**Saída:**
```
Posts encontrados: [
  'http://localhost:3000/post/prompts-poderosos-para-ias-gpt-ou-gemini',
  'http://localhost:3000/post/ia-em-cada-etapa-da-arquitetura-100-serverless-na-aws',
  'http://localhost:3000/post/teste-teste'
]
```

### Script 2: Inspecionar Tamanho Real da Fonte

Com um slug válido em mãos, criamos `frontend/scripts/inspect-font-size.js`:

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Usar um slug que sabemos existir
  const url = 'http://localhost:3000/post/prompts-poderosos-para-ias-gpt-ou-gemini';
  console.log(`Navegando para: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // aguardar hidratação do React

  const result = await page.evaluate(() => {
    // Inspecionar o elemento post-content
    const postContent = document.querySelector('.post-content');
    const postLead = document.querySelector('.post-lead');
    
    const getStyles = (el, label) => {
      if (!el) return { label, error: 'element not found' };
      const computed = window.getComputedStyle(el);
      return {
        label,
        tagName: el.tagName,
        className: el.className.substring(0, 80),
        fontSize: computed.fontSize,          // VALOR REAL computado
        fontFamily: computed.fontFamily,
        lineHeight: computed.lineHeight,
        color: computed.color,
      };
    };

    return {
      postContent: getStyles(postContent, 'post-content'),
      postLead: getStyles(postLead, 'post-lead'),
      // Também verificar o token CSS atual
      cssToken: getComputedStyle(document.documentElement)
        .getPropertyValue('--text-xl').trim(),
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
```

**Execução:**
```bash
cd frontend
node scripts/inspect-font-size.js
```

**Saída obtida:**
```json
{
  "postContent": {
    "label": "post-content",
    "tagName": "DIV",
    "className": "post-content",
    "fontSize": "17px",
    "lineHeight": "27.2px",
    "color": "rgba(30, 55, 76, 0.8)"
  },
  "postLead": {
    "label": "post-lead",
    "tagName": "P",
    "className": "post-lead",
    "fontSize": "20px",
    "lineHeight": "28px"
  },
  "cssToken": "1.25rem"
}
```

### A Evidência Decisiva

Os dados revelaram algo crítico:

| Campo | Valor | Interpretação |
|-------|-------|---------------|
| `postContent.fontSize` | **`17px`** | O que o browser calcula |
| `postLead.fontSize` | **`20px`** | O que esperávamos para post-content |
| `cssToken` | **`1.25rem`** | O token está correto (1.25 × 16px = 20px) |

**O token `--text-xl` valia `1.25rem` = 20px. Mas o elemento exibia 17px.**

Isso só poderia significar uma coisa: **alguma regra CSS mais específica estava sobrescrevendo o token.**

---

## Investigação: Encontrando o Culpado

Com a hipótese clara ("há uma regra sobrescrevendo"), fomos direto ao arquivo `post.css` buscar por `17px` e por media queries no `.post-content`:

```bash
grep -n "17px\|post-content" frontend/app/post/[slug]/post.css
```

**Encontrado na linha 252:**

```css
@media (min-width: 768px) {
  .post-content {
    font-size: 17px;
  }
}
```

**Causa raiz identificada.**

---

## Análise do Root Cause

### Por que esse override existia?

Essa linha era um resquício do antigo sistema de tokens paralelo. Quando `--body-text-size: 17px` foi definido, alguém (ou uma IA, em alguma sessão anterior) aplicou o valor literal `17px` diretamente numa media query para garantir que o tamanho seria preservado em desktop — provavelmente como "segurança extra".

O problema: essa media query **sempre ganha** em viewports `>= 768px`, que é praticamente todo acesso desktop/tablet.

### Por que o token não funcionava?

A cascata CSS em viewports desktop ficava assim:

```
1. .post-content { font-size: var(--text-xl) }    → 20px   ← NOSSA REGRA
2. @media (min-width: 768px) {
     .post-content { font-size: 17px }            → 17px   ← SOBRESCREVE (aparece depois no arquivo)
   }
```

Em CSS, quando dois seletores têm a **mesma especificidade**, a **ordem no arquivo** decide. A media query vinha depois no arquivo, então ela sempre vencia.

### O que isso nos ensina sobre media queries

Media queries **não aumentam especificidade**. Elas apenas expandem ou restringem o escopo de aplicação. Uma regra dentro de `@media (min-width: 768px)` tem exatamente a mesma especificidade que a mesma regra fora da media query — e a que aparece por último no arquivo ganha.

```css
/* Especificidade idêntica: 0-1-0 */
.post-content { font-size: var(--text-xl); }   /* aparece primeiro — PERDE */

@media (min-width: 768px) {
  .post-content { font-size: 17px; }           /* aparece depois — GANHA */
}
```

---

## A Solução

Uma vez com o diagnóstico completo, a solução foi trivial: **remover o bloco de media query**.

```css
/* REMOVIDO de post.css */
@media (min-width: 768px) {
  .post-content {
    font-size: 17px;
  }
}
```

**Verificação com Playwright (mesmo script):**
```json
{
  "postContent": {
    "fontSize": "20px"   ← agora correto: 1.25rem × 16px = 20px
  }
}
```

✅ Um `grep` + `Remove-Item`-equivalente de CSS resolveu o que horas de guessing não conseguiram.

---

## Comparação de Abordagens

| Critério | Guessing Cego | Investigation Protocol |
|---|---|---|
| **Tempo para diagnóstico** | ∞ (nunca chegou) | ~8 minutos |
| **Número de tentativas** | 3+ sem efeito | 1 correta |
| **Confiança na solução** | Baixa (talvez funcione?) | Alta (entendo exatamente por quê) |
| **Dados usados** | Nenhum | `getComputedStyle`, grep no CSS |
| **Reproduzibilidade** | Não — foi "acidente" | Sim — protocolo documentado |
| **Risco de regressão** | Alto — mudança às cegas | Baixo — mudança cirúrgica |

---

## Lições Aprendidas

### 1. `getComputedStyle` é a verdade absoluta

O CSS que você **escreve** é o que você **quer**. O `getComputedStyle` é o que o browser **aplica**. Se há diferença entre os dois, o problema está na cascata — especificidade, order, herança, media query. O Playwright é perfeito para inspecionar isso de forma automatizada.

### 2. Media queries não têm alta especificidade — têm alta posição no arquivo

Um equívoco comum: "coloquei dentro de uma media query então deve ter prioridade". Não. Media queries são condições de aplicação, não amplificadores de especificidade. A ordem no arquivo ainda decide.

### 3. Tokens são inúteis se overrides literais os sobrescrevem

Usar `var(--text-xl)` é excelente para manutenibilidade. Mas se em algum lugar do codebase existe um valor literal `17px` que aparece depois na cascata, o token perde. **Sempre fazer grep do valor literal** ao debugar um token que não funciona.

```bash
# Ao debugar um token de font-size:
grep -rn "17px\|font-size" frontend/app/post/ --include="*.css"
```

### 4. O valor do token não é o valor computado

O debugging revelou que o token `--text-xl` tinha o valor correto (`1.25rem`) no root. O problema não era na definição do token — era no consumo. Inspecionar o token isoladamente (ex: `getComputedStyle(document.documentElement).getPropertyValue('--text-xl')`) é crucial para separar "token errado" de "token sobrescrito".

### 5. Sistemas paralelos de tokens são bombas-relógio

O sistema `--body-text-size/weight/spacing` foi criado em algum momento como conveniência. Com o tempo, o valor literal `17px` vazou para uma media query diretamente. Quando eliminamos o sistema paralelo, o override literal ficou para trás — e quebrou silenciosamente o novo sistema.

**Regra de ouro:** Ao eliminar um sistema de tokens, **grep todos os valores literais** que eles representavam e elimine-os também.

```bash
# Ao eliminar --body-text-size: 17px:
grep -rn "17px" frontend/ --include="*.css"
# → encontraria o culpado imediatamente
```

---

## Checklist Anti-Regressão

Para evitar que esse problema se repita:

```markdown
## Ao criar/modificar tokens CSS:

- [ ] Grep pelo valor literal do token antigo em todo o codebase
- [ ] Verificar se há media queries com o mesmo seletor + propriedade
- [ ] Confirmar com getComputedStyle (Playwright ou DevTools) que o valor real mudou

## Ao debugar um token que não funciona:

- [ ] Abrir DevTools → computar o valor real do elemento (não o token)
- [ ] Identificar qual regra CSS está ganhando na cascata (DevTools Styles panel)
- [ ] Verificar posição no arquivo (última regra vence quando especificidade é igual)
- [ ] Grep pelo valor literal no arquivo suspeito

## Antes de qualquer commit de CSS:

- [ ] Playwright inspect confirma o valor esperado em runtime
- [ ] grep pelo valor literal antigo não encontra nada inesperado
```

---

## Template: Script de Inspeção Playwright

Para reutilizar em futuros debuggings de CSS:

```javascript
// frontend/scripts/inspect-css-element.js
// Uso: node scripts/inspect-css-element.js <url> <selector>

const { chromium } = require('playwright');

const url = process.argv[2] || 'http://localhost:3000/';
const selector = process.argv[3] || 'body';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`🔍 Inspecionando "${selector}" em ${url}`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const result = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { error: `Element "${sel}" not found in DOM` };
    
    const computed = window.getComputedStyle(el);
    const root = window.getComputedStyle(document.documentElement);
    
    return {
      element: {
        tagName: el.tagName,
        className: el.className.substring(0, 100),
        outerHTML: el.outerHTML.substring(0, 200),
      },
      computedStyles: {
        fontSize: computed.fontSize,
        lineHeight: computed.lineHeight,
        fontFamily: computed.fontFamily,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        padding: computed.padding,
        margin: computed.margin,
      },
      cssTokens: {
        '--text-xs':    root.getPropertyValue('--text-xs').trim(),
        '--text-sm':    root.getPropertyValue('--text-sm').trim(),
        '--text-base':  root.getPropertyValue('--text-base').trim(),
        '--text-lg':    root.getPropertyValue('--text-lg').trim(),
        '--text-xl':    root.getPropertyValue('--text-xl').trim(),
        '--text-2xl':   root.getPropertyValue('--text-2xl').trim(),
        '--text-3xl':   root.getPropertyValue('--text-3xl').trim(),
      },
    };
  }, selector);

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
```

**Uso:**
```bash
# Inspecionar o corpo do post
node scripts/inspect-css-element.js \
  "http://localhost:3000/post/prompts-poderosos-para-ias-gpt-ou-gemini" \
  ".post-content"

# Inspecionar o lead
node scripts/inspect-css-element.js \
  "http://localhost:3000/post/prompts-poderosos-para-ias-gpt-ou-gemini" \
  ".post-lead"
```

---

## Conexão com Outros Princípios do Projeto

Este episódio se conecta diretamente com três princípios documentados no `memory/` do projeto:

**[Diagnose Before Acting](feedback_diagnose_before_acting.md)**  
> "Always analyze concrete data BEFORE any claim/action — never opine from impression."

Não foi seguido inicialmente (hipóteses de cache sem dados). Quando seguido, resolveu em minutos.

**[Incremental Investigation Protocol](feedback_incremental_investigation_protocol.md)**  
> "Work incrementally: BEFORE → hypothesis → MINIMUM change → TEST → AFTER → reflect → rebuild mental model."

O Playwright transformou um "não sei por que não funciona" em "sei exatamente qual linha é o culpado".

**[Guessing Pattern Destroyed Project](feedback_guessing_destroyed_project.md)**  
> "Pattern: guess → fails → guess → reset --hard → destroy commits."

Chegamos perigosamente perto disso — múltiplas tentativas de ajustar o token sem efeito. O protocolo interrompeu o ciclo.

---

## Conclusão

Este episódio demonstra um princípio importante: **muitos problemas de CSS que parecem ser de CSS são, na verdade, problemas de cascata e ordem**.

O token estava correto. A regra estava correta. O problema estava numa linha `17px` literal escondida dentro de uma media query, esquecida de uma sessão anterior. O Playwright expôs essa linha em 8 minutos. O guessing cego não teria chegado lá.

**O insight mais importante:**

> Quando `getComputedStyle` retorna um valor diferente do que você configurou, o problema **nunca** está no token. Está na cascata. E a cascata é investigável, previsível, determinística — desde que você use as ferramentas certas para enxergá-la.

---

*Documento gerado em 2026-05-26. Relacionado com: `.project-context.md` (Sessão 37), `docs/design-system/design-reference.md`, `memory/feedback_incremental_investigation_protocol.md`*
