# Prompt de Implementação — Evolução do Subsistema Editorial

## Papel

Você é a IA engenheira principal responsável pela Editorial Platform.

Repositório:
https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform

Seu objetivo nesta sessão é evoluir a pasta `editorial/` de um bom repositório de planejamento editorial para um subsistema editorial operacional, verificável, mensurável e preparado para integração com o Capital Agent, sem transformar o Git em CMS e sem criar acoplamento excessivo.

Atue como Principal/Staff Software Engineer com foco em arquitetura editorial, sistemas de conteúdo assistidos por IA, governança, validação determinística, segurança, lifecycle, rastreabilidade e feedback pós-publicação.

---

# 1. Escopo

O foco é:

- `editorial/`
- `editorial/plans/`
- templates
- `.claude/skills/post-planning/`
- scripts de validação
- schemas
- testes
- CI
- documentação
- contratos necessários para Publication Receipt e Outcomes

Você pode alterar outros diretórios apenas quando estritamente necessário para suportar o subsistema editorial.

Não faça refactor geral da plataforma.

---

# 2. Arquitetura que deve ser preservada

## Antes da publicação

Git é fonte canônica de:

- ideia
- planejamento
- tese
- evidência
- estrutura
- hipótese editorial
- referências
- metadados
- intenção de negócio
- estado editorial

## Depois da publicação

O CMS é a fonte canônica do conteúdo publicado.

O Git não deve virar uma segunda fonte autoritativa do artigo final.

Fluxo:

```text
real work / market signal
        ↓
content candidate
        ↓
editorial plan
        ↓
draft / review
        ↓
publication
        ↓
CMS becomes canonical
```

---

# 3. Discovery obrigatório

Antes de alterar qualquer arquivo:

1. leia toda a pasta `editorial/`;
2. leia `editorial/plans/README.md`;
3. leia todos os templates;
4. leia a skill `post-planning`;
5. inventarie os planos atuais;
6. identifique IDs, status, campos e paths;
7. identifique documentação desatualizada;
8. identifique referências a paths antigos;
9. identifique CI atual;
10. identifique como o CMS representa conteúdo publicado;
11. identifique integrações existentes ou futuras com Capital Agent.

Classifique internamente:

```text
EXISTS
PARTIAL
MISSING
STALE
CONFLICTING
```

Depois implemente as correções.

---

# 4. Corrigir drift documental

Revise e corrija inconsistências como:

- nomes antigos do repositório;
- paths antigos de posts;
- referências a conteúdo já migrado;
- `post-planning` vs `post-planejamento`;
- `source_skill` inconsistente;
- referências a arquivos inexistentes;
- convenções de ID divergentes;
- status divergentes;
- documentação contraditória.

Faça busca global por terminologia antiga.

---

# 5. Corrigir YAML da skill

A metadata da skill deve ser YAML válido.

Exemplo:

```yaml
---
name: post-planning
trigger: "/post-planning"
description: "..."
---
```

A explicação detalhada de quando usar a skill deve ficar no corpo.

Adicione validação automatizada para garantir que o front matter da skill seja parseável.

---

# 6. Template como contrato canônico

Regra:

```text
template = estrutura canônica
skill = comportamento
```

O template deve definir:

- front matter;
- seções obrigatórias;
- ordem;
- placeholders;
- campos opcionais.

A skill deve instruir a usar o template e não redefinir uma segunda estrutura completa.

Evite duplicação.

---

# 7. Schema editorial formal

Crie schema formal para os planos editoriais.

Valide pelo menos:

## Identificação

- `id`
- `title`
- `slug`
- `created_at`
- `updated_at`
- `status`
- `schema_version`

## Origem

- `source_skill`
- `source_type`
- `source_refs`

## Estratégia

- `content_pillar`
- `audience`
- `intent`
- `funnel_stage`
- `business_goal`
- `series`
- `priority`

## Publicação

- `planned_publication`
- `published_at`
- `canonical_content`
- `publication_receipt`

## Segurança

- `contains_sensitive_content`
- `human_review_required`

## Integrações opcionais

- `experiment_id`
- `publication_request_id`
- `business_signal_id`
- `opportunity_id`
- `outcome_ref`

Use enums quando fizer sentido.

Prefira `additionalProperties: false` em contratos fechados.

---

# 8. Lifecycle canônico

Formalize uma máquina de estados única.

Baseline:

```text
idea
  ↓
researching
  ↓
planned
  ↓
drafting
  ↓
ready
  ↓
scheduled
  ↓
published
```

Estados alternativos:

```text
cancelled
archived
```

Ajuste se o domínio atual exigir.

Defina transições permitidas.

---

# 9. Invariants de lifecycle

## `scheduled`

Exige `planned_publication`.

## `published`

Exige:

- `published_at`
- `canonical_content`
- Publication Receipt ou justificativa explícita enquanto a integração ainda não existir.

## `contains_sensitive_content: true`

Não pode avançar para:

```text
ready
scheduled
published
```

sem revisão humana explícita.

## `cancelled`

Aceita motivo.

## `archived`

Mantém histórico.

---

# 10. Validator determinístico

Crie algo como:

```text
scripts/validate-editorial-plans.*
```

Valide:

- YAML/front matter;
- schema;
- ID único;
- formato de ID;
- filename/path;
- `created_at` compatível com path;
- status;
- datas;
- lifecycle;
- published requirements;
- scheduled requirements;
- source_skill;
- canonical URL;
- referências internas;
- sensitive content rules;
- schema version.

Não use LLM para validação determinística.

---

# 11. CI obrigatório

Integre o validator ao CI existente.

CI deve falhar para:

- front matter inválido;
- schema inválido;
- ID duplicado;
- status inválido;
- lifecycle inválido;
- published sem canonical content;
- scheduled sem data;
- sensitive content sem review;
- referências estruturais quebradas.

Não crie pipeline redundante se já existir um adequado.

---

# 12. Segurança editorial

O repositório é público.

`contains_sensitive_content: true` não pode ser apenas informativo.

Implemente enforcement.

Preferência:

```text
sensitive = true
→ pode existir em workspace local
→ não pode chegar a branch protegida sem sanitização/revisão
```

Avalie também:

- e-mails;
- telefones;
- credenciais;
- tokens;
- access keys;
- dados pessoais;
- nomes de clientes;
- URLs privadas;
- secrets;
- informações internas.

Reutilize scanners existentes quando houver.

Não use regex como única defesa.

---

# 13. Metadata estratégica

Adicione metadata que permita responder:

> Por que este conteúdo existe no portfólio?

Campos sugeridos:

```yaml
content_pillar:
audience:
intent:
funnel_stage:
business_goal:
series:
priority:
```

Enums simples.

Exemplos:

## `intent`

```text
education
thought-leadership
proof-of-work
commercial-discovery
seo
product-education
```

## `funnel_stage`

```text
awareness
consideration
decision
retention
none
```

## `priority`

```text
low
medium
high
critical
```

Não complique sem necessidade.

---

# 14. Portfólio editorial gerado

Crie visão gerada automaticamente, nunca mantida manualmente.

Exemplos:

```text
editorial/index.generated.md
editorial/index.generated.json
```

Inclua:

- ID
- título
- status
- pillar
- series
- audience
- intent
- priority
- created_at
- planned_publication
- published_at
- canonical content
- experiment/business refs

A geração deve ser determinística.

O CI deve conseguir verificar se o índice está atualizado.

---

# 15. Dois caminhos de origem editorial

O sistema deve suportar:

## A. Proof of Work

```text
real engineering work
→ learning
→ content candidate
→ editorial plan
```

## B. Market Signal

```text
market/search/business signal
→ demand hypothesis
→ relevant real expertise?
→ content candidate
→ editorial plan
```

Nunca invente experiência para atender demanda editorial.

Documente ambos como fontes legítimas.

---

# 16. Content Candidate

Avalie introduzir uma camada leve antes do plano completo.

Use somente se trouxer valor real.

Exemplo:

```yaml
id:
title:
source_type:
source_refs:
hypothesis:
priority:
status:
```

Não crie sistema duplicado se `idea` já resolver o problema.

---

# 17. Publication Package

Prepare o subsistema para receber um `Publication Package` externo, inclusive do Capital Agent.

Pode conter:

- `publication_request_id`
- `content_brief_id`
- `experiment_id`
- `business_signal_id`
- `opportunity_id`
- `title`
- `draft_ref`
- `fact_check_ref`
- `critic_ref`
- `cta_intent`
- `attribution_tags`

A existência do package não autoriza publicação.

A autoridade editorial continua humana/plataforma.

---

# 18. Publication Receipt

Formalize um Publication Receipt.

