---
id: PROMPT-2026-005
title: "Prompt para auditar inconsistências no idioma dos comentários de código"
created_at: 2026-08-04
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt_auditoria_idioma_comentarios_ia.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para auditar inconsistências no idioma dos comentários de código

Quero realizar uma auditoria histórica e técnica sobre uma inconsistência observada durante o desenvolvimento assistido por IA:

> Em determinado momento do projeto, foi estabelecida a regra de que novos comentários no código deveriam ser escritos em inglês. Mesmo depois de a regra ter sido registrada no contexto da IA, comentários em português continuaram sendo criados ocasionalmente, sobretudo quando a IA modificava arquivos que já continham comentários em português.

O objetivo desta auditoria é reunir todas as evidências disponíveis no repositório para compreender:

- quando e como a regra foi introduzida;
- onde ela foi registrada;
- se existiam regras concorrentes ou ambíguas;
- quantas violações ocorreram depois de sua introdução;
- em quais contextos elas ocorreram;
- se arquivos com comentários legados em português apresentaram maior incidência;
- como as violações foram corrigidas;
- por que uma instrução declarada não se comportou como um controle confiável;
- quais aprendizados podem ser extraídos para um futuro livro sobre engenharia de software assistida por IA.

Nesta etapa, faça **somente a auditoria e o registro das evidências**. Não corrija comentários, não altere convenções, não implemente lint, não crie scripts permanentes e não modifique o processo de trabalho.

---

# 1. Natureza e valor pedagógico do caso

Esta investigação possui potencial para um estudo de caso sobre:

- competição entre instruções globais e padrões locais;
- influência do contexto imediato sobre o comportamento da IA;
- diferença entre política documentada e controle executável;
- persistência limitada de correções comportamentais;
- inconsistência em trabalho assistido por agentes;
- engenharia de contexto;
- necessidade de guardrails verificáveis;
- dívida de contexto e dívida de compreensão.

A hipótese central possível é:

> Uma regra registrada no contexto da IA funciona como orientação probabilística, mas pode perder força diante de padrões locais dominantes — como comentários legados em outro idioma — quando não existe um controle automatizado que detecte a violação.

Essa formulação deve permanecer como **hipótese** até que as evidências sejam avaliadas.

Não conclua antecipadamente que o padrão local foi a causa.

---

# 2. Pré-requisitos

Antes de iniciar:

1. execute `git status`;
2. confirme que não existem alterações locais que possam contaminar a auditoria;
3. leia, quando existirem:
   - `CLAUDE.md`;
   - `.project-context.md`;
   - arquivos em `memory/`;
   - `docs/README.md`;
   - `docs/engineering/standards/code-conventions.md`;
   - `docs/engineering/standards/ai-assisted-workflow.md`;
   - `docs/book/capture-protocol.md`;
   - `docs/book/cases/templates/case-template.md`;
   - `.claude/skills/engineering-book-capture/SKILL.md`;
   - documentos anteriores ou históricos que tenham definido convenções de idioma;
4. verifique se a skill `engineering-book-capture` está disponível;
5. não altere arquivos antes de registrar o estado inicial.

Caso o protocolo, o template ou a skill ainda não estejam disponíveis:

- não improvise um sistema paralelo;
- informe o pré-requisito ausente;
- pare antes de alterar o repositório.

---

# 3. Abrir o estudo de caso

Antes de iniciar a coleta detalhada, acione:

```text
/engineering-book-capture open inconsistência no idioma dos comentários após regra global de inglês
```

Este prompt constitui autorização explícita para abrir o caso. Não solicite confirmação adicional apenas por formalidade.

Título sugerido:

```text
Instrução global versus padrão local: comentários em português após a adoção do inglês
```

Adapte o título caso outra formulação descreva melhor os fatos.

## Gatilhos possíveis

Avalie, sem forçar:

- `ai-error`;
- `human-intervention`;
- `context-failure`;
- `unexpected-result`;
- `mental-model-change`;
- `engineering-tradeoff`;
- `ineffective-control`;
- `refactoring-insight`.

Use somente os gatilhos sustentados pelas evidências.

## Status inicial

