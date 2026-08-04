---
id: PROMPT-2026-010
title: "Prompt mestre para aplicar a reestruturação do processo de trabalho"
created_at: 2026-08-04
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt_mestre_ordem_reestruturacao_processo_trabalho.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt mestre para aplicar a reestruturação do processo de trabalho

Quero aplicar gradualmente a reestruturação documental e operacional deste repositório para melhorar:

- a organização das fontes canônicas;
- o contexto fornecido à IA;
- a captura de aprendizados para um futuro livro;
- o uso da skill de estudos de caso;
- a manutenção do `CLAUDE.md`;
- o fluxo de Git, commits, pull requests e revisão.

Os arquivos abaixo foram preparados em etapas diferentes e possuem dependências entre si. Leia-os e utilize-os **exatamente na ordem definida neste documento**.

Não execute todas as etapas de uma vez.

Depois de cada etapa executável:

1. valide o resultado;
2. apresente os arquivos alterados;
3. informe conflitos ou dúvidas;
4. pare;
5. aguarde minha autorização explícita para avançar.

---

# 1. Pré-requisitos

Antes de ler ou executar os arquivos:

1. inspecione o estado atual do repositório;
2. execute `git status`;
3. identifique alterações locais ainda não revisadas;
4. confirme a existência das estruturas:
   - `docs/book/`;
   - `docs/book/cases/`;
   - `docs/book/cases/templates/`;
   - `docs/book/syntheses/`;
   - `docs/book/metrics/`;
   - `docs/engineering/`;
5. confirme se já existe:
   - `docs/book/capture-protocol.md`;
   - `docs/book/cases/templates/case-template.md`;
   - `.claude/skills/engineering-book-capture/SKILL.md`;
6. não presuma que uma etapa anterior foi executada apenas porque seu prompt existe;
7. não sobrescreva conteúdo válido;
8. não faça commit ou push sem autorização explícita.

Caso a estrutura inicial de `docs/book/` ainda não exista, pare e informe que falta executar previamente o prompt de criação da estrutura documental.

---

# 2. Regras gerais de leitura e execução

Os arquivos pertencem a dois tipos:

## 2.1 Documentos de referência

Devem ser lidos para orientar decisões, mas não devem ser tratados como comandos de execução direta:

- `proposta_arquitetura_informacao_repositorio.md`;
- `orientacoes_git_pr_e_revisao_processo_trabalho.md`.

## 2.2 Prompts executáveis

Devem ser executados um por vez, na ordem indicada:

- `prompt_definicao_protocolo_captura_aprendizado.md`;
- `prompt_atualizacao_template_estudos_de_caso.md`;
- `prompt_criacao_skill_captura_aprendizado.md`;
- `prompt_integracao_skill_no_claude_md.md`;
- `prompt_refatoracao_claude_md_e_captura_para_livro.md`.

Quando um prompt executável restringir os arquivos que podem ser alterados, essa restrição deve ser respeitada integralmente.

Não antecipe uma etapa posterior.

---

# 3. Ordem obrigatória

## Etapa 1 — Ler a arquitetura geral da informação

Leia primeiro:

```text
proposta_arquitetura_informacao_repositorio.md
```

### Finalidade

Esse documento define:

- a separação entre regras, estado, decisões e histórico;
- a função de `CLAUDE.md`;
- a função de `.project-context.md`;
- a função de `memory/`;
- os destinos canônicos em `docs/`;
- a diferença entre documentação global e documentação próxima ao código;
- a estratégia gradual de migração.

### Comportamento esperado

Nesta etapa:

- não altere arquivos;
- não crie diretórios;
- não mova documentos;
- não execute ainda nenhum dos prompts posteriores;
- produza apenas um resumo curto dos princípios que deverão orientar as próximas etapas;
- informe qualquer incompatibilidade evidente entre a proposta e a estrutura atual;
- pare e aguarde autorização.

---

## Etapa 2 — Definir o protocolo de captura

Depois de autorizado, leia e execute:

```text
prompt_definicao_protocolo_captura_aprendizado.md
```

### Dependência

Essa etapa depende da existência da estrutura básica em:

```text
docs/book/
```

### Resultado esperado

Apenas:

```text
docs/book/capture-protocol.md
```

deve ser definido ou atualizado conforme o prompt.

### Regra

Não altere ainda:

- template;
- skill;
- `CLAUDE.md`;
- contexto;
- backlog;
- casos reais.

Ao terminar:

- valide o protocolo;
- informe o arquivo alterado;
- pare e aguarde autorização.

---

## Etapa 3 — Atualizar o template de estudos de caso

Depois de autorizado, leia e execute:

```text
prompt_atualizacao_template_estudos_de_caso.md
```

### Dependência

Leia novamente, como fonte canônica:

```text
docs/book/capture-protocol.md
```

### Resultado esperado

Apenas:

```text
docs/book/cases/templates/case-template.md
```

deve ser alterado.

### Regra

O protocolo prevalece em caso de conflito.

Não crie casos reais.

Ao terminar:

- valide a correspondência entre protocolo e template;
- informe o arquivo alterado;
- pare e aguarde autorização.

---

## Etapa 4 — Criar a skill

Depois de autorizado, leia e execute:

```text
prompt_criacao_skill_captura_aprendizado.md
```

### Dependências

Antes de criar a skill, releia:

```text
docs/book/capture-protocol.md
docs/book/cases/templates/case-template.md
docs/book/cases/README.md
docs/book/README.md
```

### Resultado esperado

Criar somente:

```text
.claude/skills/engineering-book-capture/SKILL.md
```

### Regra

Nesta etapa:

- não altere `CLAUDE.md`;
- não crie hooks;
- não crie scripts;
- não crie casos reais;
- não altere contexto;
- não adicione permissões automáticas.

Ao terminar:

- valide o front matter;
- confirme acionamento manual e automático;
- informe se o Claude Code precisa ser reiniciado para reconhecer a skill;
- pare e aguarde autorização.

---

## Etapa 5 — Integrar a skill ao `CLAUDE.md`

Depois de autorizado, leia e execute:

```text
prompt_integracao_skill_no_claude_md.md
```

### Dependências

Releia:

```text
CLAUDE.md
.claude/skills/engineering-book-capture/SKILL.md
docs/book/capture-protocol.md
docs/book/cases/templates/case-template.md
```

### Resultado esperado

Nesta etapa, somente:

```text
CLAUDE.md
```

pode ser alterado.

### Regra

A integração deve ser:

- curta;
- operacional;
- sem duplicar o protocolo;
- clara sobre acionamento automático;
- clara sobre confirmação em casos ambíguos;
- clara sobre tarefas rotineiras;
- clara sobre encerramento de casos.

Essa alteração é provisoriamente inserida no arquivo atual e deverá ser preservada na refatoração posterior.

Ao terminar:

- apresente o trecho inserido;
- confirme que nenhum caso foi criado;
- pare e aguarde autorização.

---

## Etapa 6 — Ler as orientações de Git e revisão

Depois de autorizado, leia:

```text
orientacoes_git_pr_e_revisao_processo_trabalho.md
```

### Finalidade

Esse documento orienta:

- quando usar branch;
- quando trabalhar diretamente em `develop`;
- Conventional Commits;
- trailers opcionais para casos do livro;
- preservação seletiva de commits;
- estrutura de pull requests;
- revisão baseada em risco;
- comentários no código;
- relação entre backlog, issue, PR, ADR e estudo de caso;
- Definition of Done.

### Comportamento esperado

Nesta etapa:

- não trate o arquivo como um prompt de execução;
- não altere ainda Git, branches ou documentação;
- não crie PR;
- não faça commit;
- identifique apenas como essas regras deverão influenciar a refatoração do `CLAUDE.md`;
- verifique se existe ou deveria existir:
  - `docs/engineering/standards/git-and-review-workflow.md`;
- não crie esse documento sem autorização ou sem que a etapa seguinte determine isso;
- pare e aguarde autorização.

---

## Etapa 7 — Refatorar o `CLAUDE.md` e as fontes canônicas

Somente depois de todas as etapas anteriores terem sido executadas e revisadas, leia e execute:

```text
prompt_refatoracao_claude_md_e_captura_para_livro.md
```

### Dependências obrigatórias

Antes da execução, confirme que existem e estão consistentes:

```text
docs/book/capture-protocol.md
docs/book/cases/templates/case-template.md
.claude/skills/engineering-book-capture/SKILL.md
```

Confirme também que o `CLAUDE.md` já contém a integração resumida da skill.

Use como referências:

```text
proposta_arquitetura_informacao_repositorio.md
orientacoes_git_pr_e_revisao_processo_trabalho.md
```

### Resultado esperado

Essa é a única etapa com escopo documental mais amplo.

Ela deve:

1. abrir um estudo de caso real antes da refatoração;
2. auditar o `CLAUDE.md`;
3. classificar seu conteúdo;
4. criar ou reutilizar fontes canônicas;
5. migrar conteúdo;
6. reduzir o `CLAUDE.md`;
7. preservar a integração da skill;
8. validar links e cobertura;
9. atualizar o estudo de caso;
10. definir revisão posterior.

### Regras especiais

- não apagar conteúdo `UNKNOWN`;
- não perder regra crítica;
- não transformar redução de linhas em objetivo absoluto;
- não mover arquivos apenas para reproduzir uma árvore ideal;
- não alterar código, infraestrutura ou workflows;
- não fazer commit ou push;
- não encerrar o caso como sucesso definitivo antes da revisão posterior;
- considerar as orientações de Git e revisão ao definir as regras resumidas do novo `CLAUDE.md`;
- se o documento canônico de Git ainda não existir e sua criação for necessária para receber conteúdo removido do `CLAUDE.md`, crie-o somente se isso estiver dentro do escopo permitido pelo prompt de refatoração;
- caso contrário, registre a criação como próxima etapa.

Ao terminar:

- apresente a tabela de migração;
- compare antes e depois;
- informe arquivos criados ou alterados;
- apresente o estudo de caso;
- liste questões abertas;
- pare e aguarde revisão humana.

---

# 4. Ordem resumida

A sequência obrigatória é:

```text
1. proposta_arquitetura_informacao_repositorio.md
   └─ leitura de referência, sem alterações

2. prompt_definicao_protocolo_captura_aprendizado.md
   └─ definir o protocolo

3. prompt_atualizacao_template_estudos_de_caso.md
   └─ alinhar o template ao protocolo

4. prompt_criacao_skill_captura_aprendizado.md
   └─ criar a skill

5. prompt_integracao_skill_no_claude_md.md
   └─ integrar a skill ao processo atual

6. orientacoes_git_pr_e_revisao_processo_trabalho.md
   └─ leitura de referência, sem execução direta

7. prompt_refatoracao_claude_md_e_captura_para_livro.md
   └─ refatorar o CLAUDE.md e organizar as fontes canônicas
```

---

# 5. Regras de interrupção

Pare imediatamente e solicite orientação quando:

- um arquivo esperado não existir;
- uma etapa anterior não tiver sido executada;
- protocolo, template e skill estiverem incompatíveis;
- houver alterações locais não relacionadas que possam ser sobrescritas;
- um prompt posterior depender de decisão humana ainda não tomada;
- o destino canônico de uma informação não estiver claro;
- houver risco de perder conteúdo não derivável;
- a etapa exigir alterar arquivos fora do escopo permitido;
- houver conflito entre os prompts.

Não contorne essas situações silenciosamente.

---

# 6. Hierarquia de autoridade

Em caso de conflito, use a seguinte prioridade:

1. instrução explícita mais recente do usuário;
2. protocolo canônico em `docs/book/capture-protocol.md`, para captura editorial;
3. documentação canônica vigente do repositório;
4. prompt específico da etapa atual;
5. documentos gerais de orientação;
6. conteúdo histórico.

A hierarquia não autoriza ignorar restrições de segurança ou escopo.

---

# 7. Encerramento do processo

Depois da última etapa, não considere o processo definitivamente concluído.

Ainda deverão ocorrer:

1. revisão manual do diff;
2. teste controlado da skill;
3. teste de tarefas:
   - claramente relevantes;
   - ambíguas;
   - rotineiras;
4. verificação do comportamento do novo `CLAUDE.md`;
5. autorização de commit;
6. revisão do estudo de caso após aproximadamente 30 dias.

Não avance automaticamente para essas atividades.
