# Especificação: postagem-modernizada.html
> Referência elemento por elemento para implementação na post page.

---

## 1. Tokens de Design

```css
--accent:       #3B5F8A
--accent-hover: #2D4F76
--accent-deep:  #1E3A5F
--accent-mid:   #8AAEC8
--accent-soft:  #EBF1F8
--accent-tint:  #F4F8FC

--ink:          #111827   /* headings */
--navy:         #1A2535   /* texto forte */
--text:         #374151   /* corpo */
--muted:        #64748B
--muted-soft:   #94A3B8
--border:       #E2E8F0
--border-soft:  #EDF1F6

--bg:           #EEF2F8   /* página */
--bg-hero:      #E8EEF6   /* hero levemente mais escuro */
--surface:      #FFFFFF   /* cards e containers */

--moss:         #3F6B47   /* callout tip (verde) */

--container:    1200px
--reading:      760px

--shadow-sm:    0 2px 8px rgba(26,37,53,.05)
--shadow-md:    0 8px 28px rgba(26,37,53,.08)
--shadow-lg:    0 24px 60px rgba(26,37,53,.14)
```

---

## 2. Progress Bar

- `position: fixed; top: 0; left: 0; right: 0; height: 3px`
- Background track: `rgba(59,95,138,.12)`
- Fill: `linear-gradient(90deg, --accent, --accent-mid)`, `border-radius: 0 3px 3px 0`
- Largura animada via JS (`scrollTop / scrollHeight`)

---

## 3. Hero

**Container `.hero`:**
- `background: linear-gradient(180deg, --bg-hero 0%, --bg 100%)`
- `padding: 64px 32px 0` (sem padding-bottom — imagem sobrepõe)
- `text-align: center; position: relative; overflow: hidden`
- `::before`: blob radial `rgba(59,95,138,.10)`, `blur(40px)`, `width: min(900px,92vw)`, `height: 420px`, centrado, `top: -180px`

**`.hero-inner`:** `max-width: 880px; margin: 0 auto; z-index: 1`

**Breadcrumb:**
- `font-family: --font-mono; font-size: .6875rem; letter-spacing: .18em; text-transform: uppercase`
- Cor: `--muted`; `margin-bottom: 24px`
- Separadores: `<i class="fas fa-chevron-right">` com `opacity: .5`

**Category pill `.cat-pill`:**
- `background: --accent; color: #fff`
- `font-family: --font-mono; font-size: .6875rem; font-weight: 500; letter-spacing: .18em; text-transform: uppercase`
- `padding: 8px 16px; border-radius: 999px`
- `box-shadow: 0 6px 18px rgba(59,95,138,.28)`
- Ícone FA antes do texto

**Título `h1`:**
- `font-size: clamp(2.2rem, 5vw, 3.6rem); font-weight: 700; line-height: 1.08; letter-spacing: -.035em`
- `color: --ink; margin: 28px auto 0; max-width: 14ch; text-wrap: balance`

**Meta row `.hero-meta`:**
- `display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; margin-top: 28px`
- **`.who`**: avatar 40×40 (círculo com gradiente + iniciais) + nome (font-display 700) + cargo (font-size .78rem, --muted)
  - Avatar: `box-shadow: 0 0 0 3px #fff, 0 4px 12px rgba(59,95,138,.25)`
- **Separador `.dot`**: `width:4px; height:4px; border-radius:50%; background:--muted-soft; margin:0 18px`
- **`.mi`**: ícone FA accent + texto muted, `font-size:.9rem`

---

## 4. Imagem de Destaque

**`.featured`:**
- `max-width: 1040px; margin: 48px auto -120px; padding: 0 32px`
- `position: relative; z-index: 5`
- Entra **120px** para dentro do conteúdo (margin-bottom negativo)

**`.frame` (container da imagem):**
- `aspect-ratio: 16/8; border-radius: 20px; overflow: hidden`
- `box-shadow: --shadow-lg`
- `border: 1px solid rgba(255,255,255,.10)`
- Background de fallback: `linear-gradient(135deg, #2A3F5F, #1A2535, #0F1A2B)`
- `::after`: grid lines decorativas via mask radial

**Legenda `.cap`:** `margin-top: 16px; text-align: center; font-size: .8rem; color: --muted-soft; font-style: italic`

---

## 5. Layout do Corpo

**`.wrap`:** `max-width: --reading (760px); margin: 0 auto; padding: 160px 32px 96px`

> O padding-top de 160px compensa os -120px da imagem + ~40px de respiro acima do texto.

**`.article-inner`:** `max-width: --reading; margin: 0 auto`

---

## 6. Lead (Resumo/Introdução)

**`.lead`:**
- `font-size: 1.3rem; line-height: 1.6; color: --navy; font-weight: 400`
- `margin-bottom: 40px; padding-bottom: 36px`
- `border-bottom: 1px solid --border`
- `strong`: `font-weight: 600; color: --ink`
- **Sem card/box** — é texto solto com apenas separador inferior

---

## 7. Tipografia do Artigo (.prose)

