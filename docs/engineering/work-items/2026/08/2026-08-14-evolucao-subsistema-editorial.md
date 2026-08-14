---
id: WORK-2026-005
title: Evolução do Subsistema Editorial
type: change-instruction
status: in-progress
created_at: 2026-08-14
approved_at: 2026-08-14
started_at: 2026-08-14
completed_at:
requested_by: Marcelo Gonçalves
execution_agent: claude
scope: ["editorial/", "editorial/plans/", ".claude/skills/post-planning/", "scripts/validate-editorial-plans", "CI"]
related_audits: []
related_cases: []
related_commits: []
related_pull_requests: []
superseded_by: []
resulting_documents: []
contains_sensitive_content: false
---

# Evolução do Subsistema Editorial

## Resultado da execução

- Status: in-progress (ver checklist abaixo para estado exato por fase)
- Data: 2026-08-14
- Commit: ver `related_commits` (atualizado a cada commit desta branch)
- Pull request: ver `related_pull_requests`
- Arquivos alterados: ver seção "Estrutura final" ao fim de cada fase concluída
- Critérios satisfeitos: ver checklist
- Critérios não satisfeitos: ver checklist
- Desvios em relação à instrução original: nenhum registrado ainda
- Decisões humanas adicionais: nenhuma além da autorização inicial de Marcelo para prosseguir com autonomia total ("continue enquanto for possível")
- Documentação canônica resultante: `editorial/schema/editorial-plan.schema.json`, `editorial/LIFECYCLE.md` (a criar na Fase B)
- Estudo de caso relacionado: nenhum aberto ainda (avaliar gatilho de `docs/book/capture-protocol.md` ao final)

## 0. Finalidade e precedência

Este documento é o mecanismo de continuidade entre sessões para a evolução do subsistema editorial (`editorial/`), conforme especificado em `prompt-evolucao-subsistema-editorial.md` (raiz do repo). Uma sessão futura deve conseguir retomar o trabalho lendo só este arquivo: o que está feito, o que falta, o que está bloqueado e por quê.

Escopo completo, arquitetura a preservar, e critérios de aceite: ver `prompt-evolucao-subsistema-editorial.md` (não duplicado aqui — fonte única).

Decisão de execução em fases (não é um blocker, é sequenciamento deliberado): Fases A+B+C (consistência, contrato, enforcement) executadas primeiro por não dependerem de sistemas externos. Fases E/F (Publication Receipt/Outcomes/Capital Agent) dependem de decisões de Marcelo sobre o CMS (ver `docs/engineering/work-items/2026/08/2026-08-04-ajuste-15c-cms-fluxo-editorial.md`, status `blocked`) — tratadas como contratos/stubs, não integração real.

---

## Checklist — Fase A: Consistência

- [x] Corrigir drift `post-planning` vs `post-planejamento` — nome canônico escolhido: **`post-planning`** (bate com o nome real da pasta `.claude/skills/post-planning/` e com o `trigger` já correto no YAML da skill).
- [x] Corrigir todas as referências textuais a `post-planejamento` em `editorial/plans/README.md`, `editorial/plans/templates/post-plan-template.md`, `.claude/skills/post-planning/SKILL.md`.
- [x] Confirmar YAML front matter da skill é válido (parseável) — já estava válido; adicionado teste automatizado que garante isso continue verdade.
- [x] Busca global por paths antigos/terminologia obsoleta em `editorial/` — nenhuma referência quebrada adicional encontrada (a tabela de migração em `editorial/plans/README.md` já documenta os nomes antigos como histórico intencional, não drift).

## Checklist — Fase B: Contrato

