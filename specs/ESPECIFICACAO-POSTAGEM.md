# ESPECIFICAÇÃO: Página de Postagem (Post)

**Versão:** 1.0  
**Data:** 2026  
**Status:** Completo e pixel-perfeito

---

## SETUP E BOILERPLATE

- **Title:** `Como construir prompts poderosos para IAs — MarceloGonçalves`
- **Nav link ativo:** "Artigos" (`href="#"`, `class="active"`)
- **Nav brand href:** `#` (não `Home.html` — a Postagem não tem link direto no brand)
- **Nav CTA:** `href="#assessoria"` — texto `Assessoria →`
- **Variável CSS adicional:** `--read: 720px` (usada na definição do layout grid)

---

## ÍNDICE

1. [Reading Progress Bar](#reading-progress-bar)
2. [Header/Navbar](#headernav)
3. [Hero Section](#hero-section)
4. [Cover Image Frame](#cover-image-frame)
5. [Layout Grid (TOC | Article | Share)](#layout-grid)
6. [Table of Contents (TOC)](#table-of-contents-toc)
7. [Article Prose](#article-prose)
8. [Share Rail](#share-rail)
9. [Author Box](#author-box)
10. [Related Articles](#related-articles)
11. [CTA Assessoria](#cta-assessoria)
12. [Footer](#footer)

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
- **JavaScript:** Atualizado via `scroll` event — width = (scrollTop / maxScroll) × 100%

---

## HEADER/NAV

### Header Container (`.nav`)
- **Position:** sticky
- **Top:** 0
- **Z-index:** 50
- **Background:** rgba(250,248,243, 0.86)
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
- **Gap:** 0

#### Brand Parts
- `.b2`: color var(--petrol)
- `.tick`: 6px circle, background var(--clay), margin 0 0 6px 4px, align-self flex-end

**Conteúdo:** "Marcelo" "Gonçalves"

### Menu (`.menu`)
- **Display:** flex
- **Gap:** 30px

#### Menu Links (`.menu a`)
- **Font-size:** 14.5px
- **Color:** var(--slate)
- **Font-weight:** 500
- **Transition:** color 0.2s
- **Position:** relative

**Hover:**
- **Color:** var(--ink)

**Active (.active):**
- **Color:** var(--petrol)
- **Font-weight:** 600

**Responsiveness:** @media (max-width: 860px) → display: none

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

**Hover:**
- **Background:** var(--petrol-deep)
- **Transform:** translateY(-1px)

**Conteúdo:** "Assessoria →"

---

## HERO SECTION

### Container (`.hero`)
- **Background:** linear-gradient(180deg, var(--ivory) 0%, var(--sand) 100%)
- **Border-bottom:** 1px solid var(--line)
- **Padding:** 64px 32px 0

### Inner (`.hero-in`)
- **Max-width:** 860px
- **Margin:** 0 auto
- **Text-align:** center
- **Display:** flex
- **Flex-direction:** column
- **Align-items:** center

### Breadcrumbs (`.crumbs`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** var(--steel)
- **Display:** flex
- **Align-items:** center
- **Gap:** 9px
- **Margin-bottom:** 26px

#### Links within crumbs
- **Hover:** color var(--petrol)

#### Separator (`.sep`)
- **Opacity:** 0.5

**Conteúdo:** "Home / Artigos / Tutoriais · AWS"

### Category Pill (`.cat-pill`)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 8px
- **Background:** var(--petrol)
- **Color:** #fff
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Font-weight:** 500
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Padding:** 8px 16px
- **Border-radius:** 999px
- **Margin-bottom:** 26px

**Conteúdo:** "Tutoriais · AWS"

### H1 (`.hero h1`)
- **Font-weight:** 800
- **Font-size:** clamp(2.3rem, 5vw, 3.6rem)
- **Line-height:** 1.04
- **Letter-spacing:** -0.04em
- **Color:** var(--ink)
- **Max-width:** 880px
- **Text-wrap:** balance

**Conteúdo:** "Como construir prompts poderosos para IAs como GPT ou Gemini"

### Subtitle (`.sub`)
- **Font-size:** 1.1875rem
- **Line-height:** 1.6
- **Color:** var(--slate)
- **Max-width:** 600px
- **Margin-top:** 22px

**Conteúdo:** "Um bom prompt não é uma pergunta — é uma instrução estratégica. Veja o método para extrair respostas precisas, no formato certo, todas as vezes."

### Byline (`.byline`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 18px
- **Margin-top:** 34px
- **Flex-wrap:** wrap
- **Justify-content:** center

#### Avatar (`.avatar`)
- **Width:** 48px
- **Height:** 48px
- **Border-radius:** 50%
- **Background:** linear-gradient(150deg, var(--petrol-soft), var(--petrol))
- **Color:** #fff
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Font-weight:** 700
- **Font-size:** 16px
- **Letter-spacing:** -0.01em
- **Box-shadow:** 0 0 0 4px var(--surface), 0 0 0 5px var(--line)

**Conteúdo:** "MG"

#### Who Block (`.who`)
- **Text-align:** left

##### Name (`.n`)
- **Font-weight:** 700
- **Font-size:** 15.5px
- **Color:** var(--ink)
- **Letter-spacing:** -0.01em

##### Role (`.r`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.06em
- **Color:** var(--steel)
- **Margin-top:** 2px

**Conteúdo:** "Marcelo Gonçalves" "Cloud Engineer · AWS"

#### Separator Dots (`.dot`)
- **Width:** 4px
- **Height:** 4px
- **Border-radius:** 50%
- **Background:** var(--line)

#### Metadata (`.meta`)
- **Font-family:** JetBrains Mono
- **Font-size:** 12px
- **Color:** var(--steel)
- **Letter-spacing:** 0.04em
- **Display:** flex
- **Align-items:** center
- **Gap:** 7px

##### SVG within meta
- **Opacity:** 0.6

**Conteúdo (2 itens):**
1. Calendar icon + "07/12/2025"
2. Clock icon + "5 min de leitura"

---

## COVER IMAGE FRAME

### Container (`.cover`)
- **Max-width:** 1080px
- **Margin:** 56px auto -80px
- **Padding:** 0 32px

### Frame (`.cover .frame`)
- **Position:** relative
- **Aspect-ratio:** 21/9
- **Border-radius:** 20px
- **Overflow:** hidden
- **Background:** linear-gradient(140deg, #0F4C5C 0%, #08323D 70%, #0C2027 100%)
- **Box-shadow:** 0 30px 60px -24px rgba(8,50,61,0.5)
- **Border:** 1px solid rgba(12,32,39,0.3)
- **Display:** flex
- **Align-items:** flex-end
- **Padding:** 24px

#### ::before (Decorative overlay)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Opacity:** 0.5
- **Background layers (3):**
  1. Radial gradient: 70% 80% at 78% 18%, rgba(201,96,60,0.4) → transparent 55%
  2. Linear horizontal: rgba(255,255,255,0.05) 1px, 56px spacing
  3. Linear vertical: rgba(255,255,255,0.05) 1px, 56px spacing
- **Mask:** radial-gradient(ellipse at 70% 40%, #000 30%, transparent 80%)

#### Slot Label (`.slot`)
- **Position:** relative
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.18em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.6)
- **Display:** flex
- **Align-items:** center
- **Gap:** 10px

##### ::before
- **Content:** ""
- **Width:** 24px
- **Height:** 1px
- **Background:** rgba(255,255,255,0.4)

**Conteúdo:** "imagem de capa · 1080×460"

---

## LAYOUT GRID

### Container (`.layout`)
- **Max-width:** 1180px
- **Margin:** 0 auto
- **Padding:** 128px 32px 40px
- **Display:** grid
- **Grid-template-columns:** 212px minmax(0, var(--read)) 52px
  - Onde `var(--read) = 720px`
- **Gap:** 56px
- **Justify-content:** center
- **Align-items:** start

### Responsiveness
- **@media (max-width: 1080px):**
  - Grid-template-columns: minmax(0, var(--read)) 52px
  - Gap: 40px
  - `.toc`: display none

- **@media (max-width: 720px):**
  - Grid-template-columns: 1fr
  - Padding-top: 108px
  - `.share`: display none
  - `.cover`: margin-bottom -60px

---

## TABLE OF CONTENTS (TOC)

### Container (`.toc`)
- **Position:** sticky
- **Top:** 100px
- **Display:** flex
- **Flex-direction:** column

### Label (`.toc .lbl`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.2em
- **Text-transform:** uppercase
- **Color:** var(--steel)
- **Display:** flex
- **Align-items:** center
- **Gap:** 10px

#### ::before
- **Content:** ""
- **Width:** 18px
- **Height:** 1px
- **Background:** var(--clay)

**Conteúdo:** "Neste artigo"

### Items Container (`.toc-items`)
- **Position:** relative
- **Margin-top:** 18px
- **Padding-left:** 0

#### ::before (Vertical line)
- **Content:** ""
- **Position:** absolute
- **Left:** 5px
- **Top:** 16px
- **Bottom:** 16px
- **Width:** 2px
- **Background:** var(--line)
- **Border-radius:** 2px

### Progress Line (`.toc-prog`)
- **Position:** absolute
- **Left:** 5px
- **Top:** 16px
- **Width:** 2px
- **Height:** 0 (animado)
- **Border-radius:** 2px
- **Z-index:** 1
- **Background:** linear-gradient(180deg, var(--petrol), var(--clay))
- **Transition:** height 0.35s ease

### Item (`.toc-item`)
- **Position:** relative
- **Display:** flex
- **Align-items:** baseline
- **Gap:** 9px
- **Padding:** 9px 0 9px 26px
- **Color:** var(--steel)
- **Transition:** color 0.2s
- **Data-spy:** section ID (s1, s2, s3, s4)
- **Href:** #s1, #s2, #s3, #s4

#### Marker (`.mk`)
- **Position:** absolute
- **Left:** 0
- **Top:** 12px
- **Width:** 12px
- **Height:** 12px
- **Border-radius:** 50%
- **Z-index:** 2
- **Background:** var(--ivory)
- **Border:** 2px solid var(--line)
- **Transition:** background 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.25s

#### Index (`.ix`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.06em
- **Color:** var(--steel)
- **Flex:** none
- **Transition:** color 0.2s

#### Text (`.tx`)
- **Font-size:** 13.5px
- **Line-height:** 1.4
- **Letter-spacing:** -0.005em

#### Item States

**Hover:**
- **Color:** var(--slate)
- **.mk:** border-color var(--petrol-soft), transform scale(1.08)

**Read (.read):**
- **Color:** var(--slate)
- **.ix:** color var(--petrol-soft)
- **.mk:** background var(--petrol-soft), border-color var(--petrol-soft)

**Active (.active):**
- **Color:** var(--petrol)
- **.tx:** font-weight 700
- **.ix:** color var(--clay)
- **.mk:** background var(--clay), border-color var(--clay), box-shadow 0 0 0 4px rgba(201,96,60,0.16)

### Read Metadata (`.read-meta`)
- **Margin-top:** 24px
- **Padding-top:** 18px
- **Border-top:** 1px solid var(--line)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Color:** var(--steel)
- **Letter-spacing:** 0.04em
- **Display:** flex
- **Gap:** 18px

#### Meta span
- **Display:** flex
- **Align-items:** center
- **Gap:** 6px

##### Bold
- **Color:** var(--petrol)
- **Font-weight:** 600

**Conteúdo:**
- "5 min de leitura"
- "4 seções"

---

## ARTICLE PROSE

### Article (`.prose`)
- **Font-size:** 1.1875rem
- **Line-height:** 1.85
- **Color:** var(--slate)
- **Min-width:** 0
- **Data-screen-label:** "Post"

### Paragraph (`.prose > p`)
- **Margin-bottom:** 1.65em

### Strong text
- **Color:** var(--clay-hover)
- **Font-weight:** 600

### Inline Link (`.prose a.inline`)
- **Color:** var(--petrol)
- **Font-weight:** 500
- **Border-bottom:** 1px solid rgba(15,76,92,0.32)
- **Transition:** border-color 0.2s

**Hover:**
- **Border-bottom-color:** var(--petrol)

### Lead Paragraph (`.lead`)
- **Font-size:** 1.4rem
- **Line-height:** 1.55
- **Color:** var(--ink)
- **Font-weight:** 400
- **Margin-bottom:** 1.5em
- **Letter-spacing:** -0.01em

#### Em within lead
- **Font-style:** italic
- **Color:** var(--petrol)

### Drop Cap
- `.prose > p:first-of-type:first-letter`, `.dropcap::first-letter`:
  - **Float:** left
  - **Font-weight:** 800
  - **Font-size:** 3.6em
  - **Line-height:** 0.82
  - **Padding:** 6px 12px 0 0
  - **Color:** var(--petrol)
  - **Letter-spacing:** -0.04em

### Horizontal Rule (`.rule`)
- **Height:** 1px
- **Background:** var(--line)
- **Margin:** 2.6em 0
- **Border:** 0

### Section Heading with Tile (`.sec-h`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 16px
- **Margin:** 2.4em 0 0.9em
- **Scroll-margin-top:** 100px
- **ID:** s1, s2, s3, s4

#### Tile (`.tile`)
- **Flex:** none
- **Width:** 42px
- **Height:** 42px
- **Border-radius:** 11px
- **Background:** var(--petrol)
- **Color:** var(--ivory)
- **Font-family:** JetBrains Mono
- **Font-size:** 13px
- **Font-weight:** 600
- **Letter-spacing:** 0.04em
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Box-shadow:** 0 6px 16px -6px rgba(8,50,61,0.55)

**Conteúdo:** "01", "02", "03", "04"

#### H2 within sec-h
- **Font-weight:** 800
- **Font-size:** 1.9rem
- **Line-height:** 1.15
- **Letter-spacing:** -0.03em
- **Color:** var(--ink)

### H3 (`.prose h3`)
- **Font-weight:** 700
- **Font-size:** 1.3rem
- **Letter-spacing:** -0.02em
- **Color:** var(--petrol)
- **Margin:** 1.6em 0 0.5em

### Compare Blocks (`.compare`)
- **Display:** grid
- **Grid-template-columns:** 1fr 1fr
- **Gap:** 16px
- **Margin:** 1.6em 0

#### Compare Item (`.cmp`)
- **Border-radius:** 14px
- **Padding:** 22px 24px
- **Border:** 1px solid var(--line)

##### Tag (`.tag`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Font-weight:** 500
- **Display:** flex
- **Align-items:** center
- **Gap:** 8px
- **Margin-bottom:** 12px

###### Icon (`.ic`)
- **Width:** 18px
- **Height:** 18px
- **Border-radius:** 5px
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Font-size:** 12px
- **Font-weight:** 700

##### Paragraph (`.cmp p`)
- **Font-size:** 1rem
- **Line-height:** 1.6
- **Color:** var(--ink)
- **Font-style:** italic

#### Weak Item (`.cmp.weak`)
- **Background:** var(--sand)
- **.tag:** color var(--steel)
- **.ic:** background #E4DDD0, color var(--slate)

#### Strong Item (`.cmp.strong`)
- **Background:** var(--clay-soft)
- **Border-color:** rgba(201,96,60,0.3)
- **.tag:** color var(--clay-hover)
- **.ic:** background var(--clay), color #fff

**Responsiveness:** @media (max-width: 620px) → grid-template-columns 1fr

### Bullet List (`.prose ul`)
- **List-style:** none
- **Margin:** 1.2em 0 1.65em
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 12px

#### List Item (`.prose ul li`)
- **Position:** relative
- **Padding-left:** 30px
- **Font-size:** 1.1rem
- **Line-height:** 1.65
- **Color:** var(--slate)

##### ::before (Rotated square bullet)
- **Content:** ""
- **Position:** absolute
- **Left:** 6px
- **Top:** 0.62em
- **Width:** 7px
- **Height:** 7px
- **Border-radius:** 2px
- **Background:** var(--clay)
- **Transform:** rotate(45deg)

##### Bold within item
- **Color:** var(--ink)
- **Font-weight:** 600

### Pull Quote (`.pull`)
- **Margin:** 2.4em 0
- **Padding:** 8px 0 8px 28px
- **Border-left:** 3px solid var(--clay)

#### Quote Paragraph
- **Font-size:** 1.5rem
- **Line-height:** 1.4
- **Font-weight:** 500
- **Font-style:** italic
- **Color:** var(--petrol)
- **Letter-spacing:** -0.015em

#### Citation (`.cite`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11.5px
- **Letter-spacing:** 0.08em
- **Color:** var(--steel)
- **Margin-top:** 14px
- **Font-style:** normal

### Code Block (`.code`)
- **Background:** var(--petrol-deep)
- **Border-radius:** 14px
- **Overflow:** hidden
- **Margin:** 1.8em 0
- **Box-shadow:** 0 16px 36px -20px rgba(8,50,61,0.6)

#### Top Bar (`.code .bar`)
- **Display:** flex
- **Align-items:** center
- **Gap:** 8px
- **Padding:** 13px 18px
- **Border-bottom:** 1px solid rgba(255,255,255,0.08)

#### `.code .bar .d` (dots)
- **Width:** 11px | **Height:** 11px | **Border-radius:** 50%
- **ATENÇÃO:** As cores dos dots são definidas como **inline style** em cada `<span>`, não via CSS:
  - Dot 1 (vermelho): `style="background:#E0696B"`
  - Dot 2 (amarelo): `style="background:#E3B341"`
  - Dot 3 (verde): `style="background:#6FBF73"`

##### Language (`.lng`)
- **Margin-left:** auto
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,0.45)

#### Code Content (`.code pre`)
- **Padding:** 20px 22px
- **Overflow-x:** auto
- **Font-family:** JetBrains Mono
- **Font-size:** 13.5px
- **Line-height:** 1.75
- **Color:** #D6E4E7

##### Syntax Highlighting
- **.k** (keyword): color #7FB3C0
- **.s** (string): color #E0A07E
- **.c** (comment): color #5E7A82, font-style italic

### Tip Callout (`.tip`)
- **Display:** flex
- **Gap:** 18px
- **Align-items:** flex-start
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Border-left:** 4px solid var(--clay)
- **Border-radius:** 12px
- **Padding:** 24px 26px
- **Margin:** 1.9em 0

#### Icon (`.ic`)
- **Flex:** none
- **Width:** 40px
- **Height:** 40px
- **Border-radius:** 10px
- **Background:** var(--clay-soft)
- **Color:** var(--clay-hover)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Font-family:** JetBrains Mono
- **Font-weight:** 700
- **Font-size:** 18px

#### Content (`.c`)
- **.t** (title):
  - Font-family: JetBrains Mono
  - Font-size: 10.5px
  - Letter-spacing: 0.18em
  - Text-transform: uppercase
  - Color: var(--clay)
  - Font-weight: 500
  - Margin-bottom: 6px

- **p** (paragraph):
  - Font-size: 1.05rem
  - Line-height: 1.6
  - Color: var(--ink)
  - Margin: 0

### Callout System (`.callout`)
- **Display:** flex
- **Gap:** 18px
- **Align-items:** flex-start
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Border-left:** 4px solid (varies by type)
- **Border-radius:** 12px
- **Padding:** 22px 26px
- **Margin:** 1.9em 0

#### Icon (`.ic`)
- **Flex:** none
- **Width:** 40px
- **Height:** 40px
- **Border-radius:** 10px
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center

##### SVG within icon
- **Width:** 21px
- **Height:** 21px

#### Content (`.c`)
- **Min-width:** 0

##### Title (`.t`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10.5px
- **Letter-spacing:** 0.18em
- **Text-transform:** uppercase
- **Font-weight:** 500
- **Margin-bottom:** 6px

##### Paragraph (`.c p`)
- **Font-size:** 1.05rem
- **Line-height:** 1.6
- **Color:** var(--ink)
- **Margin:** 0

- **strong:** color inherit

#### Info Callout (`.callout.info`)
- **Border-left-color:** var(--petrol)
- **.ic:** background rgba(15,76,92,0.1), color var(--petrol)
- **.t:** color var(--petrol)

#### Warning Callout (`.callout.warn`)
- **Border-left-color:** var(--clay)
- **Background:** #FCF6F1
- **.ic:** background var(--clay-soft), color var(--clay-hover)
- **.t:** color var(--clay-hover)

#### Error Callout (`.callout.error`)
- **Border-left-color:** #A33A2B
- **Background:** #FBF0EE
- **.ic:** background #F4D9D4, color #A33A2B
- **.t:** color #A33A2B

#### Success Callout (`.callout.ok`)
- **Border-left-color:** var(--moss)
- **Background:** #F1F5F0
- **.ic:** background #DCE8DD, color var(--moss)
- **.t:** color var(--moss)

### Ad Slot — POSIÇÃO NO ARTIGO

> **ATENÇÃO:** O `.adslot` aparece **antes** das seções numeradas (s1–s4), após os dois parágrafos de abertura. Sequência correta:
> 1. `.lead` (parágrafo inicial com drop cap)
> 2. Parágrafo 1 e Parágrafo 2 de abertura
> 3. `.adslot` ← aqui
> 4. `#s1` Seja claro e específico
> 5. `#s2` Defina o formato da resposta
> 6. `#s3` Forneça contexto
> 7. `#s4` Itere e refine

### Ad Slot (`.adslot`)
- **Margin:** 2.4em 0
- **Border:** 1px dashed var(--line)
- **Border-radius:** 12px
- **Background:** var(--sand)
- **Min-height:** 108px
- **Display:** flex
- **Flex-direction:** column
- **Align-items:** center
- **Justify-content:** center
- **Gap:** 6px

#### Label (`.l`)
- **Font-family:** JetBrains Mono
- **Font-size:** 10px
- **Letter-spacing:** 0.18em
- **Text-transform:** uppercase
- **Color:** var(--steel)

#### Subtext (`.s`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Color:** #A9B6B9
- **Letter-spacing:** 0.06em

**Conteúdo:** "Publicidade" "summary · leaderboard · 728×90"

### Closing Flourish (`.closing`)
- **Margin-top:** 2.6em
- **Padding:** 30px 32px
- **Background:** var(--petrol)
- **Border-radius:** 16px
- **Color:** var(--ivory)
- **Position:** relative
- **Overflow:** hidden

#### ::before (Decorative overlay)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Opacity:** 0.5
- **Background:** radial-gradient(60% 90% at 90% 10%, rgba(201,96,60,0.35), transparent 60%)

#### Elements (h3, p, *)
- **Position:** relative

#### H3
- **Font-weight:** 800
- **Font-size:** 1.4rem
- **Letter-spacing:** -0.025em
- **Color:** #fff
- **Margin-bottom:** 8px

#### Paragraph
- **Font-size:** 1.05rem
- **Line-height:** 1.6
- **Color:** rgba(250,248,243,0.72)
- **Max-width:** 520px

---

### Share Rail (`.share`) — NOTA IMPORTANTE

O `.share` **NÃO contém** o elemento `.sl` com texto "Compartilhe". O HTML real é:

```html
<aside class="share">
  <button title="LinkedIn" data-share="li">…svg…</button>
  <button title="X" data-share="x">…svg…</button>
  <button title="Copiar link" id="copyBtn">…svg…</button>
</aside>
```

Ausente: `.sl` com writing-mode vertical. **Não implementar esse elemento.**

### Container (`.share`)
- **Position:** sticky
- **Top:** 100px
- **Display:** flex
- **Flex-direction:** column
- **Align-items:** center
- **Gap:** 12px

### Label (`.sl`)
- **Font-family:** JetBrains Mono
- **Font-size:** 9.5px
- **Letter-spacing:** 0.12em
- **Color:** var(--steel)
- **Writing-mode:** vertical-rl
- **Transform:** rotate(180deg)
- **Margin-bottom:** 4px

### Share Buttons (`.share button`)
- **Width:** 42px
- **Height:** 42px
- **Border-radius:** 11px
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Color:** var(--slate)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Cursor:** pointer
- **Transition:** transform 0.15s, color 0.2s, border-color 0.2s, background 0.2s

**Hover:**
- **Transform:** translateY(-2px)
- **Color:** var(--petrol)
- **Border-color:** var(--petrol-soft)

#### SVG within button
- **Width:** 18px
- **Height:** 18px

**Conteúdo (3 botões):**
1. LinkedIn icon
2. X icon
3. Copy link icon

---

## AUTHOR BOX

### Container (`.authorbox`)
- **Margin:** 80px auto 0
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Border-radius:** 18px
- **Padding:** 38px 40px
- **Display:** grid
- **Grid-template-columns:** auto 1fr auto
- **Gap:** 30px
- **Align-items:** center
- **Box-shadow:** 0 2px 4px rgba(12,32,39,0.04)

### Avatar (`.av`)
- **Width:** 88px
- **Height:** 88px
- **Border-radius:** 50%
- **Background:** linear-gradient(150deg, var(--petrol-soft), var(--petrol))
- **Color:** #fff
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Font-weight:** 700
- **Font-size:** 30px
- **Position:** relative
- **Flex:** none

#### ::after (Status indicator)
- **Content:** ""
- **Position:** absolute
- **Right:** 4px
- **Bottom:** 4px
- **Width:** 16px
- **Height:** 16px
- **Border-radius:** 50%
- **Background:** var(--moss)
- **Border:** 3px solid var(--surface)

**Conteúdo:** "MG"

### Body (`.ab-body`)

#### Name (`.ab-name`)
- **Font-weight:** 700
- **Font-size:** 18px
- **Color:** var(--ink)
- **Letter-spacing:** -0.01em

##### Bold within name
- **Color:** var(--petrol)

#### Paragraph
- **Font-size:** 14.5px
- **Line-height:** 1.6
- **Color:** var(--slate)
- **Max-width:** 560px
- **Margin-top:** 6px

##### Links within paragraph
- **Color:** var(--petrol)
- **Font-weight:** 600
- **Border-bottom:** 1px solid rgba(15,76,92,0.3)

**Conteúdo:** "Marcelo Gonçalves é Engenheiro Cloud Sênior & Arquiteto AWS"
"Apaixonado por construir sistemas escaláveis e automatizar tarefas repetitivas. Escreve sobre IA, DevOps e o que ninguém te conta sobre rodar projetos em produção. Veja o perfil completo →"

### Social Links (`.ab-social`)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 10px
- **Align-items:** flex-end
- **Padding-left:** 30px
- **Border-left:** 1px solid var(--line)
- **Align-self:** stretch
- **Justify-content:** center

#### Label (`.sl`)
- **Font-family:** JetBrains Mono
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** var(--steel)

#### Row (`.row`)
- **Display:** flex
- **Gap:** 8px

#### Links within row
- **Width:** 38px
- **Height:** 38px
- **Border-radius:** 10px
- **Background:** var(--ivory)
- **Border:** 1px solid var(--line)
- **Color:** var(--slate)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Transition:** all 0.2s

**Hover:**
- **Background:** var(--petrol)
- **Color:** #fff
- **Border-color:** var(--petrol)
- **Transform:** translateY(-2px)

##### SVG within links
- **Width:** 17px
- **Height:** 17px

**Conteúdo (3 links):** LinkedIn, Instagram, X

### Responsive
- **@media (max-width: 760px):**
  - Grid-template-columns: 1fr
  - Text-align: center
  - Justify-items: center
  - `.ab-social`: align-items center, padding-left 0, padding-top 24px, border-left none, border-top 1px solid var(--line), width 100%

---

## RELATED ARTICLES

### Container (`.related`)
- **Margin:** 96px auto 0
- **Class:** `.wide`

### Header (`.r-head`)
- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 20px
- **Margin-bottom:** 30px

#### Left Block

##### Eyebrow (`.ey`)
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Letter-spacing:** 0.2em
- **Text-transform:** uppercase
- **Color:** var(--clay)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 14px

##### ::before
- **Content:** ""
- **Width:** 30px
- **Height:** 1px
- **Background:** var(--clay)

##### H2
- **Font-weight:** 800
- **Font-size:** 2rem
- **Letter-spacing:** -0.03em
- **Color:** var(--ink)

**Conteúdo:** "Continue explorando" "Mais sobre IA & engenharia"

#### "All" Link (`.all`)
- **Font-family:** Inter
- **Font-weight:** 600
- **Font-size:** 14px
- **Color:** var(--petrol)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 7px
- **Flex:** none

**Conteúdo:** "Todos os artigos →"

### Grid (`.r-grid`)
- **Display:** grid
- **Grid-template-columns:** repeat(3, 1fr)
- **Gap:** 22px

#### Card (`.r-card`)
- **Background:** var(--surface)
- **Border:** 1px solid var(--line)
- **Border-radius:** 14px
- **Overflow:** hidden
- **Display:** flex
- **Flex-direction:** column
- **Transition:** transform 0.2s, box-shadow 0.2s

**Hover:**
- **Transform:** translateY(-3px)
- **Box-shadow:** 0 16px 30px -16px rgba(12,32,39,0.25)

#### Image (`.img`)
- **Aspect-ratio:** 16/10
- **Position:** relative
- **Display:** flex
- **Align-items:** flex-end
- **Padding:** 14px

##### Background Variants
- **.t1:** linear-gradient(145deg, #0F4C5C, #08323D)
- **.t2:** linear-gradient(145deg, #5B8B96, #0F4C5C)
- **.t3:** linear-gradient(145deg, #C9603C, #A94C2D)

##### ::after (Gradient overlay)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Background:** linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.22))

##### Tag (`.tag`)
- **Position:** relative
- **Z-index:** 1
- **Background:** var(--ivory)
- **Color:** var(--petrol)
- **Font-weight:** 600
- **Font-size:** 11.5px
- **Padding:** 5px 12px
- **Border-radius:** 999px
- **Box-shadow:** 0 2px 8px rgba(0,0,0,0.14)

#### Content Block (`.cb`)
- **Padding:** 20px 22px 16px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 9px
- **Flex:** 1

##### Category (`.cat`)
- **Font-family:** JetBrains Mono
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** var(--clay)

##### Title (`.t`)
- **Font-weight:** 800
- **Font-size:** 18px
- **Letter-spacing:** -0.02em
- **Color:** var(--petrol)
- **Line-height:** 1.24

##### Excerpt (`.x`)
- **Font-size:** 13.5px
- **Line-height:** 1.55
- **Color:** var(--slate)

#### Footer (`.fo`)
- **Margin-top:** auto
- **Padding:** 12px 22px 16px
- **Border-top:** 1px solid var(--line)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Font-family:** JetBrains Mono
- **Font-size:** 11px
- **Color:** var(--steel)
- **Letter-spacing:** 0.04em

##### More Link (`.more`)
- **Font-family:** Inter
- **Font-weight:** 700
- **Font-size:** 13px
- **Color:** var(--petrol)

**Conteúdo (3 cards):**

| Imagem | Categoria | Título | Descrição | Data |
|--------|-----------|--------|-----------|------|
| t1 | Infraestrutura | CI/CD na AWS sem clicar no console | Tudo em IaC: ECS, RDS e CloudFront provisionados por código. | 28 NOV 2025 |
| t2 | Bastidores | Quando a IA acelera (e quando atrapalha) | Onde delegar para o modelo compensa — e onde custa caro. | 21 NOV 2025 |
| t3 | Engenharia | Como este blog foi construído com IA | Do brief ao deploy, com cada decisão pública e auditável. | 14 NOV 2025 |

**Responsiveness:** @media (max-width: 820px) → grid-template-columns 1fr

---

## CONTEÚDO COMPLETO DO ARTIGO

### Lead (`.lead`)
```
Criar bons prompts é uma habilidade que melhora com prática. Ao pensar em clareza,
contexto, formato e objetivos, você obtém respostas muito mais eficazes e personalizadas da IA.
```
> Em `<p class="lead">` com `<em>Criar bons prompts</em>` em itálico + color var(--petrol)

### Parágrafos de abertura (antes do adslot)
```
Se você quer tirar o máximo de uma IA generativa como GPT ou Gemini, precisa dominar a arte
do prompt. Um bom prompt não é apenas uma pergunta — é uma instrução estratégica que direciona
o modelo a fornecer exatamente o que você deseja, no formato que você precisa.
```
> "GPT" e "Gemini" em `<strong>`. "instrução estratégica" em `<a href="#" class="inline">`.

```
Neste guia, vamos percorrer quatro princípios que transformam pedidos vagos em resultados
precisos e reutilizáveis. Cada um deles vale tanto para uma pergunta isolada quanto para
fluxos automatizados em produção.
```

### Adslot (após os 2 parágrafos de abertura)
- Label: "Publicidade"
- Sub: "summary · leaderboard · 728×90"

### Seção 1 — `id="s1"`: "Seja claro e específico"
```
Quanto mais detalhes você incluir, mais precisa será a resposta. Modelos não adivinham
intenção — eles preenchem lacunas com suposições. Eliminar a ambiguidade é o ganho mais
rápido que existe.
```

#### Compare block
- **Fraco (.cmp.weak):** tag `✕ Prompt fraco` → texto: *"Explique marketing."*
- **Forte (.cmp.strong):** tag `✓ Prompt forte` → texto: *"Explique o que é marketing digital em linguagem simples e dê 3 exemplos de estratégias usadas por pequenas empresas."*

```
Note como o segundo prompt define público, nível de linguagem e quantidade de exemplos.
Cada restrição é uma alavanca de controle sobre a saída.
```
> "público", "nível de linguagem" e "quantidade de exemplos" em `<strong>`.

### Seção 2 — `id="s2"`: "Defina o formato da resposta"
```
Seja explícito sobre como deseja a informação. A mesma pergunta pode render um parágrafo
corrido, uma tabela ou um JSON — e isso muda completamente o quanto a resposta é útil:
```
> "como" em `<em>`.

#### Bullet list (`.prose ul`)
1. **Liste em tópicos** quando quiser escanear rápido.
2. **Crie uma tabela comparativa** para decisões entre opções.
3. **Responda em JSON** quando a saída vai alimentar código.
4. **Resuma em 2 frases** para forçar concisão.
> Bold em `<b>` dentro do `<li>`.

#### Code block
- **Linguagem (`.lng`):** `prompt`
- **Conteúdo do `<pre>`:**
```
# Formato explícito = saída previsível       ← <span class="c"> (comentário, itálico)
Compare                                       ← <span class="k"> (keyword)
AWS Lambda e ECS em uma tabela               ← "tabela" em <span class="s">
com as colunas: custo, escala, caso de uso.  ← "custo", "escala", "caso de uso" em <span class="s">
Responda apenas a tabela, sem introdução.
```

#### Tip callout
- **Título (.t):** "Dica de bastidor"
- **Ícone (.ic):** texto `!`
- **Parágrafo:** "Peça o formato **antes** do conteúdo. Modelos seguem melhor a instrução de estrutura quando ela aparece no início do prompt."
> "antes" em `<strong>`.

### Seção 3 — `id="s3"`: "Forneça contexto"
```
Contexto é o que separa uma resposta genérica de uma resposta sob medida. Diga quem você é,
para quem é a saída e qual o objetivo final. O modelo passa a otimizar para o seu caso,
não para a média da internet.
```

#### Pull quote (`.pull`)
- **Frase:** *"Um prompt sem contexto é um pedido para a média. Um prompt com contexto é um pedido para você."*
- **Citação (.cite):** "— princípio nº 3"

```
Inclua restrições reais: prazo, orçamento, stack, tom de voz. Cada detalhe reduz o espaço
de respostas possíveis e aproxima a saída do que você de fato precisa entregar.
```

### Seção 4 — `id="s4"`: "Itere e refine"
```
O primeiro resultado raramente é o melhor — e tudo bem. Trate a conversa como um loop:
peça, avalie, ajuste. "Reescreva mais curto", "use um tom técnico", "remova o exemplo 2".
Refinar é onde mora a qualidade.
```

#### Warning callout (`.callout.warn`)
- **Título:** "Atenção"
- **Parágrafo:** "Refinar não é repetir o mesmo prompt. Mude **uma variável por vez** — senão você não saberá o que melhorou a resposta."

#### Error callout (`.callout.error`)
- **Título:** "Evite"
- **Parágrafo:** "Nunca cole dados sensíveis (chaves, senhas, dados de clientes) no prompt. O que entra no modelo pode **sair em outro lugar**."

#### Ok callout (`.callout.ok`)
- **Título:** "Boa prática"
- **Parágrafo:** "Salve seus melhores prompts num arquivo. Os que funcionam viram **templates reutilizáveis** — e economizam horas no longo prazo."

#### Info callout (`.callout.info`)
- **Título:** "Saiba mais"
- **Parágrafo:** "Os quatro princípios se combinam: clareza + formato + contexto + iteração formam um **método repetível**, não truques isolados."

### Closing flourish (`.closing`)
- **H3:** "Pronto para começar?"
- **Parágrafo:** "Experimente os quatro princípios acima e veja como suas interações com a IA ficam mais poderosas e precisas. O próximo prompt que você escrever já pode ser melhor."

---

## CTA ASSESSORIA

> **ATENÇÃO:** O CTA desta página **NÃO é idêntico** ao das outras páginas do sistema.
> Usa container mais estreito e padding diferente.

### `.cta-adv` (container)
- Mesmos estilos de background/overlay do padrão (ver ESPECIFICACAO-O-PROJETO.md CTA Assessoria)
- **Margin-top:** 100px (vem após os artigos relacionados)

### `.cta-adv-in`
- **Max-width:** 1080px ← **diferente das outras páginas (que usam 1240px)**
- **Padding:** 88px 32px ← **diferente das outras páginas (que usam 40px)**
- **Display:** grid | **Grid-template-columns:** 1.06fr 0.94fr | **Gap:** 60px

> Todo o restante do conteúdo (eyebrow, h2, pontos, card direito) é idêntico ao padrão.
> CTA button: `href="/servicos"` (não `Serviços.html#contato`)

---

## FOOTER

> **ATENÇÃO:** O footer desta página usa container **mais estreito** que o padrão do sistema.

### `.foot-in`
- **Max-width:** 1180px ← **diferente (padrão é 1240px)**
- **Padding:** 0 32px 26px ← **diferente (padrão é 0 40px 26px)**

### `.foot-lead`
- **Padding:** 64px 0 40px ← **diferente (padrão é 60px 0 40px)**

### Footer nav links — animação única desta página
O footer da Postagem tem uma animação de hover nos links das colunas que **não existe** nas outras páginas:
```css
.foot-col ul li a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  transition: color 0.2s, gap 0.2s;
}
.foot-col ul li a::before {
  content: "";
  width: 0;
  height: 1px;
  background: var(--clay);
  transition: width 0.2s;
  opacity: 0;
}
.foot-col ul li a:hover::before { width: 14px; opacity: 1; }
```

### Footer Links Rápidos (coluna 3)
Nesta página: `Todos os Artigos` · `O Projeto` · `Serviços` · `Sobre` (todos href `#`)

### Footer copyright
- `© 2025 Marcelo Gonçalves · Todos os direitos reservados`

### Responsividade footer
- **@media (max-width: 820px):** `.foot-top` grid-template-columns 1fr 1fr, gap 36px 32px; `.foot-brand` grid-column 1/-1
- **@media (max-width: 560px):** `.foot-top` grid-template-columns 1fr; `.foot-lead` padding-top 48px

---

## TOAST NOTIFICATION

### Container (`.toast`)
- **Position:** fixed
- **Left:** 50%
- **Bottom:** 32px
- **Transform:** translate(-50%, 20px)
- **Background:** var(--ink)
- **Color:** #fff
- **Font-size:** 14px
- **Font-weight:** 500
- **Padding:** 13px 22px
- **Border-radius:** 999px
- **Box-shadow:** 0 12px 30px rgba(12,32,39,0.4)
- **Opacity:** 0
- **Pointer-events:** none
- **Transition:** all 0.3s
- **Z-index:** 80
- **Display:** flex
- **Align-items:** center
- **Gap:** 10px
- **ID:** toast

**Show State (.show):**
- **Opacity:** 1
- **Transform:** translate(-50%, 0)

#### Checkmark (`.ck`)
- **Color:** #9BD5A8

**Conteúdo:** "✓ Link copiado"

---

## JAVASCRIPT COMPORTAMENTO

### 1. Reading Progress Bar
- Atualiza `.progress` width baseado em scroll position
- `scroll` event → width = (scrollTop / maxScroll) × 100%

### 2. Table of Contents
- Detecta seção visível via scroll position
- Atualiza `.toc-item` states (active, read)
- Anima `.toc-prog` height em tempo real
- Links internos scrollam suavemente para seções

### 3. Share Buttons
- Copy button → copia URL da página → mostra toast

### 4. Scroll to Top
- Click em `.to-top` → window.scrollTo({ top: 0, behavior: 'smooth' })

---

## VARIÁVEIS CSS

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
--read:          720px
```

---

## RESPONSIVIDADE COMPLETA

### Desktop (1080px+)
- Layout completo: TOC | Article | Share

### Tablet (720px - 1080px)
- TOC escondido
- Layout: Article | Share
- Gap reduzido

### Mobile (<720px)
- Share escondido
- Layout: 1 coluna
- Cover margin ajustado
- Autor box stacked verticalmente
- Footer grid 1 coluna

---

**FIM DA ESPECIFICAÇÃO**

Nenhuma ambiguidade. Outra IA consegue reconstruir a página pixel-perfeita usando esta especificação.
