---
id: POST-PLAN-2026-021
schema_version: "1.0"
title: "O Bug Que Nenhum Screenshot Mostrou (e o Diário de 455 Linhas Que Ninguém Ia Reler)"
created_at: 2026-07-13
updated_at: 2026-07-13
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

<!-- Migrado de projects/publishing-content/postagens/21-standalone-validacao-e-memoria-com-criterio.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "O Bug Que Nenhum Screenshot Mostrou (e o Diário de 455 Linhas Que Ninguém Ia Reler)"

## Títulos alternativos
- "Parei de Tirar Screenshot Pra Validar CSS — e Cortei 345 Linhas de Diário no Mesmo Dia"
- "Duas Regras de Processo Que Cortei na Mesma Sessão (e Por Que Elas São a Mesma Lição)"
- "Fazer Mais Não é Fazer Melhor: o Que um Bug de CSS e um Arquivo de Memória Inchado Têm em Comum"

## Por que este post é diferente dos demais
Não nasce de um achado de auditoria de código — nasce de uma auto-auditoria de processo, na mesma sessão em que a IA (atuando como Staff Engineer de longo prazo do projeto) percebeu que dois hábitos próprios — validar visualmente toda mudança de frontend e registrar cada sessão em prosa longa — pareciam rigor, mas eram, na prática, esforço sem critério. Bom par com o #20 (CSS Modules vs. CSS global): os dois são sobre decisões de processo formalizadas depois de acontecerem informalmente, não sobre bug de código.

## Tese central

Duas decisões tomadas na mesma sessão parecem não ter relação — uma é sobre como validar CSS, a outra é sobre o que vale a pena registrar em memória de longo prazo — mas compartilham a mesma causa raiz: confundir **mais trabalho visível** com **mais rigor real**. Tirar screenshot depois de cada edição pequena parecia disciplina, mas não achava bugs — uma medição de três linhas de JavaScript achava. Um arquivo de contexto de 455 linhas parecia memória cuidadosa, mas 60-70% era diário que ninguém ia reler, e fatos importantes (uma regra de segurança, um padrão de CSS) estavam duplicados em dois ou três lugares sem que ninguém percebesse a inconsistência crescendo.

## Por que importa

1. **Evidência visível não é a mesma coisa que evidência confiável.** Um screenshot parece prova forte porque é uma imagem — mas exige interpretação (humana ou de IA) que pode enganar. Uma medição direta de layout é mais barata *e* mais difícil de ler errado.
2. **Documentação sem critério de "o que vale guardar" cresce sem limite — e fica menos útil quanto mais cresce.** O sinal se perde no ruído; uma regra real acaba se escondendo atrás de 40 linhas de "o que fizemos hoje" que ninguém vai reler na próxima sessão.
3. **As duas soluções compartilham a mesma estrutura**: trocar "fazer mais" por um critério objetivo de quando fazer o quê — nível de risco para decidir a validação, um checklist de perguntas para decidir o que registrar. Rigor vem do critério, não do volume de esforço.

## Storytelling sugerido

Abrir com a cena concreta, no presente: investigando um componente de newsletter (`NewsletterCTA`) que aparecia perfeito em todo screenshot — a coluna do formulário, o botão, o texto, tudo dentro dos limites visíveis da tela. E ainda assim a página inteira tinha overflow horizontal. Nenhum screenshot mostrava, porque cada print captura o que está na tela, não a soma total da largura renderizada. Só uma linha de JavaScript (`document.documentElement.scrollWidth > clientWidth`) revelou o problema — e mais uma técnica de diagnóstico (forçar `width: min-content` subindo a árvore de elementos-pai) localizou a causa: um item de grid sem `min-width: 0`, forçando a coluna do formulário a 409px de largura mínima dentro de uma tela de 390px.

Segundo movimento: puxar o fio pra trás — por que isso importa além desse bug específico. A sessão inteira vinha sendo validada assim: mudar um CSS pequeno, abrir o navegador, tirar print, comparar visualmente. Funcionava, mas era lento, e o print raramente achava algo que o código já não deixasse óbvio. O bug real só apareceu quando a validação virou medição, não inspeção.