- [x] Template (`editorial/plans/templates/post-plan-template.md`) é a estrutura canônica única; skill referencia o template em vez de redefinir uma segunda estrutura completa de front matter.
- [x] Schema formal JSON Schema criado em `editorial/schema/editorial-plan.schema.json`.
  - Decisão de escopo: campos de "Integrações opcionais" do §7 do prompt (`experiment_id`, `publication_request_id`, `business_signal_id`, `opportunity_id`, `outcome_ref`) **não foram incluídos nesta rodada**. Nenhum consumidor real existe ainda (Capital Agent/CMS são design-doc-only) — adicionar campos especulativos sem consumidor viola YAGNI (`docs/engineering/standards/engineering-principles.md`) e o próprio prompt (`§27 Não fazer: não crie workflow excessivamente complexo`). Serão adicionados na Fase F quando a integração tiver contrato real do lado do Capital Agent. `additionalProperties: false` faria essa adição futura ser uma mudança de schema explícita e versionada (`schema_version`), não drift silencioso.
  - Campos incluídos: identificação completa, origem, estratégia (metadata da Fase D incluída aqui pois o schema é uma unidade só), publicação (`planned_publication`, `published_at`, `canonical_content`, `publication_receipt` como ref opcional string), segurança (`contains_sensitive_content`, `human_review_required`).
- [x] Lifecycle formal documentado em `editorial/LIFECYCLE.md`: estados, transições permitidas, invariants por estado (`scheduled` exige `planned_publication`; `published` exige `published_at` + `canonical_content`; `contains_sensitive_content: true` bloqueia avanço para `ready`/`scheduled`/`published` sem `human_review_required: true`).

## Checklist — Fase C: Enforcement

- [x] Validator determinístico: `scripts/validate-editorial-plans.mjs` (Node puro + `js-yaml` + `ajv`, sem LLM).
- [x] Validator cobre: YAML parseável, schema (ajv), ID único, formato de ID, path vs `created_at`, status no enum, lifecycle (estado atual é válido), invariants de `published`/`scheduled`, `contains_sensitive_content` sem `human_review_required` bloqueando estados avançados, `schema_version` presente.
- [x] Testes do validator: `scripts/__tests__/validate-editorial-plans.test.mjs` (casos válido/inválido por categoria do §25).
- [x] Wired ao CI existente: novo job `validate-editorial` em `.github/workflows/cd.yml`, adicionado a `needs` de `deploy-dev`. Não criado pipeline novo.
- [x] Segurança: reuso do Gitleaks já existente (`security.yml`, escaneia o repo inteiro incluindo `editorial/`) para segredos/credenciais. Enforcement de `contains_sensitive_content` implementado no validator (bloqueia `ready`/`scheduled`/`published` sem revisão humana) — documentado como defesa determinística de *processo*, não substituto do scanner de secrets. PII leve (regex de e-mail/telefone) adicionada como sinal auxiliar no validator, explicitamente documentada como não sendo defesa única (`§12` do prompt).

## Checklist — Fase D: Estratégia

- [x] Metadata estratégica (`content_pillar`, `audience`, `intent`, `funnel_stage`, `business_goal`, `series`, `priority`) já incluída no schema da Fase B (mesmo artefato, não duplicado).
- [ ] Portfolio index gerado (`editorial/index.generated.md` / `.json`) — pendente.
- [ ] CI verificando se o índice está atualizado — pendente.

## Checklist — Fase E: Feedback (depende de decisão externa)

- [ ] Publication Receipt (contrato/schema apenas, sem integração real) — pendente.
- [ ] Outcomes (`editorial/outcomes/`, contrato apenas) — pendente.
- Bloqueio: CMS/admin ainda não expõe nenhum ID real de publicação (`docs/engineering/work-items/2026/08/2026-08-04-ajuste-15c-cms-fluxo-editorial.md` está `blocked`). Contratos podem ser desenhados como stub, mas qualquer coisa além de "formato de dados" seria invenção.

## Checklist — Fase F: Integração Capital Agent (depende de decisão externa)

- [ ] Contratos de referência opcionais (`experiment_id` etc.) — pendente, depende da Fase E.
- [ ] Regras de sanitização/PII para dados devolvidos ao Capital Agent — pendente.

## Checklist — Fase G: Migração dos 28 planos existentes

- [ ] Rodar o validator novo contra os 26 planos reais em `editorial/plans/2026/{06,07,08}/` e corrigir apenas o que for inconsistência real (não retroagir metadata inventada).
- [ ] Adicionar `schema_version` aos planos existentes.
- [ ] Relatório de quantos migrados / quais campos ficaram `null`/unknown.

