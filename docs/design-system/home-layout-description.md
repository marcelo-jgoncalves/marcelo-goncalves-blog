# Home Page Layout — Design Reference

Derived from `docs/design-system/examples/index.html` (compiled React prototype).

---

## 1. Hero Section

**Element:** `<section>`  
**Background:** `linear-gradient(135deg, #F8FAFC, #F1F5F9)` — soft gray-blue gradient  
**Padding:** `80px 20px`  
**Text align:** center  
**Max-width container:** 760px, centered

| Element | Style |
|---------|-------|
| `<h1>` | DM Sans, 700, `2.8rem`, `#111827`, `lineHeight: 1.15`, `letterSpacing: -0.03em`, `mb: 20px` |
| Accent word | `<span style="color: #3B5F8A">Inteligência Artificial</span>` |
| Full text | "Desvendando a **Inteligência Artificial**, AWS e DevOps detalhe por detalhe" |
| `<p>` subtitle | 1.1rem, `#64748B`, `lineHeight: 1.6`, `mb: 32px` |
| Subtitle text | "Análises profundas, tutoriais práticos e as últimas notícias do mundo da tecnologia, da AWS à OpenAI." |
| CTA button | `inline-block`, `padding: 12px 30px`, `bg: #3B5F8A`, white, `border-radius: 6px`, DM Sans 700, 1rem |
| Button text | "Ver Todos os Artigos" |

---

## 2. Main Content Area (Two-Column Grid)

**Container:** `maxWidth: 1200px`, `padding: 60px 20px`, `display: grid`, `gridTemplateColumns: 1fr 300px`, `gap: 60px`, `alignItems: start`

Esta é a diferença estrutural central em relação à implementação atual: a home abandona as seções fullwidth empilhadas e adota um layout de **duas colunas persistentes** — conteúdo principal à esquerda e sidebar fixa de 300px à direita. No mobile, a sidebar colapsa para baixo do conteúdo principal (single column).

---

### 2a. Coluna Esquerda (main)

A coluna principal renderiza os seguintes blocos em sequência:

#### Ad Banner inline (separador entre seções)
- Background: `#F1F5F9`, borda tracejada `#CBD5E1`, border-radius 6, height 90px
- `margin: 48px 0` — atua como separador visual entre seções de conteúdo
- Slot AdSense 728×90 (leaderboard)
- Aparece **3 vezes** no main: antes de "Últimos Artigos", entre seções, e após "Populares"

#### Seção: "Últimos Artigos"
- **Cabeçalho** (centered, `mb: 40px`):
  - h2: DM Sans 700, 2rem, `#111827`, mb 10
  - p: `#64748B`, 1rem — "O conteúdo mais recente sobre IA e Nuvem"
- **Grid de posts:** `repeat(2, 1fr)`, gap 24px — exibe os **4 posts mais recentes** via PostCard
- **Link "Ver todos os artigos →"** abaixo do grid (text-align: right), cor `#3B5F8A`, DM Sans 600, 0.95rem

#### Seção: "Populares & Mais Lidos"
- **Cabeçalho:** h2 "Populares & Mais Lidos" / p "O conteúdo que a comunidade mais acessou"
- **Grid de posts:** `repeat(2, 1fr)`, gap 24px — exibe 4 posts populares

#### Seção: "Explore nossos Tópicos"
- **Cabeçalho:** h2 "Explore nossos Tópicos" / p "Navegue pelo conteúdo principal do blog"
- **Grid de categorias:** `repeat(3, 1fr)`, gap 16px
- **Cada category card:**
  - white bg, border `1px solid #f0f0f0`, border-radius 12, padding 20, flex column centrado
  - Box-shadow: `0 4px 6px rgba(0,0,0,0.02)`
  - Hover: `translateY(-4px)`, borderColor `#3B5F8A`, boxShadow `0 10px 20px rgba(0,0,0,0.08)`
  - Ícone: `44×44px`, bg `#EBF1F8` (`var(--accent-light)`), border-radius 10, cor `#3B5F8A`, font-size `1.1rem`, mb 12
  - h3: DM Sans 700, `0.95rem`, `#111827`, mb 6
  - p: `0.8rem`, `#64748B`, lineHeight 1.4