Use:

```yaml
status: active
```

O caso não deve ser encerrado como `resolved` apenas porque a auditoria foi concluída. A causa pode permanecer parcialmente inferida.

---

# 4. Perguntas que a auditoria deve responder

A investigação deve buscar respostas para as seguintes perguntas.

## 4.1 Origem da regra

- Em qual arquivo a regra apareceu primeiro?
- Em qual commit?
- Em que data?
- Qual era a redação exata ou equivalente?
- A regra dizia:
  - que todos os comentários deveriam estar em inglês;
  - que apenas novos comentários deveriam estar em inglês;
  - que código novo deveria usar inglês;
  - ou algo mais amplo e ambíguo?
- A regra foi modificada, movida, resumida ou removida posteriormente?
- Ela estava em um arquivo carregado em todas as sessões?
- Existiam cópias divergentes da mesma regra?

## 4.2 Estado anterior

- Quantos comentários em português já existiam antes da regra?
- Em quais componentes?
- Em quais tipos de arquivo?
- Eram comentários úteis, comentários narrativos, TODOs ou explicações históricas?
- Havia arquivos predominantemente em português?
- Havia regras anteriores para seguir o estilo local do arquivo?

## 4.3 Violações posteriores

- Quais comentários em português foram adicionados depois da regra?
- Em quais datas e commits?
- Quantos foram adicionados em arquivos que já tinham comentários em português?
- Quantos foram adicionados em arquivos sem comentários anteriores em português?
- Quantos surgiram em arquivos novos?
- Quantos surgiram em arquivos legados?
- Eles foram posteriormente traduzidos?
- Quanto tempo permaneceram no repositório?
- A mesma violação reapareceu depois de uma correção?

## 4.4 Participação da IA

- Existem evidências de que a IA participou dos commits?
- Existem trailers, mensagens de commit, `Co-authored-by`, estudos de caso, registros de sessão ou contexto que sustentem essa participação?
- É possível atribuir com segurança uma linha específica à IA?
- A evidência permite apenas afirmar que a IA participou do commit, sem provar autoria da linha?

Nunca atribua um comentário específico à IA apenas porque o commit possui coautoria. Diferencie:

- participação no commit;
- autoria provável;
- autoria comprovada;
- autoria desconhecida.

## 4.5 Influência do contexto local

- Violações ocorreram com maior frequência em arquivos com comentários preexistentes em português?
- O comentário novo estava próximo de comentários em português?
- A estrutura textual, o vocabulário ou o estilo parecem imitar comentários vizinhos?
- O arquivo misturava código em inglês com domínio, conteúdo ou dados em português?
- A tarefa ou o prompt da sessão estava em português?
- Existia instrução para preservar estilo local?
- Existiam exemplos em português nos documentos lidos pela IA?

## 4.6 Força e disponibilidade da instrução

- A regra estava no `CLAUDE.md`, contexto temporário, memória ou documento secundário?
- Ela poderia ter sido removida ou comprimida em alguma refatoração?
- O arquivo que continha a regra era carregado automaticamente?
- A regra estava distante de instruções específicas do componente?
- Existiam instruções mais recentes ou locais que poderiam competir com ela?
- A regra era concreta o suficiente para determinar o comportamento?
- Ela distinguia comentários de:
  - strings;
  - conteúdo editorial;
  - documentação;
  - nomes de domínio;
  - mensagens de log;
  - textos de interface?

## 4.7 Enforcement

- Existia alguma validação automática para idioma de comentários?
- ESLint, Stylelint, Semgrep ou scripts verificavam esse aspecto?
- O CI poderia bloquear violações?
- PRs possuíam checklist?
- A regra dependia exclusivamente da memória e do contexto da IA?
- Houve correções manuais recorrentes?
- Algum controle parcial já existia, mas não era efetivo?

---

# 5. Escopo dos arquivos

Audite arquivos rastreados pelo Git que possam conter comentários de código, incluindo, quando existirem:

- TypeScript;
- JavaScript;
- TSX;
- JSX;
- Vue;
- CSS;
- SCSS;
- HTML;
- Terraform;
- HCL;
- YAML;
- shell scripts;
- Python;
- Dockerfiles;
- arquivos de configuração;
- workflows.

