# Design Briefing — 3 SuperDestaques
> Para Claude Design: Criar protótipos profissionais e world-class dos 3 SuperDestaques

---

## 1. Paleta de Cores

### Cores Primárias
- **Warm Ivory (fundo):** `#FAF8F3` — background principal, papel
- **Deep Petrol (accent):** `#0F4C5C` — cor primária azul
- **Navy Escuro:** `#1A2535` ou `#0A1F35` — backgrounds dark
- **Ink (texto primário):** `#0A0E1A` — muito escuro/preto
- **Paper Claro:** `#F5F8FC` — cream muito claro

### Cores Semânticas
- **Moss (verde editorial):** `#3F6B47`
- **Accent Mid (azul médio):** `#5B8B96`
- **Accent Deep:** `#073642`

### Escala de Transparência (para backgrounds/borders)
- 6%: `rgba(255,255,255,0.06)`
- 8%: `rgba(255,255,255,0.08)`
- 12%: `rgba(255,255,255,0.12)`
- 15%: `rgba(255,255,255,0.15)`
- 40%: `rgba(255,255,255,0.40)`
- 55%: `rgba(250,248,243,0.55)`
- 60%: `rgba(255,255,255,0.60)`
- 65%: `rgba(255,255,255,0.65)`
- 70%: `rgba(255,255,255,0.70)`

---

## 2. Tipografia

### Fontes
- **Display/Headings:** Inter Variable (weight 800, 900, letter-spacing -0.045em)
- **Body:** Inter Variable (weight 400, 500, 600)
- **Mono:** JetBrains Mono (para eyebrows)

### Escala de Tamanhos
- **Eyebrow:** 0.75rem (mono, 500 weight, 0.22em letter-spacing, UPPERCASE)
- **Description:** 1.125rem (400 weight, line-height 1.6)
- **Title:** clamp(2rem, 4.5vw, 3.25rem) — responsivo, 800 weight
- **Stat Value:** 2.5rem (900 weight, -0.04em letter-spacing)
- **Stat Label:** 0.875rem (400 weight, opacity 0.85)
- **Pillar Title:** 0.95rem (700 weight)
- **Pillar Stat:** 1.75rem (900 weight, -0.04em letter-spacing)
- **Button:** 0.875rem (600 weight, 0.01em letter-spacing)

---

## 3. Spacing & Layout

### Escala de Espaçamento
- s-1: 4px
- s-2: 8px
- s-3: 16px
- s-4: 24px
- s-5: 32px
- s-6: 48px
- s-7: 64px
- s-8: 96px
- s-9: 128px

### Dimensões Globais
- **Max-width inner (padrão):** 720px
- **Max-width 2-coluna:** 960px
- **Container max-width:** 1280px
- **Gap horizontal:** 32px (var(--s-5))
- **Gap vertical:** 64px (var(--s-7)) entre seções

### Padding dos SuperDestaques
- **Vertical:** 128px (var(--s-9)) top/bottom
- **Horizontal:** 32px (var(--s-5))

---

## 4. Componentes Base

### Cards/Containers
- **Border-radius:** 16px (geral), 12px (cards internos)
- **Box-shadow:** 0 4px 20px rgba(..., 0.07-0.32) — subtle até elevado
- **Border (interna):** 1px rgba(255,255,255,0.12) — para elementos em dark

### Botões
- **Height:** 56px
- **Padding:** 0 28px
- **Border-radius:** 16px
- **Font-weight:** 600
- **Transition:** all 0.2s ease
- **Hover:** transform translateY(-2px), background-color change

### Eyebrow Pattern
- **Font:** Mono, uppercase, 0.22em letter-spacing
- **Traços decorativos:** ::before e ::after, 32px width, 1px height
- **Gap entre traços e texto:** 12px
- **Opacity traços:** 0.4 a 0.5

---

## 5. Blob Decorativo (::before)

- **Position:** absolute top: 0, left: 50%, transform translateX(-50%)
- **Dimensions:** 800px width × 500px height
- **Border-radius:** 50% (circular)
- **Background:** radial-gradient (ellipse, rgba com cor temática, transparent 60%)
- **Filter:** blur(60px) — opcional
- **Pointer-events:** none

### Cores dos Blobs por Seção
- **Projeto (Petrol):** `radial-gradient(ellipse, rgba(0,0,0,0.15), transparent 60%)`
- **Serviços (Navy):** `radial-gradient(ellipse, rgba(15,76,92,0.25), transparent 60%)`

---

## 6. Os 3 SuperDestaques — Especificações Detalhadas

### A. SuperDestaque Projeto — Layout 2 Colunas

**Background:** `var(--accent)` = `#0F4C5C` (Deep Petrol)

**Estrutura:**
```
[Coluna Esquerda]              [Coluna Direita]
Eyebrow                        Stat Card 1
Título                         Stat Card 2
Descrição                      Stat Card 3
Botão
```

**Coluna Esquerda — Conteúdo**
- Eyebrow: "O Projeto"
  - Color: rgba(255,255,255,0.70)
  - Traços em: rgba(255,255,255,0.40)
- Título: "Veja como este **blog foi construído**"
  - `<em>` em italic, color rgba(255,255,255,0.90)
  - clamp responsivo
