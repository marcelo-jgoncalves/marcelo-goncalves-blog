````md
# 🎯 MISSÃO

Aplicar uma **estilização premium moderna** **SEM alterar**:

- a identidade visual existente
- a paleta de cores atual
- a estrutura do blog
- o design system base
- a arquitetura de componentes

O objetivo NÃO é redesign.

O objetivo é:

> **elevar a percepção visual do projeto usando apenas uma camada estética premium.**

---

# ⚠️ REGRA ABSOLUTA (NÃO NEGOCIÁVEL)

Você **NÃO DEVE**:

- ❌ mudar cores existentes
- ❌ trocar fontes atuais
- ❌ alterar layout estrutural
- ❌ criar novas páginas
- ❌ remover componentes existentes
- ❌ refatorar arquitetura
- ❌ mudar spacing scale global
- ❌ alterar tokens principais do design system
- ❌ transformar o blog inteiro em landing page
- ❌ FAZER COMMIT ATÉ QUE TUDO ESTEJA APLICADO. ASSIM DESFAZEMOS TUDO DE UMA VEZ E PRECISARMOS.


Se alguma decisão exigir isso → **NÃO FAÇA**.

---

# 🧠 PRINCÍPIO CENTRAL DE COERÊNCIA (NOVO — CRÍTICO)

O projeto NÃO deve virar uma landing page.

Aplicar o princípio:

```
80% Editorial Neutro
20% Premium Authority
```

### Significado

O site continua sendo um **blog editorial técnico**.

Elementos premium aparecem apenas como:

- pontos de autoridade
- momentos de conversão
- destaques estratégicos

👉 Chamamos isso de **ILHAS DE DESTAQUE**.

---

# 🏝️ SISTEMA DE "ILHAS DE DESTAQUE" (OBRIGATÓRIO)

## Editorial (MAIOR PARTE DO SITE)

Deve permanecer:

- limpo
- leve
- silencioso
- focado em leitura

Componentes editoriais NÃO devem parecer landing page.

Exemplos:

- PostCard
- Listagem de artigos
- Sidebar informativa
- Conteúdo do artigo

Estilo esperado:

```
minimal
calmo
funcional
editorial
```

---

## Authority Zones (APENAS 20%)

Somente estes elementos podem receber estilo premium forte:

- seção de serviços
- CTA principal
- Hero inicial
- blocos de autoridade pessoal
- newsletter estratégica

Estilo esperado:

```
premium
elevado
confiante
produto/profissional
```

---

# 🧱 ETAPA 1 — NÃO ALTERAR COMPONENTES EXISTENTES

NUNCA modificar diretamente:

- PostCard
- SidebarWidget
- Header
- PageHero
- Pagination
- Layout base

---

## Criar WRAPPERS VISUAIS

Obrigatório criar wrappers:

```
PremiumSurface
PremiumSection
PremiumHeroWrapper
PremiumCardWrapper
AuthorityBlock
FeatureServiceWrapper
```

Eles apenas ENVOLVEM componentes.

Exemplo:

```tsx
<PremiumSurface>
  <PostCard />
</PremiumSurface>
```

---

# 🎨 ETAPA 2 — SISTEMA DE SUPERFÍCIES

Adicionar apenas novos tokens.

NÃO alterar tokens existentes.

Criar:

```
--surface-glass
--surface-soft
--surface-elevated
--surface-authority
--shadow-soft
--shadow-float
```

Aplicação:

- transparência leve
- backdrop blur sutil
- bordas suaves
- sombras difusas

Objetivo:

👉 criar profundidade SEM mudar cores.

---

# 🌫️ ETAPA 3 — ATMOSFERA GLOBAL

Adicionar atmosfera premium invisível.

Implementar:

- gradients radiais extremamente sutis
- iluminação ambiente leve
- opacidade baixa

Regra:

O usuário NÃO deve perceber conscientemente.

---

# 🧾 ETAPA 4 — HIERARQUIA TIPOGRÁFICA

NÃO trocar fontes.

Apenas:

- aumentar escala do Hero
- tracking negativo leve em títulos
- melhor contraste hierárquico

