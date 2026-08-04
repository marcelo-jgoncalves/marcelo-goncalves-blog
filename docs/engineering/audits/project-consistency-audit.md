# Metodologia — Auditoria de consistência do projeto

> Fonte canônica da metodologia. A skill operacional (`.claude/skills/project-consistency-audit/SKILL.md`) aplica estas regras e não as duplica integralmente.

## 1. Objetivo

Auditar a coerência entre intenção, documentação, contexto operacional, implementação, evidências e controles executáveis deste projeto. A auditoria não é um mecanismo que "dá notas" — é um auditor de coerência que produz achados priorizados, contradições explícitas entre fontes e um retrato comparável ao longo do tempo.

## 2. Escopo

Cobre: fontes canônicas de documentação, código de aplicação, infraestrutura como código, CI/CD, contratos e monorepo, contexto operacional e governança da IA, estudos de caso do livro, e o estado do Git. Não cobre: decisões de produto puramente de negócio, qualidade de copy/conteúdo editorial, ou correção de achados (isso é tarefa separada).

## 3. Comportamento não corretivo

A auditoria é **não corretiva por padrão**. Pode ler, executar comandos de inspeção, comparar commits, gerar relatório e snapshot, registrar limitações e sugerir tarefas posteriores. Não pode corrigir código ou documentação, reorganizar arquivos, alterar workflows/infraestrutura, instalar dependências, fazer commit, push, abrir PR, ou atualizar notas anteriores. Qualquer remediação ocorre em tarefa separada, decidida por Marcelo.

Os únicos arquivos que uma execução normal pode criar:

```text
docs/engineering/audits/reports/<ano>/<data>-<modo>-project-audit.md
docs/engineering/audits/snapshots/<ano>/<data>-<modo>-scores.yaml
```

Em modo `quick` esses arquivos são opcionais.

## 4. Modos

```text
/project-consistency-audit quick
/project-consistency-audit full
/project-consistency-audit delta
/project-consistency-audit area <area>
```

### 4.1 `quick`

Checkpoint frequente e de baixo custo, focado no diff atual e nas mudanças recentes. Verificações mínimas: links/caminhos citados, contradições evidentes, arquivos canônicos inexistentes, regras duplicadas, comentários obsoletos próximos ao código alterado, status incoerentes em casos, referências a artefatos ignorados, mudanças estruturais sem atualização documental, contexto temporário em fonte durável, problemas introduzidos no diff atual.

Regras: não recalcula nota global por padrão; não percorre todo o histórico; deixa explícito o escopo não inspecionado; produz lista priorizada de até 10 achados; salva relatório só quando solicitado ou quando o comando incluir intenção clara de preservação. Se encontrar um problema crítico, pode expandir só a área afetada, declarando a expansão.

### 4.2 `full`

Auditoria ampla do estado atual (antes de release, revisão mensal, preparação de portfólio, avaliação estrutural profunda). Avalia todas as áreas da seção 8. Produz relatório e snapshot, registra baseline (branch/commit/working tree), declara limitações, não corrige achados nem altera nada fora dos artefatos de auditoria. Não declara "produção pronta" sem evidência operacional real.

Sequência: registrar baseline → inventariar fontes → executar checks disponíveis → analisar código e documentos → construir matriz de contradições → avaliar enforcement → avaliar contexto → avaliar casos → calcular notas → comparar baseline anterior → gerar relatório → gerar snapshot → listar limitações → parar sem corrigir.

### 4.3 `delta`

Compara o estado atual com a avaliação anterior comparável. Localiza o snapshot mais recente aplicável, valida se a rubrica é compatível, compara notas por área, identifica evidências novas, registra itens resolvidos e novos problemas, distingue melhoria real de mudança de escopo/rubrica. Nunca reescreve o relatório anterior; produz novo relatório e snapshot; explica quando não houver baseline comparável. Não atribui evolução numérica sem evidência concreta. Recalcula somente as áreas inspecionadas nesta execução; evita narrativa de progresso quando a evidência for apenas documental.

### 4.4 `area <area>`

Audita somente uma área, útil após uma mudança específica. Áreas válidas:

```text
architecture, infrastructure, ci-cd, security, tests, application-code,
contracts, documentation, production-readiness, context, ai-governance,
book-cases, reproducibility
```

Área desconhecida: a skill informa que a área não é reconhecida, lista as áreas válidas e não inventa uma auditoria genérica no lugar. O relatório indica área auditada, áreas não auditadas, interfaces com outras áreas, nota da área quando aplicável, e a impossibilidade de atualizar a nota geral sem auditoria abrangente.

## 5. Fontes por auditoria

Proporcionais ao modo; no modo `full`, avaliar quando existirem:

- **Código e contratos**: `backend/`, `frontend/`, `admin/`, `packages/`.
- **Infraestrutura**: `infra/` (usar os caminhos reais encontrados).
- **CI/CD**: `.github/workflows/`.
- **Documentação**: `README.md`, `docs/`, `frontend/docs/`, `backend/README.md`, `admin/README.md`, `infra/README.md`.
- **Contexto e IA**: `CLAUDE.md`, `.project-context.md`, `memory/`, `.claude/skills/`.
- **Gestão do trabalho**: `docs/backlog.md`, `docs/engineering/decisions/`, `docs/book/cases/`, `docs/book/cases/evidence/`.
- **Estado do Git**: branch, HEAD, working tree, arquivos ignorados relevantes, histórico recente, commits de mudanças estruturais.

Nunca presumir que um arquivo existe — verificar antes de citar.

## 6. Categorias de problema

```text
source-authority-conflict, documentation-drift, stale-reference, broken-reference,
undocumented-change, non-executable-policy, context-bloat, temporary-state-in-durable-source,
duplicated-derived-fact, unversioned-canonical-dependency, reproducibility-gap,
workflow-policy-conflict, case-methodology-issue, unsupported-attribution,
overstated-causality, score-evidence-gap, missing-observability, missing-enforcement,
architecture-documentation-gap, production-readiness-gap
```

Novas categorias só com definição explícita no relatório que as introduz.

### Formato de um achado

ID estável no relatório: `PCA-YYYYMMDD-NNN`.

```markdown
## PCA-YYYYMMDD-NNN — <título>

- Categoria:
- Área:
- Severidade:
- Confiança:
- Estado:
- Fontes:
- Evidência observada:
- Interpretação:
- Impacto:
- Limitação:
- Próxima ação sugerida:
- Controle determinístico possível:
- Caso do livro aplicável:
```

## 7. Severidade

- **`critical`**: risco imediato de segurança, perda de dados, deploy incorreto ou operação inválida; fonte canônica induzindo comportamento perigoso; controle essencial ausente com exposição concreta.
- **`high`**: contradição que pode causar implementação errada; documentação operacional incorreta; processo não reproduzível em parte essencial; falsa sensação de proteção; regressão relevante.
- **`medium`**: deriva que aumenta retrabalho; inconsistência sem dano imediato; regra dependente de revisão; documentação incompleta; risco moderado de decisão errada.
- **`low`**: melhoria de clareza; referência pouco precisa; redundância limitada; dívida sem impacto imediato.
- **`informational`**: oportunidade, observação, recomendação não urgente, potencial para estudo de caso.

Severidade nunca é baseada apenas na quantidade de arquivos afetados.

## 8. Confiança e qualidade de evidência

Confiança de cada achado: `high | medium-high | medium | low | unknown`, considerando evidência direta, cobertura da inspeção, capacidade de reprodução, ambiguidade, dependência de inferência, ausência de arquivos locais, impossibilidade de executar testes.

Tipo de evidência: `direct-code | direct-config | direct-documentation | git-history | automated-check | manual-inspection | self-reported | inference | external-verification`.

Nunca usar confiança `high` quando a conclusão depender predominantemente de inferência.

## 9. Rubrica de notas

Escala de 0 a 10:

```text
0 — inexistente ou quebrado
2 — ad hoc e altamente frágil
4 — parcialmente implementado, inconsistências relevantes
6 — funcional, mas com lacunas importantes
8 — forte, consistente e bem sustentado
9 — muito maduro, poucas limitações relevantes
10 — exemplar, comprovado e sem lacunas materiais conhecidas
```

Notas acima de 9 exigem evidência forte, consistência, controles, validação e poucas limitações materiais. Não usar décimos sem justificativa explícita.

## 10. Áreas e pesos

```yaml
architecture: 14
infrastructure_as_code: 11
ci_cd: 11
security: 11
tests: 11
application_code: 11
contracts_and_monorepo: 9
documentation: 8
production_readiness: 7
context_and_ai_governance: 7
```

A nota global é a média ponderada das áreas efetivamente auditadas naquela execução; áreas não auditadas ficam `not-assessed` e não entram no cálculo — a nota global de uma execução parcial (`quick`/`area`) não deve ser apresentada como equivalente a uma nota `full`. O peso não substitui julgamento qualitativo: uma área crítica com nota baixa (ex. `security`) pode limitar o veredito geral mesmo com média ponderada alta — declarar isso explicitamente no relatório quando ocorrer. Comparação entre snapshots com rubricas/pesos diferentes deve declarar a mudança de metodologia em vez de comparar números diretamente. Pesos não são alterados numa auditoria individual sem registrar a mudança de metodologia neste documento.

## 11. Critérios por área

