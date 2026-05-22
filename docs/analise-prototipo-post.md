# Análise: Protótipo `postagem.tsx.jsx` × Padrão do Projeto

> Documento de análise para validação antes da implementação.  
> Referências: `sobre.css`, `post.css`, `globals.css`, `CLAUDE.md`, `ritmo-vertical-contract.md`.

---

## 1. Síntese Executiva

O protótipo apresenta uma linguagem visual **sofisticada e editorial** que está alinhada com a direção que o projeto tomou na página `/sobre`. A estrutura do hero, os numeradores de seção (estilo `0X`), o bloco intro em glass card e o card escuro do autor são padrões que **devem ser adotados** — são os elementos que dão personalidade ao protótipo.

O problema central é que o protótipo usa **uma paleta alternativa** que conflita com o design system estabelecido: fundo bege `#f8f4ee`, laranja `#da7b26/#ec9a2e` e texto `#1a3141` são cores que **não existem no nosso sistema**. Além disso, usa Tailwind com valores ad-hoc em vez dos nossos tokens CSS.

A implementação exige substituir as cores e tokens, mas **preservar a arquitetura visual** — que é exatamente o que queremos.

---

## 2. Auditoria de Cores

### 2.1 Cores do protótipo × tokens do projeto

| Protótipo | Uso no protótipo | Token correto | Observação |
|---|---|---|---|
| `#f8f4ee` | Fundo da página | `--slate-50: #F8FAFC` | Bege → branco frio — nossa paleta |
| `#1a3141` | Texto principal | `--dark-900: #111827` | Dark navy → slate escuro padrão |
| `#315b92` | Accent blue | `--accent: #3B5F8A` | Muito próximo — substituir |
| `#da7b26` | Accent laranja (dot, CTA) | **Remover** | Orange foi eliminado do projeto |
| `#ec9a2e` | Laranja claro (badge) | **Remover** | Idem |
| `#8cb5ea` | Azul claro (labels escuros) | `rgba(255,255,255,0.7)` ou `--accent-light` | Não é token — usar white contextual |
| `#1a3141` (bg escuro) | Fundo do card autor | `--accent: #3B5F8A` ou `--accent-dark: #1E3A57` | Usar `--accent-dark` como no sobre-bio-card |
| `rgba(49,91,146,0.08-0.20)` | Bordas/overlays sutis | `rgba(59,95,138,0.08-0.20)` | Quase idêntico — só trocar o hex |
| Gradiente fixo com laranja | Background atmosphere | **Remover** | Conflita com nossa paleta |

### 2.2 Diagnóstico

- **🔴 Crítico:** Laranja (`#da7b26`, `#ec9a2e`) deve ser completamente removido. Não há equivalente no sistema.
- **🟡 Ajuste:** Fundo `#f8f4ee` → `--slate-50`. A mudança é pequena visualmente mas necessária para consistência.
- **🟢 Compatível:** O accent blue `#315b92` é praticamente nosso `--accent: #3B5F8A`. Troca direta, impacto visual mínimo.

---

## 3. Auditoria de Tipografia

### 3.1 Tamanhos e pesos do protótipo

| Elemento | Protótipo (Tailwind) | Token correto | Peso |
|---|---|---|---|
| H1 hero | `text-5xl/7xl` (3rem/4.5rem) | `--text-3xl: 2.8rem` / `--text-4xl: 3.5rem` | black (900) → 800 |
| Lead hero | `text-2xl` (1.5rem) | `--text-xl: 1.5rem` ✅ | semibold |
| Eyebrow category | `text-sm` tracking largo | `--text-xs` + `letter-spacing: 0.24em` | 700 |
| H2 seção | `text-4xl` (2.25rem) | `--text-2xl: 2rem` | black → 800 |
| Body | `text-[1.3rem]/[1.35rem]` | `--text-lg: 1.125rem` | regular |
| Label escuro (sidebar) | `text-xs` tracking largo | `--text-xs` ✅ | 700 |
| "Neste artigo" | `text-3xl` (1.875rem) | `--text-xl: 1.5rem` | 800 |

### 3.2 Diagnóstico

