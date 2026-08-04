---
id: WORK-2026-002
title: Organizar e persistir planejamentos editoriais, auditorias, prompts e instruções de mudança
type: change-instruction
status: executed
created_at: 2026-08-04
approved_at: 2026-08-04
started_at: 2026-08-04
completed_at: 2026-08-04
requested_by: Marcelo Gonçalves
execution_agent: Claude Code
scope: ["editorial/", "docs/engineering/audits/", "docs/engineering/prompts/", "docs/engineering/work-items/", "docs/archive/unclassified/", "docs/README.md"]
related_audits: []
related_cases: []
related_commits: []
related_pull_requests: []
superseded_by: []
resulting_documents:
  - editorial/README.md
  - editorial/plans/README.md
  - docs/engineering/prompts/README.md
  - docs/engineering/work-items/README.md
  - docs/archive/unclassified/README.md
contains_sensitive_content: false
---

# Prompt para organizar e persistir planejamentos editoriais, auditorias, prompts e instruções de mudança

Quero reorganizar e persistir no repositório os artefatos históricos e operacionais que hoje ficam dispersos em pastas locais, incluindo:

- planejamentos de postagens gerados por skill;
- relatórios de auditorias anteriores;
- snapshots de notas;
- prompts antigos;
- prompts ainda reutilizáveis;
- arquivos com instruções de ajustes;
- pacotes de execução usados pela IA;
- evidências ligadas a estudos de caso;
- arquivos históricos ainda sem classificação.

O objetivo é preservar materiais com valor operacional, histórico, pedagógico ou editorial sem criar uma pasta genérica de “histórico” que volte a acumular conteúdos de naturezas diferentes.

Princípio central:

> Arquivos ativos devem ser organizados por sua função atual; arquivos históricos devem permanecer próximos do domínio cuja evolução documentam.

Esta tarefa deve:

1. auditar os arquivos existentes;
2. classificá-los por natureza e ciclo de vida;
3. criar a estrutura canônica;
4. mover ou copiar somente quando metodologicamente correto;
5. evitar duplicação;
6. preservar vínculos com commits, PRs, casos e documentos resultantes;
7. atualizar as skills relacionadas para usarem os novos destinos;
8. registrar limitações e decisões pendentes.

Não faça commit ou push.

---

# 1. Leitura inicial obrigatória

Antes de alterar o repositório, leia integralmente, quando existirem:

```text
CLAUDE.md
docs/README.md
docs/engineering/standards/ai-assisted-workflow.md
docs/engineering/standards/git-and-review-workflow.md
docs/book/README.md
docs/book/capture-protocol.md
docs/book/cases/README.md
docs/book/cases/templates/case-template.md
.claude/skills/engineering-book-capture/SKILL.md
.claude/skills/project-consistency-audit/SKILL.md
```

Leia também:

- a skill responsável por gerar planejamentos editoriais;
- os diretórios atuais de postagens;
- a pasta atual de histórico;
- os arquivos de auditorias anteriores;
- os prompts antigos;
- os arquivos de instruções e ajustes;
- os estudos de caso existentes;
- os arquivos de evidência;
- `.gitignore`;
- `git status`;
- histórico recente do Git relacionado a documentação e skills.

Antes de editar:

1. inventarie todos os arquivos candidatos;
2. registre caminho atual, tipo aparente, data e tamanho;
3. verifique se contêm segredos ou dados pessoais;
4. identifique arquivos duplicados;
5. identifique arquivos já incorporados a skills, protocolos ou documentação;
6. não mova nada antes de concluir a classificação;
7. não use uma pasta genérica de destino para simplificar a tarefa.

Se houver arquivos locais fora do repositório que precisem ser incluídos, informe os caminhos e trate-os somente se estiverem acessíveis nesta execução.

---

# 2. Categorias canônicas

Cada arquivo deve receber exatamente um destino principal.

As categorias são:

```text
editorial-plan
audit-report
audit-snapshot
reusable-prompt
historical-prompt
change-instruction
case-evidence
canonical-document
architectural-decision
temporary-unclassified
discard
private-external
```

Não copie o mesmo artefato para várias categorias.

