# CONTRATO DE RITMO VERTICAL — Blog Marcelo Gonçalves
> Última atualização: 2026-05-19 — Sessão 31 (esclarecimentos margin collapsing + padrões consistentes + checklists)

---

## 1. Escala de Espaçamento (10 tokens, 8px grid)

Todos os valores são múltiplos de 8px. Nenhum margin/padding fora desta escala é permitido.

```css
:root {
  --space-1:       8px;   /* Micro: badges, gap inline, eyebrow→título widget */
  --space-2:       16px;  /* Pequeno: meta-row, margin ícone, gap dentro de card */
  --space-3:       24px;  /* Médio: padding interno de card, título→descrição widget */
  --space-4:       32px;  /* Grande: gap widgets sidebar, título→lista/botões widget */
  --space-content: 40px;  /* Corpo: gap parágrafos, eyebrow→conteúdo, badge→H1 */
  --space-5:       48px;  /* Macro: gap coluna/sidebar, margin-bottom post-card */
  --space-6:       64px;  /* Landmark: padding vertical de seções */
  --space-breath:  80px;  /* Respiro: hero-pb, meta→imagem, separação de blocos */
  --space-7:       96px;  /* Editorial: entre seções H2, hero-pt, gap seções grandes */
  --space-epic:    112px; /* Épico: transição conteúdo→autor no post */
}
```

---

## 2. Regras Globais

### Section global
```css
section { margin-block: var(--space-6); } /* 64px — globals.css */
```

**Exceções obrigatórias** (`margin-block: 0`):
- `PageHero`, `PageCTA`, `SuperDestaque`, `TechRibbon`
- Qualquer seção fullwidth com padding próprio

### Colunas editoriais (home-main, op-articles-feed, op-timeline-feed)
- Sections: `margin-block: var(--space-4)` = 32px (sobrescreve global)
- Banners: `margin: var(--space-4)` = 32px
- Primeiro filho: `margin-top: 0`

---

## 3. Sidebars — Padrão com `gap`

```css
.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);         /* 32px entre widgets */
  top: calc(var(--space-7) + var(--space-4)); /* sticky: 128px */
}

/* Cancela margin-block global nos filhos */
.blog-sidebar > *,
.sidebar-dynamic-area > * {
  margin-block: 0;
}
```

### Ritmo interno de cada widget
| Ponto | Token | Valor | Mecanismo |
|-------|-------|-------|-----------|
| Eyebrow → título | `--space-1` | 8px | `margin-bottom` no eyebrow |
| Título → corpo/lista | `--space-4` | 32px | `margin-bottom` no título |
| Descrição → botões/form | `--space-4` | 32px | `margin-bottom` na descrição |

**Regra clara:** 
- ✅ **Use `gap: var(--space-4)` no container flex do widget** — Espaçamento uniforme entre widgets
- ✅ **Use `margin-bottom` apenas** em filhos (nunca `margin-top` + `margin-bottom`)
- ✅ **Todos filhos começam com `margin: 0; padding: 0`**
- ❌ **Não use `gap: 0` + margens explícitas** — Complexo, difícil de manter

**Por quê esse padrão:**
- `gap` em flex/grid **nunca sofre margin collapsing**
- Espaçamento é sempre exato (40px é sempre 40px)
- Filho não precisa saber seu contexto

---

## 4. Post Page — Ritmo Vertical

### Hero (`article-header`)
| Ponto | Token | Valor |
|-------|-------|-------|
| padding-top | `--space-7` | 96px |
| padding-bottom | `--space-breath` | 80px |
| Badge/tag → H1 | `--space-content` | 40px |
| H1 → meta | `--space-content` | 40px |
| Meta → imagem destaque | `--space-breath` | 80px |

### Grid
| Ponto | Token | Valor |
|-------|-------|-------|
| padding vertical (desktop) | `--space-6` | 64px |
| Gap conteúdo / sidebar | `--space-5` | 48px |

### Conteúdo — Padrão com `* + *` (margin-top apenas)
| Ponto | Token | Valor | Mecanismo |
|-------|-------|-------|-----------|
| Intro card → conteúdo body | `--space-7` | 96px | `margin-top` no primeiro `p` após card |
| Entre seções H2 (`--post-heading-top`) | `--space-7` | 96px | `margin-top` em `h2` quando tem elemento anterior |
| H2 → parágrafos (`--post-heading-bottom`) | `--space-content` | 40px | `margin-top` em `p` que segue `h2` |
| Entre parágrafos (`--post-block-spacing`) | `--space-content` | 40px | `margin-top` em `p + p` (sibling selector) |
| Conteúdo → rodapé/autor | `--space-epic` | 112px | `margin-top` em `.author-box` ou `.related-section` |

