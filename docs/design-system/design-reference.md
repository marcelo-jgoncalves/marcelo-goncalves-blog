# Design Reference — IA Decifrada / Marcelo Gonçalves
> Fonte de verdade do design system. Extraído dos arquivos em `examples/`.  
> Usar este arquivo como referência ao implementar ou revisar qualquer componente visual.

---

## 1. Identidade Visual

### Logo
| Variante | Arquivo | Uso |
|----------|---------|-----|
| Logotipo completo | `assets/logo-mark.svg` | Header, rodapé, OG image |
| Ícone | `assets/logo-icon.svg` | Favicon, avatar, contextos compactos (44px / 32px / 24px) |
| Versão clara (sobre escuro) | logo-mark.svg com `filter: brightness(0) invert(1) saturate(0); opacity: 0.95` | Seções dark, footer |

### Wordmark no CSS
```css
/* Padrão visual do nome no header */
"Marcelo"    → color: #111827 (Dark)
"Gonçalves"  → color: #3B5F8A (Accent)
font-family: 'DM Sans', sans-serif;
font-weight: 700;
letter-spacing: -0.03em;
```

---

## 2. Cores

### Brand Accent — Classic Blue (cor principal)
| Token | Hex | Uso |
|-------|-----|-----|
| `accent-muted` | `#EBF1F8` | Fundo de badges, ícones de categoria, hover de ghost button |
| `accent-soft` | `#D0E4F2` | Bordas suaves, separadores |
| `accent-light` | `#8AAEC8` | Ícones secundários, gradientes de placeholder |
| **`accent` ★** | **`#3B5F8A`** | **CTAs primários, links, tags, foco, bordas ativas** |
| `accent-hover` | `#2D4F76` | Estado hover do botão primário |
| `accent-press` | `#1E3A57` | Estado pressed / ativo |

### Brand Dark — Near-Black
| Token | Hex | Uso |
|-------|-----|-----|
| `dark-surface-2` | `#374151` | Hover em superfícies escuras |
| `dark-surface` | `#1F2937` | Superfícies de seções escuras, footer |
| **`dark` ★** | **`#111827`** | **Fundo de seções dark, code blocks, texto primário** |

### Neutros (Slate Scale)
| Token | Hex | Uso típico |
|-------|-----|-----------|
| `neutral-50` | `#F8FAFC` | Background de páginas, fundo de labels |
| `neutral-100` | `#F1F5F9` | Background de inputs, inline code |
| `neutral-200` | `#E2E8F0` | Bordas de inputs, divisores |
| `neutral-300` | `#CBD5E1` | Bordas secundárias |
| `neutral-400` | `#94A3B8` | Placeholders, labels de seção (uppercase) |
| `neutral-500` | `#6B7280` | Texto muted (metadata, captions) |
| `neutral-600` | `#475569` | Texto secondary, bio do autor |
| `neutral-700` | `#374151` | Texto de corpo, UI |
| `neutral-800` | `#1F2937` | Superfície dark |
| `neutral-900` | `#111827` | Texto primário, headings |

### Semânticas
| Papel | Cor | Uso |
|-------|-----|-----|
| Text Primary | `#111827` | Headings, logo |
| Text Body | `#374151` | Prosa, UI labels |
| Text Muted | `#6B7280` | Metadata, captions, timestamps |
| Text Accent / Link | `#3B5F8A` | CTAs, links, categoria |
| Text Invert | `#FFFFFF` | Sobre fundo escuro |
| Info (bg/border/text) | `#EEF4FB` / `#9DBFE0` / `#1E3A5F` | Callouts informativos |
| Warning | `#FFFBEB` / `#FDE68A` / `#78350F` | Alertas de aviso |
| Danger | `#FEF2F2` / `#FECACA` / `#7F1D1D` | Erros, estados destrutivos |
| Success | `#DCFCE7` / — / `#166534` | Badges "Novo", estados de sucesso |
| Error input | `#EF4444` | Borda de input com erro |

---

## 3. Tipografia

### Famílias
| Família | Fonte | Uso |
|---------|-------|-----|
| Display / Headings / UI | **DM Sans** (Google Fonts) | Títulos, botões, nav, labels de card |
| Body / Prosa | **Inter** (Google Fonts) | Corpo do texto, inputs, meta |
| Código | **JetBrains Mono** (Google Fonts) | Code blocks, inline code |

