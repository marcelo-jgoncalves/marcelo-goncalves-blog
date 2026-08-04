---
id: WORK-2026-001
title: Criar a skill project-consistency-audit
type: change-instruction
status: executed
created_at: 2026-08-04
approved_at: 2026-08-04
started_at: 2026-08-04
completed_at: 2026-08-04
requested_by: Marcelo Gonçalves
execution_agent: Claude Code
scope: [".claude/skills/project-consistency-audit/", "docs/engineering/audits/"]
related_audits: []
related_cases: []
related_commits: []
related_pull_requests: []
superseded_by: []
resulting_documents:
  - docs/engineering/audits/project-consistency-audit.md
  - .claude/skills/project-consistency-audit/SKILL.md
  - docs/engineering/audits/templates/audit-report-template.md
  - docs/engineering/audits/templates/scores-template.yaml
contains_sensitive_content: false
---

# Prompt para criar a skill `project-consistency-audit`

Quero transformar a auditoria de consistência do projeto em uma capacidade repetível do repositório.

A nova skill deve identificar problemas como:

- contradições entre fontes canônicas;
- documentação incompatível com o código;
- comentários ou instruções obsoletas;
- regras documentadas sem enforcement;
- deriva entre arquitetura, workflows, contexto e implementação;
- referências para arquivos inexistentes;
- dependência de artefatos locais não versionados;
- inconsistências em estudos de caso;
- regras conflitantes de Git, branches, commits e atribuição de IA;
- contexto excessivo, temporário ou duplicado;
- regressões em relação a avaliações anteriores;
- evolução real ou aparente das notas do projeto.

A skill não deve funcionar apenas como um mecanismo que “dá notas”. Ela deve atuar como um:

> Auditor de coerência entre intenção, documentação, contexto, implementação, evidências e controles executáveis.

O objetivo desta tarefa é criar:

1. a metodologia canônica da auditoria;
2. a skill operacional;
3. templates de relatório e snapshot;
4. a estrutura para preservar avaliações comparáveis;
5. a integração mínima com o mapa documental e o processo de trabalho;
6. testes conceituais da nova skill.

Não execute uma auditoria completa do projeto nesta tarefa, exceto pelas simulações necessárias para validar a skill.

Não faça commit ou push.

---

# 1. Leitura inicial obrigatória

Antes de criar ou alterar arquivos, leia integralmente, quando existirem:

```text
CLAUDE.md
docs/README.md
docs/engineering/standards/engineering-principles.md
docs/engineering/standards/code-conventions.md
docs/engineering/standards/testing-strategy.md
docs/engineering/standards/ai-assisted-workflow.md
docs/engineering/standards/git-and-review-workflow.md
docs/book/capture-protocol.md
docs/book/cases/templates/case-template.md
.claude/skills/engineering-book-capture/SKILL.md
.project-context.md
.gitignore
README.md
```

Leia também:

- workflows em `.github/workflows/`;
- documentação de arquitetura;
- documentação de operações;
- documentos de problemas conhecidos;
- estudos de caso existentes;
- relatórios ou auditorias anteriores;
- arquivos de contexto e memória acessíveis;
- convenções existentes para skills.

Antes de editar:

1. execute `git status`;
2. identifique alterações locais existentes;
3. confirme quais arquivos de contexto são versionados e quais são locais;
4. identifique se `.claude/` está ignorado;
5. verifique se já existe estrutura equivalente de auditoria;
6. não crie sistemas paralelos;
7. não sobrescreva decisões canônicas vigentes.

Se houver alterações locais não relacionadas que possam ser afetadas, pare e informe.

---

# 2. Arquitetura de responsabilidades

Distribua as responsabilidades desta forma:

## 2.1 Metodologia canônica

Criar:

```text
docs/engineering/audits/project-consistency-audit.md
```

Esse documento deve definir:

- objetivo;
- escopo;
- modos;
- áreas avaliadas;
- rubrica;
- pesos;
- critérios;
- severidade;
- confiança;
- qualidade de evidência;
- formato dos achados;
- regras de comparação;
- limites;
- comportamento não corretivo;
- relação com controles determinísticos;
- critérios para abrir estudos de caso.

## 2.2 Skill operacional

Criar:

```text
.claude/skills/project-consistency-audit/SKILL.md
```

A skill deve explicar:

- como interpretar o comando;
- como selecionar o modo;
- o que ler;
- como coletar evidências;
- como detectar inconsistências;
- como avaliar notas;
- como comparar snapshots;
- quando criar relatórios;
- quando parar;
- o que nunca deve fazer;
- como reportar limitações;
- como interagir com a skill `engineering-book-capture`.

A skill não deve duplicar integralmente a metodologia.

## 2.3 Templates

Criar:

```text
docs/engineering/audits/templates/audit-report-template.md
docs/engineering/audits/templates/scores-template.yaml
```

Os templates devem refletir a metodologia canônica.

## 2.4 Histórico

Criar diretórios e arquivos de orientação:

```text
docs/engineering/audits/reports/README.md
docs/engineering/audits/snapshots/README.md
```

Não crie um relatório real ou um snapshot real nesta tarefa, salvo se for indispensável para validar o formato e estiver claramente marcado como exemplo não oficial.

## 2.5 Mapa documental

Atualize, somente se necessário:

```text
docs/README.md
```

Inclua a metodologia de auditoria no mapa de fontes canônicas.

## 2.6 Integração resumida

Avalie se o `CLAUDE.md` precisa de uma referência curta à skill.

Caso seja necessário, adicione somente uma instrução operacional concisa, por exemplo:

> Após mudanças estruturais em documentação, contexto, arquitetura ou governança, avalie a execução de `project-consistency-audit`. Não execute auditoria completa em tarefas rotineiras.

Não duplique modos, rubrica ou checklist no `CLAUDE.md`.

## 2.7 Versionamento da skill

Verifique se `.claude/` está ignorado.

Não altere `.gitignore` silenciosamente.

Se a skill ficar ignorada:

1. registre a consequência para reprodutibilidade;
2. apresente ao final as alternativas:
   - manter local;
   - versionar apenas essa skill;
   - versionar todas as skills canônicas;
3. só altere `.gitignore` se já houver uma decisão canônica explícita que autorize o versionamento seletivo.

---

# 3. Modos da skill

A skill deve reconhecer os seguintes modos:

```text
/project-consistency-audit quick
/project-consistency-audit full
/project-consistency-audit delta
/project-consistency-audit area <area>
```

Áreas válidas sugeridas:

```text
architecture
infrastructure
ci-cd
security
tests
application-code
contracts
documentation
production-readiness
context
ai-governance
book-cases
reproducibility
```

A metodologia deve definir como tratar área desconhecida.

---

## 3.1 `quick`

Finalidade:

- checkpoint frequente;
- detectar inconsistências evidentes;
- baixo custo;
- escopo limitado ao estado atual e mudanças recentes.

Verificações mínimas:

- links e caminhos citados;
- contradições evidentes;
- arquivos canônicos inexistentes;
- regras duplicadas;
- comentários obsoletos próximos ao código alterado;
- status incoerentes em casos;
- referências para artefatos ignorados;
- mudanças estruturais sem atualização documental;
- contexto temporário em fonte durável;
- problemas introduzidos no diff atual.

Regras:

- não recalcular nota global por padrão;
- não percorrer todo o histórico;
- deixar explícito o escopo não inspecionado;
- produzir lista priorizada de achados;
- salvar relatório somente quando solicitado ou quando o comando incluir intenção clara de preservação.

---

## 3.2 `full`

Finalidade:

- auditoria ampla do estado atual;
- antes de release;
- revisão mensal;
- preparação de portfólio;
- avaliação estrutural profunda.

Deve avaliar:

- arquitetura;
- infraestrutura;
- CI/CD;
- segurança;
- testes;
- código de aplicação;
- contratos e monorepo;
- documentação;
- prontidão para produção;
- engenharia de contexto;
- governança da IA;
- estudos de caso;
- reprodutibilidade.

O modo `full` deve:

- produzir relatório;
- produzir snapshot de notas;
- registrar commit ou estado de referência;
- declarar limitações;
- não corrigir os achados;
- não alterar código ou documentação fora dos artefatos de auditoria.

---

## 3.3 `delta`

Finalidade:

- comparar o estado atual com a avaliação anterior;
- mostrar progresso, regressão e confiança da mudança.

Deve:

1. localizar o snapshot anterior mais recente aplicável;
2. validar se a rubrica é compatível;
3. comparar notas por área;
4. identificar evidências novas;
5. registrar itens resolvidos;
6. registrar novos problemas;
7. distinguir melhoria real de mudança de escopo ou rubrica;
8. não reescrever o relatório anterior;
9. produzir novo relatório e snapshot;
10. explicar quando não houver baseline comparável.

Não atribua evolução numérica sem evidência concreta.

---

## 3.4 `area`

Finalidade:

- auditar somente uma área;
- permitir uso após uma mudança específica.

O relatório deve indicar:

- área auditada;
- áreas não auditadas;
- interfaces com outras áreas;
- nota da área, quando aplicável;
- impossibilidade de atualizar a nota geral sem auditoria abrangente.

Exemplo:

```text
/project-consistency-audit area context
```

Deve inspecionar:

- `CLAUDE.md`;
- `.project-context.md`;
- `memory/`;
- skills;
- mapa documental;
- dependências locais;
- duplicações;
- conteúdo obsoleto;
- regras concorrentes;
- reprodutibilidade.

---

# 4. Comportamento padrão

A skill deve ser **não corretiva por padrão**.

Ela pode:

- ler arquivos;
- executar comandos de inspeção;
- comparar commits;
- gerar relatório;
- gerar snapshot;
- registrar limitações;
- sugerir tarefas posteriores.

Ela não pode, durante a auditoria:

- corrigir código;
- corrigir documentação de produto;
- atualizar regras;
- reorganizar arquivos;
- implementar lint;
- alterar workflows;
- modificar infraestrutura;
- instalar dependências;
- fazer commit;
- fazer push;
- atualizar notas anteriores;
- esconder achados;
- abrir PR.

Os únicos arquivos que uma execução normal pode criar são:

```text
docs/engineering/audits/reports/<data>-<modo>-project-audit.md
docs/engineering/audits/snapshots/<data>-<modo>-scores.yaml
```

Em modo `quick`, esses arquivos são opcionais.

Qualquer remediação deve ocorrer em tarefa separada.

---

# 5. Fontes obrigatórias por auditoria

A skill deve escolher as fontes proporcionalmente ao modo, mas no modo `full` deve avaliar, quando existirem:

## Código e contratos

```text
backend/
frontend/
admin/
packages/
```

## Infraestrutura

```text
infra/
terraform/
```

Use os caminhos reais encontrados.

## CI/CD

```text
.github/workflows/
```

## Documentação

```text
README.md
docs/
frontend/docs/
backend/README.md
admin/README.md
infra/README.md
```

## Contexto e IA

```text
CLAUDE.md
.project-context.md
memory/
.claude/skills/
```

## Gestão do trabalho

```text
docs/backlog.md
docs/engineering/decisions/
docs/book/cases/
docs/book/cases/evidence/
```

## Estado do Git

- branch;
- HEAD;
- working tree;
- arquivos ignorados relevantes;
- histórico recente;
- commits relacionados a mudanças estruturais.

A skill não deve presumir que todo arquivo existe.

---

# 6. Tipos de problemas a detectar

A metodologia deve definir categorias consistentes.

Use, no mínimo:

```text
source-authority-conflict
documentation-drift
stale-reference
broken-reference
undocumented-change
non-executable-policy
context-bloat
temporary-state-in-durable-source
duplicated-derived-fact
unversioned-canonical-dependency
reproducibility-gap
workflow-policy-conflict
case-methodology-issue
unsupported-attribution
overstated-causality
score-evidence-gap
missing-observability
missing-enforcement
architecture-documentation-gap
production-readiness-gap
```

Permita novas categorias somente com definição no relatório.

Cada achado deve ter ID estável no relatório atual:

```text
PCA-20260804-001
```

Formato sugerido:

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

---

# 7. Severidade

Defina uma escala objetiva:

## `critical`

- risco imediato de segurança, perda de dados, deploy incorreto ou operação inválida;
- fonte canônica induzindo comportamento perigoso;
- controle essencial ausente com exposição concreta.

## `high`

- contradição que pode causar implementação errada;
- documentação operacional incorreta;
- processo não reproduzível em parte essencial;
- falsa sensação de proteção;
- regressão relevante.

## `medium`

- deriva que aumenta retrabalho;
- inconsistência sem dano imediato;
- regra dependente de revisão;
- documentação incompleta;
- risco moderado de decisão errada.

