---
id: PROMPT-2026-011
title: "Prompt para refatorar o `CLAUDE.md` e organizar suas fontes canônicas"
created_at: 2026-08-04
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt_refatoracao_claude_md_e_captura_para_livro.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para refatorar o `CLAUDE.md` e organizar suas fontes canônicas

Quero refatorar o `CLAUDE.md` deste repositório para que ele funcione exclusivamente como uma **constituição operacional da IA**: curto, estável, autoritativo e composto apenas por regras duráveis que realmente alteram o comportamento da IA em várias sessões futuras.

Atualmente, o arquivo mistura regras permanentes, estado operacional, arquitetura, detalhes de componentes, inventários deriváveis, histórico de sessões, decisões, migrações e documentação de design. A refatoração deve separar essas categorias sem perder conhecimento relevante.

Esta tarefa também possui valor pedagógico para o futuro livro sobre engenharia de software assistida por IA. Portanto, a própria refatoração deve ser registrada como um estudo de caso por meio da skill `engineering-book-capture`.

Execute o trabalho em etapas pequenas, verificáveis e sem reescrever silenciosamente a história do projeto.

---

# 1. Escopo da tarefa

Esta tarefa inclui:

1. abrir um estudo de caso sobre a refatoração do contexto da IA;
2. auditar o conteúdo atual do `CLAUDE.md`;
3. classificar cada bloco de informação;
4. identificar a fonte canônica adequada para cada categoria;
5. criar somente os documentos canônicos mínimos necessários;
6. migrar o conteúdo que não pertence ao `CLAUDE.md`;
7. reescrever e reduzir o `CLAUDE.md`;
8. validar que nenhuma regra crítica ou conhecimento não derivável foi perdido;
9. atualizar e concluir o estudo de caso;
10. apresentar o resultado para revisão.

Esta tarefa não inclui:

- alterações no código da aplicação;
- mudanças funcionais;
- mudanças de infraestrutura;
- atualização de dependências;
- execução de deploy;
- reorganização ampla de todos os documentos do repositório;
- extração retroativa de outros casos para o livro;
- criação de hooks, scripts ou novas skills;
- commit ou push sem autorização explícita.

---

# 2. Fontes que devem ser lidas antes de qualquer alteração

Leia integralmente, quando existirem:

- `CLAUDE.md`;
- `.project-context.md`;
- `docs/README.md`;
- `docs/book/capture-protocol.md`;
- `docs/book/cases/templates/case-template.md`;
- `.claude/skills/engineering-book-capture/SKILL.md`;
- `docs/backlog.md` ou o backlog canônico vigente;
- todos os arquivos `README.md` da raiz e dos componentes;
- documentos existentes relacionados a:
  - arquitetura;
  - auditorias;
  - migrações;
  - design system;
  - estratégia de testes;
  - ambientes;
  - deploy;
  - convenções de código;
  - contexto e memória.

Inspecione também:

- `package.json` e lockfiles;
- workflows em `.github/workflows/`;
- configuração de lint e testes;
- Terraform;
- arquivos canônicos de tokens CSS;
- estrutura de `memory/`;
- estrutura de `docs/`.

O objetivo dessa leitura é distinguir:

- informação realmente durável;
- informação temporária;
- informação histórica;
- informação derivável diretamente do repositório;
- informação já documentada em outro lugar;
- regra crítica ainda sem fonte canônica adequada.

Não altere arquivos durante essa primeira leitura.

---

# 3. Abrir o estudo de caso antes da refatoração

Antes de modificar o `CLAUDE.md`, acione manualmente:

```text
/engineering-book-capture open refatoração do CLAUDE.md e arquitetura do contexto da IA
```

A solicitação deste prompt constitui autorização explícita para abrir o caso. Não peça confirmação adicional apenas por formalidade.

O caso deve ser criado antes da refatoração para preservar o estado inicial.

## 3.1 Tema sugerido

