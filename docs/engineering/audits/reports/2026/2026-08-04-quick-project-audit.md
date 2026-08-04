# Auditoria de consistência do projeto

## Metadados

| Campo | Valor |
|---|---|
| ID da auditoria | `PCA-20260804-QUICK` |
| Data | 2026-08-04 |
| Modo | `quick`, escopo expandido para a área `documentation`/`ci-cd` após achado crítico (ver metodologia §4.1) |
| Branch | `develop` |
| Commit | `7cd777a` (working tree com alterações não commitadas no momento do achado e da correção) |
| Working tree | dirty — mudanças da própria correção deste achado, mais trabalho anterior da mesma sessão (skill de auditoria, reorganização de artefatos), ainda não commitados |
| Versão da metodologia | 1 |
| Versão dos pesos | 1 |

## Escopo

Achado único, identificado durante a leitura obrigatória de fontes canônicas ao criar a skill `project-consistency-audit` (não uma execução formal do modo `full`). Escopo expandido, após a identificação, para: `CLAUDE.md`, `docs/engineering/standards/git-and-review-workflow.md`, `.github/workflows/*.yml`, `.claude/skills/*/SKILL.md`, `README.md`, `docs/README.md`, GitHub branch protection (via `gh api`).

## Limitações

Não é uma auditoria `full` — outras áreas (arquitetura, segurança, testes, IaC) não foram inspecionadas nesta execução. Não há nota global. `docs/book/cases/`, `docs/engineering/audits/`, `docs/engineering/prompts/archive/` e `docs/engineering/work-items/` foram varridos por grep de padrão textual, não lidos integralmente arquivo por arquivo.

## Veredito

Contradição real confirmada e corrigida na documentação; enforcement na plataforma (GitHub) ainda não existe — `develop` não tem branch protection configurada (`gh api repos/.../branches/develop/protection` → 404 "Branch not protected", verificado nesta execução). `main` não existe como branch remota (removida em sessão anterior), então sua proteção é N/A até ser recriada. A política documentada está alinhada entre as fontes revisadas; o controle é `review-dependent` na prática até a proteção ser configurada.

## Achados prioritários

### PCA-20260804-001 — Contradição de autoridade entre `CLAUDE.md` e `git-and-review-workflow.md` sobre push direto em `develop`

- Categoria: `source-authority-conflict`
- Área: `documentation`, `ci-cd`
- Severidade: `high`
- Confiança: `high`
- Estado: `resolved-after-audit` (documentação); enforcement de plataforma continua `open`/pendente — ver "Maturidade do controle" abaixo, o achado como um todo não está `resolved-after-audit` completo
- Fontes: `CLAUDE.md` §9 (antes da correção), `docs/engineering/standards/git-and-review-workflow.md` (antes da correção)
- Evidência observada: `CLAUDE.md` §9 (versão anterior a esta correção) exigia PR sempre ("nunca recebe commit direto"); `docs/engineering/standards/git-and-review-workflow.md` linha 8 (versão anterior) permitia "mudanças pequenas, isoladas e de baixo risco... diretamente em `develop`, como já era o padrão do projeto" — duas fontes canônicas do mesmo tema, afirmações opostas
- Interpretação: a segunda fonte documentava um padrão histórico real (commits diretos em `develop` eram, de fato, o fluxo usado neste projeto até a decisão de Gitflow enxuto de 2026-08-04) que não foi atualizado quando `CLAUDE.md` §9 mudou
- Impacto: risco de a IA (ou Marcelo) seguir a fonte mais permissiva e fazer push direto, violando a decisão vigente sem perceber conflito
- Limitação: não foi possível confirmar por que a atualização de `CLAUDE.md` (Gitflow enxuto, 2026-08-04) não propagou para o documento de detalhe na mesma sessão — não há registro que explique a lacuna, só a lacuna em si
- Próxima ação sugerida: configurar branch protection em `develop` no GitHub (ver checklist abaixo)
- Controle determinístico possível: sim — branch protection rule bloqueando push direto é enforcement automático (`automatically-blocking`), não depende de disciplina humana
- Caso do livro aplicável: candidato razoável (`case-methodology-issue`/`source-authority-conflict` com achado real, não hipotético, e decisão humana explícita registrada) — não aberto automaticamente nesta execução; avaliar com Marcelo se há valor pedagógico suficiente além do já registrado neste relatório

