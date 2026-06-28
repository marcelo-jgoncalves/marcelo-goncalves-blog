# Plano de Implementação — Busca Full-Text via Algolia

> Status: **planejamento, nada executado ainda**. Estratégia decidida (Algolia, não OpenSearch) — ver justificativa de custo abaixo.
> Achado original: `docs/auditoria-engenharia/07-performance-e-escalabilidade.md`, item 1 (maior impacto da auditoria).
> Gatilho de execução: quando o catálogo de posts crescer (sugestão original: 500+ posts) ou quando a degradação de latência da busca for percebida antes disso.

## 1. O problema, em concreto

`backend/src/functions/getPosts/index.ts` (`searchPosts`, ~linha 93) faz um `ScanCommand` na tabela `posts` inteira a cada busca, com `FilterExpression` usando `contains()` sobre `titulo`/`resumo`. Não há `Limit` — o comentário no próprio código já explica por quê: `Limit` no DynamoDB é aplicado **antes** do `FilterExpression`, então limitar a leitura faria a busca retornar 0 resultados mesmo havendo posts correspondentes mais adiante na tabela.

**Consequência:** o custo (latência + RCU consumido) de cada busca escala com o **tamanho total da tabela**, não com a quantidade de resultados. Com 14 posts é irrelevante. Com volume real, é o maior risco de custo/latência do backend.

**Por que não dá pra resolver com índice GSI:** `contains()` em texto livre não é uma operação que Query/GSI suporta — DynamoDB não tem busca full-text nativa.

## 2. Decisão: Algolia, não OpenSearch

| Critério | Algolia | OpenSearch (AWS) |
|---|---|---|
| Custo mínimo mensal | **$0** (free tier cobre o volume deste blog) | ~$25-30/mês de infra fixa, mesmo com tráfego zero (menor instância gerenciável) |
| Modelo | SaaS gerenciado, API/SDK | Self-managed via AWS, requer dimensionamento de cluster |
| Setup | Indexação simples via API | Mapeamento de schema, gestão de cluster, mais operação |
| Adequado para | Blog de conteúdo, volume baixo/médio | Workloads de busca/log em maior escala, já operando outros usos do cluster |

**Decisão tomada com Marcelo:** Algolia. Não há outra carga de trabalho neste projeto que justifique o custo fixo de um cluster OpenSearch — seria pagar por capacidade ociosa. Free tier do Algolia (~10k registros + 10k requisições de busca/mês, confirmar limites exatos no momento da implementação) cobre o volume esperado deste blog indefinidamente.

## 3. Arquitetura proposta

```
adminPosts (save/update/delete)
        │
        ▼
DynamoDB Streams ──► Lambda nova (algoliaSync) ──► índice Algolia
                                                          │
frontend /busca ──► Lambda (searchPosts, refeita) ──────┘
                     (API key do Algolia nunca exposta ao browser)
```

### Por que DynamoDB Streams, não chamada direta no `adminPosts`

Desacopla a sincronização do fluxo de salvamento — se a indexação no Algolia falhar (rate limit, timeout, etc.), o post ainda é salvo normalmente no DynamoDB; o Stream reprocessa o evento até confirmar. Mesmo padrão arquitetural já usado no projeto (S3 `ObjectCreated` → Lambda `imageProcessor`) — não introduz um conceito novo ao stack.

### Por que a busca continua passando por uma Lambda (não Algolia direto do browser)

Mantém a chave de API do Algolia só no backend, consistente com o padrão atual onde o frontend nunca fala diretamente com serviços externos/AWS (tudo via API Gateway + Lambda). Usar a Search-Only API Key do Algolia diretamente do browser também seria uma opção segura (é uma chave com permissão restrita a buscas), mas manter via Lambda preserva a uniformidade do desenho atual.

## 4. Mudanças necessárias, por camada