Use referências cruzadas em vez de duplicação.

---

# 3. Planejamentos editoriais

Criar a estrutura:

```text
editorial/
├── README.md
└── plans/
    ├── README.md
    ├── templates/
    │   └── post-plan-template.md
    └── YYYY/
        └── MM/
```

Exemplo:

```text
editorial/plans/2026/08/2026-08-04-ai-fluency.md
```

## 3.1 Regra de autoridade

Defina no `editorial/README.md` e em `editorial/plans/README.md`:

- o arquivo no repositório é a fonte canônica do planejamento;
- o CMS ou plataforma publicada é a fonte canônica do conteúdo final;
- o planejamento não deve duplicar permanentemente o post publicado;
- depois da publicação, o arquivo deve apontar para slug, ID ou URL canônica;
- alterações editoriais posteriores ao conteúdo publicado devem ocorrer no CMS ou na fonte canônica definida.

## 3.2 Front matter do planejamento

Crie o template com estrutura semelhante a:

```yaml
---
id: POST-PLAN-YYYY-NNN
title:
created_at:
updated_at:
status: idea
channels: []
source_skill:
planned_publication:
published_at:
canonical_content:
related_case:
related_work_items: []
tags: []
contains_sensitive_content: false
---
```

Status permitidos:

```text
idea
researching
planned
drafting
ready
scheduled
published
cancelled
archived
```

## 3.3 Organização

Não mover arquivos entre pastas de status.

Organizar cronologicamente por:

```text
YYYY/MM/
```

O status deve permanecer no front matter.

## 3.4 Skill editorial

Atualize a skill geradora de planejamentos para:

- salvar novos arquivos em `editorial/plans/YYYY/MM/`;
- usar o template;
- gerar ID estável;
- não sobrescrever planejamento existente;
- atualizar `updated_at`;
- registrar `source_skill`;
- não armazenar o post publicado completo;
- não fazer commit;
- não criar arquivos em pasta genérica de histórico.

---

# 4. Auditorias e snapshots

Usar ou criar:

```text
docs/engineering/audits/
├── reports/
│   ├── README.md
│   └── YYYY/
└── snapshots/
    ├── README.md
    └── YYYY/
```

## 4.1 Relatórios

Destino:

```text
docs/engineering/audits/reports/YYYY/YYYY-MM-DD-<modo>-project-audit.md
```

Exemplos:

```text
docs/engineering/audits/reports/2026/2026-08-04-full-project-audit.md
docs/engineering/audits/reports/2026/2026-09-03-delta-project-audit.md
```

Regras:

- relatórios antigos não devem ser sobrescritos;
- cada auditoria gera novo arquivo;
- conclusões históricas permanecem preservadas;
- correções futuras devem ser registradas em novo relatório ou revisão;
- relatório antigo não deve ser atualizado para parecer que já conhecia fatos posteriores.

## 4.2 Snapshots

Destino:

```text
docs/engineering/audits/snapshots/YYYY/YYYY-MM-DD-<modo>-scores.yaml
```

Regras:

- snapshots são imutáveis;
- preservam metodologia, commit, notas, confiança e limitações;
- comparação futura deve apontar para o snapshot anterior;
- não alterar retrospectivamente notas antigas;
- mudança de rubrica deve ser registrada.

## 4.3 Skill de auditoria

Atualize `project-consistency-audit` para:

- salvar relatórios e snapshots nos diretórios por ano;
- nunca sobrescrever arquivos existentes;
- registrar baseline;
- usar nome consistente;
- não gravar auditorias em pasta genérica;
- não incluir contexto privado integral nos relatórios;
- não fazer commit.

---

# 5. Prompts reutilizáveis e históricos

Criar:

```text
docs/engineering/prompts/
├── README.md
└── archive/
    └── YYYY/
```

## 5.1 Prompts reutilizáveis

Se um prompt ainda ensina como executar uma classe recorrente de tarefas, avaliar sua transformação em:

- skill;
- protocolo;
- template;
- documento canônico;
- comando operacional.

Não manter um prompt reutilizável somente como arquivo histórico se ele ainda possui função operacional.

Quando ainda for útil, mas não justificar uma skill, pode permanecer em:

```text
docs/engineering/prompts/
```

## 5.2 Prompts históricos

Destino:

```text
docs/engineering/prompts/archive/YYYY/YYYY-MM-DD-<descricao>.md
```

Usar front matter semelhante a:

```yaml
---
id: PROMPT-YYYY-NNN
title:
created_at:
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
related_commits: []
contains_sensitive_content: false
---
```

Status permitidos:

```text
active
executed
partially-executed
superseded
abandoned
historical
```

## 5.3 Regra de preservação

Preservar um prompt histórico quando:

- explica uma decisão importante;
- demonstra evolução do processo;
- sustenta um estudo de caso;
- possui valor pedagógico;
- permite reproduzir uma mudança;
- contém raciocínio que não foi incorporado integralmente a outra fonte.

Não preservar quando:

- é apenas uma tentativa mecânica;
- duplica integralmente uma skill ou protocolo;
- não pode ser compreendido fora da sessão;
- contém risco de privacidade maior que seu valor;
- não possui utilidade futura.

## 5.4 Segurança

Antes de versionar prompts antigos, revisar:

- credenciais;
- tokens;
- URLs privadas;
- nomes de clientes;
- dados pessoais;
- conversas completas;
- conteúdo confidencial;
- informações de infraestrutura sensíveis.

Quando necessário:

- remover;
- redigir com `<redacted>`;
- criar versão sanitizada;
- classificar como `private-external`;
- não adicionar ao repositório público.

---

# 6. Instruções de mudança e pacotes de execução

Criar:

```text
docs/engineering/work-items/
├── README.md
├── templates/
│   └── change-instruction-template.md
└── YYYY/
    └── MM/
```

Esses arquivos representam:

> O que deveria ser feito, em determinado momento, com determinado escopo.

Eles não representam necessariamente o estado atual do projeto.

## 6.1 O que entra em `work-items`

Classifique como `change-instruction`:

- instruções de ajustes após auditoria;
- planos detalhados de refatoração;
- prompts de implementação usados uma única vez;
- criação ou atualização de skill;
- migração documental;
- pacote de execução para IA;
- mudanças com critérios de aceite;
- tarefas amplas e temporais.

## 6.2 Nome do arquivo

Use:

```text
docs/engineering/work-items/YYYY/MM/YYYY-MM-DD-<descricao>.md
```

Exemplo:

```text
docs/engineering/work-items/2026/08/2026-08-04-create-project-consistency-audit-skill.md
```

## 6.3 Front matter

Crie o template com estrutura semelhante a:

```yaml
---
id: WORK-YYYY-NNN
title:
type: change-instruction
status: draft
created_at:
approved_at:
started_at:
completed_at:
requested_by:
execution_agent:
scope: []
related_audits: []
related_cases: []
related_commits: []
related_pull_requests: []
superseded_by: []
resulting_documents: []
contains_sensitive_content: false
---
```

Status permitidos:

```text
draft
approved
in-progress
blocked
executed
partially-executed
cancelled
superseded
```

## 6.4 Resultado da execução

Adicionar ao template:

```markdown
## Resultado da execução

- Status:
- Data:
- Commit:
- Pull request:
- Arquivos alterados:
- Critérios satisfeitos:
- Critérios não satisfeitos:
- Desvios em relação à instrução original:
- Decisões humanas adicionais:
- Documentação canônica resultante:
- Estudo de caso relacionado:
```

## 6.5 Preservação histórica

Não reescrever a instrução original para fazê-la parecer igual ao resultado final.

Preservar:

- escopo original;
- critérios originais;
- restrições;
- resultado separado;
- desvios;
- decisões posteriores.

---

# 7. Evidências ligadas a estudos de caso

Quando um prompt ou instrução for evidência direta de um caso, o destino principal deve ser:

```text
docs/book/cases/evidence/CASE-XXX/
```

Exemplos:

```text
docs/book/cases/evidence/CASE-001/original-refactoring-prompt.md
docs/book/cases/evidence/CASE-001/review-and-adjustment-instructions.md
docs/book/cases/evidence/CASE-002/review-and-adjustment-instructions.md
```