- O protótipo usa `body text-[1.3rem]` (20.8px) — significativamente maior que nosso `--text-lg: 1.125rem` (20px). A diferença é mínima, mas nosso token está correto.
- O `font-weight: 900` (black) no H1 é compatível com o padrão do `/sobre` (H1 usa `font-weight: 800`). Manter 800.
- `letter-spacing: -0.07em` no H1 do protótipo é mais agressivo que o `-0.04em` que usamos no `/sobre`. O `-0.04em` é o nosso padrão estabelecido.
- Eyebrow com `tracking-[0.24em]` é idêntico ao nosso padrão de eyebrow (`.sobre-eyebrow`, `.sobre-bio-card__eyebrow`). ✅

---

## 4. Auditoria de Layout e Estrutura

### 4.1 Grade principal

| Aspecto | Protótipo | Padrão do projeto |
|---|---|---|
| Grid colunas | `1fr 340px` | `1fr 300px` (**obrigatório**) |
| Gap colunas | `gap-12` = 48px | `var(--space-4)` = 32px |
| Padding lateral | `px-6 lg:px-10` (Tailwind) | `.container` com `padding: 0 var(--space-2)` |
| Max-width artigo | `max-w-7xl` (1280px) | `.container` padrão |
| Hero padding | `pt-24 pb-20` (96px/80px) | `var(--space-6)` = 64px top + `var(--space-5)` = 48px bottom |

### 4.2 Imagem de destaque

| Aspecto | Protótipo | Projeto atual | Decisão |
|---|---|---|---|
| Position | Dentro do hero, abaixo do texto | Fora do header, overlap no grid | **Manter posição atual** (overlap já é premium) |
| Border-radius | `rounded-[40px]` (40px) | `12px` | **Aumentar para `24px`** — mais próximo do `/sobre` |
| Shadow | `shadow-[0_30px_80px_...]` | border-radius simples | **Adotar shadow** — `var(--shadow-authority)` |
| Height | `h-[520px]` | `448px` desktop | **Manter 448px** — já estabelecido |

### 4.3 Ritmo vertical (tokens)

O protótipo usa Tailwind (`space-y-10`, `mt-20`, `mb-10`) com valores ad-hoc. Toda implementação deve usar exclusivamente `--space-1` a `--space-7`. Não há exceções.

---

## 5. Análise Componente a Componente

### 5.1 HERO / ARTICLE HEADER ⭐ Adotar com adaptações

**O que o protótipo faz bem:**
- Badge de categoria centralizado acima do H1 — mais premium que nosso `post-tag-header` atual
- H1 muito grande, tracking agressivo, peso máximo — alinhado com /sobre
- Lead em tamanho generoso com opacidade reduzida — boa hierarquia
- Meta (autor · data · leitura) em linha horizontal centralizada — mais limpo que o atual

**Mudanças necessárias:**
- Substituir o dot laranja animado no badge por um ícone FA ou apenas texto
- Remover o gradiente radial de fundo do hero section
- Badge: `border + bg-white/60 + backdrop-blur` → nosso padrão de pill: `background: var(--accent-light); color: var(--accent)`
- Tracking do H1: `-0.07em` → `-0.04em` (padrão `/sobre`)
- Fundo da section: `var(--slate-50)` com `border-bottom: 1px solid var(--border-color)` (padrão atual já bom)

---

### 5.2 BLOCO INTRO (glass card) ⭐ Adotar com adaptações

O protótipo envolve a introdução do artigo num card glass branco com `border-radius: 36px` e `box-shadow`. Isso substitui o `post-lead` atual (parágrafo simples com borda esquerda accent).

**Julgamento:** O glass card intro é uma melhoria editorial real — cria separação visual clara entre o lead e o corpo do artigo. Alinha-se com o padrão de card do `/sobre` (`sobre-bio-card`).

**Adaptação necessária:**
- Background: `bg-white/60 backdrop-blur-xl` → `background: white; border: 1px solid var(--border-color);` (sem backdrop-blur — não usamos glassmorphism extensivo)
- Border-radius: `36px` → `24px` (padrão dos nossos widgets)
- Shadow: `shadow-[0_20px_60px_rgba(26,49,65,0.06)]` → `var(--shadow-soft)`
- Eyebrow "Introdução": usar nosso padrão `font-mono + uppercase + tracking + linhas laterais` (idêntico ao `/sobre`)
- Manter o `blockquote` estilizado dentro do intro