Terceiro movimento: a virada de perspectiva que junta os dois fios. No fechamento da mesma sessão, ao revisar por que o trabalho parecia lento, ficou claro que o hábito de escrever um parágrafo de diário por commit no arquivo de contexto do projeto era o mesmo problema, só que em outro domínio: esforço que parecia cuidado, mas sem critério de utilidade futura. E aqui vale abrir o "antes" com evidência real, não só o número final — mostrar concretamente o caos que 455 linhas sem critério tinham produzido: o arquivo dizendo, ao mesmo tempo, "sistema ao vivo em dev" no topo e "deploy aguardando pré-requisitos manuais AWS" numa seção mais abaixo nunca atualizada; um número de testes desatualizado (47) coexistindo com o real (96+45+16) registrado em outro arquivo; um arquivo de memória cuja própria primeira linha dizia "substituído por outro arquivo" e que, mesmo assim, seguiu sendo carregado em toda sessão nova por meses. Esse é o material que transforma "documentação grande demais" (chato, abstrato) em "documentação que mentia sem ninguém perceber" (concreto, com risco real: agir sobre uma premissa falsa).

Quarto movimento: a resolução — não foi "apagar tudo", foi desenhar um papel fixo por sistema (regra dura vive num lugar, status vive em outro, fato durável de memória em outro) e um checklist de 5 perguntas antes de registrar qualquer coisa nova. Um arquivo de 455 linhas virou 110; a memória foi de 52 pra 45 arquivos — sem perder nenhum fato que importasse, porque quase tudo que sobrava era re-derivável do próprio histórico do `git` ou já estava (duplicado) em outro lugar.

Fechar amarrando as duas lições numa regra única: **o critério, não o esforço, é o que dá rigor.**

## Provas e exemplos reais

- **Bug real 1 — `NewsletterCTA`:** `.nl-cta__right` (item de grid CSS) sem `min-width: 0` forçava a coluna do formulário a 409px de largura mínima num viewport de 390px — 19px de overflow horizontal que nenhum dos vários screenshots da mesma sessão revelou.
- **Bug real 2 — Home, seção de resultados:** `.ih-case-metrics` (flexbox de duas métricas lado a lado, ex. "-60% custo operacional" / "+40% performance") sem `flex-wrap`, cortando o texto na borda direita em telas estreitas.
- **Técnica de diagnóstico que funcionou:** comparar `scrollWidth`/`clientWidth` filho a filho não localiza esse tipo de bug — todo filho herda a largura já inflada do pai e reporta o mesmo valor. O que funcionou foi aplicar `element.style.width = 'min-content'` temporariamente, subindo a árvore de ancestrais um nível de cada vez, até achar o nó cujo min-content batia exatamente com o tamanho do overflow real.
- **Redução real de `.project-context.md`:** 455 → 110 linhas, sem perda de conhecimento durável — o que saiu era ou diário cronológico ("Sessão 44: refino de copy do CTA, reorganização de nav...") ou duplicação de fatos já registrados em outro lugar.
- **Redução real da memória de longo prazo:** 52 → 45 arquivos. Removidos: 5 arquivos órfãos duplicando a mesma regra ("analise antes de agir/responder" existia em 3 versões diferentes, quase idênticas), 1 diário puro de execução de pipeline sem nenhum fato reutilizável, 1 investigação de performance já fechada sem pendência real.
- **Duplicação concreta encontrada:** a mesma regra de segurança (uma requisição bloqueada por CORS no navegador ainda executa no servidor — CORS impede só a *leitura* da resposta, não a execução) estava registrada, quase palavra por palavra, em dois arquivos diferentes.
- **A tabela de 6 níveis de validação** e **o checklist de 5 perguntas** para decidir o que registrar — os dois artefatos concretos que formalizaram as regras.

### O caos real do arquivo de contexto, achado por achado

Vale mostrar o "antes" com evidência concreta, não só o número final (455→110 linhas) — o caos específico é o que dá credibilidade ao post e ao mesmo tempo é genuinamente instrutivo pra quem mantém qualquer base de conhecimento viva:

- **O próprio arquivo se contradizia.** O topo dizia "sistema ao vivo em dev, pipeline verde"; uma seção mais abaixo, nunca atualizada, dizia "deploy aguardando pré-requisitos manuais AWS" e "falha em Configure AWS credentials — secrets não configurados". As duas não podiam ser verdade ao mesmo tempo — uma delas era lixo congelado de meses atrás que sobreviveu a dezenas de sessões sem ninguém notar.
- **Números desatualizados apresentados como fato atual.** Uma seção de referência dizia "47 testes Jest" quando o número real (confirmado no `CLAUDE.md`, atualizado à parte) já era 96 no backend + 45 no frontend + 16 no admin. Sem uma fonte única, os dois arquivos simplesmente divergiam, e nada indicava qual estava certo.
- **O mesmo backlog existia em 3 lugares ao mesmo tempo** — `CLAUDE.md`, `.project-context.md` e espalhado em arquivos de memória individuais — cada um com uma versão ligeiramente diferente da lista, sem nenhum marcado como definitivo.
- **Um arquivo de memória dizia, na própria primeira linha, que tinha sido substituído** — "Superseded 2026-06-20 by [outro arquivo]" — e mesmo assim continuava sendo carregado em toda sessão nova, meses depois, porque ninguém tinha voltado pra de fato apagá-lo.
- **A mesma regra de comportamento existia em 3 versões quase idênticas** (arquivos diferentes, nomes diferentes, mesmo conteúdo: "analise antes de agir/responder") — nenhuma delas sabia da existência das outras duas.

### O que esse caos custava de verdade

Não é só estética de arquivo bagunçado — cada um dos achados acima tinha um custo concreto:

- **Risco de agir sobre informação errada.** Se uma sessão futura lesse "deploy aguardando pré-requisitos manuais" e agisse como se o sistema não estivesse no ar, todo o resto do trabalho partiria de uma premissa falsa.
- **Ambiguidade sem árbitro.** Com o backlog em 3 lugares divergentes, não havia como saber qual versão era a atual sem comparar as três manualmente — o tempo economizado por ter a informação "registrada" era perdido de novo na hora de descobrir qual registro confiar.
- **Todo esse ruído era recarregado em toda sessão nova**, consumindo atenção (e tokens) antes mesmo do trabalho começar — pagando o custo do caos repetidamente, não uma vez só.
- **Duplicação que diverge silenciosamente é pior que não ter o fato registrado em lugar nenhum** — porque cria falsa confiança: parece que a informação está lá, mas há 50% de chance de ler a cópia desatualizada.

## Conceitos a explicar

- **A armadilha do `min-width: auto`**: por padrão, itens de flexbox e grid têm `min-width: auto`, que os impede de encolher abaixo do tamanho mínimo do próprio conteúdo — mesmo quando o layout pede que encolham. É o tipo de bug invisível em código legível, só reproduzível medindo.
- **Validação proporcional ao risco, não uniforme**: nem toda mudança de código merece o mesmo nível de teste — texto puro não quebra layout, CSS local pode, um componente compartilhado por 15 páginas exige mais checagem que um ajuste isolado.
- **Fonte única de verdade**: por que um fato duplicado em dois lugares é pior que um fato registrado em um só — a cópia duplicada eventualmente fica desatualizada sem ninguém perceber, porque só uma das duas é lembrada na hora de atualizar.
- **Memória como investimento com retorno decrescente**: cada linha registrada tem um custo (é lida em toda sessão futura) e um benefício (evita re-trabalho); sem um critério do que vale o custo, o benefício marginal de cada linha nova despenca conforme o arquivo cresce.
- **A estratégia de registro definida (o "depois" do post), explicada por completo:**
  - Um papel fixo por sistema de memória — regras duráveis (documentação de convenções do projeto) guardam só regra; status/changelog guarda só estado atual + resumo compacto por sessão fechada; memória de comportamento guarda só regra anti-repetição de erro; memória de fato guarda só fato durável não-óbvio. Nada se sobrepõe.
  - Um checklist de 5 perguntas, aplicado antes de registrar qualquer coisa nova: isso muda o que uma sessão futura faz mesmo sem lembrar desta conversa? já é derivável do histórico de versionamento/código? já existe um lugar pra isso? é um fato fechado sem pendência (então vira 1 linha, não um arquivo)? é genuinamente "não repita esse erro" ou "algo não-óbvio"?
  - A régua prática: se a resposta de qualquer uma das 5 perguntas for "não" (ou "sim, mas já existe em outro lugar"), a informação não devia virar uma entrada nova.

