---
id: POST-PLAN-2026-017
schema_version: "1.0"
title: "O Ledger de Trade-offs — Como a Mesma Escolha de Banco Economiza Dinheiro e Trava sua Paginação"
created_at: 2026-06-30
updated_at: 2026-06-30
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

<!-- Migrado de projects/publishing-content/postagens/17-standalone-ledger-de-tradeoffs-escolha-de-servico.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "O Ledger de Trade-offs — Como a Mesma Escolha de Banco Economiza Dinheiro e Trava sua Paginação"

## Títulos alternativos
- "Escolher um Banco de Dados é Assinar um Contrato, Não Comprar uma Ferramenta"
- "DynamoDB: A Mesma Decisão que Economizou Dinheiro Também Impediu o Botão 'Página 5'"

## Tese central

Escolher um serviço de infraestrutura não é uma decisão "boa" ou "má" isolada — é assinar um conjunto de trade-offs que se manifestam de formas completamente diferentes ao longo do projeto, em momentos diferentes, parecendo problemas desconectados. Usando 4 achados reais do mesmo projeto (billing `PAY_PER_REQUEST` corretamente escolhido, paginação cursor-based sem "ir para página N", ausência de full-text search que forçou a adoção do Algolia, e ausência de `COUNT` agregado nativo que forçou um contador atômico mantido à mão), o post mostra que os 4 vêm da **mesma característica arquitetural** do DynamoDB — ser um key-value store otimizado para lookup O(1) por chave, não um banco relacional com índices genéricos nem estatísticas de agregação mantidas pelo motor. O que parece "um acerto" e "três limitações" isoladas são, na verdade, quatro manifestações de uma única escolha de design — e os 3 jeitos diferentes de responder a elas (aceitar o custo, contornar com outro serviço, construir o agregado você mesmo) formam um padrão reutilizável para qualquer trade-off dessa família.

## Por que importa

A maioria do conteúdo sobre "escolha de banco de dados" é binário — "DynamoDB é bom" ou "DynamoDB tem limitações", listas de prós/contras desconectadas. Isso é raso e não ajuda ninguém a decidir nada. Entender a **causa raiz comum** dos trade-offs (não cada um isoladamente) é o que separa decisão de arquitetura informada de cargo cult ("usa DynamoDB porque é serverless" sem entender o que isso custa depois).

## Storytelling sugerido

Abrir com o achado positivo: `PAY_PER_REQUEST` é citado como acerto na própria auditoria do projeto — escolha certa para tráfego de blog, baixo e imprevisível, sem pagar capacidade ociosa. Deixar o leitor pensar "ótima escolha, sem ressalvas".

Segundo movimento: revelar a primeira limitação (paginação) — "mas o mesmo motivo que permite esse billing flexível também significa que não existe 'pular para a página 5'". Mostrar a pilha de cursores no código real como prova de que isso não é teórico, é um workaround vivo em produção.

Terceiro movimento: a segunda limitação (busca) — "e significa que buscar um texto livre exige sair do banco de dados completamente". Mostrar a decisão real de migrar para Algolia como consequência direta, não como "o DynamoDB é ruim para busca" (afirmação vaga), mas como "a busca por texto livre quer um índice genérico que esse tipo de banco não mantém por design".

Quarto movimento, a limitação mais sutil das quatro porque parece um detalhe de implementação, não uma limitação arquitetural: exibir "Página X de Y" exige saber quantos posts publicados existem no total. Em SQL isso é um `COUNT(*) WHERE status = 'Publicado'` — uma operação que o motor otimiza com estatísticas internas. No DynamoDB não existe essa otimização: contar itens que batem uma condição custa exatamente o mesmo RCU que lê-los, porque não há "metadado de agregação" mantido pelo banco — só índice por chave. Por isso o backend disparava 2 queries paralelas a cada requisição (uma para os itens, uma só para o `COUNT`), dobrando o custo de leitura nos 2 endpoints de listagem mais visitados — achado confirmado num teste de carga real, onde essa rota foi a mais lenta das testadas. A resposta aqui não foi "aceitar o custo" (como o billing) nem "contornar com outro serviço" (como a busca) — foi um terceiro caminho: manter o próprio agregado, atualizado atomicamente em cada escrita (`ADD` num item de metadata), pagando o custo de manutenção no momento da escrita em vez de pagá-lo, dobrado, em toda leitura.