---

### 2b. Coluna Direita (aside — sidebar sticky)

**Comportamento:** `position: sticky`, `top: 104px` (altura do header + gap de respiro)  
**Layout interno:** `display: flex`, `flex-direction: column`, `gap: 28px`

A sidebar contém **4 widgets** empilhados nesta ordem:

1. SvcCallout — "Precisa de Ajuda?" (dark navy)
2. PopWidget — "Mais Lidos" (3 posts)
3. AdSense 300×600 (half page)
4. ProjetoWidget — "O Projeto" (light gradient)

> **Nota de alinhamento:** O primeiro banner AdSense inline da coluna principal (o que aparece logo abaixo do Hero, antes de "Últimos Artigos") deve estar alinhado horizontalmente com o topo do Widget 1 (SvcCallout). Isso é garantido pela estrutura do grid: o `<main>` e o `<aside>` têm `align-items: start` e ambos começam na mesma linha do grid. O banner inline não tem margem top — começa rente ao início do `<main>`, no mesmo nível visual que o primeiro widget da sidebar.

---

#### Widget 1 — SvcCallout "Precisa de Ajuda?"

**Propósito:** Converter visitantes em leads de consultoria. Posicionado no topo da sidebar para máxima visibilidade.

**Visual:**
- Background: `#232F3E` (dark navy — contraste máximo com o fundo branco da página)
- Border-radius: 12px, padding: 24px
- Layout: flex column, centralizado

**Anatomia:**
| Elemento | Detalhe |
|----------|---------|
| Ícone box | `64×64px`, bg `rgba(255,255,255,0.1)`, border-radius 12 |
| Ícone SVG | Briefcase (maleta) — inline SVG, sem dependência de FA, stroke `#3B5F8A` |
| h3 | DM Sans 700, `1.25rem`, branco — "Precisa de Ajuda?" |
| Parágrafo | `0.875rem`, `#CBD5E0`, lineHeight 1.6 — "Precisa implementar IA, AWS ou DevOps? Veja como posso apoiar." |
| Botão CTA | `width: 100%`, `height: 48px`, bg `#3B5F8A`, branco, DM Sans 700, 1rem, border-radius 6 |
| Texto botão | "Conheça Meus Serviços" → linka para `/servicos` |

**Componente existente:** `ServiceCallout.tsx` — já implementado, mas atualmente usado como seção fullwidth em outras páginas. Para a home sidebar, o estilo dark precisa ser aplicado via modificador de classe ou variação de prop.

---

#### Widget 2 — PopWidget "Mais Lidos"

**Propósito:** Manter o usuário no site mostrando conteúdo popular. Gera pageviews adicionais e melhora métricas de engagement para AdSense. Posicionado logo após o CTA de serviços — usuário que não quer contratar segue consumindo conteúdo.

**Visual:**
- Container sem card box — apenas flex column com gap 20px
- Sem background próprio; herda o bg da sidebar/página

**Anatomia:**
| Elemento | Detalhe |
|----------|---------|
| h3 título | DM Sans 700, `1.1rem`, `#111827`, `display: inline-block`, `border-bottom: 2px solid #3B5F8A`, `padding-bottom: 8px` |
| Texto | "Mais Lidos" |
| Lista | 3 posts (não 4 — mais compacto que a versão atual) |
| Thumbnail | `width: 100%`, `aspect-ratio: 21/9` (panorâmico), border-radius 8, mb 10 |
| Título do post | DM Sans 600, `0.92rem`, `#111827`, lineHeight 1.4 |
| Interação | Cursor pointer, hover muda cor do título para `#3B5F8A` |

**Componente existente:** `PopularPostsWidget.tsx` — já implementado com Suspense, skeleton state e ResponsiveImage. Ajuste necessário: limitar para 3 posts (hoje limita a 4) e verificar se o `aspect-ratio: 21/9` já está no CSS do wrapper.

---

#### Widget 3 — AdSense 300×600 (Half Page)

