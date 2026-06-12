# Especificação Detalhada: Página Home - Marcelo Gonçalves

---

## SETUP E BOILERPLATE

- **Doctype:** `<!doctype html>`
- **Lang:** pt-BR
- **Charset:** utf-8
- **Title:** `MarceloGonçalves — Engenharia, IA e Automação`
- **Viewport:** `width=device-width, initial-scale=1`

### Fontes (Google Fonts)
- **Preconnect:** `https://fonts.googleapis.com` e `https://fonts.gstatic.com` (crossorigin)
- **Link:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap`

---

## HEADER/NAV

### Container (`header.nav`)
- **Position:** sticky | **Top:** 0 | **Z-index:** 50
- **Background:** `rgba(250,248,243,.88)`
- **Backdrop-filter:** `saturate(140%) blur(12px)`
- **Border-bottom:** `1px solid var(--line)`

### Inner (`.nav-in`)
- **Max-width:** 1240px | **Margin:** 0 auto | **Padding:** 0 32px
- **Height:** 68px | **Display:** flex | **Align-items:** center
- **Justify-content:** space-between | **Gap:** 32px

### Brand (`.brand`)
- **Tag:** `<a>` | **Href:** `#`
- **Font-weight:** 800 | **Font-size:** 19px | **Letter-spacing:** -0.02em
- **Color:** var(--ink) | **Display:** flex | **Align-items:** center
- Estrutura HTML: `<span>Marcelo</span><span class="b2">Gonçalves</span><span class="tick"></span>`
- **`.b2`:** color var(--petrol)
- **`.tick`:** width 6px, height 6px, border-radius 50%, background var(--clay), margin 0 0 6px 4px, align-self flex-end

### Menu (`nav.menu`)
- **Display:** flex | **Gap:** 30px
- Links (14.5px, slate, weight 500): **Home (`#`, active)** · Artigos (`#`) · O Projeto (`O Projeto.html`) · Serviços (`#`) · Sobre (`#`)
- **active:** color var(--petrol), font-weight 600
- **Hover:** color var(--ink)
- **@media ≤860px:** display none

### CTA Button (`.nav-cta`)
- **Tag:** `<a>` | **Href:** `#assessoria`
- **Display:** inline-flex | **Align-items:** center | **Gap:** 9px
- **Background:** var(--petrol) | **Color:** #fff | **Font-weight:** 600 | **Font-size:** 14px
- **Padding:** 11px 18px | **Border-radius:** 10px
- **Transition:** background 0.2s, transform 0.15s
- **Hover:** background var(--petrol-deep), transform translateY(-1px)
- **`.arrow`:** font-family var(--mono)
- **Conteúdo:** `Assessoria <span class="arrow">→</span>`

---

## CLASSES DE SEÇÃO COMPARTILHADAS

### `.home-section`
- **Padding:** 96px 0

### `.home-section--sand`
- **Background:** var(--sand)

### `.home-section--surface`
- **Background:** var(--surface)
- **Border-top:** 1px solid var(--line)
- **Border-bottom:** 1px solid var(--line)

### `.wrap`
- **Max-width:** 1240px | **Margin:** 0 auto | **Padding:** 0 40px

---

## Variáveis de Design (CSS Custom Properties)

```
--petrol: #0F4C5C
--petrol-deep: #08323D
--petrol-soft: #5B8B96
--ink: #0C2027
--slate: #3C5A64
--steel: #7E969E
--ivory: #FAF8F3
--surface: #FFFFFF
--sand: #F0ECE2
--line: #E4DDD0
--clay: #C9603C
--clay-hover: #A94C2D
--clay-soft: #F3DDD0
--moss: #3F6B47
--font: 'Inter', system-ui, sans-serif
--mono: 'JetBrains Mono', ui-monospace, monospace
```

---

## 1. HERO SECTION

### Container Principal
- **Background color:** `#08323D` (--petrol-deep)
- **Color:** `#FAF8F3` (--ivory)
- **Position:** relative
- **Isolation:** isolate

### Background Decorativo (::before)
- **Position:** absolute
- **Inset:** 0 (cobre toda a seção)
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.55
- **Background layers:**
  1. Radial gradient: 55% 70% at 100% 0%, rgba(201,96,60,.28) → transparent 55%
  2. Radial gradient: 40% 55% at 0% 100%, rgba(91,139,150,.18) → transparent 60%
  3. Linear grid horizontal: 100% 80px
  4. Linear grid vertical: 80px 100%
