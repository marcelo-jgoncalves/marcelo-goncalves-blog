# Estratégia de Validação Visual — Protótipos vs App

> Referência para qualquer sessão de implementação dos novos protótipos.  
> Objetivo: validar autonomamente que o resultado é pixel-perfeito, sem depender de Marcelo para cada checagem.

---

## Contexto

Novos protótipos em `new-prots/*.html` + specs detalhadas em `specs/ESPECIFICACAO-*.md`.  
7 páginas redesenhadas: Home, Post, Artigos, Sobre, Serviços, O Projeto, 404.  
Implementação em Next.js (frontend/) deve corresponder exatamente aos protótipos.

---

## Pipeline de Validação Autônoma

### Fluxo por página

```
1. Playwright abre new-prots/[Pagina].html (file://)
2. Roda audit-script → captura JSON com computed styles
3. Playwright abre localhost:3000/[rota]
4. Roda audit-script → captura JSON
5. compare.ts → diff os dois JSONs
6. Relatório: propriedade / valor protótipo / valor app / ✅❌
7. Screenshot de cada seção nos dois lados
   → salvo em e2e/visual-audit/screenshots/
```

### Estrutura de arquivos

```
frontend/e2e/
  visual-audit/
    audit-script.ts          ← extração de computed styles
    compare.ts               ← diff + relatório de desvios
    home.audit.spec.ts
    post.audit.spec.ts
    artigos.audit.spec.ts
    sobre.audit.spec.ts
    servicos.audit.spec.ts
    o-projeto.audit.spec.ts
    not-found.audit.spec.ts
    screenshots/             ← gerado automaticamente
      home-proto/
      home-app/
      post-proto/
      post-app/
      ...
```

---

## Como os Seletores Funcionam

Durante a implementação, adicionar `data-audit="[key]"` em **ambos os lados**:

```html
<!-- no protótipo HTML -->
<section class="hero" data-audit="hero">
<nav class="nav" data-audit="nav">
<article class="post-card" data-audit="post-card">
```

```tsx
<!-- no componente Next.js -->
<section className={styles.hero} data-audit="hero">
<nav className={styles.nav} data-audit="nav">
<article className={styles.postCard} data-audit="post-card">
```

O script usa `data-audit` — independente de CSS Modules ou estrutura TSX.  
**Regra:** adicionar o atributo ao implementar cada componente, nunca depois.

---

## O que é Comparado Automaticamente

| Propriedade | Precisão |
|---|---|
| `backgroundColor`, `color`, `borderColor` | ✅ exato (normalizado para rgb) |
| `padding`, `margin`, `gap` | ✅ exato (px) |
| `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` | ✅ exato |
| `borderRadius`, `boxShadow` | ✅ exato |
| `display`, `gridTemplateColumns`, `flexDirection` | ✅ exato |
| `getBoundingClientRect` width/height | ✅ tolerância ±2px |
| `::before` / `::after` | ⚠️ screenshot only |
| Gradientes decorativos complexos | ⚠️ screenshot only |
| Estados de hover | ⚠️ screenshot only |
| Conteúdo dinâmico (texto real dos posts) | ⚠️ ignorado intencionalmente |

---

## Audit Script (base)

```typescript
// audit-script.ts — roda via page.evaluate()
const AUDIT_TARGETS = [
  'hero', 'nav', 'post-card', 'section-heading',
  'author-box', 'toc', 'share-rail', 'footer',
  'post-card-body', 'post-card-footer', 'stats-strip',
]

export const auditScript = () => {
  const result: Record<string, any> = {}

  document.querySelectorAll('[data-audit]').forEach(el => {
    const key = el.getAttribute('data-audit')!
    const s = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    result[key] = {
      padding:             s.padding,
      margin:              s.margin,
      gap:                 s.gap,
      fontSize:            s.fontSize,
      fontWeight:          s.fontWeight,
      fontFamily:          s.fontFamily,
      lineHeight:          s.lineHeight,
      letterSpacing:       s.letterSpacing,
      color:               s.color,
      backgroundColor:     s.backgroundColor,
      borderColor:         s.borderColor,
      borderRadius:        s.borderRadius,
      boxShadow:           s.boxShadow,
      display:             s.display,
      gridTemplateColumns: s.gridTemplateColumns,
      flexDirection:       s.flexDirection,
      width:               rect.width.toFixed(1) + 'px',
      height:              rect.height.toFixed(1) + 'px',
    }
  })

  return result
}
```

---

## Formato do Relatório de Desvios

```
─── AUDIT: home/hero ───────────────────────────────────────────
  backgroundColor  ✅  rgb(8, 50, 61)
  padding          ❌  proto: 88px 40px 0px  |  app: 64px 40px 0px
  gap              ❌  proto: 64px           |  app: 48px
  color            ✅  rgb(255, 255, 255)
  fontSize         ✅  clamp(...)

─── AUDIT: home/post-card ──────────────────────────────────────
  backgroundColor  ✅  rgb(255, 255, 255)
  borderRadius     ✅  14px
  boxShadow        ❌  proto: 0px 2px 4px rgba(...)  |  app: none
  gap              ✅  9px
```

---

## Ciclo de Desenvolvimento por Componente

```
1. Implementar componente TSX + CSS
2. Adicionar data-audit nos elementos-chave (proto + app)
3. Executar: npm run audit:[pagina]
4. Ler relatório → identificar desvios ❌
5. Corrigir CSS com Incremental Investigation Protocol
6. Repetir até zero ❌
7. Commit
```

---

## Comandos (a configurar em package.json)

```json
"audit:home":      "playwright test e2e/visual-audit/home.audit.spec.ts",
"audit:post":      "playwright test e2e/visual-audit/post.audit.spec.ts",
"audit:artigos":   "playwright test e2e/visual-audit/artigos.audit.spec.ts",
"audit:sobre":     "playwright test e2e/visual-audit/sobre.audit.spec.ts",
"audit:servicos":  "playwright test e2e/visual-audit/servicos.audit.spec.ts",
"audit:projeto":   "playwright test e2e/visual-audit/o-projeto.audit.spec.ts",
"audit:404":       "playwright test e2e/visual-audit/not-found.audit.spec.ts",
"audit:all":       "playwright test e2e/visual-audit/"
```

---

## O que Marcelo Valida ao Final

Apenas o que o script não consegue capturar:
- Pseudoelementos `::before` / `::after` (blobs, linhas decorativas, gradients)
- Estados de hover / focus / active
- Animações e transições
- Percepção visual geral / feel do design

Screenshots gerados automaticamente em `e2e/visual-audit/screenshots/` servem como referência lado a lado para essa verificação final.

---

## Ordem de Implementação

1. **Token Foundation** — globals.css com nova paleta (petrol, clay, ivory, ink, slate, steel, sand, line, moss)
2. **Componentes compartilhados** — Header + Footer + PostCard (aparecem em todas as 7 páginas)
3. **Páginas por impacto** — Home → Post → Artigos → Sobre → Serviços → O Projeto → 404
4. **JS interativo** — progress bar, TOC spy, pills, toast (após visual estabilizado)

Cada página = um ciclo atômico: implementar → audit → corrigir → commit → pipeline verde.

---

## Limitação Conhecida

`getComputedStyle` resolve tudo para valores absolutos em `px` e `rgb()`.  
Comparação de cores: normalizar ambos os lados para `rgb(r, g, b)` antes do diff.  
`clamp()` e `vw` são resolvidos para o valor atual da viewport — rodar ambos na mesma largura de janela (1280px).