**Propósito:** Slot de monetização de alto CPM. O formato **300×600** (half page) rende significativamente mais que o 300×250 em blogs de tech — ocupa mais espaço visual e entrega maior viewability ao anunciante.

**Visual:**
- Background: `#F1F5F9`, borda tracejada `1px dashed #CBD5E1`, border-radius 6
- **`min-height: 600px`** — reserva espaço para o formato 300×600, evitando CLS quando o AdSense carrega
- Sem conteúdo próprio além do label placeholder

**Componente existente:** `AdsenseSidebar.tsx` — já implementado. Ajuste necessário: atualizar o `min-height` de 250px para **600px** para acomodar o novo formato.

---

#### Widget 4 — ProjetoWidget "O Projeto"

**Propósito:** Apresentar o meta-projeto do blog (construído com IA na AWS) como diferencial de autoridade e curiosidade. Posicionado no **final** da sidebar — funciona como fechamento narrativo: quem consumiu todo o conteúdo da página descobre que o próprio blog é um case.

**Visual:**
- Background: `linear-gradient(150deg, #EBF1F8, #D0E4F2)` — gradiente azul suave (contraste leve após o bloco de AdSense neutro)
- Border: `1px solid rgba(59,95,138,0.2)`
- Border-radius: 12px, padding: 24px, text-align: center

**Anatomia:**
| Elemento | Detalhe |
|----------|---------|
| Ícone box | `52×52px`, bg `#3B5F8A` (accent sólido), border-radius 10, branco |
| Ícone | `fas fa-layer-group` — representa pilhas/camadas (infraestrutura) |
| h3 | DM Sans 700, `1.05rem`, `#1E3A5F` (azul escuro) — "O Projeto" |
| Parágrafo | `0.85rem`, `#475569`, lineHeight 1.6 — "Veja como este blog foi construído do zero na AWS, quase 100% com IA." |
| Botão | `width: 100%`, `height: 44px`, bg `#3B5F8A`, branco, DM Sans 700, `0.88rem`, border-radius 6 |
| Texto botão | "Acompanhe a Jornada →" → linka para `/o-projeto` |

**Componente existente:** Não existe versão sidebar. O `SuperDestaque.tsx` é a versão fullwidth. Precisará criar `ProjetoWidget.tsx` — componente estático pequeno, apenas para sidebar.

---

## 3. Seção Dark CTA Newsletter (full-width, após o grid)

**Elemento:** `<section>` — fullwidth, fora do grid de 2 colunas  
**Background:** `#111827` (`var(--dark-900)`)  
**Padding:** `80px 20px`  
**Text align:** center  
**Max-width container:** 700px, margin `0 auto`

Segue imediatamente após o grid `1fr 300px`. É a última seção de conteúdo antes do footer — CTA de conversão para newsletter.

**Anatomia completa:**

| Elemento | Estilo |
|----------|--------|
| h2 | DM Sans 700, `2rem`, branco, `lineHeight: 1.25`, `mb: 20px` |
| Texto h2 | "Quer se aprofundar em IA, DevOps e muito mais?" |
| p | `1.1rem`, `#94A3B8` (slate frio — não `opacity: 0.9` genérico), `lineHeight: 1.6`, `mb: 30px` |
| Texto p | "Inscreva-se na nossa newsletter e receba análises exclusivas e os melhores artigos da semana." |
| Botão | `inline-block`, `padding: 12px 30px`, **`border: 2px solid white`** (outline — não filled), color branco, border-radius 6, DM Sans 700 |
| Texto botão | "Inscrever-se agora" |

**Detalhe crítico — botão outline:** o botão aqui é estilo *outline* (borda branca, fundo transparente), **não** o `btn-primary` (fundo `#3B5F8A`). Este contraste cria hierarquia visual: o Hero usa o botão solid/primary, o CTA final usa outline para não competir. O hover natural do outline é `background: white, color: #111827`.