### 4.1 Infraestrutura (Terraform)
- Novo `aws_dynamodb_table.posts` stream habilitado (`stream_enabled = true`, `stream_view_type = "NEW_AND_OLD_IMAGES"`).
- Nova Lambda `algoliaSync`: trigger via `aws_lambda_event_source_mapping` no Stream da tabela `posts`.
- Nova Lambda `searchPostsV2` (ou reaproveitar `getPosts` com lógica trocada) — substitui o `ScanCommand` atual por chamada à API do Algolia.
- IAM role individual para `algoliaSync` (seguindo o padrão de least-privilege já estabelecido — `infra/modules/lambda/lambda-iam.tf`): permissão de leitura no Stream, sem acesso de escrita à tabela.
- Algolia App ID / API Key (admin key para indexação, search-only key para busca) via AWS Secrets Manager ou variável de ambiente da Lambda — nunca hardcoded.

### 4.2 Backend
- `algoliaSync/index.ts` (nova Lambda): recebe eventos do Stream (`INSERT`/`MODIFY`/`REMOVE`), mapeia para `algoliasearch` SDK (`saveObject`/`deleteObject`), usando `slug` como `objectID`.
- Índice Algolia: `searchableAttributes = ["titulo", "resumo"]`, `attributesToRetrieve` limitado aos campos que o card de resultado precisa (evita expor `conteudo_html` inteiro no índice).
- `searchPosts` (Lambda existente, refeita): troca `ScanCommand` por `index.search(term)` do SDK do Algolia.

### 4.3 Reindexação inicial (backfill)
- Script único (mesmo padrão de `scripts/backfill-lqip.mjs`/`scripts/backfill-gsi-markers.mjs`): scan completo da tabela `posts`, envia todos os itens existentes para o índice Algolia de uma vez (`saveObjects` em batch). Necessário porque o Stream só captura mudanças **a partir** do momento em que é habilitado — não retroage.

## 5. Critério de "zero perda de funcionalidade" (paralelo ao princípio usado na migração GSI)

- Resultado de busca para os mesmos termos testados deve retornar os mesmos posts antes/depois (validação manual com os termos reais usados em produção, se houver analytics, ou termos representativos do conteúdo).
- Filtro de `status = 'Publicado'` (hoje aplicado no `FilterExpression` do Scan) precisa ser replicado na configuração do índice Algolia (`filters: "status:Publicado"` na query, ou indexar só posts publicados e reindexar ao mudar status).

## 6. Estimativa de esforço

| Etapa | Tempo estimado |
|---|---|
| Terraform: Stream + Lambda sync + IAM | 45min |
| `algoliaSync` (Lambda nova) + testes | 1h |
| Reindexação inicial (script + execução) | 30min |
| `searchPosts` refeita (troca Scan → Algolia) + testes | 45min |
| Validação end-to-end (smoke test busca real) | 30min |
| **Total** | **~3h30min-4h** |

## 7. Gatilho de execução

Não implementar agora — volume atual (14 posts) não justifica a complexidade adicional (mais uma conta externa, dados duplicados entre DynamoDB e Algolia, mais uma Lambda para manter). Revisitar quando:
- O catálogo de posts crescer significativamente (referência original: 500+ posts), **ou**
- A latência da busca for percebida como problema real antes disso, **ou**
- Houver necessidade de features que o Algolia oferece de graça e o Scan atual não tem (typo tolerance, highlighting, facetas por categoria/autor) — pode ser motivo de implementação antecipada por valor de produto, não só performance.

## 8. Fonte interna

- Achado original: `docs/auditoria-engenharia/07-performance-e-escalabilidade.md`, item 1.
- Backlog: `CLAUDE.md` seção 10, item 16.
- Padrão de scripts de backfill/reindexação: `scripts/backfill-lqip.mjs`, `scripts/backfill-gsi-markers.mjs`.
- Padrão de IAM least-privilege para Lambdas novas: `infra/modules/lambda/lambda-iam.tf`.
