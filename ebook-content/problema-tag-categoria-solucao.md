# Caso de Estudo: Quando CSS Não Funciona, O Problema Pode Não Ser CSS

## Introdução

Este documento descreve um episódio real de debugging em um projeto Next.js/React onde uma mudança de CSS simples causou frustração por não funcionar. A história ilustra a importância de **diagnosticar antes de agir** — um dos princípios mais críticos ao trabalhar com IA como pair programmer.

---

## O Problema Inicial

### Contexto
Estávamos estilizando a página de um post de blog. Especificamente, queríamos atualizar a formatação da **tag de categoria** que aparece na seção hero do post.

**Requisito:** A tag de categoria deveria ter o mesmo estilo das tags que aparecem no widget de "Mais Lidos" da sidebar (pills com fundo branco, borda semi-transparente, glassmorphism).

### Tentativa Inicial
Identifiquei o seletor CSS `.post-tag-header` no código e comecei a aplicar estilos:

```css
.post-tag-header {
  background: #f6f8fc;
  border: 1px solid rgba(255,255,255,.52);
  border-radius: 999px;
  padding: 8px 14px;
  /* ... mais estilos */
}
```

**Resultado:** Nada. O elemento não recebia os estilos.

---

## O Padrão Destrutivo: Guessing Cego

Aqui é onde começa o problema. Sem diagnosticar a raiz, comecei a:

1. **Primeira tentativa:** Adicionar `!important` a cada propriedade
2. **Segunda tentativa:** Tentar seletores mais específicos (`.post-tag-header.active`, `.article-header .post-tag-header`)
3. **Terceira tentativa:** Mudar as cores (azul, verde, cinza)
4. **Quarta tentativa:** Adicionar sombras, gradientes, diferentes border-radius

**Tempo gasto:** ~15 minutos de mudanças cegas.

**Resultado:** Nada funcionava.

### Por Que o Guessing Falha

O padrão é:
```
Mudança 1 (não funciona) → Mudança 2 (não funciona) → Mudança 3 → ... → Mudança N
```

Cada mudança é feita sem entender **por quê** a anterior falhou. É como tentar abrir uma porta travada tentando chaves aleatórias — eventualmente pode funcionar, mas é ineficiente e frustrante.

---

## O Ponto de Virada: Diagnóstico Forçado

Após a enésima tentativa falhada, recebi um feedback crucial do usuário (Marcelo):

> "lembre-se das instruções de como agir nesse tipo de situação"

Isso me forçou a **parar de adivinhar** e implementar o **Incremental Investigation Protocol**.

### O Protocolo
```
ANTES: [estado atual do código]
↓
DIAGNÓSTICO: [qual é o problema real?]
↓
MUDANÇA MÍNIMA: [uma propriedade/elemento por vez]
↓
TESTE: [observar o resultado no browser]
↓
APRENDIZADO: [atualizar modelo mental]
```

---

## Os Scripts de Inspeção

A chave foi **inspecionar o DOM em runtime** — o que realmente está renderizado no browser.

### Script 1: Playwright E2E Test

**Arquivo:** `frontend/e2e/inspect-tag.spec.ts`

```typescript
import { test } from '@playwright/test';

test.describe('inspect .post-tag-header', () => {
  test('inspect element styles', async ({ page }) => {
    // Navega para um post
    await page.goto('/artigos', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // Encontra e clica no primeiro post
    const firstLink = page.locator('a[href*="/post/"]').first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
    }
    
    // Inspeciona o elemento e retorna dados
    const result = await page.evaluate(() => {
      const el = document.querySelector('.post-tag-header');
      
      if (!el) {
        return {
          error: '.post-tag-header not found',
          actualElements: Array.from(
            document.querySelectorAll('[class*="tag"]')
          ).map(e => ({ tag: e.tagName, class: e.className })),
        };
      }
      
      const computed = window.getComputedStyle(el);
      return {
        element: {
          tag: el.tagName,
          className: el.className,
          outerHTML: el.outerHTML.substring(0, 300),
        },
        computedStyles: {
          backgroundColor: computed.backgroundColor,
          border: computed.border,
          display: computed.display,
          padding: computed.padding,
        },
      };
    });
    
    console.log(JSON.stringify(result, null, 2));
  });
});
```