## `low`

- melhoria de clareza;
- referência pouco precisa;
- redundância limitada;
- dívida sem impacto imediato.

## `informational`

- oportunidade;
- observação;
- recomendação não urgente;
- potencial para estudo de caso.

A severidade não deve ser baseada apenas na quantidade de arquivos afetados.

---

# 8. Confiança e qualidade da evidência

Cada achado deve registrar confiança:

```text
high
medium-high
medium
low
unknown
```

A confiança deve considerar:

- evidência direta;
- cobertura da inspeção;
- capacidade de reprodução;
- ambiguidade;
- dependência de inferência;
- ausência de arquivos locais;
- impossibilidade de executar testes.

Classifique também a evidência:

```text
direct-code
direct-config
direct-documentation
git-history
automated-check
manual-inspection
self-reported
inference
external-verification
```

Não use `high` quando a conclusão depender predominantemente de inferência.

---

# 9. Rubrica de notas

Use notas de 0 a 10.

Defina âncoras:

```text
0 — inexistente ou quebrado
2 — ad hoc e altamente frágil
4 — parcialmente implementado, inconsistências relevantes
6 — funcional, mas com lacunas importantes
8 — forte, consistente e bem sustentado
9 — muito maduro, poucas limitações relevantes
10 — exemplar, comprovado e sem lacunas materiais conhecidas
```

Notas acima de 9 devem exigir:

- evidência forte;
- consistência;
- controles;
- validação;
- poucas limitações materiais.

Não use décimos sem justificativa.

---

# 10. Áreas e pesos

Adote pesos iniciais que somem 100:

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

A metodologia deve explicar:

- como calcular a nota global;
- que o peso não substitui análise qualitativa;
- que uma área crítica pode limitar o veredito mesmo com média alta;
- como tratar área não auditada;
- como comparar snapshots com rubricas diferentes.

Não altere pesos em uma auditoria individual sem registrar mudança de metodologia.

---

# 11. Critérios por área

## 11.1 Arquitetura

Avaliar:

- limites de componentes;
- acoplamento;
- fluxos síncronos e assíncronos;
- isolamento de falhas;
- concorrência;
- resiliência;
- observabilidade;
- documentação de arquitetura;
- coerência entre diagramas e implementação.

## 11.2 Infraestrutura como código

Avaliar:

- modularidade;
- state;
- locking;
- idempotência;
- IAM;
- ambientes;
- validação;
- drift;
- segurança;
- reprodutibilidade;
- preparação para produção.

## 11.3 CI/CD

Avaliar:

- gates;
- dependências entre jobs;
- segurança;
- testes;
- promoção;
- concorrência;
- rollback;
- comentários obsoletos;
- coerência com política de branches;
- actions pinadas;
- proteção de ambientes.

## 11.4 Segurança

Avaliar:

- autenticação;
- autorização;
- segredos;
- OIDC;
- IAM;
- supply chain;
- scanners;
- vulnerabilidades;
- logging;
- detecção;
- configurações inseguras;
- controles apenas declarativos.

## 11.5 Testes

Avaliar:

- unidade;
- integração;
- contrato;
- E2E;
- smoke;
- cobertura de riscos;
- determinismo;
- isolamento;
- gates;
- confiança nas contagens;
- testes para falhas reais.

## 11.6 Código de aplicação

Avaliar:

- clareza;
- coesão;
- duplicação;
- tratamento de erro;
- concorrência;
- validação;
- consistência;
- comentários;
- contratos;
- dívida explícita;
- documentação próxima ao código.

## 11.7 Contratos e monorepo

Avaliar:

- contratos compartilhados;
- validação executável;
- fronteiras;
- versionamento;
- compatibilidade;
- workspaces;
- lockfile;
- acoplamento;
- semântica de updates;
- erros contratados.

## 11.8 Documentação

Avaliar:

- fontes canônicas;
- links;
- atualização;
- duplicação;
- fatos deriváveis;
- autoridade;
- README;
- diagramas;
- instruções contraditórias;
- conteúdo futuro já implementado;
- clareza do mapa documental.

## 11.9 Prontidão para produção

Avaliar:

- ambientes;
- rollback;
- backup;
- observabilidade;
- alarmes;
- runbooks;
- resiliência;
- segurança;
- testes de carga;
- DR;
- deploy real;
- evidência operacional.

