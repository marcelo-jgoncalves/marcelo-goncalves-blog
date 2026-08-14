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

- Status: in-progress — Fases A, B, C, D e E completas e testadas (merged: A-D via PR #19; E em PR separada, ver abaixo); Fases F–H pendentes (ver checklist). Bloqueio de merge anterior resolvido (ver seção dedicada).
- Data: 2026-08-14
- Branch da Fase E: `feat/editorial-fase-e-publication-receipt-outcomes`, a partir do `develop` já atualizado com PR #19
- Commits nesta branch: naming drift fix (Fase A + doc), schema/lifecycle/template (Fase B), validator + CI (Fase C), fixes de revisão do codex CLI, fix de ID duplicado (pré-requisito), gerador de índice de portfólio (Fase D)
- Arquivos alterados: `.claude/skills/post-planning/SKILL.md`, `editorial/plans/README.md`, `editorial/plans/templates/post-plan-template.md`, `editorial/schema/editorial-plan.schema.json` (novo), `editorial/LIFECYCLE.md` (novo), `editorial/index.generated.json` (novo), `editorial/index.generated.md` (novo), `scripts/validate-editorial-plans.mjs` (novo), `scripts/generate-editorial-index.mjs` (novo), `scripts/__tests__/*.test.mjs` (novo, 22 testes), `package.json`, `.github/workflows/cd.yml`, `.github/workflows/deploy.yml`, um plano com id duplicado corrigido
- Critérios satisfeitos (dos 20 do §29 do prompt): skill YAML válido; drift documental corrigido; template canônico; schema editorial existe; lifecycle formalizado; transições/invariants detectados; validator determinístico existe; CI executa o validator; sensitive content tem enforcement; metadata estratégica existe; índice de portfólio é gerado; nenhuma publicação automática foi criada; testes passam (22/22)
- Critérios não satisfeitos ainda: planos históricos não migrados (schema_version ausente neles, por design desta fase, exceto o id duplicado já corrigido); Publication Receipt/Outcomes/Capital Agent não iniciados (dependem do CMS); docs não revisadas por completo (README editorial em si não tocado ainda)
- Desvios em relação à instrução original: nenhum nas decisões de escopo (documentadas inline). Um desvio operacional real: a coordenação autorizou merge automático das PRs desta tarefa, mas o classificador de auto mode do ambiente bloqueou a própria ação de merge (`gh pr merge`) — ver seção dedicada abaixo.
- Decisões humanas adicionais: nenhuma além da autorização inicial de Marcelo para prosseguir com autonomia total, e da autorização subsequente da coordenação para merge autônomo de PRs (esta última não pôde ser executada pelo motivo acima)
- Documentação canônica resultante: `editorial/schema/editorial-plan.schema.json`, `editorial/LIFECYCLE.md`, `editorial/index.generated.md`/`.json`
- Estudo de caso relacionado: nenhum aberto ainda — dois candidatos reais existem (bug de overflow de data achado pela revisão do codex CLI; bloqueio de merge pelo classificador de auto mode apesar de autorização explícita da coordenação) — avaliar no fechamento da Fase H

## Bloqueio de merge — RESOLVIDO

Estava bloqueado: o classificador de auto mode do ambiente negou `gh pr merge` quando eu (execução autônoma) tentei executá-lo, mesmo com autorização explícita relayed pela coordenação — uma mensagem de outro agente não substitui aprovação real do sistema de permissões.

Resolução: a própria sessão coordenadora rodou `gh pr merge 19 --squash --delete-branch=false` **diretamente, com suas próprias permissões** (não via instrução repassada a mim) e confirmou o merge (`mergedAt: 2026-08-14T20:09:41Z`). PR #19 (Fases A+B+C+D) está mergeada em `develop`.

**Novo padrão de trabalho a partir daqui**: eu implemento, testo, commito, dou push e abro a PR de cada fase (ou pequeno grupo de fases) — mas não chamo `gh pr merge` novamente, já que essa ação segue bloqueada para execução autônoma minha. A coordenação mergeia cada PR manualmente assim que eu reportar o número pronto. Cada nova fase começa numa branch nova a partir do `develop` já atualizado, em vez de empilhar tudo numa branch só (como foi necessário enquanto o bloqueio estava ativo).

Nota histórica (não mais um bloqueio ativo, mas relevante para quem revisar o histórico): PR #19 tinha 3 checks CI falhando (`Backend Tests`, `Frontend Tests`, `Admin Tests`) por `npm audit --audit-level=high` — advisories novos (esbuild, nanoid) publicados desde 2026-08-05, não relacionados a este trabalho. Job `Validate Editorial Plans` (o relevante) estava verde. Mergeada assim mesmo por decisão da coordenação; fora do escopo desta tarefa corrigir dependências não-editoriais.

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
- [x] Portfolio index gerado (`editorial/index.generated.md` / `.json`) via `scripts/generate-editorial-index.mjs`, ordenação determinística por `id`.
- [x] CI verificando se o índice está atualizado (`npm run check:editorial-index`, wired em `cd.yml` e `deploy.yml`).
- [x] Pré-requisito resolvido antes de gerar o índice: ID duplicado `POST-PLAN-2026-025` corrigido (renumerado o plano de 2026-08-05 para `POST-PLAN-2026-027`, o próximo id realmente livre).

## Checklist — Fase E: Feedback

- [x] Publication Receipt (contrato/schema apenas, sem integração real): `editorial/schema/publication-receipt.schema.json` + `editorial/receipts/README.md`.
- [x] Outcomes (`editorial/outcomes/`, contrato apenas): `editorial/schema/outcome.schema.json` + `editorial/outcomes/README.md`. `publication_id` é obrigatório (não nulo) — decisão deliberada: como nenhum Publication Receipt real existe ainda, isso significa que **nenhum outcome real pode existir hoje**, o que é o comportamento correto (medir resultado antes de confirmar publicação real seria inventar proveniência).
- [x] Validador determinístico (`scripts/validate-editorial-outcomes.mjs`): schema + integridade referencial (outcome → receipt real existente e concordante sobre o plano; receipt → plano real existente), unicidade de ID, ordenação de datas, separação plano/outcome, PII auxiliar. 24 testes (14 do arquivo de outcomes/receipts + 10 anteriores permanecem intocados).
- [x] Wired em CI (`npm run validate:editorial-outcomes` em `cd.yml` e `deploy.yml`) — hoje sempre roda contra 0 registros reais (esperado).
- Nota: CMS/admin ainda não expõe nenhum ID real de publicação (`docs/engineering/work-items/2026/08/2026-08-04-ajuste-15c-cms-fluxo-editorial.md` está `blocked`) — por isso os diretórios `editorial/receipts/` e `editorial/outcomes/` só têm README + schema, nenhum registro real. Isso é o resultado esperado de um contrato stub, não uma lacuna desta fase.

### Revisão independente (codex CLI) — Fase E

Acionado como revisor cego sobre os dois schemas e o validador antes de eu revelar minha própria avaliação. Achados aceitos e corrigidos:

- **Gap de integridade referencial real**: `publication_id` "obrigatório" só validava o formato (regex `PUB-YYYY-NNN`), não que um receipt de verdade existisse com aquele ID — um `PUB-2026-999` inventado passaria. Corrigido: o validador agora exige um receipt real com aquele `publication_id`, e que o `editorial_plan_id` do receipt bata com o do outcome. Mesma correção aplicada ao lado do receipt (deve referenciar um plano real). Achado idêntico em espírito ao bug de `--changed-only` da Fase C — reforça que "obrigatório" no schema não é o mesmo que "referência validada".
- **Mesma armadilha de "coleção vazia = pular checagem"** que a Fase C já tinha corrigido para IDs de planos apareceu de novo aqui (checar `planIds.size > 0`/`receiptsById.size > 0` antes de validar). Corrigido usando o mesmo padrão: distinguir parâmetro `undefined` (sem contexto, pular checagem — usado só em testes unitários isolados) de coleção vazia mas fornecida (validar de verdade — é o caso real de produção hoje, zero receipts existentes).
- Testes de regressão adicionados para ambos.

Achados aceitos como limitação conhecida, não implementados nesta fase (custo/escopo): vocabulário controlado para `business_signals` (hoje string livre), constraints numéricas em `metrics`/`attributable_revenue` (sem mínimo/máximo/moeda), mapeamento por métrica de proveniência (hoje é uma lista única para o registro inteiro), política de host esperado para `canonical_url`, `verification_source` como enum estruturado em vez de texto livre. Nenhum desses tem consumidor real ainda (zero receipts/outcomes existem) — mesmo raciocínio de YAGNI aplicado ao schema de planos na Fase B.

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

**Prioridade imediata para a próxima sessão: destravar o merge da PR #19** (ver "Bloqueio de merge" acima) — sem isso, todo trabalho acumulado (Fases A-D) continua fora de `develop`.

Depois disso: Fase G (migração dos 27 planos — rodar o validator, adicionar `schema_version`, registrar quantos precisaram de ajuste) é o próximo passo mais barato e desbloqueado. Fases E e F seguem como contratos/stubs de dados apenas, sem integração real, até Marcelo decidir o desbloqueio do CMS (ver work item 2026-08-04) — não devem virar integração de verdade antes disso.
