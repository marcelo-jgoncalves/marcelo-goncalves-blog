---
id: PROMPT-2026-007
title: "Prompt para criar a skill de captura de aprendizado"
created_at: 2026-08-04
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt_criacao_skill_captura_aprendizado.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para criar a skill de captura de aprendizado

Quero criar uma skill de projeto para o Claude Code responsável por aplicar o protocolo de captura de aprendizado e administrar estudos de caso que futuramente poderão servir como matéria-prima para um livro sobre engenharia de software assistida por IA.

A skill deverá poder ser acionada:

- automaticamente pela IA, quando a tarefa apresentar sinais claros de valor técnico, investigativo ou pedagógico;
- manualmente por mim, por meio de um comando `/engineering-book-capture`;
- com confirmação humana quando a relevância do caso for ambígua.

Nesta etapa, faça **somente a criação e a validação inicial da skill**. Não altere ainda o `CLAUDE.md`, arquivos de contexto, hooks, automações, templates, protocolo ou estudos de caso reais.

---

## 1. Verificação inicial

Antes de criar a skill:

1. inspecione a estrutura atual de `.claude/`;
2. verifique se já existe `.claude/skills/`;
3. verifique se já existe uma skill com finalidade ou nome semelhante;
4. leia integralmente:
   - `docs/book/capture-protocol.md`;
   - `docs/book/cases/README.md`;
   - `docs/book/cases/templates/case-template.md`;
   - `docs/book/README.md`;
5. confirme que o protocolo e o template estão consistentes o suficiente para serem usados pela skill;
6. não altere esses arquivos, mesmo se identificar melhorias;
7. registre no resultado final qualquer inconsistência encontrada.

Caso `.claude/skills/` ainda não exista, crie o diretório.

---

## 2. Estrutura a ser criada

Crie somente:

```text
.claude/
  skills/
    engineering-book-capture/
      SKILL.md
```

Não crie nesta etapa:

- scripts;
- hooks;
- subagentes;
- arquivos de configuração;
- exemplos;
- cópias do protocolo;
- cópias do template;
- arquivos auxiliares desnecessários.

A skill deve consultar diretamente os arquivos canônicos já existentes em `docs/book/`.

---

## 3. Nome e acionamento

O diretório da skill deve ser:

```text
engineering-book-capture
```

Ela deverá ser manualmente invocável como:

```text
/engineering-book-capture
```

O front matter de `SKILL.md` deve permitir tanto invocação manual quanto invocação pela IA.

Use:

```yaml
---
name: engineering-book-capture
description: Avalia e registra aprendizados de engenharia com potencial pedagógico para o futuro livro. Use ao detectar decisões relevantes, hipóteses refutadas, erros ou limitações da IA, intervenções humanas, testes inválidos, divergências entre mocks e serviços reais, controles ineficazes, mudanças de modelo mental, trade-offs importantes, incidentes ou outros eventos não triviais e generalizáveis. Também pode ser acionada manualmente para avaliar, abrir, atualizar, concluir ou revisar um estudo de caso.
when_to_use: Acione durante tarefas de engenharia quando houver um gatilho definido em docs/book/capture-protocol.md ou quando o usuário solicitar captura editorial, registro de aprendizado, criação de caso, atualização de caso ou encerramento de caso.
argument-hint: "[assess|open|update|close|review] [case-id ou contexto opcional]"
disable-model-invocation: false
user-invocable: true
---
```

Não adicione `allowed-tools` nesta etapa. A skill deve continuar submetida ao fluxo normal de permissões do projeto.

Não use `context: fork`, pois a skill precisa acompanhar o ciclo principal de trabalho e manter suas instruções disponíveis ao longo da tarefa.

Não fixe um modelo específico.

---

## 4. Fontes canônicas

O corpo da skill deve declarar explicitamente que:

- `docs/book/capture-protocol.md` é a fonte canônica das regras de captura;
- `docs/book/cases/templates/case-template.md` é a fonte canônica da estrutura de um caso;
- `docs/book/cases/README.md` define a finalidade da área;
- os arquivos de `docs/book/cases/` são históricos;
- os arquivos históricos não devem ser tratados como estado operacional atual;
- a skill não deve copiar integralmente o protocolo ou o template para `SKILL.md`;
- a skill deve reler os arquivos canônicos antes de criar ou modificar um caso;
- em caso de conflito, o protocolo prevalece sobre a skill e sobre o template;
- qualquer conflito detectado deve ser relatado, sem alteração silenciosa dos arquivos canônicos.

Use caminhos relativos ao projeto ou `${CLAUDE_PROJECT_DIR}` quando isso tornar a referência mais inequívoca.

---

## 5. Finalidade da skill