Fechamento: religar os 4 pontos — não são 4 decisões separadas tomadas em momentos diferentes do projeto, são 1 característica arquitetural (ausência de índice secundário genérico e de agregação nativa, tipo B-tree/estatísticas de motor relacional) com 4 manifestações: uma economiza dinheiro, três custam engenharia depois — só que as três custam de formas diferentes, e mapeá-las revela um padrão de resposta com 3 saídas válidas (aceitar o custo, contornar com um serviço externo, ou construir o agregado você mesmo), não uma escolha binária de "usar DynamoDB ou não". Gancho para o leitor: "qual serviço do seu stack você escolheu pelo benefício A sem mapear os custos B, C e D que vêm de brinde — e qual dos 3 padrões de resposta você já está usando sem ter dado nome a ele?"

## Provas e exemplos reais

| Achado | Onde está | Manifestação |
|---|---|---|
| `PAY_PER_REQUEST` correto | `docs/auditoria-engenharia/07-performance-e-escalabilidade.md` — "Billing mode PAY_PER_REQUEST... escolha correta para tráfego de blog, baixo e imprevisível; evita pagar por capacidade provisionada ociosa" | Benefício |
| Paginação cursor-based, sem "página N" nem "voltar" nativo | `frontend/components/ui/Pagination.tsx:45-48` — pilha manual de cursores (`prevTokens`, separados por vírgula na URL) para simular "← Anterior" | Custo (workaround de engenharia) |
| Sem full-text search nativo | `backend/src/functions/getPosts/index.ts` (`searchPosts`, `ScanCommand` sem `Limit`, O(n)) → decisão de migrar para Algolia, `docs/plano-busca-algolia.md` | Custo (contornado com serviço externo) |
| Sem `COUNT` agregado nativo | `backend/src/functions/getPosts/index.ts` (`getAllPosts`/`getProjectPosts` disparavam 2 queries paralelas — itens + `Select: COUNT` — a cada requisição) → resolvido com contador atômico, `backend/src/common/postCounters.ts` | Custo (resolvido construindo o agregado: `ADD` na escrita, `GetCommand` de 1 RCU na leitura) |

## Conceitos a explicar

- **Key-value store vs. banco relacional**: DynamoDB indexa por chave (partition/sort key), não mantém índice genérico sobre qualquer coluna, sobre posição/offset, nem estatísticas de agregação.
- **Paginação por cursor vs. por offset**: `LastEvaluatedKey`/`ExclusiveStartKey` aponta só para frente; "voltar" e "ir para página N" são problemas que SQL resolve de graça com `OFFSET` e que aqui exigem código de aplicação.
- **Por que não existe `COUNT(*)` barato em DynamoDB**: `Select: "COUNT"` ainda lê (e cobra RCU de) todo item que bate a condição — só não transfere os atributos. "Contar" e "ler" custam o mesmo; a única forma de fugir disso é manter você mesmo um contador que é incrementado/decrementado a cada escrita relevante (padrão de contador atômico via `ADD`).
- **Por que a mesma ausência de índice/agregação genérica explica os 4 achados**: nenhum dos 4 é um "bug" do DynamoDB — são consequências necessárias de como ele consegue O(1) garantido em qualquer escala (a característica que faz `PAY_PER_REQUEST` funcionar bem).
- **3 padrões de resposta ao mesmo tipo de trade-off**: aceitar o custo porque ele já é o melhor trade-off disponível (billing); contornar com um serviço externo especializado (Algolia para busca); ou construir o agregado/índice que falta dentro da própria aplicação (contador atômico para `COUNT`). Não é hierarquia — é um menu de respostas válidas, e qual escolher depende do quanto o "índice que falta" é central ao produto.
- **Trade-off explícito vs. invisível até você precisar dele**: o billing é um trade-off que você sente no orçamento desde o dia 1; paginação, busca e contagem agregada são trade-offs que só aparecem quando o produto cresce o suficiente (em posts, em tráfego, ou em ambos) para precisar deles.

## Estrutura sugerida (H2s)

