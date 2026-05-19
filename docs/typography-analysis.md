# Análise do Sistema de Tipografia — Protótipo

**Data:** 2026-05-18 | **Fonte:** `post-page-prototype.html`

---

## 1. Fontes Base

| Variável | Fonte | Uso |
|----------|-------|-----|
| `--display` | Inter (Display) | Headings, títulos, display text |
| `--sans` | Inter (Sans) | Body, corpo, default |
| `--mono` | JetBrains Mono | Código, labels técnicos, badges |

**Base do Body:** 17px, line-height 1.7

---

## 2. Hierarquia de Tamanhos Identificada

### Display / Headings Principais

| Elemento | Tamanho | Weight | Line-height | Letter-spacing | Font-style |
|----------|---------|--------|-------------|-----------------|-----------|
| **H1 (article-title)** | clamp(2.25rem, 5.5vw, 3.75rem) | 800 | 0.95 | -0.055em | normal |
| **Pull Quote** | 1.875rem | 500 | 1.2 | -0.03em | italic |
| **H2 (post heading)** | 2.25rem | 800 | 1.1 | -0.035em | normal |
| **H3 (post subheading)** | 1.375rem | 700 | 1.3 | -0.025em | normal |
| **Related Posts Title** | 1.125rem | 700 | 1.3 | -0.012em | normal |

### Lead / Intro

| Elemento | Tamanho | Weight | Line-height | Letter-spacing | Font-style |
|----------|---------|--------|-------------|-----------------|-----------|
| **Lead Text** | 1.375rem | 500 | 1.5 | -0.015em | italic |
| **Lead Text Highlight (em)** | 1.375rem | 700 | — | — | normal |

### Body / Content

| Elemento | Tamanho | Weight | Line-height | Letter-spacing | Font-style |
|----------|---------|--------|-------------|-----------------|-----------|
| **Paragraph** | 1.1875rem | 400 | 1.7 | normal | normal |
| **List Item** | 1.1875rem | 400 | 1.7 | normal | normal |
| **Featured Caption** | 0.875rem | 400 | 1.55 | normal | italic |
| **Callout Text** | 1rem | 400 | 1.65 | normal | normal |
| **Table Cell** | 0.9375rem | 400 | normal | normal | normal |

### Navigation / UI

| Elemento | Tamanho | Weight | Letter-spacing | Font-style |
|----------|---------|--------|-----------------|-----------|
| **Nav Brand (mobile)** | 1.5rem | 800 | -0.035em | normal |
| **Nav Brand (desktop)** | 2rem | 800 | -0.035em | normal |
| **Nav Link** | 1.125rem | 500 | 0.005em | normal |
| **Article Meta** | 0.9375rem | 400 | normal | normal |
| **Meta Author (bold)** | 0.9375rem | 600 | normal | normal |

### Labels / Small Text

| Elemento | Tamanho | Weight | Font-family | Letter-spacing | Text-transform |
|----------|---------|--------|-------------|-----------------|-----------------|
| **Eyebrow/Label (mono)** | 0.6875rem | 500 | JetBrains Mono | 0.20em-0.22em | uppercase |
| **Eyebrow (display)** | 0.75rem | 700 | Inter Display | 0.01em | normal |
| **Mono Badge** | 0.6875rem | 500-600 | JetBrains Mono | 0.14em-0.16em | uppercase |
| **List Counter (mono)** | 0.75rem | 500 | JetBrains Mono | 0.02em | normal |
| **Code Inline** | 0.875em | 500 | JetBrains Mono | normal | normal |
| **Table Header** | 0.6875rem | 500 | JetBrains Mono | 0.16em | uppercase |
| **Signature Date** | 0.6875rem | 400 | JetBrains Mono | 0.14em | uppercase |

---

## 3. Padrões Observados

### Font-weight Distribution
- **400:** Corpo, parágrafos, texto default
- **500:** Nav links, lead, pull quotes, labels, code
- **600:** Highlights, author names, strong, callout labels
- **700:** H3, small headings, eyebrows
- **800:** H1, H2, nav brand
- **900:** Related Posts section title

### Letter-spacing Pattern
- **Headings compactos:** -0.055em (H1), -0.035em (H2), -0.025em (H3)
- **Headlines intermediários:** -0.015em a -0.03em (lead, pull quote)
- **Mono labels:** +0.14em a +0.22em (letters espaçados)
- **Body/links:** normal ou 0.005em

