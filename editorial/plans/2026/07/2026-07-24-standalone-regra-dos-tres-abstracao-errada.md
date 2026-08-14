---
id: POST-PLAN-2026-023
schema_version: "1.0"
title: "Dois Cards Que Parecem Gêmeos — e Por Que Não Deveriam Virar Um Componente Só"
created_at: 2026-07-24
updated_at: 2026-07-24
status: idea
channels: []
source_skill: post-planejamento
planned_publication:
published_at:
canonical_content:
related_case:
related_work_items: []
tags: []
contains_sensitive_content: false
---

<!-- Migrado de projects/publishing-content/postagens/23-standalone-regra-dos-tres-abstracao-errada.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "Dois Cards Que Parecem Gêmeos — e Por Que Não Deveriam Virar Um Componente Só"

## Títulos alternativos
- "A Regra dos Três: Por Que Esperei o Terceiro Card Parecido Para Considerar Extrair um Componente"
- "Duplicação é Mais Barata que a Abstração Errada — Um Caso Real, Não Uma Citação Solta"
- "Mesma Forma, Papéis Diferentes: Quando Não Vale a Pena Unificar Dois Componentes React"

## Por que este post é diferente dos demais

Não nasce de bug nem de auditoria estruturada — nasce de uma pergunta direta feita no meio de uma sessão normal de trabalho, logo depois de uma implementação concluída: "os cards da seção X usam componente reutilizável? Se não, seria conveniente usar?" A pergunta parecia ter resposta óbvia ("sim, sempre reaproveite"), mas a investigação revelou o oposto: dois cards do próprio blog, que agora usam a mesma técnica de grid (mosaico de 12 colunas com `span` variável, uma copiada da outra na mesma sessão), têm papéis semânticos diferentes o suficiente para que uma extração forçada fosse a decisão errada. Post irmão de tema com o #20 (mesma tensão: consistência garantida por ferramenta vs. por critério humano) e com o #22 (uma pergunta simples que expõe um princípio de arquitetura maior) — mas aqui o objeto é composição de componentes React, não CSS ou processo de revisão.

## Tese central

Dois cards visualmente quase idênticos — número, título, texto, num grid não-linear de larguras variáveis — não implicam automaticamente que devam compartilhar um componente. O teste que decide não é "esses dois se parecem?", é "se eu mudar o design de um, o outro deveria mudar junto, porque representam o mesmo conceito?" Três referências consolidadas da engenharia de software (regra dos três, AHA — Avoid Hasty Abstraction, e "a abstração errada" de Sandi Metz) convergem no mesmo veredito: forçar uma abstração comum quando a resposta é não produz um componente com props condicionais demais — mais caro de entender e manter do que duas implementações pequenas e separadas. O post prova isso com o contraponto real do próprio projeto: um componente (`FeatureCard.tsx`) que *foi* extraído com sucesso, porque ali sim havia o mesmo papel repetido em dois lugares reais, não apenas uma forma parecida.

## Por que importa

1. **DRY ("Don't Repeat Yourself") costuma ser ensinado como valor absoluto — "veja duas coisas parecidas, una-as"** — sem o contrapeso de que uma abstração errada custa mais caro no longo prazo do que a duplicação que ela tentou eliminar.
2. **A maioria do conteúdo sobre esse tema fica na teoria** ("evite duplicação", "componentize sempre"). Este post mostra o caso oposto acontecendo dentro de um projeto real — os dois componentes existem de fato, no mesmo repositório, e o "componente unificado" foi avaliado e descartado antes de ser escrito, com o raciocínio completo preservado.
3. **Existe, no mesmo projeto, um precedente real em que a extração foi a decisão certa** (`FeatureCard.tsx`, reaproveitado em `/servicos` e na Home) — o post ganha força mostrando os dois lados da mesma decisão lado a lado, não só o lado "não extraia".

## Linha do tempo real

