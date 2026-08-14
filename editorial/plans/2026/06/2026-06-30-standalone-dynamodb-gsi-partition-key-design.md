---
id: POST-PLAN-2026-016
schema_version: "1.0"
title: "Hot Partitions Invisíveis — Por que sua GSI com Partition Key de 2 Valores Vai Falhar em Produção"
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

<!-- Migrado de projects/publishing-content/postagens/16-standalone-dynamodb-gsi-partition-key-design.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "Hot Partitions Invisíveis — Por que sua GSI com Partition Key de 2 Valores Vai Falhar em Produção"

## Títulos alternativos
- "A Armadilha de Design: Quando sua GSI tem Apenas Uma Partição Física"
- "DynamoDB GSI: Por que `e_popular: 0 | 1` é uma bomba relógio"

## Tese central

Um erro comum no design de Global Secondary Indexes (GSI) em DynamoDB é usar uma partition key com baixa cardinalidade (ex: um campo booleano, um enum com 2-3 valores, um status que só pode ser `active`/`inactive`). O blog marcelo-goncalves-blog cometeu exatamente isso: `e_popular` e `e_projeto` são campos `Number` restritos a 0 ou 1, usados como partition key de duas GSIs diferentes. Isso funciona com 13 posts. Mas em produção, com tráfego real e 500-1000 posts, todos os dados caem em uma única partição física da AWS, causando throttling.

O post explica o problema, por que parece funcionar até não funcionar mais, como detectar, e como migrar dados sem perda (mesmo em produção, com estratégias de zero-downtime se necessário).

## Por que importa

1. **Não é teórico**: a maioria dos sistemas com DynamoDB encontrará esse padrão (status, flags, enums). Muitos não sabem que o problema existe até falhar.
2. **O sinal de alerta é tardio**: com <1000 itens, DynamoDB automaticamente "compensa" uma partition key ruim. Mas entre 1k-10k itens, o throttling começa sem aviso prévio. Até então, logs de CloudWatch dizem "tudo bem", mas latência sobe.
3. **A solução é não-óbvia**: redesenhar a GSI exige migração. Não é só corrigir código — é redesenho de infra, novo índice, replicação de dados.

## Storytelling sugerido

Comece com a cena concreta: durante a auditoria de engenharia, descobrimos que duas GSIs do blog usavam partition key com 2 valores cada. "Espera, isso devia ter quebrado", dirá o leitor. Depois revela o por quê ainda não quebrou: 13 posts, tabela inteira cabe numa única partição, AWS distribui a carga manualmente até o limite. Mas logo muda.

Próximo painel: mostre o que acontece quando chega a 500 posts. Trace de latência em CloudWatch Alarms, contagem de `ConsumedWriteCapacityUnits` concentrada num único `PartitionKeyValue`, e throttling. Deixe o leitor sentir o "ah, é por isso" antes de entrar na migração.

Último painel: o walkthrough completo. Export → Import → Validação. Dados não foram perdidos. Sistema agora escala.

## Provas e exemplos reais

**Estado atual do blog (2026-06-27):**
- Tabela `marcelo-goncalves-blog-dev-posts`
- 13 posts
- 2 GSIs problemáticas: `idx_e_popular` e `idx_e_projeto`
  - `idx_e_popular`: partition key = `e_popular` (0 ou 1)
  - `idx_e_projeto`: partition key = `e_projeto` (0 ou 1)
- Ambas usadas em queries tipo `getPostsByPopularity()` e `getPostsByCategory()` (backend)

**O problema em números:**
- Com 13 posts: 6-7 posts caem na partição `e_popular=1`, 6-7 em `e_popular=0`
- Com 1000 posts estimados: ~500 em `e_popular=1`, ~500 em `e_popular=0`
- DynamoDB aloca 100 WCU por padrão. Uma única partição consegue usar ~30-40 WCU sustentadamente. Acima disso: throttling, `ProvisionedThroughputExceededException`

**Código atual (backend):**
```typescript
// backend/src/functions/getPosts/index.ts
// Usa a GSI com partition key ruim
const result = await dynamodb.query({
  IndexName: 'idx_e_popular',
  KeyConditionExpression: 'e_popular = :pop',
  ExpressionAttributeValues: {
    ':pop': 1  // Todos os "populares" caem numa partição
  }
});
```

## Conceitos a explicar

1. **Partition Key vs Sort Key**: partition key distribui dados entre partições físicas; sort key ordena dentro de uma partição. Uma partition key ruim concentra tudo num lugar.

