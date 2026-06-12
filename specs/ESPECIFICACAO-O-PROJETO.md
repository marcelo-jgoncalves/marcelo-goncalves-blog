# ESPECIFICAÇÃO: Página "O Projeto"

**Versão:** 1.0  
**Data:** 2026  
**Status:** Completo e pixel-perfeito

---

## SETUP E BOILERPLATE

- **Doctype:** `<!doctype html>`
- **Lang:** pt-BR
- **Charset:** utf-8
- **Title:** `O Projeto — Marcelo Gonçalves`
- **Viewport:** `width=device-width, initial-scale=1`
- **Google Fonts:** Inter (400–900) + JetBrains Mono (400, 500, 600)

---

## CSS RESET E BASE

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--ivory); color: var(--ink); font-family: var(--font);
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; line-height: 1.6;
}
a { color: inherit; text-decoration: none; }
::selection { background: var(--clay-soft); color: var(--clay-hover); }
```

### `.wrap`
- **Max-width:** 1180px *(nota: esta página usa 1180px, não 1240px como as demais)*
- **Margin:** 0 auto
- **Padding:** 0 40px

---

## HEADER/NAV

- Estrutura e estilos idênticos ao padrão do sistema (ver ESPECIFICACAO-HOME.md seção HEADER/NAV)
- **Nav link ativo:** "O Projeto" — `class="active"`, `href="#"`
- **Demais links:** Home (`Home.html`) · Artigos (`Artigos.html`) · Serviços (`Serviços.html`) · Sobre (`Sobre.html`)
- **Nav CTA:** `href="Serviços.html#contato"` — texto `Entrar em contato →`

---

## ESTRUTURA DO BODY

```
1. <div class="progress" id="progress">      ← barra de leitura (fixed)
2. <header class="nav">                      ← nav sticky
3. <section class="hero">                    ← hero dark + stats-strip
4. <div class="wrap">                        ← contéiner principal do conteúdo
   ├─ .about-strip       (margin-top: 80px)
   ├─ section#timeline   (margin-top: 96px)
   ├─ .paginator         (margin-top: 36px)
   └─ section#roadmap    (margin-top: 96px)
