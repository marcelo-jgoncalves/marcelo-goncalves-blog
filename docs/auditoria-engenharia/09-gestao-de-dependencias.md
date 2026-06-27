# Auditoria de Engenharia — Critério 9: Gestão de Dependências

> Data: 2026-06-27
> Escopo: Dependabot, vulnerabilidades conhecidas vs. reais.
> Apenas análise (incluindo execução read-only de `npm audit`) — nenhuma dependência foi alterada nesta etapa.

## 🔴 Achados de alto impacto

### 1. `npm audit` real hoje é mais grave do que o documentado, nos 3 workspaces

A memória do projeto registra apenas "Admin: 11 moderate residuais em aws-amplify@6 — aceito como risco conhecido (fix exige downgrade breaking)". Rodando `npm audit --audit-level=high` agora (mesmo comando que `deploy.yml` executa em todo PR):

| Workspace | Total | Critical | High | Moderate | Low |
|---|---|---|---|---|---|
| backend | 22 | 1 | 1 | 19 | 1 |
| frontend | 26 | 0 | 4 | 21 | 1 |
| admin | 10 | 1 | 4 | 4 | 1 |

Nenhum destes corresponde ao "aws-amplify@6" documentado — são pacotes diferentes (`vite`, `dompurify`, `shell-quote`, `js-cookie` no admin; `next`, `undici`, `ws`, `postcss`, `open-next`/`esbuild` no frontend; `sanitize-html`, `babel-jest` no backend). **Todos têm `fix available via npm audit fix`** — ou seja, são corrigíveis sem mudança breaking, ao contrário do item documentado.

Como `deploy.yml` roda `npm audit --audit-level=high` como gate em cada um dos 3 jobs de teste, **um PR aberto agora contra `develop`/`main` falharia nos 3 workspaces** nesse step, antes mesmo de chegar aos testes.

### 2. O CVE crítico do backend está na própria biblioteca de sanitização de conteúdo

`sanitize-html@2.17.3` (a versão instalada, fixada via `^2.17.3` no `package.json`) tem o advisory crítico [GHSA-rpr9-rxv7-x643](https://github.com/advisories/GHSA-rpr9-rxv7-x643) — XSS via passthrough de `<xmp>`. A tag `xmp` não está no `ALLOWED_TAGS` do projeto (`backend/src/common/sanitizer.ts`), então o allowlist explícito provavelmente já mitiga esse vetor específico — mas é a biblioteca que protege todo conteúdo de post publicado, e está com um CVE crítico nomeado e não corrigido, com fix disponível sem breaking change. Vale corrigir mesmo que o vetor específico já esteja coberto pelo allowlist — não há razão para depender de uma versão com CVE crítico conhecido quando o upgrade é trivial.

## 🟡 Achados de impacto médio

### 3. A documentação de risco aceito está desatualizada

A nota "11 moderate em aws-amplify@6, aceito como risco" não reflete o estado real e não tem data de validação. Risco aceito documentado precisa de revisão periódica — hoje ele dá uma falsa sensação de que o quadro de vulnerabilidades é conhecido e estável, quando na verdade mudou (e piorou, em severidade) sem que a documentação acompanhasse.

## 🟢 Pontos positivos (manter)

- **Dependabot está ativo e correto** (`​.github/dependabot.yml`): 4 ecossistemas cobertos (backend, frontend, admin, GitHub Actions), execução semanal, agrupamento de minor/patch — a infraestrutura para manter isso em dia já existe.
- A grande maioria dos achados acima tem fix não-breaking disponível — o custo de resolver é baixo, é majoritariamente uma questão de rodar `npm audit fix` em cada workspace e validar os testes.
- O uso de allowlist explícito no sanitizer (em vez de confiar nos defaults do `sanitize-html`) já reduz a superfície de exploração do CVE crítico encontrado, mesmo antes de corrigir a versão.

## Resumo

O gap real não é "más decisões de dependência" — é que o `npm audit` não está sendo rodado/revisado com regularidade fora do CI, e quando o CI o roda, o resultado atual provavelmente já está vermelho. Isso é facilmente verificável e, pelos próprios resultados, facilmente corrigível: praticamente tudo tem fix automático disponível.

> Nota cruzada com o critério 4: ao investigar este critério, a última execução do pipeline `Deploy Pipeline (CD)` em `develop` apareceu como **falha** (não por causa de `npm audit` — o `cd.yml` não roda essa etapa — mas por cota de armazenamento de artefatos do GitHub Actions esgotada). Reportado em destaque na conversa por ser uma questão operacional urgente, fora do escopo desta auditoria de qualidade.