Objetivo:

👉 títulos viram elementos de marca.

---

# 🪟 ETAPA 5 — HEADER PREMIUM

Converter header atual em:

- sticky
- glassmorphism leve
- backdrop blur
- transparência controlada

SEM alterar navegação.

---

# 🧱 ETAPA 6 — DEPTH SYSTEM

Criar níveis visuais:

```
depth-1 → conteúdo editorial
depth-2 → cards normais
depth-3 → sidebar widgets
depth-4 → authority blocks
depth-5 → hero/cta principal
```

Aplicar apenas via classes adicionais.

---

# ⭐ ETAPA 7 — WIDGETS DE SERVIÇO (AJUSTE CRÍTICO)

Os widgets de serviço DEVEM seguir o estilo premium_personal.

MAS:

👉 **somente eles** terão esse destaque.

Eles funcionam como **feature blocks profissionais**.

### Características obrigatórias

- superfície elevada
- mais espaço interno
- tipografia forte
- aparência de produto/consultoria
- maior peso visual que posts

---

## Exemplo de Estrutura

```tsx
<AuthorityBlock>
  <FeatureServiceWrapper>
    <ServiceCard />
  </FeatureServiceWrapper>
</AuthorityBlock>
```

---

## Exemplo Visual Esperado

Serviços devem parecer:

- seção de especialista
- portfólio premium
- oferta profissional clara

E NÃO:

- card de blog
- widget comum
- lista simples

---

# 🚫 REGRA CRÍTICA DE COERÊNCIA

NÃO aplicar estilo premium em:

- todos os cards
- todos widgets
- todos blocos

Se tudo for premium → nada é premium.

---

# 🧪 ETAPA 8 — INTERAÇÕES PERMITIDAS

Permitido:

- hover lift pequeno
- sombra progressiva
- transitions suaves

Proibido:

- animações chamativas
- motion complexo
- efeitos exagerados

Design deve parecer:

```
calmo
seguro
profissional
```

---

# 📐 ETAPA 9 — LAYOUT (NÃO ALTERAR)

Estrutura obrigatória:

```
Header
Hero
Content Grid
Sidebar
Authority Block (Serviços)
CTA
Footer
```

Você NÃO pode:

- mover sidebar
- mudar grid
- alterar breakpoints
- redesenhar páginas

---

# 🧩 ETAPA 10 — EXEMPLOS DE IMPLEMENTAÇÃO

## Wrapper Editorial

```tsx
export function PremiumSurface({ children }) {
  return (
    <div className="
      rounded-3xl
      border
      backdrop-blur
      shadow-sm
      bg-surface-soft
    ">
      {children}
    </div>
  );
}
```

---

## Authority Service Block

```tsx
export function AuthorityBlock({ children }) {
  return (
    <section className="
      relative
      py-20
      rounded-[32px]
      shadow-float
      bg-surface-authority
    ">
      {children}
    </section>
  );
}
```

---

## Service Card Premium

```tsx
<div className="
  p-10
  rounded-3xl
  transition
  hover:-translate-y-1
  hover:shadow-xl
">
```

---

# 🧪 ETAPA 11 — IMPLEMENTAÇÃO SEGURA


# 🎯 RESULTADO ESPERADO

O usuário deve sentir:

- o site parece mais caro
- autoridade aumentou
- leitura continua confortável
- serviços parecem profissionais
- o blog NÃO virou landing page

---

# 🚫 ERROS QUE VOCÊ NÃO DEVE COMETER

- Não modernizar mudando cores
- Não aplicar premium em tudo
- Não competir com o conteúdo
- Não exagerar efeitos
- Não parecer template SaaS

---

# ✅ DEFINIÇÃO FINAL DA TAREFA

Aplicar uma **camada premium invisível** sobre o design existente usando o princípio:

```
Ilhas de Destaque
+
Editorial Neutro
=
Plataforma Premium Coerente
```

Resumo mental obrigatório:

```
NÃO redesenhar.
NÃO reinventar.
APENAS elevar.
```

Execute exatamente conforme especificado.
````