- `font-size: 1.0625rem; line-height: 1.8; color: --text`
- `> p { margin-bottom: 1.7rem }`
- **Drop cap** no primeiro parágrafo: `::first-letter { float:left; font-family:--font-display; font-weight:700; font-size:3.6rem; line-height:.82; padding:6px 14px 0 0; color:--accent }`
- `strong`: `color: --ink; font-weight: 600`
- Links inline: `color: --accent; font-weight: 500; border-bottom: 1px solid rgba(59,95,138,.30)`
- `code` inline: `font-family:--font-mono; font-size:.85em; background:--accent-soft; color:--accent-deep; padding:2px 7px; border-radius:6px`

---

## 8. Seções (H2) com Índice

**`.sec`:**
- `display: flex; align-items: center; gap: 16px`
- `margin: 64px 0 24px; scroll-margin-top: 96px`

**Numerador `.idx`:**
- `40×40px; border-radius: 11px; background: --navy; color: #fff`
- `font-family: --font-mono; font-size: .75rem; font-weight: 500; letter-spacing: .04em`
- `box-shadow: --shadow-sm`

**`h2` ao lado do numerador:**
- `font-size: 1.85rem; font-weight: 700; line-height: 1.15`

---

## 9. Listas

**`.prose ul.bul`:** `list-style: none; padding: 0; margin: 0 0 1.7rem`

**`li`:** `padding-left: 30px; margin-bottom: 14px; line-height: 1.65`

**`li::before`:**
- `position: absolute; left: 4px; top: .62em`
- `width: 8px; height: 8px; border-radius: 50%`
- `background: --accent; box-shadow: 0 0 0 4px --accent-soft`
- Bullet circular com halo soft

---

## 10. Callout Boxes

**`.callout`:**
- `display: flex; gap: 18px; align-items: flex-start`
- `background: --surface; border: 1px solid --border; border-left: 4px solid --accent`
- `border-radius: 14px; padding: 24px 26px; margin: 36px 0`
- `box-shadow: --shadow-sm`

**Ícone `.ico`:** `40×40px; border-radius: 11px; background: --accent-soft; color: --accent`

**Label `.lbl`:** `font-family: --font-mono; font-size: .6875rem; letter-spacing: .18em; text-transform: uppercase; color: --accent; margin-bottom: 6px`

**Variante `.callout.tip`:** `border-left-color: --moss; .ico { background: rgba(63,107,71,.10); color: --moss }`

---

## 11. Bloco de Código

**`.code`:** `margin: 36px 0; border-radius: 14px; overflow: hidden; box-shadow: --shadow-md; border: 1px solid #0c1320`

**Barra `.bar`:**
- `background: #0c1320; padding: 12px 18px`
- Traffic lights: vermelho `#FF5F56`, amarelo `#FFBD2E`, verde `#27C93F` (11×11px, `border-radius: 50%`)
- Label da linguagem: `font-family: --font-mono; font-size: .7rem; letter-spacing: .12em; uppercase; color: #64748B`

**`pre`:** `background: #111827; color: #E2E8F0; padding: 22px; font-size: .82rem; line-height: 1.75`

**Syntax highlighting:** keyword `#818CF8`, function `#7DD3FC`, string `#86EFAC`, comment `#64748B italic`

---

## 12. Pull Quote

**`.pull`:**
- `margin: 48px 0; padding: 8px 0 8px 32px`
- `border-left: 4px solid --accent`
- `font-family: --font-display; font-weight: 500; font-style: italic`
- `font-size: 1.5rem; line-height: 1.4; color: --navy; letter-spacing: -.01em`

---

## 13. Key Takeaways

**`.takeaways`:**
- `background: linear-gradient(160deg, --navy 0%, #0F1A2B 100%)`
- `border-radius: 18px; padding: 36px 38px; margin: 48px 0; color: #fff`
- `::before`: grid lines via mask radial (decorativo)

**Label `.lbl`:** `font-family: --font-mono; font-size: .6875rem; letter-spacing: .2em; uppercase; color: --accent-mid; ::before { width:24px; height:1px; background:--accent-mid }`

**`li`:** `display: flex; gap: 14px; font-size: 1rem; line-height: 1.55; color: rgba(255,255,255,.86)` + ícone FA accent-mid

---

## 14. AdSense Placeholder

**`.ad`:**
- `border: 1px dashed #C3D0E0; border-radius: 12px; background: --accent-tint`
- `min-height: 96px; display: flex; align-items: center; justify-content: center`
- `color: --muted-soft; font-family: --font-mono; font-size: .68rem; letter-spacing: .16em; uppercase`
- `margin: 40px 0`

---

## 15. Post Footer (Share + Bio)

**`.post-footer`:**
- `background: --surface; border: 1px solid --border; border-radius: 16px; overflow: hidden`
- `margin-top: 56px; box-shadow: 0 1px 0 rgba(26,37,53,.02), --shadow-md`
- **Barra lateral:** `::before { position:absolute; left:0; top:0; bottom:0; width:4px; background:--accent }`

