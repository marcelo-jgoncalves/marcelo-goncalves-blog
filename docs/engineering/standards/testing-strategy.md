# Estratégia de testes

## Suítes por workspace

| Workspace | Runner | Comando |
|---|---|---|
| `backend/` | Jest | `npm test` |
| `backend/` | Jest + DynamoDB Local | `npm run test:integration` (handlers reais contra DynamoDB real, ver `src/integration/`) |
| `frontend/` | Jest | `npm test` |
| `admin/` | Vitest | `npm test` |
| `packages/contracts/` | Jest | `npm test` |
| `frontend/` | Playwright | `npm run test:e2e` (Chromium + Firefox) |

Contagens exatas de teste não são mantidas aqui — são deriváveis rodando a suíte; consulte o output do CI para o número atual.

`tsconfig.test.json` separado no backend com `"types": ["jest"]`.

`npm audit --audit-level=high` roda em cada job de CI. Zero high/critical tolerado. Vulnerabilidades moderate residuais aceitas como risco conhecido estão em `docs/operations/known-issues.md`.

## Validação proporcional ao risco (sessão 44, 2026-07-13)

Validar mudanças de frontend em nível proporcional ao risco, não uniformemente — screenshot/Playwright para toda edição pequena desperdiça tempo.

| Nível | Quando | Validação |
|---|---|---|
| 1 — sempre | Toda edição | `tsc --noEmit` + `eslint` |
| 2 — copy puro | Texto/label sem CSS | Só nível 1 |
| 3 — CSS local/escopado | Espaçamento, cor, tamanho num componente | `page.evaluate` com sweep de `getBoundingClientRect()` (overflow-check), não screenshot |
| 4 — mudança estrutural | Novo componente, grid/flex novo | 1 screenshot mobile (390px) + desktop (1440px) só da seção afetada |
| 5 — componente compartilhado | `PageHero`, `Footer`, `HeaderNav`, tokens em `globals.css` | Nível 4 + overflow-check em 2-3 páginas representativas |
| 6 — auditoria completa | Só sob pedido explícito de Marcelo | Full sweep das rotas |

`npm test`/e2e completos só rodam sob pedido explícito de Marcelo — não automaticamente após cada mudança. Typecheck continua sendo feito por padrão.

## Obrigação de prova por tipo de mudança

Ver a tabela equivalente em `docs/book/capture-protocol.md` (seção "Evidências mínimas") para o critério usado também na captura de aprendizado — a mesma lógica de proporcionalidade ao risco se aplica ao trabalho de produto em geral: cada tipo de mudança tem uma obrigação de prova mínima, e a suíte completa não é automaticamente exigida para toda alteração.