Não confundir preparação técnica com produção comprovada.

## 11.10 Contexto e governança da IA

Avaliar:

- `CLAUDE.md`;
- contexto de sessão;
- memória;
- skills;
- separação entre regra, estado e histórico;
- precedência;
- conflitos;
- conteúdo derivável;
- reprodutibilidade;
- enforcement;
- atribuição humano–IA;
- captura de estudos de caso;
- dependências não versionadas;
- riscos de privacidade.

---

# 12. Auditoria de arquivos de contexto

A skill deve procurar:

- regra durável em `.project-context.md`;
- estado temporário no `CLAUDE.md`;
- histórico de sessão em fonte global;
- duplicação entre contexto e documentação;
- instruções contraditórias;
- arquivos citados que não existem;
- regras canônicas presentes apenas em memória local;
- contexto maior do que o necessário;
- URLs, hashes, versões e contagens deriváveis;
- dependência de skill ignorada;
- ausência de exemplo público para arquivo privado;
- contexto desatualizado;
- falta de data de expiração para estado temporário.

Ela deve distinguir:

```text
durable-rule
operational-state
canonical-knowledge
derived-fact
historical-record
personal-preference
private-context
```

Não mover ou corrigir conteúdo durante a auditoria.

---

# 13. Auditoria dos estudos de caso

Verificar:

- YAML válido;
- status coerente;
- `date_closed`;
- resumo versus corpo;
- unidade de análise;
- causalidade;
- atribuição;
- gatilhos;
- referências Git;
- `evidence_files`;
- arquivos inexistentes;
- antes e depois;
- limitações;
- casos contrários;
- obrigações de prova;
- revisão futura;
- distinção entre correção do estado e correção do mecanismo.

Aplicar as regras existentes do protocolo e template.

Não inventar evidência ausente.

---

# 14. Contradições entre fontes

A skill deve construir uma matriz:

```markdown
| Tema | Fonte A | Fonte B | Contradição | Autoridade provável | Evidência | Ação necessária |
|---|---|---|---|---|---|---|
```

Exemplos:

- política de branch;
- atribuição da IA;
- Definition of Done;
- criação de PR;
- estratégia de deploy;
- contagens de componentes;
- versões;
- existência de recursos;
- convenções de comentários;
- status de funcionalidades.

A skill não deve resolver silenciosamente conflitos de autoridade.

Quando a autoridade não estiver clara:

- classifique como decisão humana necessária;
- registre as alternativas;
- não escolha por conveniência.

---

# 15. Regras documentadas sem enforcement

Classifique cada política relevante como:

```text
documented-only
review-dependent
partially-automated
automatically-detected
automatically-blocking
```

Para cada política, registre:

```markdown
| Política | Fonte | Maturidade | Detecção | Consequência | Evidência | Risco |
|---|---|---|---|---|---|---|
```

Exemplos:

- comentários em inglês;
- proteção de branches;
- Conventional Commits;
- atualização de documentação;
- revisão de segurança;
- validação de casos;
- atualização de contexto;
- proibição de segredos.

---

# 16. Controles determinísticos

A metodologia deve separar:

## Trabalho semântico da skill

- interpretação;
- contradição;
- qualidade;
- causalidade;
- governança;
- priorização;
- avaliação de risco.

## Trabalho futuro de scripts ou CI

- links quebrados;
- YAML inválido;
- arquivos de evidência ausentes;
- campos obrigatórios;
- contagens;
- referências inexistentes;
- trigger types desconhecidos;
- versões divergentes;
- arquivos citados que não existem.

A skill deve indicar, para cada achado, se existe potencial de controle determinístico.

Ela não deve implementar esses controles durante a auditoria.

---

# 17. Comparação com avaliações anteriores

No modo `delta` ou `full`, localizar snapshots anteriores.

Para cada área:

```markdown
| Área | Nota anterior | Nota atual | Diferença | Evidência da evolução | Regressões | Confiança |
|---|---:|---:|---:|---|---|---|
```

Regras:

- não aumentar nota apenas porque mais arquivos foram criados;
- não reduzir nota por falta de inspeção;
- usar `not-assessed` quando necessário;
- distinguir mudança de rubrica de mudança do projeto;
- registrar baseline;
- nunca modificar snapshot anterior;
- explicar quando a comparação não é válida.

---