1. **Sintoma:** depois de implementar o roadmap de "Próximas Etapas" (10 cards, `/o-projeto`), o Marcelo pediu pra "avaliar como são distribuídos os cards da seção 'Como Pensamos'" e recriar o roadmap "usando o mesmo estilo não-linear".
2. **Tentativa 1 (interpretação errada):** entendi "não-linear" como a numeração dupla que o roadmap já tinha (`P-01`..`P-08` pra "Planejado", `F-01`/`F-02` pra "Futuro" — duas sequências independentes em vez de uma única 1-10). Apliquei só isso: grid uniforme de 3 colunas mantido, apenas a numeração e o estilo tracejado dos cards "Futuro" mudaram.
3. **O que essa tentativa não resolveu:** o Marcelo perguntou diretamente, na sessão seguinte, "esse [roadmap] também é o caso dos cards da seção 'Como Pensamos' da página sobre?" — pergunta que só fazia sentido se a primeira tentativa não tivesse de fato replicado o padrão daquela seção.
4. **Causa real:** ao investigar `sobre.css`/`sobre/page.tsx`, ficou claro que "Como Pensamos" usa um grid mosaico de 12 colunas com `grid-column: span N` variável por card (4+4+4, depois 7+5) — um padrão genuinamente não-linear (larguras diferentes), não só uma numeração em duas sequências. A "tentativa 1" tinha resolvido um "não-linear" fraco (ordem/numeração), não o real (geometria do grid).
5. **Correção final:** recriei o roadmap com o mesmo grid de 12 colunas e `span` variável por card (distribuído em 4 linhas: 4+5+3, 5+4+3, 4+8, 6+6), mantendo o tema claro da seção original (sem copiar o tema escuro de "Como Pensamos", que seria uma mudança visual maior e não pedida).

## Storytelling sugerido

**Primeiro movimento — a pergunta que parecia ter resposta óbvia.** Abrir com a cena real: depois de recriar a seção "Próximas Etapas" do `/o-projeto` como um mosaico de spans (a pedido do Marcelo, copiando deliberadamente a técnica de grid da seção "Como Pensamos" do `/sobre`), surge a pergunta natural — "esses cards usam um componente reutilizável? Se não, não seria melhor usar?" A resposta instintiva de quem segue boas práticas por reflexo seria "sim, sempre". A resposta real, depois de olhar o código dos dois, foi não.

**Segundo movimento — os dois cards, lado a lado.** Descrever a semelhança real: ambos usam `display:grid; grid-template-columns: repeat(12,1fr)` com `grid-column: span N` variável por item — mesmo truque de CSS, funcionando de forma idêntica nos dois lugares. Mas o conteúdo de cada card diverge: "Como Pensamos" tem ícone (`IconTile`) e tema escuro translúcido, sem número sequencial de status nem rodapé de data; "Próximas Etapas" tem número (`P-01`/`F-01`) + pill de status (`Planejado`/`Futuro`) + rodapé com previsão de trimestre, tema claro, sem ícone algum.

**Terceiro movimento — o que aconteceria se unificasse mesmo assim.** Simular, no texto, a interface de props que um componente `MosaicCard` unificado exigiria: `icon?`, `variant: 'dark' | 'light'`, `status?`, `statusLabel?`, `foot?`, `span`. Metade das props de qualquer instância ficaria `undefined`, e o componente precisaria de lógica condicional pra decidir o que renderizar em cada tema — o sintoma clássico do que Sandi Metz chama de "abstração errada": uma peça de código que serve dois propósitos tende a acumular ramificações até ficar mais difícil de entender do que as duas implementações separadas seriam.

**Quarto movimento — o teste que decide, com as três referências.** Apresentar a regra dos três (Fowler/folclore de refatoração: na 1ª ocorrência escreva direto, na 2ª tolere, só na 3ª extraia), AHA (Kent C. Dodds: prefira duplicação a abstração prematura) e "a abstração errada" (Sandi Metz: duplicação é mais barata que a abstração errada) como o filtro que resolve a pergunta — nenhuma delas nega o valor de reaproveitar código, todas apontam pro mesmo ponto: reaproveite quando o papel é o mesmo, não quando a forma é parecida.

**Quinto movimento — o contraponto que prova a regra.** Trazer `FeatureCard.tsx`: um card de ícone + título + texto + rodapé, hoje usado em `/servicos` e na Home, com um comentário no topo do próprio arquivo explicando que ele nasceu de três lugares que tinham exatamente o mesmo papel (card de pilar/serviço), não de uma coincidência visual. É a prova de que a extração é bem-vinda — só não é automática.

**Fechamento — o padrão generalizável.** A regra que resolve os dois casos ("Como Pensamos" vs. "Próximas Etapas", e o precedente do `FeatureCard`) não é "sempre reaproveite" nem "nunca reaproveite" — é perguntar, a cada semelhança encontrada, qual conceito de domínio aquele componente representa, antes de perguntar qual forma ele tem na tela.

## Provas e exemplos reais