Use um título técnico e não promocional, semelhante a:

```text
Refatoração do CLAUDE.md: separando regras, estado e memória histórica
```

Não force esse título caso outro descreva melhor o caso.

## 3.2 Gatilhos prováveis

Avalie, sem inventar classificações:

- `context-failure`;
- `refactoring-insight`;
- `engineering-tradeoff`;
- `mental-model-change`;
- `human-intervention`.

Use somente os gatilhos realmente sustentados pelos fatos observados.

## 3.3 Estado inicial a registrar

Registre como fatos observados:

- tamanho atual do `CLAUDE.md` em linhas e bytes;
- quantidade e nomes das seções;
- categorias de informação misturadas;
- exemplos representativos de:
  - regra durável;
  - estado operacional;
  - fato derivável;
  - histórico;
  - detalhe de componente;
  - decisão;
  - pendência;
- duplicações verificadas;
- referências para arquivos inexistentes ou ambíguos;
- contradições internas verificadas;
- informações com risco de obsolescência.

Não registre como fato uma interpretação ainda não comprovada.

## 3.4 Hipótese inicial do caso

A hipótese pode investigar se:

> separar regras duráveis, estado operacional, documentação canônica e histórico reduzirá entropia de contexto e risco de obsolescência sem diminuir a capacidade da IA de trabalhar corretamente.

Trate isso como hipótese, não como conclusão antecipada.

## 3.5 Métricas iniciais

Registre somente métricas objetivas disponíveis, como:

- linhas;
- bytes;
- quantidade de headings;
- quantidade de links internos;
- quantidade de URLs ou valores operacionais;
- quantidade de menções a sessões, datas ou commits;
- quantidade de inventários deriváveis;
- quantidade de conflitos ou duplicações confirmadas.

Não afirme melhoria de produtividade, qualidade ou consumo de tokens sem evidência apropriada.

---

# 4. Criar um inventário completo antes de mover conteúdo

Classifique cada seção, subseção ou bloco relevante do `CLAUDE.md` usando uma destas categorias:

| Classificação | Significado |
|---|---|
| `KEEP` | Regra durável que deve continuar no `CLAUDE.md` |
| `KEEP-SUMMARY` | Deve permanecer apenas como regra curta com link para detalhes |
| `MOVE` | Deve ser migrado para uma fonte canônica |
| `DERIVED` | Deve ser removido porque pode ser obtido diretamente do repositório |
| `TEMPORARY` | Deve ir para contexto operacional, backlog ou documento de entrega |
| `HISTORICAL` | Deve ir para ADR, caso, experimento, auditoria, migração ou Git |
| `CONFLICT` | Contradiz outra regra e precisa ser consolidado |
| `UNKNOWN` | Destino ainda não determinado; não remover até esclarecer |

Produza uma tabela de migração contendo:

```markdown
| Seção ou conteúdo atual | Classificação | Destino canônico | Ação | Justificativa |
|---|---|---|---|---|
```

Essa tabela deve ser registrada no estudo de caso ou apresentada no relatório de trabalho. Não é necessário criar um documento permanente adicional apenas para ela.

## Regra de segurança

Nenhum conteúdo `UNKNOWN` pode ser removido.

Nenhuma informação não derivável pode ser apagada antes de existir um destino canônico confirmado.

---

# 5. Resolver contradições antes da reescrita

Verifique explicitamente possíveis conflitos como:

## 5.1 Estratégia de branches

Consolidar regras como:

- `develop` como branch de integração;
- possibilidade de trabalho direto em ajustes pontuais;
- uso de `feature/*` e `fix/*` para mudanças que mereçam revisão como unidade;
- `main` como snapshot estável;
- ausência atual de necessidade de GitFlow completo.

A regra final deve ser única e sem formulações contraditórias.

## 5.2 Critério de conclusão

Consolidar possíveis conflitos entre:

- “todos os testes devem passar”;
- testes completos apenas mediante solicitação;
- validação proporcional ao risco;
- necessidade de pipeline verde;
- atualização obrigatória ou condicional do contexto.

A regra final deve dizer que:

- a validação é proporcional ao risco;
- cada tipo de mudança possui obrigações de prova;
- o ciclo termina quando todas as validações exigidas para aquele nível passam;
- a suíte completa não é automaticamente necessária para toda alteração;
- pipeline verde é obrigatório apenas quando houver push ou execução de pipeline aplicável;
- contexto só é atualizado quando o estado necessário para sessões futuras realmente mudou.

## 5.3 Arquivos de investigação

Verifique se `ACTIVE_INVESTIGATIONS.md`:

- existe;
- é rastreado;
- é intencionalmente local;
- foi substituído por outro mecanismo;
- ou é apenas uma referência obsoleta.

Não crie um arquivo paralelo sem necessidade.

Consolide o protocolo de investigação com o sistema atual de experimentos e casos.

## 5.4 Contexto e memória

Elimine conflito entre:

- “atualizar `.project-context.md` sempre”;
- “atualizar apenas em mudança arquitetural”;
- “registrar changelog por sessão”;
- “não registrar fatos deriváveis”.

A regra final deve ser baseada na necessidade real de continuidade, não no simples fato de uma sessão ter ocorrido.

---

# 6. Arquitetura canônica da informação

Antes de reduzir o `CLAUDE.md`, verifique se os destinos abaixo já existem.

Prefira reutilizar documentos existentes. Não crie arquivos duplicados apenas porque o nome sugerido é diferente.

Crie somente os documentos mínimos necessários para receber conteúdo que precisa sair do `CLAUDE.md`.

## 6.1 Mapa principal

### `docs/README.md`

Deve funcionar como índice da documentação e mapa de autoridade.

Deve informar onde encontrar:

- visão do produto;
- arquitetura;
- decisões;
- experimentos;
- padrões técnicos;
- operações;
- backlog;
- auditorias;
- migrações;
- estudos de caso do livro.

Também deve declarar:

- uma única fonte canônica por informação;
- links em vez de cópias;
- distinção entre documentação atual e histórica;
- preferência por fontes executáveis para fatos deriváveis.

## 6.2 Destinos recomendados

Use ou crie, somente quando necessários:

### Produto

```text
docs/product/vision.md
```

Para:

- propósito;
- público;
- proposta de valor;
- objetivos e não objetivos.

### Arquitetura

```text
docs/architecture/system-overview.md
docs/architecture/integration-flows.md
```

Para:

- componentes;
- responsabilidades;
- visão geral da AWS;
- fluxos de autenticação, imagens, cache e publicação.

### Padrões de engenharia

```text
docs/engineering/standards/engineering-principles.md
docs/engineering/standards/code-conventions.md
docs/engineering/standards/testing-strategy.md
docs/engineering/standards/ai-assisted-workflow.md
```

Para:

- DRY, KISS e YAGNI;
- idioma de nomes;
- comentários “why, not what”;
- estratégia de testes;
- análise versus ação;
- protocolo incremental;
- critérios de validação;
- colaboração humano–IA.

### Operações

```text
docs/operations/environments.md
docs/operations/deployment.md
docs/operations/known-issues.md
```

Para:

- ambientes existentes;
- URLs e endpoints;
- branches e deploy;
- pipeline;
- vulnerabilidades residuais e riscos operacionais atuais;
- problemas ainda relevantes.

Não registrar segredos.

### Documentação específica de componentes

Prefira:

```text
frontend/README.md
frontend/docs/design-system.md
frontend/docs/seo.md
frontend/docs/image-pipeline.md
backend/README.md
admin/README.md
infra/README.md
```

Para regras úteis somente quando se trabalha naquele componente.

Se arquivos equivalentes já existirem, use-os.

## 6.3 Documentos temporários ou históricos

Use os destinos já existentes:

- backlog vigente;
- auditorias;
- migrações;
- ADRs;
- experimentos;
- estudos de caso;
- Git.

Não mova todos os documentos para uma nova árvore apenas para satisfazer uma estrutura ideal. Esta tarefa deve priorizar a refatoração segura do `CLAUDE.md`, não uma reorganização completa do repositório.

---

# 7. Regras de roteamento do conteúdo atual

Aplique as seguintes orientações.

## 7.1 Contexto do projeto

### Manter no `CLAUDE.md`

Somente:

- uma frase curta sobre o tipo de sistema;
- papéis de Marcelo e da IA;
- link para a visão completa.

### Mover

- pivôs históricos;
- detalhes comerciais;
- mudanças de rota;
- narrativas de sessões.

Destino: visão do produto, Git ou caso histórico apropriado.

## 7.2 URLs, ambiente e estado atual

Mover para:

```text
docs/operations/environments.md
```

Não manter no `CLAUDE.md`:

- URLs atuais;
- indicação de pipeline verde;
- “produção não existe” como dado operacional;
- endpoints;
- contagens de ambientes.

No `CLAUDE.md`, manter apenas a regra de consultar o documento de ambientes quando necessário.

## 7.3 Arquitetura e inventários

Mover para documentação arquitetural ou READMEs dos componentes.

Remover inventários deriváveis como:

- número de Lambdas;
- número de módulos Terraform;
- versões;
- listas completas de componentes que o código já revela.

No `CLAUDE.md`, manter apenas um mapa curto de leitura por área.

## 7.4 Princípios DRY, KISS e YAGNI

Mover o racional e os exemplos históricos para:

```text
docs/engineering/standards/engineering-principles.md
```

No `CLAUDE.md`, manter uma regra curta:

- aplicar princípios com julgamento;
- não forçar abstração ou migração retroativa;
- consultar o documento canônico.

## 7.5 Feedback e colaboração humano–IA

Manter no `CLAUDE.md`:

- análise não autoriza alteração;
- responder perguntas sem executar ações implícitas;
- investigação baseada em hipótese e evidência;
- regras essenciais de autorização.

Mover explicações extensas e exemplos para:

```text
docs/engineering/standards/ai-assisted-workflow.md
```

Preferências pessoais duráveis de colaboração podem continuar em `memory/`, sem duplicação.

## 7.6 Regra de Bash

Manter no `CLAUDE.md`, pois é uma restrição operacional específica da ferramenta e afeta toda sessão.

Reduzir para:

- princípio;
- formas proibidas;
- dois ou três exemplos essenciais;
- referência para detalhes, caso exista.

Não manter uma tabela longa se uma regra curta for suficiente.

## 7.7 Convenções de código

Mover detalhes, exemplos históricos, auditorias e exceções para:

```text
docs/engineering/standards/code-conventions.md
```

No `CLAUDE.md`, manter somente:

- código novo em inglês;
- conteúdo, dados persistidos e URLs em português quando essa for a convenção vigente;
- comentários explicam “por quê”, não “o quê”;
- não incluir contexto de sessão ou autoria de IA no código;
- link para a documentação detalhada.

## 7.8 Gotchas técnicos

Uma regra específica deve permanecer no `CLAUDE.md` somente se:

1. afetar várias áreas ou sessões;
2. não for facilmente descoberta no código;
3. sua violação tiver alto risco;
4. a IA precise conhecê-la antes de escolher quais arquivos ler.

Gotchas específicos de Next.js, OpenNext, DynamoDB, Sharp, CloudFront, SEO, backend ou Terraform devem ir para:

- README do componente;
- documentação específica;
- comentário “why” próximo ao código;
- teste ou validação automatizada.

No `CLAUDE.md`, manter um mapa:

```markdown
Antes de alterar um componente, leia seu README e a documentação associada.
```

Não manter uma enciclopédia de particularidades técnicas.

## 7.9 Design system

Mover para:

```text
frontend/docs/design-system.md
```

O documento pode explicar:

- princípios;
- papéis dos tokens;
- tipografia;
- cores;
- espaçamento;
- botões;
- CSS Modules;
- exceções;
- enforcement por Stylelint.

Os valores executáveis permanecem no CSS como fonte de verdade.

No `CLAUDE.md`, manter apenas:

- usar tokens;
- não criar sistemas paralelos de componentes;
- componentes novos usam o padrão vigente;
- ler a documentação do design system antes de alterações visuais amplas.

Remover do `CLAUDE.md`:

- listas completas de tokens;
- valores hexadecimais;
- escalas completas;
- histórico de redesign;
- contagem de arquivos;
- commits e sessões;
- problemas visuais ainda pendentes.

## 7.10 Pipeline de imagens

Mover para:

```text
frontend/docs/image-pipeline.md
```

ou para documentação arquitetural equivalente.

No `CLAUDE.md`, manter apenas uma referência, salvo se houver um único invariante crítico transversal que realmente precise ser carregado sempre.

## 7.11 Testes e vulnerabilidades

Mover estratégia para:

```text
docs/engineering/standards/testing-strategy.md
```

Mover riscos operacionais atuais para:

```text
docs/operations/known-issues.md
```

Remover do `CLAUDE.md`:

- contagem de testes;
- quantidade atual de vulnerabilidades;
- resultados pontuais de auditoria;
- versões dos runners;
- detalhes já presentes nos scripts.

Manter apenas:

- validação proporcional ao risco;
- obrigação de provar comportamento;
- link para matriz canônica;
- proibição de afirmar sucesso sem evidência.

## 7.12 Branches, commits e pipeline

Mover detalhes para:

```text
docs/operations/deployment.md
```

No `CLAUDE.md`, manter somente:

- estratégia resumida de branch;
- Conventional Commits;
- não tratar trabalho como concluído quando a validação aplicável falhou;
- link para detalhes.

## 7.13 JSON-LD e SEO

Mover para:

```text
frontend/docs/seo.md
```

Não manter a matriz completa no `CLAUDE.md`.

No `CLAUDE.md`, no máximo:

- novas páginas precisam respeitar a estratégia canônica de SEO;
- consultar o documento antes de criar rota pública.

## 7.14 Dependências

Remover a tabela de versões do `CLAUDE.md`.

Fontes canônicas:

- `package.json`;
- lockfiles;
- Terraform;
- workflows;
- documentação de migração;
- ADRs;
- READMEs dos componentes.

Gotchas permanentes de uma dependência devem ficar próximos do componente que a utiliza.

## 7.15 Backlog e trabalho futuro

O `CLAUDE.md` pode apontar para o backlog canônico, mas não deve conter:

- lista de tarefas;
- pendências;
- lembretes;
- itens já concluídos;
- status de auditorias.

---

# 8. Estrutura-alvo do novo `CLAUDE.md`

Adapte a numeração e os títulos ao estilo do repositório, mas o arquivo final deve seguir aproximadamente esta estrutura:

```markdown
# CLAUDE.md — Mgoncalves Editorial Platform

> Constituição operacional da IA neste projeto.

## 1. Papel e autoridade

## 2. Princípios de operação

## 3. Início de sessão e leitura de contexto

## 4. Análise, perguntas e autorização para agir

## 5. Protocolo de investigação

## 6. Critérios de conclusão e validação

## 7. Restrições críticas da ferramenta

## 8. Convenções transversais

## 9. Estratégia de Git e commits

## 10. Mapa das fontes canônicas

## 11. Captura de aprendizado para o livro

## 12. Regra de manutenção do CLAUDE.md
```

## 8.1 Papel e autoridade

Deve definir de forma curta:

- Marcelo como responsável pelo produto e decisões relevantes;
- IA como Staff Engineer;
- autonomia operacional dentro das autorizações;
- responsabilidade humana final;
- proibição de inventar decisões ou motivações.

