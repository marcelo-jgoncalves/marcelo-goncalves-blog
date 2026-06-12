# ESPECIFICAÇÃO: Página de Artigos (Arquivo)

**Versão:** 1.0  
**Data:** 2026  
**Status:** Completo e pixel-perfeito  
**Arquivo:** `Artigos.html`

---

## SETUP E BOILERPLATE

- **Title:** `Artigos — Marcelo Gonçalves`
- **Nav link ativo:** "Artigos" (`href="#"`, `class="active"`)
- **Nav CTA:** `href="Serviços.html#contato"` — texto `Assessoria →`

1. [Setup e Boilerplate](#setup-e-boilerplate)
2. [Variáveis CSS](#variáveis-css)
3. [Reset e Base](#reset-e-base)
4. [Reading Progress Bar](#reading-progress-bar)
5. [Header/Nav](#headernav)
6. [Hero (2 colunas)](#hero-2-colunas)
7. [Hero · CTA O Projeto (card direito)](#hero--cta-o-projeto)
8. [Barra de Filtros (sticky)](#barra-de-filtros-sticky)
9. [Shell e Helpers de Seção](#shell-e-helpers-de-seção)
10. [Masthead — Artigo em Destaque](#masthead--artigo-em-destaque)
11. [Masthead — 2-up (mini cards)](#masthead--2-up-mini-cards)
12. [Grade Principal (post-cards)](#grade-principal-post-cards)
13. [Banda "Clássicos do Blog"](#banda-clássicos-do-blog)
14. [CTA Assessoria](#cta-assessoria)
15. [Footer](#footer)
16. [Ordem dos Blocos no Body](#ordem-dos-blocos-no-body)
17. [Conteúdo Completo (texto exato)](#conteúdo-completo-texto-exato)
18. [JavaScript / Comportamento](#javascript--comportamento)
19. [Responsividade Completa](#responsividade-completa)

---

## SETUP E BOILERPLATE

### Documento
- **Doctype:** `<!doctype html>`
- **Lang:** pt-BR
- **Charset:** utf-8
- **Title:** `Artigos — Marcelo Gonçalves`
- **Viewport:** `width=device-width, initial-scale=1`

### Fontes (Google Fonts)
- **Preconnect:** `https://fonts.googleapis.com` e `https://fonts.gstatic.com` (crossorigin)
- **Link:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap`
- **Famílias usadas:** Inter (400, 500, 600, 700, 800, 900) e JetBrains Mono (400, 500, 600)

---

## VARIÁVEIS CSS

Declaradas em `:root` — **idênticas** às demais páginas do sistema "IA Decifrada".

```css
--petrol:        #0F4C5C
--petrol-deep:   #08323D
--petrol-soft:   #5B8B96
--ink:           #0C2027
--slate:         #3C5A64
--steel:         #7E969E
--ivory:         #FAF8F3
--surface:       #FFFFFF
--sand:          #F0ECE2
--line:          #E4DDD0
--clay:          #C9603C
--clay-hover:    #A94C2D
--clay-soft:     #F3DDD0
--moss:          #3F6B47
--font:          'Inter', system-ui, sans-serif
--mono:          'JetBrains Mono', ui-monospace, monospace
```

---

## RESET E BASE

### Universal (`*`)
- **Box-sizing:** border-box
- **Margin:** 0
- **Padding:** 0

### HTML
- **Scroll-behavior:** smooth

### Body
- **Background:** var(--ivory)
- **Color:** var(--ink)
- **Font-family:** var(--font)
- **-webkit-font-smoothing:** antialiased
- **Text-rendering:** optimizeLegibility
- **Line-height:** 1.6

### Links (`a`)
- **Color:** inherit
- **Text-decoration:** none

### Seleção (`::selection`)
- **Background:** var(--clay-soft)
- **Color:** var(--clay-hover)

---

## READING PROGRESS BAR

### Container (`.progress`)
- **Position:** fixed
- **Top:** 0
- **Left:** 0
- **Height:** 3px
- **Width:** 0 (animado via JavaScript)
- **Z-index:** 60
- **Background:** linear-gradient(90deg, var(--petrol), var(--clay))
- **ID:** progress
- **HTML:** `<div class="progress" id="progress"></div>` — primeiro elemento do body

---

## HEADER/NAV

### Header Container (`header.nav`)
- **Position:** sticky
- **Top:** 0
- **Z-index:** 50
- **Background:** rgba(250,248,243, 0.88)
- **Backdrop-filter:** saturate(140%) blur(12px)
- **Border-bottom:** 1px solid var(--line)

### Nav Inner (`.nav-in`)
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 32px
- **Height:** 68px
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Gap:** 32px

### Brand (`.brand`)
- **Font-weight:** 800
- **Font-size:** 19px
- **Letter-spacing:** -0.02em
- **Color:** var(--ink)
- **Display:** flex
- **Align-items:** center
- **Href:** Home.html

#### Partes do Brand
- `.b2`: color var(--petrol)
- `.tick`: width 6px, height 6px, border-radius 50%, background var(--clay), margin 0 0 6px 4px, align-self flex-end

**Estrutura HTML:** `<span>Marcelo</span><span class="b2">Gonçalves</span><span class="tick"></span>`

### Menu (`nav.menu`)
- **Display:** flex
- **Gap:** 30px

#### Menu Links (`nav.menu a`)
- **Font-size:** 14.5px
- **Color:** var(--slate)
- **Font-weight:** 500
- **Transition:** color 0.2s

**Hover:** color var(--ink)

**Active (`.active`):** color var(--petrol), font-weight 600
- O link **"Artigos"** é o ativo nesta página (href="#").

**Itens (na ordem):** Home (Home.html) · Artigos (#, **active**) · O Projeto (O Projeto.html) · Serviços (Serviços.html) · Sobre (Sobre.html)

**Responsividade:** @media (max-width: 860px) → display: none

### CTA Button (`.nav-cta`)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 9px
- **Background:** var(--petrol)
- **Color:** #fff
- **Font-weight:** 600
- **Font-size:** 14px
- **Padding:** 11px 18px
- **Border-radius:** 10px
- **Transition:** background 0.2s, transform 0.15s
- **Href:** Serviços.html#contato

**Hover:** background var(--petrol-deep), transform translateY(-1px)

`.nav-cta .arrow`: font-family var(--mono)

**Conteúdo:** "Assessoria →" (a seta `→` está em `<span class="arrow">`)

---

## HERO (2 COLUNAS)

### Container (`.hero`)
- **Background:** var(--petrol-deep)
- **Color:** var(--ivory)
- **Position:** relative
- **Isolation:** isolate
- **data-screen-label:** "Hero Artigos"

#### ::before (Overlay decorativo)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.55
- **Background (4 camadas, nesta ordem):**
  1. radial-gradient(52% 80% at 100% 0%, rgba(201,96,60,0.3), transparent 55%)
  2. radial-gradient(42% 60% at 0% 100%, rgba(91,139,150,0.2), transparent 60%)
  3. linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 100% 80px
  4. linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 80px 100%
- **Mask (webkit + standard):** radial-gradient(ellipse at 55% 25%, #000 28%, transparent 80%)

### Inner (`.hero-in`)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 88px 40px 76px
- **Display:** grid
- **Grid-template-columns:** 1.08fr 0.92fr
- **Gap:** 60px
- **Align-items:** center

### Coluna Esquerda (`.hero-left`)
- **Display:** flex
- **Flex-direction:** column
- **Align-items:** flex-start
- **Text-align:** left

#### Eyebrow (`.ey`)
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.65)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 22px

##### `.ey::before`
- **Content:** ""
- **Width:** 30px
- **Height:** 1px
- **Background:** var(--clay)
- (NOTA: apenas `::before`, sem `::after` — diferente do eyebrow centralizado das outras páginas)

**Conteúdo:** "Arquivo · Todos os artigos"

#### H1 (`.hero h1`)
- **Font-weight:** 800
- **Font-size:** clamp(2.3rem, 4vw, 3.3rem)
- **Line-height:** 1.05
- **Letter-spacing:** -0.04em
- **Color:** #fff
- **Max-width:** 560px
- **Text-wrap:** balance
- **Margin-bottom:** 18px

##### `.hero h1 em`
- **Font-style:** italic
- **Color:** var(--petrol-soft)

**Conteúdo:** "Tudo que escrevi, reunido *num só lugar*" — onde "num só lugar" está em `<em>`

#### Subtitle (`.hero .sub`)
- **Font-size:** 1.075rem
- **Line-height:** 1.65
- **Color:** rgba(250,248,243,0.64)
- **Max-width:** 500px
- **Margin-bottom:** 30px

**Conteúdo:** "Tutoriais, bastidores e decisões reais de um blog construído do zero na AWS — quase 100% com IA. Busque, filtre e vá fundo."

#### Search (apenas visual — NÃO funcional) (`.search`)
- **Width:** 100%
- **Max-width:** 520px
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Background:** rgba(255,255,255,0.06)
- **Border:** 1px solid rgba(255,255,255,0.16)
- **Border-radius:** 14px
- **Padding:** 0 16px
- **Height:** 58px
- **Backdrop-filter:** blur(4px)
- **Transition:** border-color 0.2s, background 0.2s

**`.search:focus-within`:** border-color rgba(201,96,60,0.45), background rgba(255,255,255,0.09)

##### `.search svg` (ícone de lupa)
- **Flex:** none
- **Width:** 20px
- **Height:** 20px
- **Color:** rgba(255,255,255,0.5)
- **SVG:** viewBox 0 0 24 24, fill none, stroke currentColor, stroke-width 2, stroke-linecap round, stroke-linejoin round
- **Paths:** `<circle cx="11" cy="11" r="7"/>` + `<path d="m21 21-4.3-4.3"/>`

##### `.search input`
- **Flex:** 1
- **Background:** none
- **Border:** none
- **Outline:** none
- **Color:** #fff
- **Font-family:** var(--font)
- **Font-size:** 15.5px
- **Letter-spacing:** -0.005em
- **Type:** text
- **aria-label:** "Buscar artigos"
- **Placeholder:** "Buscar por título, tema ou tecnologia…"
- **`::placeholder`:** color rgba(255,255,255,0.46)

##### `.search .kbd` (atalho)
- **Flex:** none
- **Font-family:** var(--mono)
- **Font-size:** 10.5px
- **Letter-spacing:** 0.04em
- **Color:** rgba(255,255,255,0.5)
- **Background:** rgba(255,255,255,0.07)
- **Border:** 1px solid rgba(255,255,255,0.14)
- **Padding:** 5px 9px
- **Border-radius:** 7px
- **Conteúdo:** "⌘K"

#### Hero Stats (`.hero-stats`)
- **Display:** flex
- **Gap:** 24px
- **Margin-top:** 26px
- **Flex-wrap:** wrap
- **Justify-content:** flex-start
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Letter-spacing:** 0.1em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.5)

##### `.hero-stats span`
- **Display:** flex
- **Align-items:** center
- **Gap:** 9px

##### `.hero-stats b`
- **Color:** #fff
- **Font-weight:** 700
- **Font-size:** 13px

##### `.hero-stats .pipe` (divisor)
- **Width:** 1px
- **Height:** 14px
- **Background:** rgba(255,255,255,0.18)

**Conteúdo (3 itens separados por 2 `.pipe`):**
1. "**52** artigos" (52 em `<b>`)
2. "**4** categorias" (4 em `<b>`)
3. "Atualizado **semanalmente**" (semanalmente em `<b>`)

---

## HERO · CTA O PROJETO

Card que ocupa a **coluna direita** da hero.

### Wrapper (`.hero-right`)
- **Display:** flex
- **Align-items:** stretch

### Card (`.proj-card`)
- **Tag:** `<a>` (link clicável inteiro)
- **Href:** O Projeto.html
- **data-screen-label:** "CTA O Projeto"
- **Position:** relative
- **Flex:** 1
- **Background:** rgba(255,255,255,0.05)
- **Border:** 1px solid rgba(255,255,255,0.14)
- **Border-radius:** 20px
- **Padding:** 32px 34px
- **Overflow:** hidden
- **Isolation:** isolate
- **Backdrop-filter:** blur(4px)
- **Box-shadow:** 0 30px 70px -30px rgba(0,0,0,0.6)
- **Display:** flex
- **Flex-direction:** column
- **Transition:** transform 0.2s, box-shadow 0.2s

**Hover (`.proj-card:hover`):** transform translateY(-3px), box-shadow 0 40px 80px -32px rgba(0,0,0,0.7)

#### ::before (Overlay decorativo)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.5
- **Background (3 camadas):**
  1. radial-gradient(62% 70% at 88% 8%, rgba(201,96,60,0.34), transparent 58%)
  2. linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 100% 48px
  3. linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 48px 100%
- **Mask (webkit + standard):** radial-gradient(ellipse at 78% 14%, #000 30%, transparent 82%)

#### Conteúdo acima do overlay
- `.proj-card > *`: position relative, z-index 1

#### Label (`.proj-label`)
- **Font-family:** var(--mono)
- **Font-size:** 10.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.6)
- **Display:** flex
- **Align-items:** center
- **Gap:** 9px
- **Margin-bottom:** 20px

##### `.proj-label .dot`
- **Width:** 7px
- **Height:** 7px
- **Border-radius:** 50%
- **Background:** var(--moss)
- **Box-shadow:** 0 0 0 3px rgba(63,107,71,0.25)
- **Animation:** pulse 2.4s ease-in-out infinite

**Conteúdo:** "Construído em público" (com `.dot` à esquerda)

#### Keyframes `pulse` (compartilhado)
```css
@keyframes pulse{
  0%,100%{box-shadow:0 0 0 3px rgba(63,107,71,.3)}
  50%{box-shadow:0 0 0 5px rgba(63,107,71,.12)}
}
```

#### H2 (`.proj-card h2`)
- **Font-weight:** 800
- **Font-size:** 1.5rem
- **Letter-spacing:** -0.03em
- **Color:** #fff
- **Line-height:** 1.18
- **Margin-bottom:** 10px

##### `.proj-card h2 em`
- **Font-style:** italic
- **Color:** var(--petrol-soft)

**Conteúdo:** "Veja como este blog foi *construído*" — "construído" em `<em>`

#### Subtexto (`.proj-card .pc-sub`)
- **Font-size:** 14.5px
- **Line-height:** 1.6
- **Color:** rgba(250,248,243,0.64)
- **Margin-bottom:** 22px
- **Max-width:** 320px

**Conteúdo:** "Da infra serverless ao deploy — cada decisão documentada e os custos expostos, quase tudo com IA."

#### Stats Row (`.proj-stats`)
- **Display:** flex
- **Margin-bottom:** 24px
- **Border-top:** 1px solid rgba(255,255,255,0.1)
- **Border-bottom:** 1px solid rgba(255,255,255,0.1)

##### Stat (`.proj-stat`)
- **Flex:** 1
- **Padding:** 16px 0
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 4px
- **Border-right:** 1px solid rgba(255,255,255,0.08)
- **`.proj-stat:not(:first-child)`:** padding-left 18px
- **`.proj-stat:last-child`:** border-right none

###### Valor (`.proj-stat .v`)
- **Font-weight:** 800
- **Font-size:** 1.35rem
- **Letter-spacing:** -0.03em
- **Color:** #fff
- **Line-height:** 1
- **`.v.clay`:** color var(--clay)

###### Label (`.proj-stat .l`)
- **Font-family:** var(--mono)
- **Font-size:** 9px
- **Letter-spacing:** 0.1em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.48)

**Conteúdo (3 stats):**
| Valor | Classe valor | Label |
|-------|--------------|-------|
| ~100% | `v clay` | Com IA |
| 100% | `v` | Serverless |
| 12 mo | `v` | Em produção |

#### Botão (`.proj-btn`)
- **Tag:** `<span>` (o card inteiro já é `<a>`)
- **Margin-top:** auto
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Gap:** 10px
- **Width:** 100%
- **Background:** var(--clay)
- **Color:** #fff
- **Height:** 54px
- **Border-radius:** 13px
- **Font-weight:** 600
- **Font-size:** 15px
- **Box-shadow:** 0 12px 26px -8px rgba(201,96,60,0.55)
- **Transition:** background 0.2s, transform 0.2s
- **`.proj-card:hover .proj-btn`:** background var(--clay-hover)
- **`.proj-btn .arrow`:** font-family var(--mono)

**Conteúdo:** "Conhecer O Projeto →" (seta em `<span class="arrow">`)

---

## BARRA DE FILTROS (STICKY)

### Container (`.filterbar`)
- **Position:** sticky
- **Top:** 68px (gruda logo abaixo da nav de 68px)
- **Z-index:** 40
- **Background:** rgba(250,248,243, 0.9)
- **Backdrop-filter:** saturate(140%) blur(12px)
- **Border-bottom:** 1px solid var(--line)
- **data-screen-label:** "Filtros"
- **NOTA:** elemento `<div>`, NÃO `<section>`

### Inner (`.filterbar-in`)
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 14px 40px
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Gap:** 20px

### Chips (`.chips`)
- **Display:** flex
- **Gap:** 8px
- **Flex-wrap:** wrap
- **ID:** chips

#### Chip (`.chip`)
- **Tag:** `<button>`
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Letter-spacing:** 0.1em
- **Text-transform:** uppercase
- **Padding:** 8px 14px
- **Border-radius:** 999px
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Color:** var(--slate)
- **Cursor:** pointer
- **Transition:** all 0.18s
- **White-space:** nowrap
- **Font-weight:** 500

**Hover:** border-color var(--petrol-soft), color var(--petrol)

**Active (`.chip.active`):** background var(--petrol), border-color var(--petrol), color #fff

**Chips (na ordem) — `data-filter` / texto:**
| data-filter | Texto | Estado inicial |
|-------------|-------|----------------|
| all | Todos | **active** |
| ia | Inteligência Artificial | — |
| devops | DevOps | — |
| cloud | Cloud · AWS | — |
| eng | Engenharia | — |
| bastidores | Bastidores | — |

### Lado Direito (`.filter-right`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 16px
- **Flex:** none

#### Contador (`.result-count`)
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Letter-spacing:** 0.06em
- **Color:** var(--steel)
- **White-space:** nowrap
- **ID:** count
- **`.result-count b`:** color var(--petrol), font-weight 600
- **Conteúdo inicial:** "**12** de 52 artigos" (12 em `<b>`)
- **Responsividade:** @media (max-width: 980px) → display none

#### Sort (`.sort`)
- **Position:** relative
- **Display:** flex
- **Align-items:** center

##### `.sort select`
- **Appearance:** none
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Letter-spacing:** 0.06em
- **Color:** var(--slate)
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Border-radius:** 9px
- **Padding:** 9px 32px 9px 14px
- **Cursor:** pointer
- **Transition:** border-color 0.2s
- **Hover:** border-color var(--petrol-soft)
- **aria-label:** "Ordenar artigos"
- **Opções (apenas visuais):** "Mais recentes", "Mais lidos", "A–Z"

##### `.sort svg` (chevron)
- **Position:** absolute
- **Right:** 11px
- **Width:** 13px
- **Height:** 13px
- **Color:** var(--steel)
- **Pointer-events:** none
- **SVG:** viewBox 0 0 24 24, fill none, stroke currentColor, stroke-width 2.4, linecap/linejoin round, path `d="m6 9 6 6 6-6"`

### Responsividade Filtros
- **@media (max-width: 680px):**
  - `.filterbar-in`: flex-direction column, align-items flex-start, gap 12px
  - `.chips`: overflow-x auto, flex-wrap nowrap, width 100%, -webkit-overflow-scrolling touch, padding-bottom 2px

---

## SHELL E HELPERS DE SEÇÃO

### Wrap (`.wrap`)
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px

### Section (`.section`)
- **Padding:** 72px 0

### Cabeçalho de Seção (`.sec-head-row`)
- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 24px
- **Margin-bottom:** 34px
- **Flex-wrap:** wrap

#### Eyebrow (`.sec-ey`)
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** var(--clay)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 14px
- **`.sec-ey::before`:** content "", width 30px, height 1px, background var(--clay)

#### Título (`.sec-t`)
- **Font-weight:** 800
- **Font-size:** clamp(1.6rem, 2.6vw, 2.1rem)
- **Letter-spacing:** -0.035em
- **Color:** var(--ink)
- **Line-height:** 1.1

#### Link de Seção (`.sec-link`)
- **Font-family:** var(--font)
- **Font-weight:** 600
- **Font-size:** 14px
- **Color:** var(--petrol)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 7px
- **Flex:** none
- **Border-bottom:** 1px solid rgba(15,76,92,0.25)
- **Padding-bottom:** 2px
- **Transition:** gap 0.2s, border-color 0.2s
- **Hover:** gap 11px, border-color var(--petrol)

---

## MASTHEAD — ARTIGO EM DESTAQUE

### Container (`.masthead`)
- **Classes:** `wrap masthead`
- **Padding-top:** 60px (regra `.masthead{padding-top:60px}`)
- **data-screen-label:** "Destaque"

### Card Feature (`.feature`)
- **Tag:** `<article>`
- **Display:** grid
- **Grid-template-columns:** 1.18fr 1fr
- **Gap:** 0
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Border-radius:** 20px
- **Overflow:** hidden
- **Box-shadow:** 0 4px 14px rgba(12,32,39,0.05)
- **Transition:** transform 0.22s, box-shadow 0.22s
- **Hover:** transform translateY(-3px), box-shadow 0 22px 46px -22px rgba(12,32,39,0.22)

#### Cover (`.feature .f-cover`)
- **Tag:** `<a>` (href: Pagina de Postagem.html, aria-label "Abrir artigo em destaque")
- **Position:** relative
- **Min-height:** 380px
- **Overflow:** hidden
- **Background:** linear-gradient(145deg, #0F4C5C 0%, #08323D 60%, #0C2027 100%)
- **Display:** flex
- **Align-items:** flex-end
- **Padding:** 24px

##### `.f-cover::before` (overlay decorativo)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Opacity:** 0.55
- **Background (3 camadas):**
  1. radial-gradient(70% 80% at 78% 16%, rgba(201,96,60,0.4), transparent 55%)
  2. linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 100% 52px
  3. linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 52px 100%
- **Mask (webkit):** radial-gradient(ellipse at 70% 35%, #000 30%, transparent 82%)

##### Badge (`.f-badge`)
- **Position:** absolute
- **Top:** 20px
- **Left:** 24px
- **Z-index:** 1
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 8px
- **Background:** var(--clay)
- **Color:** #fff
- **Font-family:** var(--mono)
- **Font-size:** 10px
- **Font-weight:** 500
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Padding:** 7px 14px
- **Border-radius:** 999px
- **Box-shadow:** 0 6px 16px rgba(201,96,60,0.4)
- **Conteúdo:** "★ Em destaque"

##### Slot (`.f-cover .slot`)
- **Position:** relative
- **Z-index:** 1
- **Font-family:** var(--mono)
- **Font-size:** 10.5px
- **Letter-spacing:** 0.18em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.55)
- **Display:** flex
- **Align-items:** center
- **Gap:** 10px
- **`.slot::before`:** content "", width 22px, height 1px, background rgba(255,255,255,0.4)
- **Conteúdo:** "imagem de capa · 720×760"

#### Body (`.feature .f-body`)
- **Padding:** 42px 44px
- **Display:** flex
- **Flex-direction:** column
- **Justify-content:** center

##### Categoria (`.f-cat`)
- **Font-family:** var(--mono)
- **Font-size:** 10px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** var(--clay)
- **Margin-bottom:** 16px
- **Conteúdo:** "Tutoriais · Inteligência Artificial"

##### H2 (`.f-body h2`)
- **Font-weight:** 800
- **Font-size:** clamp(1.7rem, 2.5vw, 2.15rem)
- **Line-height:** 1.14
- **Letter-spacing:** -0.03em
- **Color:** var(--ink)
- **Text-wrap:** balance
- **Margin-bottom:** 16px
- **Conteúdo:** "Como construir prompts poderosos para IAs como GPT ou Gemini"

##### Parágrafo (`.f-body p`)
- **Font-size:** 1.0625rem
- **Line-height:** 1.65
- **Color:** var(--slate)
- **Margin-bottom:** 28px
- **Max-width:** 440px
- **Conteúdo:** "Um bom prompt não é uma pergunta — é uma instrução estratégica. O método de quatro princípios para extrair respostas precisas, no formato certo, todas as vezes."

##### Rodapé (`.f-foot`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 16px

###### Avatar (`.f-avatar`)
- **Width:** 42px
- **Height:** 42px
- **Border-radius:** 50%
- **Flex:** none
- **Background:** linear-gradient(150deg, var(--petrol-soft), var(--petrol))
- **Color:** #fff
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Font-weight:** 700
- **Font-size:** 14px
- **Box-shadow:** 0 0 0 3px var(--surface), 0 0 0 4px var(--line)
- **Conteúdo:** "MG"

###### Who (`.f-who`)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 2px
- **`.f-who .n`:** font-weight 700, font-size 14px, color var(--ink), letter-spacing -0.01em → "Marcelo Gonçalves"
- **`.f-who .m`:** font-family var(--mono), font-size 11px, letter-spacing 0.04em, color var(--steel) → "07 DEZ 2025 · 5 min"

###### Read Link (`.f-read`)
- **Tag:** `<a>` (href: Pagina de Postagem.html)
- **Margin-left:** auto
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 8px
- **Font-weight:** 700
- **Font-size:** 14px
- **Color:** var(--petrol)
- **Font-family:** var(--mono)
- **Transition:** gap 0.2s, color 0.2s
- **`.feature:hover .f-read`:** gap 12px, color var(--clay)
- **Conteúdo:** "Ler artigo →"

### Responsividade Feature
- **@media (max-width: 900px):** `.feature` grid-template-columns 1fr; `.feature .f-cover` min-height 220px

---

## MASTHEAD — 2-UP (MINI CARDS)

### Container (`.twoup`)
- **Display:** grid
- **Grid-template-columns:** 1fr 1fr
- **Gap:** 22px
- **Margin-top:** 22px

### Mini Card (`.mini`)
- **Tag:** `<a>` (href: "#")
- **Display:** grid
- **Grid-template-columns:** 150px 1fr
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Border-radius:** 16px
- **Overflow:** hidden
- **Transition:** transform 0.2s, box-shadow 0.2s
- **Hover:** transform translateY(-3px), box-shadow 0 16px 34px -18px rgba(12,32,39,0.2)

#### Cover (`.mini .m-cover`)
- **Position:** relative
- **Overflow:** hidden
- **Variante `.t-soft`:** background linear-gradient(150deg, #5B8B96, #0F4C5C)
- **Variante `.t-clay`:** background linear-gradient(150deg, #C9603C, #A94C2D)
- **`.m-cover::after`:** content "", position absolute, inset 0, opacity 0.5, background = grid 36px (2 linear-gradients rgba(255,255,255,0.05) 1px, espaçamento 36px horizontal e vertical)

#### Body (`.mini .m-body`)
- **Padding:** 22px 24px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 9px

##### Categoria (`.m-cat`)
- **Font-family:** var(--mono)
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** var(--clay)

##### Título (`.m-title`)
- **Font-weight:** 800
- **Font-size:** 1.12rem
- **Line-height:** 1.24
- **Letter-spacing:** -0.02em
- **Color:** var(--petrol)

##### Rodapé (`.m-foot`)
- **Margin-top:** auto
- **Font-family:** var(--mono)
- **Font-size:** 10.5px
- **Letter-spacing:** 0.04em
- **Color:** var(--steel)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Padding-top:** 12px
- **Border-top:** 1px solid var(--line)
- **`.m-foot .more`:** font-family var(--font), font-weight 700, font-size 12.5px, color var(--petrol)

**Conteúdo (2 mini cards):**
| Cover | Categoria | Título | Rodapé (data · tempo) | More |
|-------|-----------|--------|------------------------|------|
| t-soft | DevOps | CI/CD na AWS sem clicar no console | 28 NOV 2025 · 8 min | Ler → |
| t-clay | Bastidores | O que a IA quebrou (e o que ela acelerou) | 21 NOV 2025 · 7 min | Ler → |

### Responsividade 2-up
- **@media (max-width: 900px):** `.twoup` grid-template-columns 1fr
- **@media (max-width: 480px):** `.mini` grid-template-columns 1fr; `.mini .m-cover` min-height 140px

---

## GRADE PRINCIPAL (POST-CARDS)

A grade aparece em **duas seções separadas** (1ª metade e 2ª metade), com a banda "Clássicos do Blog" entre elas. Ambas usam `.posts-grid.art-grid`.

### Grade Container (`.posts-grid`)
- **Display:** grid
- **Grid-template-columns:** repeat(3, 1fr)
- **Gap:** 22px
- **Classe adicional:** `art-grid` (usada pelo JS de filtro — ver seção JavaScript)
- **IDs:** primeira grade = `grid`; segunda grade = `grid2`

### Post Card (`.post-card`)
- **Tag:** `<article>`
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Border-radius:** 14px
- **Overflow:** hidden
- **Display:** flex
- **Flex-direction:** column
- **Box-shadow:** 0 2px 4px rgba(12,32,39,0.03)
- **Transition:** transform 0.2s, box-shadow 0.2s, opacity 0.25s
- **Hover:** transform translateY(-3px), box-shadow 0 14px 30px rgba(12,32,39,0.09)
- **Atributo de filtro:** `data-cat="<tokens separados por espaço>"` (ver tabela de conteúdo)
- **Estado oculto:** `.post-card.is-hidden { display: none }` (aplicado pelo JS)

#### Imagem (`.post-card .pc-img`)
- **Tag:** `<a>` (href varia)
- **Aspect-ratio:** 16/10
- **Position:** relative
- **Display:** flex
- **Align-items:** flex-end
- **Padding:** 14px

##### Variantes de gradiente (escolher 1 por card)
- **.t-petrol:** linear-gradient(150deg, #0F4C5C 0%, #08323D 100%)
- **.t-soft:** linear-gradient(150deg, #5B8B96 0%, #0F4C5C 100%)
- **.t-clay:** linear-gradient(150deg, #C9603C 0%, #A94C2D 100%)
- **.t-deep:** linear-gradient(150deg, #08323D 0%, #0C2027 100%)
- **.t-moss:** linear-gradient(150deg, #3F6B47 0%, #0F4C5C 100%)
- **.t-teal:** linear-gradient(150deg, #3A7A88 0%, #0F4C5C 100%)

##### `.pc-img::before` (textura grid 40px)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Background:** CSS exato abaixo — duas camadas de linear-gradient formando grade:
  ```css
  background:
    linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px) 0 0/100% 40px,
    linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px) 0 0/40px 100%;
  ```
- **Opacity:** 0.5

##### `.pc-img::after` (escurecimento inferior)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Background:** linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.18))
- **Pointer-events:** none

##### Tag (`.pc-img .tag`)
- **Position:** relative
- **Z-index:** 1
- **Background:** var(--ivory)
- **Border-radius:** 999px
- **Padding:** 5px 12px
- **Font-weight:** 600
- **Font-size:** 11.5px
- **Color:** var(--petrol)
- **Box-shadow:** 0 2px 8px rgba(0,0,0,0.14)

#### Body (`.post-card .pc-body`)
- **Padding:** 20px 22px 14px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 9px
- **Flex:** 1

##### Categoria (`.pc-cat`)
- **Font-family:** var(--mono)
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** var(--clay)

##### Título (`.pc-title`)
- **Font-weight:** 800
- **Font-size:** 17.5px
- **Letter-spacing:** -0.02em
- **Color:** var(--petrol)
- **Line-height:** 1.22
- **Clamp:** -webkit-box, -webkit-line-clamp 2, -webkit-box-orient vertical, overflow hidden

##### Excerpt (`.pc-excerpt`)
- **Font-size:** 13.5px
- **Line-height:** 1.6
- **Color:** var(--slate)
- **Flex:** 1
- **Clamp:** -webkit-box, -webkit-line-clamp 3, -webkit-box-orient vertical, overflow hidden

#### Rodapé (`.post-card .pc-foot`)
- **Margin-top:** auto
- **Padding:** 12px 22px 16px
- **Border-top:** 1px solid var(--line)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Color:** var(--steel)
- **Letter-spacing:** 0.04em
- **`.pc-foot .more`:** font-family var(--font), font-weight 700, font-size 13px, color var(--petrol) → "Ler →"

### Estado Vazio (`.empty`)
- **Display:** none (default); `.empty.show` → display block
- **Text-align:** center
- **Padding:** 60px 0
- **Color:** var(--steel)
- **ID:** empty
- **Posição:** dentro da 2ª seção de grade, após `#grid2`
- **`.empty .e-t`:** font-weight 700, font-size 1.1rem, color var(--slate), margin-bottom 6px → "Nenhum artigo nesta categoria ainda"
- **`.empty .e-s`:** font-family var(--mono), font-size 12px, letter-spacing 0.04em → "Tente outro filtro — ou volte para "Todos"."

### Load More (`.load-wrap`)
- **Display:** flex
- **Justify-content:** center
- **Margin-top:** 48px
- **Posição:** dentro da 2ª seção de grade, após `.empty`

#### Botão (`.btn-outline-petrol`)
- **Tag:** `<button type="button">`
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 10px
- **Font-weight:** 600
- **Font-size:** 15px
- **Color:** var(--petrol)
- **Border:** 1.5px solid rgba(15,76,92,0.35)
- **Padding:** 14px 28px
- **Border-radius:** 12px
- **Background:** transparent
- **Cursor:** pointer
- **Font-family:** var(--font)
- **Transition:** background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s
- **Hover:** background var(--petrol), color #fff, border-color var(--petrol), transform translateY(-1px)
- **`.btn-outline-petrol .arrow`:** font-family var(--mono)
- **Conteúdo:** "Carregar mais artigos ↓" (seta `↓` em `<span class="arrow">`)

### Estrutura das 2 seções de grade

**1ª seção** (`<section class="wrap section" style="padding-top:64px" data-screen-label="Grade de Artigos">`):
- Contém `.sec-head-row` (eyebrow "O arquivo" + `.sec-t#gridTitle` "Todos os artigos" + `.sec-link` "Ver índice por ano →")
- Em seguida `.posts-grid.art-grid#grid` com **6 post-cards** (1ª metade)

**2ª seção** (`<section class="wrap section" style="padding-top:64px;padding-bottom:80px" data-screen-label="Grade de Artigos — Continuação">`):
- `.posts-grid.art-grid#grid2` com **6 post-cards** (2ª metade)
- `.empty#empty`
- `.load-wrap` com o botão "Carregar mais artigos"

### Conteúdo dos 12 Post-Cards

**Grade #grid (1ª metade — 6 cards):**

| # | data-cat | Variante img | Tag (pill) | pc-cat | Título | Excerpt | Data | Href |
|---|----------|--------------|------------|--------|--------|---------|------|------|
| 1 | `eng bastidores` | t-soft | Engenharia | Bastidores | Dashboard público: expondo métricas reais do blog | Tráfego, custo AWS e receita — ao vivo, visíveis para qualquer visitante. Como construí o painel e por que a transparência radical importa. | 01 FEV 2026 | # |
| 2 | `devops eng` | t-petrol | DevOps | Engenharia | Refatorando a stack depois do primeiro trimestre | O que mudei após três meses em produção: o que estava certo, o que estava errado, e o que faria diferente hoje. | 25 JAN 2026 | # |
| 3 | `bastidores` | t-clay | Bastidores | Monetização | Três meses de AdSense: o que realmente rendeu | Números reais de receita após 90 dias. Posicionamento dos blocos, impacto na leitura e se valeu a pena. | 18 JAN 2026 | # |
| 4 | `cloud bastidores` | t-teal | Infraestrutura | Bastidores | Como automatizei o envio de newsletter com Amazon SES | Da escolha do SES à automação completa: templates, segmentação e rastreamento de abertura sem plataforma de terceiros. | 11 JAN 2026 | # |
| 5 | `eng` | t-deep | Engenharia | Engenharia | O sistema de comentários que construí do zero | Por que decidi não usar Disqus ou Utterances. A arquitetura de um sistema simples, com moderação e sem dependência externa. | 04 JAN 2026 | # |
| 6 | `cloud` | t-moss | Cloud · AWS | Infraestrutura | Monitoramento sem gastar: CloudWatch e alertas no Free Tier | Como configurar alertas de custo, performance e disponibilidade sem sair do tier gratuito da AWS. Tudo em código. | 21 DEZ 2025 | # |

**Grade #grid2 (2ª metade — 6 cards):**

| # | data-cat | Variante img | Tag (pill) | pc-cat | Título | Excerpt | Data | Href |
|---|----------|--------------|------------|--------|--------|---------|------|------|
| 7 | `ia` | t-clay | Inteligência Artificial | Tutoriais · IA | Engenharia de prompts: do hype ao método repetível | Clareza, formato, contexto e iteração. Como transformar pedidos vagos em respostas precisas e reutilizáveis em produção. | 07 DEZ 2025 | Pagina de Postagem.html |
| 8 | `cloud devops` | t-petrol | Cloud · AWS | Infraestrutura | Serverless de verdade: Lambda + API Gateway + DynamoDB | A arquitetura que roda este blog com custo quase zero quando ocioso — e escala sem eu tocar em nada. | 30 NOV 2025 | # |
| 9 | `ia bastidores` | t-soft | Inteligência Artificial | Bastidores | Escrevi 50 artigos com IA: o que funcionou e o que não | Onde delegar para o modelo compensou, onde custou caro, e o fluxo de revisão que mantém a voz humana. | 23 NOV 2025 | # |
| 10 | `devops eng` | t-deep | DevOps | Engenharia | Terraform na prática: infra versionada e auditável | Como organizo módulos, state remoto e o pipeline que aplica mudanças com revisão obrigatória antes do deploy. | 16 NOV 2025 | # |
| 11 | `cloud bastidores` | t-moss | Cloud · AWS | Bastidores | Os primeiros 30 dias e os custos reais na AWS | Quanto custou de verdade rodar tudo no primeiro mês — fatura aberta, linha a linha, sem maquiagem. | 14 DEZ 2025 | # |
| 12 | `eng ia` | t-teal | Engenharia | Tutoriais | Busca semântica caseira com embeddings na AWS | Indexei todos os artigos com embeddings e montei uma busca por significado — barata, rápida e sem serviço externo. | 05 DEZ 2025 | # |

---

## BANDA "CLÁSSICOS DO BLOG"

Seção escura intercalada **entre** a 1ª e a 2ª grade de artigos.

### Container (`.readband`)
- **Tag:** `<section>`
- **Background:** var(--petrol)
- **Color:** var(--ivory)
- **Position:** relative
- **Overflow:** hidden
- **Isolation:** isolate
- **Padding:** 80px 0
- **data-screen-label:** "Mais Lidos"

#### ::before (overlay decorativo)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.55
- **Background (4 camadas):**
  1. radial-gradient(50% 65% at 100% 0%, rgba(201,96,60,0.3), transparent 55%)
  2. radial-gradient(42% 55% at 0% 100%, rgba(91,139,150,0.22), transparent 60%)
  3. linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 100% 76px
  4. linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 76px 100%
- **Mask (webkit + standard):** radial-gradient(ellipse at 55% 30%, #000 28%, transparent 78%)

#### Inner
- `.readband .wrap`: position relative, z-index 1 (usa o `.wrap` padrão: max-width 1240px, padding 0 40px)

### Cabeçalho (`.rb-head`)
- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 24px
- **Margin-bottom:** 40px
- **Flex-wrap:** wrap

#### Eyebrow (`.rb-ey`)
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.65)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 14px
- **`.rb-ey::before`:** content "", width 30px, height 1px, background var(--clay)
- **Conteúdo:** "Mais lidos de sempre"

#### Título (`.rb-title`)
- **Font-weight:** 800
- **Font-size:** clamp(1.6rem, 2.6vw, 2.1rem)
- **Letter-spacing:** -0.035em
- **Color:** #fff
- **Line-height:** 1.1
- **Conteúdo:** "Os clássicos do blog"

#### Link (`.rb-link`)
- **Tag:** `<a>` (href "#")
- **Font-weight:** 600
- **Font-size:** 14px
- **Color:** rgba(255,255,255,0.8)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 7px
- **Flex:** none
- **Border-bottom:** 1px solid rgba(255,255,255,0.25)
- **Padding-bottom:** 2px
- **Transition:** gap 0.2s, color 0.2s, border-color 0.2s
- **Hover:** gap 11px, color #fff, border-color rgba(255,255,255,0.5)
- **Conteúdo:** "Ver ranking completo →"

### Lista (`.rb-list`)
- **Display:** grid
- **Grid-template-columns:** repeat(2, 1fr)
- **Gap:** 0 56px (sem gap vertical, 56px horizontal)

#### Item (`.rb-item`)
- **Tag:** `<a>`
- **Display:** flex
- **Align-items:** flex-start
- **Gap:** 20px
- **Padding:** 22px 0
- **Border-bottom:** 1px solid rgba(255,255,255,0.1)
- **Cursor:** pointer
- **Transition:** padding 0.2s
- **Hover:** padding-left 6px
- **`.rb-item:hover .rb-arrow`:** opacity 1, transform translateX(3px)

##### Número (`.rb-num`) — **DESTAQUE: laranja fosco**
- **Flex:** none
- **Font-family:** var(--font)
- **Font-weight:** 900
- **Font-size:** 1.9rem
- **Letter-spacing:** -0.04em
- **Color:** **rgba(201,96,60,0.72)** ← argila/clay com 72% de opacidade (laranja fosco, preenchido — NÃO usa text-stroke vazado)
- **Width:** 46px
- **Line-height:** 1

##### Body (`.rb-body`)
- **Flex:** 1
- **Min-width:** 0
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 5px

###### Categoria (`.rb-cat`)
- **Font-family:** var(--mono)
- **Font-size:** 9.5px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Color:** var(--clay)

###### Título (`.rb-t`)
- **Font-weight:** 700
- **Font-size:** 1.0625rem
- **Letter-spacing:** -0.015em
- **Color:** #fff
- **Line-height:** 1.3

###### Meta (`.rb-meta`)
- **Font-family:** var(--mono)
- **Font-size:** 10.5px
- **Letter-spacing:** 0.04em
- **Color:** rgba(255,255,255,0.4)
- **Display:** flex
- **Gap:** 10px
- **(2 `<span>`: data e tempo de leitura)**

##### Seta (`.rb-arrow`)
- **Flex:** none
- **Align-self:** center
- **Font-family:** var(--mono)
- **Font-weight:** 600
- **Font-size:** 15px
- **Color:** var(--clay)
- **Opacity:** 0 (→ 1 no hover do item)
- **Transition:** opacity 0.2s, transform 0.2s
- **Conteúdo:** "→"

**Conteúdo (4 itens, na ordem):**
| Num | Categoria | Título | Data | Tempo | Href |
|-----|-----------|--------|------|-------|------|
| 01 | Tutoriais · IA | Como construir prompts poderosos para IAs como GPT ou Gemini | 07 DEZ 2025 | 5 min | Pagina de Postagem.html |
| 02 | DevOps | CI/CD na AWS sem clicar no console | 28 NOV 2025 | 8 min | # |
| 03 | Bastidores | Os primeiros 30 dias e os custos reais na AWS | 14 DEZ 2025 | 6 min | # |
| 04 | Engenharia | O sistema de comentários que construí do zero | 04 JAN 2026 | 9 min | # |

### Responsividade Banda
- **@media (max-width: 760px):** `.rb-list` grid-template-columns 1fr, gap 0

---

## CTA ASSESSORIA

Seção escura de chamada para assessoria — **substitui a antiga newsletter**. Vem **depois** da 2ª grade de artigos.

### Container (`.cta-adv`)
- **Tag:** `<section id="assessoria">`
- **Background:** var(--petrol)
- **Color:** var(--ivory)
- **Position:** relative
- **Overflow:** hidden
- **Isolation:** isolate
- **data-screen-label:** "Assessoria"

#### ::before (overlay decorativo)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Opacity:** 0.55
- **Pointer-events:** none
- **Z-index:** 0
- **Background (4 camadas):**
  1. radial-gradient(50% 70% at 100% 0%, rgba(201,96,60,0.32), transparent 55%)
  2. radial-gradient(40% 60% at 0% 100%, rgba(91,139,150,0.2), transparent 60%)
  3. linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 100% 80px
  4. linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 80px 100%
- **Mask (webkit + standard):** radial-gradient(ellipse at 70% 30%, #000 30%, transparent 80%)

### Inner (`.cta-adv-in`)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 84px 40px
- **Display:** grid
- **Grid-template-columns:** 1.06fr 0.94fr
- **Gap:** 60px
- **Align-items:** center

### Coluna Esquerda (`.cta-left`)

#### Eyebrow (`.cta-ey`)
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.72)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 20px
- **`.cta-ey::before`:** content "", width 30px, height 1px, background var(--clay)
- **Conteúdo:** "Assessoria & Consultoria" (use `&amp;` no HTML)

#### H2 (`.cta-adv h2`)
- **Font-weight:** 800
- **Font-size:** clamp(2rem, 3.6vw, 2.75rem)
- **Line-height:** 1.06
- **Letter-spacing:** -0.04em
- **Color:** #fff
- **Max-width:** 500px
- **`.cta-adv h2 em`:** font-style italic, color var(--petrol-soft)
- **Conteúdo:** "Precisa de ajuda para *construir* ou escalar na nuvem?" — "construir" em `<em>`

#### Descrição (`.cta-desc`)
- **Font-size:** 1.0625rem
- **Line-height:** 1.6
- **Color:** rgba(250,248,243,0.66)
- **Max-width:** 440px
- **Margin-top:** 18px
- **Conteúdo:** "Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa."

#### Pontos (`.cta-points`)
- **Tag:** `<ul>`
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 13px
- **Margin-top:** 26px

##### Item (`.cta-points li`)
- **List-style:** none
- **Display:** flex
- **Align-items:** flex-start
- **Gap:** 12px
- **Font-size:** 15px
- **Line-height:** 1.5
- **Color:** rgba(250,248,243,0.9)
- **`.cta-points li b`:** color #fff, font-weight 600

###### Checkmark (`.ck`)
- **Flex:** none
- **Width:** 22px
- **Height:** 22px
- **Border-radius:** 7px
- **Margin-top:** 1px
- **Background:** rgba(201,96,60,0.2)
- **Color:** #E8A582
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **`.ck svg`:** width 13px, height 13px
- **SVG (check):** viewBox 0 0 24 24, fill none, stroke currentColor, stroke-width 3, linecap/linejoin round, path `d="M20 6 9 17l-5-5"`

**Conteúdo (3 pontos — texto com `<b>` destacado):**
1. "Arquitetura **AWS** sob medida, sem desperdício de custo"
2. "Automação e **CI/CD** de ponta a ponta em código"
3. "Adoção de **IA** com foco em resultado, não em hype"

### Coluna Direita — Card (`.adv-card`)
- **Background:** rgba(255,255,255,0.05)
- **Border:** 1px solid rgba(255,255,255,0.14)
- **Border-radius:** 18px
- **Padding:** 34px 34px 30px
- **Backdrop-filter:** blur(4px)
- **Box-shadow:** 0 24px 60px -28px rgba(0,0,0,0.55)

#### Tagline (`.adv-card .tagline`)
- **Font-family:** var(--mono)
- **Font-size:** 10.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.6)
- **Display:** flex
- **Align-items:** center
- **Gap:** 9px
- **Margin-bottom:** 18px
- **`.tagline .dot`:** width 7px, height 7px, border-radius 50%, background var(--moss), box-shadow 0 0 0 3px rgba(63,107,71,0.25), animation pulse 2.4s ease-in-out infinite
- **Conteúdo:** "Disponível para novos projetos" (com `.dot` à esquerda)

#### H3 (`.adv-card h3`)
- **Font-weight:** 800
- **Font-size:** 1.4rem
- **Letter-spacing:** -0.025em
- **Color:** #fff
- **Line-height:** 1.2
- **Conteúdo:** "Vamos conversar sobre o seu"

#### Sub (`.adv-card .sub`)
- **Font-size:** 14.5px
- **Line-height:** 1.6
- **Color:** rgba(250,248,243,0.66)
- **Margin-top:** 10px
- **Conteúdo:** "Diagnóstico inicial gratuito. Conte o desafio e eu retorno com um plano objetivo."

#### Service Tags (`.adv-card .svc-tags`)
- **Display:** flex
- **Flex-wrap:** wrap
- **Gap:** 8px
- **Margin:** 22px 0 26px

##### `.svc-tags span`
- **Font-family:** var(--mono)
- **Font-size:** 10.5px
- **Letter-spacing:** 0.08em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.8)
- **Background:** rgba(255,255,255,0.06)
- **Border:** 1px solid rgba(255,255,255,0.12)
- **Padding:** 7px 12px
- **Border-radius:** 999px

**Conteúdo (4 tags):** "Cloud · AWS", "DevOps", "IA aplicada", "Mentoria"

#### Botão (`.adv-card .btn-adv`)
- **Tag:** `<a>` (href: Serviços.html#contato)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Gap:** 10px
- **Width:** 100%
- **Background:** var(--clay)
- **Color:** #fff
- **Border:** none
- **Cursor:** pointer
- **Text-decoration:** none
- **Height:** 56px
- **Border-radius:** 13px
- **Font-family:** var(--font)
- **Font-weight:** 600
- **Font-size:** 15.5px
- **Box-shadow:** 0 12px 26px -8px rgba(201,96,60,0.55)
- **Transition:** background 0.2s, transform 0.2s
- **Hover:** background var(--clay-hover), transform translateY(-2px)
- **`.btn-adv .arrow`:** font-family var(--mono)
- **Conteúdo:** "Conhecer a assessoria →"

#### Reassure (`.adv-card .reassure`)
- **Text-align:** center
- **Font-family:** var(--mono)
- **Font-size:** 10.5px
- **Letter-spacing:** 0.1em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.5)
- **Margin-top:** 16px
- **Conteúdo:** "Resposta em até 24h · sem compromisso"

### Responsividade CTA
- **@media (max-width: 840px):** `.cta-adv-in` grid-template-columns 1fr, gap 44px
- **@media (max-width: 680px):** `.cta-adv-in` padding 64px 20px

---

## FOOTER

Idêntico ao das demais páginas do sistema. Documentado por completude.

### Container (`footer.site`)
- **Position:** relative
- **Background:** var(--petrol-deep)
- **Color:** #A8C0C6
- **Overflow:** hidden
- **Isolation:** isolate

#### ::before (linha de topo gradiente)
- **Content:** ""
- **Position:** absolute
- **Top:** 0; **Left:** 0; **Right:** 0
- **Height:** 2px
- **Z-index:** 2
- **Background:** linear-gradient(90deg, transparent, var(--petrol-soft) 30%, var(--clay) 70%, transparent)

#### ::after (overlay decorativo)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.5
- **Background (4 camadas):**
  1. radial-gradient(46% 70% at 88% 0%, rgba(201,96,60,0.22), transparent 58%)
  2. radial-gradient(40% 60% at 6% 12%, rgba(91,139,150,0.16), transparent 60%)
  3. linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px) 0 0 / 100% 76px
  4. linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px) 0 0 / 76px 100%
- **Mask (webkit + standard):** radial-gradient(ellipse at 60% 0%, #000 35%, transparent 85%)

### Inner (`.foot-in`)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px 26px

### Lead (`.foot-lead`)
- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 40px
- **Padding:** 60px 0 40px
- **Border-bottom:** 1px solid rgba(255,255,255,0.08)
- **Flex-wrap:** wrap

#### Manifesto (`.foot-lead .manifesto`)
- **Font-family:** var(--font)
- **Font-weight:** 800
- **Font-size:** clamp(1.5rem, 2.6vw, 2.1rem)
- **Line-height:** 1.18
- **Letter-spacing:** -0.03em
- **Color:** #fff
- **Max-width:** 560px
- **Text-wrap:** balance
- **`.manifesto em`:** font-style italic, color var(--petrol-soft)
- **Conteúdo:** "Engenharia, IA e automação — *decifradas* por quem constrói em produção." — "decifradas" em `<em>`

#### Botão Topo (`.to-top`)
- **Tag:** `<button id="toTop" type="button" aria-label="Voltar ao topo">`
- **Flex:** none
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 10px
- **Cursor:** pointer
- **Background:** rgba(255,255,255,0.05)
- **Border:** 1px solid rgba(255,255,255,0.16)
- **Color:** #fff
- **Font-family:** var(--font)
- **Font-weight:** 600
- **Font-size:** 13.5px
- **Padding:** 13px 20px
- **Border-radius:** 999px
- **Transition:** background 0.2s, border-color 0.2s, transform 0.2s
- **Hover:** background var(--clay), border-color var(--clay), transform translateY(-2px)
- **`.to-top svg`:** width 15px, height 15px (seta para cima — paths `M12 19V5` + `m5 12 7-7 7 7`)
- **Conteúdo:** "Voltar ao topo" + ícone seta-para-cima

### Top Grid (`.foot-top`)
- **Display:** grid
- **Grid-template-columns:** 1.6fr 1fr 1fr 1.2fr
- **Gap:** 48px
- **Padding:** 48px 0 44px
- **Border-bottom:** 1px solid rgba(255,255,255,0.08)

#### Coluna Brand (`.foot-brand`)
- **`.b`:** font-weight 800, font-size 22px, color #fff, letter-spacing -0.02em ("Marcelo" + `.b2` "Gonçalves")
- **`.b .b2`:** color var(--petrol-soft)
- **`.foot-brand p`:** font-size 14px, line-height 1.65, color #8FAAB1, max-width 300px, margin-top 16px → "Tutoriais, bastidores e decisões reais de um blog construído do zero na AWS, quase 100% com IA."
- **`.badge`:** display inline-flex, align-items center, gap 8px, margin-top 20px, font-family var(--mono), font-size 10.5px, letter-spacing 0.12em, text-transform uppercase, color #A8C0C6, background rgba(255,255,255,0.05), border 1px solid rgba(255,255,255,0.1), padding 7px 13px, border-radius 999px → "No ar · construído com IA"
  - `.badge .dot`: width 7px, height 7px, border-radius 50%, background var(--moss), box-shadow 0 0 0 3px rgba(63,107,71,0.25)

#### Colunas de Links (`.foot-col`)
- **`.foot-col h5`:** font-weight 600, font-size 11px, letter-spacing 0.18em, text-transform uppercase, color #fff, margin-bottom 20px
- **`.foot-col ul`:** list-style none, display flex, flex-direction column, gap 12px
- **`.foot-col ul li a`:** display inline-flex, align-items center, font-size 14px, color #8FAAB1, transition color 0.2s; hover color #fff

**Coluna "Categorias":** Inteligência Artificial, DevOps, Cloud · AWS, Engenharia (todos href "#")

**Coluna "Links Rápidos":** Home (Home.html), O Projeto (O Projeto.html), Serviços (Serviços.html), Sobre (Sobre.html)

#### Coluna Contato (`.foot-col` — Contato)
- **`.contact`:** display flex, align-items center, gap 10px, font-size 14px, color #8FAAB1, margin-bottom 20px, transition color 0.2s; hover color #fff
  - `.contact .ic`: flex none, width 34px, height 34px, border-radius 9px, background rgba(255,255,255,0.05), border 1px solid rgba(255,255,255,0.1), display flex, center; `.ic svg` width 16px, height 16px, opacity 0.85 (ícone envelope)
  - Href: `mailto:contato@marcelogoncalves.com` → texto "contato@marcelogoncalves.com"
- **`.foot-soc`:** display flex, gap 9px
  - `.foot-soc a`: width 40px, height 40px, border-radius 11px, background rgba(255,255,255,0.05), border 1px solid rgba(255,255,255,0.1), color #A8C0C6, display flex center, transition all 0.2s; hover background var(--clay), border-color var(--clay), color #fff, transform translateY(-2px); `a svg` width 17px, height 17px
  - **3 redes:** LinkedIn, Instagram, X (mesmos SVGs das demais páginas)

### Watermark (`.foot-watermark`)
- **Position:** relative
- **Margin-top:** 28px
- **Text-align:** center
- **Line-height:** 0.8
- **White-space:** nowrap
- **Font-family:** var(--font)
- **Font-weight:** 900
- **Letter-spacing:** -0.055em
- **Font-size:** clamp(2rem, 8.6vw, 6.8rem)
- **Color:** transparent
- **Background:** linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.01))
- **Background-clip:** text (webkit + standard)
- **User-select:** none
- **Pointer-events:** none
- **aria-hidden:** true
- **Conteúdo:** "MarceloGonçalves"

### Bottom (`.foot-bottom`)
- **Display:** flex
- **Justify-content:** space-between
- **Align-items:** center
- **Padding-top:** 24px
- **Margin-top:** 8px
- **Border-top:** 1px solid rgba(255,255,255,0.08)
- **Flex-wrap:** wrap
- **Gap:** 14px
- **Font-family:** var(--mono)
- **Font-size:** 11px
- **Color:** #5E7A82
- **Letter-spacing:** 0.06em
- **`.foot-bottom .links`:** display flex, gap 22px; `a:hover` color #fff
- **Conteúdo esquerda:** "© 2025 Marcelo Gonçalves · Todos os direitos reservados"
- **Conteúdo direita (`.links`):** "Privacidade", "Termos", "RSS"

### Responsividade Footer
- **@media (max-width: 1040px):** `.foot-top` grid-template-columns 1fr 1fr, gap 36px 32px; `.foot-brand` grid-column 1 / -1
- **@media (max-width: 680px):** `.foot-top` grid-template-columns 1fr; `.foot-in` padding 0 20px 20px

---

## ORDEM DOS BLOCOS NO BODY

Sequência exata dos elementos do `<body>`, de cima para baixo:

1. `<div class="progress" id="progress">` — barra de progresso
2. `<header class="nav">` — navbar
3. `<section class="hero">` — hero 2 colunas (esquerda + `.proj-card` à direita)
4. `<div class="filterbar">` — barra de filtros sticky
5. `<section class="wrap masthead">` — artigo em destaque (`.feature`) + `.twoup` (2 mini cards)
6. `<section class="wrap section">` (`data-screen-label="Grade de Artigos"`) — `.sec-head-row` + `.posts-grid#grid` (6 cards)
7. `<section class="readband">` — **Clássicos do Blog** (4 itens)
8. `<section class="wrap section">` (`data-screen-label="Grade de Artigos — Continuação"`) — `.posts-grid#grid2` (6 cards) + `.empty` + `.load-wrap`
9. `<section class="cta-adv" id="assessoria">` — CTA Assessoria
10. `<footer class="site">` — rodapé
11. `<script>` — comportamento (ao final do body)

**Regra de posicionamento crítica:** a banda "Clássicos do Blog" (item 7) fica **entre** as duas metades da grade — após os 6 primeiros cards e antes dos 6 últimos.

---

## CONTEÚDO COMPLETO (TEXTO EXATO)

### Hero
- **Eyebrow:** Arquivo · Todos os artigos
- **H1:** Tudo que escrevi, reunido *num só lugar*
- **Sub:** Tutoriais, bastidores e decisões reais de um blog construído do zero na AWS — quase 100% com IA. Busque, filtre e vá fundo.
- **Search placeholder:** Buscar por título, tema ou tecnologia…
- **Search kbd:** ⌘K
- **Stats:** 52 artigos | 4 categorias | Atualizado semanalmente

### CTA O Projeto (card hero)
- **Label:** Construído em público
- **H2:** Veja como este blog foi *construído*
- **Sub:** Da infra serverless ao deploy — cada decisão documentada e os custos expostos, quase tudo com IA.
- **Stats:** ~100% Com IA · 100% Serverless · 12 mo Em produção
- **Botão:** Conhecer O Projeto →

### Filtros
- **Chips:** Todos · Inteligência Artificial · DevOps · Cloud · AWS · Engenharia · Bastidores
- **Contador:** 12 de 52 artigos
- **Sort:** Mais recentes / Mais lidos / A–Z

### Masthead
- **Badge:** ★ Em destaque
- **Slot:** imagem de capa · 720×760
- **Categoria:** Tutoriais · Inteligência Artificial
- **H2:** Como construir prompts poderosos para IAs como GPT ou Gemini
- **Parágrafo:** Um bom prompt não é uma pergunta — é uma instrução estratégica. O método de quatro princípios para extrair respostas precisas, no formato certo, todas as vezes.
- **Autor:** Marcelo Gonçalves · 07 DEZ 2025 · 5 min
- **Read:** Ler artigo →

### Seção Grade (1ª)
- **Eyebrow:** O arquivo
- **Título:** Todos os artigos
- **Link:** Ver índice por ano →

### Clássicos do Blog
- **Eyebrow:** Mais lidos de sempre
- **Título:** Os clássicos do blog
- **Link:** Ver ranking completo →

### CTA Assessoria
- **Eyebrow:** Assessoria & Consultoria
- **H2:** Precisa de ajuda para *construir* ou escalar na nuvem?
- **Descrição:** Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa.
- **Tagline card:** Disponível para novos projetos
- **H3 card:** Vamos conversar sobre o seu
- **Sub card:** Diagnóstico inicial gratuito. Conte o desafio e eu retorno com um plano objetivo.
- **Tags:** Cloud · AWS · DevOps · IA aplicada · Mentoria
- **Botão:** Conhecer a assessoria →
- **Reassure:** Resposta em até 24h · sem compromisso

---

## JAVASCRIPT / COMPORTAMENTO

Script único ao final do body. Três comportamentos:

### 1. Reading Progress Bar
```js
const prog = document.getElementById('progress');
const onScroll = () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
};
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();
```
- Atualiza a largura de `.progress` proporcional ao scroll. Executa uma vez no load.

### 2. Filtros (chips) — filtram AS DUAS grades
```js
const chips = [...document.querySelectorAll('.chip')];
const cards = [...document.querySelectorAll('.art-grid .post-card')];
const countEl = document.getElementById('count');
const titleEl = document.getElementById('gridTitle');
const emptyEl = document.getElementById('empty');
const labels = {all:'Todos os artigos', ia:'Inteligência Artificial', devops:'DevOps',
  cloud:'Cloud · AWS', eng:'Engenharia', bastidores:'Bastidores'};

function applyFilter(f){
  let shown = 0;
  cards.forEach(c => {
    const match = f === 'all' || (c.dataset.cat || '').split(' ').includes(f);
    c.classList.toggle('is-hidden', !match);
    if (match) shown++;
  });
  titleEl.textContent = labels[f] || 'Todos os artigos';
  countEl.innerHTML = '<b>' + shown + '</b> de 52 artigos';
  emptyEl.classList.toggle('show', shown === 0);
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyFilter(chip.dataset.filter);
  });
});
```
**Comportamento exato:**
- A seleção de cards usa `.art-grid .post-card` → pega os cards das DUAS grades (`#grid` e `#grid2`).
- Clicar num chip: remove `.active` de todos, adiciona ao clicado, e chama `applyFilter`.
- `applyFilter(f)`: para cada card, exibe se `f === 'all'` OU se o token `f` está em `data-cat` (split por espaço). Cards que não casam recebem `.is-hidden` (display none).
- Atualiza o título da 1ª grade (`#gridTitle`) com o label da categoria.
- Atualiza o contador (`#count`) com `<b>N</b> de 52 artigos` (N = cards visíveis).
- Mostra/esconde `.empty` conforme `shown === 0`.
- **NOTA:** A busca (input do hero) NÃO tem JS — é puramente visual. O `select` de ordenação também é visual (sem handler).

### 3. Voltar ao Topo
```js
document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

---

## RESPONSIVIDADE COMPLETA

Resumo de todos os breakpoints (em ordem de cascata):

### @media (max-width: 1040px)
- `.foot-top`: grid 1fr 1fr, gap 36px 32px
- `.foot-brand`: grid-column 1 / -1

### @media (max-width: 980px)
- `.result-count`: display none

### @media (max-width: 900px)
- `.hero-in`: **grid-template-columns 1fr** (hero empilha — CTA O Projeto vai para baixo), gap 40px, padding-top 64px, padding-bottom 60px
- `.feature`: grid-template-columns 1fr; `.feature .f-cover` min-height 220px
- `.twoup`: grid-template-columns 1fr

### @media (max-width: 860px)
- `nav.menu`: display none (menu some)
- `.posts-grid`: grid-template-columns 1fr 1fr (2 colunas)

### @media (max-width: 840px)
- `.cta-adv-in`: grid-template-columns 1fr, gap 44px

### @media (max-width: 760px)
- `.rb-list`: grid-template-columns 1fr, gap 0

### @media (max-width: 680px)
- `.posts-grid`: grid-template-columns 1fr (1 coluna)
- `.wrap`, `.filterbar-in`: padding-left/right 20px
- `.hero-in`: padding-left/right 20px
- `.cta-adv-in`: padding 64px 20px
- `.foot-top`: grid-template-columns 1fr
- `.foot-in`: padding 0 20px 20px
- `.filterbar-in`: flex-direction column, align-items flex-start, gap 12px
- `.chips`: overflow-x auto, flex-wrap nowrap, width 100%, scroll horizontal

### @media (max-width: 480px)
- `.mini`: grid-template-columns 1fr; `.mini .m-cover` min-height 140px

---

## NOTAS DE IMPLEMENTAÇÃO (CRÍTICAS)

1. **Busca = apenas visual.** O input do hero e o `<select>` de ordenação NÃO possuem JavaScript. São elementos decorativos/de interface. Não implementar lógica de busca ou ordenação.
2. **Filtros = funcionais.** Apenas os chips filtram, agindo sobre `.art-grid .post-card` (ambas as grades).
3. **Número dos Clássicos = laranja fosco preenchido.** `.rb-num` usa `color: rgba(201,96,60,.72)` — NÃO é número vazado com text-stroke. É o argila/clay com opacidade reduzida.
4. **Grade dividida em 2 + banda no meio.** Os 12 cards são divididos em dois grupos de 6; a banda "Clássicos do Blog" fica exatamente entre eles.
5. **CTA Assessoria substitui a newsletter.** Não há mais bloco de newsletter nesta página.
6. **`@keyframes pulse` aparece 2× no CSS** (declarado junto de `.proj-label` e de `.adv-card .tagline`). Ambas as declarações são idênticas; manter as duas não causa problema (a segunda apenas sobrescreve a primeira com o mesmo valor).
7. **Hero eyebrow** usa só `::before` (traço à esquerda), diferente do eyebrow centralizado de outras páginas que usa `::before` + `::after`.
8. **data-screen-label** presentes para contexto de comentários: "Hero Artigos", "CTA O Projeto", "Filtros", "Destaque", "Grade de Artigos", "Mais Lidos", "Grade de Artigos — Continuação", "Assessoria".

---

**FIM DA ESPECIFICAÇÃO**

Nenhuma ambiguidade. Outra IA consegue reconstruir a página `Artigos.html` pixel-perfeita usando esta especificação.