- **Mask (webkit e padrão):** radial-gradient(ellipse at 65% 25%, #000 30%, transparent 78%)

### Hero Inner Container (.hero-in)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 88px (top) 40px (left/right) 0 (bottom)
- **Display:** grid
- **Grid-template-columns:** 1.1fr 0.9fr
- **Gap:** 64px
- **Align-items:** center

---

### HERO LEFT

#### Eyebrow (.ey)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.65)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 22px
- **::before (linha decorativa)**
  - **Content:** ""
  - **Width:** 30px
  - **Height:** 1px
  - **Background:** #C9603C (--clay)
- **Texto:** "Blog · Engenharia & IA · Build in Public"

#### Heading H1
- **Font-weight:** 800
- **Font-size:** clamp(2.4rem, 4.2vw, 3.4rem)
- **Line-height:** 1.04
- **Letter-spacing:** -0.045em
- **Color:** #FFFFFF
- **Max-width:** 600px
- **Text-wrap:** balance
- **Margin-bottom:** 18px
- **Text:** "Engenharia, IA e AWS — *na prática,* sem filtro"
  - **Nota:** "na prática," está em `<em>` com color `#5B8B96` (--petrol-soft), font-style italic

#### Subtítulo (.sub)
- **Font-size:** 1.0625rem (17px)
- **Line-height:** 1.7
- **Color:** rgba(250,248,243,.62)
- **Max-width:** 510px
- **Margin-bottom:** 30px
- **Texto:** "Decisões reais de arquitetura, custos expostos, código em produção. Um blog construído do zero — e documentado em cada passo."

#### Pills (.hero-pills)
- **Display:** flex
- **Flex-wrap:** wrap
- **Gap:** 8px
- **Margin-bottom:** 32px

##### Cada Pill (.hpill)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Padding:** 6px 12px
- **Border-radius:** 999px
- **Background:** rgba(255,255,255,.07)
- **Border:** 1px solid rgba(255,255,255,.14)
- **Color:** rgba(255,255,255,.75)
- **Transition:** background 0.2s, color 0.2s
- **Cursor:** pointer
- **Hover:**
  - **Background:** rgba(255,255,255,.13)
  - **Color:** #FFFFFF

##### Pill Ativa (.hpill--active)
- **Background:** rgba(201,96,60,.18)
- **Border-color:** rgba(201,96,60,.4)
- **Color:** #C9603C (--clay)

##### Pills: "IA Aplicada" (active), "DevOps", "Cloud · AWS", "Engenharia", "Bastidores"

#### Botões (.hero-actions)
- **Display:** flex
- **Align-items:** center
- **Gap:** 14px
- **Flex-wrap:** wrap

##### Botão Clay (.btn-clay-hero)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 10px
- **Background:** #C9603C (--clay)
- **Color:** #FFFFFF
- **Font-weight:** 600
- **Font-size:** 15px
- **Padding:** 14px 24px
- **Border-radius:** 12px
- **Box-shadow:** 0 8px 22px rgba(201,96,60,.35)
- **Transition:** background 0.2s, transform 0.2s
- **Hover:**
  - **Background:** #A94C2D (--clay-hover)
  - **Transform:** translateY(-2px)
- **.arrow:** font-family monospace
- **Texto:** "Ver todos os artigos →"

##### Botão Ghost (.btn-ghost)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 8px
- **Font-weight:** 600
- **Font-size:** 14.5px
- **Color:** rgba(255,255,255,.75)
- **Border:** 1px solid rgba(255,255,255,.18)
- **Padding:** 13px 20px
- **Border-radius:** 12px
- **Transition:** color 0.2s, border-color 0.2s, transform 0.2s
- **Hover:**
  - **Color:** #FFFFFF
  - **Border-color:** rgba(255,255,255,.4)
  - **Transform:** translateY(-1px)
- **Texto:** "O Projeto →"

---

### HERO RIGHT

#### Hero Feature Card (.hero-feature)
- **Background:** rgba(255,255,255,.055)
- **Border:** 1px solid rgba(255,255,255,.13)
- **Border-radius:** 20px
- **Padding:** 0
- **Overflow:** hidden
- **Display:** flex
- **Flex-direction:** column
- **Flex:** 1
- **Box-shadow:** 0 32px 64px -32px rgba(0,0,0,.5)
- **Transition:** transform 0.2s, box-shadow 0.2s
- **Hover:**
  - **Transform:** translateY(-3px)
  - **Box-shadow:** 0 40px 72px -32px rgba(0,0,0,.65)

##### Cover (.hf-cover)
- **Aspect-ratio:** 16/9
- **Position:** relative
- **Overflow:** hidden
- **Background:** linear-gradient(145deg, rgba(201,96,60,.35) 0%, rgba(15,76,92,.6) 50%, rgba(8,50,61,.85) 100%)

###### Grid Pattern (::before)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Background:** 
  - Linear grid horizontal: 44px
  - Linear grid vertical: 44px
- **Opacity:** 0.55

###### Badge (.hf-badge)
- **Position:** absolute
- **Top:** 14px
- **Right:** 14px
- **Z-index:** 1
- **Background:** rgba(255,255,255,.1)
- **Color:** rgba(255,255,255,.85)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9.5px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Padding:** 5px 11px
- **Border-radius:** 999px
- **Border:** 1px solid rgba(255,255,255,.2)
- **Texto:** "Em destaque"

###### Cover Tag (.hf-cover-tag)
- **Position:** absolute
- **Bottom:** 14px
- **Left:** 16px
- **Z-index:** 1
- **Background:** #C9603C (--clay)
- **Color:** #FFFFFF
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10px
- **Font-weight:** 500
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Padding:** 6px 12px
- **Border-radius:** 999px
- **Texto:** "Tutoriais · IA"

##### Body (.hf-body)
- **Padding:** 26px 28px 24px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 10px
- **Flex:** 1

###### Title (.hf-title)
- **Font-weight:** 800
- **Font-size:** 1.35rem
- **Line-height:** 1.22
- **Letter-spacing:** -0.025em
- **Color:** #FFFFFF
- **Texto:** "Como construir prompts poderosos para IAs como GPT ou Gemini"

###### Excerpt (.hf-excerpt)
- **Font-size:** 14.5px
- **Line-height:** 1.65
- **Color:** rgba(250,248,243,.62)
- **Flex:** 1
- **Texto:** "Um bom prompt não é uma pergunta — é uma instrução estratégica. O método de quatro princípios para extrair respostas precisas, no formato certo, todas as vezes."

##### Footer (.hf-foot)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Padding-top:** 16px
- **Border-top:** 1px solid rgba(255,255,255,.1)
- **Margin-top:** 4px

###### Meta (.hf-meta)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.04em
- **Color:** rgba(255,255,255,.45)
- **Display:** flex
- **Align-items:** center
- **Gap:** 10px
- **span + span::before**
  - **Content:** "·"
  - **Margin-right:** 4px
  - **Opacity:** 0.5
- **Conteúdo:** "Marcelo Gonçalves" · "07 DEZ 2025" · "5 min"

###### Read Link (.hf-read)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 7px
- **Font-weight:** 700
- **Font-size:** 13.5px
- **Color:** #C9603C (--clay)
- **Font-family:** 'JetBrains Mono'
- **Transition:** gap 0.2s, color 0.2s
- **Hover (via .hero-feature:hover):**
  - **Gap:** 11px
  - **Color:** #F3DDD0 (--clay-soft)
- **Texto:** "Ler artigo →"

---

### STATS STRIP (.stats-strip)

#### Container Principal
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Display:** flex
- **Padding:** 0 40px
- **Border-top:** 1px solid rgba(255,255,255,.09)
- **Margin-top:** 56px

#### Cada Stat (.stat-item)
- **Flex:** 1
- **Padding:** 26px 28px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 4px
- **Border-right:** 1px solid rgba(255,255,255,.08)
- **:first-child**
  - **Padding-left:** 0
- **:last-child**
  - **Border-right:** none

##### Valor (.v)
- **Font-weight:** 800
- **Font-size:** 1.75rem
- **Letter-spacing:** -0.035em
- **Color:** #FFFFFF
- **Line-height:** 1

##### Label (.l)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.48)
- **Margin-top:** 2px

#### Stats:
1. "50+" / "Artigos publicados"
2. "4" / "Categorias"
3. "~100%" / "Construído com IA"
4. "12 mo" / "Em produção"

---

## 2. MAIS LIDOS SECTION

### Container Principal
- **Background:** var(--ivory) (padrão)
- **Padding:** 96px 0

### Wrap
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px

### Head Row (.sec-head-row)
- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 24px
- **Margin-bottom:** 48px
- **Flex-wrap:** wrap

#### Left (.left)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 0

##### Eyebrow (.sec-ey)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 14px
- **::before (linha)**
  - **Width:** 30px
  - **Height:** 1px
  - **Background:** #C9603C
- **Texto:** "Mais lidos"

##### Heading (.sec-t)
- **Font-weight:** 800
- **Font-size:** clamp(1.75rem, 2.8vw, 2.25rem)
- **Letter-spacing:** -0.035em
- **Color:** #0C2027 (--ink)
- **Line-height:** 1.1
- **Texto:** "Os que mais engajaram"

##### Description (.sec-desc)
- **Font-size:** 1.0625rem
- **Line-height:** 1.65
- **Color:** #3C5A64 (--slate)
- **Max-width:** 520px
- **Margin-top:** 10px
- **Texto:** "Os artigos que mais geraram leitura, debate e compartilhamentos — um bom ponto de partida."

#### Link (.sec-link)
- **Font-family:** 'Inter'
- **Font-weight:** 600
- **Font-size:** 14px
- **Color:** #0F4C5C (--petrol)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 7px
- **Flex:** none
- **Border-bottom:** 1px solid rgba(15,76,92,.25)
- **Padding-bottom:** 2px
- **Transition:** gap 0.2s, border-color 0.2s
- **Hover:**
  - **Gap:** 11px
  - **Border-color:** #0F4C5C
- **Texto:** "Ver ranking completo →"

### Grid (.ml-grid)
- **Display:** grid
- **Grid-template-columns:** repeat(3, 1fr)
- **Gap:** 24px
- **Align-items:** stretch

---

### FEATURED CARDS (#1 e #2)

#### Feature Container (.ml-feature)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 0

##### Rank Label (.ml-rank-label)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.2em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)
- **Display:** flex
- **Align-items:** center
- **Gap:** 10px
- **Margin-bottom:** 16px
- **::before (linha)**
  - **Width:** 22px
  - **Height:** 1px
  - **Background:** #C9603C
- **Texto:** "Mais lido · #1" / "Mais lido · #2"

#### Card (.ml-card)
- **Background:** #0F4C5C (--petrol)
- **Border-radius:** 18px
- **Overflow:** hidden
- **Position:** relative
- **Isolation:** isolate
- **Display:** flex
- **Flex-direction:** column
- **Flex:** 1
- **Transition:** transform 0.22s, box-shadow 0.22s
- **Box-shadow:** 0 4px 12px rgba(8,50,61,.12)
- **Hover:**
  - **Transform:** translateY(-3px)
  - **Box-shadow:** 0 20px 40px rgba(8,50,61,.22)

##### Background (::before)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.5
- **Background layers:**
  1. Radial: 55% 60% at 88% 12%, rgba(201,96,60,.32) → transparent 58%
  2. Linear grid horizontal: 52px
  3. Linear grid vertical: 52px
- **Mask:** radial-gradient(ellipse at 70% 20%, #000 28%, transparent 72%)

##### Inner (.ml-card-inner)
- **Position:** relative
- **Z-index:** 1
- **Padding:** 32px 34px 28px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 14px
- **Flex:** 1

##### Number Background (.ml-num-bg)
- **Position:** absolute
- **Right:** 20px
- **Top:** -10px
- **Font-weight:** 900
- **Font-size:** 9rem
- **Line-height:** 1
- **Letter-spacing:** -0.08em
- **Color:** #FFFFFF
- **Opacity:** 0.06
- **Z-index:** 0
- **User-select:** none
- **Pointer-events:** none
- **Font-family:** 'Inter'
- **Conteúdo:** "01" / "02"

##### Category (.ml-card-cat)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.55)

##### Title (.ml-card-title)
- **Font-weight:** 800
- **Font-size:** 1.35rem
- **Line-height:** 1.22
- **Letter-spacing:** -0.025em
- **Color:** #FFFFFF
- **Text-wrap:** balance

##### Excerpt (.ml-card-excerpt)
- **Font-size:** 14.5px
- **Line-height:** 1.65
- **Color:** rgba(250,248,243,.62)

##### Footer (.ml-card-foot)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Padding-top:** 16px
- **Border-top:** 1px solid rgba(255,255,255,.1)
- **Margin-top:** auto

###### Meta (.ml-card-meta)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.04em
- **Color:** rgba(255,255,255,.42)
- **Display:** flex
- **Gap:** 12px
- **Conteúdo:** "07 DEZ 2025" · "5 min de leitura" / "28 NOV 2025" · "8 min de leitura"

###### Read Link (.ml-card-read)
- **Font-weight:** 700
- **Font-size:** 13px
- **Color:** #C9603C (--clay)
- **Font-family:** 'JetBrains Mono'
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 6px
- **Transition:** gap 0.2s
- **Hover (via .ml-card:hover):**
  - **Gap:** 10px
- **Texto:** "Ler →"

#### Cards (#1 e #2):
1. "Tutoriais · IA" / "Como construir prompts poderosos para IAs como GPT ou Gemini" / "O método de quatro princípios que uso no dia a dia..."
2. "DevOps" / "CI/CD na AWS sem clicar no console" / "Tudo em IaC: ECS, RDS e CloudFront provisionados por código..."

---

### LIST (#3-5)

#### Container (.ml-list)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 0
- **Background:** #FFFFFF (--surface)
- **Border:** 1px solid #E4DDD0 (--line)
- **Border-radius:** 16px
- **Overflow:** hidden

#### Item (.ml-item)
- **Display:** flex
- **Align-items:** flex-start
- **Gap:** 18px
- **Padding:** 22px 24px
- **Border-bottom:** 1px solid #E4DDD0 (--line)
- **Transition:** background 0.18s
- **Cursor:** pointer
- **:last-child**
  - **Border-bottom:** none
- **Hover:**
  - **Background:** #F0ECE2 (--sand)
  - **.ml-item-arrow:**
    - **Opacity:** 1
    - **Transform:** translateX(3px)

##### Number (.ml-item-num)
- **Flex:** none
- **Font-family:** 'JetBrains Mono'
- **Font-weight:** 600
- **Font-size:** 11px
- **Letter-spacing:** 0.08em
- **Color:** #C9603C (--clay)
- **Width:** 24px
- **Text-align:** right
- **Margin-top:** 2px
- **Conteúdo:** "03" / "04" / "05"

##### Body (.ml-item-body)
- **Flex:** 1
- **Min-width:** 0
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 5px

###### Category (.ml-item-cat)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9.5px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Color:** #7E969E (--steel)

###### Title (.ml-item-title)
- **Font-weight:** 700
- **Font-size:** 15px
- **Letter-spacing:** -0.015em
- **Color:** #0F4C5C (--petrol)
- **Line-height:** 1.3
- **Display:** -webkit-box
- **-webkit-line-clamp:** 2
- **-webkit-box-orient:** vertical
- **Overflow:** hidden

###### Meta (.ml-item-meta)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.04em
- **Color:** #7E969E (--steel)
- **Display:** flex
- **Gap:** 10px
- **Margin-top:** 2px
- **Conteúdo:** "21 NOV 2025" · "7 min" / "25 JAN 2026" · "8 min" / "14 DEZ 2025" · "6 min"

##### Arrow (.ml-item-arrow)
- **Flex:** none
- **Font-family:** 'JetBrains Mono'
- **Font-weight:** 600
- **Font-size:** 14px
- **Color:** #0F4C5C (--petrol)
- **Opacity:** 0
- **Transition:** opacity 0.18s, transform 0.18s
- **Align-self:** center
- **Conteúdo:** "→"

#### Items (#3-5):
1. "Bastidores" / "O que a IA quebrou (e o que ela acelerou)"
2. "Engenharia" / "Refatorando a stack depois do primeiro trimestre"
3. "Bastidores" / "Os primeiros 30 dias e os custos reais na AWS"

---

## 3. POSTAGENS RECENTES SECTION

### Container Principal
- **Background:** #FFFFFF (--surface)
- **Border-top:** 1px solid #E4DDD0 (--line)
- **Border-bottom:** 1px solid #E4DDD0
- **Padding:** 96px 0

### Wrap
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px

### Head Row (.sec-head-row)
- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 24px
- **Margin-bottom:** 48px
- **Flex-wrap:** wrap

#### Left (.left)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 0

##### Eyebrow (.sec-ey)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 14px
- **::before**
  - **Width:** 30px
  - **Height:** 1px
  - **Background:** #C9603C
- **Texto:** "Postagens recentes"

##### Heading (.sec-t)
- **Font-weight:** 800
- **Font-size:** clamp(1.75rem, 2.8vw, 2.25rem)
- **Letter-spacing:** -0.035em
- **Color:** #0C2027 (--ink)
- **Line-height:** 1.1
- **Texto:** "Direto do forno"

##### Description (.sec-desc)
- **Font-size:** 1.0625rem
- **Line-height:** 1.65
- **Color:** #3C5A64 (--slate)
- **Max-width:** 520px
- **Margin-top:** 10px
- **Texto:** "Os últimos artigos publicados — decisões tomadas, erros cometidos e aprendizados registrados em tempo real."

#### Link (.sec-link)
- **Font-family:** 'Inter'
- **Font-weight:** 600
- **Font-size:** 14px
- **Color:** #0F4C5C (--petrol)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 7px
- **Flex:** none
- **Border-bottom:** 1px solid rgba(15,76,92,.25)
- **Padding-bottom:** 2px
- **Transition:** gap 0.2s, border-color 0.2s
- **Hover:**
  - **Gap:** 11px
  - **Border-color:** #0F4C5C
- **Texto:** "Todos os artigos →"

### Grid (.posts-grid)
- **Display:** grid
- **Grid-template-columns:** repeat(3, 1fr)
- **Gap:** 22px

---

### POST CARD (.post-card)

#### Container Principal
- **Background:** #FFFFFF (--surface)
- **Border:** 1px solid #E4DDD0 (--line)
- **Border-radius:** 14px
- **Overflow:** hidden
- **Display:** flex
- **Flex-direction:** column
- **Box-shadow:** 0 2px 4px rgba(12,32,39,.03)
- **Transition:** transform 0.2s, box-shadow 0.2s
- **Hover:**
  - **Transform:** translateY(-3px)
  - **Box-shadow:** 0 14px 30px rgba(12,32,39,.09)

#### Image (.pc-img)
- **Aspect-ratio:** 16/10
- **Position:** relative
- **Display:** flex
- **Align-items:** flex-end
- **Padding:** 14px
- **Gradients (variações):**
  - **.t-soft:** linear-gradient(150deg, #5B8B96 0%, #0F4C5C 100%)
  - **.t-petrol:** linear-gradient(150deg, #0F4C5C 0%, #08323D 100%)
  - **.t-clay:** linear-gradient(150deg, #C9603C 0%, #A94C2D 100%)
  - **.t-deep:** linear-gradient(150deg, #08323D 0%, #0C2027 100%)
  - **.t-moss:** linear-gradient(150deg, #3F6B47 0%, #0F4C5C 100%)
  - **.t-teal:** linear-gradient(150deg, #3A7A88 0%, #0F4C5C 100%)

##### Overlay (::after)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Background:** linear-gradient(180deg, transparent 55%, rgba(0,0,0,.18))
- **Pointer-events:** none

##### Tag (.tag)
- **Position:** relative
- **Z-index:** 1
- **Background:** #FAF8F3 (--ivory)
- **Border-radius:** 999px
- **Padding:** 5px 12px
- **Font-weight:** 600
- **Font-size:** 11.5px
- **Color:** #0F4C5C (--petrol)
- **Box-shadow:** 0 2px 8px rgba(0,0,0,.14)

#### Body (.pc-body)
- **Padding:** 20px 22px 14px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 9px
- **Flex:** 1

##### Category (.pc-cat)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)

##### Title (.pc-title)
- **Font-weight:** 800
- **Font-size:** 17.5px
- **Letter-spacing:** -0.02em
- **Color:** #0F4C5C (--petrol)
- **Line-height:** 1.22
- **Display:** -webkit-box
- **-webkit-line-clamp:** 2
- **-webkit-box-orient:** vertical
- **Overflow:** hidden

##### Excerpt (.pc-excerpt)
- **Font-size:** 13.5px
- **Line-height:** 1.6
- **Color:** #3C5A64 (--slate)
- **Flex:** 1

#### Footer (.pc-foot)
- **Margin-top:** auto
- **Padding:** 12px 22px 16px
- **Border-top:** 1px solid #E4DDD0 (--line)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Color:** #7E969E (--steel)
- **Letter-spacing:** 0.04em

##### More (.more)
- **Font-family:** 'Inter'
- **Font-weight:** 700
- **Font-size:** 13px
- **Color:** #0F4C5C (--petrol)

#### Posts (6 total):
1. t-soft / "Engenharia" tag / "Bastidores" cat / "Dashboard público: expondo métricas reais do blog" / "01 FEV 2026"
2. t-petrol / "DevOps" tag / "Engenharia" cat / "Refatorando a stack depois do primeiro trimestre" / "25 JAN 2026"
3. t-clay / "Bastidores" tag / "Monetização" cat / "Três meses de AdSense: o que realmente rendeu" / "18 JAN 2026"
4. t-teal / "Infraestrutura" tag / "Bastidores" cat / "Como automatizei o envio de newsletter com Amazon SES" / "11 JAN 2026"
5. t-deep / "Engenharia" tag / "Engenharia" cat / "O sistema de comentários que construí do zero" / "04 JAN 2026"
6. t-moss / "Cloud · AWS" tag / "Infraestrutura" cat / "Monitoramento sem gastar: CloudWatch e alertas no Free Tier" / "21 DEZ 2025"

### CTA Button (.posts-cta)
- **Display:** flex
- **Justify-content:** center
- **Margin-top:** 44px

#### Button (.btn-outline-petrol)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 10px
- **Font-weight:** 600
- **Font-size:** 15px
- **Color:** #0F4C5C (--petrol)
- **Border:** 1.5px solid rgba(15,76,92,.35)
- **Padding:** 14px 28px
- **Border-radius:** 12px
- **Background:** transparent
- **Transition:** background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s
- **Hover:**
  - **Background:** #0F4C5C
  - **Color:** #FFFFFF
  - **Border-color:** #0F4C5C
  - **Transform:** translateY(-1px)
- **.arrow:** font-family monospace
- **Texto:** "Ver todos os artigos →"

---

## 4. POSTS SOBRE IA SECTION

### Container Principal
- **Background:** #0F4C5C (--petrol)
- **Color:** #FAF8F3 (--ivory)
- **Position:** relative
- **Overflow:** hidden
- **Isolation:** isolate
- **Padding:** 96px 0

#### Background (::before)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.55
- **Background layers:**
  1. Radial: 50% 65% at 100% 0%, rgba(201,96,60,.3) → transparent 55%
  2. Radial: 42% 55% at 0% 100%, rgba(91,139,150,.22) → transparent 60%
  3. Linear grid horizontal: 76px
  4. Linear grid vertical: 76px
- **Mask:** radial-gradient(ellipse at 55% 30%, #000 28%, transparent 78%)

### Wrap
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px
- **Position:** relative
- **Z-index:** 1

### Head Row (.ia-sec-head-row)
- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 24px
- **Margin-bottom:** 48px
- **Flex-wrap:** wrap

#### Left (.left)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 0

##### Eyebrow (.ia-ey)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.65)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 14px
- **::before**
  - **Width:** 30px
  - **Height:** 1px
  - **Background:** #C9603C (--clay)
- **Texto:** "Inteligência Artificial"

##### Title (.ia-title)
- **Font-weight:** 800
- **Font-size:** clamp(1.75rem, 2.8vw, 2.25rem)
- **Letter-spacing:** -0.035em
- **Color:** #FFFFFF
- **Line-height:** 1.1
- **Texto:** "IA aplicada — sem hype"

##### Description (.ia-desc)
- **Font-size:** 1.0625rem
- **Line-height:** 1.65
- **Color:** rgba(250,248,243,.62)
- **Max-width:** 520px
- **Margin-top:** 10px
- **Texto:** "Onde a IA realmente acelera, onde atrapalha, e o que ninguém te conta sobre usar modelos em produção."

#### Link (.ia-link)
- **Font-weight:** 600
- **Font-size:** 14px
- **Color:** rgba(255,255,255,.8)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 7px
- **Flex:** none
- **Border-bottom:** 1px solid rgba(255,255,255,.25)
- **Padding-bottom:** 2px
- **Transition:** gap 0.2s, color 0.2s, border-color 0.2s
- **Hover:**
  - **Gap:** 11px
  - **Color:** #FFFFFF
  - **Border-color:** rgba(255,255,255,.5)
- **Texto:** "Ver todos os posts de IA →"

### Grid (.ia-grid)
- **Display:** grid
- **Grid-template-columns:** 1.15fr 1fr
- **Gap:** 20px
- **Align-items:** stretch

---

### BIG CARD (.ia-big)

#### Container Principal
- **Background:** rgba(255,255,255,.06)
- **Border:** 1px solid rgba(255,255,255,.13)
- **Border-radius:** 16px
- **Overflow:** hidden
- **Display:** flex
- **Flex-direction:** column
- **Transition:** transform 0.2s, box-shadow 0.2s
- **Box-shadow:** 0 4px 16px rgba(0,0,0,.18)
- **Hover:**
  - **Transform:** translateY(-3px)
  - **Box-shadow:** 0 20px 40px rgba(0,0,0,.32)

#### Cover (.ia-big-cover)
- **Aspect-ratio:** 16/9
- **Position:** relative
- **Overflow:** hidden
- **Background:** linear-gradient(145deg, rgba(201,96,60,.4) 0%, rgba(8,50,61,.8) 60%, rgba(8,50,61,1) 100%)

##### Grid Pattern (::before)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Background:**
  - Linear grid horizontal: 44px
  - Linear grid vertical: 44px
- **Opacity:** 0.55

##### Tag (.ia-big-cover-tag)
- **Position:** absolute
- **Bottom:** 14px
- **Left:** 16px
- **Z-index:** 1
- **Background:** rgba(255,255,255,.1)
- **Color:** rgba(255,255,255,.9)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9.5px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Padding:** 6px 12px
- **Border-radius:** 999px
- **Border:** 1px solid rgba(255,255,255,.2)
- **Texto:** "IA Aplicada · Prompts"

#### Body (.ia-big-body)
- **Padding:** 26px 28px 22px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 11px
- **Flex:** 1

##### Category (.ia-big-cat)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)

##### Title (.ia-big-title)
- **Font-weight:** 800
- **Font-size:** 1.35rem
- **Letter-spacing:** -0.025em
- **Line-height:** 1.22
- **Color:** #FFFFFF
- **Texto:** "Como construir prompts poderosos para IAs como GPT ou Gemini"

##### Excerpt (.ia-big-excerpt)
- **Font-size:** 14.5px
- **Line-height:** 1.65
- **Color:** rgba(250,248,243,.62)
- **Flex:** 1
- **Texto:** "O método de quatro princípios — clareza, formato, contexto e iteração — que transforma pedidos vagos em resultados precisos e reutilizáveis em produção."

#### Footer (.ia-big-foot)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Padding-top:** 14px
- **Border-top:** 1px solid rgba(255,255,255,.1)

##### Meta (.ia-big-meta)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Color:** rgba(255,255,255,.4)
- **Display:** flex
- **Gap:** 10px
- **Letter-spacing:** 0.04em
- **Conteúdo:** "07 DEZ 2025" · "5 min"

##### Read (.ia-read)
- **Font-weight:** 700
- **Font-size:** 13px
- **Color:** #C9603C (--clay)
- **Font-family:** 'JetBrains Mono'
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 6px
- **Transition:** gap 0.2s
- **Hover (via .ia-big:hover):**
  - **Gap:** 10px
- **Texto:** "Ler artigo →"

---

### SMALL CARDS STACK (.ia-stack)

#### Container
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 10px
- **Height:** 100%

#### Card (.ia-small)
- **Background:** rgba(255,255,255,.06)
- **Border:** 1px solid rgba(255,255,255,.13)
- **Border-radius:** 14px
- **Padding:** 16px 20px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 8px
- **Flex:** 1
- **Transition:** transform 0.2s, background 0.2s
- **Box-shadow:** 0 2px 8px rgba(0,0,0,.12)
- **Hover:**
  - **Transform:** translateY(-2px)
  - **Background:** rgba(255,255,255,.09)

##### Category (.ia-small-cat)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)

##### Title (.ia-small-title)
- **Font-weight:** 800
- **Font-size:** 1.05rem
- **Letter-spacing:** -0.02em
- **Line-height:** 1.28
- **Color:** #FFFFFF

##### Footer (.ia-small-foot)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Padding-top:** 10px
- **Border-top:** 1px solid rgba(255,255,255,.09)
- **Margin-top:** auto

###### Meta (.ia-small-meta)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Color:** rgba(255,255,255,.38)
- **Display:** flex
- **Gap:** 9px
- **Letter-spacing:** 0.04em

#### Small Cards (4 no stack):

> **NOTA:** A seção contém **4** small cards empilhados, não 2. O `.ia-stack` tem `height: 100%` para que os 4 cards ocupem igualmente o espaço da coluna.

| # | `.ia-small-cat` | `.ia-small-title` | Meta |
|---|-----------------|-------------------|------|
| 1 | IA Aplicada | O que a IA quebrou (e o que ela acelerou) | 21 NOV 2025 · 7 min |
| 2 | IA Aplicada · AWS | A stack escolhida: Next.js, AWS e IA como copiloto real | 14 NOV 2025 · 6 min |
| 3 | IA Aplicada · Bastidores | GPT-4 vs. Gemini: o teste que fiz em produção | 03 JAN 2026 · 5 min |
| 4 | IA Aplicada | Automação com IA: tarefas que terceirizei para o modelo | 18 JAN 2026 · 6 min |

---

## 5. O PROJETO SECTION

### Container Principal
- **Background:** #F0ECE2 (--sand)
- **Border-top:** 1px solid #E4DDD0 (--line)

### Wrap
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px
- **Padding:** 96px 40px

### Grid (.projeto-grid)
- **Display:** grid
- **Grid-template-columns:** repeat(3, 1fr)
- **Gap:** 22px
- **Margin-bottom:** 36px

### Seção O Projeto — Estrutura HTML

```html
<section class="home-section projeto-section" id="projeto" data-screen-label="O Projeto">
```

**Classe adicional `.projeto-section`:**
- **Background:** var(--sand)
- **Border-top:** 1px solid var(--line)

> Os cards usam exatamente a mesma classe `.post-card` e mesmas variantes de gradiente da seção Postagens Recentes — sem classes especiais adicionais.

### Cabeçalho da Seção
- **Eyebrow (.sec-ey):** "O Projeto · Build in Public"
- **Heading (.sec-t):** "Bastidores em tempo real"
- **Description (.sec-desc):** "Cada decisão, cada erro, cada custo — documentados ao vivo. Um registro honesto de como se constrói uma plataforma editorial com AWS e IA."
- **Link (.sec-link):** "Ver toda a jornada →" — href: `O Projeto.html`

### Cards (3 total):

| # | Gradiente | Tag | pc-cat | pc-title | pc-excerpt | Data | Href |
|---|-----------|-----|--------|----------|------------|------|------|
| 1 | t-petrol | Bastidores | O Projeto | Por que vou construir este blog em público | A decisão de abrir o processo inteiro — da stack ao custo — e o que espero aprender com isso. O ponto de partida de tudo. | 07 NOV 2025 | # |
| 2 | t-deep | Bastidores | O Projeto | Os primeiros 30 dias e os custos reais na AWS | Quanto custou cada serviço no primeiro mês. Onde esperava gastar mais e onde fui surpreendido — com os números reais na tela. | 14 DEZ 2025 | # |
| 3 | t-soft | Bastidores | O Projeto | Dashboard público: expondo métricas reais do blog | Tráfego, custo AWS e receita — ao vivo, visíveis para qualquer visitante. A transparência radical na prática. | 01 FEV 2026 | # |

---

### CTA STRIP (.projeto-cta-strip)

#### Container Principal
- **Background:** #0F4C5C (--petrol)
- **Border-radius:** 16px
- **Padding:** 30px 40px
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Gap:** 24px
- **Position:** relative
- **Overflow:** hidden
- **Isolation:** isolate

#### Background (::before)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Pointer-events:** none
- **Z-index:** 0
- **Opacity:** 0.55
- **Background:** radial-gradient(55% 120% at 100% 50%, rgba(201,96,60,.3), transparent 60%)

#### All children
- **Position:** relative
- **Z-index:** 1

#### Left (.projeto-cta-left)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 6px

##### Label (.projeto-cta-label)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.18em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.55)
- **Display:** flex
- **Align-items:** center
- **Gap:** 8px

##### Dot
- **Width:** 7px
- **Height:** 7px
- **Border-radius:** 50%
- **Background:** #3F6B47 (--moss)
- **Box-shadow:** 0 0 0 3px rgba(63,107,71,.25)

##### Title (.projeto-cta-title)
- **Font-weight:** 800
- **Font-size:** 1.35rem
- **Letter-spacing:** -0.025em
- **Color:** #FFFFFF
- **Line-height:** 1.2
- **Texto:** "Acompanhe a jornada completa"

##### Stats (.projeto-cta-stats)
- **Display:** flex
- **Gap:** 28px
- **Margin-top:** 10px

###### Stat (.projeto-cta-stat)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 3px

**Value (.pv)**
- **Font-weight:** 800
- **Font-size:** 1.4rem
- **Letter-spacing:** -0.03em
- **Color:** #FFFFFF
- **Line-height:** 1

**Label (.pl)**
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.45)

- **Stats:** "12" / "Posts publicados" · "~100%" / "Com IA" · "12 mo" / "Em produção"

#### Botão (.btn-clay-strip)
- **Texto:** "Ver O Projeto →" | **Href:** `O Projeto.html`

#### Button (.btn-clay-strip)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 10px
- **Background:** #C9603C (--clay)
- **Color:** #FFFFFF
- **Font-weight:** 600
- **Font-size:** 15px
- **Padding:** 14px 26px
- **Border-radius:** 12px
- **Flex:** none
- **Box-shadow:** 0 8px 20px rgba(201,96,60,.35)
- **Transition:** background 0.2s, transform 0.2s
- **Hover:**
  - **Background:** #A94C2D (--clay-hover)
  - **Transform:** translateY(-2px)
- **.arrow:** font-family monospace
- **Texto:** "Conheça o projeto →"

---

## 6. CTA SERVIÇOS & CONSULTORIA

### Container Principal (.cta-adv)
- **Background:** #0F4C5C (--petrol)
- **Color:** #FAF8F3 (--ivory)
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
  1. Radial gradient: 50% 70% at 100% 0%, rgba(201,96,60,0.32) → transparent 55%
  2. Radial gradient: 40% 60% at 0% 100%, rgba(91,139,150,0.2) → transparent 60%
  3. Linear horizontal: rgba(255,255,255,0.04) 1px lines, 80px spacing
  4. Linear vertical: rgba(255,255,255,0.04) 1px lines, 80px spacing
- **Mask:** radial-gradient(ellipse at 70% 30%, #000 30%, transparent 80%)

### Inner Container (.cta-adv-in)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 84px 40px
- **Display:** grid
- **Grid-template-columns:** 1.06fr 0.94fr
- **Gap:** 60px
- **Align-items:** center

### Left Column

#### Eyebrow (.ey2)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.72)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 20px
- **::before:** width 30px, height 1px, background #C9603C
- **Texto:** "Serviços · Consultoria"

#### H2
- **Font-weight:** 800
- **Font-size:** clamp(2rem, 3.6vw, 2.75rem)
- **Line-height:** 1.06
- **Letter-spacing:** -0.04em
- **Color:** #fff
- **Max-width:** 500px
- **Em tags:** font-style italic, color #5B8B96 (--petrol-soft)
- **Texto:** "Precisa de ajuda para *construir* ou escalar na nuvem?"

#### Description (.desc)
- **Font-size:** 1.0625rem
- **Line-height:** 1.6
- **Color:** rgba(250,248,243,0.66)
- **Max-width:** 440px
- **Margin-top:** 18px
- **Texto:** "Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa."

#### Points List (.points)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 13px
- **Margin-top:** 26px

##### List Item (.points li)
- **List-style:** none
- **Display:** flex
- **Align-items:** flex-start
- **Gap:** 12px
- **Font-size:** 15px
- **Line-height:** 1.5
- **Color:** rgba(250,248,243,0.9)

###### Checkmark (.ck)
- **Width:** 22px / **Height:** 22px
- **Border-radius:** 7px / **Margin-top:** 1px
- **Background:** rgba(201,96,60,0.2)
- **Color:** #E8A582
- **SVG:** 13×13px, checkmark path

- **Bold tags:** color #fff, font-weight 600

**Conteúdo (3 itens):**
1. "Arquitetura **AWS** sob medida, sem desperdício de custo"
2. "Automação e **CI/CD** de ponta a ponta em código"
3. "Adoção de **IA** com foco em resultado, não em hype"

### Right Column (.adv-card)
- **Background:** rgba(255,255,255,0.05)
- **Border:** 1px solid rgba(255,255,255,0.14)
- **Border-radius:** 18px
- **Padding:** 34px 34px 30px
- **Backdrop-filter:** blur(4px)
- **Box-shadow:** 0 24px 60px -28px rgba(0,0,0,0.55)

#### Tagline (.tagline)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px / **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.6)
- **Display:** flex / **Align-items:** center / **Gap:** 9px
- **Margin-bottom:** 18px
- **.dot:** 7px circle, background #3F6B47, box-shadow 0 0 0 3px rgba(63,107,71,0.25)
- **Texto:** "Disponível para novos projetos"

#### H3
- **Font-weight:** 800 / **Font-size:** 1.4rem
- **Letter-spacing:** -0.025em / **Color:** #fff / **Line-height:** 1.2
- **Texto:** "Conheça todos os serviços"

#### Sub (.sub)
- **Font-size:** 14.5px / **Line-height:** 1.6
- **Color:** rgba(250,248,243,0.66) / **Margin-top:** 10px
- **Texto:** "Arquitetura, DevOps, FinOps, Serverless e mais — veja como posso ajudar o seu projeto."

#### Service Tags (.svc)
- **Display:** flex / **Flex-wrap:** wrap / **Gap:** 8px
- **Margin:** 22px 0 26px
- **.svc span:** font mono, 10.5px, uppercase, rgba(255,255,255,0.8), bg rgba(255,255,255,0.06), border rgba(255,255,255,0.12), padding 7px 12px, border-radius 999px
- **Conteúdo:** "Cloud · AWS" · "DevOps" · "IA aplicada" · "Mentoria"

#### Button (.btn-adv)
- **Display:** flex / **Align-items:** center / **Justify-content:** center
- **Gap:** 10px / **Width:** 100% / **Height:** 56px
- **Background:** #C9603C (--clay) / **Color:** #fff
- **Border-radius:** 13px / **Font-weight:** 600 / **Font-size:** 15.5px
- **Box-shadow:** 0 12px 26px -8px rgba(201,96,60,0.55)
- **Transition:** background 0.2s, transform 0.2s
- **Hover:** background #A94C2D, transform translateY(-2px)
- **Href:** Serviços.html
- **Texto:** "Ver todos os serviços →"

#### Reassure (.reassure)
- **Text-align:** center / **Font-family:** JetBrains Mono
- **Font-size:** 10.5px / **Letter-spacing:** 0.1em / **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.5) / **Margin-top:** 16px
- **Texto:** "10 frentes de atuação · diagnóstico gratuito"

### Responsividade
- **@media (max-width: 840px):** grid-template-columns 1fr, gap 44px
- **@media (max-width: 680px):** padding 64px 20px
---

## RESPONSIVIDADE

### Media Query: max-width 1040px

- **.ml-grid:** grid-template-columns 1fr
- **.ia-grid:** grid-template-columns 1fr
- **.ia-stack:** flex-direction column, height auto
- **.nl-card:** grid-template-columns 1fr, gap 40px, padding 56px 40px *(newsletter CSS exists mas seção não está no markup — CSS legacy)*
- **.cta-adv-in:** grid-template-columns 1fr, gap 44px
- **.foot-top:** grid-template-columns 1fr 1fr, gap 36px 32px
- **.foot-brand:** grid-column 1 / -1

### Media Query: max-width 860px

- **.hero-in:** grid-template-columns 1fr, gap 40px, padding-top 64px
- **.posts-grid:** grid-template-columns 1fr 1fr
- **.projeto-grid:** grid-template-columns 1fr 1fr

### Media Query: max-width 680px

- **.stats-strip:** flex-wrap wrap, padding 0 20px
- **.stat-item:** flex 1 1 40%, border-right none, border-bottom 1px solid rgba(255,255,255,.08), padding 20px 0
- **.posts-grid:** grid-template-columns 1fr
- **.projeto-grid:** grid-template-columns 1fr
- **.projeto-cta-strip:** flex-direction column, align-items flex-start, gap 20px
- **.cta-adv-in:** grid-template-columns 1fr, gap 44px, padding 64px 20px
- **.foot-top:** grid-template-columns 1fr
- **.wrap:** padding 0 20px
- **.stats-strip:** padding 0 20px
- **.hero-in:** padding-left 20px, padding-right 20px
- **.cta-adv-in:** padding 64px 20px
- **.foot-in:** padding 0 20px 20px

---

## SCRIPTS & INTERATIVIDADE

### Progress Bar
- **Elemento:** `<div class="progress" id="progress"></div>`
- **Posição:** fixed, top 0, left 0
- **Height:** 3px
- **Z-index:** 60
- **Background:** linear-gradient(90deg, #0F4C5C, #C9603C)
- **Comportamento:** atualiza width baseado em scroll (0-100%)
- **Script:** cálculo usando scrollTop / scrollHeight

### Pills Interativas (.hpill)
- **Comportamento:** permite clicar para marcar como ativa
- **Classe ativa:** .hpill--active
- **Padrão:** "IA Aplicada" começa ativa
- **Efeito:** background rgba(201,96,60,.18), border rgba(201,96,60,.4), color #C9603C

### "Voltar ao Topo" Button (.to-top)
- **Elemento:** `<button class="to-top" id="toTop">`
- **Comportamento:** scroll suave para o topo ao clicar
- **Função:** `document.documentElement.scrollTop = 0`

### Links Internos
- **Home:** href="#"
- **O Projeto:** href="O Projeto.html"
- **Artigos (posts):** href="Pagina de Postagem.html" (exemplo)
- **Seções:** usar # para âncoras (e.g. #mais-lidos, #recentes, #ia)

---

## FONTES GOOGLE

```
family=Inter:wght@400;500;600;700;800;900
family=JetBrains+Mono:wght@400;500;600
```

---

## SUMÁRIO DE CORES

| Uso | Hex | RGB | Nome CSS |
|-----|-----|-----|----------|
| Fundo principal | #0F4C5C | Petrol | --petrol |
| Fundo escuro | #08323D | Petrol Deep | --petrol-deep |
| Accent suave | #5B8B96 | Petrol Soft | --petrol-soft |
| Texto principal | #0C2027 | Ink | --ink |
| Texto secundário | #3C5A64 | Slate | --slate |
| Texto terciário | #7E969E | Steel | --steel |
| Fundo claro | #FAF8F3 | Ivory | --ivory |
| Fundo branco | #FFFFFF | Surface | --surface |
| Fundo areia | #F0ECE2 | Sand | --sand |
| Linha divisória | #E4DDD0 | Line | --line |
| Accent laranja | #C9603C | Clay | --clay |
| Accent laranja hover | #A94C2D | Clay Hover | --clay-hover |
| Fundo laranja claro | #F3DDD0 | Clay Soft | --clay-soft |
| Accent verde | #3F6B47 | Moss | --moss |

---

## NOTAS FINAIS

- **Toda tipografia usa Inter e JetBrains Mono** — ambas carregadas via Google Fonts
- **Espaçamentos são responsivos** — usar clamp() para escalabilidade
- **Shadows são sutis** — valores baixos de blur para harmonia visual
- **Hover states em:** botões, cards, links, pills
- **Transitions padrão:** 0.2s (rápidas e responsivas)
- **Z-index hierarchy:** backgrounds (0), content (1), fixed elements (50+), nav (50), overlays (60+)
- **Grid pattern:** usado em backgrounds decorativos com opacidade 0.04-0.55
- **Cards com flex:** sempre `flex: 1` no conteúdo para ocupar espaço disponível
- **Imagens:** aspect-ratio é essencial para layouts responsivos
- **Sem animações infinitas** em conteúdo — apenas em decorativos se necessário

---

---

## FOOTER

> **Nota:** Idêntico ao footer das demais páginas do sistema. Ver ESPECIFICACAO-SOBRE.md Seção 8 para especificação completa de estilos. Diferenças desta página:

- **Footer `.foot-bottom` copyright:** `© 2026 Marcelo Gonçalves · Todos os direitos reservados`
- **Footer Links Rápidos:** Home (`Home.html`) · O Projeto (`O Projeto.html`) · Serviços (`#`) · Sobre (`#`)
- **Footer Categorias:** Inteligência Artificial · DevOps · Cloud · AWS · Engenharia (todos href `#`)

### ORDEM DOS BLOCOS NO BODY

```
1. <div class="progress" id="progress">              ← leitura (fixed)
2. <header class="nav">                              ← nav sticky
3. <section class="hero">                            ← hero dark
   └── .hero-in (hero-left + hero-right)
   └── .stats-strip                                  ← DENTRO do <section class="hero">
4. <section class="home-section" id="mais-lidos">    ← mais lidos (ivory bg via body)
5. <section class="home-section home-section--surface" id="recentes">  ← postagens recentes
6. <section class="ia-section" id="ia">              ← posts sobre IA (petrol bg)
7. <section class="home-section projeto-section" id="projeto">  ← o projeto (sand bg)
8. <section class="cta-adv" id="assessoria">         ← CTA assessoria (petrol bg)
9. <footer class="site">                             ← footer (petrol-deep bg)
```

> **ATENÇÃO:** O `.stats-strip` é filho direto de `<section class="hero">`, NÃO é uma seção separada. Ele herda o background petrol-deep da hero.

> **CSS LEGACY:** O arquivo contém estilos para `.nl-card`, `.nl-form`, `.nl-input`, `.nl-submit` (newsletter) mas esses elementos **não existem no markup HTML**. São CSS não-utilizado de versão anterior. Não implementar essa seção.

---

**Fim da Especificação Home**

Este documento permite reconstrução pixel-perfeita da página Home, sem ambiguidades.