### Line-height Pattern
- **Tight (display):** 0.95–1.1 (H1, H2, pull quotes)
- **Medium:** 1.2–1.3 (H3, labels)
- **Comfortable (body):** 1.55–1.7 (paragraphs, lists)

### Italic Usage
- Lead text (1.375rem)
- Pull quotes (1.875rem)
- Featured captions (0.875rem)
- Signature (1rem)
- Code highlights (0.875em)
- Callout text (0.875rem)

---

## 4. Inconsistências / Gaps Detectados

1. **Related Posts Label vs Post H2:**
   - Related label: 1.125rem, weight 700, letter-spacing -0.012em
   - Post H2: 2.25rem, weight 800, letter-spacing -0.035em
   - **→ Claro que são diferentes, mas confuso se há intencionalidade**

2. **Tamanho "1.375rem" reutilizado:**
   - Lead text = 1.375rem weight 500
   - H3 = 1.375rem weight 700
   - **→ Mesmo tamanho, pesos diferentes para hierarquia**

3. **Mono labels com múltiplos valores de letter-spacing:**
   - 0.14em, 0.16em, 0.20em, 0.22em (4 variações!)
   - Não está claro qual usar quando
   - **→ Pode ser reduzido a 2-3 valores**

4. **Linha-height "normal" vs numérico:**
   - Alguns elementos usam valores explícitos (1.7, 1.55)
   - Alguns não definem (herdam)
   - **→ Inconsistência potencial**

5. **Font-style italic:**
   - Não há padrão claro para quando usar
   - Aplicado em: lead, pull-quotes, captions, signatures
   - **→ Seria bom um sistema de "quando usar italic"**

---

## 5. Sidebar Widgets — Análise Completa

### Base Widget `.widget`

| Elemento | Tamanho | Weight | Line-height | Letter-spacing | Notas |
|----------|---------|--------|-------------|-----------------|-------|
| **`.widget-eyebrow`** | 0.875rem | 400 | — | 0.05em | Inter, accent color, uppercase |
| **`.widget-title`** | 2.8rem | 800 | 1.1 | -0.05em | Display, text-display color |
| **`.widget-desc`** | 1.125rem | 400 | 1.8 | normal | body text, t-muted color |
| **`.widget-btn`** | 1.125rem | 700 | — | normal | Inter, height 64px |

**Temas / Variantes:**