**Componente existente:** `NewsletterCTA.tsx` — já implementado com o texto e estrutura corretos. O CSS da classe `.cta` em `home.css` usa `opacity: 0.9` no parágrafo; alinhar para `color: #94A3B8` explícito conforme o design. O botão usa `.btn-outline` — confirmar que o CSS tem hover white/dark para este contexto dark.

---

---

## 4. Footer

O footer é **global** — aparece em todas as páginas, não exclusivo da home. Está implementado em `Footer.tsx` + `Footer.css`. A análise a seguir compara o design de referência com o que já existe.

### Estrutura Geral

**Elemento:** `<footer>`  
**Background:** `#1F2937` (`var(--dark-800)` — ligeiramente mais claro que o CTA `#111827`)  
**Padding:** `64px 24px 32px`  
**Cor base do texto:** `#CBD5E0`

> **Atenção:** o design usa `#1F2937` no footer e `#111827` no CTA newsletter. São dois tons diferentes de dark — o footer é mais suave. O `Footer.css` atual usa `var(--dark-900)` que é `#111827`. **Delta: ajustar `--dark-900` → `#1F2937` no footer, ou criar `--dark-800` no sistema de tokens.**

**Container interno:** maxWidth 1200px, margin `0 auto`

### Grid de 4 Colunas

**CSS:** `display: grid`, `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`, `gap: 40px`, `margin-bottom: 40px`

> O design usa `minmax(200px, 1fr)` e o `Footer.css` atual usa `minmax(256px, 1fr)`. O valor maior faz o grid colapsar para 2 colunas em telas intermediárias mais cedo. **Delta: ajustar para `minmax(200px, 1fr)` para fidelidade ao design.**

### Coluna 1 — Marca (Brand)

| Elemento | Estilo |
|----------|--------|
| h3 | DM Sans 700, `1.25rem`, branco, `mb: 16px` — "Marcelo Gonçalves" |
| p | `1rem`, lineHeight 1.6, `#CBD5E0` — "Inteligência Artificial, DevOps, Engenharia de Software e AWS." |
| Social row | `display: flex`, `gap: 16px`, `margin-top: 24px` |
| Cada ícone | `40×40px`, círculo (`border-radius: 50%`), bg `rgba(255,255,255,0.1)`, branco |
| Hover | `background: var(--accent)`, `translateY(-2px)` |
| Ícones | LinkedIn, GitHub, Twitter — SVG inline fill currentColor, `18×18px` |

**Componente existente:** implementado corretamente em `Footer.tsx`. Os `href="#"` precisam ser substituídos pelas URLs sociais reais quando disponíveis (backlog pendente de Marcelo).

### Coluna 2 — Categorias

| Elemento | Estilo |
|----------|--------|
| h3 | DM Sans 700, `1.25rem`, branco, mb 16 — "Categorias" |
| Links | flex column, `gap: 12px`, `1rem`, `#CBD5E0`, sem underline, `transition: color 0.2s` |
| Hover | `color: var(--accent)` |
| Items | Inteligência Artificial, Cloud Computing, DevOps e Automação, Segurança na Nuvem, Engenharia de Software, Notícias e Mercado |

**Componente existente:** implementado corretamente em `Footer.tsx`. O `Footer.css` usa `gap: 16px` nos links; o design usa `gap: 12px`. **Delta: ajustar `.op-footer-links` para `gap: 12px`.**

### Coluna 3 — Links Rápidos

| Elemento | Estilo |
|----------|--------|
| h3 | DM Sans 700, `1.25rem`, branco, mb 16 — "Links Rápidos" |
| Links | mesmo estilo da coluna Categorias |
| Items | Todos os Artigos, O Projeto, Serviços, Newsletter |

**Componente existente:** implementado corretamente em `Footer.tsx`. Sem deltas.

### Coluna 4 — Contato

| Elemento | Estilo |
|----------|--------|
| h3 | DM Sans 700, `1.25rem`, branco, mb 16 — "Contato" |
| Email link | `display: flex`, `align-items: center`, `gap: 8px`, `1rem`, `#CBD5E0`, sem underline |
| SVG | Envelope outline, `16×16px`, stroke currentColor |
| Texto | "contato@iadecifrada.com" (placeholder no design — substituir pelo email real) |

