# Especificação Detalhada: Página Sobre - Marcelo Gonçalves

---

## SETUP E BOILERPLATE

- **Doctype:** `<!doctype html>`
- **Lang:** pt-BR
- **Charset:** utf-8
- **Title:** `Sobre — Marcelo Gonçalves`
- **Viewport:** `width=device-width, initial-scale=1`
- **Google Fonts:** Inter (400–900) + JetBrains Mono (400, 500, 600)
- **Script:** `<script src="image-slot.js"></script>` (antes do `<style>` — componente de drag-and-drop para a foto)

---

## HEADER/NAV

- Estrutura e estilos idênticos ao padrão do sistema (ver ESPECIFICACAO-HOME.md seção HEADER/NAV)
- **Nav link ativo:** "Sobre" — `class="active"`, `href="#"`
- **Demais links:** Home (`Home.html`) · Artigos (`#`) · O Projeto (`O Projeto.html`) · Serviços (`#`)
- **Nav CTA:** `href="#assessoria"` — texto `Assessoria →`

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
- **Position:** relative
- **Isolation:** isolate
- **Color texto:** `#FAF8F3` (--ivory)
- **Nota:** O padding fica exclusivamente no `.hero-in` (88px top). Não há padding no container `<section>` externo.

### Background Decorativo (::before)
- **Position:** absolute
- **Inset:** 0 (cobre toda a seção)
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.55
- **Background layers:**
  1. Radial gradient: 55% 70% at 100% 0%, rgba(201,96,60,.28) → transparent 55%
  2. Radial gradient: 40% 55% at 0% 100%, rgba(91,139,150,.18) → transparent 60%
  3. Linear grid horizontal: 100% 80px (altura das linhas)
  4. Linear grid vertical: 80px 100% (largura das colunas)