5. <section class="cta-adv" id="assessoria"> ← CTA petrol
6. <footer class="site">                     ← footer petrol-deep
```

---

## ÍNDICE

1. [Hero (Dark)](#hero-dark)
2. [Stats Strip](#stats-strip)
3. [About Strip](#about-strip)
4. [Timeline de Posts](#timeline-de-posts)
5. [Paginator](#paginator)
6. [Roadmap (Próximas Etapas)](#roadmap-próximas-etapas)
7. [CTA Assessoria](#cta-assessoria)

---

## HERO (DARK)

### Container Principal
- **Classe:** `.hero`
- **Background:** `#08323D` (var(--petrol-deep))
- **Color:** `#FAF8F3` (var(--ivory))
- **Position:** relative
- **Isolation:** isolate
- **Decorative overlay (::before):**
  - Position: absolute
  - Inset: 0 (cobre tudo)
  - Z-index: 0
  - Pointer-events: none
  - Opacity: 0.55
  - Background layers (4):
    1. Radial gradient: 50% 70% at 100% 0%, `rgba(201,96,60,0.3)` → transparent 55%
    2. Radial gradient: 40% 60% at 0% 100%, `rgba(91,139,150,0.2)` → transparent 60%
    3. Linear gradient horizontal: `rgba(255,255,255,0.04)` 1px lines, 80px spacing
    4. Linear gradient vertical: `rgba(255,255,255,0.04)` 1px lines, 80px spacing
  - Mask: radial-gradient(ellipse at 60% 30%, #000 25%, transparent 75%)

### Hero Inner Content (`.hero-in`)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1180px
- **Margin:** 0 auto
- **Padding:** 96px 40px 48px
- **Display:** grid
- **Grid-template-columns:** 1fr auto
- **Gap:** 60px
- **Align-items:** center

### Left Column (`.hero-left`)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 0

#### Eyebrow Label (`.ey`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** `rgba(255,255,255,0.65)`
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 22px
- **::before pseudo-element:**
  - Content: ""
  - Width: 30px
  - Height: 1px
  - Background: `#C9603C` (var(--clay))

**Conteúdo:** "O Projeto · Build in Public"

#### H1 (Título Principal)
- **Font-weight:** 800
- **Font-size:** clamp(2.4rem, 4.5vw, 3.6rem)
- **Line-height:** 1.04
- **Letter-spacing:** -0.04em
- **Color:** #fff
- **Max-width:** 600px
- **Text-wrap:** balance
- **Margin-bottom:** 20px
- **Em tags:** font-style: italic, color: `#5B8B96` (var(--petrol-soft))

**Conteúdo:** "Construindo este blog em público, *do zero*"

#### Subtitle (`.sub`)
- **Font-size:** 1.075rem
- **Line-height:** 1.65
- **Color:** `rgba(250,248,243,0.64)`
- **Max-width:** 520px
- **Margin-bottom:** 36px

**Conteúdo:** "Cada decisão de arquitetura, cada erro, cada custo — documentados em tempo real. Um registro honesto de como se constrói uma plataforma editorial com AWS e IA."

#### Actions Container (`.hero-actions`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 16px
- **Flex-wrap:** wrap

##### Primary Button (`.btn-clay-hero`)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 10px
- **Background:** `#C9603C` (var(--clay))
- **Color:** #fff
- **Font-weight:** 600
- **Font-size:** 15px
- **Padding:** 14px 26px
- **Border-radius:** 12px
- **Box-shadow:** 0 8px 22px rgba(201,96,60,0.35)
- **Transition:** background 0.2s, transform 0.2s
- **Hover state:**
  - Background: `#A94C2D` (var(--clay-hover))
  - Transform: translateY(-2px)

**Conteúdo:** "Ver a jornada →"

##### Status Badge (`.status-badge`)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 9px
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.12em
- **Text-transform:** uppercase
- **Color:** `rgba(255,255,255,0.75)`
- **Background:** `rgba(255,255,255,0.06)`
- **Border:** 1px solid `rgba(255,255,255,0.14)`
- **Padding:** 10px 16px
- **Border-radius:** 999px

**Conteúdo:** "• Em produção · Fase 1"

###### Animated Dot (`.dot`)
- **Width:** 8px
- **Height:** 8px
- **Border-radius:** 50%
- **Background:** `#3F6B47` (var(--moss))
- **Box-shadow:** 0 0 0 3px rgba(63,107,71,0.3)
- **Animation:** pulse 2.4s ease-in-out infinite
- **Keyframes pulse:**
  - 0%, 100%: box-shadow: 0 0 0 3px rgba(63,107,71,0.3)
  - 50%: box-shadow: 0 0 0 5px rgba(63,107,71,0.15)

### Right Column (`.hero-stat`)
- **Display:** flex
- **Flex-direction:** column
- **Align-items:** flex-end
- **Padding-right:** 8px
- **Align-self:** center
- **Padding-bottom:** 32px
- **Gap:** 0

#### Stat Item (`.hstat-item`)
- **Display:** flex
- **Flex-direction:** column
- **Align-items:** flex-end
- **Padding-bottom:** 16px
- **Border-bottom:** 1px solid `rgba(255,255,255,0.14)`

**Modificador `.clay-item`:**
- **Border-bottom-color:** `rgba(201,96,60,0.35)`

#### Big Number (`.big`)
- **Display:** block
- **Font-weight:** 900
- **Font-size:** clamp(7rem, 12vw, 10.5rem)
- **Line-height:** 1.15
- **Letter-spacing:** -0.07em
- **Padding:** 16px 8px
- **Background:** linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.35) 100%)
- **-webkit-background-clip:** text
- **Background-clip:** text
- **-webkit-text-fill-color:** transparent

**Modificador `.clay-num`:**
- **Background:** linear-gradient(180deg, var(--clay) 0%, rgba(201,96,60,0.5) 100%)
- Mesmo clipping aplicado

#### Caption (`.cap`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-top:** 4px
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** `rgba(255,255,255,0.55)`

**Modificador `.clay-cap`:**
- **Color:** `rgba(201,96,60,0.85)`

**Conteúdo (item 1):**
- Big: "12"
- Cap: "posts publicados"

**Conteúdo (item 2):**
- Big: "6"
- Cap: "próximas etapas"

---

## STATS STRIP

### Container (`.stats-strip`)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1180px
- **Margin:** 0 auto
- **Display:** flex
- **Padding:** 0 40px
- **Border-top:** 1px solid `rgba(255,255,255,0.1)`

### Stat Item (`.stat-item`)
- **Flex:** 1
- **Padding:** 28px 28px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 5px
- **Border-right:** 1px solid `rgba(255,255,255,0.08)`

**Modificadores:**
- **:first-child:** padding-left: 0
- **:last-child:** border-right: none

#### Value (`.v`)
- **Font-weight:** 800
- **Font-size:** 1.8rem
- **Letter-spacing:** -0.03em
- **Color:** #fff
- **Line-height:** 1

#### Label (`.l`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** `rgba(255,255,255,0.5)`
- **Margin-top:** 2px

**Conteúdo (4 itens):**

| Value | Label |
|-------|-------|
| 12 | Posts publicados |
| 4 mo | Em produção |
| 12 | Serviços AWS |
| ~100% | Construído com IA |

---

## ABOUT STRIP

### Container (`.about-strip`)
- **Margin-top:** 80px
- **Background:** #fff (var(--surface))
- **Border:** 1px solid `#E4DDD0` (var(--line))
- **Border-radius:** 18px
- **Padding:** 48px 52px
- **Display:** grid
- **Grid-template-columns:** 1fr 1fr
- **Gap:** 56px
- **Align-items:** center

### Left Column (`.left`)

