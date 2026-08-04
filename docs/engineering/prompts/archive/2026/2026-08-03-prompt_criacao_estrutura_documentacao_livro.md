---
id: PROMPT-2026-006
title: "Prompt para criação da estrutura inicial de documentação do livro"
created_at: 2026-08-03
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt_criacao_estrutura_documentacao_livro.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para criação da estrutura inicial de documentação do livro

Quero preparar este repositório para registrar, de forma estruturada, aprendizados que futuramente poderão ser utilizados em um livro sobre engenharia de software assistida por IA.

Nesta etapa, faça **somente a criação da estrutura inicial de diretórios e arquivos**. Não altere regras do `CLAUDE.md`, arquivos de contexto, código da aplicação, pipelines, backlog ou documentação já existente.

## 1. Verificação inicial

Antes de criar qualquer coisa:

1. inspecione a estrutura atual do repositório;
2. confirme qual é o diretório de documentação existente;
3. neste projeto, prefira reutilizar `docs/`;
4. não crie um diretório paralelo chamado `doc/` caso `docs/` já exista;
5. não remova, mova ou renomeie arquivos existentes.

## 2. Estrutura a ser criada

Dentro de `docs/`, crie a seguinte estrutura:

```text
docs/
  engineering/
    decisions/
      README.md
    experiments/
      README.md

  book/
    README.md
    capture-protocol.md

    cases/
      README.md
      templates/
        case-template.md

    syntheses/
      README.md
      templates/
        monthly-synthesis-template.md

    metrics/
      README.md
      session-metrics-template.csv
```

Caso algum desses diretórios ou arquivos já exista, preserve seu conteúdo e apenas informe a existência. Não sobrescreva arquivos sem necessidade.

## 3. Responsabilidade de cada diretório

Considere as seguintes responsabilidades apenas para produzir descrições iniciais nos respectivos arquivos `README.md`.

### `docs/engineering/decisions/`

Armazenará decisões arquiteturais e técnicas atualmente válidas, preferencialmente no formato ADR.

### `docs/engineering/experiments/`

Armazenará experimentos técnicos cujo resultado ainda não era conhecido antecipadamente, incluindo hipótese, método, evidências e conclusão.

### `docs/book/cases/`

Armazenará estudos de caso históricos com valor pedagógico, como:

- hipóteses refutadas;
- erros ou limitações da IA;
- decisões humanas relevantes;
- testes que não provavam o comportamento pretendido;
- divergências entre mocks e serviços reais;
- controles de segurança ineficazes;
- mudanças importantes no modelo mental;
- decisões conscientes de não implementar.

Esses arquivos serão históricos e não deverão ser interpretados como descrição canônica do estado atual do sistema.

### `docs/book/syntheses/`

Armazenará sínteses periódicas dos padrões identificados em vários estudos de caso.

### `docs/book/metrics/`

Armazenará métricas seletivas sobre sessões de engenharia assistida por IA.

### Templates

Não crie um diretório genérico `docs/book/templates/`.

Os templates devem permanecer dentro das áreas às quais pertencem, conforme a árvore definida:

- `docs/book/cases/templates/`;
- `docs/book/syntheses/templates/`.

## 4. Conteúdo permitido nesta etapa

Os arquivos devem receber somente conteúdo inicial mínimo, suficiente para explicar sua finalidade.

### Arquivos `README.md`

Cada `README.md` deve conter apenas:

- um título;
- a finalidade do diretório;
- o tipo de conteúdo que será armazenado nele;
- uma observação de que os protocolos detalhados serão definidos posteriormente.

### `docs/book/capture-protocol.md`

Crie somente com:

```markdown
# Protocolo de captura de aprendizado

> Status: estrutura inicial. O protocolo detalhado será definido em uma etapa posterior.
```

Não implemente ainda regras, gatilhos, fluxos ou instruções para a IA.

### `docs/book/cases/templates/case-template.md`

Crie somente um esqueleto inicial com os títulos das seções, sem instruções detalhadas e sem preencher exemplos:

```markdown
---
id:
title:
date_started:
date_closed:
status:
themes: []
components: []
related_commits: []
related_pull_requests: []
ai_tool:
ai_autonomy_level:
book_potential:
---

# Contexto

# Problema observado

# Modelo mental inicial

# Hipótese inicial

# Participação da IA

# Alternativas consideradas

# Investigação

# Surpresa ou falha

# Evidências

# Decisão humana

# Solução final

# Mudança do modelo mental

# Princípio generalizável

# Limites da conclusão

# Potencial para o livro

# Revisão posterior
```

### `docs/book/syntheses/templates/monthly-synthesis-template.md`

Crie somente o seguinte esqueleto:

```markdown
---
period:
created_at:
related_cases: []
status:
---

# Visão geral do período

# Padrões recorrentes

# Falhas ou limitações recorrentes da IA

# Intervenções humanas relevantes

# Princípios emergentes

# Contradições entre casos

# Lacunas de evidência

# Possíveis capítulos ou seções do livro

# Experimentos recomendados
```

### `docs/book/metrics/session-metrics-template.csv`

Crie apenas o cabeçalho:

```csv
date,case_id,task_type,approximate_duration_minutes,ai_iterations,hypotheses_generated,hypotheses_rejected,discarded_changes,tests_created,initially_invalid_tests,pipeline_failures,human_interventions,ai_autonomy_level,outcome,notes
```

## 5. Restrições

Nesta etapa:

- não altere o `CLAUDE.md`;
- não altere `.project-context.md`;
- não altere arquivos de `memory/`;
- não altere o backlog;
- não crie uma skill;
- não crie hooks ou automações;
- não crie o primeiro estudo de caso;
- não tente extrair casos retroativamente do histórico;
- não altere código, testes, infraestrutura ou workflows;
- não faça commits sem minha autorização;
- não adicione dependências;
- não produza documentação extensa;
- não invente decisões ou informações sobre o projeto.

## 6. Validação

Depois da criação:

1. apresente a árvore final dos novos diretórios e arquivos;
2. confirme que nenhum arquivo existente foi sobrescrito;
3. liste qualquer conflito ou estrutura preexistente encontrada;
4. execute apenas verificações simples de existência e conteúdo dos arquivos;
5. não execute a suíte completa de testes, pois nenhuma parte executável do projeto deve ser modificada.

## 7. Resultado esperado

Encerre apresentando:

- arquivos criados;
- arquivos preservados por já existirem;
- eventuais desvios necessários em relação à estrutura solicitada;
- confirmação de que nenhuma outra parte do repositório foi alterada.

Não avance para nenhuma etapa posterior.
