# Investigação Focada de DynamoDB — Resultado

> Data: 2026-06-28
> Referência: `docs/plano-investigacao-dynamodb.md`.
> Método: comandos reais contra a conta de dev (`profile claude-dev`), nunca suposição — mesma disciplina das auditorias anteriores.

## 1. Modelo de consistência (eventual vs. fortemente consistente)

**Confirmado por código:** nenhum `GetCommand`/`QueryCommand` do projeto usa `ConsistentRead: true` — todas as leituras são eventualmente consistentes por padrão (`grep -rn "ConsistentRead" backend/src/` → 0 ocorrências).

**Teste real:** escrita seguida de leitura imediata (eventual + forte), 10 rodadas, contra um item de teste throwaway na tabela real de dev (removido ao final, sem afetar dados de produção):

```
round 1: wrote=1  eventual_read=1  (417ms)  strong_read=1  (522ms)  stale=false
round 2: wrote=2  eventual_read=2  (152ms)  strong_read=2  (173ms)  stale=false
...
round 10: wrote=10 eventual_read=10 (279ms)  strong_read=10 (154ms)  stale=false
```

**0 de 10 leituras eventuais ficaram desatualizadas.** A latência de rede do próprio cliente (150-450ms por round-trip) é muito maior que a janela real de replicação do DynamoDB (tipicamente sub-100ms) — na prática, qualquer leitura feita por uma requisição HTTP separada já chega depois da replicação terminar.

**Conclusão:** `getPostCounters()` pode continuar com consistência eventual (padrão, 0.5 RCU por leitura vs. 1 RCU com `ConsistentRead: true`). Não há achado de correção aqui — decisão validada com dado real, não só teórica. Documentado para não precisar reinvestigar isso depois.

## 2. Backup / Point-in-Time Recovery (PITR)

```
aws dynamodb describe-continuous-backups --table-name marcelo-goncalves-blog-dev-posts --profile claude-dev
→ PointInTimeRecoveryStatus: DISABLED
```

Confirmado também: nenhum bloco `point_in_time_recovery` em `infra/modules/dynamodb/main.tf` — coerente com o `DISABLED` real.

**Decisão do Marcelo (2026-06-28): PITR só deve ser ativado no ambiente de produção, quando ele for criado** — não em dev. Estado atual (desabilitado em dev) já está correto, nenhuma ação necessária agora.

**Recomendação registrada para quando prod existir:** adicionar `enable_point_in_time_recovery` como variável Terraform, seguindo o mesmo padrão já usado no projeto para `enable_xray_tracing`/`enable_cloudwatch_alarms`/`enable_guardduty` — `false` em `dev.tfvars`, `true` em `prd.tfvars` (que já existe como arquivo, mesmo sem o ambiente estar deployado ainda). Custo real: cobrança por GB-mês de dados protegidos (~$0.20/GB-mês em `us-east-1`) — desprezível no volume atual de conteúdo, mas é custo real, não gratuito como CloudTrail (1º trail) ou métricas básicas do CloudWatch.

## 3. Métricas CloudWatch específicas do DynamoDB

**Throttling (30 dias):** `ThrottledRequests` e `SystemErrors` retornaram **zero datapoints** — nenhum throttling, nenhum erro de sistema, em nenhum momento dos últimos 30 dias. Consistente com o resultado do teste de carga real (PERF-LOAD): "não é 429" passou 100% mesmo em 30 VUs simultâneas.

**Consumo real (7 dias):**

| Data | RCU consumido | WCU consumido |
|---|---|---|
| 2026-06-27 | 1.544 | 79 |
| 2026-06-21 a 26, 28 (exceto 27) | 0-1 | 0-7 |

O pico de 2026-06-27 corresponde exatamente ao dia em que o teste de carga k6 (PERF-LOAD) e a implementação/backfill do contador atômico foram executados nesta mesma sessão de trabalho — não é tráfego orgânico, é a nossa própria atividade de auditoria. Nos outros dias, consumo é praticamente zero — confirma com dado real (não só a métrica de `Requests` do CloudFront já vista em PERF5) que o tráfego orgânico atual é mínimo.

**Conclusão:** nenhum achado de correção. `PAY_PER_REQUEST` está absorvendo bem o volume atual, sem nenhum throttling registrado.

## 4. DynamoDB Streams como solução para o backlog #23 (reconciliação do contador)

**Estado atual confirmado:** `aws dynamodb describe-table` → `StreamSpecification: null` — Streams não está habilitado.

**Análise comparativa (Streams vs. cron de reconciliação):**

| Critério | DynamoDB Streams + Lambda | Cron de reconciliação (sugestão original do #23) |
|---|---|---|
| Resolve o problema na raiz? | Sim — captura toda mudança de `status`/`e_projeto` no nível do banco, **independente de qual código fez a escrita**. Um 4º caminho de escrita futuro não precisaria "lembrar" de nada — o stream já vê a mudança. | Não — só detecta divergência depois que ela já aconteceu (reativo, não preventivo). |
| Custo adicional | Pequeno e real: cobrança por leitura de stream (~$0.02/100k leituras) + invocação de Lambda por mudança. Para o volume atual (poucas escritas/dia), centavos/mês. | Uma Lambda + EventBridge rule (já é padrão usado no projeto via `postScheduler`) — custo equivalente ou menor, mas só roda periodicamente, não a cada escrita. |
| Complexidade operacional | Adiciona um componente assíncrono novo — depurar "por que o contador não bateu" fica 1 camada mais distante (stream → Lambda → erro silencioso possível). | Mais simples de entender e depurar — é só uma função que recalcula e compara, igual aos scripts de backfill já existentes no projeto. |
| Consistência com o padrão do projeto | Nenhum uso atual de Streams em nenhuma parte do projeto — seria a primeira vez. | Mesmo padrão já usado (`postScheduler` + EventBridge `rate(15min)`) — menor superfície nova para aprender/manter. |

**Recomendação:** cron de reconciliação (a sugestão original do #23), não Streams. Streams resolve o problema "na raiz" de forma mais elegante, mas introduz um padrão arquitetural novo no projeto (mais um componente assíncrono) para resolver um risco que, hoje, é teórico (nenhum 4º caminho de escrita existe ainda). Um cron simples que recalcula via Scan/Query e compara é consistente com o padrão já estabelecido (`backfill-post-counters.mjs` já faz exatamente esse recálculo — o job de reconciliação seria essencialmente agendar esse mesmo script). Reavaliar Streams se o número de Lambdas que escrevem `status`/`e_projeto` crescer (hoje são só 2: `adminPosts` e `postScheduler`).

## Resumo

| Ponto | Achado de correção? | Ação |
|---|---|---|
| 1. Consistência | Não — validado com dado real, decisão de manter eventual confirmada | Nenhuma |
| 2. PITR | Não em dev (correto, por decisão) — recomendação registrada para prod | Toggle Terraform quando prod for criado |
| 3. Métricas DynamoDB | Não — zero throttling, consumo mínimo confirmado | Nenhuma |
| 4. Streams vs. cron | Recomendação: manter o plano original do #23 (cron), não migrar para Streams | Atualizar #23 no backlog com essa decisão |