**Componente existente:** implementado corretamente em `Footer.tsx`. O email `contato@iadecifrada.com` é placeholder do prototype; substituir pelo email real de contato quando definido.

### Barra de Copyright

**CSS:** `padding-top: 32px`, `border-top: 1px solid rgba(255,255,255,0.15)`, `font-size: 0.875rem`, `text-align: center`, `color: #A0AEC0`

**Texto:** "© {ano} Marcelo Gonçalves. Todos os direitos reservados."

> O `Footer.css` atual usa `rgba(255,255,255,0.2)` no `border-top`; o design usa `0.15`. **Delta mínimo, baixa prioridade.**

### Comportamento Responsivo

**Mobile (padrão):** cada coluna centralizada (`align-items: center`, `text-align: center`), social icons centrados, email centrado.  
**Desktop (≥ 768px):** colunas alinhadas à esquerda (`align-items: flex-start`, `text-align: left`).

**Componente existente:** `Footer.css` já implementa esse comportamento corretamente.

### Resumo de Deltas do Footer

| Item | Atual | Design | Prioridade |
|------|-------|--------|-----------|
| Background | `var(--dark-900)` = `#111827` | `#1F2937` | Média |
| Grid minmax | `256px` | `200px` | Baixa |
| Gap links | `16px` | `12px` | Baixa |
| Border-top opacity | `0.2` | `0.15` | Baixa |
| URLs sociais | `href="#"` | URLs reais | Depende de Marcelo |
| Email contato | placeholder | email real | Depende de Marcelo |

---

## 5. PostCard — Especificação Detalhada

Usado nos dois grids de posts da coluna principal (2×2 cada).

| Elemento | Estilo |
|----------|--------|
| Wrapper `<article>` | white bg, `border-radius: 16px`, flex column, `height: 100%` |
| Shadow (repouso) | `0 4px 6px -1px rgba(0,0,0,0.05)` |
| Shadow (hover) | `0 10px 15px -3px rgba(0,0,0,0.1)` |
| Hover transform | `translateY(-4px)`, transition 0.2s |
| Imagem | `aspect-ratio: 16/10`, gradient placeholder ou ResponsiveImage |
| Corpo | flex column, `flex-grow: 1`, padding 24, gap 12 |
| h3 título | DM Sans 700, `1.25rem`, `#111827`, lineHeight 1.25 |
| p resumo | `0.9rem`, `#4B5563`, lineHeight 1.6, `-webkit-line-clamp: 2` |
| "Ler mais" | inline-flex, cor `#3B5F8A`, DM Sans 700, 1rem, `padding: 8px 0`, minHeight 44px, com `→` |

### Linha de meta — layout revisado

A linha de categoria, data e tempo de leitura ficam **todas na mesma linha horizontal**, com a CategoryBadge à esquerda e os metadados de data/leitura alinhados à direita via `justify-content: space-between`.

```
[ IA & Cloud ]                    📅 14 jan  ⏱ 12 min
```

| Elemento | Estilo |
|----------|--------|
| Container da linha | `display: flex`, `align-items: center`, `justify-content: space-between` |
| CategoryBadge (esquerda) | inline-flex, bg `#EBF1F8`, cor `#3B5F8A`, borda `rgba(59,95,138,0.2)`, border-radius 16px (pill), `0.75rem`, padding `4px 10px` |
| Meta group (direita) | `display: flex`, `align-items: center`, `gap: 10px`, `font-size: 0.75rem`, `color: #94A3B8` |
| Ícone data | `far fa-calendar-alt`, `color: #CBD5E1`, `margin-right: 3px` |
| Ícone leitura | `far fa-clock`, `color: #CBD5E1`, `margin-right: 3px` |

> **Impacto no `PostCard.tsx`:** o `<div>` de badge e o meta-row separado por `borderTop` que existe atualmente precisam ser unificados em um único `<div>` com `justify-content: space-between`. O `border-top: 1px solid #F1F5F9` entre corpo e "Ler mais" é removido desse nível — a separação visual agora é feita pelo próprio espaçamento do gap do flex column.