# 18. Formato do snapshot YAML

O template deve conter algo semelhante a:

```yaml
schema_version: 1
audit_id: PCA-YYYYMMDD-FULL
date: YYYY-MM-DD
mode: full
repository:
  branch:
  commit:
  working_tree_clean:
methodology:
  version:
  weights_version:
overall:
  score:
  confidence:
  verdict:
areas:
  architecture:
    score:
    confidence:
    evidence:
      - path:
        observation:
        evidence_type:
    limitations: []
    findings: []
comparison:
  baseline_snapshot:
  comparable:
  notes:
critical_findings: []
high_findings: []
limitations: []
```

Ajuste conforme necessário, mantendo YAML simples e legível.

Não armazene grandes trechos de código no snapshot.

---

# 19. Formato do relatório

O template deve conter:

```markdown
# Auditoria de consistência do projeto

## Metadados
## Escopo
## Limitações
## Veredito
## Evolução das notas
## Achados prioritários
## Avaliação por área
## Contradições entre fontes
## Políticas e enforcement
## Contexto e governança da IA
## Estudos de caso
## Reprodutibilidade
## Controles determinísticos sugeridos
## Prioridades
## Itens resolvidos desde a avaliação anterior
## Novos riscos
## Questões que exigem decisão humana
## Potenciais casos para o livro
## Arquivos gerados
```

Não force seções não aplicáveis em modo `quick`.

---

# 20. Relação com a captura para o livro

A skill deve avaliar se um achado possui valor para o livro.

Ela não deve abrir automaticamente um caso apenas porque encontrou um problema.

Deve seguir:

```text
docs/book/capture-protocol.md
.claude/skills/engineering-book-capture/SKILL.md
```

Comportamento:

- achado rotineiro: não abrir caso;
- contradição pedagógica relevante: sugerir ou acionar conforme protocolo;
- falha de governança com evidência histórica: avaliar caso;
- mudança de modelo mental: avaliar caso;
- auditoria completa como atividade: não é automaticamente um caso;
- criação desta própria skill: avaliar separadamente, sem forçar.

Não duplicar o caso dentro do relatório.

---

# 21. Privacidade e conteúdo local

Arquivos como:

```text
.project-context.md
memory/
.claude/
```

podem conter conteúdo local ou privado.

A skill deve:

- inspecioná-los quando disponíveis e necessários;
- não copiar dados pessoais para relatórios públicos;
- redigir informações sensíveis;
- não armazenar prompts privados completos;
- registrar apenas a evidência mínima;
- indicar quando a auditoria dependeu de arquivo não versionado;
- não presumir que outro clone terá acesso ao mesmo conteúdo.

---

# 22. Internet e fontes externas

Por padrão, a auditoria deve trabalhar apenas com o repositório e o histórico Git.

Não acessar internet automaticamente.

Pesquisa externa só é permitida quando:

- o usuário solicitar;
- a auditoria depender de informação atual;
- for necessário verificar versão, CVE, padrão ou documentação oficial;
- a limitação e a fonte forem registradas.

Não usar conteúdo externo para substituir evidência interna ausente.

---

# 23. Status dos achados

Cada achado pode ter:

```text
open
accepted-risk
needs-human-decision
false-positive
resolved-after-audit
not-actionable
```

Durante a auditoria inicial, use `open` ou `needs-human-decision`.

Não marque como resolvido sem evidência posterior.

---

# 24. Critérios para notas e progresso

A skill deve evitar inflação de notas.

Antes de aumentar uma nota, exigir ao menos uma das seguintes evoluções:

- risco técnico corrigido;
- controle adicionado;
- evidência operacional nova;
- contradição eliminada;
- teste relevante criado;
- processo reproduzível;
- falha histórica não recorrente por período definido;
- documentação alinhada ao código;
- automação substituindo dependência manual.

Antes de reduzir uma nota:

- confirmar regressão;
- diferenciar falta de inspeção;
- diferenciar mudança de rubrica;
- registrar evidência.

Uma nota alta com confiança baixa deve ser apresentada com ressalva.

---

# 25. Regras para o modo `quick`

O modo `quick` deve priorizar:

1. diff atual;
2. arquivos alterados;
3. fontes canônicas relacionadas;
4. referências cruzadas;
5. contexto;
6. estudos de caso ativos;
7. workflows afetados.