#### TOC Widget (`.widget--toc`) — Accent Petrol Theme
- Background: `var(--accent)` (#0F4C5C petrol)
- Eyebrow: `rgba(91,139,150,0.90)` (cyan/accent-mid)
- Title: `var(--paper)` (white)
- `.toc-list a`: 1.125rem, weight 400, lh 1.4 (paper color)
- `.toc-list a.toc-active`: weight 700, `rgba(91,139,150,0.90)`
- `.toc-progress`: 0.75rem, mono, ls 0.14em

#### Newsletter Widget (`.widget--news`) — Accent Petrol Theme
- Background: `var(--accent)` (petrol #0F4C5C)
- Eyebrow: `rgba(255,255,255,0.70)`
- Title: `var(--paper)` (white)
- Desc: `rgba(255,255,255,0.65)`
- Input: 1.125rem
- Label (checkbox): 0.75rem, display font, lh 1.7
- Policy link: weight 600

#### Consultoria Widget (`.widget--service`) — Moss Theme
- Title color: `var(--moss)` (#3F6B47)
- Button: 0.875rem, weight 600, ls 0.01em, height 56px
- Eyebrow: `rgba(63,107,71,0.65)` (moss opaque)

#### Projeto Widget (`.widget--projeto`) — Accent Petrol Theme
- Background: `var(--accent)`
- Similar ao Newsletter (branco em petrol)
- Button: height 56px, `var(--paper)` bg, `var(--accent)` text

### Popular Posts Widget (`.widget--popular`)

| Elemento | Tamanho | Weight | Line-height | Letter-spacing | Font-family |
|----------|---------|--------|-------------|-----------------|-------------|
| **Title** | 2.8rem | 800 | 1.1 | -0.05em | Display |
| **`.popular-rank`** | 3rem | 900 | 1 | -0.06em | Display |
| **`.popular-cat`** | 0.75rem | 600 | 1 | 0.24em | Sans |
| **`.popular-post-title`** | 1.125rem | 700 | 1.3 | -0.012em | Sans |

**Especial:**
- Eyebrow opaque moss: `rgba(63,107,71,0.65)`
- Title color: `var(--moss)`
- Rank opacity: 0.18 → 0.35 on hover
- Post title clamp: 2 linhas

### Newsletter CTA (Fullwidth, `.cta-newsletter`)

| Elemento | Tamanho | Weight | Line-height | Letter-spacing |
|----------|---------|--------|-------------|-----------------|
| **Eyebrow** | 0.75rem | 500 | — | 0.22em (mono) |
| **Title** | clamp(2rem, 4.5vw, 3.25rem) | 800 | 1.05 | -0.045em |
| **Desc** | 1.125rem | — | 1.6 | normal |
| **Input** | 0.9375rem | — | — | normal |
| **Button** | 0.875rem | 600 | — | 0.01em |
| **Legal** | 0.6875rem | — | — | 0.06em (mono) |

### AdSense Widget (`.widget-ad`)

- **Font size:** 0.6875rem
- **Font weight:** — (not specified)
- **Font family:** JetBrains Mono
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase

---

## 6. Resumo Para Criar Sistema

### Proposta de Tokens

**Display Scale (para headings):**
- `display-2xl`: 2.25rem, weight 800, lh 1.1, ls -0.035em
- `display-xl`: 1.875rem, weight 500, lh 1.2, ls -0.03em
- `display-lg`: 1.375rem, weight 700, lh 1.3, ls -0.025em
- `display-sm`: 1.125rem, weight 700, lh 1.3, ls -0.012em

**Body Scale:**
- `body-lg`: 1.1875rem, weight 400, lh 1.7
- `body-base`: 1rem, weight 400, lh 1.65
- `body-sm`: 0.9375rem, weight 400, lh normal

**Label Scale (mono):**
- `label-lg`: 0.875rem, weight 500, lh 1.5
- `label-base`: 0.75rem, weight 500, lh 1, ls 0.14em
- `label-sm`: 0.6875rem, weight 500, lh 1, ls 0.22em

**Specials:**
- `lead`: 1.375rem, weight 500, style italic, lh 1.5, ls -0.015em
- `pull-quote`: 1.875rem, weight 500, style italic, lh 1.2, ls -0.03em

---

## 7. Padrões Sidebar vs Main Content

### Reutilização Observada
- **`.widget-title` e `.post-content h2`:** Mesmos valores (2.8rem, 800, lh 1.1, ls -0.05em)
- **`.widget-eyebrow` e `.lead__label`:** Diferentes (widget = 0.875rem 400 0.05em; lead = 0.6875rem 500 0.20em)
- **`.widget-desc` e `.post-content p`:** Diferentes (widget = 1.125rem lh 1.8; body = 1.1875rem lh 1.7)
- **`.widget-btn`:** 1.125rem, 700 (peso único para botões)
- **`.popular-post-title` e `.related__card-title`:** Agora idênticos (1.125rem 700 lh 1.3 ls -0.012em) ✅

### Inconsistências Sidebar
1. **Eyebrow em dois estilos:**
   - Widget padrão: 0.875rem weight 400
   - Lead/Newsletter CTA: 0.75rem weight 500
   - Popular widget: 0.75rem mas sem weight especificado
   - **→ Padronizar para 0.75rem ou 0.875rem?**

2. **Descrições (widget-desc vs post p):**
   - Widget: 1.125rem, lh 1.8
   - Body: 1.1875rem, lh 1.7
   - **→ Pequena diferença propositalmente?**

3. **Popular rank (3rem 900):**
   - É o peso mais pesado encontrado
   - Ainda não há uso similar no main content
   - **→ Confirmar intenção ou reduzir para 800?**

4. **Mono labels (eyebrows):**
   - Widget eyebrow (sans): 0.875rem
   - Newsletter CTA eyebrow (mono): 0.75rem
   - Popular rank numbers: 3rem
   - **→ Inconsistência clara**

---

## 8. Sistema Proposto (Completo)

### Display Scale

| Token | Tamanho | Weight | Line-height | Letter-spacing | Uso |
|-------|---------|--------|-------------|-----------------|-----|
| `display-h1` | clamp(2.25rem, 5.5vw, 3.75rem) | 800 | 0.95 | -0.055em | Article title |
| `display-h2` | 2.25rem | 800 | 1.1 | -0.035em | Post h2, widget title |
| `display-h3` | 1.375rem | 700 | 1.3 | -0.025em | Post h3, lead |
| `display-lg` | 1.125rem | 700 | — | -0.012em | Card titles, widget btn |
| `display-sm` | 0.875rem | 400-600 | — | 0.05em | Widget eyebrow |
| `display-xs` | 0.75rem | 600 | 1 | 0.05em | Pills & categories, labels |

### Body Scale

| Token | Tamanho | Weight | Line-height | Uso |
|-------|---------|--------|-------------|-----|
| `body-lg` | 1.1875rem | 400 | 1.7 | Paragraphs, lists |
| `body-base` | 1.125rem | 400 | — | Widget descriptions |
| `body-sm` | 1rem | 400 | 1.65 | Callout text |
| `body-xs` | 0.9375rem | 400 | — | Meta, table, footer |

### Label/Meta Scale (Mono)

| Token | Tamanho | Weight | Letter-spacing | Usage |
|-------|---------|--------|-----------------|-------|
| `label-lg` | 0.875rem | 500 | 0.05em | Widget eyebrow |
| `label-base` | 0.75rem | 500-700 | 0.14em-0.22em | Mono badges, counters |
| `label-xs` | 0.6875rem | 500-600 | 0.16em-0.22em | Code headers, table headers |

### Special / Display

| Token | Tamanho | Weight | Line-height | Letter-spacing | Font-style |
|-------|---------|--------|-------------|-----------------|-----------|
| `lead` | 1.375rem | 500 | 1.5 | -0.015em | **italic** |
| `pull-quote` | 1.875rem | 500 | 1.2 | -0.03em | **italic** |
| `caption` | 0.875rem | 400 | 1.55 | normal | **italic** |
| `signature` | 1rem | 600 | — | -0.015em | **italic** |
| `rank-number` | 3rem | 900 | 1 | -0.06em | normal |
| `cta-title` | clamp(2rem, 4.5vw, 3.25rem) | 800 | 1.05 | -0.045em | normal |

### Italic Usage Rules (Inegociável)

Use `font-style: italic` quando o texto é:

1. **Introductory/Summary** — Resumo, lead, teaser
   - Exemplo: `.lead__text` (resumo do artigo)
   - Efeito: Diferencia intro do corpo principal

2. **Attribution/Quoted** — Citações, assinaturas, pull-quotes
   - Exemplo: `.pull-quote` (citação destacada), `.signature__text` (assinatura autor)
   - Efeito: Indica voz diferente, perspectiva diferente

3. **Descriptive/Contextual** — Legendas, captions, observações
   - Exemplo: `.featured__caption` (legenda de imagem), callout descriptive text
   - Efeito: Diferencia contexto/metadado do conteúdo principal

4. **Editorial Emphasis** — Editor's notes, disclaimers, testimonials (futuro)
   - Padrão a seguir quando criar novos elementos
   - Efeito: Marca conteúdo editorial especial

**Nunca use italic para:**
- Body paragraphs (corpo principal)
- Headings (títulos/seções)
- List items (itens de lista)
- Button text
- Labels/badges

---

## 9. Decisões Finalizadas

✅ **1. Eyebrow:** 0.875rem (consolidado de 0.75rem)
✅ **2. Popular rank:** weight 900 mantido (decorativo, intencional)
✅ **3. Italic rules:** Documentado (lead, quote, caption, signature, emphasis)
✅ **4. Widget desc vs body:** Unificado para **1.125rem, lh 1.8** (mais arejado para tudo)
✅ **5. Body unified:** Todos os parágrafos, descrições e body text usam 1.125rem lh 1.8

### Pendentes

1. **Mono letter-spacing:** Consolidar para 3-4 valores ao invés de 6+?
2. **Button sizes:** Padronizar altura (56px ou 64px)?

---

## 10. Token Body Unificado

```css
/* Body unified — aplicar em todos os parágrafos, descrições, listas */
body-lg {
  font-size: 1.125rem;
  line-height: 1.8;
  font-weight: 400;
  /* Cores variam por contexto, mas tamanho/espaçamento é consistente */
}

/* Aplicável a: */
/* .post-content p, .widget-desc, .post-content li, .callout__text (quando não-emphasized) */
```

**Efeito visual:** Respiro mais generoso em TODO conteúdo — blogs são para ler, não para scanner.

---

## 11. Decisões Finalizadas — Consolidação Completa

### Font-weight System (6 pesos — inegociável)
```
400 = Body, default text
500 = Lead, pull-quotes, labels, emphasis
600 = Strong, buttons, signatures
700 = H3, card titles, headings small
800 = H1, H2, section headings
900 = Popular rank (decorative only)
```

### Letter-spacing System (5 valores consolidados)
```
normal        = Body, nav links, subtle text
-0.03em       = H3, medium headings, lead
-0.05em       = H1, H2, main headings
0.05em        = Eyebrow sans (widget)
0.14em        = Base mono labels, table headers
0.22em        = Emphasis mono labels, badges, uppercase
```

**Consolidação executada:**
- Removidos: 0.01em, 0.02em, 0.04em, 0.06em, 0.08em, 0.12em, 0.18em, 0.20em, 0.24em, 0.6em
- Unificados: -0.035em → -0.05em | -0.025em → -0.03em | 0.16em → 0.14em | 0.20em → 0.22em

### Line-height System (5 valores consolidados)
```
1 (one)      = Tight display (rank numbers, counters)
1.05         = Display headers (H1, H2, CTA titles)
1.3          = Medium (H3, card titles, pull-quotes)
1.6          = Comfortable (body, captions, callouts)
1.8          = Spacious (lead, widget-desc, generous reading)
```

**Consolidação executada:**
- Removidos: 0.95, 1.1, 1.2 → 1.3, 1.4 → 1.3, 1.5 → 1.6, 1.55 → 1.6, 1.65 → 1.6, 1.7 → 1.8

### Font-variation-settings (REMOVIDO)
- Decisão: Removidos todos os `font-variation-settings: 'opsz'` — Inter variable otimiza automaticamente
- Removido de: H1, H2, H3, lead__text, pull-quote, cta-newsletter__title, site-footer__brand
- Benefício: CSS mais limpo, mesmo resultado visual, menos technical debt

### Button System (UNIFICADO)
```
Height:      56px (todos os botões)
Font size:   1.125rem (todos os botões)
Font weight: 600-700 (por contexto)
Border-rad:  16px (todos os botões)
```

**Mudanças:**
- `.widget-btn`: 64px → 56px
- `.widget--service .widget-btn`: 0.875rem → 1.125rem, weight 600
- `.widget--projeto .widget-btn`: adicionado 1.125rem + weight 600
- `.cta-newsletter__btn`: 0.875rem → 1.125rem, weight 600

### Pills & Categories System (NOVO — Sessão 31)
```
Font-size:     0.75rem
Font-weight:   600
Line-height:   1
Letter-spacing: 0.05em
Text-transform: uppercase
Background:    var(--accent-tint) (#D0E0E4)
Color:         var(--accent) (#0F4C5C)
Padding:       6px 12px
Border-radius: 999px
Display:       inline-block (fit-content)
```

✅ **Padrão unificado** para 3 contextos:
- `.popular-cat` (widget mais lidos)
- `.related__card-cat` (cards relacionados)
- `.article-category` (hero artigo — sem bolinha/animação)

✅ **Consolidação executada:**
- `.popular-cat`: ls 0.22em → 0.05em, fw 700 → 600
- `.related__card-cat`: ls 0.22em → 0.05em, fw 700 → 600
- `.article-category`: fw 700 → 600, background soft → tint, removida bolinha e animação

### Responsive Strategy
```
Valores fixos: body, labels, captions (sempre legível)
clamp():       H1, CTA titles (escala com viewport, max 3.75rem)
Sem escala:    H2, H3 (fixed-size section headers)
```

### Line-clamp Rules
```
Card titles:   -webkit-line-clamp: 2 (popular, related, card-title)
Body:          Sem clamp (full paragraph display)
Long content:  Use clamp() ou truncation apenas para restrições de espaço UI
```

### Text-transform (Consolidado)
```
uppercase: Apenas para mono labels, badges, eyebrows, pills
normal:    Body, headings, descriptions, buttons
```

---

## 12. Pills & Categories System (Nova Consolidação — Sessão 31)

Padrão unificado para todas as tags de categoria em contextos específicos.

### Definição

| Propriedade | Valor | Notas |
|-------------|-------|-------|
| **Font-size** | 0.75rem | Pequeno, destacado |
| **Font-weight** | 600 | Medium-strong para clareza |
| **Line-height** | 1 | Tight, sem respiro |
| **Letter-spacing** | 0.05em | Consolidado, consistente com eyebrows |
| **Text-transform** | uppercase | Sempre uppercase |
| **Background** | var(--accent-tint) | #D0E0E4 — tom claro do accent |
| **Color** | var(--accent) | #0F4C5C — contraste claro |
| **Padding** | 6px 12px | Proporção vertical/horizontal |
| **Border-radius** | 999px | Pill shape, totalmente arredondado |
| **Display** | inline-block | Adapta ao conteúdo |
| **Width** | fit-content | Sem forced width |
| **White-space** | nowrap | Nunca quebra em múltiplas linhas |

### Aplicações

**1. `.popular-cat` — Widget de Mais Lidos (Sidebar)**
- Contexto: Categoria do post no ranking
- Cor de texto: `var(--accent)`
- Background: `var(--accent-tint)`

**2. `.related__card-cat` — Cards de Posts Relacionados (Seção footer)**
- Contexto: Categoria em card vertical
- Aplicação idêntica ao `.popular-cat`
- Sem decorativos

**3. `.article-category` — Hero da Página de Artigo**
- Contexto: Categoria principal do artigo
- Estrutura: `inline-flex` com `gap: 8px` para futuros decorativos
- Sem bolinha/animação (removida em sessão 31)
- Sem efeito de pulse
- Hover: background vai para `var(--accent-soft)` (tom mais claro)

### Regras de Uso

✅ **Use pills quando:**
- Categorizar/taxonomizar conteúdo
- Em widgets sidebar (popular, related)
- Na hero de páginas de conteúdo
- Espaço limitado (precisa ser compacta)

❌ **Não use pills para:**
- Badges de status (usar design diferente)
- Labels técnicos (usar mono typography)
- Eyebrows de seção (usar eyebrow padrão)

### Consolidação vs Sistema Anterior

| Antes | Depois | Mudança |
|-------|--------|---------|
| `.popular-cat`: ls 0.24em | ls 0.05em | Consolidação letter-spacing |
| `.popular-cat`: fw 700 | fw 600 | Harmonização weight |
| `.related__card-cat`: ls 0.22em | ls 0.05em | Consolidação |
| `.article-category`: fw 700 | fw 600 | Harmonização |
| `.article-category`: bolinha animada | Removida | Simplificação visual |
| `.article-category`: background soft | background tint | Intensidade consistente |

---

---

## 12. Token System — Final (CSS Variables)

```css
:root {
  /* Line-height scale */
  --lh-tight: 1;           /* counters, rank numbers */
  --lh-display: 1.05;      /* H1, H2, main titles */
  --lh-medium: 1.3;        /* H3, card titles, pull-quotes */
  --lh-comfortable: 1.6;   /* body, captions, normal reading */
  --lh-spacious: 1.8;      /* lead, widget-desc, generous reading */

  /* Letter-spacing scale */
  --ls-normal: normal;     /* body, buttons, default */
  --ls-subtle: -0.03em;    /* H3, medium headings */
  --ls-compact: -0.05em;   /* H1, H2, tight headings */
  --ls-eyebrow: 0.05em;    /* widget eyebrow (sans) */
  --ls-label: 0.14em;      /* base mono labels */
  --ls-emphasis: 0.22em;   /* emphasis mono, uppercase */

  /* Font-weight scale */
  --fw-regular: 400;       /* body */
  --fw-medium: 500;        /* lead, labels, emphasis */
  --fw-semibold: 600;      /* strong, buttons, signatures */
  --fw-bold: 700;          /* headings small */
  --fw-extrabold: 800;     /* H1, H2 */
  --fw-black: 900;         /* rank (decorative) */
}
```

---

**Status:** ✅ **Protótipo atualizado com todos os tokens consolidados. Documento revisado. Pronto para validação.**