A skill deve executar cinco tipos de ação:

1. `assess` — avaliar se a tarefa merece um estudo de caso;
2. `open` — criar um novo caso;
3. `update` — atualizar um caso existente durante o trabalho;
4. `close` — concluir ou pausar um caso ao encerrar o ciclo;
5. `review` — revisar posteriormente um caso já concluído.

A skill deve interpretar argumentos manuais, quando presentes.

Exemplos:

```text
/engineering-book-capture assess
/engineering-book-capture open teste de concorrência
/engineering-book-capture update CASE-004
/engineering-book-capture close CASE-004
/engineering-book-capture review CASE-004
```

Quando for acionada sem argumentos, deve inferir a ação adequada a partir do estado atual da conversa e da tarefa.

Se não houver contexto suficiente para uma ação segura, deve explicar de forma objetiva o que falta. Não deve inventar fatos para preencher lacunas.

---

## 6. Comportamento na avaliação automática

Ao identificar um possível gatilho durante uma tarefa, a skill deve:

1. ler o protocolo;
2. verificar se existe aprendizado não trivial e potencialmente generalizável;
3. distinguir um simples evento técnico de um caso pedagogicamente relevante;
4. verificar se já existe um caso ativo sobre o mesmo assunto;
5. evitar duplicidade;
6. classificar a situação como:
   - `clear`;
   - `ambiguous`;
   - `not-relevant`.

### Caso `clear`

Quando houver relevância clara, a IA pode:

- abrir automaticamente um caso mínimo antes da investigação;
- informar brevemente que o caso foi aberto;
- continuar a tarefa sem interromper desnecessariamente o fluxo.

A abertura automática deve ocorrer apenas quando:

- existir um gatilho explícito do protocolo;
- o aprendizado provável for não trivial;
- houver informação suficiente para registrar fatos e hipótese inicial;
- a criação do caso não exigir inventar decisões ou motivações humanas.

### Caso `ambiguous`

Quando houver algum valor potencial, mas a relevância não estiver clara:

- não crie o caso automaticamente;
- faça uma pergunta curta solicitando confirmação;
- explique em uma frase qual foi o possível gatilho identificado.

### Caso `not-relevant`

Quando a tarefa for rotineira ou não apresentar aprendizado generalizável:

- não crie caso;
- não interrompa o trabalho;
- não produza justificativa longa;
- continue normalmente.

A skill não deve transformar toda tarefa em estudo de caso.

---

## 7. Comportamento na invocação manual

Quando eu acionar manualmente a skill:

- trate a solicitação explícita como autorização para avaliar o material;
- não presuma que todo acionamento exige criar um novo caso;
- verifique primeiro se o correto é abrir, atualizar, concluir ou revisar;
- caso eu informe uma ação explícita, respeite-a quando compatível com o protocolo;
- caso eu informe um `case-id`, localize e leia o arquivo correspondente;
- caso o caso não exista, informe isso claramente;
- não crie um caso substituto silenciosamente;
- caso faltem apenas detalhes menores, use campos vazios ou marque a incerteza;
- caso falte uma decisão humana material, solicite confirmação em vez de inventá-la.

---

## 8. Abertura de um novo caso

Ao abrir um caso:

1. leia o protocolo e o template;
2. procure casos existentes para evitar duplicidade;
3. determine o próximo ID disponível sem sobrescrever arquivos;
4. use o padrão:

```text
CASE-NNN-slug-descritivo.md
```

Exemplos:

```text
CASE-001-security-checks-did-not-gate-deploy.md
CASE-002-invalid-concurrency-test.md
```

5. copie a estrutura do template;
6. preencha somente informações sustentadas pelo estado atual;
7. preserve campos ainda desconhecidos sem inventar valores;
8. defina inicialmente:
   - `status: active`, quando o trabalho estiver em andamento;
   - `date_started`;
   - os gatilhos identificados;
   - o nível de autonomia conhecido até aquele momento;
9. registre antes da implementação, quando aplicável:
   - contexto;
   - problema observado;
   - fatos observados;
   - modelo mental inicial;
   - hipótese inicial;
   - riscos;
   - critérios de aceitação;
   - obrigações de prova;
10. não reescreva posteriormente a hipótese inicial para fazê-la parecer correta;
11. informe brevemente o caminho do arquivo criado.

Se o caso for aberto retrospectivamente por solicitação manual, marque explicitamente que a reconstrução é retrospectiva e identifique quais informações não puderam ser verificadas.

---

## 9. Atualização durante o trabalho

Ao atualizar um caso ativo:

- leia o arquivo atual antes de editar;
- preserve o conteúdo histórico já registrado;
- adicione apenas eventos significativos;
- não reescreva silenciosamente hipóteses anteriores;
- registre:
  - nova evidência;
  - hipótese descartada;
  - tentativa que falhou;
  - recomendação da IA rejeitada;
  - erro ou limitação da IA;
  - intervenção humana;
  - mudança de estratégia;
  - mudança de escopo;
  - alteração do nível de autonomia;
  - nova limitação;
  - questão em aberto;
- atualize referências a arquivos, testes, commits, PRs e pipelines quando elas realmente existirem;
- não registre cada comando;
- não copie logs extensos;
- não transcreva a conversa;
- não duplique grandes trechos de código;
- não altere o caso apenas para registrar atividade sem aprendizado.

Quando uma informação contradisser um registro anterior:

- preserve o registro original;
- acrescente a nova evidência;
- explique a mudança;
- não apague a evolução do raciocínio.

---

## 10. Encerramento do caso

Ao concluir uma tarefa relevante, a skill deve avaliar se existe um caso ativo relacionado.

Para encerrar o caso:

1. verificar os critérios de encerramento do protocolo;
2. registrar:
   - solução final;
   - evidências obtidas;
   - evidências ausentes;
   - decisão humana final;
   - participação efetiva da IA;
   - intervenções humanas;
   - tentativas malsucedidas relevantes;
   - alternativas rejeitadas;
   - mudança do modelo mental;
   - princípio generalizável;
   - limites da conclusão;
   - questões em aberto;
   - potencial para o livro;
3. atualizar:
   - `date_closed`;
   - `status`;
   - `ai_autonomy_level`;
   - referências disponíveis;
   - `review_after`, quando necessário;
4. usar:
   - `resolved`, quando houver conclusão sustentada;
   - `paused`, quando o trabalho for interrompido;
   - `inconclusive`, quando as evidências não permitirem conclusão;
   - outro status permitido pelo protocolo, quando apropriado;
5. não forçar uma conclusão positiva;
6. não declarar obrigações de prova satisfeitas sem evidência;
7. não afirmar ganho de produtividade sem métricas;
8. apresentar um resumo curto do que foi registrado.

A skill não deve fazer commit automaticamente.

---

## 11. Revisão posterior

Ao executar `review`:

- leia o caso;
- verifique a data e o objetivo da revisão;
- procure apenas evidências disponíveis no repositório e no contexto autorizado;
- registre:
  - se a decisão continua válida;
  - retrabalho observado;
  - efeitos não previstos;
  - novas evidências;
  - correções necessárias;
  - validade do princípio generalizável;
  - novo status;
- preserve o conteúdo original;
- não substitua a conclusão anterior sem explicar o que mudou;
- atualize `last_reviewed`.

Não realize pesquisa externa ou consultas fora do repositório sem solicitação ou autorização específica.

---

## 12. Classificação obrigatória

A skill deve preservar, conforme o protocolo, a distinção entre:

- `Observed fact`;
- `AI inference`;
- `AI proposal`;
- `AI implementation`;
- `Human decision`;
- `Human intervention`;
- `Automated evidence`;
- `Observed evidence`;
- `Open question`;
- `Limitation`.

Regras:

- uma sugestão da IA não é uma decisão;
- código produzido pela IA não prova que a decisão foi da IA;
- teste verde não é automaticamente evidência suficiente;
- uma afirmação de Marcelo não deve ser transformada em fato técnico sem validação;
- uma inferência não deve ser apresentada como comportamento observado;
- ausência de evidência deve ser registrada como ausência de evidência.

---

## 13. Proteção da autoria e das decisões

A skill nunca deve:

- inventar motivações de Marcelo;
- atribuir a Marcelo uma decisão ainda não confirmada;
- atribuir à IA uma decisão humana;
- ocultar que a IA gerou uma implementação, um teste ou uma hipótese;
- ocultar que Marcelo rejeitou, limitou ou corrigiu uma proposta;
- preencher retrospectivamente dúvidas ou convicções que não foram registradas;
- dramatizar a colaboração humano–IA;
- produzir narrativa promocional.

Quando a decisão humana for material e ainda não estiver clara, solicite confirmação.

---

## 14. Relação com o contexto operacional

A skill não deve, nesta etapa, alterar automaticamente:

- `CLAUDE.md`;
- `.project-context.md`;
- arquivos em `memory/`;
- `docs/backlog.md`.

Ela também não deve duplicar o estudo de caso nesses arquivos.

Caso identifique que uma referência compacta ao caso poderá ser útil ao contexto operacional:

- apenas recomende a atualização ao final;
- não a execute nesta etapa;
- informe:
  - ID;
  - título;
  - status;
  - impacto operacional ainda relevante.