**Como executar:**
```bash
npm run test:e2e -- inspect-tag.spec.ts --project=chromium
```

### Script 2: Node.js com Playwright

**Arquivo:** `inspect-tag.js`

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navega para um post
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  
  // Inspeciona
  const result = await page.evaluate(() => {
    const el = document.querySelector('.post-tag-header');
    
    if (!el) {
      return {
        error: 'Elemento não encontrado',
        availableTags: document.querySelectorAll('[class*="tag"]').length,
        allElements: Array.from(document.querySelectorAll('[class*="post-"]'))
          .map(e => ({ tag: e.tagName, class: e.className })),
      };
    }
    
    return {
      tag: el.tagName,
      className: el.className,
      computed: {
        backgroundColor: getComputedStyle(el).backgroundColor,
        display: getComputedStyle(el).display,
      },
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
```

**Como executar:**
```bash
node inspect-tag.js
```

### Script 3: Python com Playwright

**Arquivo:** `inspect_tag.py`

```python
import asyncio
import json
from playwright.async_api import async_playwright

async def inspect_tag():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto('http://localhost:3000', timeout=10000)
        
        result = await page.evaluate("""
        () => {
            const el = document.querySelector('.post-tag-header');
            
            if (!el) {
                return {
                    error: 'Element not found',
                    tagElements: Array.from(
                        document.querySelectorAll('[class*="tag"]')
                    ).map(e => ({
                        tag: e.tagName,
                        class: e.className,
                        text: e.textContent?.substring(0, 30)
                    }))
                };
            }
            
            const computed = window.getComputedStyle(el);
            return {
                element: {
                    tag: el.tagName,
                    className: el.className,
                    outerHTML: el.outerHTML.substring(0, 300),
                },
                computedStyles: {
                    backgroundColor: computed.backgroundColor,
                    border: computed.border,
                    padding: computed.padding,
                },
            };
        }
        """)

        print(json.dumps(result, indent=2))
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_tag())
```

**Como executar:**
```bash
python inspect_tag.py
```

---

## Os Resultados: A Verdade

Quando executei os scripts de inspeção, o resultado foi cristalino:

```json
{
  "error": ".post-tag-header not found",
  "actualElements": [
    {
      "tag": "SPAN",
      "class": "post-tag",
      "text": "Cloud Computing"
    }
  ]
}
```

**Achado crucial:** O elemento `.post-tag-header` **não existia no DOM renderizado**.

### Por Que Não Existia?

Analisando o código TypeScript/React:

```tsx
// Renderização condicional no page.tsx
{category ? (
  <Link className="post-tag-header" href={`/categoria/${category.slug}`}>
    {category.nome}
  </Link>
) : (
  <span className="post-tag">
    {categoria_slug}
  </span>
)}
```

**O problema:** A variável `category` era `null` ou `undefined`, então a renderização escolhia o branch `else`, renderizando `<span class="post-tag">` em vez de `<Link class="post-tag-header">`.

---

## A Solução: 2 Minutos de Trabalho Real

Uma vez que descobri qual elemento realmente existia, a solução foi trivial:

**Aplicar o CSS ao `.post-tag` (o elemento que existe):**

```css
.post-tag {
  background: #f6f8fc;
  color: #46668f;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  border: 1px solid rgba(255,255,255,.52);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.72), 
              0 6px 20px rgba(49,91,146,.06);
}
```

**Resultado:** ✅ Funcionou imediatamente.

---

## Análise Comparativa

| Aspecto | Guessing Cego | Investigation Protocol |
|---------|---------------|------------------------|
| **Tempo gasto** | 15+ minutos | 2 minutos |
| **Tentativas** | 4+ mudanças sem efeito | 1 mudança correta |
| **Compreensão** | "Não sei por que não funciona" | "Sei exatamente o que está acontecendo" |
| **Confiança** | Baixa — pode quebrar algo | Alta — baseada em dados |
| **Reutilizabilidade** | Não | Sim — protocolo é replicável |

---

## Padrão Identificado: O Ciclo Destrutivo

O que aprendemos é que existe um **padrão destrutivo recorrente:**

```
Assumir que o problema é X
  ↓
Tentar múltiplas soluções para X (sem confirmar)
  ↓
Nenhuma funciona (porque o problema é Y, não X)
  ↓
Frustração e perda de tempo
  ↓
Reset ou hack ineficiente
```

**O antídoto:**

```
Observar e mapear a realidade (DOM, dados, estado)
  ↓
Comparar: esperado vs. realidade
  ↓
Formular hipótese sobre a discrepância
  ↓
Testar hipótese minimamente (1 mudança)
  ↓
Validar resultado
  ↓
Atualizar modelo mental
```

---

## Por Que Isso Importa para Desenvolvimento com IA

Quando você trabalha com um assistente de IA (Claude, ChatGPT, etc.), o risco de "guessing cego" aumenta porque:

1. **Iteração rápida:** A IA gera código rapidinho, tentando vários valores
2. **Falta de feedback:** A IA não vê o browser; está gerando CSS no escuro
3. **Tendência a adivinhar:** Sem observação real, é fácil tentar `!important`, `z-index: 9999`, etc.

**A solução:** 

> **Interrompa a geração de código. Observe o DOM. Reporte ao assistente EXATAMENTE o que você vê. Depois peça uma correção baseada em dados.**

---

## Lições Extraídas

### 1. **O Código é Verdade, Não Screenshots**

Não confie em screenshots do Figma ou protótipos. Inspecione o que realmente está renderizado.

### 2. **Renderização Condicional é Invisível**

Elementos que não existem no DOM não podem ser estilizados. Antes de aplicar CSS, confirme que o elemento existe.

### 3. **Ferramenta Certa para o Trabalho**

Playwright E2E é perfeito para inspecionar DOM em runtime. Muito melhor que "adivinhar" ou "testar manualmente".

### 4. **Uma Mudança por Vez**

O Incremental Investigation Protocol funciona porque cada mudança é testável isoladamente. Múltiplas mudanças cegas geram ruído.

### 5. **Diagnóstico Antes de Ação**

Invista 2 minutos em diagnóstico. Economize 15 minutos em tentativas cegas.

---

## Template para Reproduzir Este Protocolo

Sempre que CSS/styling não funciona:

```markdown
## 1. Inspecionar

```javascript
const el = document.querySelector('YOUR_SELECTOR');
console.log({
  exists: !!el,
  tagName: el?.tagName,
  className: el?.className,
  computed: el ? window.getComputedStyle(el) : null,
});
```

## 2. Comparar

- Esperado: elemento com class="post-tag-header"
- Realidade: elemento com class="post-tag"
- Diferença: renderização condicional escolheu branch errado

## 3. Hipótese

"Variável `category` é null; renderizar `<span class="post-tag">` em vez de `<Link class="post-tag-header">`"

## 4. Testar Minimamente

Aplicar CSS a `.post-tag` (o que existe) em vez de `.post-tag-header` (o que não existe).

## 5. Validar

✅ Estilos aplicados corretamente ao elemento real.
```

---

## Conclusão

Este caso de estudo demonstra que **a maioria dos problemas "de CSS" na verdade não são problemas de CSS**. São problemas de:

- Renderização condicional escolhendo branch diferente
- Elementos que não existem no DOM esperado
- Estado de dados que diverge da suposição inicial
- Seletores apontando para elemento errado

**A solução:** Inspecionar o DOM em runtime antes de qualquer mudança de código.

Quando trabalhar com IA, force essa disciplina:
1. "Inspira o DOM e me diga exatamente o que você vê"
2. "O elemento `.post-tag-header` existe? Se não, qual existe?"
3. "Agora sim, aplica o CSS ao elemento real"

---

## Referências

- **Incremental Investigation Protocol:** `memory/feedback_incremental_investigation_protocol.md`
- **Runtime Inspection Protocol:** `memory/feedback_runtime_inspection_protocol.md`
- **Playwright Docs:** https://playwright.dev/docs/api/class-page#page-evaluate
