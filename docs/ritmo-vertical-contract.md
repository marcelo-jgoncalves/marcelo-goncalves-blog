# Relatório Completo — Correção de Ritmo Vertical (Vertical Rhythm Refactor Guide)

> Documento técnico definitivo para implementação de um **sistema world-class de ritmo vertical**.
> Destinado ao **Claude Code** para execução estruturada das correções.

---

## 1. Objetivo

Este documento define as ações necessárias para transformar o layout atual do blog em um sistema editorial profissional baseado em:

* previsibilidade visual
* consistência espacial
* escalabilidade de design system
* alinhamento perceptivo de leitura
* arquitetura de layout sustentável

O foco não é ajuste visual isolado.

> Trata-se de uma **refatoração arquitetural de layout**.

---

## 2. Diagnóstico Atual

Após análise do scan arquitetural:

## Situação Geral

✅ Fluxo estrutural restaurado
✅ Elementos absolutos removidos
✅ Transform hacks eliminados
⚠️ Ritmo vertical ainda inexistente

O layout está saudável, porém:

```text
CORRETO ≠ SISTÊMICO
```

O problema atual é a ausência de um **motor único de espaçamento**.

---

## 3. Problema Sistêmico Nº1 — Multiple Spacing Controllers

Foi detectado que vários elementos controlam spacing simultaneamente.

Exemplo observado:

```text
section
 ├ padding
 ├ header margin-bottom
 ├ grid gap
 └ card margin-top
```

Resultado:

* inconsistência
* gaps negativos
* desalinhamento perceptivo

---

## 4. Correção 1 — Reset Global de Margens

Adicionar imediatamente:

```css
/* Vertical Rhythm Reset */

h1,h2,h3,h4,h5,h6,
p,
ul,
ol,
figure {
  margin-block: 0;
}
```

Regra:

> Elementos tipográficos nunca controlam spacing vertical.

---

## 5. Correção 2 — Criar o Motor do Layout (.stack)

Este é o componente mais importante do sistema.

Criar:

```css
.stack > * + * {
  margin-top: var(--space-4);
}
```

Aplicar em:

```html
<section class="section stack">
```

ou

```html
<main class="stack">
```

Benefícios:

* elimina margens arbitrárias
* cria ritmo automático
* estabiliza o layout inteiro

---

## 6. Correção 3 — Sections Controlam o Espaçamento

Somente containers definem ritmo.

```css
.section {
  padding-block: var(--space-8);
}
```

Filhos NÃO podem possuir:

```css
margin-top
margin-bottom
```

Lei fundamental:

```text
APENAS O PAI ESPAÇA
```

---

## 7. Correção 4 — Implementar Design Tokens

Criar sistema único:

```css
:root {

  --baseline: 8px;

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-7: 64px;
  --space-8: 80px;
  --space-9: 96px;
  --space-10: 128px;

}
```

Regra obrigatória:

> Nenhum valor hardcoded de spacing é permitido.

---

## 8. Correção 5 — Baseline Grid Tipográfico

Estabelecer alinhamento perceptivo.

### Body

```css
body {
  font-size: 18px;
  line-height: 32px;
}
```

32px = múltiplo de 8px.

---

### Headings

```css
h1,h2,h3,h4,h5,h6 {
  margin:0;
}
```

Headings não criam espaçamento vertical.

---

## 9. Correção 6 — Grid Governa Cards

Cards nunca controlam espaçamento externo.

### Remover dos cards:

```css
margin-top
margin-bottom
```

### Grid correto:

```css
.posts-grid {
  display:grid;
  gap: var(--space-5);
  align-items:start;
}
```

Regra:

```text
GRID ESPAÇA
COMPONENTE NÃO
```

---

## 10. Correção 7 — Sidebar Sticky World-Class

Problema detectado:

Sticky bloqueado por container pai.

Correção:

```css
.sidebar-wrapper {
  overflow:visible;
  height:auto;
}

.sidebar {
  position:sticky;
  top: var(--space-7);
  align-self:start;
}
```

---

## 11. Correção 8 — Ordem DOM = Ordem Visual

Detectado uso de reordering.

Remover:

```css
order:
grid-area:
flex-direction: column-reverse;
```

Regra absoluta:

```text
DOM ORDER == VISUAL ORDER
```

Motivo:

* preserva ritmo
* melhora acessibilidade
* evita gaps fantasmas

---

## 12. Correção 9 — Vertical Rhythm Enforcement

Adicionar proteção permanente:

```css
* {
  margin-block-start:0;
  margin-block-end:0;
}
```

Todo spacing passa a vir do sistema.

---

## 13. Correção 10 — Debug Baseline Overlay

Modo auditoria visual:

```css
body.debug-rhythm {
  background-image:
    linear-gradient(
      to bottom,
      rgba(255,0,0,0.08) 1px,
      transparent 1px
    );
  background-size:100% 8px;
}
```

Permite verificar alinhamento perfeito.

---

## 14. Ordem Oficial de Implementação

Executar exatamente nesta sequência:

1. Reset global de margens
2. Introduzir `.stack`
3. Sections controlam spacing
4. Implementar tokens
5. Ajustar tipografia ao baseline
6. Grid governa cards
7. Corrigir sidebar sticky
8. Remover reordering CSS
9. Ativar enforcement
10. Validar com overlay baseline

---

## 15. Métricas Esperadas Após Refatoração

Novo scan deverá indicar:

```text
outOfFlow: 0
negativeGaps: ~0
baselineMisaligned: baixo
spacingScore médio: 1
```

Visualmente ocorrerá:

* leitura fluida
* alinhamento automático
* sensação editorial premium
* redução de fadiga visual
* layout previsível

---

## 16. Princípios World-Class de Ritmo Vertical

1. Nada sai do fluxo.
2. Apenas containers controlam spacing.
3. Todo valor segue baseline 8px.
4. Componentes não competem por espaço.
5. Tipografia governa percepção visual.
6. Layout deve parecer invisível.

---

## 17. Definição Final

Ritmo vertical não é estética.

É **infraestrutura de interface**.

Uma vez implementado:

* o layout deixa de depender de ajustes manuais
* novos componentes herdam consistência automaticamente
* o blog passa de layout artesanal para **design system profissional**.

---
