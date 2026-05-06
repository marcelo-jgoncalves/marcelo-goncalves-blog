# RELATÓRIO DEFINITIVO — CORREÇÃO DE RITMO VERTICAL (WORLD-CLASS)

## CONTEXTO

Este documento contém instruções **determinísticas** para corrigir o ritmo vertical do layout do blog.

O objetivo NÃO é apenas reduzir espaçamentos, mas implementar um **Vertical Rhythm System** equivalente aos utilizados por:

* Stripe
* Linear
* Vercel
* Medium
* Notion

O layout atual já passou pela fase de normalização inicial.
Agora deve entrar na fase de **sistematização matemática**.

---

# 1. PRINCÍPIO FUNDAMENTAL

O layout DEVE seguir uma única escala espacial.

Criar imediatamente:

```css
:root {
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --space-6: 64px;
  --space-7: 96px;
}
```

REGRAS:

* Nenhum margin/padding fora dessa escala é permitido.
* Valores como 40, 80, 148, 184, 760 DEVEM ser removidos.

---

# 2. PROBLEMA CRÍTICO IDENTIFICADO

Hero → Primeiro AdSense possui gap de **184px**.

Isso quebra o fluxo editorial.

### Correção obrigatória

```css
.page-hero {
  padding-top: var(--space-6);
  padding-bottom: var(--space-4);
}

.hero-title {
  margin-bottom: var(--space-2);
}
```

Resultado esperado:

Hero → Ad = **64px visuais**

---

# 3. ERRO GRAVE — SECTION HEADER

Foi identificado gap vertical de aproximadamente **760px** após `.section-header`.

Isso indica:

* margin herdado
* altura fixa
* grid/flex mal configurado

### Correção obrigatória

```css
.section-header {
  margin-bottom: var(--space-4);
}
```

Remover qualquer:

* height fixo
* min-height
* margin-bottom maior que 32px

---

# 4. SISTEMA EDITORIAL PARA ADSENSE

Ads devem funcionar como blocos editoriais.

Nunca colados ao conteúdo.

Aplicar:

```css
.adsense-banner-wrapper {
  margin-block: var(--space-6);
}
```

Remover:

```css
margin-top: 0;
margin-bottom: 0;
```

Resultado esperado:

Conteúdo
↓64px
Ad
↓64px
Conteúdo

---

# 5. NORMALIZAÇÃO DOS POST CARDS

Problema detectado:

* gaps inconsistentes (40 / 80 / 148)
* padding interno excessivo

### Correção

```css
.post-card {
  margin-bottom: var(--space-5);
}

.post-card__content {
  padding: var(--space-3);
}
```

Proibido:

* padding 32px+
* margens arbitrárias

---

# 6. SEÇÕES DE CONTEÚDO

Toda SECTION principal deve obedecer:

```css
section {
  margin-block: var(--space-6);
}
```

Nunca usar:

* spacing manual por elemento interno
* divs espaçadoras
* empty spacers

---

# 7. SIDEBAR

Sidebars usam `gap` como único mecanismo de espaçamento entre widgets. Nunca usar `margin-bottom` nos filhos — isso duplica o espaço com o `gap`.

**Padrão obrigatório:**

```css
/* Desktop: flex column com gap uniforme */
.home-sidebar,
.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);   /* 24px entre widgets */
}

/* Cancela a regra global section { margin-block: 64px } nos filhos */
.home-sidebar > *,
.blog-sidebar > * {
  margin-block: 0;
}
```

**Mobile:**

```css
/* HomeSidebar: inteiramente oculta no mobile.
   O conteúdo principal já contém ServiceCallout entre as seções. */
.home-sidebar {
  display: none;
}

@media (min-width: 1024px) {
  .home-sidebar {
    display: flex;
  }
}

/* BlogSidebar: sempre display:none no mobile (não altera) */
.blog-sidebar {
  display: none;
}

@media (min-width: 1024px) {
  .blog-sidebar {
    display: flex;
  }
}
```

---

# 8. CTA FINAL

CTA deve representar pausa editorial.

```css
.page-cta {
  padding-top: var(--space-7);
  padding-bottom: var(--space-7);
}
```

---

# 9. FOOTER

Footer deve fechar o ritmo.

```css
.op-footer {
  padding-top: var(--space-6);
  padding-bottom: var(--space-4);
}
```

---

# 10. REGRA ABSOLUTA (OBRIGATÓRIA)

A IA executora deve:

1. Escanear TODO o CSS.
2. Localizar valores fora da escala.
3. Substituir automaticamente pelo token mais próximo.

Mapeamento obrigatório:

| Valor Atual | Substituir por |
| ----------- | -------------- |
| 40px        | 32px           |
| 48px        | 48px           |
| 80px        | 64px           |
| 148px       | 96px           |
| 184px       | 64px           |
| 760px       | 32px           |

---

# 11. RESULTADO ESPERADO

Após aplicação:

* ritmo vertical previsível
* leitura contínua
* ads integrados ao fluxo
* sensação editorial premium
* ausência de “buracos visuais”

---

# 12. CRITÉRIO DE VALIDAÇÃO

O layout está correto quando:

* qualquer scroll apresenta espaçamento previsível
* nenhum bloco parece “isolado”
* o usuário consegue prever o próximo espaço visual

Se existir dúvida entre dois valores → escolher sempre o menor dentro da escala.

---

FIM DO DOCUMENTO