---

### 5.3 NUMERADORES DE SEÇÃO (0X + H2) ⭐ Adotar

Os números de seção do protótipo (`0{item}` em frames `rounded-2xl bg-[#315b92]/10`) são **idênticos conceitualmente** ao `sobre-expertise-num-frame` já implementado no `/sobre`.

**Implementação:** Criar CSS para `.post-section-num` seguindo exatamente o padrão do `sobre-expertise-num-frame`:
- `52px × 52px`, `border-radius: 14px`
- Background: `rgba(59,95,138,0.10)` — o `--accent/10`
- Número: `font-display, font-weight: 800, color: var(--accent)`
- Layout: `display: flex; align-items: center; gap: var(--space-2)` com o H2

**Importante:** Este é um elemento **de estilo CSS**, não um elemento renderizado pelo CMS. O conteúdo do Tiptap gera H2 simples — a numeração seria estilo via CSS `counter`, aplicado automaticamente a cada `h2` dentro de `.post-content`.

---

### 5.4 BLOCOS DE CÓDIGO ✅ Manter atual

O protótipo tem um bloco de código estilizado com fundo `#1a3141` e `border-radius: 34px`. O nosso `post.css` já tem código blocks bem elaborados com `var(--dark-900)`, `CopyCodeLogic`, header de linguagem. **Não alterar** — o atual é mais funcional.

---

### 5.5 AUTOR BLOCK ⭐ Modernizar

O protótipo tem um card autor com fundo escuro (`#1a3141`), foto grande com border-radius agressivo, bio e nome em hierarquia forte.

Nosso `AuthorBox` atual é sobrio: branco, avatar circular 72px, flex horizontal.

**Julgamento:** O protótipo é visualmente superior. A versão dark alinha com o padrão do `sobre-bio-card` (mesma linguagem de card escuro accent).

**Adaptação:**
- Background: `--accent: #3B5F8A` (Classic Blue — o nosso dark CTA padrão)
- Border-radius: `24px` (não 40px)
- Foto: `border-radius: 20px` (não circular como hoje)
- Eyebrow "Sobre o autor": nosso padrão mono + tracking
- Shadow: `var(--shadow-authority)`
- **Importante:** Manter compatibilidade com `AuthorBox.tsx` existente — a mudança é no CSS, não na lógica de dados

---

### 5.6 SIDEBAR — TOC ⭐ Modernizar

O protótipo tem um TOC muito mais visual: itens como cards individuais com estado ativo em accent sólido. Nosso TOC atual é uma lista simples.

**Adotar a estrutura visual:**
- Item inativo: `background: white; border: 1px solid var(--border-color); border-radius: 12px; padding: var(--space-2)`
- Item ativo: `background: var(--accent); color: white; border-radius: 12px`
- Hover: `border-color: rgba(59,95,138,0.3)`

---

### 5.7 SIDEBAR — COMPARTILHAR ⭐ Adotar estilo

O protótipo tem um widget de share com fundo `var(--accent)` (nossa cor), texto branco, botões glass. Equivale ao nosso `ShareButtons` mas como widget sidebar.

**Mudança:** Nosso `ShareButtons` está no footer do artigo. O protótipo o coloca na sidebar — posição mais visível. Considerar mover ou duplicar para a sidebar no futuro (fora do escopo desta análise).

---

### 5.8 SIDEBAR — NEWSLETTER 🟡 Adaptar

O protótipo tem pill laranja (❌) e formulário de input com botão. Nosso `NewsletterWidget` usa um padrão diferente (link para /newsletter). Manter o nosso.

---

### 5.9 ARTIGOS RELACIONADOS ⭐ Novo componente

O protótipo tem uma seção "Continue explorando" com 3 cards de artigos relacionados. **Nossa página de post não tem isso.** É uma excelente adição para engajamento e SEO interno.

**Avaliação:** Pode ser implementado reutilizando os `PostCard` existentes com dados de `getPopularPosts` ou `getPostsByCategory`. Posição: abaixo da `NewsletterCTA`, como seção separada. Escopo de implementação futura.