## Excluir ou tratar separadamente

Não contabilize como comentários de código:

- Markdown e documentação;
- conteúdo editorial;
- strings de interface;
- mensagens de erro;
- mensagens de log;
- nomes de testes;
- dados persistidos;
- URLs;
- JSON-LD;
- arquivos gerados;
- dependências vendorizadas;
- artefatos de build;
- snapshots, salvo se realmente contiverem comentários de código;
- arquivos ignorados ou não rastreados.

Se houver dúvida sobre uma ocorrência, classifique-a como `ambiguous` e não como violação confirmada.

---

# 6. Metodologia obrigatória

Use uma abordagem em camadas.

## 6.1 Descoberta da regra

Pesquise termos e variações em português e inglês:

```text
comment
comments
comentário
comentários
English
inglês
Portuguese
português
why not what
code in English
new comments
```

Pesquise em:

- estado atual;
- histórico Git;
- arquivos removidos;
- versões anteriores do `CLAUDE.md`;
- contexto;
- memória;
- documentação de padrões.

Use, quando apropriado:

```bash
git log -S
git log -G
git show
git blame
git diff
git grep
rg
```

Não use somente busca textual no estado atual.

## 6.2 Definição do marco temporal

Determine o commit mais defensável como marco de adoção da regra.

Caso existam vários marcos:

- primeira menção;
- formalização;
- reforço;
- migração para `CLAUDE.md`;

registre todos e explique qual será usado na análise quantitativa.

Não escolha silenciosamente o marco que produz o resultado mais conveniente.

## 6.3 Inventário dos comentários

Faça um inventário dos comentários atuais e históricos.

Priorize mecanismos capazes de distinguir comentários de strings.

Use, por ordem de preferência:

1. parser ou AST já disponível no projeto;
2. regras Semgrep já disponíveis;
3. ferramentas da linguagem já instaladas;
4. análise de diff e inspeção manual;
5. regex como triagem, nunca como prova final.

Não adicione dependências permanentes.

Se for necessário criar um script temporário:

- use diretório temporário fora do repositório, quando possível;
- não adicione o script ao Git;
- informe suas limitações;
- remova-o ao concluir;
- não trate sua saída como prova sem amostragem manual.

## 6.4 Classificação linguística

Classifique comentários como:

- `english`;
- `portuguese`;
- `mixed`;
- `language-neutral`;
- `ambiguous`.

Considere como `language-neutral`:

- identificadores;
- fórmulas;
- URLs;
- nomes de serviços;
- palavras técnicas isoladas;
- marcadores como TODO, FIXME ou NOTE sem frase natural.

Não classifique um comentário como português apenas por conter uma palavra que exista nos dois idiomas.

Faça inspeção manual de todas as violações candidatas.

## 6.5 Reconstrução histórica

Para cada comentário em português introduzido após o marco:

1. identifique o arquivo e a linha;
2. identifique o commit introdutor;
3. registre a data;
4. verifique o conteúdo anterior do arquivo;
5. verifique comentários próximos;
6. determine se o arquivo já continha português;
7. verifique se o comentário foi posteriormente modificado ou traduzido;
8. relacione o commit corretivo;
9. procure evidências de participação da IA;
10. procure regras ou contexto vigentes naquele momento.

Use `git blame` apenas como ponto de partida. Confirme pelo diff do commit.

## 6.6 Amostragem de controle

Selecione também exemplos em que a regra foi obedecida:

- comentário em inglês adicionado a arquivo com comentários em português;
- comentário em inglês adicionado a arquivo novo;
- comentário legado em português traduzido;
- tarefa em português que produziu comentário em inglês.

Esses casos de controle são importantes para evitar uma narrativa unilateral.

---

# 7. Dados que devem ser coletados

Crie no estudo de caso tabelas semelhantes às seguintes.

## 7.1 Linha do tempo da regra

```markdown
| Data | Commit | Arquivo | Evento | Redação resumida | Status |
|---|---|---|---|---|---|
```

Eventos possíveis:

- primeira menção;
- formalização;
- alteração;
- reforço;
- migração;
- remoção;
- restauração.

## 7.2 Violações confirmadas

```markdown
| ID | Data | Commit | Arquivo | Comentário resumido | Arquivo já tinha PT? | Comentários próximos em PT? | Corrigido? | Evidência de participação da IA | Confiança |
|---|---|---|---|---|---|---|---|---|---|
```

Não copie comentários extensos. Use trecho mínimo ou paráfrase fiel.

## 7.3 Casos de conformidade

```markdown
| Data | Commit | Arquivo | Situação | Fator contextual relevante |
|---|---|---|---|---|
```

## 7.4 Distribuição

Registre, quando os dados permitirem:

- total de comentários introduzidos depois da regra;
- comentários em inglês;
- comentários em português;
- comentários mistos;
- ambiguidades;
- violações em arquivos legados;
- violações em arquivos novos;
- violações com português próximo;
- violações sem português próximo;
- violações corrigidas;
- reincidências.

Não apresente percentuais quando a amostra for pequena sem destacar essa limitação.

## 7.5 Matriz de evidência causal

```markdown
| Hipótese | Evidência favorável | Evidência contrária | Confiança | O que ainda falta |
|---|---|---|---|---|
```

Hipóteses possíveis:

- imitação do padrão local;
- regra global pouco saliente;
- contexto não carregado;
- instruções concorrentes;
- regra ambígua;
- influência do idioma da conversa;
- ausência de enforcement;
- comentários legados normalizando a exceção;
- erro ocasional sem padrão identificável.

Não limite a análise a essas hipóteses.

---

# 8. Separação entre fatos e inferências

Use explicitamente as classificações do protocolo:

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

Exemplos:

### Fato observado

> A regra apareceu no commit X e estava no `CLAUDE.md` quando o comentário Y foi introduzido.

### Inferência

> A proximidade de comentários legados em português pode ter influenciado a geração.

### Conclusão não permitida sem evidência

> A IA ignorou a regra porque preferiu copiar o estilo local.

Não atribua intenção psicológica à IA.

---

# 9. Auditoria do controle atual

Avalie a regra como mecanismo de governança.

Responda:

- a política era clara?
- estava na fonte correta?
- era carregada no momento adequado?
- existiam exceções explícitas?
- havia conflitos?
- era verificável?
- sua violação produzia alguma consequência?
- dependia apenas de revisão humana?
- houve reincidência após correção?

Classifique a maturidade do controle:

- `documented-only`;
- `review-dependent`;
- `partially-automated`;
- `automatically-detected`;
- `automatically-blocking`.

Justifique a classificação com evidências.

---

# 10. Possíveis controles futuros

Não implemente nada nesta etapa.

Avalie alternativas, incluindo:

## 10.1 Regra contextual

- regra curta no `CLAUDE.md`;
- detalhes em `code-conventions.md`;
- instrução explícita para não imitar comentários legados;
- definição clara de “novo comentário”.

## 10.2 Migração de legado

- manter comentários existentes;
- migrar gradualmente quando o arquivo for alterado;
- migração única;
- proibir novos comentários em português sem exigir tradução retroativa.

## 10.3 Revisão

- checklist de PR;
- revisão específica de comentários novos;
- diff orientado a comentários.

## 10.4 Automação

- script baseado no diff;
- parser de comentários;
- Semgrep;
- detecção linguística;
- lista de termos;
- controle apenas para comentários novos;
- warning versus gate bloqueante.

Para cada alternativa, registre:

```markdown
| Alternativa | Cobertura | Falsos positivos | Custo | Manutenção | Capacidade de bloquear |
|---|---|---|---|---|---|
```

Considere que detecção automática de idioma pode ser imperfeita, sobretudo em comentários curtos e técnicos.

Não recomende bloqueio automático sem avaliar falsos positivos.

---

# 11. Potencial para o livro

No estudo de caso, desenvolva material para possíveis temas:

- instrução não é controle;
- competição entre contexto global e contexto local;
- comportamento emergente da IA em arquivos legados;
- guardrails declarativos versus executáveis;
- consistência probabilística;
- papel da revisão humana;
- contexto como sistema com precedência e conflitos;
- necessidade de medir violações, não apenas registrar regras;
- como transformar uma preferência em política verificável.