## 8.2 Princípios de operação

Manter:

- ciclos pequenos;
- verificar estado real;
- evitar trabalho não validado;
- aplicar simplicidade e abstração com julgamento;
- não fazer alterações oportunistas fora de escopo;
- produto e qualidade são prioridade.

## 8.3 Início de sessão

Definir:

1. ler `.project-context.md`;
2. ler `docs/README.md`;
3. ler somente documentos e READMEs relevantes à tarefa;
4. verificar Git e estado real;
5. não carregar todo o histórico por padrão.

## 8.4 Análise e autorização

Preservar:

- análise não autoriza edição;
- pergunta não autoriza ação;
- instrução explícita é necessária;
- ações sensíveis exigem autorização correspondente.

## 8.5 Investigação

Usar fluxo curto:

```text
Fatos observados → modelo mental → hipótese → experimento mínimo → resultado → modelo atualizado
```

Registrar investigações no mecanismo canônico vigente.

Não apontar para arquivo inexistente.

## 8.6 Critério de conclusão

Definir:

- validação proporcional ao risco;
- cumprimento das obrigações de prova;
- testes e verificações aplicáveis;
- pipeline quando houver execução aplicável;
- atualização de contexto apenas quando necessária para continuidade;
- atualização de caso quando houver estudo ativo;
- nenhuma conclusão sem evidência suficiente.

## 8.7 Restrição da ferramenta

Manter a regra crítica de Bash em formato conciso.

## 8.8 Convenções transversais

Manter somente regras que atravessam componentes:

- idioma;
- comentários;
- segurança;
- não registrar contexto de processo no código;
- consultar documentação do componente.

## 8.9 Git

Manter resumo coerente e link para deployment.

## 8.10 Mapa canônico

Incluir uma tabela curta semelhante a:

| Preciso saber... | Fonte canônica |
|---|---|
| Estado da sessão | `.project-context.md` |
| Visão do produto | `docs/product/vision.md` |
| Índice da documentação | `docs/README.md` |
| Arquitetura | `docs/architecture/` |
| Decisões | `docs/engineering/decisions/` |
| Padrões | `docs/engineering/standards/` |
| Operação e deploy | `docs/operations/` |
| Trabalho pendente | backlog canônico |
| Componente específico | README ou docs do componente |
| Casos do livro | `docs/book/` |
| Preferências de colaboração | `memory/` |

Use os caminhos reais encontrados no repositório.

## 8.11 Skill do livro

Manter integração resumida da skill:

- avaliar silenciosamente;
- abrir automaticamente caso claro;
- pedir confirmação quando ambíguo;
- não capturar tarefa rotineira;
- atualizar e encerrar caso ativo;
- invocação manual por `/engineering-book-capture`;
- detalhes ficam no protocolo e na skill.

## 8.12 Regra de manutenção

Incluir uma regra explícita:

```markdown
## Regra de manutenção do CLAUDE.md

O `CLAUDE.md` contém somente regras duráveis que alteram o comportamento da IA em várias sessões futuras.

Antes de adicionar conteúdo, verifique:

1. A informação muda como a IA deve trabalhar em várias sessões?
2. Ela é estável?
3. Ela não é derivável do código, Git, lockfiles, workflows ou configuração?
4. Ela não pertence ao contexto, backlog, ADR, experimento, operação, componente ou estudo de caso?
5. Pode ser expressa como uma regra curta com referência para a fonte detalhada?

Não registrar aqui:

- narrativa de sessão;
- estado temporário;
- URLs e contagens operacionais;
- versões;
- resultados pontuais;
- inventários deriváveis;
- planos e pendências;
- histórico de migração;
- conteúdo integral de outras fontes canônicas.
```

Adapte a redação sem enfraquecer o princípio.

---

# 9. Tamanho e qualidade esperados

O objetivo não é atingir um número arbitrário, mas reduzir drasticamente o conteúdo permanente.