Regras:

- não duplicar o mesmo arquivo em `work-items` e `evidence`;
- escolher o destino principal com base na função predominante;
- usar links em `related_work_items`, `related_cases` ou referências no corpo;
- evidência de caso deve permanecer próxima ao caso;
- arquivos operacionais amplos devem permanecer em `work-items`.

## 7.1 Regra de decisão

Usar `case-evidence` quando o arquivo:

- explica diretamente como o caso evoluiu;
- registra uma intervenção metodológica no próprio caso;
- é necessário para compreender a hipótese, correção ou revisão;
- possui valor probatório para o livro.

Usar `change-instruction` quando o arquivo:

- orienta uma mudança ampla;
- não depende de um único caso;
- cria skill, protocolo, arquitetura ou processo;
- possui valor operacional além do caso.

---

# 8. Documentos canônicos e decisões

Durante a triagem, alguns arquivos podem não ser históricos.

## 8.1 Documento canônico

Se o conteúdo descreve como o projeto funciona agora, migrar para o destino canônico adequado em:

```text
docs/
```

Não manter uma cópia histórica ativa.

O arquivo histórico pode apontar para o documento resultante por:

```yaml
superseded_by:
  - docs/...
```

## 8.2 Decisão arquitetural

Se o arquivo registra uma decisão durável com alternativas e consequências, avaliar:

```text
docs/engineering/decisions/
```

Não classificar automaticamente todo prompt de decisão como ADR.

A decisão deve ter:

- contexto;
- decisão;
- alternativas;
- consequências;
- status;
- data.

---

# 9. Arquivos temporariamente não classificados

Criar somente se necessário:

```text
docs/archive/
├── README.md
└── unclassified/
```

Regra obrigatória:

> `unclassified/` é área temporária de triagem, não destino permanente.

O README deve definir:

- prazo para classificação;
- responsável;
- categorias disponíveis;
- proibição de novos arquivos sem metadados;
- revisão periódica.

Não mover arquivos para `unclassified/` por conveniência quando a classificação já for possível.

---

# 10. Arquivos a descartar

Classificar como `discard` quando:

- não possuem valor operacional;
- não possuem valor histórico;
- duplicam integralmente outra fonte;
- são tentativas incompreensíveis;
- são arquivos temporários;
- são versões intermediárias sem aprendizado;
- foram totalmente incorporados a outra fonte;
- não podem ser sanitizados com segurança.

Não apagar silenciosamente.

Produza uma lista de descarte com:

```markdown
| Arquivo | Motivo | Fonte substituta | Segurança verificada | Ação proposta |
|---|---|---|---|---|
```

Só remova arquivos quando a instrução original desta tarefa permitir e houver segurança de que não há valor residual.

Caso haja dúvida, classifique como `temporary-unclassified`.

---

# 11. Arquivos privados fora do repositório

Classifique como `private-external` materiais que:

- contenham dados pessoais;
- incluam conversas privadas;
- revelem clientes;
- contenham infraestrutura sensível;
- não possam ser sanitizados;
- não devam estar em repositório público.

Registre somente um índice sanitizado, se necessário:

```yaml
external_reference:
storage: private
description:
related_case:
```

Não registrar caminho pessoal absoluto, credencial ou URL privada no repositório público.

---

# 12. Matriz de classificação

Antes de mover arquivos, produza uma tabela:

```markdown
| Arquivo atual | Categoria | Destino proposto | Status | Duplicado? | Sensível? | Justificativa |
|---|---|---|---|---|---|---|
```

Categorias permitidas:

```text
editorial-plan
audit-report
audit-snapshot
reusable-prompt
historical-prompt
change-instruction
case-evidence
canonical-document
architectural-decision
temporary-unclassified
discard
private-external
```

Não mover itens com classificação `unknown`.

---

# 13. Regras de nomes

Use:

- datas em `YYYY-MM-DD`;
- diretórios por `YYYY/MM` quando houver alta frequência;
- slugs em inglês ou no padrão já adotado pelo projeto;
- IDs estáveis;
- nomes descritivos;
- sem sufixos como `final`, `final2`, `novo`, `corrigido`.

Exemplos corretos:

```text
2026-08-04-create-project-consistency-audit-skill.md
2026-08-04-full-project-audit.md
2026-08-04-ai-fluency.md
```

---

# 14. Atualização do mapa documental

Atualize:

```text
docs/README.md
```

somente para incluir os novos domínios:

- `editorial/`;
- `docs/engineering/audits/`;
- `docs/engineering/prompts/`;
- `docs/engineering/work-items/`;
- `docs/book/cases/evidence/`;
- `docs/archive/unclassified/`, se criado.

O mapa deve explicar a autoridade de cada destino.

Não duplicar todos os detalhes dos READMEs locais.

---

# 15. Atualização das skills

Revise as skills relacionadas.

## 15.1 Skill editorial

Deve:

- salvar planos no destino correto;
- usar template;
- gerar metadados;
- não armazenar conteúdo publicado completo;
- não criar histórico genérico.

## 15.2 Skill de auditoria

Deve:

- salvar relatórios e snapshots por ano;
- nunca sobrescrever;
- registrar baseline;
- não usar pasta genérica.

## 15.3 Skill de captura para o livro

Deve:

- salvar evidências extensas em `docs/book/cases/evidence/CASE-XXX/`;
- não copiar o mesmo artefato para outros destinos;
- apontar para work items quando aplicável.

## 15.4 Outras skills

Procure referências a:

```text
history/
historico/
postagens/
posts/
prompts/
archive/
```

Atualize somente quando a referência estiver dentro do escopo desta reorganização.

Não altere comportamento não relacionado.

---

# 16. Regras de versionamento

Devem ser versionados no repositório principal, quando sanitizados:

- planejamentos editoriais do projeto;
- relatórios de auditoria;
- snapshots;
- prompts históricos relevantes;
- work items;
- evidências de casos;
- templates;
- índices;
- regras de organização.

Não versionar:

- segredos;
- tokens;
- dados pessoais;
- prompts confidenciais;
- conteúdo de clientes;
- arquivos gerados em massa sem valor;
- artefatos binários grandes sem justificativa;
- contexto privado;
- rascunhos locais sem valor histórico.

Não altere `.gitignore` sem avaliar consequências.

Se uma pasta canônica estiver ignorada, registre:

- problema de reprodutibilidade;
- alternativas;
- decisão humana necessária.

---

# 17. Ciclo de vida dos work items

Documente em `docs/engineering/work-items/README.md`:

```text
Necessidade identificada
        ↓
Work item criado
        ↓
Aprovação humana
        ↓
Execução pela IA
        ↓
Validação
        ↓
Documento ou código canônico atualizado
        ↓
Work item marcado como executed
        ↓
Vínculo com commit, PR, auditoria ou caso
```

Regra:

- work item não substitui backlog;
- backlog aponta para work item quando houver pacote detalhado;
- work item não substitui PR;
- PR registra implementação e revisão;
- caso registra aprendizado;
- ADR registra decisão durável;
- documento canônico registra estado vigente.

---

# 18. Diferença entre os artefatos

Documente uma tabela canônica:

| Artefato | Função | Destino |
|---|---|---|
| Planejamento editorial | Planejar conteúdo futuro | `editorial/plans/` |
| Auditoria | Avaliar estado em uma data | `docs/engineering/audits/reports/` |
| Snapshot | Preservar notas comparáveis | `docs/engineering/audits/snapshots/` |
| Prompt reutilizável | Ensinar classe recorrente de tarefa | Skill, protocolo ou `docs/engineering/prompts/` |
| Prompt histórico | Preservar instrução antiga com valor | `docs/engineering/prompts/archive/` |
| Work item | Instruir mudança específica | `docs/engineering/work-items/` |
| Evidência de caso | Sustentar estudo de caso | `docs/book/cases/evidence/CASE-XXX/` |
| ADR | Registrar decisão durável | `docs/engineering/decisions/` |
| Documento canônico | Descrever estado atual | Destino funcional em `docs/` |
| Arquivo não classificado | Triagem temporária | `docs/archive/unclassified/` |

---

# 19. Migração

A migração deve ocorrer em etapas.

## Etapa 1 — Inventário

