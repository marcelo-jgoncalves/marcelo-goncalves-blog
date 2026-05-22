# Análise Minuciosa: PostFooter (Share + AuthorBox + Social)

**Data:** 2026-05-22  
**Protótipo:** `post-page-prototype.html`  
**Status:** Decomposição exaustiva para implementação pixel-perfect

---

## 1. VISÃO GERAL DA ARQUITETURA

O PostFooter é um componente composto por 3 seções visualmente ligadas:

```
┌─────────────────────────────────────────┐
│  [4px ACCENT bar ::before]              │
├─────────────────────────────────────────┤
│  SHARE SECTION                          │  ← Flex row, padding 16px 24px 16px 28px
│  Compartilhar [─] [Btn] [Btn] [Copy←]   │
├─────────────────────────────────────────┤
│  AUTHOR SECTION                         │  ← Grid 3 col, padding 28px 32px 28px 36px
│  [Avatar] [Bio + Name] [Social Nets]    │
└─────────────────────────────────────────┘
```

---

## 2. ELEMENTO 1: Container `.post-footer` (Wrapper externo)

### 2.1 Layout & Box Model
```css
.post-footer {
  background: #fff;
  border: 1px solid var(--rule);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(10, 14, 26, .02), 0 10px 32px rgba(15, 76, 92, .06);
  position: relative;
  margin-top: var(--space-epic);  /* 112px */
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Unidade | Notas |
|---|---|---|---|
| **background** | `#fff` | — | Branco puro, sem transparência |
| **border** | `1px solid var(--rule)` | px | `--rule = rgba(10, 14, 26, .10)` — hairline cinza petróleo |
| **border-radius** | `16px` | px | Canto arredondado suave |
| **overflow** | `hidden` | — | Garante que ::before não escapa dos cantos |
| **box-shadow** | `0 1px 0 rgba(10, 14, 26, .02),`<br/>`0 10px 32px rgba(15, 76, 92, .06)` | px, rgba | 2 camadas: hairline (1px @ 2%) + elevação (10px blur @ 6%) |
| **position** | `relative` | — | Necessário para ::before absoluto |
| **margin-top** | `var(--space-epic)` | px | `112px` — espaço épico antes (define distância do autor) |

**Paleta de cores:**
- **Border:** `rgba(10, 14, 26, 0.10)` (--rule)
- **Shadow 1:** `rgba(10, 14, 26, 0.02)` (hairline, quase invisível)
- **Shadow 2:** `rgba(15, 76, 92, 0.06)` (petróleo soft)

### 2.2 Elemento ::before (Left accent bar)
```css
.post-footer::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--accent);  /* #0F4C5C */
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Unidade | Notas |
|---|---|---|---|
| **content** | `""` | — | Pseudo-elemento vazio (não tem texto) |
| **position** | `absolute` | — | Posicionamento absoluto dentro do .post-footer relativo |
| **left** | `0` | px | Encostado à esquerda |
| **top** | `0` | px | Começa no topo |
| **bottom** | `0` | px | Vai até o final (stretch vertical) |
| **width** | `4px` | px | Fina barra vertical |
| **background** | `var(--accent)` | — | `#0F4C5C` — petróleo deep |

**Padrão visual:** Uma fina barra petróleo na esquerda que corre ao longo de toda a altura do card, criando um "accent bar" visual.

---

## 3. ELEMENTO 2: Share Strip (`.post-footer .share`)