#### Eyebrow (`.ey2`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** `#C9603C` (var(--clay))
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 18px
- **::before:**
  - Content: ""
  - Width: 30px
  - Height: 1px
  - Background: var(--clay)

**Conteúdo:** "O que é isso"

#### Heading 2
- **Font-weight:** 800
- **Font-size:** 1.9rem
- **Letter-spacing:** -0.035em
- **Color:** `#0C2027` (var(--ink))
- **Line-height:** 1.1
- **Margin-bottom:** 16px
- **Text-wrap:** balance

**Conteúdo:** "Um blog que documenta a própria construção"

#### Paragraphs
- **Font-size:** 1rem
- **Line-height:** 1.7
- **Color:** `#3C5A64` (var(--slate))
- **Margin (p + p):** 12px top

**Strong tags:**
- **Color:** `#A94C2D` (var(--clay-hover))
- **Font-weight:** 600

**Conteúdo:**

Parágrafo 1: "A premissa é simples: construir uma plataforma editorial completa na AWS, usando IA em cada etapa — e publicar tudo. Cada artigo é um registro real de uma decisão tomada, não um tutorial polido a posteriori."

Parágrafo 2: "Nada de **resultados sem o processo**. Os erros ficam. Os custos aparecem. As trocas de stack acontecem ao vivo."

### Right Column (`.right`)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 16px

#### Principle Item (`.principle`)
- **Display:** flex
- **Align-items:** flex-start
- **Gap:** 14px

##### Number Tile (`.tile`)
- **Flex:** none
- **Width:** 36px
- **Height:** 36px
- **Border-radius:** 9px
- **Background:** `#0F4C5C` (var(--petrol))
- **Color:** `#FAF8F3` (var(--ivory))
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Font-weight:** 600
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center

**Conteúdo:** "01", "02", "03", "04"

##### Text Content (`.txt`)

###### Title (`.t`)
- **Font-weight:** 700
- **Font-size:** 14.5px
- **Color:** `#0C2027` (var(--ink))
- **Letter-spacing:** -0.01em

###### Description (`.d`)
- **Font-size:** 13px
- **Line-height:** 1.55
- **Color:** `#3C5A64` (var(--slate))
- **Margin-top:** 3px

**Conteúdo (4 princípios):**

| Número | Título | Descrição |
|--------|--------|-----------|
| 01 | Transparência radical | Custos, erros e decisões erradas são tão importantes quanto os acertos. |
| 02 | IA como copiloto real | Não como hype — como ferramenta com limitações documentadas. |
| 03 | Engenharia em produção | Arquitetura que precisa funcionar de verdade, não só em demos. |
| 04 | Sem pular etapas | Do primeiro commit ao primeiro real de receita — tudo documentado. |

---

## TIMELINE DE POSTS

### Section Container
- **Margin-top:** 96px
- **ID:** timeline

### Section Header (`.sec-header`)
- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 24px
- **Margin-bottom:** 48px
- **Flex-wrap:** wrap

#### Left Block
- **Display:** flex (columnar)

##### Eyebrow (`.sec-eyebrow`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** `#C9603C` (var(--clay))
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 16px
- **::before:**
  - Content: ""
  - Width: 30px
  - Height: 1px
  - Background: var(--clay)

**Conteúdo:** "A jornada"

##### Title (`.sec-title`)
- **Font-weight:** 800
- **Font-size:** clamp(1.8rem, 3vw, 2.4rem)
- **Letter-spacing:** -0.035em
- **Color:** `#0C2027` (var(--ink))
- **Line-height:** 1.1

**Conteúdo:** "Tudo que foi documentado"

##### Description (`.sec-desc`)
- **Font-size:** 1.0625rem
- **Line-height:** 1.65
- **Color:** `#3C5A64` (var(--slate))
- **Max-width:** 580px
- **Margin-top:** 12px

**Conteúdo:** "Em ordem cronológica — cada post é um registro real de uma decisão, erro ou aprendizado."

#### Right Block (`.right`)
- **Display:** flex

##### Count (`.count`)
- **Font-family:** JetBrains Mono
- **Font-size:** 12px
- **Letter-spacing:** 0.08em
- **Color:** `#7E969E` (var(--steel))
- **Display:** flex
- **Align-items:** center
- **Gap:** 8px

**Strong tag:**
- **Color:** `#0F4C5C` (var(--petrol))
- **Font-weight:** 600

**Conteúdo:** "**12** posts publicados"

### Timeline Container (`.timeline`)
- **ID:** timelinePosts
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 16px
- **Conteúdo:** JavaScript renderizado dinamicamente

### Timeline Entry (`.tl-entry`)

> **ESTRUTURA HTML IMPORTANTE:** O `.tl-num-bg` é filho direto de `.tl-card`, NÃO é irmão de `.tl-card`. A estrutura correta é:
> ```html
> <div class="tl-entry">
>   <div class="tl-card [latest]">
>     <div class="tl-num-bg">01</div>   ← DENTRO do .tl-card
>     <div class="tl-card-top">…</div>
>     <h3>…</h3>
>     <p>…</p>
>     <div class="tl-card-foot">…</div>
>   </div>
> </div>
> ```

