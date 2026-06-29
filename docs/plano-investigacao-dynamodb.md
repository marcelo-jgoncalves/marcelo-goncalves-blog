# Mini-Plano — Investigação Focada de DynamoDB (4 pontos)

> Status: **✅ executado em 2026-06-28.** Resultado completo em `docs/investigacao-dynamodb.md`. Nenhum achado de correção nos pontos 1 e 3; PITR confirmado desabilitado em dev (correto, por decisão); recomendação registrada para o #23 (manter cron, não migrar para Streams).
> Diferença em relação a uma auditoria completa: o DynamoDB já foi olhado 3 vezes por outros ângulos — engenharia geral (`docs/auditoria-engenharia/07-performance-e-escalabilidade.md`), performance dedicada com teste de carga real (`docs/auditoria-performance/`, PERF4) e AppSec (criptografia/SSE, `docs/auditoria-appsec/`). Reabrir tudo de novo teria taxa de achado novo baixa. Este não é um plano de auditoria — é uma investigação **direcionada só aos 4 pontos que genuinamente não foram verificados ainda**, proporcional ao que falta, não ao que já foi coberto.

## Objetivo

Confirmar (com comando real, não suposição) 4 pontos específicos do DynamoDB que ficaram fora do escopo das 3 auditorias anteriores, e decidir se algum gera achado de correção.

## Os 4 pontos

### 1. Modelo de consistência (eventual vs. fortemente consistente)

**Por que agora:** `postCounters.getPostCounters()` (implementado nesta mesma sessão) faz um `GetCommand` sem `ConsistentRead: true` — por padrão, DynamoDB SDK lê com consistência eventual. Logo após um `ADD` (em `applyCounterDeltas`), uma leitura imediata em outra requisição pode, em teoria, ver o valor anterior por uma janela de replicação entre partições (tipicamente sub-segundo, mas não é instantâneo).

**O que verificar:**
- Revisar todos os `GetCommand`/`QueryCommand` do projeto e confirmar se algum cenário realista (ex: admin salva um post e a página seguinte já precisa do contador atualizado na mesma sessão) exigiria `ConsistentRead: true`.
- Testar na prática: escrever e ler o contador imediatamente em sequência, repetidas vezes, contra a tabela real de dev, para ver se a janela de inconsistência é observável no padrão de uso atual.
- Decidir e **documentar explicitamente** (mesmo padrão de trade-off já usado no resto do projeto): aceitar consistência eventual (mais barato, 0.5 RCU vs. 1 RCU por leitura) ou forçar `ConsistentRead: true` só no `getPostCounters()`.

**Método:** leitura de código + 1 teste real escrita→leitura imediata contra dev.

### 2. Backup / Point-in-Time Recovery (PITR)

**Por que agora:** existe um script de backup manual (`scripts/backup-posts-table.mjs`, rodado pontualmente antes de migrações), mas nunca foi confirmado se o PITR nativo da AWS (proteção contínua, restauração a qualquer segundo dos últimos 35 dias, sem exigir rodar nada manualmente) está habilitado.

**O que verificar:**
```bash
aws dynamodb describe-continuous-backups --table-name marcelo-goncalves-blog-dev-posts --profile claude-dev
```
- Confirmar se `PointInTimeRecoveryStatus` é `ENABLED` ou `DISABLED`.
- Checar `infra/modules/dynamodb/main.tf` por um bloco `point_in_time_recovery` (provavelmente ausente, já que nunca foi mencionado em nenhuma auditoria).
- Se desabilitado: avaliar custo (PITR cobra por GB armazenado de backup contínuo — desprezível no volume atual) vs. benefício (proteção real contra delete/corrupção acidental, inclusive humana — ex: um `DeleteCommand` em produção sem querer).

**Método:** AWS CLI real (read-only, gratuito) + leitura do Terraform.

### 3. Métricas CloudWatch específicas do DynamoDB