- **Arquitetura**: limites de componentes, acoplamento, fluxos síncronos/assíncronos, isolamento de falhas, concorrência, resiliência, observabilidade, documentação de arquitetura, coerência entre diagramas e implementação.
- **Infraestrutura como código**: modularidade, state, locking, idempotência, IAM, ambientes, validação, drift, segurança, reprodutibilidade, preparação para produção.
- **CI/CD**: gates, dependências entre jobs, segurança, testes, promoção, concorrência, rollback, comentários obsoletos, coerência com política de branches, actions pinadas, proteção de ambientes.
- **Segurança**: autenticação, autorização, segredos, OIDC, IAM, supply chain, scanners, vulnerabilidades, logging, detecção, configurações inseguras, controles apenas declarativos.
- **Testes**: unidade, integração, contrato, E2E, smoke, cobertura de riscos, determinismo, isolamento, gates, confiança nas contagens, testes para falhas reais.
- **Código de aplicação**: clareza, coesão, duplicação, tratamento de erro, concorrência, validação, consistência, comentários, contratos, dívida explícita, documentação próxima ao código.
- **Contratos e monorepo**: contratos compartilhados, validação executável, fronteiras, versionamento, compatibilidade, workspaces, lockfile, acoplamento, semântica de updates, erros contratados.
- **Documentação**: fontes canônicas, links, atualização, duplicação, fatos deriváveis, autoridade, README, diagramas, instruções contraditórias, conteúdo futuro já implementado, clareza do mapa documental.
- **Prontidão para produção**: ambientes, rollback, backup, observabilidade, alarmes, runbooks, resiliência, segurança, testes de carga, DR, deploy real, evidência operacional. Não confundir preparação técnica com produção comprovada.
- **Contexto e governança da IA**: `CLAUDE.md`, contexto de sessão, memória, skills, separação entre regra/estado/histórico, precedência, conflitos, conteúdo derivável, reprodutibilidade, enforcement, atribuição humano-IA, captura de estudos de caso, dependências não versionadas, riscos de privacidade.

## 12. Auditoria de arquivos de contexto

Procurar: regra durável em `.project-context.md`, estado temporário no `CLAUDE.md`, histórico de sessão em fonte global, duplicação entre contexto e documentação, instruções contraditórias, arquivos citados que não existem, regras canônicas presentes apenas em memória local, contexto maior que o necessário, URLs/hashes/versões/contagens deriváveis mantidas manualmente, dependência de skill ignorada pelo Git, ausência de exemplo público para arquivo privado, contexto desatualizado, falta de data de expiração para estado temporário.

Distinguir: `durable-rule | operational-state | canonical-knowledge | derived-fact | historical-record | personal-preference | private-context`.

Não mover ou corrigir conteúdo durante a auditoria.

## 13. Auditoria dos estudos de caso

Verificar: YAML válido, status coerente, `date_closed`, resumo versus corpo, unidade de análise, causalidade, atribuição, gatilhos, referências Git, `evidence_files`, arquivos inexistentes, evidência de antes e depois, limitações, casos contrários, obrigações de prova, revisão futura, distinção entre correção do estado e correção do mecanismo. Aplicar as regras vigentes em `docs/book/capture-protocol.md` e `docs/book/cases/templates/case-template.md`. Nunca inventar evidência ausente.

## 14. Contradições entre fontes

Construir uma matriz:

```markdown
| Tema | Fonte A | Fonte B | Contradição | Autoridade provável | Evidência | Ação necessária |
|---|---|---|---|---|---|---|
```

Temas típicos: política de branch, atribuição da IA, Definition of Done, criação de PR, estratégia de deploy, contagens de componentes, versões, existência de recursos, convenções de comentários, status de funcionalidades.

A auditoria não resolve silenciosamente conflitos de autoridade. Quando a autoridade não estiver clara: classificar como decisão humana necessária, registrar as alternativas, não escolher por conveniência.

## 15. Regras documentadas sem enforcement

Classificar cada política relevante:

```text
documented-only | review-dependent | partially-automated | automatically-detected | automatically-blocking
```

```markdown
| Política | Fonte | Maturidade | Detecção | Consequência | Evidência | Risco |
|---|---|---|---|---|---|---|
```

Exemplos: comentários em inglês, proteção de branches, Conventional Commits, atualização de documentação, revisão de segurança, validação de casos, atualização de contexto, proibição de segredos.

## 16. Controles determinísticos

Separar o trabalho semântico da auditoria (interpretação, contradição, qualidade, causalidade, governança, priorização, avaliação de risco) do trabalho futuro de scripts/CI (links quebrados, YAML inválido, arquivos de evidência ausentes, campos obrigatórios, contagens, referências inexistentes, trigger types desconhecidos, versões divergentes, arquivos citados inexistentes). Cada achado indica se existe potencial de controle determinístico — a auditoria não implementa esses controles.