#### Background Number (`.tl-num-bg`)
- **Position:** absolute
- **Top:** -4px
- **Right:** 18px
- **Font-weight:** 900
- **Font-size:** 7rem
- **Letter-spacing:** -0.08em
- **Line-height:** 1
- **Color:** `#0F4C5C` (var(--petrol))
- **Opacity:** 0.08
- **Pointer-events:** none
- **User-select:** none
- **Z-index:** 0

**Modificador `.latest .tl-num-bg`:**
- **Color:** `#C9603C` (var(--clay))
- **Opacity:** 0.11

#### Card (`.tl-card`)
- **Position:** relative
- **Overflow:** hidden
- **Background:** #fff (var(--surface))
- **Border:** 1px solid `#E4DDD0` (var(--line))
- **Border-radius:** 14px
- **Padding:** 26px 28px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 10px
- **Transition:** transform 0.2s, box-shadow 0.2s, border-color 0.2s
- **Hover state:**
  - Transform: translateY(-2px)
  - Box-shadow: 0 12px 28px -12px rgba(12,32,39,0.12)
  - Border-color: rgba(15,76,92,0.2)

**Modificador `.latest .tl-card`:**
- **Border-color:** `rgba(201,96,60,0.3)`

**> *:not(.tl-num-bg):**
- **Position:** relative
- **Z-index:** 1

##### Top Section (`.tl-card-top`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Flex-wrap:** wrap

###### Category (`.tl-cat`)
- **Font-family:** JetBrains Mono
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** `#C9603C` (var(--clay))
- **Font-weight:** 500

###### Badge (`.tl-badge`)
- **Font-family:** JetBrains Mono
- **Font-size:** 9.5px
- **Letter-spacing:** 0.12em
- **Text-transform:** uppercase
- **Padding:** 4px 10px
- **Border-radius:** 999px
- **Font-weight:** 500

**Modificador `.latest-tag`:**
- **Background:** `#F3DDD0` (var(--clay-soft))
- **Color:** `#A94C2D` (var(--clay-hover))
- **Border:** 1px solid `rgba(201,96,60,0.25)`

**Modificador `.pub`:**
- **Background:** `rgba(15,76,92,0.08)`
- **Color:** `#0F4C5C` (var(--petrol))
- **Border:** 1px solid `rgba(15,76,92,0.2)`

##### Heading 3 (`.tl-card h3`)
- **Font-weight:** 800
- **Font-size:** 1.2rem
- **Letter-spacing:** -0.025em
- **Color:** `#0F4C5C` (var(--petrol))
- **Line-height:** 1.25

##### Paragraph (`.tl-card p`)
- **Font-size:** 14.5px
- **Line-height:** 1.6
- **Color:** `#3C5A64` (var(--slate))
- **Max-width:** 680px

##### Footer (`.tl-card-foot`)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Padding-top:** 12px
- **Border-top:** 1px solid `#E4DDD0` (var(--line))
- **Margin-top:** 2px

###### Metadata (`.meta`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.06em
- **Color:** `#7E969E` (var(--steel))
- **Display:** flex
- **Align-items:** center
- **Gap:** 14px

###### Read Link (`.read`)
- **Font-weight:** 700
- **Font-size:** 13.5px
- **Color:** `#0F4C5C` (var(--petrol))
- **Display:** flex
- **Align-items:** center
- **Gap:** 6px
- **Transition:** gap 0.2s, color 0.2s

**Card hover state `.tl-card:hover .tl-card-foot .read`:**
- **Gap:** 10px
- **Color:** `#C9603C` (var(--clay))

---

## PAGINATOR

### Container (`.paginator`)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Margin-top:** 36px
- **Padding-top:** 28px
- **Border-top:** 1px solid `#E4DDD0` (var(--line))
- **Flex-wrap:** wrap
- **Gap:** 16px
- **ID:** paginator

### Info Text (`.pag-info`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.06em
- **Color:** `#7E969E` (var(--steel))

### Controls Container (`.pag-controls`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 8px

#### Button (`.pag-btn`)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 7px
- **Font-family:** Inter
- **Font-weight:** 600
- **Font-size:** 13.5px
- **Color:** `#3C5A64` (var(--slate))
- **Background:** #fff (var(--surface))
- **Border:** 1px solid `#E4DDD0` (var(--line))
- **Padding:** 10px 18px
- **Border-radius:** 10px
- **Cursor:** pointer
- **Transition:** all 0.2s
- **Line-height:** 1