## Checklist — Fase H: Auditoria final

- [ ] Suite de testes completa rodando verde.
- [ ] Documentação (`editorial/README.md`, `editorial/plans/README.md`, skill, template) revisada por consistência final.
- [ ] Avaliar `project-consistency-audit` se mudança estrutural justificar.

---

## Revisão independente (codex CLI)

Acionado `codex exec --sandbox read-only` como revisor cego (sem revelar antes o próprio julgamento) sobre `editorial/schema/editorial-plan.schema.json`, `scripts/validate-editorial-plans.mjs` e `editorial/LIFECYCLE.md`.

Achados aceitos e corrigidos nesta sessão:

- **Bug real de unicidade de ID em modo `--changed-only`**: `seenIds` era populado só com os arquivos do diff, então um plano novo podia duplicar o ID de um plano histórico não tocado sem ser detectado. Corrigido: o índice de IDs agora é semeado a partir de todos os planos do repositório (exceto os do próprio diff, para não gerar falso positivo "duplicado de si mesmo"). Teste de regressão adicionado.
- **Datas com overflow silencioso**: a primeira versão deixava `js-yaml` fazer parse automático de datas não citadas (`created_at: 2026-06-27`) para objetos `Date`; para uma data calendarmente inválida como `2026-99-99`, o overflow do próprio `Date` "corrigia" silenciosamente para `2034-06-07`, que passava no schema. Corrigido trocando para `yaml.JSON_SCHEMA` (sem o tipo timestamp do YAML 1.1) — datas ficam como string bruta, e o `format: date` customizado do Ajv agora rejeita datas calendarmente inválidas de verdade. Teste de regressão adicionado.

Achados aceitos como limitação conhecida, não corrigidos nesta sessão (custo/escopo não justificam agora):

- `human_review_required: true` registra que a revisão é exigida, não que ela de fato ocorreu — um autor pode marcar os dois campos (`contains_sensitive_content` e `human_review_required`) no mesmo commit sem revisão humana real acontecer. Um controle mais forte exigiria identidade do revisor/data e possivelmente CODEOWNERS ou aprovação de ambiente protegido — infraestrutura de aprovação que não existe hoje no repo para este fluxo. Registrado aqui como risco real conhecido (ver seção "Riscos" abaixo), não escondido.
- PII regex é deliberadamente auxiliar e estreito (só e-mail e telefone) — não cobre CPF/CNPJ, endereços, nomes, ou PII ofuscada. Consistente com o prompt (§12: "não use regex como única defesa") — o controle primário de segredos/credenciais continua sendo o Gitleaks já existente em `security.yml`, que escaneia o repositório inteiro.
- Schema não valida coerência temporal entre campos (`updated_at >= created_at`) nem se `schema_version` é uma versão que o validator de fato suporta — adiado por não ter causado nenhum problema real nos 27 planos existentes; reavaliar se aparecer um caso real.

## Riscos

- `human_review_required` é auto-declarável, não uma prova de revisão. Enquanto não houver um mecanismo de aprovação mais forte (CODEOWNERS, ambiente protegido, ou campo com identidade/data do revisor), o enforcement de `contains_sensitive_content` é um lembrete estrutural, não uma garantia contra um autor apressado.
- CI de `validate-editorial` em modo `--changed-only` usando `HEAD~1` no fallback de push (fora de PR) pode não cobrir todos os arquivos em um push com múltiplos commits — cenário raro dado que o fluxo do repositório é PR + merge, mas real.

## Próxima sessão — continuar a partir daqui

Se a sessão atual parar antes de completar Fase D/G/H: o próximo passo concreto é gerar `editorial/index.generated.md`/`.json` (Fase D) a partir dos planos já validados, depois rodar o validator contra os 26 planos reais (Fase G) e registrar aqui quantos passaram sem alteração vs. quantos precisaram de `schema_version` adicionado.

Fases E e F não devem ser iniciadas além de contratos de dados até Marcelo decidir o desbloqueio do CMS (ver work item 2026-08-04).
