---
id: PROMPT-2026-009
title: "Prompt para integrar a skill de captura ao `CLAUDE.md`"
created_at: 2026-08-04
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt_integracao_skill_no_claude_md.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para integrar a skill de captura ao `CLAUDE.md`

Quero agora integrar a skill `engineering-book-capture` ao processo normal de trabalho definido no `CLAUDE.md`.

O objetivo desta etapa é fazer com que a IA saiba **quando avaliar, acionar, atualizar e encerrar a skill**, sem transformar toda tarefa em estudo de caso e sem duplicar no `CLAUDE.md` o conteúdo detalhado do protocolo.

Nesta etapa, faça **somente a alteração necessária no `CLAUDE.md`**. Não altere a skill, o protocolo, o template, arquivos de contexto, backlog, código, testes, infraestrutura ou workflows.

---

## 1. Verificação inicial

Antes de editar:

1. leia integralmente:
   - `CLAUDE.md`;
   - `.claude/skills/engineering-book-capture/SKILL.md`;
   - `docs/book/capture-protocol.md`;
   - `docs/book/cases/templates/case-template.md`;
2. confirme que a skill existe e está consistente com o protocolo;
3. identifique no `CLAUDE.md` a seção mais adequada para integrar a nova regra;
4. procure regras já existentes sobre:
   - ciclo de trabalho;
   - investigação;
   - contexto;
   - documentação;
   - critérios de conclusão;
   - autonomia da IA;
5. evite duplicar princípios já presentes;
6. preserve o estilo, a organização e o idioma predominante do arquivo;
7. não altere nenhum outro arquivo.

Se encontrar inconsistências entre o `CLAUDE.md`, a skill e o protocolo:

- não corrija outros arquivos;
- preserve o protocolo como fonte canônica;
- adapte somente a referência operacional no `CLAUDE.md`;
- relate a inconsistência ao final.

---

## 2. Objetivo da integração

O `CLAUDE.md` deve passar a instruir a IA a:

- avaliar durante tarefas relevantes se existe potencial para estudo de caso;
- usar a skill `.claude/skills/engineering-book-capture/`;
- abrir automaticamente casos de relevância clara;
- pedir confirmação quando a relevância for ambígua;
- não acionar captura para tarefas rotineiras;
- atualizar o mesmo caso durante a investigação;
- verificar o estado do caso antes de concluir a tarefa;
- encerrar, pausar ou manter ativo o caso conforme as evidências;
- preservar a separação entre contexto operacional e registro histórico.

O `CLAUDE.md` deve conter apenas as regras operacionais resumidas. Os detalhes continuam nas fontes canônicas:

- `docs/book/capture-protocol.md`;
- `.claude/skills/engineering-book-capture/SKILL.md`;
- `docs/book/cases/templates/case-template.md`.

---

## 3. Alteração esperada

Adicione ao `CLAUDE.md` uma seção curta e operacional com título compatível com a estrutura existente.

Título sugerido:

```markdown
## Captura de aprendizado para o livro
```

Caso outro título se encaixe melhor na organização atual, use-o e explique a escolha ao final.

A seção deve incluir os seguintes princípios e instruções.

### 3.1 Avaliação durante o trabalho

Durante tarefas de engenharia, a IA deve avaliar silenciosamente se ocorreu algum gatilho definido em:

```text
docs/book/capture-protocol.md
```

Exemplos de sinais relevantes:

- hipótese refutada;
- decisão arquitetural ou trade-off importante;
- erro ou limitação da IA;
- intervenção humana relevante;
- teste inválido ou insuficiente;
- divergência entre mock e serviço real;
- controle existente, mas ineficaz;
- mudança significativa do modelo mental;
- incidente;
- comportamento inesperado;
- decisão consciente de não implementar;
- aprendizado generalizável.

A lista no `CLAUDE.md` deve ser resumida e não reproduzir integralmente o protocolo.

### 3.2 Relevância clara

Quando a relevância for clara:

- acione a skill `engineering-book-capture`;
- abra ou atualize um caso sem interromper desnecessariamente o fluxo;
- informe brevemente ao usuário que o caso foi criado ou atualizado;
- continue a tarefa normalmente;
- não peça confirmação apenas por formalidade.

A abertura automática só deve ocorrer quando houver:

- gatilho explícito;
- aprendizado não trivial;
- informação suficiente para registrar fatos e hipótese;
- baixo risco de atribuição incorreta de decisão ou motivação humana.

### 3.3 Relevância ambígua

Quando o valor pedagógico for possível, mas não estiver claro:

- não abra o caso automaticamente;
- faça uma pergunta curta solicitando confirmação;
- explique em uma frase qual possível gatilho foi identificado;
- não interrompa com perguntas extensas ou burocráticas.

### 3.4 Tarefa rotineira

Quando a tarefa não tiver aprendizado generalizável:

- não acione a skill;
- não crie caso;
- não explique longamente por que não criou;
- prossiga com o trabalho normal.

Exemplos:

- correção trivial de texto;
- ajuste visual simples;
- manutenção mecânica;
- criação rotineira de arquivo;
- alteração sem investigação, decisão ou surpresa relevante.

### 3.5 Continuidade do caso

Quando existir um caso ativo relacionado:

- atualize o mesmo caso;
- não abra outro caso para o mesmo problema;
- registre apenas eventos significativos;
- preserve a hipótese inicial;
- não reescreva retrospectivamente o raciocínio;
- relacione evidências quando elas surgirem.

