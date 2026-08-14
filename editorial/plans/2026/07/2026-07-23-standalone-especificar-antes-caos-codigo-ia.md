---
id: POST-PLAN-2026-022
schema_version: "1.0"
title: "Sopa de Letrinhas: um Framework Pra Impedir que Código Gerado por IA Vire Caótico"
created_at: 2026-07-23
updated_at: 2026-07-23
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

<!-- Migrado de projects/publishing-content/postagens/22-standalone-especificar-antes-caos-codigo-ia.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "Sopa de Letrinhas: um Framework Pra Impedir que Código Gerado por IA Vire Caótico"

## Títulos alternativos
- "O Contrato Que Falta: Especificar Antes, Testar Pra Falhar, Auditar Menos"
- "Regra de Papel, Não Regra de Sintaxe: um Framework Pra Evitar que Projetos com IA Virem Macarrônicos"
- "Sete Vezes Corrigindo a Mesma Coisa: o Sintoma de Não Ter Especificado Antes"

## Por que este post é diferente dos demais

Não nasce de uma auditoria estruturada (como os posts de critério) nem de uma única decisão de processo isolada (como o #20 e o #21) — nasce de um padrão que só ficou visível *durante* uma sessão de correção incremental: a mesma pergunta ("esse texto está pequeno") repetida sete vezes seguidas em cantos diferentes de uma única página, cada resposta certa isoladamente, e só no fechamento ficou claro que era o mesmo problema de fundo se manifestando em lugares diferentes porque nunca tinha sido especificado como regra checável. É o post mais "meta" e mais prescritivo da série até agora: não é sobre um bug nem sobre narrar uma auditoria já feita — é sobre desenhar, com exemplos reais, um conjunto de estratégias que qualquer projeto (com ou sem IA no processo) pode adotar **desde o primeiro commit** pra nunca precisar de uma auditoria desse tipo. Bom par temático com o #20 (mesma tensão: consistência garantida por ferramenta vs. por disciplina humana), mas aqui o objetivo é prescritivo, não só analítico.

## Tese central

Escala de valores (tokens) e lint que barra valor cru são necessários, mas resolvem só metade do problema: garantem *que* um valor da escala seja usado, nunca *qual* valor da escala cabe a cada papel do elemento (texto de leitura, link/CTA, decoração; espaçamento entre título e descrição vs. espaçamento entre seções). Sem uma segunda camada — uma regra explícita de "papel → valor mínimo/correto" que também seja verificável automaticamente — os dois tipos de token (tipografia e espaçamento) acabam sofrendo exatamente o mesmo tipo de erosão silenciosa, mesmo num projeto que já fez a parte "certa" (escala bem desenhada, lint configurado, rodando em CI). Esse é o argumento central do post: a estratégia madura não é "ter uma escala" nem "ter um lint" isoladamente — é uma pilha de quatro camadas, cada uma cobrindo o que a anterior deixa passar, com exemplos reais e concretos de cada camada faltando.

## Por que importa

1. **O custo de auditar cresce junto com o código, o custo de especificar não.** Escrever a regra "texto de leitura nunca abaixo de 16px" custa uma frase; auditar retroativamente sete elementos espalhados por uma página custa uma sessão inteira de investigação, achado por achado. Quanto mais tarde a regra é escrita, mais caro fica o processo de descobrir onde ela já foi violada.
2. **IA não tem memória de padrão entre prompts — só o projeto pode ter.** Um desenvolvedor sênior reconhece "já vi esse tipo de elemento, deveria seguir tal convenção" por acúmulo de experiência; uma IA (ou um dev júnior apoiado nela) resolve cada prompt isoladamente, "parece do tamanho certo", sem visão do conjunto. Sem uma regra explícita e checável, essa lacuna de memória vira dívida técnica cumulativa, silenciosa, e paga em auditorias repetidas.
3. **O mesmo defeito de projeto se repete em qualquer eixo que tenha uma escala e nada além dela.** Não é só tamanho de fonte — o mesmo problema apareceu, de forma independente, em espaçamento, no mesmo projeto, na mesma sessão. Isso é a prova de que o gap não é específico de tipografia: é estrutural a qualquer sistema de tokens sem uma segunda camada de regra semântica.

## Storytelling sugerido

Abrir pela cena real, no presente: uma pergunta de usabilidade simples — "o H3 dos cards está pequeno no celular" — vira uma investigação que, no fim, precisou de sete rodadas separadas na mesma página (H3 dos cards, texto de leitura dos cards, bullets dos cards de pilar, título e descrição da timeline de processo, link "Saiba mais", links de navegação do rodapé, frases de CTA do rodapé) antes de estabilizar. Cada rodada, isoladamente, foi rápida e correta — o problema nunca foi a dificuldade técnica de subir um `font-size`, foi a ausência de uma resposta única, aplicada de uma vez, pra pergunta "qual é o tamanho mínimo aceitável pra cada *tipo* de texto neste projeto".

Segundo movimento: mostrar que o projeto já tinha uma parte real da solução madura — uma escala de 11 tokens de tipografia bem desenhada, `clamp()` fluido, e um lint (Stylelint, plugin `stylelint-declaration-strict-value`) que bloqueia qualquer valor de fonte fora da escala, rodando em CI a cada push. Isso não é o vilão da história — é a **primeira camada**, e ela funciona: nenhum dos sete achados era um valor cru "por fora" da escala, todos eram tokens válidos, só no papel errado. É esse detalhe que abre a virada do post: enforcement de sintaxe (valor está na lista permitida) é necessário e já elimina uma classe inteira de problema (valor arbitrário, "-1.5px de ajuste fino"), mas sozinho não basta — falta a camada de cima, enforcement de semântica (o valor certo da lista pro papel certo do elemento).

Terceiro movimento: generalizar com um segundo exemplo real e independente, pra provar que isso não é peculiaridade de tipografia. O mesmo projeto tem uma segunda escala de tokens, de espaçamento (`--sp-1` a `--sp-13`, mais aliases semânticos como `--eyebrow-gap`/`--title-gap`), com o mesmo tipo de lint aplicado. E o mesmo padrão apareceu ali: o espaçamento entre "eyebrow/título" e "descrição de seção" foi implementado com três valores diferentes em três lugares da mesma página (`--eyebrow-gap`, 14px; `--sp-4`, 16px; `--sp-6`, 24px) — e nenhum dos três é o token cujo próprio nome e comentário no código dizem "é pra isso" (`--title-gap`, 10px, com o comentário `/* título → descrição */`, que não é usado em nenhum dos três lugares). É a mesma doença, em outro órgão: a escala existe, o token certo até existe e está documentado, e ainda assim três implementações divergentes coexistiram sem que o lint acusasse nada — porque, de novo, sintaxe (token válido) não é semântica (token certo).

Quarto movimento: por que isso tende a piorar, especificamente, em projetos liderados por quem não tem histórico prévio de engenharia. Um dev sênior tem o hábito quase reflexo de perguntar "isso já existe em algum lugar, com o nome certo pra isso?" antes de escrever de novo — é pattern-matching construído por anos vendo código dar errado por falta disso. Sem essa referência, a régua vira "funciona? parece certo?" — e IA é extraordinariamente boa em produzir código que passa nesse teste isoladamente e, mesmo assim, acumula dívida no conjunto. O risco real não é a IA escrever código ruim linha a linha — é ninguém, nem o operador humano nem a IA, ter o hábito de perguntar pelo padrão antes de escrever de novo, porque a velocidade de geração deixou de ser o fator que naturalmente forçava essa pausa.

Quinto movimento (o núcleo prescritivo do post): apresentar a pilha de quatro estratégias, cada uma como resposta a uma lacuna específica das anteriores — não como lista solta, como camadas que se completam:
1. **Escala de tokens** (o vocabulário) — sem isso, não há nem valor comparável entre elementos.
2. **Lint sintático** (tipo Stylelint `declaration-strict-value`) — impede valor cru, força todo mundo a passar pela escala. É necessário, mas — como os dois exemplos reais provam — não é suficiente sozinho.
3. **Mapa de papel semântico documentado** ("texto de leitura → mínimo tal token"; "espaçamento título→descrição → exatamente este token, nunca outro") — a peça que faltava nos dois exemplos, e que precisa existir como tabela curta, ao lado da escala, não espalhada em comentário de token individual.
4. **Teste que verifica o papel, não só o valor** — a camada mais madura, e a que fecha o ciclo: um teste que mede `computed style` de elementos reais numa página real, e falha se o valor renderizado ficar abaixo do piso do papel — independente de qual token CSS foi usado pra chegar lá. Essa camada é o que transforma "documentação que pode ser esquecida" em "regra que sobrevive a quem escreveu o código original".

Sexto movimento: essa camada 4 não ficou hipotética — foi construída e testada de verdade, na mesma sessão, como prova de conceito. Um arquivo Playwright novo (`frontend/e2e/typography-role.spec.ts`) mede o `font-size` computado de 10 elementos reais da Home/Footer em viewport mobile (375px) contra o piso de cada papel — 16px pra texto de leitura, 14px pra link/CTA, 20px pra título de card. Rodado contra o código corrigido: 10/10 passa. Pra provar que o teste de fato pega regressão (não só "parece que funciona"), a validação foi deliberada: reverter `.ih-pillar-more` de volta pro token errado (`--type-caption`) e rodar de novo — o teste falha, apontando o número exato (`Expected: >= 14, Received: 12.64`). Revertido em seguida, confirmado que o código voltou ao estado correto. Essa é a diferença entre "escrevi um teste" e "sei que o teste funciona": ele foi provado nos dois sentidos, passa quando está certo, falha quando não está.

Sétimo movimento (a ressalva honesta, não esconder): esse teste roda localmente, sob demanda — ele **não está no pipeline de CI** do projeto ainda, porque o projeto tem uma decisão deliberada anterior de manter testes E2E fora do CI automático (só os testes unitários — Jest — e o lint rodam em todo push). Isso é material real pro post, não uma falha a esconder: mesmo tendo construído a camada 4, ela só "falha o build sozinha" de fato quando alguém decide colocá-la no caminho do CI — a diferença entre "existe um teste" e "o teste é impossível de ignorar" é uma decisão de pipeline separada da decisão de escrever o teste.

Fechar generalizando: as quatro camadas não são específicas de CSS — a mesma pilha (vocabulário → lint sintático → mapa semântico → teste de papel) se aplica a nomenclatura de API, formato de log, tratamento de erro, qualquer convenção de projeto que hoje só existe como prosa. É o rascunho do framework que este post inaugura.

## Provas e exemplos reais

- **Escala de tokens de tipografia, já bem desenhada:** 11 níveis em `frontend/app/globals.css`, de `--type-caption` (12.6px mobile) a `--type-display-lg` (41px mobile), `clamp()` fluido, todos documentados por comentário.
- **Escala de tokens de espaçamento, já bem desenhada:** `--sp-1` a `--sp-13` (base 4px) mais aliases semânticos (`--eyebrow-gap: 14px /* eyebrow → título */`, `--title-gap: 10px /* título → descrição */`).
- **Lint sintático já implementado, real, rodando em CI:** Stylelint com o plugin `stylelint-declaration-strict-value` (`frontend/.stylelintrc.json`), que barra `font-size`/`margin`/`padding`/`gap` fora dos tokens — parte real e válida da estratégia, não um contraexemplo.
- **Sete achados de tipografia na mesma página (`frontend/app/page.tsx` + CSS relacionado):**
  - `.ih-pillar-card h3` (título de card de pilar): `--type-body` (18px) → `--type-lead` (20.25px)
  - `.ih-case-text h3` (título de card de resultado): `--type-body-sm` (16px) → `--type-lead` (20.25px)
  - `.ih-pillar-card > p` / `.ih-case-text p` / `.ih-mc-text` (parágrafos de leitura): `--type-label` (14.2px) → `--type-body-sm` (16px)
  - `.ih-pillar-bullets li` (bullets de card): `--type-caption` (12.6px) → `--type-label` (14.2px)
  - `.steps-timeline-title` / `.steps-timeline-desc` (timeline de processo): ajustados para `--type-body-sm`/`--type-label` respectivamente
  - `.ih-pillar-more` ("Saiba mais →", CTA de card): `--type-caption` (12.6px) → `--type-label` (14.2px)
  - `.foot-col ul li a` / `.foot-brand p` / `.foot-col-lead` (rodapé — links de navegação e CTA textual): `--type-caption` (12.6px) → `--type-label` (14.2px)
- **Um achado de espaçamento, mesma causa raiz — três tokens diferentes pro mesmo papel "eyebrow/título → descrição de seção", corrigido em dois passos distintos na mesma sessão (ótimo material pro post, mostra o processo completo, não só o resultado):**
  - Estado original: `.sec-desc` (globals.css, base compartilhada por 5 páginas) usava `--sp-6` (24px); `.ih-center-desc` (home.css, Serviços) usava `--eyebrow-gap` (14px — token de papel *diferente*, "eyebrow → título", reaproveitado só por coincidência de valor); `.ih-results-desc` (home.css, Resultados) usava `--sp-4` (16px). Nenhum usava `--title-gap` (10px), o token cujo comentário no código diz literalmente `/* título → descrição */`.
  - **Passo 1 — correção estrutural com zero mudança visual:** antes de decidir um valor único, medimos `computed style` (`marginTop`, `getBoundingClientRect`) dos 3 elementos, adicionamos só comentários explicando a divergência e referenciando `CLAUDE.md` §5, remedimos — números idênticos, prova de que nenhum pixel mudou. Separar "documentar o problema" de "decidir a correção" é o que evita alterar layout "sem querer" só de tentar organizar o código.
  - **Passo 2 — decisão de design explícita, feita pelo Marcelo, não pela IA sozinha:** convergir os 3 pro valor do meio (`--sp-4`, 16px) — `.sec-desc` foi de 24px→16px (impacto em 5 páginas), `.ih-center-desc` de 14px→16px. Validado com medição antes/depois nas 5 páginas + checagem de overflow horizontal (0px em todas).
- **DRY encontrado no mesmo processo, mesma causa raiz (ausência de regra explícita, não de ferramenta):** `.ih-results-t`/`.ih-results-desc` reimplementavam do zero o que `.sec-t`/`.sec-desc` já faziam, só pra trocar a cor de fundo claro pra escuro; `.ih-pillar-tags span`/`.ih-case-tags span` duplicavam a estrutura inteira de "tag/pill" por igual razão. Resolvido com modificadores (`.sec-t--onDark`, `.sec-desc--onDark`) em vez de classes paralelas.
- **Commit real da correção de tipografia:** `311e522`, branch `develop`, 6 arquivos (`globals.css`, `home.css`, `page.tsx`, `Footer.css`, `PostCard.css`, `StepsTimeline.css`).
- **Tabela "papel → token mínimo" (camada 3), documentada de verdade:** adicionada a `CLAUDE.md` §5 na mesma sessão — 4 papéis (leitura, link/CTA, título de card, metadado) com o piso de cada um, mais o achado de espaçamento registrado como exemplo vivo dentro da própria tabela, pra não ser esquecido.
- **Camada 4 (teste automatizado), implementada e validada de verdade, não só descrita:** `frontend/e2e/typography-role.spec.ts`, novo. 10 checagens de `computed font-size` em viewport 375px contra o piso de cada papel. Resultado com o código correto: `10 passed (29.8s)`. Validação de regressão controlada: `.ih-pillar-more` revertido pro token errado (`--type-caption`), teste rodado de novo, falha real capturada: `Expected: >= 14 / Received: 12.64`. Revertido em seguida.
- **Ressalva real sobre a camada 4:** o teste roda localmente (`npx playwright test e2e/typography-role.spec.ts`), mas não está no pipeline de CI do projeto — decisão anterior e deliberada de manter E2E fora do CI automático (só Jest + lint rodam em todo push, ver `.github/workflows/deploy.yml`). "Escrever o teste" e "tornar o teste impossível de ignorar" são duas decisões separadas.
- **Camada 4 estendida pro eixo de espaçamento, mesmo padrão de prova:** `frontend/e2e/spacing-role.spec.ts`, novo. 6 checagens de `margin-top` computado — `.sec-desc` em 5 páginas + `.ih-center-desc`/`.ih-results-desc` na Home, todos esperando `16px`. Código correto: `6 passed (12.3s)`. Regressão forçada (`.ih-center-desc` revertido pro `--eyebrow-gap`): falha real capturada, `Expected: "16px" / Received: "14px"`. Revertido em seguida, `git diff` confirmou o estado final correto.

## Trechos de código reais para ilustrar o post

Material pronto pra embutir como blocos de código no texto final — cada um é um exemplo concreto, não uma reconstrução hipotética.

**1. O mesmo papel (título de card), três tamanhos diferentes, na mesma página, sem nenhuma decisão registrada explicando a diferença:**

```css
/* frontend/app/home.css — ANTES (mesma página, 3 valores pro mesmo papel) */
.ih-pillar-card h3   { font-size: var(--type-body); }     /* 18px mobile */
.ih-case-text h3     { font-size: var(--type-body-sm); }  /* 16px mobile */
.ih-mc-title          { font-size: var(--type-h4); }       /* 22.8px desktop, --type-lead (20.25px) só no mobile via media query */
```

```css
/* DEPOIS — os 3 unificados no mesmo token, mesmo papel */
.ih-pillar-card h3   { font-size: var(--type-lead); }  /* 20.25px mobile */
.ih-case-text h3     { font-size: var(--type-lead); }  /* 20.25px mobile */
```

**2. Texto de leitura corrida no menor token da escala — o Stylelint aprovava, porque `--type-label` é um token válido; só não é o token certo pra um parágrafo:**

```css
/* frontend/app/home.css — ANTES */
.ih-case-text p {
  font-size: var(--type-label); /* 14.2px mobile — abaixo do piso de leitura recomendado (16px) */
  line-height: 1.65;
  color: rgba(250, 248, 243, .66);
}
```

```css
/* DEPOIS */
.ih-case-text p {
  font-size: var(--type-body-sm); /* 16px mobile */
  line-height: 1.65;
  color: rgba(250, 248, 243, .66);
}
```

**3. O mesmo problema, em espaçamento — três tokens diferentes pro mesmo papel, o token "certo" documentado no código e nunca usado (exemplo ainda não corrigido, ótimo pra mostrar que a doença é real e persistente, não um caso isolado já resolvido):**

```css
/* globals.css — o token que existe pra este papel exato, e não é usado por nenhum dos 3 abaixo */
--title-gap: 10px;  /* título → descrição */

/* globals.css — .sec-desc, base compartilhada */
.sec-desc { margin-top: var(--sp-6); }        /* 24px */

/* home.css — Serviços */
.ih-center-desc { margin: var(--eyebrow-gap) auto 0; }  /* 14px — --eyebrow-gap é "eyebrow → título", não "título → descrição" */

/* home.css — Resultados */
.ih-results-desc { margin: var(--sp-4) auto 0; }        /* 16px */
```

Três valores (24px, 14px, 16px) pro mesmo papel visual, numa mesma página, e o token que o próprio código já documenta como correto pra esse papel (`--title-gap`, 10px) não é usado em nenhum dos três. O Stylelint aprova os três — todos são tokens válidos.

**4. DRY: a mesma regra de "título de seção" reescrita do zero só pra trocar a cor de fundo claro pra escuro — sintoma da mesma causa raiz (nenhuma regra explícita de "isso já existe, reaproveite"):**

```css
/* globals.css — já existia */
.sec-t {
  font-weight: 800;
  font-size: var(--type-h3);
  letter-spacing: -.035em;
  color: var(--ink);
}

/* home.css — ANTES: reimplementado do zero, só pra trocar a cor */
.ih-results-t {
  font-weight: 800;
  font-size: var(--type-h3);
  letter-spacing: -.03em;
  color: #fff;
  margin: 0;
}
```

```css
/* DEPOIS — modificador em cima da classe existente, zero duplicação de valor */
/* globals.css */
.sec-t--onDark { color: #fff; }

/* home.css */
.ih-results-t { margin: 0; }
```

```tsx
// page.tsx — a composição de classes que substitui a classe paralela
<h2 className="sec-t sec-t--onDark ih-results-t">Resultado que aparece na <em>fatura</em></h2>
```

**5. A estratégia real, já parcialmente implementada — a camada 2 (lint sintático) da pilha de quatro:**

```json
// .stylelintrc.json — plugin já instalado, já rodando em CI
{
  "plugins": ["stylelint-declaration-strict-value"],
  "rules": {
    "scale-unlimited/declaration-strict-value": [
      ["font-size", "margin", "padding", "gap"],
      { "ignoreValues": ["0", "auto", "inherit", "..."] }
    ]
  }
}
```

Essa regra barra `font-size: 14px` (valor cru) — é a camada 2 da pilha, e funciona bem pro que se propõe. Ela **não** barra `font-size: var(--type-label)` num parágrafo de leitura, nem `margin: var(--eyebrow-gap)` num lugar que deveria usar `--title-gap` — porque, sintaticamente, os dois são tokens válidos. É exatamente o degrau que as camadas 3 (mapa de papel documentado) e 4 (teste que verifica o papel, não só o valor) precisam cobrir.

**6. A camada 4, implementada de verdade — teste real, não pseudocódigo:**

```ts
// frontend/e2e/typography-role.spec.ts (trecho)
const MOBILE_VIEWPORT = { width: 375, height: 812 };

const HOME_CHECKS: RoleCheck[] = [
  { role: 'texto de leitura', selector: '.ih-pillar-card > p', minPx: 16 },
  { role: 'texto de leitura', selector: '.ih-case-text p', minPx: 16 },
  { role: 'link/CTA interativo', selector: '.ih-pillar-more', minPx: 14 },
  { role: 'título de card', selector: '.ih-pillar-card h3', minPx: 20 },
  // ...
];

for (const check of HOME_CHECKS) {
  test(`${check.role}: "${check.selector}" >= ${check.minPx}px`, async ({ page }) => {
    const locator = page.locator(check.selector).first();
    const fontSize = await locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(check.minPx);
  });
}
```

**7. A prova de que o teste pega regressão de verdade — não só "compila e roda":**

```
# Código correto (10 checagens, Home + Footer + PostCard):
10 passed (29.8s)

# .ih-pillar-more revertido de propósito pro token errado (--type-caption):
1) [chromium] › link/CTA interativo: ".ih-pillar-more" >= 14px

   Error: expect(received).toBeGreaterThanOrEqual(expected)
   Expected: >= 14
   Received:    12.64

1 failed
```

O post ganha muito mostrando os dois blocos lado a lado — é a diferença entre "eu escrevi um teste" (afirmação) e "eu sei que o teste funciona, porque o vi falhar do jeito certo" (prova).

## Conceitos a explicar

- **Token de design vs. uso semântico do token**: ter uma escala de valores não é o mesmo que ter uma regra de qual valor cabe a qual papel — a escala é vocabulário, a regra de uso é gramática, e só a segunda impede o caos.
- **Enforcement sintático vs. enforcement semântico**: um linter pode garantir "só use valores desta lista" (sintaxe) sem conseguir garantir "use o valor certo desta lista pra este contexto" (semântica) — a segunda exige uma regra escrita à parte, e idealmente um teste que a verifique.
- **A pilha de quatro camadas** (o núcleo prescritivo do post): escala de tokens → lint sintático → mapa de papel semântico documentado → teste que verifica o papel. Cada camada cobre a lacuna da anterior; nenhuma sozinha é suficiente.
- **Convenção documentada vs. convenção testável**: uma regra em prosa (arquivo de instruções, comentário, `README`) depende de alguém lembrar de ler e aplicar; uma regra codificada em teste/lint falha o build sozinha, sem depender de memória humana ou de IA.
- **Débito de consistência silencioso**: ao contrário de um bug funcional (que quebra algo visivelmente), inconsistência de convenção não gera erro — só se acumula, achado por achado, até uma auditoria específica revelar o tamanho real do problema.
- **Amplificação, não substituição**: IA não introduz um tipo de erro novo — amplifica a velocidade com que qualquer ausência de disciplina de processo se transforma em volume de código, tornando o custo de não ter regras explícitas crescer mais rápido do que num projeto só-humano.

## Estrutura sugerida (H2s)

1. **Uma pergunta simples, sete rodadas de conserto**
   - Abertura pela cena real: "o H3 está pequeno" evoluindo pra uma auditoria de página inteira, feita em pedaços
2. **A primeira camada já estava certa — e ainda não foi suficiente**
   - Escala de tokens de tipografia + Stylelint: o que essa camada resolve de fato (nenhum valor cru, nenhum "ajuste fino" arbitrário)
3. **A prova de que não é peculiaridade de tipografia: o mesmo problema em espaçamento**
   - O exemplo de `--eyebrow-gap`/`--sp-4`/`--title-gap` — token certo documentado, nunca usado
4. **O que a IA faz bem, e o que ela não faz sozinha**
   - Velocidade de gerar código local e plausível vs. ausência de memória de padrão entre prompts/sessões
5. **A pilha de quatro camadas**
   - Vocabulário (escala) → lint sintático → mapa de papel semântico → teste que verifica o papel, não só o valor. Cada camada com o exemplo real que mostra por que ela é necessária.
6. **A camada 4 não ficou no papel: construída, e provada nos dois sentidos**
   - O teste real (`typography-role.spec.ts`), o resultado com o código certo (10/10), a regressão deliberada que o fez falhar com o número exato, e a ressalva honesta de que ele ainda não está no CI — "escrever o teste" e "torná-lo impossível de ignorar" são decisões diferentes.
7. **Além do CSS: onde mais essa lacuna aparece**
   - Generalização: nomenclatura, contratos de API, tratamento de erro — qualquer convenção que só existe como texto está sujeita ao mesmo tipo de erosão. Gancho pro framework.

## Fecho / CTA

"A escala de tokens estava certa. O linter estava rodando, em CI, a cada push. E ainda assim sete elementos de tipografia e um trio de espaçamentos pousaram em valores diferentes pro mesmo papel — não por decisão, por ausência de uma camada que faltava. Ter vocabulário e ter um guarda na porta não é o mesmo que ter gramática. Escrevi a regra que faltava numa tabela, e depois escrevi um teste pra verificar que ela é respeitada — e forcei ele a falhar de propósito, só pra ter certeza de que ele funcionava. Passou nos dois testes: reconheceu o código certo, e recusou o errado. O que ainda falta não é técnica — é decidir se esse teste entra no caminho do build, ou continua sendo uma rede de segurança que alguém precisa lembrar de usar. Essa é a próxima pergunta do framework que pretendo formalizar: não 'como corrigir código gerado por IA depois', mas 'como especificar antes, testar de verdade, e nunca depender de alguém lembrar'."

## Fonte interna

- Sessão de 2026-07-23 do projeto `marcelo-goncalves-blog`, branch `develop` — sequência de perguntas incrementais sobre tamanho de fonte na Home que revelou o padrão; achado de espaçamento identificado na mesma sessão, ao revisar `globals.css` em busca de mais exemplos.
- Commit real da correção de tipografia: `311e522` (`fix(frontend): corrige hierarquia tipografica da Home e Footer, remove duplicacao de CSS`).
- Arquivos reais citados: `frontend/app/globals.css`, `frontend/app/home.css`, `frontend/app/page.tsx`, `frontend/components/layout/Footer.css`, `frontend/components/ui/PostCard.css`, `frontend/components/ui/StepsTimeline.css`, `frontend/.stylelintrc.json`, `frontend/e2e/typography-role.spec.ts` (novo).
- Regra de tokens do projeto: `CLAUDE.md` §5, "Tokens de tipografia e espaçamento — obrigatório, com enforcement automático", incluindo a subseção nova "Papel → token mínimo".
- Post irmão temático: `20-standalone-css-modules-vs-css-global.md` (mesma tensão — escopo/consistência garantida por ferramenta vs. por disciplina — em domínio diferente).

## Notas de escrita

- **Não tratar o Stylelint/tokens como "tínhamos isso e mesmo assim falhou"** — tratar como a camada 1+2 de uma estratégia de 4 camadas que o post está ensinando a montar. O tom é prescritivo e construtivo, não irônico ou "gotcha".
- **A camada 4 não é mais hipotética — foi construída e provada na mesma sessão, nos dois eixos (tipografia e espaçamento).** Não escrever como "você poderia fazer um teste assim" — escrever como "aqui está o teste, aqui está ele passando, aqui está ele pego numa regressão de propósito, duas vezes". A prova em dois sentidos (passa certo / falha errado) é o que dá credibilidade — não cortar isso na edição.
- **O achado de espaçamento virou um bom exemplo extra de disciplina de processo:** a correção não foi "mudar o valor direto" — foi separada em dois passos (1: documentar sem alterar um pixel, medido antes/depois pra provar; 2: só depois, decisão explícita de design pra convergir de verdade, feita pelo humano, não escolhida pela IA sozinha). Vale um parágrafo próprio no post — é a resposta prática pra pergunta "como faço uma correção estrutural sem introduzir mudança visual não pedida", que qualquer leitor tocando código antigo vai reconhecer.
- O exemplo de espaçamento (item 3 da estrutura) é essencial e não pode ser cortado na edição — é o que prova que o problema é estrutural (qualquer sistema de tokens sem camada semântica sofre disso), não um acidente isolado de tipografia.
- Este post é a origem pretendida de um framework mais amplo que o autor quer desenvolver depois — fechar com gancho explícito pra isso, sem prometer detalhes que ainda não existem. Não inventar nome de framework nem lista de "regras oficiais" além da pilha de 4 camadas já descrita aqui.
- Evitar tom de alarme genérico ("IA vai destruir a qualidade de código") — a tese é mais precisa e mais interessante: vocabulário + guarda na porta não bastam sem gramática; IA só faz esse gap doer mais rápido.
- Não é sobre CSS especificamente — CSS é o exemplo mais fácil de mostrar com números reais (temos antes/depois de tipografia e um caso vivo de espaçamento), mas o H2 final ("Além do CSS") precisa deixar claro que a pilha de 4 camadas é geral.
- Bom post pra reforçar, mais uma vez, o tema "IA de longo prazo auditando os próprios hábitos e os do próprio processo" (mesmo ângulo do #21) — mas aqui a virada é prospectiva (framework a construir) e prescritiva (estratégia recomendada), não só retrospectiva.