## Pergunta pedagógica central sugerida

> Por que uma IA continua violando uma regra que está claramente registrada em seu contexto?

## Contraste didático possível

```text
Regra declarada
      ↓
Comportamento inconsistente
      ↓
Auditoria histórica
      ↓
Hipóteses sobre competição contextual
      ↓
Controle verificável
```

## Elementos a preservar

- exemplo anterior à regra;
- primeira formalização;
- violação clara posterior;
- caso em arquivo com português legado;
- caso de conformidade apesar do português legado;
- correção humana;
- reincidência;
- ausência de gate;
- limitação das conclusões.

---

# 12. Limitações obrigatórias

Declare explicitamente limitações como:

- Git pode não preservar conversas completas;
- coautoria em commit não prova autoria de cada linha;
- comentários podem ter sido editados localmente antes do commit;
- regra registrada não prova que foi carregada em determinada sessão;
- idioma de comentário curto pode ser ambíguo;
- correlação com comentários vizinhos não prova causalidade;
- histórico reescrito ou squash pode esconder tentativas;
- ausência de evidência não prova ausência de participação da IA;
- não é possível reconstruir estados mentais humanos retrospectivamente sem registro.

---

# 13. Escopo de alterações permitido

Durante esta auditoria, altere somente:

- o estudo de caso criado em `docs/book/cases/`.

Não altere:

- comentários no código;
- `CLAUDE.md`;
- `.project-context.md`;
- arquivos em `memory/`;
- convenções;
- lint;
- Semgrep;
- CI/CD;
- workflows;
- código;
- testes;
- infraestrutura;
- backlog;
- outros estudos de caso;
- protocolo;
- template;
- skill.

Não faça commit ou push.

Não crie arquivos permanentes auxiliares.

---

# 14. Critérios de conclusão

A auditoria pode ser concluída quando:

- o marco da regra estiver identificado ou as alternativas estiverem documentadas;
- o estado anterior estiver caracterizado;
- todas as violações candidatas posteriores tiverem sido revisadas manualmente;
- violações confirmadas e ambiguidades estiverem separadas;
- casos de conformidade tiverem sido coletados;
- a linha do tempo estiver construída;
- a participação da IA estiver classificada com prudência;
- as hipóteses estiverem comparadas com evidências favoráveis e contrárias;
- o controle atual estiver classificado;
- alternativas futuras estiverem avaliadas sem implementação;
- limitações estiverem explícitas;
- o potencial pedagógico estiver documentado.

Caso a evidência seja insuficiente para determinar a causa, use:

```yaml
status: inconclusive
```

ou mantenha o caso `active`, conforme o protocolo.

Não force a conclusão de que o contexto local causou as violações.

---

# 15. Resultado final esperado

Ao terminar, apresente:

## 15.1 Resumo executivo

- regra auditada;
- marco temporal;
- quantidade de violações confirmadas;
- principal padrão observado;
- nível de confiança;
- principal limitação.

## 15.2 Linha do tempo

- introdução;
- reforços;
- violações;
- correções;
- reincidências.

## 15.3 Resultados quantitativos

- totais;
- distribuição;
- arquivos e componentes;
- legado versus novo;
- proximidade de comentários em português.

## 15.4 Resultados qualitativos

- exemplos representativos;
- regras concorrentes;
- padrões locais;
- participação da IA;
- intervenções humanas.

## 15.5 Hipóteses

- favoráveis;
- contrárias;
- confiança;
- evidência ainda necessária.

## 15.6 Avaliação do controle

- maturidade;
- lacunas;
- risco de recorrência.

## 15.7 Alternativas futuras

Somente avaliação, sem implementação.

## 15.8 Estudo de caso

Informe:

- ID;
- caminho;
- status;
- gatilhos;
- principais evidências;
- questões abertas;
- possível revisão posterior.

## 15.9 Arquivos alterados

Confirme que somente o estudo de caso foi alterado.

Não avance para correção ou implementação de guardrails.