## Contradições entre fontes

| Tema | Fonte A | Fonte B | Contradição | Autoridade provável | Evidência | Ação necessária |
|---|---|---|---|---|---|---|
| Push direto em `develop` para mudanças pequenas | `CLAUDE.md` §9 (antes) — proibia | `docs/engineering/standards/git-and-review-workflow.md` (antes) — permitia | Sim, direta | `CLAUDE.md` (mais recente, 2026-08-04) | Leitura direta dos dois arquivos nesta sessão | Resolvida nesta execução — ambas as fontes agora proíbem push direto sem exceção por tamanho |

## Políticas e enforcement

| Política | Fonte | Maturidade (antes) | Maturidade (depois desta correção) | Detecção | Consequência | Evidência | Risco |
|---|---|---|---|---|---|---|---|
| PR obrigatório para toda alteração versionada | `CLAUDE.md` + `git-and-review-workflow.md` | `conflicting-documentation` | `review-dependent` | Nenhuma automática ainda | Nenhuma automática ainda | `gh api repos/marcelo-jgoncalves/mgoncalves-editorial-platform/branches/develop/protection` → 404 nesta execução | Médio — documentação agora consistente, mas nada impede tecnicamente um push direto até a branch protection ser configurada |

## Contexto e governança da IA

O achado nasceu da própria leitura obrigatória de fontes que a skill `project-consistency-audit` exige antes de agir (seção 1 do work item que criou a skill) — evidência de que a leitura obrigatória, por si só, já funciona como mecanismo de detecção `manual-inspection`, mesmo antes de a skill ter uma execução formal registrada.

## Reprodutibilidade

A correção documental está nos arquivos versionados normalmente (`CLAUDE.md`, `docs/engineering/standards/git-and-review-workflow.md`, `.github/workflows/cd.yml`, `.claude/skills/dev-hub/SKILL.md`) — reproduzível em qualquer clone. A branch protection do GitHub não é reproduzível via clone; depende de configuração manual na plataforma (ver checklist).

## Controles determinísticos sugeridos

Branch protection rule em `develop` (e futuramente `main`, quando recriada) exigindo PR antes do merge — ver checklist na seção seguinte. Isso transforma o controle de `review-dependent` para `automatically-blocking` sem depender de disciplina humana ou da IA lembrar da regra.

## Prioridades

1. Configurar branch protection em `develop` (ação externa, Marcelo).
2. Quando `main` for recriada, aplicar proteção igual ou superior.
3. Reavaliar o achado (`review`) depois da configuração, para fechar como `resolved-after-audit` completo.

## Itens resolvidos desde a avaliação anterior

Não aplicável — não há snapshot/relatório anterior comparável (este é o primeiro relatório real do sistema de auditoria).

## Novos riscos

Nenhum novo risco identificado além do já registrado no achado PCA-20260804-001.

## Questões que exigem decisão humana

Nenhuma nova — a decisão humana sobre a política em si já foi tomada e está registrada. A única ação pendente é operacional (configurar branch protection), não decisória.

## Potenciais casos para o livro

PCA-20260804-001 é candidato: contradição de autoridade real entre duas fontes canônicas do próprio projeto de governança de IA, descoberta pela IA durante leitura obrigatória, com decisão humana explícita e resolução parcial (documental) na mesma sessão, enforcement de plataforma ainda pendente — arco completo de detecção → decisão → correção parcial → limite explícito. Não aberto automaticamente; oferecido a Marcelo como sugestão.

## Arquivos gerados

Este relatório: `docs/engineering/audits/reports/2026/2026-08-04-quick-project-audit.md`. Nenhum snapshot YAML gerado (modo `quick`, sem nota global).