## 17. Comparação com avaliações anteriores

No modo `delta` ou `full`, localizar snapshots anteriores:

```markdown
| Área | Nota anterior | Nota atual | Diferença | Evidência da evolução | Regressões | Confiança |
|---|---:|---:|---:|---|---|---|
```

Regras: não aumentar nota só porque mais arquivos foram criados; não reduzir nota por falta de inspeção (usar `not-assessed`); distinguir mudança de rubrica de mudança do projeto; registrar baseline; nunca modificar snapshot anterior; explicar quando a comparação não é válida.

## 18. Critérios para evolução de nota

Antes de aumentar uma nota, exigir ao menos uma evolução real: risco técnico corrigido, controle adicionado, evidência operacional nova, contradição eliminada, teste relevante criado, processo reproduzível, falha histórica não recorrente por período definido, documentação alinhada ao código, automação substituindo dependência manual.

Antes de reduzir uma nota: confirmar regressão, diferenciar falta de inspeção, diferenciar mudança de rubrica, registrar evidência.

Uma nota alta com confiança baixa é apresentada com ressalva explícita. Quando a nota sobe sem evidência operacional suficiente, registrar `score-evidence-gap` e reduzir a confiança da evolução em vez de aceitar o aumento.

## 19. Status dos achados

```text
open | accepted-risk | needs-human-decision | false-positive | resolved-after-audit | not-actionable
```

Durante a auditoria inicial de um achado, usar `open` ou `needs-human-decision`. Nunca marcar como resolvido sem evidência posterior.

## 20. Privacidade e conteúdo local

`.project-context.md`, `memory/`, `.claude/` podem conter conteúdo local ou privado. A auditoria inspeciona quando disponível e necessário, mas não copia dados pessoais para relatórios, redige informação sensível, não armazena prompts privados completos, registra apenas a evidência mínima, indica quando dependeu de arquivo não versionado, e não presume que outro clone terá acesso ao mesmo conteúdo.

## 21. Internet e fontes externas

Por padrão a auditoria trabalha só com o repositório e o histórico Git. Não acessa internet automaticamente. Pesquisa externa só quando o usuário solicitar, a auditoria depender de informação atual, for necessário verificar versão/CVE/padrão/documentação oficial — sempre registrando a limitação e a fonte. Conteúdo externo nunca substitui evidência interna ausente.

## 22. Relação com controles determinísticos e com `engineering-book-capture`

A auditoria avalia se um achado tem valor pedagógico para o livro, sem abrir automaticamente um caso só porque encontrou um problema. Segue `docs/book/capture-protocol.md` e `.claude/skills/engineering-book-capture/SKILL.md`: achado rotineiro não abre caso; contradição pedagógica relevante sugere ou aciona a skill conforme o protocolo; falha de governança com evidência histórica avalia caso; mudança de modelo mental avalia caso; a auditoria completa como atividade não é automaticamente um caso; a criação desta própria skill é avaliada separadamente, sem ser forçada. O achado não duplica o caso dentro do relatório de auditoria — referencia.

## 23. Critérios para abrir estudo de caso a partir de um achado

Um achado justifica avaliar abertura de caso quando, além de um gatilho do protocolo, houver aprendizado não trivial e generalizável: contradição de autoridade não óbvia, falha de enforcement com histórico real (não hipotético), divergência entre o que a documentação promete e o que o código faz, ou um princípio de governança de IA extraível do achado. Achados puramente mecânicos (link quebrado, contagem desatualizada) não justificam caso por si só.

## 24. Limites da metodologia

A auditoria depende da qualidade e completude das fontes lidas no momento da execução; não garante cobertura de arquivos fora dos caminhos listados na seção 5; não substitui teste automatizado, revisão de segurança dedicada, ou aprovação humana; notas são um resumo comparável, não uma certificação; ausência de achado numa área não é prova de ausência de problema, é ausência de evidência encontrada dentro do escopo e do tempo da execução.

## 25. Integração com Git

Registra branch, commit, working tree, base de comparação, arquivos ignorados relevantes e limitações do histórico. Nunca cria commit, tag, muda branch, faz stash, reseta, limpa arquivos ou reescreve histórico. Se o working tree estiver sujo: registra o estado, identifica se as mudanças fazem parte do escopo da auditoria, evita atribuir estado local ao commit atual, e só pede decisão humana se isso impedir uma conclusão confiável.

## 26. Versionamento

Ver `.claude/skills/project-consistency-audit/SKILL.md`, seção "Versionamento", para o estado atual de `.claude/` no `.gitignore` deste projeto e as alternativas apresentadas a Marcelo.
