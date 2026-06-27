# Auditoria de Engenharia — Critério 10: Documentação e Governança

> Data: 2026-06-27
> Escopo: `.project-context.md`, `docs/contract.md`, ausência de ADRs formais.
> Apenas análise — nenhum código/documentação foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. `docs/contract.md` está materialmente desatualizado e contradiz o `CLAUDE.md` (o documento operativo real)

A seção de Design System do `contract.md` não reflete o estado atual do projeto:

| Item | `contract.md` (desatualizado) | `CLAUDE.md` (atual, confirmado no código) |
|---|---|---|
| Fonte de display | "DM Sans... **Nunca** usar Space Grotesk" | "**Nunca** usar Space Grotesk ou DM Sans — foram removidos" |
| Fonte real no código | — | `frontend/app/layout.tsx:4`: `import { Inter, JetBrains_Mono }` — nenhum DM Sans |
| Paleta de cor | `--slate-50..500`, `--dark-900: #111827` (paleta antiga) | Sistema semântico de 2026 (`--surface-*`, `--text-default: #1E374C`, etc.) |
| `--space-4` | `40px` | `32px` (40px agora é `--space-content`) |

Ou seja: **um leitor (humano ou IA) que siga literalmente o `contract.md` hoje escreveria CSS errado** — usaria a fonte errada e o valor de espaçamento errado, porque o documento nunca foi atualizado depois do redesenho do sistema editorial (sessão 30+). O próprio `contract.md` define uma hierarquia de "fonte da verdade" (código > infra > pipeline > `.project-context.md` > documentação > blueprint) — mas não resolve o problema de **dois documentos de governança discordando entre si**, sem indicar qual prevalece.

## 🟡 Achados de impacto médio

### 2. Não existe README na raiz do repositório; os READMEs de workspace são boilerplate não customizado e ativamente incorreto

Não há `README.md` na raiz — a página inicial do repositório no GitHub não tem nenhuma descrição do projeto. `frontend/README.md` é o boilerplate padrão do `create-next-app`, sem nenhuma edição: menciona a fonte **Geist** (o projeto usa Inter) e instruções de **deploy na Vercel** (o projeto deploya via OpenNext + Lambda + CloudFront, não Vercel). Não é só "documentação faltando" — é documentação presente e **errada** para quem chegar ao repositório sem contexto prévio.

### 3. Nenhum ADR (Architecture Decision Record) formal

Decisões arquiteturais importantes (escolha de monorepo, modelagem DynamoDB de tabela única por entidade, OpenNext em vez de Vercel/Amplify Hosting) vivem espalhadas em `.project-context.md` (log por sessão) e comentários de código, não em registros indexados e específicos de decisão. Funciona para quem participou das sessões; é mais difícil de navegar para reconstituir "por que decidimos X" sem reler todo o histórico.

## 🟢 Pontos positivos (manter)

- **`.project-context.md` é mantido de forma real e consistente** — confirmado: entradas detalhadas por sessão, com hashes de commit reais, lições aprendidas e estado explícito ("COMMITADO e em `develop`, prod pendente de aprovação manual"). É a exceção, não a regra, em projetos solo — vale reconhecer.
- **`docs/audit-report.md` e `docs/seo-audit.md`** funcionam como rastreadores vivos de dívida técnica/checklist — uma fonte única visível em vez de conhecimento tribal disperso.
- **`CLAUDE.md` (o documento que de fato é carregado a cada sessão) está atualizado e é a fonte operativa real** — o problema de governança está no documento secundário (`contract.md`), não no principal.

## Resumo

O padrão deste critério é o mesmo já visto em outros (infra, dependências): existe um documento que declara a regra, e a regra não foi revalidada contra a realidade. A diferença aqui é que o documento desatualizado (`contract.md`) compete diretamente com o documento atualizado (`CLAUDE.md`) — sem uma delimitação clara de qual obedecer quando os dois discordam.