- Descrição: "Do zero na AWS, quase 100% com IA..."
  - Color: rgba(250,248,243,0.55)
  - Max-width: 100% (não restringir)
- Botão: "Acompanhe a Jornada →"
  - Background: `var(--paper)` (#FAF8F3)
  - Text: `var(--accent)` (#0F4C5C)
  - Hover: background muda para `var(--accent-mid)` (#5B8B96), text fica ink

**Coluna Direita — Stats (3 cards verticais)**
- Card 1: "100%" / "com IA"
- Card 2: "50+" / "artigos"
- Card 3: "4" / "meses ao vivo"

Cada card:
- Background: rgba(255,255,255,0.08)
- Border: 1px rgba(255,255,255,0.12)
- Border-radius: 12px
- Padding: 24px
- Value: 2.5rem, 900 weight, -0.04em letter-spacing
- Label: 0.875rem, opacity 0.85

**Grid Layout**
- 2 colunas, gap: 64px (var(--s-7))
- Align-items: center
- Text-align: left (diferente do padrão centered)

**Responsive Mobile**
- 1 coluna, gap 48px (var(--s-6))
- Stats inline ou em linha, text-align: center

---

### B. SuperDestaque Serviços — Layout com Pillars

**Background:** `#0A1F35` (Navy muito escuro) OU `#0A0E1A` (Ink)

**Estrutura:**
```
Eyebrow (centered)
Título (centered)
Descrição (centered)

[3 Pillar Cards em Grid]
Pilar 1         Pilar 2         Pilar 3

Botão (centered)
```

**Topo (Eyebrow + Título + Descrição)**
- Padrão centered como antes
- Eyebrow: "Consultoria"
  - Color: rgba(91,139,150,0.80)
  - Traços em: rgba(91,139,150,0.50)
- Título: "Transforme sua **arquitetura na AWS**"
  - `<em>` em italic, color rgba(91,139,150,0.95)
- Descrição: "Estratégia, implementação e otimização..."
  - Color: rgba(255,255,255,0.60)
  - Max-width: 560px

**Grid de Pillars (3 colunas)**
- Pilar 1:
  - Title: "Arquitetura"
  - Stat: "15+ projetos"
- Pilar 2:
  - Title: "Implementação"
  - Stat: "500M+ infra"
- Pilar 3:
  - Title: "Otimização"
  - Stat: "99.9% uptime"

Cada pilar:
- Background: rgba(255,255,255,0.06)
- Border: 1px rgba(255,255,255,0.12)
- Border-radius: 12px
- Padding: 24px
- Title: 0.95rem, 700 weight, -0.01em letter-spacing
- Stat: 1.75rem, 900 weight, -0.04em letter-spacing, opacity 0.95
- Gap: 8px (entre title e stat)

**Grid Layout**
- 3 colunas, gap: 32px (var(--s-5))
- Margin: 48px 0 (var(--s-6))

**Botão (abaixo dos pillars)**
- "Solicitar Proposta →"
- Background: var(--paper) (#F5F8FC)
- Text: #0A1F35
- Hover: background muda para var(--accent-mid) (#5B8B96), text fica ink

**Responsive Mobile**
- Pillars em 1 coluna
- Title/desc: center-aligned

---

## 7. Efeitos & Transições

### Padrão Hover Botão
- transform: translateY(-2px) — lift 2px
- background-color: 0.2s ease
- Smooth, não abrupto

### Efeitos Blob
- Blur: 60px (suave, difuso)
- Opacity: ajustada para cada cor base
- Não tem interatividade (pointer-events: none)

### Transições Gerais
- Color: 0.2s ease
- Background: 0.2s ease
- Transform: 0.2s ease

---

## 8. Inspiração & Referência

### Padrão Base: NewsletterCTA Original
- Elegant, fullwidth, generous padding
- Decorative blob no topo
- Eyebrow com traços
- Título grande + responsivo com clamp
- Descrição clear em rgba (transparência elegante)
- Botão prominent, bom contraste

### Refinamento Esperado
- **Não amador:** detalhes precisos, espaçamento cuidadoso, cores bem pensadas
- **Professional:** hierarchy clara, uso inteligente de transparência, cards bem definidas
- **Editorial:** tipografia forte, spacing generoso, elementos respirando

---

## 9. Entregáveis Esperados

1. **SuperDestaque Projeto** — Design em 2 colunas, elegante, mostrando stats
2. **SuperDestaque Serviços** — Design com 3 pilares + stats, professional
3. **Ambos** — Fully responsive (mobile, tablet, desktop)
4. **Componentes visuais:**
   - Blob decorativo preciso
   - Cards com borders/backgrounds corretos
   - Tipografia bem aplicada
   - Espaçamento consistente
   - Hover states definidos

---

## 10. Notas Importantes

- **Não usar:** Ícones grandes, muita cor, elementos desnecessários
- **Priorizar:** Elegância, legibilidade, clareza visual
- **Respiração:** Espaço em branco, padding generoso
- **Coerência:** Manter padrão do NewsletterCTA original
- **Foco:** Informação útil + visual atraente, não poluído

---

**Pronto para Claude Design criar protótipos de alta qualidade!**