**CSS implementação (pattern correto):**
```css
.post-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-content);  /* 40px entre TODO elemento */
}

.post-content > * {
  margin: 0;  /* Reset total */
}

/* OU alternativa com margin-top (sem gap): */
.post-content p { margin: 0; }
.post-content p + p { margin-top: var(--space-content); }  /* Só irmão com anterior */
.post-content h2 + p { margin-top: var(--space-content); }  /* P após H2 */
```

### H2 com numeração
- Frame: `48×48px`, `border-radius: 16px`, `background: var(--accent-10)`
- Número: `var(--text-lg)` (1.125rem), `font-weight: 900`, `color: var(--accent)`
- Texto H2: `var(--text-2-5xl)` (2.25rem), `font-weight: 900`, `letter-spacing: -0.05em`
- Alinhamento vertical: `align-items: center` (número centralizado com o texto)

---

## 5. Mapeamento de Referência

| Tailwind (protótipo) | px | Token do projeto |
|---|---|---|
| `space-y-3` / `mb-3` | 12px | `--space-1` (8px) |
| `gap-4` / `mb-5` / `mt-5` | 16 / 20px | `--space-2` (16px) |
| `p-7` | 28px | `--space-4` (32px) |
| `gap-8` / `mb-8` | 32px | `--space-4` (32px) |
| `mb-10` / `space-y-10` | 40px | `--space-content` (40px) ✓ |
| `gap-12` | 48px | `--space-5` (48px) ✓ |
| `py-16` | 64px | `--space-6` (64px) ✓ |
| `mt-20` / `pb-20` | 80px | `--space-breath` (80px) ✓ |
| `pt-24` / `space-y-24` | 96px | `--space-7` (96px) ✓ |
| `mt-28` | 112px | `--space-epic` (112px) ✓ |
| `top-32` | 128px | `calc(--space-7 + --space-4)` |

---

## 6. Padrão de Espaçamento — Regra Obrigatória

### O Problema: Margin Collapsing

```css
/* ❌ ERRADO */
.post-content h2 { margin-bottom: 40px; }
.post-content p { margin-top: 40px; }
/* Resultado: 40px (não 80px!) — margin collapsing causa o maior vencer */

/* ❌ ERRADO — mix com padding */
.post-content h2 { margin-bottom: 32px; }
.post-content p { padding-top: 8px; }
/* Resultado: 40px (32 + 8), mas frágil e imprevisível */
```

### Solução: Escolher Apenas Um Mecanismo

#### **Opção A: `gap` em flex/grid (RECOMENDADO — Moderno, sem bugs)**

```css
.post-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-content);  /* 40px — sempre exato, nunca collapsing */
}

.post-content > * {
  margin: 0;  /* Reset total — pai controla tudo */
  padding: 0;
}
```

**Vantagens:**
- ✅ Nunca sofre margin collapsing
- ✅ Espaçamento sempre exato
- ✅ Pai = "Source of truth"
- ✅ Filho não precisa saber seu contexto
- ✅ Responsive automático (gap adapta)

**Quando usar:**
- Post pages (parágrafos, headings, listas)
- Home sections (cards, banners)
- Sidebars (widgets)
- Grid layouts

---

#### **Opção B: Apenas `margin-top` com Sibling Selector (Alternativa se gap não funcionar)**

```css
.post-content p { margin: 0; }  /* Reset */
.post-content p + p { margin-top: var(--space-content); }  /* Só irmão que tem anterior */
.post-content h2 + p { margin-top: var(--space-content); }  /* P após H2 */
```

**Vantagens:**
- ✅ Nenhum margin collapsing (margin-top nunca collapsa com pai)
- ✅ Primeiro elemento = zero spacing
- ✅ Funciona em qualquer container (não precisa flex)

**Desvantagens:**
- ❌ Mais CSS (sibling selectors para cada combinação)
- ❌ Menos intuitivo

**Quando usar:**
- Quando não pode usar flexbox (ex: conteúdo estático legado)
- Quando a estrutura não permite flex

---

#### **❌ NÃO FAÇA: Mix de margin-bottom e margin-top**

```css
/* PROIBIDO */
p { margin-bottom: 40px; }
p { margin-top: 32px; }
/* Resultado: Imprevisível (collapsing) + último parágrafo adiciona 40px ao fim */

/* PROIBIDO */
h2 { margin-bottom: 40px; }
p { margin-top: 40px; }
/* Resultado: 40px (não 80px), confunde desenvolvedor */

/* PROIBIDO */
.widget { margin-bottom: 32px; margin-top: 32px; }
/* Resultado: Duplica espaçamento em alguns contextos */
```

---

## 7. Aplicação Por Contexto

Use esta tabela para decidir qual padrão aplicar:

| Contexto | Padrão | Implementação | Por quê |
|----------|--------|---|---|
| **Post page (conteúdo)** | `gap` em flex | `.post-content { display: flex; gap: var(--space-content); }` | Sem collapsing, exato |
| **Sidebar (widgets)** | `gap` em flex | `.sidebar { gap: var(--space-4); }` | Pai controla, uniforme |
| **Home sections** | `gap` em grid | `.home-grid { display: grid; gap: var(--space-4); }` | Responsivo, escável |
| **Cards em grid** | `gap` no container | `.card-grid { gap: var(--space-5); }` | Layout automático |
| **Hero/fullwidth** | `padding` no container | `.hero { padding: var(--space-7) 0; }` | Controle absoluto |
| **Legado (sem flex)** | `margin-top` + sibling | `.content p + p { margin-top: var(--space-content); }` | Fallback |

---

## 8. Stack System — Utility Reutilizável

Se você não pode usar flex/grid (conteúdo dinâmico, editor WYSIWYG), use o `.stack` utility:

```css
/* globals.css — já existe */
.stack > * + * {
  margin-top: var(--stack-space, var(--space-4));
}
```

**Uso:**
```html
<div class="stack" style="--stack-space: var(--space-content)">
  <h2>Título</h2>
  <p>Parágrafo 1</p>
  <p>Parágrafo 2</p>
  <blockquote>Citação</blockquote>
</div>
```

**Resultado:**
- Primeiro elemento: sem margin
- Demais elementos: `margin-top: 40px`
- Sem collapsing (margin-top nunca collapsa)
- Espaçamento exato garantido

---

## 9. Checklist Para Novo Elemento — "Quem Define o Espaçamento?"

Quando você vai adicionar um novo elemento e não sabe se colocar margin ou deixar para o pai, use este checklist:

### **Pergunta 1: O pai é um container flex ou grid?**
```
SIM → Ir para Pergunta 3
NÃO → Ir para Pergunta 2
```

### **Pergunta 2: O pai usa `.stack` ou tem `gap` em algum lugar?**
```
SIM → Elemento começa com margin: 0; padding: 0
      → Gap do pai controla tudo
NÃO → Ir para Pergunta 3
```

### **Pergunta 3: Qual é sua prioridade?**
```
Eu quero: Espaçamento exato, sem bugs
→ Use gap em flex/grid no pai
→ Elemento: margin: 0; padding: 0;

Eu sou forçado a: Usar margin (sem flexbox)
→ Use margin-top no elemento (nunca margin-bottom)
→ Use sibling selector: .parent > * + * { margin-top: token; }

Eu tenho: Conteúdo dinâmico/WYSIWYG
→ Envolver em .stack com --stack-space customizado
```

### **Pergunta 4: Você quer colocar AMBOS margin-bottom E margin-top?**
```
SIM → PARAR. Reler seção 6. Escolha um. Apenas um.
NÃO → Continuar
```

---

## 10. Proibido

- ❌ Valores fora da escala sem justificativa documentada
- ❌ Mix de `margin-bottom` e `margin-top` no mesmo elemento
- ❌ `gap` uniforme em containers onde elementos têm hierarquias diferentes (ex: eyebrow + título + descrição)
  - **Exceção:** Se você usa `gap` + `margin-bottom` explícito por filho = OK (pai + filho combinam)
- ❌ `margin-bottom` nos filhos de sidebar (duplica com `gap` do pai)
- ❌ Qualquer valor em px que não seja múltiplo de 8
- ❌ Padding + margin na mesma direção sem documentação (causa somação imprevisível)

---

## 11. Debug — Baseline Grid Overlay

Para visualizar o grid de 8px e validar alinhamento:

```html
<body class="debug-rhythm">
  <!-- seu conteúdo -->
</body>
```

```css
/* globals.css */
body.debug-rhythm {
  background-image: linear-gradient(
    to bottom,
    rgba(255, 0, 0, 0.06) 1px,
    transparent 1px
  );
  background-size: 100% 8px;
}
```

**Como usar:**
1. Ativar no DevTools Console: `document.body.classList.add('debug-rhythm')`
2. Verificar se elementos estão alinhados à grid
3. Validar espaçamentos verticais
4. Desativar: `document.body.classList.remove('debug-rhythm')`

---

## 12. Resumo Executivo — Regra de Ouro

| Situação | Solução | Css |
|----------|---------|-----|
| Você tem flex/grid | Use `gap` | `gap: var(--space-X)` |
| Você não tem flex | Use `margin-top` (sibling) | `.parent > * + * { margin-top: var(--space-X); }` |
| Você tem conteúdo dinâmico | Use `.stack` | `<div class="stack" style="--stack-space: var(--space-X)">` |
| Você vê 64px espaço (32+32) | Fix: use gap OU use-bottom (não ambos) | Refatorar para uma fonte de verdade |
| Você não sabe o que fazer | PARAR, ler seção 9 Checklist | — |