```html
<!-- Import obrigatório -->
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

### Display / Headings (DM Sans)
| Nível | Tamanho | Peso | Line-height | Letter-spacing | Cor |
|-------|---------|------|-------------|----------------|-----|
| H1 (hero) | `3rem` | 700 | 1.1 | `-0.03em` | `#111827` |
| H2 | `2.25rem` | 700 | 1.2 | `-0.02em` | `#111827` |
| H3 | `1.875rem` | 700 | 1.3 | — | `#111827` |
| H4 | `1.5rem` | 600 | 1.3 | — | `#111827` |
| H5 | `1.25rem` | 600 | — | — | `#111827` |
| Nav / CTA label | `1rem` | 500 | — | — | `#111827` |

### Body (Inter)
| Estilo | Tamanho | Peso | Line-height | Cor |
|--------|---------|------|-------------|-----|
| Lead (intro parágrafo) | `1.15rem` | 400 | 1.8 | `#374151` |
| Body padrão | `1rem` | 400 | 1.6 | `#374151` |
| Small / card excerpt | `0.95rem` | 400 | — | `#475569` |
| Meta / timestamp | `0.875rem` | 500 | — | `#64748b` |
| Label categoria (caps) | `0.75rem` | 600 | — | `#3B5F8A` · uppercase · `letter-spacing: 0.05em` |
| Lead itálico (post) | `1.27rem` | 400 italic | 1.6 | `#475569` |

### Código (JetBrains Mono)
```css
/* Code block */
font-family: 'JetBrains Mono', monospace;
font-size: 13px;
line-height: 1.7;
background: #111827;
color: #E2E8F0;
border-radius: 10px;
padding: 16px 20px;

/* Syntax highlighting */
--color-keyword:  #8AAEC8;   /* import, const, etc. */
--color-string:   #86EFAC;   /* strings */
--color-function: #7DD3FC;   /* function names */
--color-comment:  #475569;   /* comments */

/* Inline code */
background: #F1F5F9;
color: #3B5F8A;
padding: 3px 8px;
border-radius: 4px;
font-size: 13px;
```

---

## 4. Espaçamento

### Escala Base (4px)
| Token | px | rem | CSS var sugerida |
|-------|----|-----|-----------------|
| `space-1` | 4px | 0.25rem | `--space-1` |
| `space-2` | 8px | 0.5rem | `--space-2` |
| `space-3` | 12px | 0.75rem | `--space-3` |
| `space-4` | 16px | 1rem | `--space-4` |
| `space-5` | 20px | 1.25rem | `--space-5` |
| `space-6` | 24px | 1.5rem | `--space-6` |
| `space-8` | 32px | 2rem | `--space-8` |
| `space-10` | 40px | 2.5rem | `--space-10` |
| `space-12` | 48px | 3rem | `--space-12` |
| `space-16` | 64px | 4rem | `--space-16` |
| `space-20` | 80px | 5rem | `--space-20` |

### Border Radius
| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | `4px` | Tags, badges, syntax code |
| `radius-md` | `6px` | Inputs, botões |
| `radius-lg` | `10px` | Cards de post, code blocks |
| `radius-xl` | `12px` | Cards de categoria, author box, modais |
| `radius-full` | `9999px` | Badges pill, avatares |

---

## 5. Elevação (Sombras)
| Token | CSS | Uso |
|-------|-----|-----|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Elementos sutis |
| `shadow-md` | `0 5px 15px rgba(0,0,0,0.05)` | Cards (estado padrão) |
| `shadow-lg` | `0 10px 20px rgba(0,0,0,0.1)` | Cards (hover), dropdowns |
| `shadow-xl` | `0 20px 40px rgba(0,0,0,0.12)` | Imagem destaque, modais |
| `shadow-accent` | `0 10px 20px rgba(59,95,138,0.22)` | Botão CTA primário (hover) |

---

## 6. Componentes