A integração automática com os arquivos de contexto será definida em etapa posterior.

---

## 15. Relação com Git

A skill pode:

- ler `git status`;
- ler diffs;
- ler histórico;
- identificar commits;
- relacionar referências já existentes.

A skill não pode, por conta própria:

- criar commit;
- alterar commit;
- fazer push;
- abrir pull request;
- modificar branches;
- adicionar trailers a commits.

Quando relevante, pode sugerir trailers como:

```text
Book-Case: CASE-000
AI-Role: investigation, implementation, test-generation
Human-Decision: descrição curta
Evidence: unit, integration, CI
```

A aplicação desses trailers dependerá de autorização ou de uma etapa futura do processo.

---

## 16. Segurança e privacidade

A skill deve evitar registrar:

- tokens;
- segredos;
- credenciais;
- dados pessoais;
- conteúdo sensível;
- variáveis de ambiente privadas;
- logs com informações confidenciais;
- conversas completas;
- caminhos locais desnecessários;
- informações externas não verificadas.

Quando uma evidência contiver material sensível:

- registre apenas uma descrição sanitizada;
- indique que a evidência existe;
- não copie o conteúdo sensível para o caso.

---

## 17. Economia de contexto

O `SKILL.md` deve permanecer conciso e operacional.

Regras:

- não reproduza integralmente `capture-protocol.md`;
- não reproduza integralmente `case-template.md`;
- referencie e leia esses arquivos quando necessário;
- evite explicações teóricas extensas;
- priorize instruções executáveis;
- mantenha o arquivo abaixo de 500 linhas;
- não adicione arquivos auxiliares sem necessidade demonstrada.

---

## 18. Estado e continuidade durante a sessão

Como a skill pode permanecer ativa durante uma tarefa:

- trate suas instruções como válidas durante todo o ciclo em que foi acionada;
- não abra múltiplos casos para o mesmo problema;
- mantenha o mesmo caso enquanto a investigação continuar;
- procure um caso ativo antes de criar outro;
- atualize somente quando houver evento significativo;
- ao final da tarefa, verifique se o caso precisa ser concluído, pausado ou mantido ativo.

Não interrompa o usuário repetidamente para confirmar atualizações rotineiras.

---

## 19. Restrições desta etapa

Nesta etapa:

- crie somente `.claude/skills/engineering-book-capture/SKILL.md`;
- não altere `CLAUDE.md`;
- não altere `.project-context.md`;
- não altere arquivos de `memory/`;
- não altere `docs/backlog.md`;
- não altere `docs/book/capture-protocol.md`;
- não altere o template de casos;
- não altere outros arquivos de documentação;
- não crie casos reais;
- não extraia casos retroativamente;
- não crie hooks;
- não crie subagentes;
- não crie scripts;
- não crie automações;
- não adicione permissões pré-aprovadas;
- não altere configurações do Claude Code;
- não altere código, testes, infraestrutura ou workflows;
- não faça commit sem autorização;
- não execute a suíte completa de testes.

---

## 20. Validação da skill

Depois de criar o arquivo:

1. valide a sintaxe do front matter YAML;
2. confirme que o diretório determina o comando `/engineering-book-capture`;
3. confirme que:
   - `disable-model-invocation` está como `false`;
   - `user-invocable` está como `true`;
4. confirme que a descrição contém gatilhos suficientes para descoberta automática;
5. confirme que a skill permite:
   - avaliação automática;
   - invocação manual;
   - abertura;
   - atualização;
   - encerramento;
   - revisão;
6. confirme que ela consulta o protocolo e o template canônicos;
7. confirme que não possui `allowed-tools`;
8. confirme que não usa `context: fork`;
9. confirme que nenhum estudo de caso real foi criado;
10. confirme que nenhum outro arquivo foi alterado.

Se o Claude Code disponível permitir consultar as skills reconhecidas sem alterar configurações, verifique se a nova skill aparece. Caso a criação do diretório `.claude/skills/` durante a sessão exija reiniciar o Claude Code para descoberta, apenas informe essa necessidade; não faça outras alterações para contorná-la.

Não invoque a skill de modo que ela crie um caso real nesta etapa.

---

## 21. Resultado esperado

Encerre apresentando:

- caminho do arquivo criado;
- resumo do comportamento da skill;
- formas de acionamento;
- resultado da validação do front matter;
- confirmação de que somente o arquivo da skill foi criado;
- inconsistências encontradas entre protocolo e template;
- eventual necessidade de reiniciar o Claude Code para reconhecimento;
- confirmação de que nenhum caso, hook, script, subagente, automação ou alteração de contexto foi criado.

Não avance para a alteração do `CLAUDE.md`.