- **`frontend/app/sobre/sobre.css`** (seção "Como Pensamos", `.sobre-modules-grid`/`.sobre-module`) — grid de 12 colunas, 5 módulos com `span` variável (4+4+4 na primeira linha, 7+5 na segunda), tema escuro (`background: linear-gradient(160deg, rgba(255,255,255,.065), rgba(255,255,255,.02))`), ícone via `IconTile`, sem número sequencial de status nem rodapé de data.
- **`frontend/app/o-projeto/o-projeto.css` + `page.tsx`** (seção "Próximas Etapas", `.op-roadmap-grid`/`.op-rm-card`) — mesmo padrão de grid de 12 colunas com `span` variável, recriado na mesma sessão a partir do modelo de "Como Pensamos" (a pedido explícito do Marcelo, depois de eu ter aplicado só a numeração dupla P-xx/F-xx como "não-linear" na primeira tentativa — a correção de rumo faz parte do material real do post). 10 cards distribuídos em spans que somam 12 por linha (ex.: 4+5+3; 5+4+3; 4+8; 6+6), tema claro, número + pill de status (`op-s-planned`/`op-s-future`) + rodapé de previsão de trimestre, sem ícone.
- **`frontend/components/ui/FeatureCard.tsx`** — o comentário de topo do arquivo é a prova documental do critério correto: "mesmo padrão hoje duplicado em `frontend/app/servicos/servicos.css` (`.svc-card`) e `frontend/app/home.css` (`.ih-pillar-card`). Único ponto de verdade para esse formato" — extraído por reuso real de um mesmo papel em 2+ lugares, não por parecença visual isolada.
- **Regra já formalizada no `CLAUDE.md`** (seção "CSS Modules vs. CSS global") resolvendo uma tensão irmã com o mesmo espírito: não migrar/unificar retroativamente sem gatilho real de reuso, e citando explicitamente o custo de reescrever seletores que já funcionam.

## Trechos de código reais para ilustrar o post

**1. A mesma técnica de grid, nos dois arquivos — prova de que a semelhança visual é real, não impressão:**

```css
/* frontend/app/sobre/sobre.css — "Como Pensamos" */
.sobre-modules-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gap-grid);
}
```

```css
/* frontend/app/o-projeto/o-projeto.css — "Próximas Etapas" (aplicado nesta mesma sessão) */
.op-roadmap-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--sp-5);
}
```

**2. O mesmo padrão de `span` variável por item, em JSX, nos dois lugares:**

```tsx
// frontend/app/sobre/page.tsx — módulos de "Como Pensamos"
const MODULES = [
  { num: '01', icon: faMagnifyingGlass, title: 'Entendemos', span: 4, /* ... */ },
  { num: '04', icon: faCubes, title: 'Construímos', span: 7, /* ... */ },
  { num: '05', icon: faArrowTrendUp, title: 'Evoluímos', span: 5, /* ... */ },
];

{MODULES.map((m) => (
  <div className="sobre-module" style={{ gridColumn: `span ${m.span}` }} key={m.num}>
    {/* ícone, número, título, texto — sem status, sem data */}
  </div>
))}
```

```tsx
// frontend/app/o-projeto/page.tsx — cards de "Próximas Etapas"
const ROADMAP = [
  { num: 'P-01', status: 'planned', statusLabel: 'Planejado', title: 'Google Analytics', span: 4, /* ... */ },
  { num: 'P-08', status: 'planned', statusLabel: 'Planejado', title: 'Nutrição automatizada de leads', span: 8, /* ... */ },
];

{ROADMAP.map((item) => (
  <div className={`op-rm-card op-${item.status}`} style={{ gridColumn: `span ${item.span}` }} key={item.num}>
    {/* número, pill de status, título, texto, rodapé de data — sem ícone */}
  </div>
))}
```

**3. O que um componente unificado seria obrigado a virar — simulação, não código real, mas útil pra ilustrar o custo:**

```tsx
// Hipotético — o preço de unificar sem que o papel seja o mesmo
interface MosaicCardProps {
  span: number;
  icon?: ReactNode;          // usado só por "Como Pensamos"
  variant?: 'dark' | 'light'; // muda cor de fundo, cor de texto, borda
  status?: string;            // usado só por "Próximas Etapas"
  statusLabel?: string;
  foot?: ReactNode;           // idem
  num: string;
  title: string;
  text: string;
}
```

Cinco das oito props ficariam `undefined` em qualquer uma das duas instâncias reais — o sinal de que a "generalização" está servindo dois papéis, não um.

**4. O contraponto — o comentário real que documenta por que `FeatureCard.tsx` foi extraído (reuso genuíno, não parecença):**

```tsx
/* frontend/components/ui/FeatureCard.tsx
   Card de ícone + título + texto + rodapé — mesmo padrão hoje duplicado em
   frontend/app/servicos/servicos.css (.svc-card) e frontend/app/home.css (.ih-pillar-card).
   Único ponto de verdade para esse formato: só tamanho (size) e conteúdo mudam por uso. */
```

## Conceitos a explicar

