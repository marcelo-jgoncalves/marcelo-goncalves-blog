# ESPECIFICAÇÃO: Página de Serviços

**Versão:** 1.1  
**Data:** Jun 2026  
**Status:** Atualizado — Making Of reposicionado  
**Arquivo:** `Serviços.html`

---

## ÍNDICE

1. [Setup e Boilerplate](#setup-e-boilerplate)
2. [Variáveis CSS](#variáveis-css)
3. [Reset e Base](#reset-e-base)
4. [Reading Progress Bar](#reading-progress-bar)
5. [Header/Nav](#headernav)
6. [Hero (2 colunas)](#hero-2-colunas)
7. [Stats Strip](#stats-strip)
8. [Serviços — Parte 1 (01 wide + 02–04)](#serviços--parte-1)
9. [Making Of (intercalado)](#making-of-intercalado)
10. [Serviços — Parte 2 (05–11)](#serviços--parte-2)
11. [CTA Final (#contato)](#cta-final)
12. [Footer](#footer)
13. [Responsividade](#responsividade)
14. [Scripts e Interatividade](#scripts-e-interatividade)
15. [Ordem dos Blocos no Body](#ordem-dos-blocos-no-body)

---

## SETUP E BOILERPLATE

- **Doctype:** `<!doctype html>`
- **Lang:** `pt-BR`
- **Charset:** `utf-8`
- **Title:** `Serviços — Marcelo Gonçalves`
- **Viewport:** `width=device-width, initial-scale=1`

### Fontes (Google Fonts)
- **Preconnect:** `https://fonts.googleapis.com` e `https://fonts.gstatic.com` (crossorigin)
- **Link:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap`

---

## VARIÁVEIS CSS

Declaradas em `:root` — **idênticas** a todas as páginas do sistema.

```css
--petrol:      #0F4C5C
--petrol-deep: #08323D
--petrol-soft: #5B8B96
--ink:         #0C2027
--slate:       #3C5A64
--steel:       #7E969E
--ivory:       #FAF8F3
--surface:     #FFFFFF
--sand:        #F0ECE2
--line:        #E4DDD0
--clay:        #C9603C
--clay-hover:  #A94C2D
--clay-soft:   #F3DDD0
--moss:        #3F6B47
--font:        'Inter', system-ui, sans-serif
--mono:        'JetBrains Mono', ui-monospace, monospace
```

---

## RESET E BASE

- **`*`:** box-sizing border-box, margin 0, padding 0
- **`html`:** scroll-behavior smooth
- **`body`:** background var(--ivory), color var(--ink), font-family var(--font), -webkit-font-smoothing antialiased, text-rendering optimizeLegibility, line-height 1.6
- **`a`:** color inherit, text-decoration none
- **`::selection`:** background var(--clay-soft), color var(--clay-hover)

---

## READING PROGRESS BAR

### Container (`.progress`)
- **Position:** fixed | **Top:** 0 | **Left:** 0 | **Height:** 3px
- **Width:** 0 (animado via JS) | **Z-index:** 60
- **Background:** `linear-gradient(90deg, var(--petrol), var(--clay))`
- **ID:** `progress`
- **HTML:** `<div class="progress" id="progress"></div>` — primeiro elemento do body

---

## HEADER/NAV

### `header.nav`
- **Position:** sticky | **Top:** 0 | **Z-index:** 50
- **Background:** `rgba(250,248,243,.88)`
- **Backdrop-filter:** `saturate(140%) blur(12px)`
- **Border-bottom:** `1px solid var(--line)`

### `.nav-in`
- **Max-width:** 1240px | **Margin:** 0 auto | **Padding:** 0 32px
- **Height:** 68px | **Display:** flex | **Align-items:** center
- **Justify-content:** space-between | **Gap:** 32px

### `.brand` (link → Home.html)
- **Font-weight:** 800 | **Font-size:** 19px | **Letter-spacing:** -0.02em
- **Color:** var(--ink) | **Display:** flex | **Align-items:** center
- Estrutura: `<span>Marcelo</span><span class="b2">Gonçalves</span><span class="tick"></span>`
- **`.b2`:** color var(--petrol)
- **`.tick`:** width 6px, height 6px, border-radius 50%, background var(--clay), margin 0 0 6px 4px, align-self flex-end

### `nav.menu`
- **Display:** flex | **Gap:** 30px
- **Links (14.5px, slate, weight 500):** Home (Home.html) · Artigos (#) · O Projeto (O Projeto.html) · **Serviços (#, active)** · Sobre (Sobre.html)
- **active:** color var(--petrol), font-weight 600
- **Hover:** color var(--ink)
- **@media ≤860px:** display none

### `.nav-cta` (link → `#contato`)
- **Display:** inline-flex | **Align-items:** center | **Gap:** 9px
- **Background:** var(--petrol) | **Color:** #fff | **Font-weight:** 600 | **Font-size:** 14px
- **Padding:** 11px 18px | **Border-radius:** 10px
- **Transition:** background .2s, transform .15s
- **Hover:** background var(--petrol-deep), transform translateY(-1px)
- **`.arrow`:** font-family var(--mono)
- **Conteúdo:** `Entrar em contato <span class="arrow">→</span>`

---

## HERO (2 COLUNAS)

### `section.hero` (`data-screen-label="Hero"`)
- **Background:** var(--petrol-deep) | **Color:** var(--ivory)
- **Position:** relative | **Isolation:** isolate

### `::before` (overlay decorativo)
- **Position:** absolute | **Inset:** 0 | **Z-index:** 0 | **Pointer-events:** none | **Opacity:** 0.55
- **Background (4 camadas):**
  1. `radial-gradient(52% 70% at 100% 0%, rgba(201,96,60,.3), transparent 55%)`
  2. `radial-gradient(40% 60% at 0% 100%, rgba(91,139,150,.2), transparent 60%)`
  3. `linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px) 0 0/100% 80px`
  4. `linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px) 0 0/80px 100%`
- **Mask:** `radial-gradient(ellipse at 60% 30%, #000 25%, transparent 75%)`

### `.hero-in`
- **Position:** relative | **Z-index:** 1 | **Max-width:** 1240px | **Margin:** 0 auto
- **Padding:** 88px 40px 0
- **Display:** grid | **Grid-template-columns:** `1fr auto` | **Gap:** 60px | **Align-items:** center

### Coluna Esquerda (`.hero-left`)
- **Display:** flex | **Flex-direction:** column | **Gap:** 0

#### Eyebrow (`.ey`)
- **Font-family:** var(--mono) | **Font-size:** 11px | **Letter-spacing:** 0.22em
- **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.65)`
- **Display:** flex | **Align-items:** center | **Gap:** 12px | **Margin-bottom:** 22px
- **`::before`:** content "", width 30px, height 1px, background var(--clay)
- **Conteúdo:** `Serviços · Consultoria`

#### `h1`
- **Font-weight:** 800 | **Font-size:** `clamp(2.4rem, 4.4vw, 3.5rem)`
- **Line-height:** 1.04 | **Letter-spacing:** -0.04em | **Color:** #fff
- **Max-width:** 640px | **Text-wrap:** balance | **Margin-bottom:** 20px
- **`em`:** font-style italic, color var(--petrol-soft)
- **Conteúdo:** `Consultoria em AWS, DevOps, FinOps e <em>Serverless</em>`

#### `.sub`
- **Font-size:** 1.075rem | **Line-height:** 1.65 | **Color:** `rgba(250,248,243,.64)`
- **Max-width:** 520px | **Margin-bottom:** 30px
- **Conteúdo:** `Adote arquiteturas escaláveis com a mesma engenharia que move este blog — da decisão de stack ao deploy em produção.`

#### `.hero-actions`
- **Display:** flex | **Align-items:** center | **Gap:** 14px | **Flex-wrap:** wrap

##### `.btn-clay-hero` (link → `#contato`)
- **Display:** inline-flex | **Align-items:** center | **Gap:** 10px
- **Background:** var(--clay) | **Color:** #fff | **Font-weight:** 600 | **Font-size:** 15px
- **Padding:** 14px 26px | **Border-radius:** 12px
- **Box-shadow:** `0 8px 22px rgba(201,96,60,.35)`
- **Transition:** background .2s, transform .2s
- **Hover:** background var(--clay-hover), transform translateY(-2px)
- **Conteúdo:** `Entrar em contato <span class="arrow">→</span>`

##### `.btn-ghost` (link → `#servicos`)
- **Display:** inline-flex | **Align-items:** center | **Gap:** 8px
- **Font-weight:** 600 | **Font-size:** 14.5px | **Color:** `rgba(255,255,255,.75)`
- **Border:** `1px solid rgba(255,255,255,.18)` | **Padding:** 13px 20px | **Border-radius:** 12px
- **Transition:** color .2s, border-color .2s, transform .2s
- **Hover:** color #fff, border-color `rgba(255,255,255,.4)`, transform translateY(-1px)
- **Conteúdo:** `Ver serviços ↓`

---

### Coluna Direita — Painel de Disponibilidade (`.hero-panel`)
- **Display:** flex | **Flex-direction:** column | **Gap:** 0 | **Align-self:** center
- **Background:** `rgba(255,255,255,.05)` | **Border:** `1px solid rgba(255,255,255,.13)`
- **Border-radius:** 18px | **Padding:** 26px 28px | **Min-width:** 280px
- **Backdrop-filter:** blur(4px) | **Box-shadow:** `0 24px 60px -30px rgba(0,0,0,.6)`

#### `.tagline`
- **Font-family:** var(--mono) | **Font-size:** 10.5px | **Letter-spacing:** 0.16em
- **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.6)`
- **Display:** flex | **Align-items:** center | **Gap:** 9px | **Margin-bottom:** 20px
- **`.dot`:** width 7px, height 7px, border-radius 50%, background var(--moss),  
  box-shadow `0 0 0 3px rgba(63,107,71,.25)`, animation `pulse 2.4s ease-in-out infinite`
- **Conteúdo:** `Disponível para novos projetos`

#### `@keyframes pulse`
```css
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(63,107,71,.3) }
  50%      { box-shadow: 0 0 0 5px rgba(63,107,71,.12) }
}
```

#### `.hp-row` (3 linhas de dados)
- **Display:** flex | **Align-items:** flex-end | **Justify-content:** space-between | **Gap:** 12px
- **Padding:** 14px 0 | **Border-bottom:** `1px solid rgba(255,255,255,.1)`
- **`:last-child`:** border-bottom none, padding-bottom 0
- **`:first-of-type`:** padding-top 0

##### `.hp-v` (valor grande)
- **Font-weight:** 800 | **Font-size:** 1.6rem | **Letter-spacing:** -0.03em
- **Color:** #fff | **Line-height:** 1
- **`.hp-v.clay`:** color var(--clay)

##### `.hp-l` (label)
- **Font-family:** var(--mono) | **Font-size:** 10px | **Letter-spacing:** 0.14em
- **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.5)` | **Text-align:** right | **Max-width:** 120px

**Conteúdo das 3 linhas:**

| Valor | Classe | Label |
|-------|--------|-------|
| `30 min` | `hp-v clay` | `Diagnóstico inicial gratuito` |
| `24h` | `hp-v` | `Tempo de resposta` |
| `100%` | `hp-v` | `Remoto · sem compromisso` |

---

## STATS STRIP

### `.stats-strip`
- **Position:** relative | **Z-index:** 1 | **Max-width:** 1240px | **Margin:** 0 auto
- **Display:** flex | **Padding:** 0 40px
- **Border-top:** `1px solid rgba(255,255,255,.1)` | **Margin-top:** 60px

### `.stat-item`
- **Flex:** 1 | **Padding:** 26px 28px | **Display:** flex | **Flex-direction:** column | **Gap:** 4px
- **Border-right:** `1px solid rgba(255,255,255,.08)`
- **`:first-child`:** padding-left 0
- **`:last-child`:** border-right none

#### `.v` (valor)
- **Font-weight:** 800 | **Font-size:** 1.7rem | **Letter-spacing:** -0.035em | **Color:** #fff | **Line-height:** 1

#### `.l` (label)
- **Font-family:** var(--mono) | **Font-size:** 10.5px | **Letter-spacing:** 0.16em
- **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.48)` | **Margin-top:** 2px

**Conteúdo (4 stats):**

| Valor | Label |
|-------|-------|
| `10` | `Frentes de atuação` |
| `AWS` | `Especialização cloud` |
| `IaC` | `Tudo em código` |
| `FinOps` | `Custo sob controle` |

---

## SERVIÇOS — PARTE 1

> **Nota de estrutura:** O grid de serviços é dividido em duas seções separadas, com a seção Making Of intercalada entre elas. Esta seção contém o card wide de destaque (IA Aplicada, card 01) e os cards 02–04.

### `section.section#servicos` (`data-screen-label="Serviços"`)
- **Padding:** 96px 0
- **Background:** var(--ivory)

### `.wrap`
- **Max-width:** 1240px | **Margin:** 0 auto | **Padding:** 0 40px

### Cabeçalho Centralizado (`.sec-head`)
- **Display:** flex | **Flex-direction:** column | **Align-items:** center | **Text-align:** center
- **Margin-bottom:** 56px

#### `.sec-ey`
- **Font-family:** var(--mono) | **Font-size:** 11px | **Letter-spacing:** 0.22em
- **Text-transform:** uppercase | **Color:** var(--clay)
- **Display:** flex | **Align-items:** center | **Gap:** 12px | **Margin-bottom:** 16px
- **`::before` e `::after`:** content "", width 30px, height 1px, background var(--clay)
  > **Nota:** este eyebrow usa TANTO `::before` quanto `::after` (linha de ambos os lados), diferente do eyebrow alinhado à esquerda que usa só `::before`.
- **Conteúdo:** `O que eu faço`

#### `.sec-t`
- **Font-weight:** 800 | **Font-size:** `clamp(1.9rem, 3vw, 2.5rem)` | **Letter-spacing:** -0.04em
- **Color:** var(--ink) | **Line-height:** 1.08 | **Text-wrap:** balance
- **Conteúdo:** `Engenharia de ponta a ponta na nuvem`

#### `.sec-desc`
- **Font-size:** 1.0625rem | **Line-height:** 1.65 | **Color:** var(--slate)
- **Max-width:** 560px | **Margin-top:** 14px
- **Conteúdo:** `Dez frentes de atuação que cobrem o ciclo completo — da estratégia com IA à operação otimizada, segura e observável.`

---

### Grid (`.svc-grid`)
- **Display:** grid | **Grid-template-columns:** `repeat(3, 1fr)` | **Gap:** 22px

---

### Card Wide — IA Aplicada (`.svc-card.wide`) — Card 01

> Card de destaque que ocupa toda a largura (`grid-column: 1 / -1`). É o primeiro card do grid.

#### Container (`.svc-card.wide`)
- **Grid-column:** 1 / -1
- **Background:** var(--surface)
- **Border:** `1px solid var(--line)` | **Border-color:** `rgba(201,96,60,.3)` (sobrescreve)
- **Border-radius:** 16px | **Padding:** 34px 38px
- **Background:** `linear-gradient(120deg, var(--surface) 0%, rgba(243,221,208,.16) 100%)`
- **Display:** flex | **Flex-direction:** row | **Align-items:** center | **Gap:** 36px
- **Overflow:** hidden | **Position:** relative
- **Transition:** transform .2s, box-shadow .2s, border-color .2s

##### `::after` (barra superior animada)
- **Content:** "" | **Position:** absolute | **Left:** 0 | **Top:** 0 | **Height:** 3px | **Width:** 0
- **Background:** `linear-gradient(90deg, var(--clay), var(--petrol))`
- **Transition:** width .3s ease
- **`.svc-card.wide:hover::after`:** width 100%

##### **Hover do wide card:**
- transform translateY(-3px)
- box-shadow `0 18px 40px -18px rgba(12,32,39,.18)`
- border-color `rgba(15,76,92,.22)`

#### Lado Mídia (`.svc-wide-media`)
- **Display:** flex | **Flex-direction:** column | **Align-items:** center | **Gap:** 14px

##### `.svc-icon` (ícone IA)
- **Flex:** none | **Width:** 64px | **Height:** 64px | **Border-radius:** 16px
- **Background:** `linear-gradient(150deg, var(--clay) 0%, var(--clay-hover) 100%)`
- **Color:** #fff | **Display:** flex | **Align-items:** center | **Justify-content:** center
- **Box-shadow:** `0 10px 22px -8px rgba(201,96,60,.55)`
- **SVG:** 30×30px — ícone de cérebro/chip
  ```html
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="8" width="16" height="12" rx="2"/>
    <path d="M12 8V4M9 4h6"/>
    <circle cx="9" cy="14" r="1.2"/>
    <circle cx="15" cy="14" r="1.2"/>
    <path d="M2 13v3M22 13v3"/>
  </svg>
  ```

##### `.svc-wide-num`
- **Font-family:** var(--mono) | **Font-size:** 12px | **Font-weight:** 600 | **Letter-spacing:** 0.12em
- **Color:** var(--clay)
- **Conteúdo:** `01`

#### Corpo (`.svc-wide-body`)
- **Flex:** 1 | **Min-width:** 0

##### `.wtag`
- **Font-family:** var(--mono) | **Font-size:** 10px | **Letter-spacing:** 0.16em
- **Text-transform:** uppercase | **Color:** var(--clay) | **Margin-bottom:** 8px
- **Conteúdo:** `Destaque · Diferencial`

##### `h3`
- **Font-weight:** 800 | **Font-size:** 1.4rem | **Letter-spacing:** -0.025em
- **Color:** var(--ink) | **Line-height:** 1.25 | **Margin-bottom:** 10px
- **Conteúdo:** `IA Aplicada &amp; Engenharia de Prompts`

##### `p`
- **Font-size:** 15px | **Line-height:** 1.65 | **Color:** var(--slate) | **Max-width:** 760px
- **Conteúdo:** `Adoção de IA com foco em resultado, não em hype. Formado em Letras com mestrado em Linguística, conecto a estrutura da linguagem à arquitetura dos modelos — prompts, automações e fluxos que entregam respostas precisas e reutilizáveis em produção.`

#### Tags (`.svc-wide-tags`)
- **Flex:** none | **Display:** flex | **Flex-direction:** row | **Flex-wrap:** wrap | **Align-items:** center
- **Gap:** 8px | **Padding-left:** 36px | **Border-left:** `1px solid var(--line)`
- **Align-self:** stretch | **Justify-content:** center
- **Tags:** `Prompt Engineering` · `LLMs` · `Automação`
- **Cada tag:** font-family var(--mono), font-size 10px, letter-spacing 0.06em, text-transform uppercase, color var(--petrol), background `rgba(15,76,92,.07)`, border `1px solid rgba(15,76,92,.14)`, padding 5px 10px, border-radius 999px

---

### Cards Padrão (02–04)

> Estes 3 cards formam a **primeira linha de 3 colunas** após o card wide.

#### Container genérico (`.svc-card`)
- **Position:** relative | **Background:** var(--surface) | **Border:** `1px solid var(--line)`
- **Border-radius:** 16px | **Padding:** 30px 30px 28px
- **Display:** flex | **Flex-direction:** column | **Gap:** 0 | **Overflow:** hidden
- **Transition:** transform .2s, box-shadow .2s, border-color .2s
- **Hover:**
  - transform translateY(-3px)
  - box-shadow `0 18px 40px -18px rgba(12,32,39,.18)`
  - border-color `rgba(15,76,92,.22)`

##### `::after` (barra superior animada)
- **Content:** "" | **Position:** absolute | **Left:** 0 | **Top:** 0 | **Height:** 3px | **Width:** 0
- **Background:** `linear-gradient(90deg, var(--petrol), var(--clay))`
- **Transition:** width .3s ease
- **`.svc-card:hover::after`:** width 100%

#### `.svc-top`
- **Display:** flex | **Align-items:** center | **Justify-content:** space-between | **Margin-bottom:** 22px

##### `.svc-icon`
- **Flex:** none | **Width:** 54px | **Height:** 54px | **Border-radius:** 14px
- **Background:** `linear-gradient(150deg, var(--petrol) 0%, var(--petrol-deep) 100%)`
- **Color:** #fff | **Display:** flex | **Align-items:** center | **Justify-content:** center
- **Box-shadow:** `0 8px 18px -8px rgba(8,50,61,.6)`
- **SVG:** 26×26px

##### `.svc-num`
- **Font-family:** var(--mono) | **Font-size:** 12px | **Font-weight:** 600
- **Letter-spacing:** 0.12em | **Color:** var(--steel)

#### `h3`
- **Font-weight:** 800 | **Font-size:** 1.22rem | **Letter-spacing:** -0.025em
- **Color:** var(--ink) | **Line-height:** 1.25 | **Margin-bottom:** 12px

#### `p`
- **Font-size:** 14.5px | **Line-height:** 1.65 | **Color:** var(--slate) | **Margin-bottom:** 20px

#### `.svc-tags`
- **Display:** flex | **Flex-wrap:** wrap | **Gap:** 7px | **Margin-top:** auto
- **Padding-top:** 18px | **Border-top:** `1px solid var(--line)`
- **Cada tag:** font-family var(--mono), font-size 10px, letter-spacing 0.06em, text-transform uppercase, color var(--petrol), background `rgba(15,76,92,.07)`, border `1px solid rgba(15,76,92,.14)`, padding 5px 10px, border-radius 999px

---

**Conteúdo dos cards 02–04:**

| Num | SVG (viewBox 0 0 24 24) | h3 | p (resumido) | Tags |
|-----|------------------------|----|--------------|------|
| `02` | `<path d="M4 19h16"/><path d="M7 16V9M11.5 16V5M16 16v-4"/><circle cx="19" cy="6" r="2.2"/><path d="m20.6 7.6 1.4 1.4"/>` | `Observabilidade &amp; Engenharia de Logs` | Observabilidade completa na AWS com métricas, logs e tracing centralizados. Alertas inteligentes e análise comportamental para detectar falhas e ameaças antes que impactem o negócio. | `Métricas` · `Logs` · `Tracing` |
| `03` | `<path d="M2 16.5c2-1.2 4-1.2 6 0s4 1.2 6 0"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 9.2v.2M12 10.6v.2"/><path d="M18 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8"/>` | `FinOps &amp; Otimização de Custos` | Auditoria completa da sua fatura AWS. Identificação de desperdícios, tags de alocação, rightsizing de recursos e estratégias de compra para reduzir drasticamente o seu TCO. | `Savings Plans` · `Rightsizing` · `Tags` |
| `04` | `<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>` | `DevOps &amp; Entrega Contínua` | Criação de pipelines de CI/CD e infraestrutura como código. Crio o "botão mágico" que permite à sua equipe fazer deploys seguros, repetíveis e sem medo — com cultura de entrega contínua. | `GitHub Actions` · `Terraform` · `CI/CD` |

---

## MAKING OF (INTERCALADO)

> **Posição na página:** Entre a Parte 1 dos serviços (01 wide + 02–04) e a Parte 2 (05–11).  
> Esta seção foi **reposicionada** da versão 1.0 (onde ficava após todos os cards) para criar variedade visual e separar o CTA Final de seções dark adjacentes.

### `section.makingof` (`data-screen-label="Making Of"`)
- **Background:** var(--surface)
- **Border-top:** `1px solid var(--line)`
- **Border-bottom:** `1px solid var(--line)`

### `.makingof-in`
- **Max-width:** 1240px | **Margin:** 0 auto | **Padding:** 84px 40px
- **Display:** grid | **Grid-template-columns:** `1fr 1fr` | **Gap:** 64px | **Align-items:** center

---

### Coluna Esquerda (`.mo-left`)
- **Display:** flex | **Flex-direction:** column

#### `.mo-ey`
- **Font-family:** var(--mono) | **Font-size:** 11px | **Letter-spacing:** 0.22em
- **Text-transform:** uppercase | **Color:** var(--clay)
- **Display:** flex | **Align-items:** center | **Gap:** 12px | **Margin-bottom:** 18px
- **`::before`:** content "", width 30px, height 1px, background var(--clay)
- **Conteúdo:** `Prova viva`

#### `h2`
- **Font-weight:** 800 | **Font-size:** `clamp(1.8rem, 2.8vw, 2.35rem)`
- **Letter-spacing:** -0.04em | **Color:** var(--ink) | **Line-height:** 1.1
- **Text-wrap:** balance | **Margin-bottom:** 16px
- **`em`:** font-style italic, color var(--petrol)
- **Conteúdo:** `Não acredite apenas na minha palavra. Veja o <em>making of</em>.`

#### `p`
- **Font-size:** 1.0625rem | **Line-height:** 1.7 | **Color:** var(--slate)
- **Max-width:** 480px | **Margin-bottom:** 30px
- **Conteúdo:** `Este blog, da infraestrutura serverless ao frontend Next.js, foi construído com as exatas metodologias que ofereço — e cada decisão está documentada publicamente.`

#### `.mo-cta` (link → O Projeto.html)
- **Display:** inline-flex | **Align-items:** center | **Gap:** 10px | **Width:** fit-content
- **Font-weight:** 600 | **Font-size:** 15px | **Color:** var(--petrol)
- **Border:** `1.5px solid rgba(15,76,92,.35)` | **Padding:** 14px 26px | **Border-radius:** 12px
- **Transition:** background .2s, color .2s, border-color .2s, transform .15s
- **Hover:** background var(--petrol), color #fff, border-color var(--petrol), transform translateY(-1px)
- **`.arrow`:** font-family var(--mono)
- **Conteúdo:** `Conheça "O Projeto" <span class="arrow">→</span>`

---

### Coluna Direita (`.mo-right`)
- **Position:** relative

#### Proof Card (`.proof-card`)
- **Background:** var(--petrol) | **Border-radius:** 18px | **Padding:** 32px 34px
- **Position:** relative | **Overflow:** hidden | **Isolation:** isolate
- **Box-shadow:** `0 24px 50px -24px rgba(8,50,61,.5)`

##### `::before` (overlay)
- **Content:** "" | **Position:** absolute | **Inset:** 0 | **Z-index:** 0 | **Pointer-events:** none | **Opacity:** 0.5
- **Background (3 camadas):**
  1. `radial-gradient(60% 70% at 90% 8%, rgba(201,96,60,.34), transparent 58%)`
  2. `linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px) 0 0/100% 48px`
  3. `linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px) 0 0/48px 100%`
- **Mask:** `radial-gradient(ellipse at 75% 15%, #000 30%, transparent 80%)`

##### `> *` (todos filhos diretos)
- **Position:** relative | **Z-index:** 1

##### `.proof-label`
- **Font-family:** var(--mono) | **Font-size:** 10.5px | **Letter-spacing:** 0.16em
- **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.6)`
- **Display:** flex | **Align-items:** center | **Gap:** 9px | **Margin-bottom:** 22px
- **`.dot`:** width 7px, height 7px, border-radius 50%, background var(--moss), box-shadow `0 0 0 3px rgba(63,107,71,.25)`
- **Conteúdo:** `Construído em público`

##### `.proof-stack`
- **Display:** flex | **Flex-direction:** column | **Gap:** 14px

##### `.proof-item`
- **Display:** flex | **Align-items:** center | **Gap:** 14px

###### `.pi-ic`
- **Flex:** none | **Width:** 40px | **Height:** 40px | **Border-radius:** 11px
- **Background:** `rgba(255,255,255,.07)` | **Border:** `1px solid rgba(255,255,255,.14)`
- **Color:** var(--petrol-soft) | **Display:** flex | **Align-items:** center | **Justify-content:** center
- **SVG:** 20×20px

###### `.pi-txt`
- **Display:** flex | **Flex-direction:** column | **Gap:** 2px

###### `.pi-t`
- **Font-weight:** 700 | **Font-size:** 14.5px | **Color:** #fff | **Letter-spacing:** -0.01em

###### `.pi-d`
- **Font-family:** var(--mono) | **Font-size:** 11px | **Letter-spacing:** 0.04em | **Color:** `rgba(255,255,255,.5)`

**Conteúdo dos 3 itens:**

| SVG (24×24) | pi-t | pi-d |
|-------------|------|------|
| `<path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z"/>` (raio/lambda) | `Backend 100% serverless` | `Lambda · API Gateway · DynamoDB` |
| `<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>` (engrenagem/sol) | `Deploy por código` | `GitHub Actions · Terraform` |
| `<path d="M4 19h16"/><path d="M7 16V9M11.5 16V5M16 16v-4"/>` (gráfico) | `Custo e métricas expostos` | `CloudWatch · Dashboard público` |

##### `.proof-foot`
- **Margin-top:** 24px | **Padding-top:** 20px | **Border-top:** `1px solid rgba(255,255,255,.1)`
- **Display:** flex | **Align-items:** center | **Gap:** 12px

###### `.pf-stack`
- **Display:** flex | **Flex-direction:** column | **Gap:** 2px

###### `.pf-v`
- **Font-weight:** 800 | **Font-size:** 1.5rem | **Letter-spacing:** -0.03em | **Color:** #fff | **Line-height:** 1

###### `.pf-l`
- **Font-family:** var(--mono) | **Font-size:** 10.5px | **Letter-spacing:** 0.1em | **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.5)`

**Conteúdo das 2 stats do footer:**

| pf-v | pf-l | Style extra |
|------|------|-------------|
| `~100%` | `Construído com IA` | — |
| `12 mo` | `Em produção` | `style="margin-left:auto;text-align:right"` |

---

## SERVIÇOS — PARTE 2

> **Nota de estrutura:** Segunda seção de serviços, após o Making Of. Não tem heading próprio — é continuação direta dos serviços. Padding-top reduzido (64px) para suavizar a entrada após a seção branca do Making Of.

### `section.section` (`style="padding-top:64px"`, `data-screen-label="Mais Serviços"`)
- **Padding:** 64px 0 96px *(padding-top inline, padding-bottom da classe)*
- **Background:** var(--ivory)

### `.wrap`
- **Max-width:** 1240px | **Margin:** 0 auto | **Padding:** 0 40px

### Grid (`.svc-grid`)
- **Display:** grid | **Grid-template-columns:** `repeat(3, 1fr)` | **Gap:** 22px
- **Sem heading** — entra direto no grid

---

### Card Destaque — Arquitetura AWS (`.svc-card.feat`) — Card 06

> Variante com visual diferenciado (accent clay). Ocupa posição normal no grid (1 célula, não wide).

#### Modificadores do `.svc-card.feat`:
- **Background:** `linear-gradient(135deg, var(--surface) 0%, rgba(243,221,208,.18) 100%)`
- **Border-color:** `rgba(201,96,60,.3)`
- **`::after`:** background `linear-gradient(90deg, var(--clay), var(--petrol))`

#### `.svc-icon` (dentro do .feat):
- **Background:** `linear-gradient(150deg, var(--clay) 0%, var(--clay-hover) 100%)`
- **Box-shadow:** `0 8px 18px -8px rgba(201,96,60,.55)`

#### `.svc-num` (numeração no topo direito):
- **Font-family:** var(--mono) | **Font-size:** 12px | **Font-weight:** 600 | **Letter-spacing:** 0.12em | **Color:** var(--steel)
- **Conteúdo:** `06`
- **Nota:** na v1 este card usava o badge `.feat-tag` com o texto "Destaque". Como agora **todos os cards são numerados sequencialmente**, o badge foi substituído pelo número `06`. O destaque visual do card permanece via o gradiente clay de fundo e o ícone laranja.

---

**Conteúdo dos cards 05–11:** *(cards quadrados; o card 08 Transformação Digital é wide — ver subseção abaixo)*

| Num | SVG (26×26px, stroke 1.8) | h3 | p (resumido) | Tags |
|-----|--------------------------|-----|--------------|------|
| `05` | `<path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z"/>` | `Desenvolvimento Serverless` | Construção de backends e APIs de alta performance e custo zero quando ociosos. Especialista em escalar do zero a milhões de usuários sem gerenciar servidores. | `Lambda` · `API Gateway` · `DynamoDB` |
| `06` *(feat)* | `<path d="M17.5 19a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.6-1.4A4 4 0 0 0 6 19h11.5z"/>` | `Arquitetura de Nuvem (AWS)` | Desenho e implementação de soluções robustas e escaláveis na AWS. Foco em arquiteturas que equilibram performance, custo e segurança — usando os serviços certos para o seu problema. | `EC2` · `Containers` · `VPC` |
| `07` | `<path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/>` | `Segurança em Nuvem` | Auditoria completa da sua conta AWS baseada no Well-Architected Framework. Identificação de vulnerabilidades, configurações inadequadas e plano de remediação priorizado. | `Well-Architected` · `Auditoria` · `Remediação` |
| `09` | `<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>` | `SysAdmin &amp; Servidores Linux` | Administração e manutenção de servidores Linux em produção. Hardening de segurança, scripting em Bash, tuning de performance e automação operacional com foco em confiabilidade e rastreabilidade. | `Bash` · `Systemd` · `Hardening` |
| `10` | `<path d="M4 8h13M4 8l4-4M4 8l4 4"/><path d="M20 16H7M20 16l-4-4M20 16l-4 4"/>` | `Migração de Aplicações` | Migração de aplicações da e para a nuvem com plano de risco controlado. Rehosting, replatforming e modernização — do legado on-premise ao ambiente AWS, sem downtime surpresa. | `Rehosting` · `Replatforming` · `Zero-downtime` |
| `11` | `<rect x="3" y="3" width="8" height="8" rx="2"/><path d="M7 11v3a2 2 0 0 0 2 2h4"/><rect x="13" y="13" width="8" height="8" rx="2"/>` | `Automação de Processos` | Automatizo qualquer tarefa repetitiva — de rotinas operacionais a fluxos de negócio. Scripts, integrações e robôs que eliminam o trabalho manual, reduzem erros e devolvem horas produtivas à sua equipe. | `Scripts` · `Integrações` · `Webhooks` |

---

### Card Wide — Transformação Digital (`.svc-card.wide.alt`) — Card 08

> Segundo card de destaque full-width (`grid-column: 1 / -1`), posicionado **entre o card 07 (Segurança) e o card 09 (SysAdmin)** — quebra o grid no meio da Parte 2. Usa a **variante escura** (`.alt`) para se diferenciar do card wide claro (IA Aplicada, card 01) e dos cards comuns (ícone teal).

#### Modificadores do `.svc-card.wide.alt`:
- **Background:** `linear-gradient(120deg, var(--petrol-deep) 0%, var(--petrol) 145%)` *(bloco escuro sólido)*
- **Border-color:** transparent
- **Box-shadow:** `0 22px 50px -26px rgba(8,50,61,.7)` | **Hover:** `0 28px 62px -24px rgba(8,50,61,.8)`
- **`::after`:** background `linear-gradient(90deg, var(--clay), var(--petrol-soft))`

#### Texto e acentos (sobre fundo escuro):
- **`.svc-icon`:** background `rgba(255,255,255,.09)`, border `1px solid rgba(255,255,255,.16)`, box-shadow none, color #fff
- **`.svc-wide-num`:** color var(--clay) — **Conteúdo:** `08`
- **`.wtag`:** color var(--petrol-soft) — **Conteúdo:** `Destaque · Estratégia`
- **`h3`:** color #fff — **Conteúdo:** `Transformação Digital`
- **`p`:** color `rgba(250,248,243,.70)` — **Conteúdo:** "Levo a tecnologia para perto de quem decide. Tiro o papel e o retrabalho da operação, deixo seus dados em conformidade e faço seus sistemas conversarem entre si — sem jargão, com foco em resultado."

#### Ícone (SVG 30×30px) — foguete/transformação:
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
</svg>
```

#### Mini-lista (`.wide-list`)
- **List-style:** none | **Display:** flex | **Flex-direction:** column | **Gap:** 8px | **Margin-top:** 14px | **Max-width:** 780px
- **`li`:** position relative, padding-left 24px, font-size 13.5px, line-height 1.5, color `rgba(250,248,243,.70)`
- **`li strong`:** color #fff, font-weight 600
- **`li::before`:** content `✓`, position absolute, left 2px, top 0, color var(--clay), font-size 12.5px, font-weight 700
- **Itens:**
  1. **Apps internos rápidos** para digitalizar formulários em papel e fluxos de aprovação
  2. **Conformidade &amp; segurança** — adequação à LGPD e rotinas automáticas de backup
  3. **Integração de sistemas** que você já usa, para eles "conversarem" e eliminarem a digitação dupla

#### Tags (`.svc-wide-tags` — versão clara sobre dark):
- **Border-left-color:** `rgba(255,255,255,.14)`
- **Cada tag:** color #fff, background `rgba(255,255,255,.09)`, border `1px solid rgba(255,255,255,.18)`
- **Tags:** `Modernização` · `Conformidade` · `Eficiência`

---

## CTA FINAL

### `section.cta-final#contato` (`data-screen-label="CTA Contato"`)
- **Background:** var(--petrol) | **Color:** var(--ivory)
- **Position:** relative | **Overflow:** hidden | **Isolation:** isolate

### `::before` (overlay)
- **Content:** "" | **Position:** absolute | **Inset:** 0 | **Opacity:** 0.55 | **Pointer-events:** none | **Z-index:** 0
- **Background (4 camadas):**
  1. `radial-gradient(45% 80% at 100% 0%, rgba(201,96,60,.32), transparent 55%)`
  2. `radial-gradient(45% 80% at 0% 100%, rgba(91,139,150,.22), transparent 60%)`
  3. `linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px) 0 0/100% 80px`
  4. `linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px) 0 0/80px 100%`
- **Mask:** `radial-gradient(ellipse at 50% 35%, #000 30%, transparent 80%)`

### `.cta-final-in`
- **Position:** relative | **Z-index:** 1 | **Max-width:** 1240px | **Margin:** 0 auto
- **Padding:** 88px 40px
- **Display:** grid | **Grid-template-columns:** `1.05fr .95fr` | **Gap:** 64px | **Align-items:** center

---

### Coluna Esquerda (`.cf-left`)
- **Display:** flex | **Flex-direction:** column

#### `.ey` (eyebrow)
- **Font-family:** var(--mono) | **Font-size:** 11px | **Letter-spacing:** 0.22em
- **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.72)`
- **Display:** flex | **Align-items:** center | **Gap:** 12px | **Margin-bottom:** 20px
- **`::before`:** content "", width 30px, height 1px, background var(--clay)
- **Conteúdo:** `Vamos começar`

#### `h2`
- **Font-weight:** 800 | **Font-size:** `clamp(2.1rem, 3.8vw, 2.9rem)`
- **Line-height:** 1.05 | **Letter-spacing:** -0.04em | **Color:** #fff
- **Margin-bottom:** 18px | **Text-wrap:** balance | **Max-width:** 500px
- **`em`:** font-style italic, color var(--petrol-soft)
- **Conteúdo:** `Vamos trabalhar <em>juntos</em>?`

#### `.desc`
- **Font-size:** 1.0625rem | **Line-height:** 1.6 | **Color:** `rgba(250,248,243,.66)`
- **Max-width:** 440px
- **Conteúdo:** `Agende uma chamada inicial de 30 minutos. Sem custo, sem compromisso — só clareza sobre como posso ajudar.`

#### `.cf-points` (`ul`)
- **Display:** flex | **Flex-direction:** column | **Gap:** 14px | **Margin-top:** 30px

##### `li`
- **List-style:** none | **Display:** flex | **Align-items:** flex-start | **Gap:** 13px
- **Font-size:** 15px | **Line-height:** 1.5 | **Color:** `rgba(250,248,243,.9)`

###### `.ck` (checkmark)
- **Flex:** none | **Width:** 24px | **Height:** 24px | **Border-radius:** 8px | **Margin-top:** 1px
- **Background:** `rgba(201,96,60,.2)` | **Color:** `#E8A582`
- **Display:** flex | **Align-items:** center | **Justify-content:** center
- **`.ck svg`:** width 14px, height 14px, stroke-width 3

**3 pontos (texto com `<b>` destacado):**
1. `Diagnóstico objetivo da sua <b>infraestrutura</b> e dos próximos passos`
2. `Plano de ação claro, <b>sem pressão de venda</b>`
3. `Resposta em até <b>24h</b>, 100% remoto`

---

### Coluna Direita — Glass Card (`.cf-card`)
- **Background:** `rgba(255,255,255,.05)` | **Border:** `1px solid rgba(255,255,255,.14)`
- **Border-radius:** 20px | **Padding:** 36px 36px 32px
- **Backdrop-filter:** blur(4px) | **Box-shadow:** `0 30px 70px -30px rgba(0,0,0,.6)`

#### `.tagline`
- **Font-family:** var(--mono) | **Font-size:** 10.5px | **Letter-spacing:** 0.16em
- **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.6)`
- **Display:** flex | **Align-items:** center | **Gap:** 9px | **Margin-bottom:** 20px
- **`.dot`:** 7px, moss, animation pulse
- **Conteúdo:** `Disponível para novos projetos`

#### `h3`
- **Font-weight:** 800 | **Font-size:** 1.5rem | **Letter-spacing:** -0.03em | **Color:** #fff | **Line-height:** 1.18
- **Conteúdo:** `Vamos conversar sobre o seu`

#### `.sub`
- **Font-size:** 14.5px | **Line-height:** 1.6 | **Color:** `rgba(250,248,243,.66)` | **Margin-top:** 12px
- **Conteúdo:** `Conte o desafio e eu retorno com um plano objetivo. Diagnóstico inicial gratuito.`

#### `.cf-meta`
- **Display:** flex | **Flex-direction:** column | **Gap:** 0 | **Margin:** 24px 0
- **Border-top:** `1px solid rgba(255,255,255,.1)` | **Border-bottom:** `1px solid rgba(255,255,255,.1)`

##### `.cf-meta-row`
- **Display:** flex | **Align-items:** center | **Justify-content:** space-between | **Gap:** 12px | **Padding:** 13px 0
- **Border-bottom:** `1px solid rgba(255,255,255,.08)`
- **`:last-child`:** border-bottom none

###### `.ml` (meta label)
- **Font-family:** var(--mono) | **Font-size:** 10.5px | **Letter-spacing:** 0.1em
- **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.5)`

###### `.mv` (meta value)
- **Font-weight:** 700 | **Font-size:** 14px | **Color:** #fff | **Letter-spacing:** -0.01em
- **`.mv.clay`:** color `#E8A582`

**3 linhas de meta:**

| ml | mv | Classe mv |
|----|-----|-----------|
| `Chamada inicial` | `30 min · gratuita` | `clay` |
| `Formato` | `100% remoto` | — |
| `Tempo de resposta` | `até 24h` | — |

#### `.btn-clay-final` (link → `mailto:contato@marcelogoncalves.com`)
- **Display:** flex | **Align-items:** center | **Justify-content:** center | **Gap:** 10px
- **Width:** 100% | **Background:** var(--clay) | **Color:** #fff | **Border:** none
- **Height:** 58px | **Border-radius:** 14px | **Font-family:** var(--font) | **Font-weight:** 600 | **Font-size:** 15.5px
- **Box-shadow:** `0 14px 30px -10px rgba(201,96,60,.6)`
- **Transition:** background .2s, transform .2s
- **Hover:** background var(--clay-hover), transform translateY(-2px)
- **Conteúdo:** `Entrar em contato <span class="arrow">→</span>`

#### `.reassure`
- **Text-align:** center | **Margin-top:** 16px | **Font-family:** var(--mono)
- **Font-size:** 10.5px | **Letter-spacing:** 0.1em | **Text-transform:** uppercase | **Color:** `rgba(255,255,255,.5)`
- **Conteúdo:** `Sem compromisso · sem custo`

---

## FOOTER

Idêntico ao das demais páginas do sistema. Resumido aqui para referência de estrutura e conteúdo específico desta página.

### `footer.site`
- **Background:** var(--petrol-deep) | **Color:** #A8C0C6
- **Position:** relative | **Overflow:** hidden | **Isolation:** isolate

### `.foot-in`
- **Max-width:** 1240px | **Margin:** 0 auto | **Padding:** 0 40px 26px | **Position:** relative | **Z-index:** 1

### `.foot-lead` (`padding: 60px 0 40px`, `border-bottom: 1px solid rgba(255,255,255,.08)`)
- **Manifesto:** `Engenharia, IA e automação — <em>decifradas</em> por quem constrói em produção.`
- **Botão:** `<button id="toTop">Voltar ao topo + ↑</button>`

### `.foot-top` (grid 4 colunas, `padding: 48px 0 44px`)

**Coluna 1 — `.foot-brand`:**
- `Marcelo<span class="b2">Gonçalves</span>` (b2: color petrol-soft)
- `p`: `Tutoriais, bastidores e decisões reais de um blog construído do zero na AWS, quase 100% com IA.`
- `.badge`: `No ar · construído com IA`

**Coluna 2 — Categorias:**
`Inteligência Artificial` · `DevOps` · `Cloud · AWS` · `Engenharia`

**Coluna 3 — Links Rápidos:**
`Home (Home.html)` · `O Projeto (O Projeto.html)` · `Serviços (#)` · `Sobre (Sobre.html)`

**Coluna 4 — Contato:**
- Email: `contato@marcelogoncalves.com`
- Sociais: LinkedIn · Instagram · X

### `.foot-watermark`
`MarceloGonçalves` (texto gigante decorativo, transparente)

### `.foot-bottom`
`© 2026 Marcelo Gonçalves · Todos os direitos reservados` · `Privacidade` · `Termos` · `RSS`

---

## RESPONSIVIDADE

### `@media (max-width: 1040px)`
- `.hero-in`: grid-template-columns 1fr, gap 40px, padding-top 72px
- `.hero-panel`: min-width 0, width 100%, max-width 380px
- `.svc-grid`: grid-template-columns 1fr 1fr
- `.svc-card.wide`: flex-direction column, align-items flex-start, gap 22px
- `.svc-wide-tags`: flex-direction row, flex-wrap wrap, align-items center, padding-left 0, border-left none, padding-top 18px, border-top `1px solid var(--line)`, width 100%, justify-content flex-start
- `.makingof-in`: grid-template-columns 1fr, gap 44px
- `.cta-final-in`: grid-template-columns 1fr, gap 44px
- `.foot-top`: grid-template-columns 1fr 1fr, gap 36px 32px
- `.foot-brand`: grid-column 1 / -1

### `@media (max-width: 680px)`
- `.stats-strip`: flex-wrap wrap
- `.stat-item`: flex 1 1 40%, border-right none, border-bottom `1px solid rgba(255,255,255,.08)`, padding 20px 0
- `.svc-grid`: grid-template-columns 1fr
- `.svc-card.wide`: grid-column auto *(anula o 1 / -1 do desktop)*
- `.wrap`, `.makingof-in`, `.cta-final-in`: padding-left 20px, padding-right 20px
- `.stats-strip`, `.hero-in`: padding-left 20px, padding-right 20px
- `.foot-top`: grid-template-columns 1fr
- `.foot-in`: padding 0 20px 20px

---

## SCRIPTS E INTERATIVIDADE

### Progress Bar
```javascript
const prog = document.getElementById('progress');
const onScroll = () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();
```

### Voltar ao Topo
```javascript
document.getElementById('toTop').addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

---

## ORDEM DOS BLOCOS NO BODY

```
1. <div class="progress" id="progress">              ← barra de leitura (fixed)
2. <header class="nav">                              ← nav sticky (z:50)
3. <section class="hero">                            ← hero dark (2 colunas)
   └── .hero-in (hero-left + hero-panel)
   └── .stats-strip
4. <section class="section" id="servicos">           ← serviços parte 1 (padding: 96px 0)
   └── .wrap > .sec-head (centralizado)
   └── .wrap > .svc-grid
       ├── .svc-card.wide       ← 01 IA Aplicada (destaque full-width, accent clay)
       ├── .svc-card            ← 02 Observabilidade
       ├── .svc-card            ← 03 FinOps
       └── .svc-card            ← 04 DevOps & Entrega Contínua
5. <section class="makingof">                        ← making of (intercalado, surface bg)
   └── .makingof-in (mo-left + mo-right/proof-card)
6. <section class="section" style="padding-top:64px"> ← serviços parte 2 (continuação)
   └── .wrap > .svc-grid
       ├── .svc-card            ← 05 Desenvolvimento Serverless
       ├── .svc-card.feat       ← 06 Arquitetura AWS (destaque clay)
       ├── .svc-card            ← 07 Segurança
       ├── .svc-card.wide.alt   ← 08 Transformação Digital (destaque escuro, full-width)
       ├── .svc-card            ← 09 SysAdmin Linux
       ├── .svc-card            ← 10 Migração
       └── .svc-card            ← 11 Automação de Processos
7. <section class="cta-final" id="contato">          ← CTA contato (petrol, dark)
   └── .cta-final-in (cf-left + cf-card)
8. <footer class="site">                             ← footer (petrol-deep)
   └── .foot-in > .foot-lead + .foot-top + .foot-watermark + .foot-bottom
```

> **Nota de design:** O Making Of (bloco branco, surface) intercalado entre as duas partes dos cards cria uma quebra de ritmo visual intencional. A Parte 2 dos serviços tem `padding-top: 64px` (em vez de 96px) para suavizar a reentrada após a seção branca, reduzindo o gap visual percebido sem quebrar o espaçamento interno dos cards.

---

**Fim da Especificação — Serviços v1.1**

Este documento permite reconstrução pixel-perfeita da página Serviços, incluindo a nova disposição com Making Of intercalado.