1. A decisão que economizou dinheiro (e por que ela é a decisão certa aqui)
2. O mesmo motivo que impede o botão "ir para a página 5"
3. O mesmo motivo que te manda para outro serviço só para buscar um texto
4. O mesmo motivo que dobra o custo de mostrar "Página X de Y" — e como resolver sem sair do banco
5. Uma característica, quatro consequências, três padrões de resposta — religando os pontos
6. O que isso ensina sobre escolher serviços (não é sobre DynamoDB ser bom ou ruim)

## Fecho / CTA

Linka para o post #16 (`16-standalone-dynamodb-gsi-partition-key-design.md`) como aprofundamento técnico: "se você quer ver esse mesmo tipo de trade-off em ação — dessa vez do lado do design de índice, não de paginação — o próximo post detalha uma migração real de GSI de baixa cardinalidade neste mesmo banco." Os dois posts compartilham a mesma tese de fundo (decisões de banco de dados têm consequências que se manifestam em lugares inesperados do código), mas operam em escopos diferentes: este post é a visão panorâmica (4 achados, 1 causa comum); o #16 é o mergulho profundo em 1 achado específico (GSI) com walkthrough de migração passo a passo. Linka também para o #19 (`19-standalone-auditoria-performance-ia-staff-engineer.md`) para quem quer ver como o achado #4 (contador) foi descoberto (teste de carga real) e implementado (código completo, testes, backfill) — este post conta o "porquê arquitetural", o #19 conta o "como foi medido e corrigido".

## Fonte interna

- `docs/auditoria-engenharia/07-performance-e-escalabilidade.md` (achado #1 busca, achado positivo billing, achado de double-query)
- `frontend/components/ui/Pagination.tsx`
- `backend/src/functions/getPosts/index.ts`
- `backend/src/common/postCounters.ts` (contador atômico — achado #4)
- `docs/plano-busca-algolia.md`
- `docs/auditoria-performance/00-metodologia.md` e `01-perf-load.md` (origem real do achado #4: teste de carga mostrou `/artigos` como rota mais lenta, causa rastreada até a double-query de `COUNT`)
- `16-standalone-dynamodb-gsi-partition-key-design.md` (post irmão — ver nota de relação abaixo)
- `19-standalone-auditoria-performance-ia-staff-engineer.md` (post irmão — mergulho na medição e implementação do achado #4)

## Relação com o post #16

Este post (#17) e o post #16 (`16-standalone-dynamodb-gsi-partition-key-design.md`) são **complementares, não duplicados**:

- **#17 (este)** é o post "guarda-chuva": panorama de 4 achados diferentes do DynamoDB (billing, paginação, busca, contagem agregada), todos amarrados pela mesma causa raiz arquitetural. Não entra em detalhe de implementação de nenhum dos 4.
- **#16** é o mergulho técnico profundo em **apenas um** desses achados — o anti-padrão de GSI com partition key de baixa cardinalidade — incluindo walkthrough completo de migração real (export, backfill, sparse index, validação de zero perda de dados).

**Ordem de publicação sugerida:** #17 primeiro (contextualiza a tese, gera interesse no padrão geral), #16 depois (aprofunda um caso específico para quem quer o detalhe técnico). #17 deve linkar para #16 no fechamento; #16 pode citar #17 na abertura como "este achado é um exemplo do padrão mais amplo discutido em [link]".

## Relação com o post #19

Este post (#17) e o post #19 (`19-standalone-auditoria-performance-ia-staff-engineer.md`) se cruzam em **apenas um** dos achados — o #4 (contador agregado) —, mas com lentes diferentes:

- **#17 (este)** trata o achado como **consequência arquitetural**: por que DynamoDB não tem `COUNT` barato, e como isso se conecta aos outros 3 trade-offs do mesmo banco. Não entra em código de implementação nem em como o achado foi descoberto.
- **#19** trata o mesmo achado como **resultado de medição e correção**: como um teste de carga real revelou que `/artigos` era a rota mais lenta, como isso foi rastreado até a double-query, e como a correção foi implementada (contador atômico, 3 pontos de escrita, backfill, testes) — incluindo a decisão consciente de não remover a feature de paginação por causa do custo.

Não há conflito de conteúdo: #17 nunca menciona k6/CloudWatch/Lighthouse; #19 nunca aprofunda a tese de "key-value store vs. relacional". Cada post linka o outro para o leitor que quiser a metade que falta.