Exemplo:

```yaml
publication_id:
publication_request_id:
editorial_plan_id:
platform_content_id:
canonical_slug:
canonical_url:
published_at:
environment:
campaign_id:
verification_source:
schema_version:
```

O CMS continua fonte canônica.

O receipt serve para rastreabilidade e feedback.

---

# 19. Outcomes pós-publicação

Crie camada separada para resultado pós-publicação.

Não reescreva o plano ex ante com resultado ex post.

Estrutura sugerida:

```text
editorial/outcomes/
```

Cada outcome referencia:

- editorial plan;
- publication receipt;
- período;
- métricas;
- business signals;
- leads;
- outcome summary;
- learnings;
- limitations;
- data quality;
- provenance.

Exemplo:

```yaml
outcome_id:
editorial_plan_id:
publication_id:
measurement_period:
metrics:
business_signals:
qualified_leads:
attributable_revenue:
learnings:
limitations:
schema_version:
```

Não invente dados.

---

# 20. Princípio ex ante vs ex post

Preserve explicitamente:

```text
hypothesis before publication
!=
result after publication
```

Isso evita hindsight bias.

A análise pós-publicação deve poder responder:

- atraiu audiência?
- trouxe tráfego qualificado?
- gerou business signals?
- gerou leads?
- gerou receita atribuível?
- quais hipóteses falharam?
- o que aprendemos?

---

# 21. Integração com Capital Agent

A integração deve permanecer desacoplada.

## Capital Agent pode fornecer

- BusinessSignal;
- OpportunityCandidate;
- Content Hypothesis;
- Publication Package;
- experiment_id;
- attribution context.

## Editorial Platform controla

- editorial plan;
- drafting;
- approval;
- scheduling;
- CMS;
- publication;
- publication receipt.

## Editorial Platform pode devolver

- Publication Receipt;
- sanitized outcome;
- sanitized business signals;
- attribution data;
- performance metrics.

Não dê write access da plataforma ao Capital Agent.

Não compartilhe banco.

Não crie dependência direta de runtime.

---

# 22. Sanitização e PII

Dados destinados ao Capital Agent devem usar:

- IDs pseudônimos;
- métricas agregadas;
- tags;
- categories;
- stages;
- attribution metadata.

Não enviar:

- nome;
- e-mail;
- telefone;
- mensagem bruta;
- dados pessoais.

---

# 23. Versionamento

Adicione `schema_version` aos artefatos estruturados.

Documente breaking changes.

Não quebre os planos históricos silenciosamente.

---

# 24. Migração dos planos existentes

Antes de migrar:

1. inventarie todos os planos;
2. detecte variações históricas;
3. preserve conteúdo;
4. preserve IDs;
5. preserve datas;
6. preserve status.

Depois:

- normalize front matter;
- adicione defaults apenas quando seguros;
- use `null`/unknown quando necessário;
- não invente audience/business goal/funnel stage retroativamente.

---

# 25. Testes obrigatórios

## Schema

- plano válido;
- campo obrigatório ausente;
- enum inválido;
- additional property;
- schema version.

## Lifecycle

- transição válida;
- inválida;
- published incompleto;
- scheduled incompleto;
- sensitive content sem review.

## IDs

- duplicado;
- formato inválido;
- path inválido.

## Template

- parseável;
- seções obrigatórias presentes.

## Skill

- YAML válido;
- trigger correto;
- referência ao template canônico.

## Portfolio

- geração determinística;
- ordenação estável;
- atualização detectável.

## Publication Receipt

- válido;
- duplicate ID;
- URL inválida;
- missing published_at.

## Outcome

- sem publication ref falha;
- métricas sem provenance falham;
- PII rejeitada;
- plano e resultado permanecem separados.

## Security

- sensitive content bloqueado;
- scanners existentes integrados;
- PII em contratos externos rejeitada.

---

# 26. Documentação

Atualize:

- README editorial;
- README de plans;
- skill;
- templates;
- contributing;
- integração com CMS;
- integração com Capital Agent.

Documente claramente:

- fonte de verdade;
- lifecycle;
- portfólio;
- segurança;
- outcomes;
- integration contracts.

---

# 27. Não fazer

Não:

- transforme Git em CMS;
- copie o artigo publicado de volta como fonte canônica;
- dê write access ao Capital Agent;
- compartilhe banco;
- crie EventBridge por antecipação;
- crie workflow excessivamente complexo;
- exija Capital Agent para posts comuns;
- invente metadata histórica;
- invente métricas;
- invente audiência;
- apague planos históricos;
- crie múltiplas fontes canônicas;
- use LLM para validação simples;
- publique automaticamente.

---

# 28. Ordem de implementação

## Fase A — Consistência

1. corrigir drift;
2. corrigir YAML;
3. alinhar nomes/paths.

## Fase B — Contrato

4. template;
5. schema;
6. lifecycle.

## Fase C — Enforcement

7. validator;
8. CI;
9. segurança.

## Fase D — Estratégia

10. metadata;
11. portfolio index.

## Fase E — Feedback

12. Publication Receipt;
13. Outcomes.

## Fase F — Integração

14. Capital Agent contracts;
15. sanitização;
16. refs opcionais.

## Fase G — Migração

17. planos existentes;
18. preservar histórico;
19. validar tudo.

## Fase H — Auditoria

20. testes;
21. docs;
22. consistency review.

---

# 29. Critérios de aceite

- [ ] skill possui YAML válido;
- [ ] drift documental corrigido;
- [ ] template é canônico;
- [ ] schema editorial existe;
- [ ] lifecycle formalizado;
- [ ] transições inválidas são detectadas;
- [ ] validator determinístico existe;
- [ ] CI executa o validator;
- [ ] sensitive content possui enforcement;
- [ ] metadata estratégica existe;
- [ ] índice de portfólio é gerado;
- [ ] planos históricos foram preservados;
- [ ] Publication Receipt existe;
- [ ] Outcomes são separados dos planos;
- [ ] provenance existe em outcomes;
- [ ] PII é proibida na integração;
- [ ] Capital Agent pode referenciar conteúdo sem controlar publicação;
- [ ] CMS continua fonte canônica pós-publicação;
- [ ] nenhuma publicação automática foi criada;
- [ ] testes passam;
- [ ] docs estão consistentes.

---

# 30. Auditoria final

Confirme:

## Fonte de verdade

- Git antes da publicação;
- CMS depois;
- nenhuma duplicidade autoritativa.

## Segurança

- PII;
- secrets;
- sensitive content;
- exposição pública.

## Lifecycle

- states;
- invariants;
- publication requirements.

## Portfólio

- priority;
- audience;
- pillar;
- business goal.

## Outcomes

- ex ante vs ex post;
- provenance;
- attribution;
- limitations.

## Integração

- desacoplamento;
- refs opcionais;
- no write access;
- no shared DB.

## Backward compatibility

- planos antigos;
- IDs;
- URLs;
- histórico.

---

# 31. Relatório final obrigatório

Entregue:

## Resumo executivo

O que mudou e por quê.

## Estrutura final

Árvore editorial relevante.

## Arquivos alterados

Separados por:

- editorial;
- skill;
- scripts;
- schemas;
- CI;
- tests;
- docs.

## Migração

Informe:

- quantos planos analisados;
- quantos migrados;
- quais campos adicionados;
- quais ficaram unknown.

## Lifecycle

Estados e transições finais.

## Segurança

Explique enforcement.

## Portfolio

Explique geração.

## Publication Receipt

Explique contrato.

## Outcomes

Explique contrato.

## Capital Agent

Explique:

- o que pode fornecer;
- o que pode receber;
- o que não pode controlar.

## Testes

Informe:

- comandos;
- total;
- novos;
- resultados;
- falhas restantes.

## Riscos

Somente riscos reais.

---

# 32. Princípio final

O objetivo não é criar um CMS dentro do Git.

O objetivo é transformar `editorial/` em um sistema editorial de planejamento, governança, portfólio e aprendizado, enquanto o CMS continua responsável pelo conteúdo publicado.

Preserve:

```text
evidence > invented narrative
```

```text
template > duplicated instructions
```

```text
deterministic validation > AI memory
```

```text
planning truth != publication truth
```

```text
hypothesis before publication != outcome after publication
```

```text
portfolio strategy > random queue of posts
```

```text
human editorial authority > autonomous publication
```

```text
explicit contracts > cross-project coupling
```

```text
sanitized signals > raw PII
```

Ao final, o subsistema editorial deve continuar simples o bastante para uso diário, mas forte o suficiente para sustentar dezenas ou centenas de conteúdos, integração com IA, mensuração de resultados e evolução orientada por evidência.