### Botões
```css
/* Base — DM Sans 600 */
.btn {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Tamanhos */
.btn-sm  { padding: 7px 16px;   font-size: 0.8rem; }
.btn     { padding: 11px 26px;  font-size: 0.95rem; }
.btn-lg  { padding: 14px 32px;  font-size: 1.05rem; }

/* Variantes */
.btn-primary      { background: #3B5F8A; color: #fff; }
.btn-primary:hover { background: #2D4F76; transform: translateY(-2px);
                     box-shadow: 0 10px 20px rgba(59,95,138,0.18); }

.btn-outline      { background: transparent; border: 2px solid #3B5F8A; color: #3B5F8A; }
.btn-outline:hover { background: #3B5F8A; color: #fff; transform: translateY(-2px); }

.btn-outline-dark      { background: transparent; border: 2px solid #111827; color: #111827; }
.btn-outline-dark:hover { background: #111827; color: #fff; transform: translateY(-2px); }

.btn-ghost      { background: transparent; color: #3B5F8A; }
.btn-ghost:hover { background: #EBF1F8; }

/* On dark background */
.btn-white { background: transparent; border: 2px solid #fff; color: #fff; }
```

### Cards de Post
```css
.post-card {
  background: #fff;
  border-radius: 10px;       /* radius-lg */
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);  /* shadow-md */
  transition: transform 0.2s, box-shadow 0.2s;
}
.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);  /* shadow-lg */
}
/* Tag de categoria no card */
.post-tag {
  background: #3B5F8A; color: #fff;
  border-radius: 4px; font-family: 'DM Sans'; font-weight: 700; font-size: 0.72rem;
}
/* Título */
.card-title { font-family: 'DM Sans'; font-weight: 700; font-size: 0.95rem; color: #111827; line-height: 1.35; }
/* Excerpt */
.card-excerpt { font-size: 0.8rem; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
/* Read more */
.read-more { color: #3B5F8A; font-family: 'DM Sans'; font-weight: 600; font-size: 0.85rem; }
```

### Cards de Categoria
```css
.cat-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;        /* radius-xl */
  padding: 18px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  transition: all 0.2s;
}
.cat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  border-color: #3B5F8A;
}
.cat-icon {
  width: 44px; height: 44px;
  background: #EBF1F8; border-radius: 10px;
  color: #3B5F8A; font-size: 1.2rem;
}
.cat-name { font-family: 'DM Sans'; font-weight: 700; font-size: 0.75rem; color: #111827; }
```

### Navegação (Header)
```css
header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.nav-logo {
  font-family: 'DM Sans'; font-weight: 700; font-size: 1.2rem;
  letter-spacing: -0.03em; color: #111827;
}
.nav-logo .accent { color: #3B5F8A; }

.nav-link {
  font-family: 'DM Sans'; font-weight: 600; font-size: 0.9rem;
  color: #111827; text-decoration: none; transition: color 0.2s;
}
.nav-link:hover, .nav-link.active { color: #3B5F8A; }

/* Mobile menu item */
.mobile-menu-icon { width: 32px; height: 32px; background: #EBF1F8; border-radius: 6px; color: #3B5F8A; }
.mobile-menu-label { font-family: 'DM Sans'; font-weight: 600; font-size: 0.85rem; color: #111827; }
```

### Formulários
```css
input, textarea {
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 10px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus, textarea:focus {
  border-color: #3B5F8A;
  box-shadow: 0 0 0 3px rgba(59,95,138,0.12);
  outline: none;
}
input.error { border-color: #EF4444; }
.hint   { font-size: 0.78rem; color: #94A3B8; }
.err-msg { font-size: 0.78rem; color: #EF4444; }

/* Search bar */
.search-bar {
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  border: 1px solid #E2E8F0;
  overflow: hidden;
}
.search-bar input  { border: none; padding: 14px 18px; font-size: 1rem; }
.search-bar button { background: #3B5F8A; color: #fff; }
.search-bar button:hover { background: #2D4F76; }
```

### Tags e Badges
```css
/* Tags (quadradas) */
.tag { padding: 4px 10px; border-radius: 4px; font-family: 'DM Sans'; font-size: 0.78rem; font-weight: 600; }
.tag-primary  { background: #3B5F8A; color: #fff; }
.tag-muted    { background: #EBF1F8; color: #3B5F8A; }
.tag-dark     { background: #111827; color: #fff; }
.tag-outline  { border: 1px solid #E2E8F0; color: #374151; background: #fff; }

/* Badges (pill) */
.badge { padding: 3px 8px; border-radius: 9999px; font-size: 0.72rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.badge-accent { background: #EBF1F8; color: #3B5F8A; }
.badge-dark   { background: #1F2937; color: #CBD5E1; }
.badge-green  { background: #DCFCE7; color: #166534; }

/* Paginação */
.pg { width: 34px; height: 34px; border-radius: 6px; border: 1px solid #E2E8F0; font-family: 'DM Sans'; font-weight: 600; font-size: 0.85rem; color: #374151; }
.pg.active    { background: #3B5F8A; color: #fff; border-color: #3B5F8A; }
.pg:hover:not(.active) { background: #F8FAFC; }
```