## Estrutura sugerida (H2s)

1. **O componente que parecia perfeito em todo screenshot**
   - Abertura com a cena do `NewsletterCTA`, o overflow que nenhum print mostrou
2. **Medir é mais barato — e mais difícil de ler errado — do que olhar**
   - A técnica do `width: min-content` subindo a árvore; a tabela de 6 níveis de validação por risco
3. **O outro lado da mesma moeda: um arquivo que se contradizia sozinho**
   - A descoberta de que o hábito de screenshot e o hábito de narrar sessão em prosa eram o mesmo problema
   - O caos concreto: o arquivo dizendo "sistema ao vivo" no topo e "deploy aguardando pré-requisitos" mais abaixo; "47 testes" registrado enquanto o real já era 96+45+16; um arquivo de memória com "substituído" escrito na própria primeira linha, carregado mesmo assim por meses
4. **O que esse caos custava de verdade**
   - Não é estética: risco de agir sobre premissa falsa, ambiguidade sem árbitro (backlog em 3 lugares divergentes), o custo pago de novo a cada sessão que recarrega o ruído
5. **Por que um fato registrado 2 vezes é pior que registrado 0 vezes**
   - O exemplo da regra de CORS duplicada palavra por palavra em 2 arquivos sem que nenhum soubesse do outro
6. **A regra que ficou: um papel por sistema, um checklist de 5 perguntas**
   - A tabela de "o que vive onde"; o checklist completo, com o resultado prático (455→110 linhas, 52→45 arquivos, sem perder nada que importasse)
7. **O critério, não o esforço, é o que dá rigor**
   - Fechamento amarrando as duas lições numa regra única, com gancho pra série (mais um caso de "convenção informal nunca formalizada até alguém perguntar por quê")

## Fecho / CTA

"Nenhuma das duas mudanças significou fazer menos — significou parar de confundir esforço com critério. O bug do `NewsletterCTA` só apareceu quando troquei um print por uma medição. O diário de 455 linhas só encolheu quando parei de perguntar 'o que fiz hoje' e comecei a perguntar 'isso muda o que uma sessão futura vai fazer, mesmo sem lembrar desta conversa'. A mesma pergunta, feita cedo o suficiente, evita o trabalho de sobra dos dois lados."

## Fonte interna

- Sessão 44 (2026-07-12/13) do projeto `marcelo-goncalves-blog`, branch `develop`.
- Bugs reais e técnica de diagnóstico: `docs/auditoria-visual-mobile.md` (gitignored, local).
- Estratégia de validação em 6 níveis: `CLAUDE.md` §7, "Estratégia de validação local"; espelhado em `memory/feedback_testing_strategy_tiers.md`.
- Estratégia de registro em contexto/memória: `CLAUDE.md` §7, "Estratégia de registro em contexto/memória"; espelhado em `memory/feedback_context_recording_strategy.md`.
- Commits relevantes: `9dc2f37` (auditoria mobile + fixes), `ec6c2d2` (estratégia de testes), `b5b5a27`/`20887f2` (limpeza e formalização de contexto/memória).
- Antes/depois mensurável: `.project-context.md` 455→110 linhas; `memory/` 52→45 arquivos.

## Notas de escrita

- Evitar tom de "dica de produtividade" genérica (não é sobre "seja mais organizado") — ancorar tudo nos dois achados reais desta sessão específica, com números.
- Não é sobre Playwright vs. outra ferramenta de teste, nem sobre um framework de documentação — o ponto é o critério por trás da escolha, não a ferramenta em si.
- Bom post pra mostrar o lado "IA de longo prazo auditando os próprios hábitos", não só o código do usuário — reforça a tese da série (prova de trabalho, não hype) por um ângulo ainda não coberto: o processo da própria IA como objeto de auditoria.
- Cuidado para não soar como "descobri a roda" (validação proporcional a risco e fonte única de verdade são princípios conhecidos de engenharia) — o valor do post é mostrar a aplicação real, com números, não apresentar os princípios como novidade.