---

### 5.10 HEADER E FOOTER ⛔ Não tocar

O protótipo inclui header e footer próprios — elementos de layout global que **não são escopo da página de post**. Nosso `Header` e `Footer` já estão no layout raiz. Ignorar completamente.

---

## 6. O Que Manter da Implementação Atual

| Elemento atual | Motivo para manter |
|---|---|
| `CopyCodeLogic` — botão copiar código | Funcionalidade que o protótipo não tem |
| `AdsenseInArticle` | Monetização — escopo definido |
| `TOC variant="mobile"` accordion | UX mobile já resolvida |
| `BlogSidebar` com ServiceCallout e ProjetoWidget | Estrutura de sidebar já correta |
| `ShareButtons` no footer | Funcionando — mover para sidebar é escopo futuro |
| `processFullPostContent` + Tiptap | Renderização do CMS |
| JSON-LD + SEO | Obrigatório — nunca remover |
| `ResponsiveImage` com LQIP | Performance — o protótipo usa `<img>` simples |
| ISR `revalidate = 60` | Performance |
| `featured-image-container` com overlap | Visual já premium |

---

## 7. Mapa de Implementação

### Fase 1 — Hero / Article Header (alto impacto, menor risco)
- Redesenhar `.article-header` com badge pill estilo `/sobre`
- H1 com tracking `-0.04em`, `font-weight: 800`
- Meta em linha horizontal com separador `·`
- Remover `background-color: var(--slate-50)` → fundo branco limpo

### Fase 2 — Bloco Intro (médio impacto)
- Envolver `.post-lead` num card branco com borda, shadow e radius 24px
- Adicionar eyebrow "Introdução" no estilo do `/sobre`
- Estilizar `blockquote` no mesmo card

### Fase 3 — Numeradores de Seção via CSS counter (alto impacto visual)
- `counter-reset` no `.post-content` e `counter-increment` em cada `h2`
- Frame `52×52px` com número accent via `::before` no H2

### Fase 4 — AuthorBox dark (alto impacto)
- Redesenhar `AuthorBox.css` com fundo `var(--accent)`, foto quadrada, eyebrow mono
- Manter `AuthorBox.tsx` intacto — só CSS muda

### Fase 5 — TOC sidebar modernizado (médio impacto)
- Cards individuais nos itens do TOC desktop
- Estado ativo com fundo `var(--accent)`

---

## 8. Checklist de Conformidade

Cada elemento implementado deve passar por:

- [ ] Cores: apenas tokens do design system (`--accent`, `--dark-900`, `--slate-*`, etc.)
- [ ] **Laranja (#da7b26, #ec9a2e): zero ocorrências**
- [ ] Espaçamento: `--space-1` a `--space-7` — sem valores ad-hoc
- [ ] Border-radius: `14px / 18px / 24px` — sem `40px` ou `36px`
- [ ] Tipografia: `--text-xs` a `--text-4xl` — sem valores ad-hoc
- [ ] Font-weight: `700` ou `800` em headings — sem `900` (black)
- [ ] Letter-spacing headings: `-0.04em` (padrão `/sobre`)
- [ ] Glassmorphism (`backdrop-blur`): não usar — nosso padrão é fundo sólido branco ou accent
- [ ] `<img>` substituído por `<ResponsiveImage>` em todos os lugares
- [ ] `section { margin-block: 0 }` em toda section fullwidth
- [ ] Sidebar: `1fr 300px`, `gap: var(--space-4)` — sem 340px ou gap 48px

---

## 9. Conclusão

O protótipo é **a direção certa**: editorial, premium, com forte hierarquia visual. A linguagem dos numeradores de seção, cards escuros e eyebrows mono é exatamente o padrão que o `/sobre` estabeleceu como referência para o projeto.

A implementação não é uma reimplementação do zero — é uma **camada de estilo** sobre a estrutura funcional existente. O TSX da `post/[slug]/page.tsx` muda pouco; o CSS muda muito.

O principal risco é a tentação de replicar o glassmorphism e o fundo bege do protótipo. **Isso não acontece** — nossa paleta é branca/slate com accent Classic Blue. O resultado final será visualmente tão premium quanto o protótipo, mas coerente com o sistema.
