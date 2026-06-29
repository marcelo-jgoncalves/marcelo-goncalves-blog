# Auditoria de Performance — Fechamento (PERF1, PERF3, PERF6, PERF8)

> Data: 2026-06-28
> Categorias de fechamento do plano (`docs/plano-auditoria-performance.md`, seção 6, item 6) — análise/leitura, sem ferramenta nova. PERF1 usa um dado real coletado nesta sessão (DynamoDB scan, read-only).

## PERF1 — Seleção geral de arquitetura: TTLs de ISR vs. padrão real de atualização de conteúdo

**Dado real coletado:** `aws dynamodb scan` (read-only, profile `claude-dev`) sobre a tabela `posts`, projetando `data_publicacao`/`data_atualizacao`. Padrão observado: na grande maioria dos posts, `data_atualizacao` ocorre minutos a poucas horas depois de `data_publicacao` — consistente com o fluxo normal de salvar rascunho → revisar → publicar, não com edições recorrentes depois de publicado. Não há evidência de posts sendo editados repetidamente semanas/meses após publicados.

**Conclusão:** o `revalidate: 60` em posts individuais é mais agressivo do que o padrão real de atualização exigiria — o conteúdo é, na prática, quase imutável após publicado. Isso **não é um achado de correção** — ISR com TTL curto é barato (não há custo real diferenciado entre 60s e 300s nesse volume de tráfego) e errar para o lado de mais atualização é a escolha mais segura quando o padrão de edição não é 100% previsível (ex: correção de erro de digitação pós-publicação). Recomendação: manter como está; não vale o esforço de aumentar o TTL para um ganho que não existe no custo atual.

## PERF3 — Seleção de Storage (S3)

Sem achado. S3 é usado para assets estáticos (`media/`) e uploads — nenhum sinal, em nenhuma das categorias anteriores desta auditoria (PERF-LOAD, PERF2, PERF5, PERF-CWV), de que armazenamento seja um gargalo. Confirma a expectativa do plano original: baixa prioridade, sem necessidade de investigação adicional neste volume.

## PERF6 — Evolução (manter-se atualizado)

Confirmado por leitura direta do Terraform (`infra/modules/lambda/main.tf`, `infra/modules/frontend/lambda.tf`): runtime `nodejs20.x` consistente nas 9 Lambdas + Lambda SSR do frontend. Next.js 16 + OpenNext v3 já são as versões correntes do projeto (confirmado em `CLAUDE.md`, seção 11). Nenhuma dependência de performance desatualizada encontrada (ex: nenhum uso residual de AWS SDK v2). Sem achado.

## PERF8 — Trade-offs documentados

Well-Architected pede que trade-offs sejam declarados explicitamente, não só decididos. Registro formal dos três trade-offs relevantes desta auditoria:

| Trade-off | Decisão tomada | Por que é a escolha certa agora |
|---|---|---|
| `PAY_PER_REQUEST` vs. DynamoDB provisionado | `PAY_PER_REQUEST` | Confirmado com dado real nesta auditoria (PERF-LOAD): tráfego é baixo e em rajadas imprevisíveis (2-20 req/dia de CloudFront, picos de teste só sob carga sintética). Provisionar capacidade fixa pagaria por ociosidade na maior parte do tempo. |
| TTL de cache ISR (freshness vs. hit ratio) | 60s posts / 300s listagens / 3600s estáticas | Validado em PERF1: o padrão real de atualização de conteúdo é muito mais lento que o TTL escolhido — a decisão erra deliberadamente para o lado de mais freshness, e isso é apropriado porque o custo de TTL curto é desprezível neste volume (não há tráfego suficiente para o cache "valer a pena" de outra forma). |
| Pipeline de imagem eager (6 variantes por upload) vs. lazy/on-demand | Eager (todas as 6 geradas no upload) | Sem dado real desta auditoria para contestar — gerar todas as variantes antecipadamente custa um processamento previsível e único por upload (não recorrente), contra o risco de lazy gerar a mesma imagem repetidamente sob requisições concorrentes (thundering herd) sem um lock de geração. Eager é a escolha mais simples e segura para o volume e a equipe (1 dev) atuais. |

## Conclusão do fechamento

Nenhuma das 4 categorias produziu achado de correção — todas confirmam que as decisões já tomadas no projeto (TTL de cache, billing mode, pipeline de imagem, runtime) são apropriadas para o estágio e volume atuais. Isso fecha a auditoria de performance: das 9 categorias do plano original (PERF1-8 + PERF-LOAD/PERF-CWV como adições), 5 produziram achado real (`00-metodologia.md`), 4 confirmaram que o desenho atual está correto.