---

## 6. Componentes Existentes × Necessidade de Criação

### Sidebar da Home

| Widget Sidebar | Ordem | Componente Atual | Ação Necessária |
|----------------|-------|-----------------|-----------------|
| SvcCallout "Serviços" | 1º | `ServiceCallout.tsx` ✅ | Adaptar CSS: variante sidebar dark card (`#232F3E`), ícone box `64px` com bg `rgba(255,255,255,0.1)` |
| PopWidget "Mais Lidos" | 2º | `PopularPostsWidget.tsx` ✅ | Ajustar limite de 4 → 3 posts; confirmar `aspect-ratio: 21/9` no CSS |
| AdSense 300×600 | 3º | `AdsenseSidebar.tsx` ✅ | Atualizar `min-height` de 250px → **600px** |
| ProjetoWidget | 4º | ❌ não existe sidebar | **Criar** `ProjetoWidget.tsx` — componente estático pequeno |
| ~~NlWidget Newsletter~~ | ~~5º~~ | ~~`NewsletterWidget.tsx`~~ | **Removido** da sidebar — CTA de newsletter fica apenas na seção fullwidth no final da página |
| Sidebar wrapper | — | `BlogSidebar.tsx` ✅ | **Criar** `HomeSidebar.tsx` separado (composição diferente do sidebar de artigos) |

### Estrutura da Página Home

| Elemento | Situação Atual | Ação Necessária |
|----------|---------------|-----------------|
| Grid 2 colunas (`1fr 300px`) | ❌ seções fullwidth empilhadas | **Reestruturar** `page.tsx` e adicionar `.home-layout` em `home.css` |
| Posts grid (main) | 3 colunas `repeat(3,1fr)` | Trocar para `repeat(2,1fr)` dentro do `<main>` |
| Ad banner inline (×3) | 1 banner topo + 1 fundo | Primeiro banner alinhado com o topo da sidebar (sem margin-top no `<main>`); mais 2 como separadores |
| Seção "Mais Lidos" (fullwidth) | Seção própria | **Remover** — conteúdo migra para `PopularPostsWidget` na sidebar (3 posts) |
| "Super Destaque" / CTA final | `SuperDestaque.tsx` + seção `.cta` | Manter como seções fullwidth **após** o grid |
| Hero bg | `var(--bg-light-gradient)` | Ajustar para `linear-gradient(135deg,#F8FAFC,#F1F5F9)` em `home.css` |
| Hero h1 letter-spacing | Sem `letter-spacing` | Adicionar `letter-spacing: -0.03em` ao `.hero-title` |

### CTA Newsletter (seção fullwidth)

| Elemento | Situação Atual | Ação Necessária |
|----------|---------------|-----------------|
| Cor do parágrafo | `opacity: 0.9` via CSS | Trocar para `color: #94A3B8` explícito em `home.css` |
| Botão outline | `.btn-outline` ✅ | Confirmar hover: `background: white; color: #111827` no contexto dark |
| Componente | `NewsletterCTA.tsx` ✅ | Sem alterações estruturais |

### Footer

| Elemento | Situação Atual | Ação Necessária |
|----------|---------------|-----------------|
| Background | `var(--dark-900)` = `#111827` | Ajustar para `#1F2937` em `Footer.css` (ou criar token `--dark-800`) |
| Grid minmax | `minmax(256px, 1fr)` | Ajustar para `minmax(200px, 1fr)` |
| Gap dos links | `16px` | Ajustar para `12px` em `.op-footer-links` |
| Border-top copyright | `rgba(255,255,255,0.2)` | Ajustar para `rgba(255,255,255,0.15)` |
| URLs sociais | `href="#"` | Substituir pelas URLs reais (aguarda Marcelo) |
| Email contato | `contato@iadecifrada.com` | Substituir pelo email real quando definido |

---

## 7. Resumo das Diferenças: Atual × Design de Referência