### Author Box
```css
.author-box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
}
.author-avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, #3B5F8A, #8AAEC8);
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(59,95,138,0.2);
}
/* Nome: "Marcelo" dark + "Gonçalves" accent — igual ao logo */
.author-name   { font-family: 'DM Sans'; font-weight: 700; font-size: 1.1rem; color: #111827; }
.author-accent { color: #3B5F8A; }
.author-bio    { font-size: 0.92rem; color: #475569; line-height: 1.6; }
.author-social a        { color: #374151; font-size: 1.1rem; }
.author-social a:hover  { color: #3B5F8A; }
```

### Callouts (Artigos)
```css
.callout { padding: 8px 12px; border-radius: 6px; font-size: 11px; font-weight: 500; }
.callout-info    { background: #EEF4FB; border-left: 3px solid #9DBFE0; color: #1E3A5F; }
.callout-warning { background: #FFFBEB; border-left: 3px solid #FDE68A; color: #78350F; }
.callout-danger  { background: #FEF2F2; border-left: 3px solid #FECACA; color: #7F1D1D; }
```

---

## 7. Variáveis CSS — Implementação sugerida

```css
/* globals.css — raiz do projeto */
:root {
  /* Brand */
  --color-accent:        #3B5F8A;
  --color-accent-hover:  #2D4F76;
  --color-accent-press:  #1E3A57;
  --color-accent-light:  #8AAEC8;
  --color-accent-soft:   #D0E4F2;
  --color-accent-muted:  #EBF1F8;

  --color-dark:          #111827;
  --color-dark-surface:  #1F2937;
  --color-dark-surface2: #374151;

  /* Text */
  --text-primary:  #111827;
  --text-body:     #374151;
  --text-secondary:#475569;
  --text-muted:    #6B7280;
  --text-placeholder: #94A3B8;
  --text-invert:   #FFFFFF;

  /* Neutrals */
  --neutral-50:  #F8FAFC;
  --neutral-100: #F1F5F9;
  --neutral-200: #E2E8F0;
  --neutral-300: #CBD5E1;
  --neutral-400: #94A3B8;
  --neutral-500: #6B7280;
  --neutral-600: #475569;
  --neutral-700: #374151;
  --neutral-800: #1F2937;
  --neutral-900: #111827;

  /* Typography */
  --font-display: 'DM Sans', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Radius */
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   10px;
  --radius-xl:   12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:     0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:     0 5px 15px rgba(0,0,0,0.05);
  --shadow-lg:     0 10px 20px rgba(0,0,0,0.1);
  --shadow-xl:     0 20px 40px rgba(0,0,0,0.12);
  --shadow-accent: 0 10px 20px rgba(59,95,138,0.22);

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

---

## 8. Padrões de uso

### Hierarquia de ênfase em texto
1. Heading + DM Sans 700 → conteúdo principal
2. Body Inter 400 lh 1.6-1.8 → prosa legível
3. Muted `#6B7280` → metadata, timestamps, captions
4. Accent `#3B5F8A` → links, CTAs, ações

### Paleta por contexto de seção
| Seção | Background | Texto principal |
|-------|-----------|----------------|
| Hero / CTA | `#111827` (dark) | `#fff` + accent `#8AAEC8` highlight |
| Conteúdo principal | `#fff` | `#374151` |
| Seção alternada | `#F8FAFC` | `#374151` |
| Super destaque | `#1F2937` | `#fff` |

### Consistência do nome da marca
O padrão **"Marcelo" (dark) + "Gonçalves" (accent)** deve ser mantido em:
- Header/nav logo
- AuthorBox
- OG images
- Página /sobre

### Transições padrão
```css
transition: all 0.2s;          /* padrão geral */
transition: color 0.2s;        /* links de nav */
transition: transform 0.2s, box-shadow 0.2s;  /* cards */
```

### Hover em cards
```css
/* Padrão universal para cards interativos */
transform: translateY(-4px);
box-shadow: var(--shadow-lg);
```