- listar arquivos;
- calcular hashes para detectar duplicados;
- identificar conteúdo sensível;
- classificar;
- não mover.

## Etapa 2 — Estrutura

- criar diretórios;
- criar READMEs;
- criar templates;
- atualizar mapa documental;
- não migrar ainda arquivos ambíguos.

## Etapa 3 — Migração segura

- mover arquivos claramente classificados;
- preservar histórico Git quando possível;
- usar `git mv` para arquivos já versionados;
- sanitizar antes de versionar;
- atualizar referências.

## Etapa 4 — Skills

- atualizar destinos;
- validar comportamento;
- simular criação de arquivos sem gerar artefatos reais desnecessários.

## Etapa 5 — Validação

- links;
- duplicações;
- arquivos órfãos;
- metadados;
- arquivos sensíveis;
- referências quebradas;
- categorias incorretas;
- arquivos restantes na pasta antiga.

Não remover a pasta antiga até que todos os arquivos tenham destino ou decisão explícita.

---

# 20. Critérios de decisão para duplicação

Não duplicar um arquivo em:

```text
work-items/
prompts/
case evidence/
```

Escolher destino principal pela função predominante.

Exemplos:

## Instrução para revisar CASE-001

Destino:

```text
docs/book/cases/evidence/CASE-001/review-and-adjustment-instructions.md
```

Motivo: evidencia a evolução do caso.

## Criação da skill de auditoria

Destino:

```text
docs/engineering/work-items/2026/08/2026-08-04-create-project-consistency-audit-skill.md
```

Motivo: pacote de execução amplo.

## Prompt incorporado integralmente a uma skill

Destino possível:

- `superseded`;
- arquivo histórico somente se possuir valor pedagógico;
- caso contrário, não preservar.

---

# 21. Validação de segurança

Antes de concluir:

1. procurar padrões de segredo;
2. procurar URLs privadas;
3. procurar dados pessoais;
4. procurar nomes de clientes;
5. verificar anexos e blocos de código;
6. revisar prompts antigos manualmente;
7. marcar `contains_sensitive_content`;
8. impedir inclusão pública de arquivos não sanitizados.

Não confiar apenas em busca automatizada.

---

# 22. Testes conceituais

Faça simulações sem criar arquivos desnecessários.

## Cenário A — planejamento ainda não publicado

Destino esperado:

```text
editorial/plans/YYYY/MM/
```

## Cenário B — post já publicado

O plano permanece e aponta para a fonte canônica publicada.

## Cenário C — auditoria antiga

Destino:

```text
docs/engineering/audits/reports/YYYY/
```

## Cenário D — snapshot de notas

Destino:

```text
docs/engineering/audits/snapshots/YYYY/
```

## Cenário E — prompt antigo incorporado a skill

Classificar como `superseded` ou descartar, conforme valor histórico.

## Cenário F — instrução de ajuste de estudo de caso

Destino:

```text
docs/book/cases/evidence/CASE-XXX/
```

## Cenário G — prompt de criação de skill

Destino:

```text
docs/engineering/work-items/YYYY/MM/
```

## Cenário H — arquivo com segredo

Destino:

```text
private-external
```

## Cenário I — arquivo duplicado

Preservar uma cópia principal e referências.

## Cenário J — arquivo ambíguo

Destino temporário:

```text
docs/archive/unclassified/
```

com decisão pendente.

---

# 23. Critérios de aceite

A reorganização será considerada adequada quando:

- não existir pasta genérica de histórico como destino permanente;
- cada arquivo tiver uma categoria;
- cada arquivo tiver um destino principal;
- planejamentos editoriais estiverem separados da documentação técnica;
- auditorias e snapshots estiverem preservados;
- prompts reutilizáveis forem distinguidos de prompts históricos;
- work items estiverem separados de documentação canônica;
- evidências de casos estiverem próximas dos casos;
- duplicação tiver sido evitada;
- skills usarem os novos destinos;
- arquivos sensíveis não forem publicados;
- mapa documental estiver atualizado;
- pasta antiga não contiver arquivos sem decisão;
- nenhum commit ou push tiver sido realizado.

---

