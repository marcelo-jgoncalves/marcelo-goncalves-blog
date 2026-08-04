# Problemas conhecidos

> last_verified: 2026-08-04. Itens aqui afetam a operação ou o comportamento atual — trabalho planejado não iniciado vive em `docs/backlog.md`, não aqui.

## Vulnerabilidades residuais aceitas

- **Admin**: 0 vulnerabilidades conhecidas.
- **Backend**: vulnerabilidades moderate residuais via `js-yaml` (dependência de `jest`/`istanbul`, dev-only) — aceito como risco conhecido; fix exigiria downgrade breaking de `ts-jest`.
- **Frontend**: vulnerabilidades moderate residuais via `esbuild`/`open-next`, `js-yaml`/`ts-jest`, `postcss`/`next` — aceito como risco conhecido; fix exigiria downgrade para versões inviáveis (`next@9` ou `open-next@0.0.1`).

`npm audit --audit-level=high` roda em CI e é obrigatório zerar high/critical — os itens acima são todos moderate ou abaixo.

## CloudFront do admin mascara 403 do Lambda Authorizer

O `custom_error_response` da distribution do admin (configurado para SPA routing) é distribution-wide e mascara um 403 real do Lambda Authorizer com o `index.html` do SPA. Sem impacto de segurança — é um bug de robustez/UX. Correção exigiria CloudFront Function; deferida.

## `postCounterReconciler` sem DLQ/alarme próprio

Diferente dos outros dois Lambdas assíncronos (`imageProcessor`/`postScheduler`), a Lambda de reconciliação diária de contadores não tem DLQ/alarme dedicado ainda. Risco considerado baixo (job de auto-cura diário). Ver `docs/backlog.md` para o item de acompanhamento.
