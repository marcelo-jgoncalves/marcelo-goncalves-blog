# Princípios de engenharia (DRY, KISS, YAGNI)

Projeto é majoritariamente funcional (Lambdas, componentes React/Vue funcionais) — SOLID não se aplica bem aqui e não deve ser forçado. Três princípios guiam decisões reais do projeto e devem continuar guiando, sempre com julgamento de custo/risco, nunca como regra cega.

## DRY

Motivação por trás dos componentes reutilizáveis do design system (`Pill`, `Kicker`/`IndexNumber`, `IconTile`, `FaqSection`, `BeneficiosSection`, `FullwidthCallout`, ver `docs/backlog.md`).

**Contrapeso deliberado**: CSS legado duplicado (177 arquivos `.css` globais, ex-sistemas de botão) não é migrado retroativamente só por causa de duplicação — risco de regressão visual maior que o ganho.

## KISS

Motivação por trás de escolher a solução mais simples que resolve o problema atual:

- Algolia em vez de OpenSearch (busca).
- cron+Lambda em vez de DynamoDB Streams para reconciliação de contador.
- CloudFront invalidation (fase simples) em vez da infraestrutura completa de on-demand revalidation.

## YAGNI

Não construir capacidade antes de um gatilho real de necessidade. Exemplos com gatilho explícito documentado para revisitar: as três decisões KISS acima; `icone_fa`/assets de `/sobre` implementados na origem mas com a *seção* de consumo deliberadamente não construída até decisão de Marcelo.

## Como aplicar

Antes de introduzir uma abstração nova, uma migração retroativa ou uma capacidade não solicitada: identifique o gatilho real de necessidade. Ausência de gatilho é motivo para não construir ainda, não para justificar preventivamente.

Histórico e exemplos completos (com commits e datas) vivem no Git e em `docs/backlog.md` — não duplicados aqui.