Limite sugerido:

- até 10 achados;
- priorização por severidade;
- sem nota global;
- sem histórico extenso;
- sem varredura completa de dependências.

Caso encontre um problema crítico, pode expandir apenas a área afetada e declarar a expansão.

---

# 26. Regras para o modo `full`

O modo `full` deve:

1. registrar baseline;
2. inventariar fontes;
3. executar checks disponíveis;
4. analisar código e documentos;
5. construir matriz de contradições;
6. avaliar enforcement;
7. avaliar contexto;
8. avaliar casos;
9. calcular notas;
10. comparar baseline anterior;
11. gerar relatório;
12. gerar snapshot;
13. listar limitações;
14. parar sem corrigir.

Não deve declarar “produção pronta” sem evidência operacional.

---

# 27. Regras para o modo `delta`

O modo `delta` deve:

- usar o último snapshot compatível;
- identificar o período comparado;
- listar commits relevantes;
- verificar se achados anteriores foram resolvidos;
- detectar novos achados;
- recalcular somente áreas inspecionadas;
- explicar diferenças;
- preservar notas anteriores;
- evitar narrativa de progresso quando a evidência for apenas documental.

---

# 28. Integração com Git

A skill deve registrar:

- branch;
- commit;
- working tree;
- base de comparação;
- arquivos ignorados relevantes;
- limitações do histórico.

Não deve:

- criar commit;
- criar tag;
- mudar branch;
- fazer stash;
- resetar;
- limpar arquivos;
- reescrever histórico.

Se o working tree estiver sujo:

- registrar;
- identificar se as mudanças fazem parte da auditoria;
- evitar atribuir estado local ao commit atual;
- pedir decisão apenas se isso impedir uma conclusão confiável.

---

# 29. Testes conceituais obrigatórios

Depois de criar a metodologia, templates e skill, faça simulações sem modificar o projeto.

## Cenário A — política de branches contraditória

- `CLAUDE.md` exige PR;
- documento de Git permite push direto;
- comentário de workflow trata push direto como normal.

Resultado esperado:

- `source-authority-conflict`;
- severidade proporcional;
- decisão humana necessária;
- nenhuma correção automática.

## Cenário B — comentário obsoleto no código

- comentário afirma que um recurso não existe;
- o recurso existe.

Resultado esperado:

- `documentation-drift` ou `stale-reference`;
- evidência direta;
- recomendação de correção separada.

## Cenário C — regra sem enforcement

- regra de comentários em inglês;
- nenhuma validação automática.

Resultado esperado:

- `documented-only`;
- `missing-enforcement`;
- não afirmar que a regra é inútil.

## Cenário D — skill canônica ignorada pelo Git

Resultado esperado:

- `unversioned-canonical-dependency`;
- `reproducibility-gap`;
- alternativas apresentadas;
- nenhuma alteração automática do `.gitignore`.

## Cenário E — CASE `resolved` com provas pendentes

Resultado esperado:

- `case-methodology-issue`;
- inconsistência entre status e corpo;
- recomendação de reabrir ou pausar.

## Cenário F — avaliação anterior inexistente

Resultado esperado:

- modo `delta` não inventa baseline;
- relatório informa ausência de comparação;
- snapshot atual pode ser criado como primeiro baseline.

## Cenário G — nota sobe sem evidência operacional

Resultado esperado:

- skill bloqueia ou reduz confiança da evolução;
- registra `score-evidence-gap`.

## Cenário H — contexto privado

Resultado esperado:

- conteúdo avaliado sem ser reproduzido integralmente;
- relatório registra dependência de arquivo local;
- dados sensíveis não são copiados.

## Cenário I — link quebrado

Resultado esperado:

- finding determinístico;
- sugestão de futuro check automatizado;
- nenhuma correção durante auditoria.

## Cenário J — mudança pequena

Resultado esperado:

- modo `quick`;
- sem auditoria completa;
- sem criação obrigatória de snapshot.

---

# 30. Validação estrutural

Ao concluir a criação, valide:

## Metodologia

- modos definidos;
- áreas definidas;
- rubrica estável;
- pesos somando 100;
- severidade definida;
- confiança definida;
- comportamento não corretivo;
- comparação histórica;
- privacidade;
- relação com casos;
- controles determinísticos.

## Skill

