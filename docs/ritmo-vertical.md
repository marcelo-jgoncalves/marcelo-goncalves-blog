# Relatório Técnico — Auditoria de Ritmo Vertical (Vertical Rhythm Audit)

> Documento destinado ao **Claude Code** para análise, refatoração e correção estrutural do layout do blog.

---

## 1. Objetivo

Este documento descreve os problemas estruturais identificados no layout do blog relacionados a:

* ritmo vertical inconsistente
* quebra do fluxo natural do documento
* desalinhamento visual entre conteúdo principal e sidebar
* espaçamentos imprevisíveis
* comportamento incorreto de componentes reutilizáveis

O objetivo é permitir uma **refatoração sistemática** seguindo padrões modernos de engenharia front-end e design systems.

---

## 2. Diagnóstico Geral

A auditoria do DOM revelou que o problema **não está em espaçamentos isolados**, mas sim em uma **quebra estrutural do fluxo vertical**.

O layout atualmente mistura:

* fluxo normal do documento
* elementos posicionados com `position:absolute`
* uso de `transform`
* margens negativas
* sticky containers mal configurados

Isso impede a existência de um sistema consistente de ritmo vertical.

Resultado observado:

* gaps negativos massivos
* colapso de margens
* cards desalinhados
* sidebar fora da baseline
* sensação visual de layout instável

---

## 3. Problema Crítico Nº1 — Elementos Fora do Fluxo

### Sintoma Detectado

Elementos apresentando:

* valores extremamente negativos em `verticalGapFromPrevious`
* sobreposição lógica no fluxo do DOM

Componentes afetados:

* `.cmp-banner`
* `.page-hero`
* `.home-main`
* `.adsense-banner-wrapper`

### Causa Provável

Uso incorreto de:

```
position: absolute
position: fixed
transform: translateY()
margin-top negativa
```

Esses elementos deixam o fluxo normal e quebram o cálculo vertical do navegador.

### Solução Obrigatória

Converter seções estruturais para fluxo normal:

```
.page-hero,
.home-main,
.cmp-banner {
  position: relative;
  top: auto;
  transform: none;
  margin-top: 0;
}
```

Regra:

> Seção estrutural NUNCA deve usar `position:absolute`.

---

## 4. Problema Crítico Nº2 — Cards Saindo do Fluxo

### Sintoma

Componentes:

* `.post-card__image-wrapper`

apresentam gaps negativos recorrentes.

### Causa

Wrapper da imagem utilizando:

```
position:absolute
```

ou hacks de aspect ratio antigos.

### Correção Recomendada

Adotar layout moderno:

```
.post-card__image-wrapper {
  position: relative;
}

.post-card img {
  display: block;
  width: 100%;
  height: auto;
}
```

OU:

```
.post-card__image-wrapper {
  aspect-ratio: 16 / 9;
}

.post-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 5. Problema Crítico Nº3 — Espaçamento Duplicado em Headers

### Sintoma

`.section-header` adicionando espaçamento adicional sobre seções já espaçadas.

### Estrutura Atual (Problemática)

```
section (padding vertical)
  section-header (margin-bottom)
```

### Resultado

* inconsistência rítmica
* espaçamento variável entre blocos

### Correção

Apenas o container controla spacing vertical.

```
section {
  padding-block: var(--space-xl);
}

.section-header {
  margin: 0;
}
```

---

## 6. Problema Crítico Nº4 — Sidebar Quebrando Ritmo

### Sintoma

Widgets da sidebar apresentam deslocamentos verticais grandes.

### Causa

Uso incorreto de:

```
position: sticky
```

em conjunto com container pai mal configurado.

### Correção

Garantir:

```
.sidebar-wrapper {
  align-self: start;
}
```

Evitar no pai:

```
height: 100%;
overflow: hidden;
```

---

## 7. Problema Crítico Nº5 — Banner AdSense Fora do Fluxo

### Sintoma

Wrapper de anúncios causando grandes offsets negativos.

### Causa

Banner tratado como elemento absoluto.

### Implementação Correta

```
.adsense-banner-wrapper {
  display: block;
  margin-block: var(--space-3xl);
}
```

Ads devem participar do fluxo editorial.

---

## 8. Problema Sistêmico — Ausência de Design System de Espaçamento

Atualmente existem múltiplos valores arbitrários de spacing.

Isso impede consistência visual.

### Criar Tokens de Espaçamento

```
:root {
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 40px;
  --space-xl: 64px;
  --space-2xl: 96px;
}
```

### Regra

> Nenhum valor de margin/padding pode existir fora dos tokens.

---

## 9. Regras Arquiteturais Obrigatórias

Claude Code deve aplicar:

### Regra 1 — Nada Sai do Fluxo

Evitar:

* position absolute em layout estrutural
* translateY para alinhamento
* margens negativas

Permitido apenas para overlays reais.

---

### Regra 2 — Single Source of Spacing

Somente tokens definidos podem ser usados.

Proibido:

```
margin-top: 37px;
padding: 53px;
```

---

### Regra 3 — Apenas o Pai Espaça

Nunca permitir:

```
container + filho adicionando espaço vertical simultaneamente
```

---

### Regra 4 — Baseline Vertical

Todos os componentes devem alinhar em múltiplos de 8px.

Objetivo:

```
baseline grid = 8px
```

---

## 10. Plano de Refatoração Recomendado

1. Remover posicionamentos absolutos estruturais
2. Normalizar hero, main e banners para fluxo natural
3. Corrigir wrappers de imagem dos cards
4. Centralizar controle de spacing nos containers
5. Implementar design tokens globais
6. Ajustar sidebar sticky
7. Revalidar spacing usando baseline grid

---

## 11. Resultado Esperado Após Correção

* ritmo vertical consistente
* alinhamento visual previsível
* sidebar sincronizada com conteúdo
* leitura mais confortável
* aparência editorial profissional
* base pronta para escalabilidade de design system

---

## 12. Prioridade de Execução

Alta prioridade:

1. Fluxo estrutural (Hero / Main / Banner)
2. Cards
3. Sidebar

Média prioridade:

4. Headers
5. Tokens de spacing

Baixa prioridade:

6. Ajustes finos tipográficos

---

## 13. Observação Final

O problema atual não é apenas visual.

Trata-se de um **problema arquitetural de layout**.

A correção deve ser conduzida como **refatoração estrutural**, não como ajustes pontuais de margin/padding.

---
