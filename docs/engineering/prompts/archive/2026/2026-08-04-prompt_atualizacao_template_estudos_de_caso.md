---
id: PROMPT-2026-004
title: "Prompt para atualizar o template de estudos de caso"
created_at: 2026-08-04
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt_atualizacao_template_estudos_de_caso.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para atualizar o template de estudos de caso

Quero agora atualizar o arquivo `docs/book/cases/templates/case-template.md` para que ele reflita integralmente o protocolo definido em `docs/book/capture-protocol.md`.

O objetivo desta etapa é transformar o template em um formato operacional, consistente e suficientemente estruturado para ser preenchido futuramente pela IA durante a captura de estudos de caso relacionados ao desenvolvimento do projeto e ao uso de IA na engenharia de software.

Nesta etapa, faça **somente a atualização do template de estudos de caso**. Não crie ainda a skill, não altere o protocolo, não altere arquivos de contexto e não crie estudos de caso reais.

## 1. Verificação inicial

Antes de editar:

1. leia integralmente:
   - `docs/book/capture-protocol.md`;
   - `docs/book/cases/README.md`;
   - `docs/book/cases/templates/case-template.md`;
2. verifique se o template atual está alinhado ao protocolo;
3. identifique campos ausentes, redundantes ou ambíguos;
4. preserve conteúdos válidos;
5. altere somente o arquivo `docs/book/cases/templates/case-template.md`.

## 2. Objetivo do template

O template deve permitir registrar, de forma clara e verificável:

- o contexto do caso;
- o problema observado;
- o modelo mental inicial;
- a hipótese inicial;
- as alternativas consideradas;
- a participação da IA;
- as decisões humanas;
- as intervenções humanas;
- o nível de autonomia utilizado;
- os riscos;
- os critérios de aceitação;
- as obrigações de prova;
- as evidências produzidas;
- as tentativas que falharam;
- a solução final;
- a mudança do modelo mental;
- o princípio generalizável;
- os limites da conclusão;
- o potencial pedagógico;
- a necessidade de revisão posterior.

O template deve preservar a diferença entre:

- fato observado;
- inferência da IA;
- proposta da IA;
- decisão humana;
- implementação da IA;
- intervenção humana;
- evidência automatizada;
- evidência observada;
- questão em aberto;
- limitação conhecida.

## 3. Requisitos gerais

O template deve:

- usar Markdown;
- usar português do Brasil;
- ser técnico, objetivo e honesto;
- permitir reconstruir a evolução do raciocínio;
- evitar narrativa retrospectiva artificial;
- evitar transcrição de conversa;
- evitar duplicação extensa de código;
- preferir referências para commits, pull requests, testes, pipelines e arquivos;
- deixar explícito que o caso é histórico e não necessariamente representa o estado atual do sistema;
- ser suficientemente detalhado para uso futuro em um livro;
- continuar prático o bastante para não gerar burocracia excessiva.

## 4. Front matter obrigatório

O arquivo deve começar com um front matter YAML contendo, no mínimo, os seguintes campos:

```yaml
---
id:
title:
summary:
date_started:
date_closed:
status:
themes: []
components: []
trigger_types: []
related_commits: []
related_pull_requests: []
related_files: []
related_tests: []
related_pipelines: []
related_adrs: []
related_experiments: []
ai_tool:
ai_model:
ai_autonomy_level:
book_potential:
review_after:
last_reviewed:
---
```

## 5. Regras dos campos do front matter

Inclua comentários HTML imediatamente abaixo do front matter, ou instruções curtas nas seções correspondentes, explicando:

### `status`

Use somente valores como:

- `draft`;
- `active`;
- `paused`;
- `inconclusive`;
- `resolved`;
- `superseded`;
- `archived`.

### `trigger_types`

Deve aceitar valores relacionados aos gatilhos definidos no protocolo, como:

- `architecture-decision`;
- `refuted-hypothesis`;
- `ai-error`;
- `human-intervention`;
- `invalid-test`;
- `mock-real-service-divergence`;
- `ineffective-control`;
- `cross-layer-bug`;
- `conscious-non-implementation`;
- `unexpected-result`;
- `mental-model-change`;
- `context-failure`;
- `productivity-experiment`;
- `operational-incident`;
- `refactoring-insight`;
- `engineering-tradeoff`.

### `ai_autonomy_level`

Deve registrar o maior nível de autonomia usado no caso, conforme a escala do protocolo:

- `0 — Explanation`;
- `1 — Suggestion`;
- `2 — Planning`;
- `3 — Scoped editing`;
- `4 — Full implementation cycle`;
- `5 — Commit or pull request preparation`;
- `6 — Non-production deployment`;
- `7 — Approved operational action`;
- `8 — Conditional production autonomy`.

### `book_potential`

Use uma classificação simples:

- `low`;
- `medium`;
- `high`.

### `review_after`

Deve aceitar uma data futura ou permanecer vazio quando não houver necessidade de revisão posterior.

## 6. Estrutura obrigatória do conteúdo

Depois do front matter, use exatamente esta estrutura principal:

```markdown
# Resumo do caso

# 1. Contexto

# 2. Problema observado

## 2.1 Fatos observados

## 2.2 Impacto

# 3. Modelo mental inicial

# 4. Hipótese inicial

# 5. Alternativas consideradas

## 5.1 Alternativa A

### Vantagens

### Riscos

### Motivo da adoção ou rejeição

# 6. Riscos e critérios de aceitação

## 6.1 Riscos conhecidos

## 6.2 Critérios de aceitação

## 6.3 Obrigações de prova

# 7. Participação da IA

## 7.1 Inferências da IA

## 7.2 Propostas da IA

## 7.3 Implementação realizada pela IA

## 7.4 Erros ou limitações da IA

# 8. Participação humana

## 8.1 Decisões de Marcelo

## 8.2 Intervenções humanas

## 8.3 Restrições ou redirecionamentos

# 9. Investigação e evolução

## 9.1 Evidências coletadas

## 9.2 Tentativas realizadas

## 9.3 Tentativas que falharam

## 9.4 Hipóteses descartadas

## 9.5 Mudanças de escopo ou estratégia

# 10. Solução final

# 11. Evidências de validação

## 11.1 Evidências automatizadas

## 11.2 Evidências observadas

## 11.3 Evidências ausentes ou insuficientes

# 12. Mudança do modelo mental

## 12.1 Antes

## 12.2 Depois

## 12.3 O que provocou a mudança

# 13. Princípio generalizável

# 14. Limites da conclusão

# 15. Questões em aberto

# 16. Potencial para o livro

## 16.1 Tema ou capítulo possível

## 16.2 Pergunta pedagógica central

## 16.3 Elementos necessários

## 16.4 Exercício possível para o leitor

# 17. Referências

# 18. Revisão posterior
```

## 7. Orientações dentro do template

Adicione instruções curtas em comentários HTML para orientar o preenchimento futuro.

Exemplo:

```markdown
<!-- Registre apenas fatos verificáveis. Não inclua interpretações nesta seção. -->
```

Esses comentários devem:

- explicar o que deve ser registrado;
- indicar o que não deve ser registrado;
- evitar ambiguidade;
- ser concisos;
- não transformar o template em um manual extenso.

Inclua orientações específicas para:

- preservar a hipótese inicial sem reescrevê-la depois;
- não atribuir decisões humanas à IA;
- não inventar motivações de Marcelo;
- distinguir implementação de decisão;
- registrar falhas da IA sem ocultá-las;
- registrar ausência de evidência;
- evitar afirmar produtividade sem métrica;
- registrar incerteza explicitamente;
- indicar quando uma seção pode permanecer vazia;
- usar links ou referências em vez de copiar código e logs extensos.

## 8. Obrigações de prova

Na seção `## 6.3 Obrigações de prova`, inclua um bloco orientador contendo uma tabela vazia:

```markdown
| Mudança ou afirmação | Evidência exigida | Evidência obtida | Status |
|---|---|---|---|
|  |  |  |  |
```

O campo `Status` deve admitir:

- `pending`;
- `satisfied`;
- `partially-satisfied`;
- `not-satisfied`;
- `not-applicable`.

## 9. Evidências coletadas

Na seção `## 9.1 Evidências coletadas`, inclua uma tabela vazia:

```markdown
| Tipo | Referência | O que demonstra | Limitação |
|---|---|---|---|
|  |  |  |  |
```

Os tipos podem incluir:

- teste;
- log;
- métrica;
- pipeline;
- scanner;
- comportamento observado;
- documentação oficial;
- commit;
- pull request;
- experimento.

## 10. Classificação da participação

Na seção de participação da IA e na seção de participação humana, inclua uma tabela resumida:

```markdown
| Classificação | Descrição | Referência |
|---|---|---|
|  |  |  |
```

As classificações possíveis devem seguir o protocolo:

- `AI inference`;
- `AI proposal`;
- `AI implementation`;
- `Human decision`;
- `Human intervention`;
- `Automated evidence`;
- `Observed evidence`;
- `Open question`;
- `Limitation`.

Não é necessário repetir todas as classificações em todos os casos.

## 11. Revisão posterior

Na seção `# 18. Revisão posterior`, inclua campos para:

- data da revisão;
- decisão ainda válida;
- retrabalho observado;
- efeitos não previstos;
- nova evidência;
- correções necessárias;
- princípio ainda generalizável;
- novo status do caso.

Use uma tabela simples:

```markdown
| Campo | Registro |
|---|---|
| Data da revisão |  |
| Decisão ainda válida |  |
| Retrabalho observado |  |
| Efeitos não previstos |  |
| Nova evidência |  |
| Correções necessárias |  |
| Princípio ainda generalizável |  |
| Novo status |  |
```

## 12. Relação com o protocolo

O template deve permanecer estritamente alinhado a `docs/book/capture-protocol.md`.

Caso exista conflito entre este prompt e o protocolo já aprovado:

1. preserve o princípio definido no protocolo;
2. adapte o template para permanecer compatível;
3. relate o conflito ao final;
4. não altere o protocolo.

## 13. Restrições desta etapa

Nesta etapa:

- altere somente `docs/book/cases/templates/case-template.md`;
- não altere `docs/book/capture-protocol.md`;
- não altere outros arquivos de `docs/book/`;
- não altere o `CLAUDE.md`;
- não altere `.project-context.md`;
- não altere arquivos de `memory/`;
- não altere o backlog;
- não crie skill;
- não crie hooks;
- não crie automações;
- não crie casos reais;
- não extraia casos retroativamente;
- não altere código, testes, infraestrutura ou workflows;
- não faça commit sem autorização;
- não execute a suíte completa de testes.

## 14. Validação final

Ao concluir:

1. apresente um resumo das mudanças feitas no template;
2. confirme que somente `docs/book/cases/templates/case-template.md` foi alterado;
3. confirme que o template cobre todos os elementos obrigatórios do protocolo;
4. informe campos ou seções que precisaram ser adaptados;
5. informe qualquer conflito encontrado entre o template anterior e o protocolo;
6. confirme que nenhum caso real, skill ou automação foi criado;
7. não avance para a próxima etapa.