- front matter válido;
- nome correto;
- comandos reconhecíveis;
- sem duplicação excessiva;
- leitura proporcional;
- modos claros;
- proibições claras;
- geração de relatório e snapshot;
- simulações aprovadas.

## Templates

- relatório completo;
- snapshot YAML válido;
- campos coerentes;
- sem dados fictícios tratados como reais.

## Integração

- mapa documental atualizado;
- `CLAUDE.md` alterado apenas se necessário;
- decisão sobre versionamento explicitada;
- nenhum arquivo fora do escopo alterado.

---

# 31. Arquivos permitidos nesta tarefa

É permitido criar ou alterar somente:

```text
docs/engineering/audits/project-consistency-audit.md
docs/engineering/audits/templates/audit-report-template.md
docs/engineering/audits/templates/scores-template.yaml
docs/engineering/audits/reports/README.md
docs/engineering/audits/snapshots/README.md
.claude/skills/project-consistency-audit/SKILL.md
docs/README.md
CLAUDE.md
```

`CLAUDE.md` e `docs/README.md` só devem ser alterados se a integração realmente exigir.

Não altere `.gitignore` sem autorização canônica prévia.

Não crie relatório oficial.

Não crie snapshot oficial.

Não altere estudos de caso.

Não altere a skill `engineering-book-capture`.

Não altere código, infraestrutura ou workflows.

---

# 32. Relatório final da implementação

Ao concluir, apresente:

## Arquivos criados

Liste cada arquivo e sua função.

## Arquivos alterados

Explique por que foram alterados.

## Arquitetura adotada

Explique a divisão entre:

- metodologia;
- skill;
- templates;
- histórico;
- integração.

## Modos implementados

Resuma:

- quick;
- full;
- delta;
- area.

## Rubrica

Informe:

- áreas;
- pesos;
- escala;
- confiança;
- severidade.

## Comportamento de segurança

Confirme:

- não corretiva;
- sem commit;
- sem push;
- sem internet automática;
- sem vazamento de contexto privado;
- sem alteração silenciosa de `.gitignore`.

## Simulações

Apresente os resultados dos dez cenários.

## Questões abertas

Inclua:

- versionamento da skill;
- necessidade futura de scripts determinísticos;
- necessidade de primeiro baseline oficial;
- eventuais decisões de autoridade documental.

## Confirmação de escopo

Confirme que somente os arquivos permitidos foram alterados.

Não faça commit ou push.

---

## Resultado da execução

- Status: executed
- Data: 2026-08-04
- Commit: não commitado ainda (working tree)
- Pull request: nenhum ainda
- Arquivos alterados: `docs/engineering/audits/project-consistency-audit.md`, `.claude/skills/project-consistency-audit/SKILL.md`, `docs/engineering/audits/templates/audit-report-template.md`, `docs/engineering/audits/templates/scores-template.yaml`, `docs/engineering/audits/reports/README.md`, `docs/engineering/audits/snapshots/README.md`, `docs/README.md` (1 linha), `CLAUDE.md` (1 seção curta), `.gitignore` (versionamento de `.claude/skills/`, decisão posterior de Marcelo)
- Critérios satisfeitos: metodologia com 4 modos/13 áreas/pesos somando 100/severidade/confiança; skill sem duplicar a metodologia; templates alinhados; nenhum relatório/snapshot real criado; nenhum código/infraestrutura/workflow alterado; nenhum commit/push
- Critérios não satisfeitos: nenhum identificado até o momento
- Desvios em relação à instrução original: nenhum desvio de escopo; o versionamento de `.claude/skills/` (seção 2.7 do prompt) inicialmente ficou como "manter local" e só foi revertido depois, em pedido humano explícito separado
- Decisões humanas adicionais: Marcelo pediu explicitamente para versionar `.claude/skills/**` no `.gitignore` (2026-08-04), decisão que a instrução original deixava em aberto
- Documentação canônica resultante: `docs/engineering/audits/project-consistency-audit.md`, `.claude/skills/project-consistency-audit/SKILL.md`
- Estudo de caso relacionado: nenhum aberto até o momento; a auditoria encontrou uma contradição real de autoridade entre `CLAUDE.md` §9 e `docs/engineering/standards/git-and-review-workflow.md` durante a leitura obrigatória — candidato a achado de auditoria futura, não avaliado ainda como caso do livro