2. **Hot Partition**: uma partição recebendo mais de 1/Nth da carga total, onde N = número de partições do índice. Causa throttling mesmo com WCU disponível globalmente.

3. **Cardinalidade**: número de valores únicos. Uma partition key com cardinalidade baixa (ex: 2 valores) é sempre um sinal de alerta.

4. **DynamoDB Export + Import**: AWS permite exportar snapshot de uma tabela para S3 em formato Parquet, depois importar em uma nova tabela com schema diferente. Sem downtime se feito com cuidado.

5. **Validação de completude**: como garantir que nenhum item foi perdido na migração (item count, checksum de `conteudo_html`, spot-check aleatório).

## Estrutura sugerida (H2s)

1. **A Armadilha Silenciosa: Partition Keys com Dois Valores**
   - Introduz o problema com o exemplo real do blog
   - Por que parece funcionar com 13 posts
   - O gráfico de latência quando chega a 500

2. **Como Detectar: CloudWatch Alarms e Logs**
   - `ConsumedWriteCapacityUnits` concentrado num `PartitionKeyValue`
   - Query latency em Insights
   - Reproduzindo em dev com carga simulada

3. **A Causa Raiz: Concentração de Dados em Uma Partição Física**
   - Explicar internals do DynamoDB (partições, WCU distribution)
   - Por que `cardinalidade << item count` = problema

4. **Soluções: Redesign da GSI**
   - Opção 1: Adicionar um atributo com alta cardinalidade (ex: mês de criação)
   - Opção 2: Separar em duas tabelas (menos recomendado)
   - Opção 3: Usar um prefixo aleatório (last resort)

5. **Migração Sem Perda: Export + Import em 6 Passos**
   - Criar nova tabela com schema correto
   - Export da tabela atual para S3
   - Import S3 para nova tabela
   - Validar completude (item count, spot-check)
   - Cortar tráfego (atualizar env vars, redeploy)
   - Deletar tabela antiga

6. **Validação: Prova de que Nenhum Dado foi Perdido**
   - Comparação item count antes/depois
   - Checksum de linhas críticas
   - Query contra nova tabela retorna os mesmos resultados

7. **Takeaway: O Padrão Recorrente (Gancho para Série de Auditoria)**
   - Este erro é um exemplo de "desenho correto, vigilância pendente"
   - Mesmo padrão de alarmes CloudWatch desligados, X-Ray não validado, etc.
   - Como detectar isso na code review antes de ir para produção

## Fecho / CTA

"Este problema foi descoberto durante uma auditoria completa do blog. Há outras bombas relógio similares esperando volume real de produção para detonar. Se você auditou seu próprio DynamoDB recentemente, talvez encontre algo parecido. Deixa nos comments qual erro de design escondido você encontrou e não tinha percebido."

## Fonte interna

- Estado atual da tabela: `marcelo-goncalves-blog/backend/src/functions/getPosts/index.ts` (queries GSI)
- Auditoria completa: `docs/auditoria-engenharia/08-performance-e-escalabilidade.md`
- Terraform schema: `infra/modules/dynamodb/main.tf` (definição das GSIs)
- Migração será documentada em sessão 50: `marcelo-goncalves-blog/.project-context.md`

## Relação com o post #17

Este post tem um irmão mais amplo: `17-standalone-ledger-de-tradeoffs-escolha-de-servico.md`. O #17 usa este mesmo achado (GSI de baixa cardinalidade) como **um dos três exemplos** de uma tese maior — que escolher um serviço de infraestrutura é assinar um conjunto de trade-offs que se manifestam de formas diferentes ao longo do projeto, não uma decisão "boa ou má" isolada. Este post (#16) é o mergulho técnico completo nesse achado específico, com walkthrough de migração real; o #17 é o panorama, sem profundidade de implementação.

**Ordem de publicação sugerida:** #17 primeiro (contextualiza a tese ampla, gera interesse), #16 depois (aprofunda para quem quer o detalhe técnico). Na abertura deste post, considerar citar o #17 como "este achado é um exemplo do padrão mais amplo discutido em [link]".

## Notas de escrita

- Evitar abstrair: use números reais (13 posts → 500 posts), nomes reais de arquivo (`getPosts/index.ts`), valores reais (100 WCU, 30-40 WCU por partição).
- Tone: engenheiro sênior explicando um problema que viu acontecer, não "10 dicas". Sem medo de afirmar "isso vai quebrar".
- Validação: antes de publicar, confirmar que a migração em dev funcionou e dados não foram perdidos. O post não é promessa vaga — é documentação de um fix real.