### 3.1 Container de Share
```css
.post-footer .share {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 24px 16px 28px;
  border-bottom: 1px dashed var(--rule);
  flex-wrap: wrap;
  margin: 0;
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Notas |
|---|---|---|
| **display** | `flex` | Flexbox row por padrão |
| **align-items** | `center` | Alinha verticalmente no meio |
| **gap** | `18px` | Espaço entre label, linhas e botões |
| **padding** | `16px 24px 16px 28px` | `top 16px` \| `right 24px` \| `bottom 16px` \| `left 28px` (recua para a barra accent) |
| **border-bottom** | `1px dashed var(--rule)` | Separador tracejado cinza (--rule = rgba(10, 14, 26, .10)) |
| **flex-wrap** | `wrap` | Permite quebra em mobile |
| **margin** | `0` | Reseta margens |

**Layout visual:**
- Altura mínima: ~48px (16 + icon 14 + 16 + border)
- Espaçamento horizontal: 28px (left) + conteúdo + 24px (right)

### 3.2 Label (`.post-footer .share .label`)
```css
.post-footer .share .label {
  font-family: var(--mono);
  font-size: .6875rem;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--t-muted);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  line-height: 1;
}

.post-footer .share .label::after {
  content: "";
  width: 24px;
  height: 1px;
  background: var(--rule);
  display: inline-block;
}
```

**Propriedades do label:**

| Propriedade | Valor | Notas |
|---|---|---|
| **font-family** | `var(--mono)` | `'JetBrains Mono'` — monospace |
| **font-size** | `0.6875rem` | 11px (text-xs do sistema) |
| **letter-spacing** | `0.22em` | Tracking largo: 22% da font-size |
| **text-transform** | `uppercase` | Tudo em maiúsculas |
| **color** | `var(--t-muted)` | `#6F6760` — tom cinza quente |
| **display** | `inline-flex` | Flexbox inline (respeita flow) |
| **align-items** | `center` | Alinha ícone/texto no meio |
| **gap** | `10px` | Espaço entre "Compartilhar" e linha |
| **line-height** | `1` | Tight (sem espaço extra) |

**Propriedades do ::after (linha traço):**

| Propriedade | Valor | Notas |
|---|---|---|
| **content** | `""` | Vazio (só desenho) |
| **width** | `24px` | Comprimento da linha |
| **height** | `1px` | Hairline fina |
| **background** | `var(--rule)` | `rgba(10, 14, 26, .10)` — cinza hairline |

**Padrão:** "COMPARTILHAR" (mono, small) — [linha 24px] — aparece como separador visual.

### 3.3 Botões de Share (`.post-footer .share .btns`)
```css
.post-footer .share .btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Notas |
|---|---|---|
| **display** | `flex` | Flexbox row |
| **justify-content** | `space-between` | Distribui botões ao longo da largura |
| **align-items** | `center` | Alinha no meio verticalmente |
| **flex** | `1` | Cresce para preencher espaço disponível |

**Layout:** Container que distribui botões + copy button ao longo da linha.

### 3.4 Botão Individual (`.post-footer .sbtn`)
```css
.post-footer .sbtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-family: var(--sans);
  font-size: .8125rem;
  font-weight: 500;
  color: rgba(10, 14, 26, .70);
  text-decoration: none;
  transition: background-color .15s ease, color .15s ease;
}

.post-footer .sbtn:hover {
  background: var(--accent-soft);
  color: var(--accent);
}
```

**Propriedades base:**

| Propriedade | Valor | Notas |
|---|---|---|
| **display** | `inline-flex` | Flex inline para múltiplos botões |
| **align-items** | `center` | Alinha ícone + texto no meio |
| **gap** | `8px` | Espaço entre ícone e texto |
| **height** | `34px` | Altura fixa (com padding vertical ~0) |
| **padding** | `0 12px` | Lateral apenas (texto/ícone centralizado verticalmente) |
| **border** | `none` | Sem borda |
| **background** | `transparent` | Fundo vazio até hover |
| **cursor** | `pointer` | Mão ao passar |
| **border-radius** | `8px` | Canto suave |
| **font-family** | `var(--sans)` | `'Inter'` |
| **font-size** | `0.8125rem` | 13px |
| **font-weight** | `500` | Medium (não bold) |
| **color** | `rgba(10, 14, 26, .70)` | Cinza-escuro suave (--t-muted opaco) |
| **text-decoration** | `none` | Sem underline |
| **transition** | `background-color .15s ease, color .15s ease` | Suave ao hover (150ms) |

**Estado :hover:**

| Propriedade | Valor | Notas |
|---|---|---|
| **background** | `var(--accent-soft)` | `#E6EEF0` — azul muito claro |
| **color** | `var(--accent)` | `#0F4C5C` — petróleo (contraste) |