| Aspecto | Atual | Design de Referência |
|---------|-------|---------------------|
| Layout | Seções fullwidth empilhadas | Grid 2 colunas (`1fr 300px`) + sidebar sticky |
| Grid de posts | 3 colunas (`repeat(3,1fr)`) | 2 colunas dentro do main (`repeat(2,1fr)`) |
| "Mais Lidos" | Seção fullwidth própria | Widget compacto dentro da sidebar |
| Categorias | Seção fullwidth própria | Dentro do main (3-col grid), sem fundo especial |
| Sidebar | Não existe na home | 4 widgets: SvcCallout → PopWidget → AdSense 300×600 → ProjetoWidget |
| Slots AdSense | 1 banner superior + 1 inferior | 3 inline no main (728×90) + 1 no sidebar (300×600) = 4 posições totais |
| Hero bg | `var(--bg-light-gradient)` | `linear-gradient(135deg,#F8FAFC,#F1F5F9)` |
| Hero h1 | 2.5rem / 3.5rem breakpoint | `2.8rem` com `letter-spacing: -0.03em` |
| Super Destaque | Seção no meio da página | Mantida como seção fullwidth no **final** do grid |
| PostCard meta row | Badge + meta separados por `borderTop` | **Unificar** em uma linha: badge à esquerda, data/leitura à direita (`justify-content: space-between`) |
| CTA Newsletter | `.cta` fullwidth ✅ | Mesma estrutura — ajustar cor do `<p>` e confirmar hover do botão outline |
| Footer bg | `var(--dark-900)` `#111827` | `#1F2937` (mais suave que o CTA) |
| Footer gap links | `16px` | `12px` |
| Mobile | Single col (posts 1fr) | Single col (sidebar colapsa abaixo do main) |

---

## 8. Considerações de Engenharia para a Implementação

### Estrutura do `page.tsx`
A home precisa do seguinte esqueleto:

```
<Hero />                          ← section fullwidth

<div class="home-layout">         ← grid 1fr 300px
  <main>
    <AdBanner />
    <"Últimos Artigos" + 2×2 PostCards>
    <AdBanner />
    <"Populares & Mais Lidos" + 2×2 PostCards>
    <AdBanner />
    <"Explore nossos Tópicos" + 3×N CategoryCards>
  </main>
  <HomeSidebar />                 ← aside sticky
</div>

<SuperDestaque />                 ← section fullwidth
<CTA Newsletter />                ← section fullwidth
```

### `HomeSidebar` vs. `BlogSidebar`
O `BlogSidebar.tsx` já existe e é usado nas páginas de artigo/categoria. Para a home, a ordem e composição são diferentes. Criar `HomeSidebar.tsx` como composição limpa:

```tsx
// HomeSidebar.tsx
<aside className="home-sidebar">
  <ServiceCallout />          {/* dark navy — CTA serviços */}
  <PopularPostsWidget />      {/* 3 posts, aspect-ratio 21/9 */}
  <AdsenseSidebar blockId="sidebar-300x600" />  {/* min-height: 600px */}
  <ProjetoWidget />           {/* light gradient — fecha a sidebar */}
</aside>
```

### CSS — `home.css`
A classe `.home-layout` (novo grid) deve viver em `home.css`. O breakpoint mobile deve colapsar para single column (`grid-template-columns: 1fr`) em `< 1024px`. Em tablet (768–1023px) o grid ainda colapsa — a sidebar de 300px funciona bem apenas a partir de ~1100px de largura total.

### Dados
- `recentPosts`: já buscado com `getRecentPosts()` — limitar a 4 no slice
- `popularPosts`: já buscado com `getPopularPosts()` — limitar a 4 no slice
- `PopularPostsWidget` busca seus próprios dados internamente (Server Component async) — não precisa de prop
- `ProjetoWidget` é estático (sem dados dinâmicos)
- `ServiceCallout` é estático

### Performance
- `HomeSidebar` pode ser marcada com `loading="lazy"` implícito via posicionamento — widgets abaixo do fold
- `PopularPostsWidget` já tem Suspense com skeleton — mantém sem CLS
- `AdsenseSidebar` já reserva espaço com `min-height` — mantém sem CLS
