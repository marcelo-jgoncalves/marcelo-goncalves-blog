---
id: POST-PLAN-2026-008
schema_version: "1.0"
title: "Post 7 da série: Performance & Escalabilidade — \"O índice que não pode crescer, por desenho\""
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

<!-- Migrado de projects/publishing-content/postagens/08-criterio-performance-e-escalabilidade.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 7 da série: Performance & Escalabilidade — "O índice que não pode crescer, por desenho"

## Títulos alternativos
- "Duas únicas partições, para sempre"
- "Pagamos duas vezes para mostrar um número"

## Tese central

Nem todo problema de performance é sobre código lento — alguns são sobre **decisões de schema que colocam um teto de escalabilidade embutido**, indetectável até o volume de dados crescer o suficiente para expor. O post foca em um achado específico e técnico: dois índices do DynamoDB particionados por um atributo booleano, que por desenho nunca podem escalar além de duas partições, não importa o quanto se pague de capacidade.

## Por que importa

É um tipo de dívida técnica particularmente caro: indetectável em qualquer teste de carga feito hoje (volume baixo não revela o problema), e caro de corrigir depois (exige novo atributo + migração de dados, não só deploy de código novo).

## Storytelling sugerido

Abra explicando, em uma frase, como o DynamoDB distribui carga entre partições com base no valor da chave de partição de um índice — e então mostre o achado: dois índices do projeto (`PopularesPorData`, `ProjetoPorData`) usam um atributo que só tem dois valores possíveis (0 ou 1) como chave de partição. Na prática, **não existem 2 partições "verdadeiras"** de tráfego possível ali — o índice inteiro já nasceu com teto, mesmo que hoje, com poucos posts, ninguém sinta.

Segundo achado, mais imediato: toda vez que alguém visita `/artigos` ou `/o-projeto`, o backend dispara duas queries paralelas ao DynamoDB — uma para os itens da página, outra só para contar o total, e mostrar um número na paginação. Contraste com `getPostsByCategory`, no mesmo arquivo, que evita deliberadamente essa segunda query e até comenta no código por quê — prova de que a decisão "certa" já existia no próprio projeto, só não foi replicada.

Fechamento: performance, em sistemas pequenos, raramente é sobre otimizar o que existe — é sobre não construir, sem perceber, um teto que só vai doer quando o sucesso chegar.

## Provas e exemplos reais

- `infra/modules/dynamodb/main.tf:74-87`: GSIs `PopularesPorData` (`hash_key = e_popular`) e `ProjetoPorData` (`hash_key = e_projeto`) — ambos atributos `Number` com só os valores `0`/`1`.
- `backend/src/functions/getPosts/index.ts`: `getAllPosts` e `getProjectPosts` cada um dispara `Promise.all` de uma query de itens + uma query `Select: "COUNT"` idêntica — dobra o custo de leitura nos dois endpoints de listagem mais visitados.
- Mesmo arquivo, `getPostsByCategory`: deliberadamente sem a segunda query, com comentário explicando a decisão ("volume por categoria é baixo") — exemplo interno de boa prática não replicada.
- `searchPosts` (mesmo arquivo): `ScanCommand` sem `Limit` antes do `FilterExpression` — busca sempre lê a tabela inteira, custo escala com o tamanho do banco, não com o tamanho do resultado.
- Todas as 5 GSIs da tabela `posts` usam `projection_type = "ALL"` — duplicam o item inteiro (incluindo `conteudo_html`, potencialmente grande) em cada índice.
- Contraponto positivo real: tabela em `PAY_PER_REQUEST` (on-demand) — escolha certa para tráfego baixo e imprevisível; `imageProcessor` dimensionado em 1024MB (vs. 512MB das Lambdas de API leves) — alocação de recursos já reflete o tipo de carga.

## Conceitos a explicar

- **Partition key / cardinalidade**: o DynamoDB distribui dados e tráfego com base no valor da chave de partição; poucos valores possíveis = poucas "filas" possíveis, não importa quanta capacidade se compre.
- **Projeção de índice (`projection_type`)**: que atributos do item original são copiados para o índice — `ALL` copia tudo, inclusive campos grandes que talvez nunca sejam lidos via aquele índice.
- **Scan vs. Query**: Query usa a chave do índice para ler só o que precisa; Scan lê a tabela inteira e filtra depois — custo de Scan cresce com o tamanho total do banco.

## Estrutura sugerida (H2s)

1. Como um índice escala (e como alguns nascem sem poder escalar)
2. O teto invisível: dois valores, duas partições, para sempre
3. Pagar duas vezes para mostrar um número
4. A decisão certa que já existia no mesmo arquivo, só numa função vizinha
5. Por que esse tipo de dívida é mais cara de corrigir depois do que parece

## Fecho / CTA

Aponta para o post de IaC ("o ambiente de produção, configurado em arquivo, também tem uma lacuna que só aparece tarde — é o próximo capítulo").

## Fonte interna

`docs/auditoria-engenharia/07-performance-e-escalabilidade.md`