**Ícone dentro (`.post-footer .sbtn i`):**

| Propriedade | Valor | Notas |
|---|---|---|
| **font-size** | `0.875rem` | 14px (ligeiramente maior que o texto) |

### 3.5 Botão Copy (`.post-footer .sbtn--copy`)
```css
.post-footer .sbtn--copy {
  border: 1px solid var(--rule);
}

.post-footer .sbtn--copy:hover {
  border-color: var(--accent);
}
```

**Propriedades especiais:**

| Propriedade | Valor | Notas |
|---|---|---|
| **border** | `1px solid var(--rule)` | Contorno cinza hairline |
| **:hover border-color** | `var(--accent)` | Contorno muda para petróleo |

**Comportamento:** Botão com outline (não filled), apenas borda visível.

---

## 4. ELEMENTO 3: Author Section (`.post-footer .author`)

### 4.1 Container Grid
```css
.post-footer .author {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: center;
  padding: 28px 32px 28px 36px;
  margin: 0;
  background: linear-gradient(180deg, rgba(15, 76, 92, .025) 0%, rgba(15, 76, 92, .05) 100%);
  border-left: 4px solid var(--accent);
  box-shadow: 0 2px 16px rgba(15,76,92,0.07), 0 1px 4px rgba(15,76,92,0.04);
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Notas |
|---|---|---|
| **display** | `grid` | CSS Grid (3 colunas) |
| **grid-template-columns** | `auto 1fr auto` | Avatar (shrink) \| Bio (grow) \| Social (shrink) |
| **gap** | `28px` | Espaço entre colunas |
| **align-items** | `center` | Alinha verticalmente no meio |
| **padding** | `28px 32px 28px 36px` | `top 28px` \| `right 32px` \| `bottom 28px` \| `left 36px` |
| **margin** | `0` | Reseta margens |
| **background** | `linear-gradient(180deg, rgba(15, 76, 92, .025) 0%, rgba(15, 76, 92, .05) 100%)` | Degradado sutil petróleo (2.5% → 5%) |
| **border-left** | `4px solid var(--accent)` | Barra espessa petróleo na esquerda |
| **box-shadow** | `0 2px 16px rgba(15,76,92,0.07), 0 1px 4px rgba(15,76,92,0.04)` | 2 camadas: profundidade (2px) + detalhe (1px) |

**Paleta de cores:**
- **Gradient start:** `rgba(15, 76, 92, 0.025)` (2.5% petróleo)
- **Gradient end:** `rgba(15, 76, 92, 0.05)` (5% petróleo)
- **Border:** `var(--accent)` (#0F4C5C)
- **Shadow 1:** `rgba(15, 76, 92, 0.07)` (7% petróleo)
- **Shadow 2:** `rgba(15, 76, 92, 0.04)` (4% petróleo)

**Layout visual:**
- Altura mínima: ~76px (avatar) + 28 + 28 padding = ~132px
- Largura: 100% (grid fill)

---

## 5. SUB-ELEMENTO: Avatar (`.post-footer .avatar`)

### 5.1 Box & Border
```css
.post-footer .avatar {
  width: 76px;
  height: 76px;
  flex: none;
  background: radial-gradient(circle at 30% 25%, rgba(255, 255, 255, .18) 0%, transparent 55%), 
              linear-gradient(140deg, var(--accent-deep) 0%, var(--accent) 55%, var(--accent-mid) 100%);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FAF8F3;
  font-family: var(--sans);
  font-weight: 800;
  font-size: 1.375rem;
  letter-spacing: .01em;
  box-shadow: 0 0 0 4px #fff, 0 0 0 5px rgba(15, 76, 92, .18), 0 10px 28px rgba(15, 76, 92, .22);
  position: relative;
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Notas |
|---|---|---|
| **width** | `76px` | Quadrado |
| **height** | `76px` | Quadrado |
| **flex** | `none` | Não shrink/grow |
| **border-radius** | `50%` | Perfeitamente circular |
| **display** | `grid` | Grid para centralizar |
| **place-items** | `center` | Centraliza conteúdo (grid) |
| **color** | `#FAF8F3` | `--t-invert` — creme/ivory |
| **font-family** | `var(--sans)` | Inter |
| **font-weight** | `800` | Extra bold |
| **font-size** | `1.375rem` | 22px |
| **letter-spacing** | `0.01em` | Tiny tracking |
| **position** | `relative` | Para ::after absoluto |

**Background (2 gradientes compostos):**

1. **Radial (shine):**
   - `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, .18) 0%, transparent 55%)`
   - Centro em 30% left, 25% top
   - Começa com 18% branco, desvanece em 55%
   - Efeito de "brilho" de luz 3D

2. **Linear (gradação de cor):**
   - `linear-gradient(140deg, var(--accent-deep) 0%, var(--accent) 55%, var(--accent-mid) 100%)`
   - Ângulo: 140° (diagonal)
   - Cores: `#073642` (petróleo deep) → `#0F4C5C` (petróleo) → `#5B8B96` (petróleo mid)

**Box-shadow (3 camadas):**

| Layer | Shadow | Propósito |
|---|---|---|
| 1 | `0 0 0 4px #fff` | Anel branco sólido (separação visual) |
| 2 | `0 0 0 5px rgba(15, 76, 92, .18)` | Anel petróleo suave (transição) |
| 3 | `0 10px 28px rgba(15, 76, 92, .22)` | Drop shadow macio (elevação) |

### 5.2 Active Dot (`.post-footer .avatar::after`)
```css
.post-footer .avatar::after {
  content: "";
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--moss);
  border: 3px solid #fff;
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Notas |
|---|---|---|
| **content** | `""` | Vazio (só desenho) |
| **position** | `absolute` | Relativo ao avatar |
| **right** | `-2px` | Sai da borda (overlap) |
| **bottom** | `-2px` | Sai da borda (overlap) |
| **width** | `16px` | Círculo pequeno |
| **height** | `16px` | Círculo pequeno |
| **border-radius** | `50%` | Perfeitamente circular |
| **background** | `var(--moss)` | `#3F6B47` — verde (status online) |
| **border** | `3px solid #fff` | Anel branco separador |

**Padrão:** Pequeno ponto verde no canto inferior direito (padrão "online" em redes sociais).

---

## 6. SUB-ELEMENTO: Info (Bio) (`.post-footer .info`)

### 6.1 Container & Texto
```css
.post-footer .info p {
  font-size: .9375rem;
  line-height: 1.65;
  color: rgba(10, 14, 26, .70);
  max-width: 520px;
  margin: 0;
}

.post-footer .info .author-name {
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -.005em;
}
```

**Propriedades do parágrafo:**

| Propriedade | Valor | Notas |
|---|---|---|
| **font-size** | `0.9375rem` | 15px (body small) |
| **line-height** | `1.65` | Espaçamento generoso entre linhas |
| **color** | `rgba(10, 14, 26, .70)` | Cinza escuro semi-opaco |
| **max-width** | `520px` | Limite de comprimento (UX leitura) |
| **margin** | `0` | Reseta margens |

**Propriedades do author-name (dentro do `<p>`):**

| Propriedade | Valor | Notas |
|---|---|---|
| **font-weight** | `700` | Bold |
| **color** | `var(--ink)` | `#0A0E1A` — preto profundo |
| **letter-spacing** | `-0.005em` | Micro tracking negativo (apertado) |

### 6.2 Profile Link
```css
.post-footer .info .profile-link {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid rgba(15, 76, 92, .30);
  white-space: nowrap;
  transition: border-color .2s ease, color .2s ease;
}

.post-footer .info .profile-link:hover {
  color: var(--accent-deep);
  border-bottom-color: var(--accent-deep);
}
```

**Propriedades base:**

| Propriedade | Valor | Notas |
|---|---|---|
| **color** | `var(--accent)` | `#0F4C5C` — petróleo |
| **font-weight** | `600` | Semibold |
| **text-decoration** | `none` | Sem underline padrão |
| **border-bottom** | `1px solid rgba(15, 76, 92, .30)` | Underline customizado (30% petróleo) |
| **white-space** | `nowrap` | Não quebra a linha |
| **transition** | `border-color .2s ease, color .2s ease` | Suave hover (200ms) |

**Estado :hover:**

| Propriedade | Valor | Notas |
|---|---|---|
| **color** | `var(--accent-deep)` | `#073642` — petróleo mais escuro |
| **border-bottom-color** | `var(--accent-deep)` | Underline mais escuro |

---

## 7. SUB-ELEMENTO: Actions/Social (`.post-footer .actions`)

### 7.1 Container de Redes
```css
.post-footer .actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-left: 28px;
  align-self: stretch;
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Notas |
|---|---|---|
| **display** | `flex` | Flexbox coluna |
| **flex-direction** | `column` | Vertical |
| **align-items** | `center` | Centraliza redes horizontalmente |
| **justify-content** | `center` | Centraliza no meio verticalmente |
| **gap** | `12px` | Espaço entre label e redes |
| **padding-left** | `28px` | Margem esquerda (separação) |
| **align-self** | `stretch` | Stretch vertical (altura do grid) |

**Layout visual:** Coluna vertical com label no topo, redes abaixo.

### 7.2 Net Label (`.post-footer .actions .net-label`)
```css
.post-footer .actions .net-label {
  font-family: var(--mono);
  font-size: .6875rem;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(10, 14, 26, .70);
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Notas |
|---|---|---|
| **font-family** | `var(--mono)` | JetBrains Mono |
| **font-size** | `0.6875rem` | 11px (text-xs) |
| **font-weight** | `500` | Medium |
| **letter-spacing** | `0.22em` | Tracking largo (22%) |
| **text-transform** | `uppercase` | ACOMPANHE NAS REDES |
| **color** | `rgba(10, 14, 26, .70)` | Cinza escuro semi-opaco |

**Padrão:** Pequeno label em maiúsculas com tracking largo.

### 7.3 Container de Redes (`.post-footer .actions .nets`)
```css
.post-footer .actions .nets {
  display: flex;
  gap: 6px;
}
```

**Propriedades detalhadas:**

| Propriedade | Valor | Notas |
|---|---|---|
| **display** | `flex` | Flexbox row |
| **gap** | `6px` | Espaço pequeno entre círculos |

### 7.4 Ícone Individual (`.post-footer .actions .net`)
```css
.post-footer .actions .net {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  border: 1px solid rgba(10, 14, 26, .10);
  color: var(--accent);
  font-size: .9375rem;
  text-decoration: none;
  transition: border-color .2s ease, color .2s ease, background-color .2s ease, transform .2s ease, box-shadow .2s ease;
}

.post-footer .actions .net:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #FAF8F3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15, 76, 92, .22);
}
```

**Propriedades base:**

| Propriedade | Valor | Notas |
|---|---|---|
| **width** | `38px` | Quadrado |
| **height** | `38px` | Quadrado |
| **border-radius** | `50%` | Perfeitamente circular |
| **display** | `grid` | Grid para centralizar |
| **place-items** | `center` | Centraliza ícone |
| **background** | `#fff` | Branco puro |
| **border** | `1px solid rgba(10, 14, 26, .10)` | Hairline cinza |
| **color** | `var(--accent)` | Ícone petróleo |
| **font-size** | `0.9375rem` | 15px |
| **text-decoration** | `none` | Sem underline |
| **transition** | `border-color .2s ease, color .2s ease, background-color .2s ease, transform .2s ease, box-shadow .2s ease` | Múltiplas propriedades (200ms) |

**Estado :hover:**

| Propriedade | Valor | Notas |
|---|---|---|
| **background** | `var(--accent)` | `#0F4C5C` — petróleo (fill) |
| **border-color** | `var(--accent)` | Muda para petróleo |
| **color** | `#FAF8F3` | Creme (inverso para contraste) |
| **transform** | `translateY(-2px)` | Sobe levemente (elevação) |
| **box-shadow** | `0 6px 16px rgba(15, 76, 92, .22)` | Sombra elevada ao hover |

**Padrão:** Círculo branco com ícone petróleo. Ao hover: fill com petróleo, sobe e sombra.

---

## 8. CORES: PALETA COMPLETA

### 8.1 Tokens de cor usados
```css
--accent:        #0F4C5C  /* Petróleo principal */
--accent-deep:   #073642  /* Petróleo escuro */
--accent-mid:    #5B8B96  /* Petróleo médio */
--accent-soft:   #E6EEF0  /* Petróleo muito claro */
--moss:          #3F6B47  /* Verde (online dot) */
--t-muted:       #6F6760  /* Texto cinza quente */
--t-meta:        #4D453E  /* Texto cinza mais escuro */
--ink:           #0A0E1A  /* Preto profundo */
--rule:          rgba(10, 14, 26, .10)  /* Hairline cinza (10%) */
```

### 8.2 Cores customizadas (hardcoded)
```css
#fff             /* Branco puro */
#FAF8F3          /* Creme/ivory (--t-invert) */
rgba(255,255,255,.18)   /* Brilho radial no avatar */
rgba(10, 14, 26, .70)   /* Cinza semi-opaco (70%) */
rgba(15, 76, 92, .025)  /* Gradiente sutil (2.5%) */
rgba(15, 76, 92, .05)   /* Gradiente sutil (5%) */
rgba(15, 76, 92, .06)   /* Shadow suave (6%) */
rgba(15, 76, 92, .22)   /* Shadow mais forte (22%) */
```

---

## 9. TIPOGRAFIA

### 9.1 Famílias de fonte
```css
--sans:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif
--mono:  'JetBrains Mono', 'Fira Code', monospace
```

### 9.2 Tamanhos e pesos usados
| Elemento | Font-size | Line-height | Font-weight | Font-family | Uso |
|---|---|---|---|---|---|
| Label ("COMPARTILHAR") | 0.6875rem (11px) | 1 | 500 | Mono | Eyebrow |
| Botões share | 0.8125rem (13px) | — | 500 | Sans | CTA |
| Bio text | 0.9375rem (15px) | 1.65 | 400 | Sans | Corpo |
| Author name | 0.9375rem (15px) | 1.65 | 700 | Sans | Destaque |
| Net label | 0.6875rem (11px) | — | 500 | Mono | Eyebrow |
| Net icons | 0.9375rem (15px) | — | — | — | Ícones |

### 9.3 Letter-spacing
| Elemento | Letter-spacing | Notas |
|---|---|---|
| Label/eyebrows | 0.22em | Tracking largo (22% da font-size) |
| Author name | -0.005em | Apertado (negativo) |
| Avatar initials | 0.01em | Ligeiramente aberto |

---

## 10. ESPAÇAMENTO

### 10.1 Padding
| Elemento | Padding | Breakup |
|---|---|---|
| `.post-footer .share` | `16px 24px 16px 28px` | T 16 \| R 24 \| B 16 \| L 28 |
| `.post-footer .author` | `28px 32px 28px 36px` | T 28 \| R 32 \| B 28 \| L 36 |

### 10.2 Gaps & Gaps
| Elemento | Gap | Notas |
|---|---|---|
| Share strip | `18px` | Entre label, linha e botões |
| Author grid | `28px` | Entre avatar, bio e social |
| Social nets | `6px` | Entre ícones de rede |
| Actions column | `12px` | Entre label e redes |
| Button icon+text | `8px` | Entre ícone e texto do botão |

### 10.3 Margens
| Elemento | Margin-top | Notas |
|---|---|---|
| `.post-footer` | `var(--space-epic)` = 112px | Espaço épico antes da seção |

---

## 11. SOMBRAS

### 11.1 Container `.post-footer`
```css
box-shadow: 0 1px 0 rgba(10, 14, 26, .02), 
            0 10px 32px rgba(15, 76, 92, .06);
```

| Layer | Offset Y | Blur | Color | Efeito |
|---|---|---|---|---|
| 1 | 1px | 0 | rgba(10,14,26,0.02) | Hairline leve |
| 2 | 10px | 32px | rgba(15,76,92,0.06) | Drop shadow macio |

### 11.2 Avatar `.post-footer .avatar`
```css
box-shadow: 0 0 0 4px #fff, 
            0 0 0 5px rgba(15, 76, 92, .18), 
            0 10px 28px rgba(15, 76, 92, .22);
```

| Layer | Type | Value | Efeito |
|---|---|---|---|
| 1 | Anel | 4px #fff | Separação branca |
| 2 | Anel | 5px rgba(15,76,92,.18) | Transição petróleo |
| 3 | Drop | 10px blur rgba(15,76,92,.22) | Elevação |

### 11.3 Social link hover
```css
box-shadow: 0 6px 16px rgba(15, 76, 92, .22);
```

---

## 12. ESTADOS RESPONSIVOS

### 12.1 Comportamento em mobile
**Nota:** Protótipo atual não inclui media query mobile. Implementar:

```css
@media (max-width: 720px) {
  .post-footer .author {
    grid-template-columns: 1fr;  /* Stack vertical */
    gap: 20px;
    padding: 20px 24px;
  }
  
  .post-footer .actions {
    padding-left: 0;
    padding-top: 20px;
    border-top: 1px solid rgba(10, 14, 26, .08);
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
}
```

---

## 13. CHECKLIST DE IMPLEMENTAÇÃO

- [ ] **Container `.post-footer`**
  - [ ] Background `#fff`
  - [ ] Border `1px solid rgba(10,14,26,0.10)`
  - [ ] Border-radius `16px`
  - [ ] Overflow `hidden`
  - [ ] Box-shadow (2 camadas)
  - [ ] Margin-top `112px`
  - [ ] ::before (4px accent bar)

- [ ] **Share strip**
  - [ ] Display flex, gap 18px
  - [ ] Padding `16px 24px 16px 28px`
  - [ ] Border-bottom dashed
  - [ ] Label (mono, 11px, uppercase, tracking .22em)
  - [ ] Label ::after (24px linha)
  - [ ] Container .btns (flex, space-between, flex: 1)
  - [ ] Botões (34px height, transparent bg, hover soft accent)
  - [ ] Copy button (border 1px, border-color muda ao hover)

- [ ] **Author section**
  - [ ] Display grid, 3 colunas (`auto 1fr auto`)
  - [ ] Gap `28px`
  - [ ] Padding `28px 32px 28px 36px`
  - [ ] Background gradient (2.5% → 5%)
  - [ ] Border-left `4px solid accent`
  - [ ] Box-shadow (2 camadas)

- [ ] **Avatar**
  - [ ] 76x76px, circular
  - [ ] Background radial + linear gradient
  - [ ] Color creme (#FAF8F3)
  - [ ] Font size 1.375rem, weight 800
  - [ ] Box-shadow (3 camadas)
  - [ ] ::after (16px green dot, border white)

- [ ] **Bio section**
  - [ ] Font size 0.9375rem, line-height 1.65
  - [ ] Max-width 520px
  - [ ] Author name (weight 700, color ink)
  - [ ] Profile link (color accent, border-bottom 30% petróleo)
  - [ ] Hover (color accent-deep, border darker)

- [ ] **Social actions**
  - [ ] Flex column, gap 12px
  - [ ] Padding-left 28px
  - [ ] Net label (mono, 11px, uppercase, tracking .22em)
  - [ ] Nets container (flex, gap 6px)
  - [ ] Ícones (38x38px circular, branco bg)
  - [ ] Hover (bg accent, color creme, translateY -2px, shadow)

---

## 14. NOTAS IMPLEMENTAÇÃO NEXTJS/REACT

### 14.1 Componentes esperados
```jsx
<div className="post-footer">
  {/* Share section */}
  <div className="share">
    <span className="label">Compartilhar</span>
    <div className="btns">
      <a href={linkedinUrl} className="sbtn">
        <i className="fab fa-linkedin-in"></i>LinkedIn
      </a>
      <a href={twitterUrl} className="sbtn">
        <i className="fab fa-x-twitter"></i>Twitter
      </a>
      <a href={whatsappUrl} className="sbtn">
        <i className="fab fa-whatsapp"></i>WhatsApp
      </a>
      <button className="sbtn sbtn--copy" onClick={copyLink}>
        <i className="fas fa-link"></i>Copiar link
      </button>
    </div>
  </div>
  
  {/* Author section */}
  <section className="author">
    <div className="avatar" aria-hidden="true">MG</div>
    <div className="info">
      <p>
        <strong className="author-name">Marcelo Gonçalves</strong>
        é Engenheiro Cloud especialista em AWS e DevOps. 
        <a href="/sobre" className="profile-link">Veja o perfil</a>.
      </p>
    </div>
    <div className="actions">
      <span className="net-label">Acompanhe nas redes</span>
      <div className="nets">
        <a href={linkedinUrl} className="net" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href={instagramUrl} className="net" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href={twitterUrl} className="net" aria-label="X (Twitter)">
          <i className="fab fa-x-twitter"></i>
        </a>
      </div>
    </div>
  </section>
</div>
```

### 14.2 CSS a ser criado/atualizado
- **Arquivo:** `frontend/components/post/PostFooter.module.css` ou `PostFooter.css`
- **Imports:** Font Awesome 6.5.2+ (já no projeto)
- **Tokens:** Usar variáveis CSS do `:root` existentes
- **Reutilização:** Se houver **PostFooter.tsx** existente, manter a estrutura JSX intacta, alterar apenas CSS

---

## 15. DIMENSÕES FINAIS

| Aspecto | Valor |
|---|---|
| Altura mínima container | ~48px (share) + ~132px (author) = ~180px |
| Largura mínima | 100% (grid) |
| Avatar | 76×76px (circular) |
| Social icons | 38×38px (circular) |
| Share button height | 34px |
| Container margin-top | 112px |

---

## REFERÊNCIA VISUAL COMPACTA

```
┌──────────────────────────────────────────────────────────┐
│                     POST FOOTER CARD                      │
│  [4px ACCENT]                                            │
├──────────────────────────────────────────────────────────┤
│  COMPARTILHAR ─ [LinkedIn] [Twitter] [WhatsApp] [Copy→]  │  48px
├──────────────────────────────────────────────────────────┤
│                     (gradient bg)                         │
│  [Avatar]  Name • bio with link  [NET] [NET] [NET]       │  132px
│  76×76px   Max-width 520px      (column)                 │
│            Line-height 1.65      12px gap                │
└──────────────────────────────────────────────────────────┘
```

---

**Documento preparado para implementação pixel-perfect no projeto.**