Referência:

- tamanho preferencial: aproximadamente 150 a 220 linhas;
- ultrapassar esse intervalo somente se houver justificativa clara;
- não apagar informação apenas para atingir a meta;
- nenhuma seção deve reproduzir documentação detalhada de componente;
- cada regra deve possuir consequência operacional clara.

O novo arquivo deve ser compreensível em poucos minutos.

---

# 10. Migração sem perda

Para cada conteúdo removido do `CLAUDE.md`, uma destas condições deve ser verdadeira:

1. foi mantido resumidamente;
2. foi movido para uma fonte canônica;
3. já existia em outra fonte canônica;
4. é derivável do repositório;
5. era histórico preservado por Git, ADR, migração, auditoria ou caso;
6. era temporário e foi movido para contexto, backlog ou operação;
7. era duplicado;
8. era incorreto ou obsoleto, com evidência registrada.

Não use “parecia desnecessário” como justificativa suficiente.

---

# 11. Atualização do estudo de caso durante a tarefa

Atualize o caso quando ocorrer:

- classificação inesperada;
- conflito entre documentos;
- conteúdo importante sem destino;
- regra aparentemente durável que se revelou temporária;
- fato histórico tratado como instrução atual;
- duplicação capaz de gerar comportamento divergente;
- intervenção de Marcelo;
- alteração da estratégia de migração;
- evidência de que uma regra estava obsoleta;
- limitação da skill ou do protocolo.

Registre claramente:

- `Observed fact`;
- `AI inference`;
- `AI proposal`;
- `Human decision`;
- `AI implementation`;
- `Human intervention`;
- `Automated evidence`;
- `Observed evidence`;
- `Open question`;
- `Limitation`.

Não apresente a hipótese inicial como se tivesse sido comprovada desde o começo.

---

# 12. Validações obrigatórias

Depois da refatoração:

## 12.1 Integridade documental

Verifique:

- todos os links internos adicionados;
- existência de todos os arquivos referenciados;
- ausência de links para caminhos removidos;
- ausência de destinos duplicados;
- ausência de conteúdo `UNKNOWN` apagado;
- leitura correta dos arquivos Markdown.

Use ferramentas já disponíveis. Não adicione dependências apenas para validar Markdown.

## 12.2 Cobertura da migração

Confirme que cada seção original foi classificada e possui destino ou justificativa.

Apresente a tabela final:

```markdown
| Conteúdo original | Resultado | Destino |
|---|---|---|
```

## 12.3 Preservação das regras críticas

Confirme explicitamente que permaneceram:

- papéis;
- análise versus ação;
- perguntas sem ação implícita;
- investigação incremental;
- validação proporcional ao risco;
- regra de Bash;
- convenções transversais;
- Git;
- contexto e memória;
- skill do livro;
- regra de manutenção.

## 12.4 Ausência de conteúdo inadequado

Faça buscas no novo `CLAUDE.md` para detectar, salvo exceção justificada:

- `sessão`;
- hashes de commit;
- URLs de ambientes;
- números atuais de testes;
- versões exatas de dependências;
- listas completas de tokens;
- valores hexadecimais;
- vulnerabilidades atuais;
- pendências específicas;
- narrativas de migração;
- datas históricas em regras.

## 12.5 Coerência operacional

Simule por leitura os seguintes cenários:

1. início de nova sessão;
2. pedido apenas de análise;
3. pergunta sem pedido de ação;
4. correção pequena de frontend;
5. mudança estrutural relevante;
6. investigação de bug;
7. tarefa com potencial claro para o livro;
8. tarefa rotineira sem potencial editorial;
9. tarefa com caso ativo;
10. conclusão sem pipeline executada.

Para cada cenário, confirme que o novo `CLAUDE.md` produz uma instrução inequívoca.

## 12.6 Comparação objetiva

Registre no caso:

- linhas antes e depois;
- bytes antes e depois;
- seções antes e depois;
- quantidade de documentos canônicos criados ou atualizados;
- quantidade de duplicações removidas;
- conflitos resolvidos;
- informações descartadas por serem deriváveis;
- questões ainda abertas.

Não transforme redução de tamanho em prova automática de qualidade.

---

# 13. Encerramento do estudo de caso

Antes de concluir a tarefa, use a skill para atualizar e encerrar ou pausar o caso.

O caso deve registrar:

- problema;
- hipótese;
- estratégia de classificação;
- alternativas;
- conteúdo migrado;
- conflitos encontrados;
- decisões humanas confirmadas;
- participação da IA;
- evidências;
- resultado;
- limites.

## 13.1 Princípios possíveis

Avalie, sem forçar, princípios como:

- contexto de agente também possui arquitetura;
- mais contexto não significa necessariamente melhor contexto;
- regras, estado, decisões e história possuem ciclos de vida diferentes;
- uma única fonte canônica reduz contradições;
- fatos deriváveis devem permanecer em fontes executáveis;
- compressão de contexto precisa ser sem perda de intenção;
- documentação histórica não deve comandar o comportamento atual;
- dívida de contexto pode se transformar em dívida de compreensão.

## 13.2 Potencial para o livro

O caso pode contribuir para temas como:

- engenharia de contexto;
- memória de agentes;
- governança da IA;
- entropia documental;
- fontes canônicas;
- dívida de compreensão;
- evolução de um sistema assistido por IA.

## 13.3 Revisão posterior

Defina revisão aproximadamente 30 dias após a mudança para verificar:

- se a IA deixou de encontrar alguma regra necessária;
- se novas duplicações surgiram;
- se o `CLAUDE.md` voltou a crescer;
- se os links continuam válidos;
- se as fontes canônicas estão sendo usadas;
- se o processo ficou mais claro;
- se houve necessidade de restaurar alguma instrução.

Não declare sucesso definitivo antes dessa revisão.

---

# 14. Restrições

Durante esta tarefa:

- não altere código da aplicação;
- não altere comportamento funcional;
- não altere infraestrutura;
- não altere workflows;
- não atualize dependências;
- não execute deploy;
- não mova arquivos sem atualizar referências;
- não apague conhecimento não derivável;
- não invente decisões de Marcelo;
- não reescreva hipóteses retrospectivamente;
- não crie novos arquivos de memória sem necessidade;
- não transforme `.project-context.md` em changelog;
- não execute testes da aplicação, pois a mudança é documental;
- não faça commit ou push sem autorização explícita.

Caso encontre uma inconsistência que exija decisão humana material:

- registre-a como questão em aberto;
- preserve o conteúdo original correspondente;
- não tome uma decisão silenciosa.

---

# 15. Resultado final esperado

Ao concluir, apresente:

## 15.1 Resumo executivo

- problema encontrado;
- princípio usado na reorganização;
- resultado da refatoração.

## 15.2 Arquivos alterados

Para cada arquivo:

- caminho;
- finalidade;
- conteúdo recebido;
- motivo.

## 15.3 Comparação do `CLAUDE.md`

- linhas antes e depois;
- seções antes e depois;
- principais conteúdos mantidos;
- principais conteúdos movidos;
- conteúdos removidos por serem deriváveis ou obsoletos.

## 15.4 Conflitos resolvidos

Liste:

- contradição;
- evidência;
- regra consolidada;
- destino da explicação detalhada.

## 15.5 Validações

- links;
- cobertura da migração;
- regras críticas;
- cenários simulados;
- arquivos não alterados.

## 15.6 Estudo de caso

Informe:

- ID;
- caminho;
- status;
- principais gatilhos;
- revisão posterior definida.

## 15.7 Questões abertas

Liste somente questões reais que não puderam ser resolvidas com as fontes disponíveis.

Não avance para commit, push ou outras refatorações sem autorização.
