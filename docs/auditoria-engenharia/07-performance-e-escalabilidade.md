# Auditoria de Engenharia — Critério 7: Performance & Escalabilidade

> Data: 2026-06-27
> Escopo: GSI projections, cold starts, busca O(n), CDN/cache.
> Apenas análise — nenhum código foi alterado nesta etapa.
> Itens já rastreados no backlog do `CLAUDE.md` são citados como confirmação, não como achado novo.

## 🔴 Achados de alto impacto

### 1. `searchPosts` é um Scan completo da tabela, sem `Limit` antes do filtro (backlog #16 — confirmado)

`backend/src/functions/getPosts/index.ts:106-120`: todo termo de busca dispara um `ScanCommand` sobre a tabela inteira com `FilterExpression` de `contains()`. O comentário no próprio código já explica por que não há `Limit`: aplicado antes do filtro no DynamoDB, o `Limit` faria a busca retornar 0 resultados mesmo havendo posts correspondentes (porque o filtro roda depois da leitura limitada). Resultado: **o custo de cada busca escala com o tamanho total da tabela**, não com a quantidade de resultados — é o maior risco de custo/latência do backend conforme o volume de posts cresce. Já identificado no backlog (#16), confirmado aqui com leitura direta do código.

## 🟡 Achados de impacto médio

### 2. Duas GSIs usam atributo de baixa cardinalidade (booleano) como partition key

`PopularesPorData` (`hash_key = e_popular`) e `ProjetoPorData` (`hash_key = e_projeto`) particionam por um atributo que só assume 2 valores (`0` ou `1`). Isso é um anti-padrão conhecido de DynamoDB: o índice nunca pode distribuir tráfego além de ~2 partições, independente do throughput provisionado na conta — é um teto de escalabilidade embutido no desenho do schema, não no código de aplicação. Risco é baixo hoje (volume pequeno), mas corrigir depois exige novo atributo + migração de dados, não só mudança de código.

### 3. As 5 GSIs da tabela `posts` usam `projection_type = "ALL"` (backlog #13 — confirmado)

Cada GSI duplica o item inteiro, incluindo `conteudo_html` (pode ser HTML grande por post). Multiplica armazenamento e WCU de escrita por GSI a cada save. Confirmado em `infra/modules/dynamodb/main.tf:62,70,78,86,94`.

### 4. `getAllPosts` e `getProjectPosts` disparam 2 queries paralelas por requisição só para mostrar contagem total

`backend/src/functions/getPosts/index.ts:74` e `:192`: cada chamada faz `Promise.all` de uma query de itens + uma query `Select: "COUNT"` idêntica (mesmo `KeyConditionExpression`). Dobra o custo de leitura nos dois endpoints de listagem mais visitados (`/artigos` e `/o-projeto`) só para popular um número de "total" na paginação.

**Nota de contraste:** `getPostsByCategory` (mesmo arquivo) **não** faz essa segunda query — filtra status em memória e documenta a decisão em comentário ("volume por categoria é baixo"). É um exemplo de boa prática de engenharia que os outros dois endpoints não seguiram.

### 5. Limite de concorrência de Lambda na conta ainda é o default da AWS (backlog #6 — confirmado)

10 execuções concorrentes por conta é o teto padrão da AWS; todas as Lambdas do projeto compartilham esse pool. Um pico de tráfego orgânico (ex: post viral) pode throttlear a API inteira simultaneamente. Já é item de backlog aguardando abertura de ticket de suporte AWS.

## 🟢 Pontos positivos (manter)

- **Billing mode `PAY_PER_REQUEST`** na tabela DynamoDB — escolha correta para tráfego de blog, baixo e imprevisível; evita pagar por capacidade provisionada ociosa.
- **`getPostsByCategory` é a referência interna de boa decisão de performance**: evita a segunda query de contagem e documenta o porquê inline — mostra que o trade-off já foi pensado, só não foi replicado nos outros endpoints de listagem.
- **Estratégia de cache ISR em camadas** (60s posts, 300s listagens, 3600s páginas estáticas, documentada no `CLAUDE.md`) é desenho deliberado e correto para um site de conteúdo.
- **Dimensionamento de memória por workload**: `imageProcessor` em 1024MB (CPU/RAM para Sharp) vs. 512MB nas Lambdas de API leves — alocação de recursos já reflete o tipo de carga.

## Resumo

Nenhum achado deste critério é urgente no volume de tráfego atual — todos os itens de maior risco (#1 busca, #3 projections) já estavam mapeados no backlog. A contribuição nova desta auditoria é o achado #2 (GSI de baixa cardinalidade) e o #4 (queries de contagem duplicadas) — ambos de correção barata agora e cara depois, então vale priorizar antes do volume de posts crescer.