**Hover state (:not([disabled]):**
- **Color:** `#0F4C5C` (var(--petrol))
- **Border-color:** `rgba(15,76,92,0.3)`
- **Transform:** translateY(-1px)

**Disabled state:**
- **Opacity:** 0.35
- **Cursor:** not-allowed
- **Pointer-events:** none

#### Pages Container (`.pag-pages`)
- **Display:** flex
- **Gap:** 4px
- **Align-items:** center

##### Page Number Button (`.pag-num`)
- **Width:** 38px
- **Height:** 38px
- **Border-radius:** 9px
- **Border:** 1px solid transparent
- **Font-weight:** 600
- **Font-size:** 14px
- **Color:** `#3C5A64` (var(--slate))
- **Background:** transparent
- **Cursor:** pointer
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Transition:** all 0.2s
- **Font-family:** Inter

**Hover state:**
- **Background:** `#F0ECE2` (var(--sand))
- **Color:** `#0C2027` (var(--ink))

**Active state (.active):**
- **Background:** `#0F4C5C` (var(--petrol))
- **Color:** #fff
- **Border-color:** var(--petrol)

---

## ROADMAP (PRÓXIMAS ETAPAS)

### Section Container
- **Margin-top:** 96px
- **ID:** roadmap

### Section Header
- Mesmo estilo da Timeline (ver seção Timeline de Posts)

#### Eyebrow: "O que vem por aí"
#### Title: "Próximas etapas"
#### Description: "Visão de alto nível do que está sendo construído agora e o que está planejado para os próximos meses."

### Roadmap Grid (`.roadmap-grid`)
- **Display:** grid
- **Grid-template-columns:** repeat(3, 1fr)
- **Gap:** 20px

### Roadmap Card (`.rm-card`)
- **Background:** #fff (var(--surface))
- **Border:** 1px solid `#E4DDD0` (var(--line))
- **Border-radius:** 14px
- **Padding:** 26px 26px 22px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 14px
- **Transition:** transform 0.2s, box-shadow 0.2s

**Hover state:**
- **Transform:** translateY(-2px)
- **Box-shadow:** 0 12px 28px -12px rgba(12,32,39,0.1)

**Modificador `.doing`:**
- **Border-color:** `rgba(201,96,60,0.35)`
- **Background:** linear-gradient(180deg, var(--surface) 0%, rgba(243,221,208,0.12) 100%)

**Modificador `.planned`:**
- **Background:** #fff (var(--surface))

**Modificador `.future`:**
- **Background:** `#F0ECE2` (var(--sand))
- **Border-style:** dashed

#### Top Section (`.rm-top`)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Gap:** 10px

##### Number (`.rm-num`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.1em
- **Color:** `#7E969E` (var(--steel))

##### Status Badge (`.rm-status`)
- **Font-family:** JetBrains Mono
- **Font-size:** 9.5px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Padding:** 4px 11px
- **Border-radius:** 999px
- **Font-weight:** 500
- **Display:** flex
- **Align-items:** center
- **Gap:** 7px

**Modificador `.s-doing`:**
- **Background:** `#F3DDD0` (var(--clay-soft))
- **Color:** `#A94C2D` (var(--clay-hover))
- **Border:** 1px solid `rgba(201,96,60,0.25)`
- **.sdot (dot inside):** 6px circle, background var(--clay)

**Modificador `.s-planned`:**
- **Background:** `rgba(15,76,92,0.08)`
- **Color:** `#0F4C5C` (var(--petrol))
- **Border:** 1px solid `rgba(15,76,92,0.18)`

**Modificador `.s-future`:**
- **Background:** `#F0ECE2` (var(--sand))
- **Color:** `#7E969E` (var(--steel))
- **Border:** 1px solid `#E4DDD0` (var(--line))

#### Heading 4 (`.rm-card h4`)
- **Font-weight:** 700
- **Font-size:** 1.05rem
- **Letter-spacing:** -0.015em
- **Color:** `#0C2027` (var(--ink))
- **Line-height:** 1.3

#### Paragraph (`.rm-card p`)
- **Font-size:** 13.5px
- **Line-height:** 1.6
- **Color:** `#3C5A64` (var(--slate))
- **Flex:** 1

#### Footer (`.rm-foot`)
- **Padding-top:** 14px
- **Border-top:** 1px solid `#E4DDD0` (var(--line))
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.06em
- **Color:** `#7E969E` (var(--steel))

### Roadmap Items (6 cards)

| Classe | Número | Status | Título | Descrição | Data |
|--------|--------|--------|--------|-----------|------|
| `.doing` | E-01 | Em andamento | Sistema de comentários nativo | Discussão integrada nos posts, sem dependência de ferramentas de terceiros. Autenticação leve, moderação simples. | Q1 2026 |
| `.doing` | E-02 | Em andamento | Design system documentado | Tokens de cor, tipografia e componentes formalizados. Base para a plataforma escalar sem inconsistência visual. | Q1 2026 |
| `.planned` | P-01 | Planejado | Newsletter automatizada | Cada novo post entregue por e-mail. Avaliando Beehiiv vs. solução própria com SES — com os critérios publicados no blog. | Q1 2026 |
| `.planned` | P-02 | Planejado | Monetização com AdSense | Integração e posicionamento de anúncios sem destruir a leitura. Métricas de receita publicadas mensalmente. | Q2 2026 |
| `.planned` | P-03 | Planejado | Busca nativa | Search sem dependência de Algolia ou Elasticsearch. Explorando solução com embeddings e busca semântica no próprio banco. | Q2 2026 |
| `.future` | F-01 | Futuro | Dashboard público de métricas | Tráfego, custo AWS e receita — ao vivo, visíveis para qualquer visitante. A transparência radical na prática. | Sem data |

---

## CTA ASSESSORIA

### Section Container (`.cta-adv`)
- **Background:** `#0F4C5C` (var(--petrol))
- **Color:** `#FAF8F3` (var(--ivory))
- **Position:** relative
- **Overflow:** hidden
- **Isolation:** isolate
- **ID:** assessoria

#### ::before (Decorative overlay)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Opacity:** 0.55
- **Pointer-events:** none
- **Z-index:** 0
- **Background layers (4):**
  1. Radial gradient: 50% 70% at 100% 0%, `rgba(201,96,60,0.32)` → transparent 55%
  2. Radial gradient: 40% 60% at 0% 100%, `rgba(91,139,150,0.2)` → transparent 60%
  3. Linear gradient horizontal: `rgba(255,255,255,0.04)` 1px lines, 80px spacing
  4. Linear gradient vertical: `rgba(255,255,255,0.04)` 1px lines, 80px spacing
- **Mask:** radial-gradient(ellipse at 70% 30%, #000 30%, transparent 80%)

### Inner Container (`.cta-adv-in`)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1180px
- **Margin:** 0 auto
- **Padding:** 84px 40px
- **Display:** grid
- **Grid-template-columns:** 1.06fr 0.94fr
- **Gap:** 60px
- **Align-items:** center

### Left Column

#### Eyebrow (`.ey`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** `rgba(255,255,255,0.72)`
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 20px
- **::before:**
  - Content: ""
  - Width: 30px
  - Height: 1px
  - Background: var(--clay)

**Conteúdo:** "Assessoria & Consultoria"

#### Heading 2 (`.cta-adv h2`)
- **Font-weight:** 800
- **Font-size:** clamp(2rem, 3.6vw, 2.75rem)
- **Line-height:** 1.06
- **Letter-spacing:** -0.04em
- **Color:** #fff
- **Max-width:** 500px

**Em tags:** font-style: italic, color: `#5B8B96` (var(--petrol-soft))

**Conteúdo:** "Precisa de ajuda para *construir* ou escalar na nuvem?"

#### Description (`.desc`)
- **Font-size:** 1.0625rem
- **Line-height:** 1.6
- **Color:** `rgba(250,248,243,0.66)`
- **Max-width:** 440px
- **Margin-top:** 18px

**Conteúdo:** "Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa."

#### Points List (`.points`)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 13px
- **Margin-top:** 26px

##### List Item (`.points li`)
- **List-style:** none
- **Display:** flex
- **Align-items:** flex-start
- **Gap:** 12px
- **Font-size:** 15px
- **Line-height:** 1.5
- **Color:** `rgba(250,248,243,0.9)`

###### Checkmark (`.ck`)
- **Flex:** none
- **Width:** 22px
- **Height:** 22px
- **Border-radius:** 7px
- **Margin-top:** 1px
- **Background:** `rgba(201,96,60,0.2)`
- **Color:** #E8A582
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **SVG:** width 13px, height 13px

**Bold tags:**
- **Color:** #fff
- **Font-weight:** 600

**Conteúdo (3 itens):**

1. "Arquitetura **AWS** sob medida, sem desperdício de custo"
2. "Automação e **CI/CD** de ponta a ponta em código"
3. "Adoção de **IA** com foco em resultado, não em hype"

### Right Column (`.adv-card`)
- **Background:** `rgba(255,255,255,0.05)`
- **Border:** 1px solid `rgba(255,255,255,0.14)`
- **Border-radius:** 18px
- **Padding:** 34px 34px 30px
- **Backdrop-filter:** blur(4px)
- **Box-shadow:** 0 24px 60px -28px rgba(0,0,0,0.55)

#### Tagline (`.tagline`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** `rgba(255,255,255,0.6)`
- **Display:** flex
- **Align-items:** center
- **Gap:** 9px
- **Margin-bottom:** 18px

##### Dot (`.dot`)
- **Width:** 7px
- **Height:** 7px
- **Border-radius:** 50%
- **Background:** `#3F6B47` (var(--moss))
- **Box-shadow:** 0 0 0 3px rgba(63,107,71,0.25)

**Conteúdo:** "• Disponível para novos projetos"

#### Heading 3 (`.adv-card h3`)
- **Font-weight:** 800
- **Font-size:** 1.4rem
- **Letter-spacing:** -0.025em
- **Color:** #fff
- **Line-height:** 1.2

**Conteúdo:** "Vamos conversar sobre o seu"

#### Subheading (`.sub`)
- **Font-size:** 14.5px
- **Line-height:** 1.6
- **Color:** `rgba(250,248,243,0.66)`
- **Margin-top:** 10px

**Conteúdo:** "Diagnóstico inicial gratuito. Conte o desafio e eu retorno com um plano objetivo."

#### Services Tags (`.svc`)
- **Display:** flex
- **Flex-wrap:** wrap
- **Gap:** 8px
- **Margin:** 22px 0 26px

##### Tag (`.svc span`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.08em
- **Text-transform:** uppercase
- **Color:** `rgba(255,255,255,0.8)`
- **Background:** `rgba(255,255,255,0.06)`
- **Border:** 1px solid `rgba(255,255,255,0.12)`
- **Padding:** 7px 12px
- **Border-radius:** 999px

**Conteúdo:** "Cloud · AWS", "DevOps", "IA aplicada", "Mentoria"

#### Button (`.btn-adv`)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Gap:** 10px
- **Width:** 100%
- **Background:** `#C9603C` (var(--clay))
- **Color:** #fff
- **Border:** none
- **Cursor:** pointer
- **Text-decoration:** none
- **Height:** 56px
- **Border-radius:** 13px
- **Font-family:** Inter
- **Font-weight:** 600
- **Font-size:** 15.5px
- **Box-shadow:** 0 12px 26px -8px rgba(201,96,60,0.55)
- **Transition:** background 0.2s, transform 0.2s

**Hover state:**
- **Background:** `#A94C2D` (var(--clay-hover))
- **Transform:** translateY(-2px)

**Conteúdo:** "Conhecer a assessoria →"

#### Reassurance Text (`.reassure`)
- **Text-align:** center
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.1em
- **Text-transform:** uppercase
- **Color:** `rgba(255,255,255,0.5)`
- **Margin-top:** 16px

**Conteúdo:** "Resposta em até 24h · sem compromisso"

---

## RESPONSIVIDADE

### Breakpoint: max-width 1000px

- `.about-strip`: grid 1 coluna, gap 36px, padding 36px
- `.foot-top`: grid 2 colunas, gap 36px 32px
- `.foot-brand`: grid-column 1/-1
- `.roadmap-grid`: 2 colunas

### Breakpoint: max-width 840px

- `.cta-adv-in`: grid 1 coluna, gap 44px

### Breakpoint: max-width 680px

- `.hero-in`: 1 coluna, gap 32px
- `.hero-stat`: display none
- `.stats-strip`: flex-wrap
- `.stat-item`: flex 1 1 40%, border-right none, border-bottom 1px, padding 20px 0
- `.roadmap-grid`: 1 coluna
- `main`: padding 0 20px 40px
- `.hero-in`, `.stats-strip`: padding-left 20px, padding-right 20px
- `.about-strip`: padding 28px 24px
- `.cta-adv-in`: grid 1 coluna, gap 28px
- `.foot-top`: 1 coluna
- `.paginator`: flex-direction column, align-items flex-start

---

## VARIÁVEIS DE COR (CSS Custom Properties)

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
```

---

## VARIÁVEIS DE FONTE

```css
--font:  'Inter', system-ui, sans-serif
--mono:  'JetBrains Mono', ui-monospace, monospace
```

---

## SCRIPTS & COMPORTAMENTO

### Posts Data Array

Array `POSTS` com 12 objetos em ordem cronológica decrescente (mais recente primeiro). O post mais recente recebe `type: 'latest'`; os demais `type: 'published'`.

```javascript
const POSTS = [
  {
    num: '01',
    date: '01 FEV 2026',
    cat: 'Bastidores',
    title: 'Dashboard público: expondo métricas reais do blog',
    excerpt: 'Tráfego, custo AWS e receita — ao vivo, visíveis para qualquer visitante. Como construí o painel e por que a transparência radical importa.',
    time: '7 min',
    link: '#',
    type: 'latest'
  },
  {
    num: '02',
    date: '25 JAN 2026',
    cat: 'Engenharia',
    title: 'Refatorando a stack depois do primeiro trimestre',
    excerpt: 'O que mudei após três meses em produção: o que estava certo, o que estava errado, e o que faria diferente hoje.',
    time: '8 min',
    link: '#',
    type: 'published'
  },
  {
    num: '03',
    date: '18 JAN 2026',
    cat: 'Monetização',
    title: 'Três meses de AdSense: o que realmente rendeu',
    excerpt: 'Números reais de receita após 90 dias. Posicionamento dos blocos, impacto na leitura e se valeu a pena.',
    time: '5 min',
    link: '#',
    type: 'published'
  },
  {
    num: '04',
    date: '11 JAN 2026',
    cat: 'Bastidores',
    title: 'Como automatizei o envio de newsletter com Amazon SES',
    excerpt: 'Da escolha do SES à automação completa: templates, segmentação e rastreamento de abertura sem plataforma de terceiros.',
    time: '6 min',
    link: '#',
    type: 'published'
  },
  {
    num: '05',
    date: '04 JAN 2026',
    cat: 'Engenharia',
    title: 'O sistema de comentários que construí do zero',
    excerpt: 'Por que decidi não usar Disqus ou Utterances. A arquitetura de um sistema simples, com moderação e sem dependência externa.',
    time: '9 min',
    link: '#',
    type: 'published'
  },
  {
    num: '06',
    date: '21 DEZ 2025',
    cat: 'Infraestrutura',
    title: 'Monitoramento sem gastar: CloudWatch e alertas no Free Tier',
    excerpt: 'Como configurar alertas de custo, performance e disponibilidade sem sair do tier gratuito da AWS. Tudo em código.',
    time: '6 min',
    link: '#',
    type: 'published'
  },
  {
    num: '07',
    date: '07 DEZ 2025',
    cat: 'Tutoriais · IA',
    title: 'Como construir prompts poderosos para IAs como GPT ou Gemini',
    excerpt: 'Um bom prompt não é uma pergunta — é uma instrução estratégica. O método de quatro princípios para extrair respostas precisas, no formato certo, todas as vezes.',
    time: '5 min',
    link: 'Pagina de Postagem.html',
    type: 'published'
  },
  {
    num: '08',
    date: '05 DEZ 2025',
    cat: 'Engenharia',
    title: 'Busca semântica caseira com embeddings na AWS',
    excerpt: 'Indexei todos os artigos com embeddings e montei uma busca por significado — barata, rápida e sem serviço externo.',
    time: '7 min',
    link: '#',
    type: 'published'
  },
  {
    num: '09',
    date: '30 NOV 2025',
    cat: 'Infraestrutura',
    title: 'Serverless de verdade: Lambda + API Gateway + DynamoDB',
    excerpt: 'A arquitetura que roda este blog com custo quase zero quando ocioso — e escala sem eu tocar em nada.',
    time: '7 min',
    link: '#',
    type: 'published'
  },
  {
    num: '10',
    date: '23 NOV 2025',
    cat: 'Bastidores',
    title: 'Escrevi 50 artigos com IA: o que funcionou e o que não',
    excerpt: 'Onde delegar para o modelo compensou, onde custou caro, e o fluxo de revisão que mantém a voz humana.',
    time: '8 min',
    link: '#',
    type: 'published'
  },
  {
    num: '11',
    date: '16 NOV 2025',
    cat: 'Engenharia',
    title: 'Terraform na prática: infra versionada e auditável',
    excerpt: 'Como organizo módulos, state remoto e o pipeline que aplica mudanças com revisão obrigatória antes do deploy.',
    time: '10 min',
    link: '#',
    type: 'published'
  },
  {
    num: '12',
    date: '07 NOV 2025',
    cat: 'Bastidores',
    title: 'Por que vou construir este blog em público',
    excerpt: 'A decisão de abrir o processo inteiro — da stack ao custo — e o que espero aprender com isso. O ponto de partida de tudo.',
    time: '4 min',
    link: '#',
    type: 'published'
  }
];
```

### Paginação
- `PER_PAGE`: 6 posts por página
- `currentPage`: página atual (inicia em 1)
- `totalPages`: Math.ceil(POSTS.length / PER_PAGE) = 2
- Função `renderPost(p)`: renderiza um post individual
- Função `renderPaginator()`: renderiza controles de paginação
- Função `goTo(page)`: navega para página, anima scroll para seção

### Scroll to Top Button
- ID: `toTop`
- Evento: click → `window.scrollTo({ top: 0, behavior: 'smooth' })`

---

## NOTAS FINAIS

1. **Sem margens de erro:** cada dimensão, cor, espaçamento e transição está especificado com precisão
2. **Responsividade:** 3 breakpoints cobrem mobile, tablet e desktop
3. **Interatividade:** hover states, transitions, animations (pulse) documentadas
4. **Acessibilidade:** uso de heading hierarchy, alt attributes (onde aplicável), contraste de cor adequado
5. **Performance:** backdrop-filter, transitions GPU-accelerated, lazy-load de imagens (se houver)

---

## FOOTER

> **Nota:** Estrutura e estilos idênticos ao footer das demais páginas do sistema, com as seguintes diferenças:

- **`.foot-in` max-width:** 1180px (igual ao `.wrap` desta página, não 1240px)
- **`.foot-in` padding:** 0 40px 26px
- **Copyright:** `© 2026 Marcelo Gonçalves · Todos os direitos reservados`
- **Links Rápidos:** Home (`Home.html`) · Artigos (`Artigos.html`) · Serviços (`Serviços.html`) · Sobre (`Sobre.html`)
- **Categorias:** Inteligência Artificial · DevOps · Cloud · AWS · Engenharia (todos href `#`)

Para especificação completa dos estilos do footer, ver ESPECIFICACAO-SOBRE.md Seção 8.

---

**FIM DA ESPECIFICAÇÃO**
