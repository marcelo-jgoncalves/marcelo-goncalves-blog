---
id: POST-PLAN-2026-010
title: "Post 9 da série: Gestão de Dependências — \"O risco que documentamos já não é o risco real\""
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

<!-- Migrado de projects/publishing-content/postagens/10-criterio-gestao-de-dependencias.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 9 da série: Gestão de Dependências — "O risco que documentamos já não é o risco real"

## Títulos alternativos
- "`npm audit` mentiu para a documentação, não para a ferramenta"
- "A própria biblioteca que nos protege tem um CVE crítico"

## Tese central

"Risco aceito e documentado" é uma prática legítima — até virar desculpa para nunca mais rodar a verificação de novo. O post mostra esse exato ciclo: uma nota antiga registrava um conjunto específico de vulnerabilidades "moderadas, aceitas". Rodando a verificação de novo, hoje, o cenário real é outro — pacotes diferentes, severidades mais altas (alta e crítica), nos três workspaces — e quase tudo tinha correção disponível sem mudança breaking, esperando alguém rodar um comando.

## Por que importa

É a versão mais simples de demonstrar, com números reais, por que "documentamos o risco" tem validade — não é permanente. O leitor sai do post com uma pergunta prática para aplicar no próprio projeto: "quando foi a última vez que essa nota de risco aceito foi revalidada?"

## Storytelling sugerido

Abra com a comparação direta: o que a documentação do projeto dizia ("11 vulnerabilidades moderadas, aceitas, no aws-amplify") contra o que `npm audit --audit-level=high` mostrou ao ser executado de novo, agora — outros pacotes inteiramente, e com 1 crítica + 1 alta no backend, 4 altas no frontend, 1 crítica + 4 altas no admin. A mesma frase de aceite de risco continuava lá, intacta, descrevendo um problema que não era mais o problema real.

Segundo beat, o mais forte do post: a vulnerabilidade crítica do backend está na própria biblioteca que sanitiza o HTML de todo post antes de salvar no banco — `sanitize-html`, com um CVE nomeado publicamente. O allowlist explícito do projeto provavelmente já neutraliza esse vetor específico (a tag vulnerável não está na lista de tags permitidas) — mas não há razão para depender de uma versão com CVE crítico conhecido quando a correção não exige nenhuma mudança breaking.

Fechamento: o ponto não é "tivemos descuido" — é que `npm audit` é um comando, não um processo. Sem alguém (ou alguma automação) rodando e revisando com regularidade, o número documentado só existe no passado.

## Provas e exemplos reais

| Workspace | Total | Critical | High | Moderate | Low |
|---|---|---|---|---|---|
| backend | 22 | 1 | 1 | 19 | 1 |
| frontend | 26 | 0 | 4 | 21 | 1 |
| admin | 10 | 1 | 4 | 4 | 1 |

- Pacotes do achado atual não correspondem ao "aws-amplify@6" documentado: `vite`, `dompurify`, `shell-quote`, `js-cookie` (admin); `next`, `undici`, `ws`, `postcss`, `open-next`/`esbuild` (frontend); `sanitize-html`, `babel-jest` (backend).
- CVE crítico do backend: `sanitize-html@2.17.3`, advisory [GHSA-rpr9-rxv7-x643](https://github.com/advisories/GHSA-rpr9-rxv7-x643) — XSS via passthrough de `<xmp>`; a tag `xmp` não está em `ALLOWED_TAGS` (`backend/src/common/sanitizer.ts`), o que provavelmente já mitiga esse vetor específico no uso real do projeto.
- Praticamente todos os achados (de todos os 3 workspaces) têm `fix available via npm audit fix` — correção sem mudança breaking.
- `deploy.yml` roda `npm audit --audit-level=high` como gate em cada job de teste — confirma que um PR aberto agora falharia nesse step, nos 3 workspaces.
- Contraponto positivo real: Dependabot ativo e corretamente configurado (4 ecossistemas, semanal, agrupamento de minor/patch) — a infraestrutura para manter isso em dia já existe; o gap é de revisão periódica, não de tooling ausente.

## Conceitos a explicar

- **CVE/advisory de segurança**: identificador público (geralmente com link rastreável) de uma vulnerabilidade conhecida em uma versão específica de uma biblioteca.
- **`npm audit --audit-level=high`**: comando que falha (exit code != 0) se houver vulnerabilidade igual ou acima de "high" — usado como gate de CI.
- **Risco aceito (documentado)**: decisão consciente de não corrigir uma vulnerabilidade agora, com justificativa registrada — válida apenas até a próxima revisão; sem data de revalidação, vira uma afirmação permanente sobre um estado que naturalmente muda.

## Estrutura sugerida (H2s)

1. A nota de risco aceito que parou no tempo
2. O que `npm audit` mostra agora — e por que é outro problema, não o mesmo
3. O CVE crítico dentro da própria biblioteca de proteção
4. Por que quase tudo isso tinha correção fácil, esperando
5. "Documentamos o risco" não é o mesmo que "o risco está sob controle"

## Fecho / CTA

Fecha a série dos 9 critérios já auditados — aponta de volta para o post-âncora e anuncia os critérios restantes (Documentação, DX, Custo) como continuação.

## Fonte interna

`docs/auditoria-engenharia/09-gestao-de-dependencias.md`