**Share strip `.share`:**
- `display: flex; align-items: center; gap: 18px; padding: 16px 24px 16px 28px`
- `border-bottom: 1px dashed --border; flex-wrap: wrap`
- Label: `font-family: --font-mono; font-size: .6875rem; letter-spacing: .22em; uppercase; color: --muted`
  - `::after { width:24px; height:1px; background:--border }` (traço após o texto)
- Botões `.sbtn`: `height: 34px; padding: 0 12px; border-radius: 8px; font-size: .8125rem; color: --muted`
  - Hover: `background: --accent-soft; color: --accent`
  - Botão "Copiar link": `border: 1px solid --border; margin-left: auto`

**Seção autor `.author`:**
- `display: grid; grid-template-columns: auto 1fr auto; gap: 28px; align-items: center`
- `padding: 28px 32px 28px 36px`
- `background: linear-gradient(180deg, rgba(59,95,138,.025) 0%, rgba(59,95,138,.05) 100%)`

**Avatar:** `76×76px; border-radius: 50%`; gradiente navy→accent→accent-mid; `box-shadow: 0 0 0 4px #fff, 0 0 0 5px rgba(59,95,138,.18), 0 10px 28px rgba(59,95,138,.22)`; badge verde `::after`

**Info `.info p`:** `font-size: .9375rem; line-height: 1.65; color: #4A5568; max-width: 520px`

**Ações `.actions`:**
- `display: flex; flex-direction: column; align-items: center; gap: 12px; padding-left: 28px`
- `border-left: 1px solid rgba(26,37,53,.08); align-self: stretch`
- Label redes: `font-family: --font-mono; font-size: .6875rem; letter-spacing: .22em; uppercase; color: --muted`
- Ícones sociais `.net`: `38×38px; border-radius: 50%; background: #fff; border: 1px solid --border; color: --accent`
  - Hover: `background: --accent; border-color: --accent; color: #fff; transform: translateY(-2px)`

---

## 16. Continue Explorando (Related Posts)

**`.related`:** `background: --surface; border-top: 1px solid --border-soft`
- **Fullwidth** — fora de qualquer container de leitura

**`.related-inner`:** `max-width: --container (1200px); margin: 0 auto; padding: 80px 32px`

**Header `.related-h`:**
- `display: flex; align-items: center; gap: 14px; margin-bottom: 36px`
- Barra: `width: 5px; height: 34px; border-radius: 3px; background: --accent`
- `h2`: `font-size: 1.9rem; font-weight: 700`

**Grid `.rgrid`:** `display: grid; grid-template-columns: repeat(3,1fr); gap: 28px`

**Card `.rcard`:**
- `background: --surface; border: 1px solid --border; border-radius: 16px; overflow: hidden`
- Hover: `transform: translateY(-6px); box-shadow: --shadow-md; border-color: --accent-mid`

**Thumb:** `aspect-ratio: 16/10; background: gradiente escuro` (sem imagem real, placeholder)

**Body:** `padding: 20px 22px 24px`
- Tag: `font-family: --font-mono; font-size: .62rem; letter-spacing: .16em; uppercase; color: --accent; background: --accent-soft; padding: 5px 10px; border-radius: 6px; margin-bottom: 12px`
- `h3`: `font-size: 1.08rem; font-weight: 600; line-height: 1.35; color: --ink; margin-bottom: 10px`
- Meta: `font-size: .78rem; color: --muted-soft` (ícone clock + calendar)
- **Sem "Ler artigo →"** — o card inteiro é clicável

---

## 17. Responsividade

| Breakpoint | Mudanças |
|---|---|
| `max-width: 1040px` | `.wrap padding-top: 150px`; `.rgrid: 1fr 1fr` |
| `max-width: 760px` | Nav links ocultos; hero padding menor; `.featured margin: 36px auto -90px`; `.wrap padding: 120px 20px`; `.author grid: 1 coluna`; `.rgrid: 1fr`; `.related-inner padding: 56px 20px` |

---

## 18. Diferenças vs. Implementação Atual

| Elemento | Protótipo | Atual |
|---|---|---|
| Lead/resumo | Texto solto com `border-bottom` | Card com `background + box-shadow` |
| Numerador H2 | `.idx` navy 40×40 border-radius 11px | `::before` counter, accent bg, 48×48 |
| Callout | `border-left: 4px + icon + label mono` | Implementado (similar) |
| Imagem destaque | `max-width: 1040px; margin-bottom: -120px` | `max-width: 960px; margin-top: -48px` |
| Imagem aspect-ratio | `16/8` | `16/9` |
| `.wrap` padding-top | `160px` (compensa -120px) | Não existe (container separado) |
| Related — background | `--surface (#fff)` fullwidth | `--surface-card` container 1200px |
| Related — cards | Sem "Ler artigo →", com meta (clock/calendar) | Com "Ler artigo →", sem meta |
| Related — thumb aspect | `16/10` | `16/9` (height 224px) |
| Post footer margin-top | `56px` | `var(--space-4)` 32px |
| Share label | `::after` (traço após texto) | Eyebrow `::before` (traço antes) |
| Author background | `linear-gradient` accent-soft sutil | Transparente |