**Por que agora:** PERF7 (auditoria de performance) já confirmou métricas básicas de **Lambda** (`Duration`) e **CloudFront** (`Requests`) — nunca consultamos as métricas nativas do **DynamoDB** (`ConsumedReadCapacityUnits`, `ConsumedWriteCapacityUnits`, `ThrottledRequests`, `SystemErrors`), que também são gratuitas e sempre emitidas.

**O que verificar:**
```bash
aws cloudwatch get-metric-statistics --namespace AWS/DynamoDB --metric-name ThrottledRequests \
  --dimensions Name=TableName,Value=marcelo-goncalves-blog-dev-posts \
  --start-time <7d atrás> --end-time <agora> --period 86400 --statistics Sum \
  --profile claude-dev
```
- Repetir para `ConsumedReadCapacityUnits`/`ConsumedWriteCapacityUnits` (confirma o padrão real de consumo, complementa o teste de carga sintético do PERF-LOAD com dado de uso orgânico).
- Se houver qualquer `ThrottledRequests > 0` nos últimos 7-30 dias, é achado real (mesmo em `PAY_PER_REQUEST`, picos muito agressivos podem ser throttled brevemente).

**Método:** AWS CLI real, mesma técnica já usada em PERF7.

### 4. DynamoDB Streams como solução para o backlog #23 (reconciliação do contador)

**Por que agora:** o backlog #23 (`CLAUDE.md`) registra que o contador atômico (`postCounters.ts`) não tem nenhum mecanismo que detecte um futuro caminho de escrita que esqueça de atualizá-lo. Um job de reconciliação por cron foi a sugestão original — mas DynamoDB Streams pode ser uma solução mais elegante: uma Lambda assina o stream da tabela `posts`, vê toda mudança de `status`/`e_projeto` no nível do banco (não no nível do código de cada Lambda), e mantém o contador correto **independente de qual código fez a escrita**.

**O que verificar (análise/desenho, não implementação):**
- Custo real de habilitar Streams (cobrança por leitura de stream — pequena, mas existe) vs. custo de um cron de reconciliação (Lambda + EventBridge, já é um padrão usado no projeto via `postScheduler`).
- Trade-off de complexidade: Streams resolve o problema na raiz (não depende de lembrar de chamar uma função), mas adiciona um componente assíncrono novo (debugar "por que o contador não atualizou" fica 1 camada mais distante).
- Conclusão esperada: recomendação documentada (Streams vs. cron), não implementação nesta rodada.

**Método:** análise comparativa, sem código novo.

## Metodologia

Mesma disciplina já estabelecida nas auditorias anteriores: comando real contra a conta de dev (`profile claude-dev`), nunca suposição. Tudo read-only exceto o teste de consistência do ponto 1 (escreve e lê de propósito, sem efeito colateral real no dado).

## Entregável

Um único arquivo (`docs/investigacao-dynamodb.md`) com os 4 pontos e suas conclusões — não uma pasta com múltiplas categorias como as auditorias maiores, proporcional ao tamanho real do trabalho.

## Estimativa de esforço

~1h15, divisível: ponto 1 (~30min, inclui o teste real) + ponto 2 (~15min) + ponto 3 (~15min) + ponto 4 (~15min, só análise).

## Fora de escopo (já coberto em outro lugar, não reabrir)

- GSI `projection_type = "ALL"` (backlog #13) — já documentado, decisão de timing já tomada.
- `searchPosts`/Algolia (backlog #16) — já tem plano próprio.
- Qualquer novo teste de carga — PERF-LOAD já fez isso; este plano só consulta métricas de uso real, não gera carga sintética nova.

## Fonte interna

- `docs/auditoria-performance/02-perf7-perf2-perf5.md` (método de consulta de métricas já estabelecido)
- `backend/src/common/postCounters.ts` (ponto 1 e 4)
- `CLAUDE.md` backlog #23 (ponto 4)
- `scripts/backup-posts-table.mjs` (ponto 2, contexto do backup manual existente)