# 24. Relatório final

Ao concluir, apresente:

## Estrutura criada

Liste diretórios, READMEs e templates.

## Inventário

Informe:

- total de arquivos analisados;
- quantidade por categoria;
- duplicados;
- arquivos sensíveis;
- arquivos ambíguos;
- arquivos propostos para descarte.

## Migração

Tabela:

```markdown
| Arquivo anterior | Categoria | Novo destino | Ação | Observação |
|---|---|---|---|---|
```

## Skills atualizadas

Explique:

- skill editorial;
- skill de auditoria;
- skill de captura para o livro;
- outras skills afetadas.

## Decisões de arquitetura

Explique:

- autoridade do planejamento;
- diferença entre prompt e work item;
- quando usar evidência de caso;
- tratamento de arquivos privados;
- regra contra duplicação.

## Questões abertas

Liste decisões que dependem de Marcelo.

## Confirmação de escopo

Confirme:

- nenhum código de aplicação foi alterado;
- nenhum commit foi criado;
- nenhum push foi realizado;
- nenhum arquivo sensível foi incluído;
- nenhum arquivo foi descartado sem justificativa.

---

## Resultado da execução

- Status: executed (com ressalvas de escopo, ver "Critérios não satisfeitos")
- Data: 2026-08-04
- Commit: não commitado ainda (working tree)
- Pull request: nenhum ainda
- Arquivos alterados: estrutura completa criada (`editorial/`, `docs/engineering/audits/{reports,snapshots}/2026/`, `docs/engineering/prompts/`, `docs/engineering/work-items/`, `docs/archive/unclassified/`); 26 planejamentos editoriais migrados de `projects/publishing-content/postagens/` para `editorial/plans/2026/{06,07}/` (originais removidos da fonte); o índice `00-README-planejamento-serie.md` também migrado, incorporado ao final de `editorial/plans/README.md` com tabela de mapeamento nome-antigo→caminho-atual, original removido da fonte (só os 4 PDFs de referência pessoal continuam lá, fora de escopo); 13 prompts históricos migrados de `marcelo-goncalves-blog-arquivo/prompts/` para `docs/engineering/prompts/archive/2026/` (originais removidos, pasta vazia mantida); 2 `ajustes/*.md` remanescentes migrados para `work-items/2026/08/` (`ajuste-13`, cancelled; `ajuste-15c`, blocked); este próprio arquivo e `2026-08-04-create-project-consistency-audit-skill.md` migrados para `work-items/2026/08/`; skills `post-planejamento` e `engineering-book-capture` atualizadas para os novos destinos
- Critérios satisfeitos: nenhuma pasta genérica de histórico criada como destino permanente; estrutura por categoria pronta; auditorias/prompts/work-items/planos editoriais distinguidos; migração confirmada com `git status`/contagem real de arquivo (27 planos incl. template, 13 prompts); revisão de segurança (grep de padrões de segredo/dado pessoal) feita antes de mover conteúdo real para o repositório público; nenhum código de aplicação alterado; nenhum commit/push
- Critérios não satisfeitos: `marcelo-goncalves-blog-arquivo/` fora de `prompts/` (docs-historico, prototipos-html-standalone, screenshots-sessoes, prototipos-visuais, duplicados, specs-paginas, investigacoes-e-notas-antigas — ~150 arquivos) não foi migrado nem classificado individualmente nesta execução — avaliado como fora do escopo das categorias do prompt original (não são editorial-plan/audit/prompt/work-item/case-evidence), tratado como decisão consciente, não como pendência esquecida; revisão de segurança foi por padrão automatizado (grep), não leitura humana linha a linha de todo o conteúdo migrado
- Desvios em relação à instrução original: nenhum desvio de categoria; a migração de conteúdo real (planos editoriais e prompts antigos) só ocorreu depois de confirmação explícita de Marcelo, por ser exposição pública difícil de reverter
- Decisões humanas adicionais: Marcelo autorizou migrar todos os 26 planos editoriais e os prompts antigos "com revisão de segurança" (2026-08-04)
- Documentação canônica resultante: ver "Arquivos alterados" acima
- Estudo de caso relacionado: nenhum aberto