- **Mask (webkit e padrão):** radial-gradient(ellipse at 65% 25%, #000 30%, transparent 78%)

### Hero Inner Container (.hero-in)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 88px (top) 40px (left/right) 0 (bottom)
- **Display:** grid
- **Grid-template-columns:** 1.12fr 0.88fr
- **Gap:** 64px
- **Align-items:** center

---

### HERO LEFT (Texto e Ações)

#### Hero Label (.hero-label)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.6)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 22px
- **::before (linha decorativa)**
  - **Content:** ""
  - **Width:** 30px
  - **Height:** 1px
  - **Background:** #C9603C (--clay)
- **Texto:** "Sobre · Marcelo Gonçalves"

#### Heading H1
- **Font-weight:** 800
- **Font-size:** clamp(2.2rem, 3.9vw, 3.15rem)
- **Line-height:** 1.06
- **Letter-spacing:** -0.04em
- **Color:** #FFFFFF
- **Text-wrap:** balance
- **Margin-bottom:** 18px
- **Text:** "Engenheiro Cloud que *traduz* complexidade em arquitetura resiliente."
  - **Nota:** "traduz" está em `<em>` com color `#5B8B96` (--petrol-soft), font-style italic

#### Subtítulo (.sub)
- **Font-size:** 1.0625rem (17px)
- **Line-height:** 1.7
- **Color:** rgba(250,248,243,.62)
- **Max-width:** 500px
- **Margin-bottom:** 30px
- **Texto:** "Mais de uma década resolvendo desafios de infraestrutura em escala global — e transformando essa prática em conteúdo técnico sobre cloud, DevOps, FinOps e serverless."

#### Tags (.hero-tags)
- **Display:** flex
- **Flex-wrap:** wrap
- **Gap:** 8px
- **Margin-bottom:** 32px
- **Cada span (tag):**
  - **Font-family:** 'JetBrains Mono'
  - **Font-size:** 10px
  - **Letter-spacing:** 0.14em
  - **Text-transform:** uppercase
  - **Padding:** 6px 12px
  - **Border-radius:** 999px
  - **Background:** rgba(255,255,255,.07)
  - **Border:** 1px solid rgba(255,255,255,.14)
  - **Color:** rgba(255,255,255,.75)
  - **Tags:** AWS, DevOps, FinOps, Serverless, IA Aplicada

#### Botões (.hero-actions)
- **Display:** flex
- **Align-items:** center
- **Gap:** 14px
- **Flex-wrap:** wrap
- **Margin-bottom:** 30px

##### Botão Clay (.btn-clay)
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
- **Texto:** "Trabalhe comigo →"
  - **Nota:** "→" em `<span class="arrow">` com font-family monospace

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
- **Texto:** "Ver artigos técnicos →"

#### Sociais (.hero-socials)
- **Display:** flex
- **Gap:** 9px
- **Cada link (a):**
  - **Width:** 42px
  - **Height:** 42px
  - **Border-radius:** 11px
  - **Background:** rgba(255,255,255,.07)
  - **Border:** 1px solid rgba(255,255,255,.14)
  - **Color:** rgba(255,255,255,.68)
  - **Display:** flex
  - **Align-items:** center
  - **Justify-content:** center
  - **Transition:** all 0.2s
  - **Hover:**
    - **Background:** #C9603C (--clay)
    - **Border-color:** #C9603C
    - **Color:** #FFFFFF
    - **Transform:** translateY(-2px)
  - **SVG:**
    - **Width:** 18px
    - **Height:** 18px

---

### HERO RIGHT (Foto)

#### Photo Frame Container (.photo-frame)
- **Position:** relative
- **Width:** 100%
- **Max-width:** 392px

#### Foto Slot (.pf-slot)
- **Display:** block
- **Width:** 100%
- **Aspect-ratio:** 4/5
- **Border-radius:** 20px
- **Overflow:** hidden
- **Border:** 1px solid rgba(255,255,255,.14)
- **Box-shadow:** 0 36px 70px -34px rgba(0,0,0,.7)
- **Transform:** scaleX(-1) (espelhada horizontalmente)
- **Object-fit:** cover
- **Object-position:** center
- **Src:** `foto-marcelo.png`
- **Alt:** `Marcelo Gonçalves`
- **Id:** `marcelo-photo`

#### Photo Frame Background (::before)
- **Content:** ""
- **Position:** absolute
- **Left:** -20px
- **Bottom:** -20px
- **Width:** 160px
- **Height:** 160px
- **Z-index:** -1
- **Border-radius:** 20px
- **Background:** transparent (removido o gradiente)

#### Photo Tag (.pf-tag)
- **Position:** absolute
- **Left:** 14px
- **Bottom:** 14px
- **Z-index:** 2
- **Display:** flex
- **Align-items:** center
- **Gap:** 8px
- **Background:** rgba(8,50,61,.78) (--petrol-deep com opacidade)
- **Backdrop-filter:** blur(6px)
- **Border:** 1px solid rgba(255,255,255,.16)
- **Border-radius:** 999px
- **Padding:** 8px 14px
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10px
- **Letter-spacing:** 0.12em
- **Text-transform:** uppercase
- **Color:** #FFFFFF
- **Texto:** "Engenheiro Cloud · AWS"

##### Dot (.dot)
- **Width:** 7px
- **Height:** 7px
- **Border-radius:** 50%
- **Background:** #3F6B47 (--moss)
- **Box-shadow:** 0 0 0 3px rgba(63,107,71,.3)

---

### HERO STATS (.hero-stats)

#### Container Principal
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 56px auto 0
- **Display:** flex
- **Padding:** 0 40px
- **Border-top:** 1px solid rgba(255,255,255,.09)

#### Cada Stat (.hstat)
- **Flex:** 1
- **Padding:** 26px 28px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 3px
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
- **Margin-top:** 3px

#### Stats:
1. "10+" / "Anos de experiência"
2. "8+" / "Anos com AWS"
3. "3+" / "Países"
4. "15+" / "Anos de ensino"

---

## 2. TRAJETÓRIA SECTION

### Container Principal
- **Background:** #FAF8F3 (--ivory)
- **Padding:** 96px 0

### Wrap (.wrap)
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px

### Grid Principal (.traj-grid)
- **Display:** grid
- **Grid-template-columns:** 1.08fr 0.92fr
- **Gap:** 60px
- **Align-items:** center

---

### TRAJETÓRIA LEFT

#### Eyebrow
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
  - **Content:** ""
  - **Width:** 30px
  - **Height:** 1px
  - **Background:** #C9603C
- **Texto:** "Trajetória"

#### Heading (.sec-t)
- **Font-weight:** 800
- **Font-size:** clamp(1.75rem, 2.8vw, 2.25rem)
- **Letter-spacing:** -0.035em
- **Color:** #0C2027 (--ink)
- **Line-height:** 1.1
- **Margin-bottom:** 18px
- **Max-width:** 460px
- **Text-wrap:** balance
- **Texto:** "Uma carreira entre o código e a sala de aula"

#### Parágrafos (p)
- **Font-size:** 1.0625rem
- **Line-height:** 1.75
- **Color:** #3C5A64 (--slate)
- **p + p:** margin-top 14px
- **strong:**
  - **Color:** #A94C2D (--clay-hover)
  - **Font-weight:** 600

#### Texto:
Parágrafo 1: "Especialista em *alta disponibilidade e eficiência*, projeto infraestruturas cloud que sustentam negócios em escala global. Minha carreira é definida pela busca de resiliência, automação e arquiteturas que envelhecem bem."

Parágrafo 2: "Colaborei com empresas líderes no *Brasil e no exterior*, refinando metodologias que equilibram agilidade técnica com governança corporativa — uma atuação internacional que molda como penso arquitetura até hoje."

---

### TRAJETÓRIA QUOTE (.traj-quote)

#### Container Principal
- **Position:** relative
- **Overflow:** hidden
- **Isolation:** isolate
- **Background:** #0F4C5C (--petrol)
- **Border-radius:** 20px
- **Padding:** 42px 44px
- **Box-shadow:** 0 24px 56px -28px rgba(8,50,61,.5)

#### Background (::before)
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
- **Mask:** radial-gradient(ellipse at 75% 18%, #000 28%, transparent 74%)

#### Todos os filhos
- **Position:** relative
- **Z-index:** 1

#### Mark (.tq-mark)
- **Font-family:** Georgia, serif
- **Font-size:** 5rem
- **Line-height:** 0.6
- **Color:** rgba(255,255,255,.16)
- **Height:** 38px
- **Texto:** """

#### Texto da Quote (.tq-text)
- **Font-size:** 1.25rem
- **Line-height:** 1.5
- **Color:** #FFFFFF
- **Letter-spacing:** -0.015em
- **Font-weight:** 600
- **Text-wrap:** balance
- **Margin-bottom:** 24px
- **em:**
  - **Font-style:** italic
  - **Color:** #5B8B96 (--petrol-soft)
- **Texto:** "A tecnologia só atinge seu potencial máximo quando é comunicada com *clareza* — uma ponte entre o detalhe da engenharia e a decisão estratégica."

#### Footer Quote (.tq-foot)
- **Display:** flex
- **Align-items:** center
- **Gap:** 24px
- **Padding-top:** 22px
- **Border-top:** 1px solid rgba(255,255,255,.12)

##### Author (.tq-author)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 2px
- **.n (nome)**
  - **Font-weight:** 700
  - **Font-size:** 14.5px
  - **Color:** #FFFFFF
  - **Texto:** "Marcelo Gonçalves"
- **.r (role)**
  - **Font-family:** 'JetBrains Mono'
  - **Font-size:** 10px
  - **Letter-spacing:** 0.12em
  - **Text-transform:** uppercase
  - **Color:** rgba(255,255,255,.45)
  - **Texto:** "Engenheiro & Professor"

##### Stat (.tq-stat)
- **Margin-left:** auto
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 2px
- **Text-align:** right
- **.v (valor)**
  - **Font-weight:** 800
  - **Font-size:** 1.9rem
  - **Letter-spacing:** -0.03em
  - **Color:** #FFFFFF
  - **Line-height:** 1
  - **Texto:** "15+"
- **.l (label)**
  - **Font-family:** 'JetBrains Mono'
  - **Font-size:** 9.5px
  - **Letter-spacing:** 0.16em
  - **Text-transform:** uppercase
  - **Color:** rgba(255,255,255,.45)
  - **Texto:** "Anos ensinando"

---

### TRAJ COMPANIES

#### Container (.traj-companies)
- **Margin-top:** 48px
- **Background:** #FFFFFF (--surface)
- **Border:** 1px solid #E4DDD0 (--line)
- **Border-radius:** 20px
- **Padding:** 52px 56px
- **Display:** grid
- **Grid-template-columns:** 1fr 1fr
- **Gap:** 60px
- **Align-items:** center
- **Margin-bottom:** 25px
- **Nota:** mesmo padrão visual do `.acad-card` (Base Acadêmica) — card branco com borda neutra

#### Wrapper Left (.tc-wrapper)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 18px

##### Eyebrow
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 10px
- **::before**
  - **Width:** 30px
  - **Height:** 1px
  - **Background:** #C9603C
- **Texto:** "Experiência"

##### Label (.tc-label)
- **Font-family:** 'Inter'
- **Font-size:** clamp(1.75rem, 2.8vw, 2.25rem)
- **Font-weight:** 800
- **Letter-spacing:** -0.035em
- **Color:** #0C2027 (--ink)
- **Margin-bottom:** 0
- **Line-height:** 1.1
- **Texto:** "Empresas que marcaram a <span style="color:var(--clay)">trajetória</span>"

##### Subtítulo (.tc-sub)
- **Font-size:** 1.0625rem
- **Line-height:** 1.65
- **Color:** #3C5A64 (--slate)
- **Margin-top:** 12px
- **Texto:** "Atuação em empresas líderes no Brasil e no exterior, do código à escala global."

#### Logo List (.tc-list)
- **Display:** grid
- **Grid-template-columns:** 1fr 1fr

#### Logo Item (.tc-item)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Padding:** 20px 0
- **Border-bottom:** 1px solid #E4DDD0 (--line)
- **:nth-child(odd)**
  - **Padding-right:** 28px
  - **Border-right:** 1px solid #E4DDD0 (--line)
- **:nth-child(even)**
  - **Padding-left:** 28px
- **:nth-child(3), :nth-child(4)**
  - **Border-bottom:** none

#### Cada Logo (.tc-logo)
- **Width:** auto
- **Filter:** none
- **Opacity:** 1
- **Transition:** opacity 0.25s
- **Hover:**
  - **Opacity:** 0.7
- **Logo 1 (Accenture):** height 42px, max-width 160px, margin-bottom 16px
- **Logo 2 (Deutsche Bahn):** height 62px, max-width 160px
- **Logo 3 (Anynines):** height 54px, max-width 180px
- **Logo 4 (CrediSIS):** height 72px, max-width 170px
- **Logos:** accenture-logo.png, deutsche-bahn-logo.png, anynines-logo.png, credisis-logo.png
- **Disposição:** grade 2×2 — Accenture e Deutsche Bahn na linha superior; Anynines e CrediSIS na inferior
- **Nota:** logos centralizados horizontalmente em cada célula via justify-content:center; sem margens manuais

---

## 3. ÁREAS SECTION

### Container Principal
- **Background:** #FFFFFF (--surface)
- **Border-top:** 1px solid #E4DDD0 (--line)
- **Border-bottom:** 1px solid #E4DDD0
- **Padding:** 96px 0

### Wrap
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px

### Head (.areas-head)
- **Margin-bottom:** 48px

#### Eyebrow
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
- **Texto:** "Especialidades"

#### Heading
- **Font-weight:** 800
- **Font-size:** clamp(1.75rem, 2.8vw, 2.25rem)
- **Letter-spacing:** -0.035em
- **Color:** #0C2027 (--ink)
- **Line-height:** 1.1
- **Texto:** "Áreas em que atuo"

#### Description
- **Font-size:** 1.0625rem
- **Line-height:** 1.65
- **Color:** #3C5A64 (--slate)
- **Max-width:** 520px
- **Margin-top:** 12px
- **Texto:** "Da arquitetura à operação do dia a dia — onde aplico engenharia para construir e sustentar nuvem com eficiência."

### Grid (.areas-grid)
- **Display:** grid
- **Grid-template-columns:** repeat(3, 1fr)
- **Grid-auto-rows:** 1fr
- **Gap:** 20px

### Area Card (.area-card)
- **Background:** #FFFFFF (--surface)
- **Border:** 1px solid #E4DDD0 (--line)
- **Border-radius:** 16px
- **Padding:** 28px 30px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 10px
- **Overflow:** hidden
- **Transition:** background 0.18s, transform 0.2s, box-shadow 0.2s, border-color 0.2s
- **Hover:**
  - **Background:** #F0ECE2 (--sand)
  - **Transform:** translateY(-3px)
  - **Box-shadow:** 0 14px 32px rgba(12,32,39,.09)

#### Category (.ac-cat)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)

#### Title (.ac-title)
- **Font-weight:** 800
- **Font-size:** 1.2rem
- **Letter-spacing:** -0.025em
- **Color:** #0F4C5C (--petrol)
- **Line-height:** 1.25

#### Description (p.ac-desc)
- **Font-size:** 14px
- **Line-height:** 1.6
- **Color:** #3C5A64 (--slate)
- **Flex:** 1

#### Meta (.ac-meta)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.04em
- **Color:** #7E969E (--steel)
- **Margin-top:** 6px
- **Padding-top:** 14px
- **Border-top:** 1px solid #E4DDD0 (--line)

### Variante Featured (.area-card.feat)
- **Background:** #C9603C (--clay)
- **Border-color:** transparent
- **Box-shadow:** 0 6px 18px rgba(201,96,60,.2)
- **Hover:**
  - **Background:** #A94C2D (--clay-hover)
  - **Transform:** translateY(-3px)
  - **Box-shadow:** 0 18px 40px rgba(201,96,60,.3)
- **.ac-cat**
  - **Color:** rgba(255,255,255,.9)
- **.ac-title**
  - **Color:** #FFFFFF
  - **Font-size:** 1.32rem
- **.ac-desc**
  - **Color:** rgba(250,248,243,.92)
- **.ac-meta**
  - **Color:** rgba(255,255,255,.75)
  - **Border-top-color:** rgba(255,255,255,.2)

### Cards (ordem e variantes):
1. **Arquitetura AWS** (feat) - Nuvem Empresarial
2. **DevOps & Automação** - Entrega Contínua
3. **Serverless** - Computação Sem Servidor
4. **FinOps** - Gestão de Custos
5. **Linux** - Sistemas Operacionais
6. **Administração de Infra AWS** - Operações de Nuvem

---

## 4. DIFERENCIAL SECTION

### Container Principal
- **Background:** #0F4C5C (--petrol)
- **Color:** #FAF8F3 (--ivory)
- **Position:** relative
- **Overflow:** hidden
- **Isolation:** isolate
- **Padding:** 80px 0

#### Background (::before)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.5
- **Background layers:**
  1. Radial: 50% 65% at 100% 0%, rgba(201,96,60,.3) → transparent 55%
  2. Radial: 42% 55% at 0% 100%, rgba(91,139,150,.22) → transparent 60%
  3. Linear grid horizontal: 76px
  4. Linear grid vertical: 76px
- **Mask:** radial-gradient(ellipse at 55% 28%, #000 28%, transparent 80%)

### Wrap
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px
- **Position:** relative
- **Z-index:** 1
- **Display:** flex
- **Flex-direction:** column
- **Align-items:** center
- **Text-align:** center

### Eyebrow (.dif-ey)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.55)
- **Display:** flex
- **Align-items:** center
- **Gap:** 14px
- **Margin-bottom:** 24px
- **::before, ::after (linhas)**
  - **Content:** ""
  - **Flex:** 0 0 30px
  - **Height:** 1px
  - **Background:** rgba(255,255,255,.2)
- **Texto:** "O Diferencial"

### Heading (.dif-title)
- **Font-weight:** 800
- **Font-size:** clamp(2rem, 3.6vw, 2.85rem)
- **Letter-spacing:** -0.04em
- **Color:** #FFFFFF
- **Line-height:** 1.08
- **Margin-bottom:** 26px
- **Text-wrap:** balance
- **em:**
  - **Font-style:** italic
  - **Color:** #5B8B96 (--petrol-soft)
- **Texto:** "Engenharia encontra *linguagem*"

### Quote (.dif-quote)
- **Max-width:** 680px
- **Font-size:** 1.125rem
- **Line-height:** 1.75
- **Color:** rgba(250,248,243,.74)
- **Margin-bottom:** 30px
- **em:**
  - **Font-style:** italic
  - **Color:** #FFFFFF
  - **Font-weight:** 500
- **Texto:** "Minha base não é apenas engenharia. Sou formado em Letras, com Mestrado em Linguística. No mundo atual, onde a IA e os modelos de linguagem dominam a arquitetura, entender a estrutura da palavra é o que me permite conectar o *como* técnico ao *porquê* estratégico."

### Author (.dif-author)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.18em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.42)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 52px
- **::before, ::after (linhas)**
  - **Content:** ""
  - **Flex:** 0 0 22px
  - **Height:** 1px
  - **Background:** rgba(255,255,255,.18)
- **Texto:** "Marcelo Gonçalves"

### Langs Label (.dif-langs-label)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.4)
- **Margin-bottom:** 18px

### Langs Container (.dif-langs)
- **Display:** flex
- **Gap:** 12px
- **Flex-wrap:** wrap
- **Justify-content:** center

### Lang Pill (.lang-pill)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Background:** rgba(255,255,255,.07)
- **Border:** 1px solid rgba(255,255,255,.14)
- **Border-radius:** 999px
- **Padding:** 11px 22px
- **Transition:** background 0.2s, transform 0.2s
- **Hover:**
  - **Background:** rgba(255,255,255,.12)
  - **Transform:** translateY(-2px)

#### Lang Flag (.lang-flag)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9.5px
- **Letter-spacing:** 0.1em
- **Color:** rgba(255,255,255,.42)
- **Padding-right:** 12px
- **Border-right:** 1px solid rgba(255,255,255,.16)

#### Lang Name (.lang-name)
- **Font-weight:** 700
- **Font-size:** 14px
- **Color:** #FFFFFF

#### Lang Level (.lang-level)
- **Font-size:** 13px
- **Color:** rgba(255,255,255,.5)

### Idiomas:
1. BR / Português / Nativo
2. US / Inglês / Avançado
3. DE / Alemão / Avançado

---

## 5. CERTIFICAÇÕES SECTION

### Container Principal
- **Background:** #FAF8F3 (--ivory)
- **Padding:** 96px 0

### Wrap
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px

### Head (.certs-head)
- **Margin-bottom:** 48px
- **Max-width:** 620px

#### Eyebrow
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
- **Texto:** "Credenciais"

#### Heading
- **Font-weight:** 800
- **Font-size:** clamp(1.75rem, 2.8vw, 2.25rem)
- **Letter-spacing:** -0.035em
- **Color:** #0C2027 (--ink)
- **Line-height:** 1.1
- **Texto:** "Certificações"

#### Description
- **Font-size:** 1.0625rem
- **Line-height:** 1.65
- **Color:** #3C5A64 (--slate)
- **Max-width:** 520px
- **Margin-top:** 12px
- **Texto:** "Credenciais que validam na prática o que aplico no dia a dia — da arquitetura de soluções à automação de infraestrutura e observabilidade."

### Grid (.certs-grid)
- **Display:** grid
- **Grid-template-columns:** repeat(3, 1fr)
- **Gap:** 20px

### Cert Card (.cert-card)
- **Background:** #FFFFFF (--surface)
- **Border:** 1px solid #E4DDD0 (--line)
- **Border-radius:** 16px
- **Padding:** 28px 28px 24px
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 18px
- **Transition:** transform 0.2s, box-shadow 0.2s, border-color 0.2s
- **Hover:**
  - **Transform:** translateY(-3px)
  - **Box-shadow:** 0 14px 30px -12px rgba(12,32,39,.12)
  - **Border-color:** rgba(15,76,92,.22)

#### Top (.cert-top)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** space-between
- **Gap:** 12px

##### Tile (.cert-tile)
- **Width:** 52px
- **Height:** 52px
- **Border-radius:** 13px
- **Background:** #0F4C5C (--petrol)
- **Color:** #FFFFFF
- **Font-family:** 'JetBrains Mono'
- **Font-weight:** 600
- **Font-size:** 15px
- **Letter-spacing:** 0.02em
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Flex:** none

##### Verified (.cert-verified)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 9px
- **Letter-spacing:** 0.14em
- **Text-transform:** uppercase
- **Color:** #3F6B47 (--moss)
- **Display:** flex
- **Align-items:** center
- **Gap:** 6px
- **SVG:**
  - **Width:** 13px
  - **Height:** 13px

#### Body (.cert-body)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 4px

##### Issuer (.cert-issuer)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)

##### Name (.cert-name)
- **Font-weight:** 700
- **Font-size:** 1.05rem
- **Letter-spacing:** -0.02em
- **Color:** #0C2027 (--ink)
- **Line-height:** 1.3

### Variante Accent (.cert-card.accent)
- **.cert-tile**
  - **Background:** #C9603C (--clay)

### Certificações (6 no total):
1. **SA** / AWS Certified / Solutions Architect – Associate (accent)
2. **SO** / AWS Certified / SysOps Administrator – Associate
3. **TF** / HashiCorp / Terraform Associate
4. **CP** / AWS Certified / Cloud Practitioner
5. **SP** / Splunk / Power User
6. **Card especial** (dashed border, background sand, color petrol)
   - "Sempre estudando" / "Próxima certificação a caminho →"
   - Display: flex com justify-content center e align-items center
   - Border-style: dashed

---

## 6. BASE ACADÊMICA SECTION

### Container Principal
- **Background:** #FAF8F3 (--ivory)
- **Padding:** 0 0 96px

### Wrap
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px

### Card (.acad-card)
- **Background:** #FFFFFF (--surface)
- **Border:** 1px solid #E4DDD0 (--line)
- **Border-radius:** 20px
- **Padding:** 52px 56px
- **Display:** grid
- **Grid-template-columns:** 1fr 1fr
- **Gap:** 60px
- **Align-items:** center

### Left (.acad-left)

#### Eyebrow
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
- **Texto:** "Formação"

#### Heading (.sec-t)
- **Font-weight:** 800
- **Font-size:** clamp(1.75rem, 2.8vw, 2.25rem)
- **Letter-spacing:** -0.035em
- **Color:** #0C2027 (--ink)
- **Line-height:** 1.1
- **Margin-bottom:** 16px
- **Text-wrap:** balance
- **Texto:** "Base acadêmica multidisciplinar"

#### Parágrafo (p)
- **Font-size:** 1rem
- **Line-height:** 1.72
- **Color:** #3C5A64 (--slate)
- **Texto:** "Uma formação que conecta a precisão da engenharia à clareza da comunicação. Cada disciplina contribui para uma visão única — da arquitetura cloud à estrutura da linguagem."

### Right (.acad-right)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 6px

### Acad Item (.acad-item)
- **Display:** flex
- **Align-items:** flex-start
- **Gap:** 16px
- **Padding:** 16px 0
- **Border-bottom:** 1px solid #E4DDD0 (--line)
- **:last-child**
  - **Border-bottom:** none

#### Tile (.acad-tile)
- **Flex:** none
- **Width:** 40px
- **Height:** 40px
- **Border-radius:** 10px
- **Background:** #0F4C5C (--petrol)
- **Color:** #FAF8F3 (--ivory)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 12px
- **Font-weight:** 600
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Conteúdo:** "01", "02", "03", "04"

#### Text Container (.acad-txt)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 3px

##### Type (.acad-type)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10px
- **Letter-spacing:** 0.18em
- **Text-transform:** uppercase
- **Color:** #C9603C (--clay)

##### Name (.acad-name)
- **Font-weight:** 700
- **Font-size:** 15.5px
- **Letter-spacing:** -0.015em
- **Color:** #0C2027 (--ink)
- **Line-height:** 1.3

### Itens:
1. Especialização / Arquitetura Cloud
2. Graduação / Sistemas de Informação
3. Mestrado / Linguística Aplicada
4. Graduação / Licenciatura em Letras

---

## 7. CTA ASSESSORIA SECTION

### Container Principal
- **Background:** #0F4C5C (--petrol)
- **Color:** #FAF8F3 (--ivory)
- **Position:** relative
- **Overflow:** hidden
- **Isolation:** isolate

#### Background (::before)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Opacity:** 0.55
- **Pointer-events:** none
- **Z-index:** 0
- **Background layers:**
  1. Radial: 50% 70% at 100% 0%, rgba(201,96,60,.32) → transparent 55%
  2. Radial: 40% 60% at 0% 100%, rgba(91,139,150,.2) → transparent 60%
  3. Linear grid horizontal: 80px
  4. Linear grid vertical: 80px
- **Mask:** radial-gradient(ellipse at 70% 30%, #000 30%, transparent 80%)

### Inner Container (.cta-adv-in)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 88px 40px
- **Display:** grid
- **Grid-template-columns:** 1.06fr 0.94fr
- **Gap:** 60px
- **Align-items:** center

### Left (.left)

#### Eyebrow (.ey2)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Letter-spacing:** 0.22em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.72)
- **Display:** flex
- **Align-items:** center
- **Gap:** 12px
- **Margin-bottom:** 20px
- **::before**
  - **Content:** ""
  - **Width:** 30px
  - **Height:** 1px
  - **Background:** #C9603C (--clay)
- **Texto:** "Assessoria & Consultoria"

#### Heading (h2)
- **Font-weight:** 800
- **Font-size:** clamp(2rem, 3.6vw, 2.75rem)
- **Line-height:** 1.06
- **Letter-spacing:** -0.04em
- **Color:** #FFFFFF
- **Max-width:** 500px
- **em:**
  - **Font-style:** italic
  - **Color:** #5B8B96 (--petrol-soft)
- **Texto:** "Precisa de ajuda para *construir* ou escalar na nuvem?"

#### Description (.desc)
- **Font-size:** 1.0625rem
- **Line-height:** 1.6
- **Color:** rgba(250,248,243,.66)
- **Max-width:** 440px
- **Margin-top:** 18px
- **Texto:** "Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa."

#### Points (.points)
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 13px
- **Margin-top:** 26px
- **li**
  - **List-style:** none
  - **Display:** flex
  - **Align-items:** flex-start
  - **Gap:** 12px
  - **Font-size:** 15px
  - **Line-height:** 1.5
  - **Color:** rgba(250,248,243,.9)

##### Check Icon (.ck)
- **Flex:** none
- **Width:** 22px
- **Height:** 22px
- **Border-radius:** 7px
- **Margin-top:** 1px
- **Background:** rgba(201,96,60,.2)
- **Color:** #E8A582
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **SVG:**
  - **Width:** 13px
  - **Height:** 13px

##### Bold (.b)
- **Color:** #FFFFFF
- **Font-weight:** 600

### Points (3 no total):
1. "Arquitetura **AWS** sob medida, sem desperdício de custo"
2. "Automação e **CI/CD** de ponta a ponta em código"
3. "Adoção de **IA** com foco em resultado, não em hype"

---

### Right (.right)

#### Card (.adv-card)
- **Background:** rgba(255,255,255,.05)
- **Border:** 1px solid rgba(255,255,255,.14)
- **Border-radius:** 18px
- **Padding:** 34px 34px 30px
- **Backdrop-filter:** blur(4px)
- **Box-shadow:** 0 24px 60px -28px rgba(0,0,0,.55)

##### Tagline (.tagline)
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.16em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.6)
- **Display:** flex
- **Align-items:** center
- **Gap:** 9px
- **Margin-bottom:** 18px
- **.dot**
  - **Width:** 7px
  - **Height:** 7px
  - **Border-radius:** 50%
  - **Background:** #3F6B47 (--moss)
  - **Box-shadow:** 0 0 0 3px rgba(63,107,71,.25)
- **Texto:** "Disponível para novos projetos"

##### Heading (h3)
- **Font-weight:** 800
- **Font-size:** 1.4rem
- **Letter-spacing:** -0.025em
- **Color:** #FFFFFF
- **Line-height:** 1.2
- **Texto:** "Vamos conversar sobre o seu"

##### Subtitle (.sub)
- **Font-size:** 14.5px
- **Line-height:** 1.6
- **Color:** rgba(250,248,243,.66)
- **Margin-top:** 10px
- **Texto:** "Diagnóstico inicial gratuito. Conte o desafio e eu retorno com um plano objetivo."

##### Services (.svc)
- **Display:** flex
- **Flex-wrap:** wrap
- **Gap:** 8px
- **Margin:** 22px 0 26px
- **span**
  - **Font-family:** 'JetBrains Mono'
  - **Font-size:** 10.5px
  - **Letter-spacing:** 0.08em
  - **Text-transform:** uppercase
  - **Color:** rgba(255,255,255,.8)
  - **Background:** rgba(255,255,255,.06)
  - **Border:** 1px solid rgba(255,255,255,.12)
  - **Padding:** 7px 12px
  - **Border-radius:** 999px
- **Serviços:** "Cloud · AWS", "DevOps", "IA aplicada", "Mentoria"

##### Button (.btn-adv)
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Gap:** 10px
- **Width:** 100%
- **Background:** #C9603C (--clay)
- **Color:** #FFFFFF
- **Border:** none
- **Cursor:** pointer
- **Text-decoration:** none
- **Height:** 56px
- **Border-radius:** 13px
- **Font-family:** 'Inter'
- **Font-weight:** 600
- **Font-size:** 15.5px
- **Box-shadow:** 0 12px 26px -8px rgba(201,96,60,.55)
- **Transition:** background 0.2s, transform 0.2s
- **Hover:**
  - **Background:** #A94C2D (--clay-hover)
  - **Transform:** translateY(-2px)
- **.arrow**
  - **Font-family:** 'JetBrains Mono'
- **Texto:** "Conhecer a assessoria →"

##### Reassurance (.reassure)
- **Text-align:** center
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.1em
- **Text-transform:** uppercase
- **Color:** rgba(255,255,255,.5)
- **Margin-top:** 16px
- **Texto:** "Resposta em até 24h · sem compromisso"

---

## 8. FOOTER

### Container Principal (footer.site)
- **Position:** relative
- **Background:** #08323D (--petrol-deep)
- **Color:** #A8C0C6
- **Overflow:** hidden
- **Isolation:** isolate

#### Top Border (::before)
- **Content:** ""
- **Position:** absolute
- **Top:** 0
- **Left:** 0
- **Right:** 0
- **Height:** 2px
- **Z-index:** 2
- **Background:** linear-gradient(90deg, transparent, #5B8B96 30%, #C9603C 70%, transparent)

#### Background (::after)
- **Content:** ""
- **Position:** absolute
- **Inset:** 0
- **Z-index:** 0
- **Pointer-events:** none
- **Opacity:** 0.5
- **Background layers:**
  1. Radial: 46% 70% at 88% 0%, rgba(201,96,60,.22) → transparent 58%
  2. Radial: 40% 60% at 6% 12%, rgba(91,139,150,.16) → transparent 60%
  3. Linear grid horizontal: 76px
  4. Linear grid vertical: 76px
- **Mask:** radial-gradient(ellipse at 60% 0%, #000 35%, transparent 85%)

### Foot In (.foot-in)
- **Position:** relative
- **Z-index:** 1
- **Max-width:** 1240px
- **Margin:** 0 auto
- **Padding:** 0 40px 26px

---

### FOOTER LEAD (.foot-lead)

- **Display:** flex
- **Align-items:** flex-end
- **Justify-content:** space-between
- **Gap:** 40px
- **Padding:** 60px 0 40px
- **Border-bottom:** 1px solid rgba(255,255,255,.08)
- **Flex-wrap:** wrap

#### Manifesto (.manifesto)
- **Font-weight:** 800
- **Font-size:** clamp(1.5rem, 2.6vw, 2.1rem)
- **Line-height:** 1.18
- **Letter-spacing:** -0.03em
- **Color:** #FFFFFF
- **Max-width:** 560px
- **Text-wrap:** balance
- **em:**
  - **Font-style:** italic
  - **Color:** #5B8B96 (--petrol-soft)
- **Texto:** "Engenharia, IA e automação — *decifradas* por quem constrói em produção."

#### To Top Button (.to-top)
- **Flex:** none
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 10px
- **Cursor:** pointer
- **Background:** rgba(255,255,255,.05)
- **Border:** 1px solid rgba(255,255,255,.16)
- **Color:** #FFFFFF
- **Font-family:** 'Inter'
- **Font-weight:** 600
- **Font-size:** 13.5px
- **Padding:** 13px 20px
- **Border-radius:** 999px
- **Transition:** background 0.2s, border-color 0.2s, transform 0.2s
- **Hover:**
  - **Background:** #C9603C (--clay)
  - **Border-color:** #C9603C
  - **Transform:** translateY(-2px)
- **SVG:**
  - **Width:** 15px
  - **Height:** 15px
- **Texto:** "Voltar ao topo"

---

### FOOTER TOP (.foot-top)

- **Display:** grid
- **Grid-template-columns:** 1.6fr 1fr 1fr 1.2fr
- **Gap:** 48px
- **Padding:** 48px 0 44px
- **Border-bottom:** 1px solid rgba(255,255,255,.08)

#### Brand (.foot-brand)

##### Logo (.b)
- **Font-weight:** 800
- **Font-size:** 22px
- **Color:** #FFFFFF
- **Letter-spacing:** -0.02em
- **.b2**
  - **Color:** #5B8B96 (--petrol-soft)
- **Texto:** "Marcelo<span>Gonçalves</span>"

##### Description (p)
- **Font-size:** 14px
- **Line-height:** 1.65
- **Color:** #8FAAB1
- **Max-width:** 300px
- **Margin-top:** 16px
- **Texto:** "Tutoriais, bastidores e decisões reais de um blog construído do zero na AWS, quase 100% com IA."

##### Badge (.badge)
- **Display:** inline-flex
- **Align-items:** center
- **Gap:** 8px
- **Margin-top:** 20px
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 10.5px
- **Letter-spacing:** 0.12em
- **Text-transform:** uppercase
- **Color:** #A8C0C6
- **Background:** rgba(255,255,255,.05)
- **Border:** 1px solid rgba(255,255,255,.1)
- **Padding:** 7px 13px
- **Border-radius:** 999px
- **.dot**
  - **Width:** 7px
  - **Height:** 7px
  - **Border-radius:** 50%
  - **Background:** #3F6B47 (--moss)
  - **Box-shadow:** 0 0 0 3px rgba(63,107,71,.25)
- **Texto:** "No ar · construído com IA"

---

#### Colunas Footer (.foot-col)

##### Heading (h5)
- **Font-weight:** 600
- **Font-size:** 11px
- **Letter-spacing:** 0.18em
- **Text-transform:** uppercase
- **Color:** #FFFFFF
- **Margin-bottom:** 20px

##### Lista (ul)
- **List-style:** none
- **Display:** flex
- **Flex-direction:** column
- **Gap:** 12px

**Li a**
- **Display:** inline-flex
- **Align-items:** center
- **Font-size:** 14px
- **Color:** #8FAAB1
- **Transition:** color 0.2s
- **Hover:**
  - **Color:** #FFFFFF

##### Contact (.contact)
- **Display:** flex
- **Align-items:** center
- **Gap:** 10px
- **Font-size:** 14px
- **Color:** #8FAAB1
- **Margin-bottom:** 20px
- **Transition:** color 0.2s
- **Hover:**
  - **Color:** #FFFFFF
- **.ic**
  - **Flex:** none
  - **Width:** 34px
  - **Height:** 34px
  - **Border-radius:** 9px
  - **Background:** rgba(255,255,255,.05)
  - **Border:** 1px solid rgba(255,255,255,.1)
  - **Display:** flex
  - **Align-items:** center
  - **Justify-content:** center
  - **SVG:**
    - **Width:** 16px
    - **Height:** 16px
    - **Opacity:** 0.85

##### Sociais (.foot-soc)
- **Display:** flex
- **Gap:** 9px

**a**
- **Width:** 40px
- **Height:** 40px
- **Border-radius:** 11px
- **Background:** rgba(255,255,255,.05)
- **Border:** 1px solid rgba(255,255,255,.1)
- **Color:** #A8C0C6
- **Display:** flex
- **Align-items:** center
- **Justify-content:** center
- **Transition:** all 0.2s
- **Hover:**
  - **Background:** #C9603C (--clay)
  - **Border-color:** #C9603C
  - **Color:** #FFFFFF
  - **Transform:** translateY(-2px)
- **SVG:**
  - **Width:** 17px
  - **Height:** 17px

---

### FOOTER COLUMNS

#### Coluna 1: Categorias
- **Heading:** "Categorias"
- **Links:** 
  - Inteligência Artificial
  - DevOps
  - Cloud · AWS
  - Engenharia

#### Coluna 2: Links Rápidos
- **Heading:** "Links Rápidos"
- **Links:**
  - Home
  - O Projeto
  - Serviços
  - Sobre

#### Coluna 3: Contato
- **Heading:** "Contato"
- **Contact link:**
  - Icon: envelope
  - Email: contato@marcelogoncalves.com
- **Sociais:**
  - LinkedIn
  - Instagram
  - GitHub

---

### WATERMARK (.foot-watermark)

- **Position:** relative
- **Margin-top:** 28px
- **Text-align:** center
- **Line-height:** 0.8
- **White-space:** nowrap
- **Font-family:** 'Inter'
- **Font-weight:** 900
- **Letter-spacing:** -0.055em
- **Font-size:** clamp(2rem, 8.6vw, 6.8rem)
- **Color:** transparent
- **Background:** linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.01))
- **-webkit-background-clip:** text
- **Background-clip:** text
- **User-select:** none
- **Pointer-events:** none
- **Texto:** "MarceloGonçalves"

---

### FOOTER BOTTOM (.foot-bottom)

- **Display:** flex
- **Justify-content:** space-between
- **Align-items:** center
- **Padding-top:** 24px
- **Margin-top:** 8px
- **Border-top:** 1px solid rgba(255,255,255,.08)
- **Flex-wrap:** wrap
- **Gap:** 14px
- **Font-family:** 'JetBrains Mono'
- **Font-size:** 11px
- **Color:** #5E7A82
- **Letter-spacing:** 0.06em

#### Links (.links)
- **Display:** flex
- **Gap:** 22px

**a:hover**
- **Color:** #FFFFFF

**Texto left:** `© 2026 Marcelo Gonçalves · Todos os direitos reservados`
**Links:** Privacidade (`#`) · Termos (`#`) · RSS (`#`)

---

## RESPONSIVIDADE

### Media Query: max-width 1000px

- **.traj-grid:** grid-template-columns 1fr, gap 40px
- **.areas-grid:** grid-template-columns 1fr 1fr
- **.certs-grid:** grid-template-columns 1fr 1fr
- **.acad-card:** grid-template-columns 1fr, gap 36px, padding 40px 40px
- **.cta-adv-in:** grid-template-columns 1fr, gap 44px
- **.foot-top:** grid-template-columns 1fr 1fr, gap 36px 32px
- **.foot-brand:** grid-column 1 / -1

### Media Query: max-width 860px

- **.nav-menu:** display none (escondido)
- **.hero-in:** grid-template-columns 1fr, gap 44px, padding-top 64px
- **.hero-right:** justify-content flex-start
- **.photo-frame:** max-width 340px

### Media Query: max-width 680px

- **.wrap:** padding 0 20px
- **.hero-in:** padding-left 20px, padding-right 20px
- **.hero-stats:** flex-wrap wrap, padding 0 20px
- **.hstat:** flex 1 1 40%, border-right none, border-bottom 1px solid rgba(255,255,255,.08), padding 20px 0
- **.areas-grid:** grid-template-columns 1fr
- **.certs-grid:** grid-template-columns 1fr
- **.acad-card:** padding 28px 22px
- **.traj-quote:** padding 32px 26px
- **.dif-langs:** gap 8px
- **.lang-pill:** padding 10px 16px
- **.cta-adv-in:** padding 64px 20px
- **.foot-top:** grid-template-columns 1fr
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

### "Voltar ao Topo" Button
- **Elemento:** `<button class="to-top" id="toTop">`
- **Comportamento:** scroll suave para o topo ao clicar
- **Função:** `document.documentElement.scrollTop = 0`

### Links Internos
- **Home:** href="Home.html"
- **O Projeto:** href="O Projeto.html"
- **Sobre:** href="#" (página atual)
- **Assessoria (CTA):** href="#assessoria"

---

## FONTES GOOGLE

```
family=Inter:wght@400;500;600;700;800;900
family=JetBrains+Mono:wght@400;500;600
```

---

## IMAGENS

- **Foto Marcelo:** `foto-marcelo.png` (4:5 aspect ratio, max-width 392px em desktop)
- **Logos:** 
  - accenture-logo.png
  - deutsche-bahn-logo.png
  - anynines-logo.png
  - credisis-logo.png

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

- **Toda a tipografia usa Inter e JetBrains Mono** — garantir que ambas as fontes sejam carregadas via Google Fonts
- **Espaçamentos são consistentes:** usar variáveis ou cálculos de clamp() para responsive
- **Shadows são sutis** — nunca use valores altos de blur; manter harmonia visual
- **Hover states existem em:** botões, cards, links, ícones sociais
- **Transitions são rápidas** — 0.2s é o padrão
- **Z-index hierarchy:** backgrounds (0), content (1), fixed elements (50+), nav (50), modals/overlays (60+)
- **Sem animações infinitas** em elementos de conteúdo — apenas em decorativos se necessário

---

**Fim da Especificação**

Este documento é completo o suficiente para reconstruir a página Sobre exatamente como está, pixel-perfeito, sem ambiguidades.