- **Regra dos três** (folclore de refatoração, formalizado em Martin Fowler, *Refactoring*, 1999): na 1ª ocorrência de um padrão, escreva direto; na 2ª, tolere a duplicação e observe; só na 3ª extraia — porque só com três exemplos reais fica claro o que de fato varia entre eles.
- **AHA — Avoid Hasty Abstraction** (Kent C. Dodds): prefira duplicação a uma abstração prematura; abstraia só quando o padrão se prova estável e repetido.
- **"A abstração errada"** (Sandi Metz, palestra/post "The Wrong Abstraction", 2016): "duplicação é far mais barata que a abstração errada" — uma abstração que serve dois propósitos diferentes tende a acumular condicionais e props especiais até ficar mais difícil de entender do que as duas implementações separadas seriam.
- **Papel semântico vs. forma visual**: o critério prático que decide o caso — dois componentes que parecem iguais no grid podem representar conceitos completamente diferentes do domínio (etapa de raciocínio vs. item de status de roadmap).
- **Prop opcional como sintoma**: quando uma interface de componente acumula props que só fazem sentido pra uma parte dos usos, é sinal de que a abstração está sendo forçada a cobrir dois papéis.

## Estrutura sugerida (H2s)

1. **A pergunta que parecia ter resposta óbvia**
   - "Esses cards usam componente reutilizável? Se não, não seria melhor usar?" — e por que a resposta instintiva ("sempre reaproveite") estava errada aqui
2. **Dois cards, mesma técnica de grid, papéis diferentes**
   - Mostrar "Como Pensamos" e "Próximas Etapas" lado a lado, com o CSS/JSX real dos dois
3. **O preço de unificar mesmo assim**
   - A interface de props que um componente comum exigiria, e por que isso é o sintoma da abstração errada
4. **O teste que decide: papel, não forma**
   - Regra dos três, AHA, "abstração errada" — as três referências, aplicadas ao caso real
5. **O contraponto: quando a extração é a decisão certa**
   - `FeatureCard.tsx`, extraído por reuso real de um mesmo papel em 2+ lugares — prova de que a resposta não é "nunca componentize"
6. **A decisão final e por que ela é world-class, não preguiça**
   - Manter os dois componentes separados é a aplicação correta da regra, não "não tive tempo de refatorar"

## Fecho / CTA

"A pergunta que valia a pena fazer não era 'esses dois cards se parecem?' — claro que sim, os dois usam o mesmo truque de CSS Grid, um copiado do outro de propósito na mesma sessão. A pergunta era: eles representam o mesmo conceito no meu domínio? Não representam — um é etapa de raciocínio, o outro é item de status de entrega. E é exatamente por isso que o padrão world-class aqui não é unificar tudo que se parece — é ter, no mesmo projeto, um exemplo real de quando a extração foi certa (`FeatureCard.tsx`) e um exemplo real de quando não foi, com o mesmo raciocínio aplicado às duas decisões."

## Fonte interna

- Descoberta original: sessão de 2026-07-24 do projeto `marcelo-goncalves-blog`, durante a implementação do roadmap de "Próximas Etapas" em `/o-projeto` (recriado como mosaico de spans a partir do modelo de "Como Pensamos" do `/sobre`) — pergunta direta do Marcelo logo após a implementação: "esses cards usam o componente reutilizável? Se não, seria conveniente usar?"
- Precedente de extração real citado: comentário de topo de `frontend/components/ui/FeatureCard.tsx`.
- Arquivos reais citados: `frontend/app/sobre/sobre.css`, `frontend/app/sobre/page.tsx`, `frontend/app/o-projeto/o-projeto.css`, `frontend/app/o-projeto/page.tsx`, `frontend/components/ui/FeatureCard.tsx`.
- Post irmão temático: `20-standalone-css-modules-vs-css-global.md` (mesma tensão — consistência garantida por ferramenta/convenção vs. por critério humano — em domínio diferente).

## Notas de escrita

- Mesmo perfil de `20-standalone-css-modules-vs-css-global.md` e `21-standalone-validacao-e-memoria-com-criterio.md`: post sobre decisão de processo/arquitetura, não sobre bug — nasce de uma pergunta direta do Marcelo durante uma sessão normal, não de auditoria estruturada.
- **Evitar abrir com a definição de DRY/regra dos três antes do gancho real** — mostrar os dois cards de verdade (com trecho de código) primeiro; a teoria entra para explicar a decisão, não para introduzi-la.
- **Não esconder a correção de rumo da própria sessão**: a primeira tentativa de aplicar um "estilo não-linear" ao roadmap foi só a numeração P-xx/F-xx; só depois de o Marcelo apontar a seção "Como Pensamos" como referência é que o mosaico de spans de verdade entrou em cena. Isso é bom material — mostra o processo real de calibrar uma instrução ambígua, não um acerto de primeira.
- Boa oportunidade para reforçar o mesmo tom de "decisão consciente que parece contraintuitiva de fora" (não extrair um componente quando a maioria dos guias de boas práticas diria "reaproveite sempre") — mesmo espírito do post #20.