### 3.6 Encerramento da tarefa

Antes de declarar concluída uma tarefa que tenha caso ativo:

- verifique o estado do caso;
- atualize a solução final;
- registre evidências obtidas e ausentes;
- registre participação da IA e decisões humanas;
- registre mudança do modelo mental, quando houver;
- extraia o princípio generalizável;
- defina se o caso deve ficar:
  - `resolved`;
  - `paused`;
  - `inconclusive`;
  - ou continuar `active`;
- não force encerramento sem evidência suficiente.

### 3.7 Invocação manual

O `CLAUDE.md` deve registrar de forma curta que o usuário também pode acionar manualmente:

```text
/engineering-book-capture
```

A invocação manual pode ser usada para:

- avaliar;
- abrir;
- atualizar;
- encerrar;
- revisar um caso.

### 3.8 Separação de responsabilidades documentais

A seção deve deixar explícito que:

- `CLAUDE.md` contém regras duráveis;
- `.project-context.md` e `memory/` contêm contexto operacional;
- `docs/book/cases/` contém registros históricos;
- casos não devem ser duplicados integralmente em arquivos de contexto;
- referências compactas ao caso só devem ser adicionadas ao contexto operacional quando houver impacto operacional ainda relevante;
- a skill e o protocolo são as fontes detalhadas para captura.

### 3.9 Prioridade do produto

Inclua uma regra explícita:

> A captura de aprendizado é complementar e nunca deve prejudicar a entrega, a segurança, a qualidade ou a clareza do trabalho principal.

---

## 4. Texto-base sugerido

Use o texto abaixo como base, adaptando-o ao estilo e à organização atual do `CLAUDE.md`.

Não copie mecanicamente se isso causar repetição ou conflito com regras existentes.

```markdown
## Captura de aprendizado para o livro

Este projeto também funciona como laboratório sobre engenharia de software assistida por IA. A entrega e a qualidade do produto continuam sendo a prioridade.

Durante tarefas de engenharia, avalie silenciosamente se ocorreu um gatilho relevante definido em `docs/book/capture-protocol.md`.

Use a skill `engineering-book-capture` quando houver aprendizado não trivial e generalizável, como hipótese refutada, decisão arquitetural relevante, erro ou limitação da IA, intervenção humana importante, teste inválido, divergência entre mock e serviço real, controle ineficaz, mudança de modelo mental, incidente ou trade-off significativo.

- Relevância clara: abra ou atualize o caso automaticamente, informe brevemente e continue o trabalho.
- Relevância ambígua: peça confirmação com uma pergunta curta antes de criar o caso.
- Tarefa rotineira: não acione a skill e não interrompa o fluxo.
- Caso já ativo: atualize o mesmo arquivo; não crie duplicidade.
- Ao concluir uma tarefa com caso ativo: atualize evidências, decisão final, participação humana e da IA, mudança do modelo mental, princípio generalizável e status do caso.

A skill também pode ser acionada manualmente por `/engineering-book-capture`.

As regras detalhadas estão em `docs/book/capture-protocol.md`, e a estrutura canônica está em `docs/book/cases/templates/case-template.md`.

Os estudos de caso são históricos e não devem ser tratados como estado operacional atual nem duplicados integralmente em `.project-context.md`, `memory/` ou `docs/backlog.md`.

A captura deve ser seletiva e nunca prejudicar a entrega, a segurança, a qualidade ou a clareza do trabalho principal.
```

---

## 5. Critérios de qualidade da alteração

A integração deve ser:

- curta;
- operacional;
- inequívoca;
- coerente com as regras já existentes;
- suficiente para descoberta e uso regular da skill;
- livre de duplicação extensa do protocolo;
- livre de exemplos excessivos;
- clara sobre acionamento automático e manual;
- clara sobre quando pedir confirmação;
- clara sobre quando não criar caso;
- clara sobre o encerramento do ciclo.

A nova seção não deve transformar o `CLAUDE.md` em documentação editorial extensa.

---

## 6. Restrições desta etapa

Nesta etapa:

- altere somente `CLAUDE.md`;
- não altere a skill;
- não altere `docs/book/capture-protocol.md`;
- não altere o template de casos;
- não altere outros arquivos de `docs/book/`;
- não altere `.project-context.md`;
- não altere arquivos de `memory/`;
- não altere `docs/backlog.md`;
- não crie casos reais;
- não extraia casos retroativamente;
- não crie hooks;
- não crie scripts;
- não crie subagentes;
- não crie automações;
- não altere configurações do Claude Code;
- não altere código, testes, infraestrutura ou workflows;
- não faça commit sem autorização;
- não execute a suíte completa de testes.

---

## 7. Validação final

Ao concluir:

1. apresente o trecho inserido ou alterado no `CLAUDE.md`;
2. informe em qual seção ele foi colocado;
3. confirme que o texto cobre:
   - avaliação automática;
   - relevância clara;
   - relevância ambígua;
   - tarefas rotineiras;
   - continuidade do caso;
   - encerramento;
   - invocação manual;
   - separação entre contexto operacional e histórico;
4. confirme que o protocolo e o template continuam sendo fontes canônicas;
5. confirme que somente `CLAUDE.md` foi alterado;
6. informe qualquer regra anterior que tenha sido reaproveitada para evitar duplicação;
7. informe qualquer conflito detectado;
8. confirme que nenhum caso real foi criado;
9. não avance para o teste controlado da skill.
