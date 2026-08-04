---
id: PROMPT-2026-008
title: "Prompt para definir o protocolo de captura de aprendizado"
created_at: 2026-08-03
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt_definicao_protocolo_captura_aprendizado.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para definir o protocolo de captura de aprendizado

Quero agora definir o conteúdo de `docs/book/capture-protocol.md`.

O objetivo deste arquivo é estabelecer um protocolo claro, seletivo e operacional para registrar aprendizados relevantes do desenvolvimento deste projeto, de forma que possam futuramente servir como matéria-prima para um livro sobre engenharia de software assistida por IA.

Nesta etapa, faça **somente a definição do protocolo de captura**. Não crie ainda a skill, não altere o `CLAUDE.md`, não altere arquivos de contexto e não crie estudos de caso reais.

## 1. Verificação inicial

Antes de editar:

1. inspecione a estrutura existente em `docs/book/`;
2. leia:
   - `docs/book/README.md`;
   - `docs/book/capture-protocol.md`;
   - `docs/book/cases/README.md`;
   - `docs/book/cases/templates/case-template.md`;
   - `docs/book/syntheses/README.md`;
   - `docs/book/syntheses/templates/monthly-synthesis-template.md`;
   - `docs/book/metrics/README.md`;
3. confirme se os arquivos correspondem à estrutura esperada;
4. preserve todo conteúdo existente que ainda seja válido;
5. não altere nenhum outro arquivo nesta etapa.

## 2. Objetivo do protocolo

O protocolo deve permitir que a IA identifique, registre e encerre apenas eventos de desenvolvimento com valor técnico, investigativo ou pedagógico relevante.

Ele deve evitar dois extremos:

- registrar tarefas rotineiras sem valor para o livro;
- perder hipóteses, erros, decisões, intervenções humanas e mudanças de entendimento que não podem ser reconstruídos apenas pelo Git.

O arquivo deve deixar claro que:

- o desenvolvimento do produto continua sendo a prioridade;
- a captura de aprendizado é uma atividade complementar;
- os registros históricos não representam necessariamente o estado atual do sistema;
- os arquivos de contexto operacional não devem ser transformados em diário histórico;
- a captura deve ser seletiva, objetiva e baseada em evidências.

## 3. Estrutura obrigatória do arquivo

Atualize `docs/book/capture-protocol.md` usando a seguinte estrutura.

```markdown
# Protocolo de captura de aprendizado

## 1. Objetivo

## 2. Princípios

## 3. Escopo

## 4. O que deve gerar um estudo de caso

## 5. O que não deve gerar um estudo de caso

## 6. Classificação das informações

## 7. Fluxo de captura

### 7.1 Antes da investigação ou implementação

### 7.2 Durante o trabalho

### 7.3 Ao concluir o ciclo

### 7.4 Revisão posterior

## 8. Papéis e responsabilidades

## 9. Níveis de autonomia da IA

## 10. Evidências mínimas

## 11. Regras de integridade

## 12. Relação com os arquivos de contexto

## 13. Relação com Git, commits e pull requests

## 14. Métricas seletivas

## 15. Sínteses periódicas

## 16. Critérios de encerramento de um caso

## 17. Critérios de qualidade do registro
```

## 4. Conteúdo que o protocolo deve definir

### 4.1 Princípios

Inclua princípios como:

- preservar a evolução do raciocínio, não apenas o resultado final;
- distinguir claramente observação, hipótese, decisão e evidência;
- não reescrever retrospectivamente hipóteses iniciais;
- registrar falhas e limitações da IA sem ocultá-las;
- registrar intervenções humanas relevantes;
- evitar burocracia em tarefas rotineiras;
- preferir links para código, commits, testes e pipelines em vez de duplicar conteúdo;
- registrar somente informações que tenham potencial de gerar aprendizado generalizável;
- não confundir narrativa histórica com documentação canônica atual.

### 4.2 Gatilhos para criação de caso

Defina como gatilhos, entre outros:

- decisão arquitetural ou de domínio relevante;
- hipótese inicial refutada;
- recomendação da IA rejeitada ou corrigida;
- teste que passava sem provar o comportamento pretendido;
- divergência entre mock e serviço real;
- controle de segurança existente, mas ineficaz;
- bug transversal envolvendo múltiplas camadas;
- decisão consciente de não implementar;
- resultado contrário ao esperado;
- mudança significativa no modelo mental;
- problema causado por contexto incompleto, excessivo, contraditório ou obsoleto;
- intervenção humana que evitou uma alteração inadequada;
- experimento sobre produtividade, qualidade ou autonomia da IA;
- incidente ou comportamento operacional com valor generalizável;
- refatoração que revele um princípio importante sobre coesão, acoplamento ou complexidade;
- trade-off relevante entre simplicidade, custo, segurança, desempenho ou confiabilidade.

Deixe claro que a presença de um gatilho não obriga automaticamente a criação de um caso extenso. A IA deve avaliar se existe aprendizado não trivial e generalizável.

### 4.3 Situações que não justificam caso

Inclua exemplos como:

- correção trivial de texto;
- atualização mecânica de dependência sem surpresa;
- ajuste visual simples;
- refatoração puramente cosmética;
- criação rotineira de arquivo;
- manutenção sem decisão, investigação ou aprendizado relevante;
- execução normal de tarefas já totalmente cobertas por um padrão conhecido.

### 4.4 Classificação das informações

O protocolo deve exigir a classificação explícita de:

- `Observed fact`: fato observado diretamente;
- `AI inference`: interpretação ou hipótese produzida pela IA;
- `AI proposal`: alternativa ou solução sugerida pela IA;
- `Human decision`: decisão tomada por Marcelo;
- `AI implementation`: alteração executada pela IA;
- `Human intervention`: correção, restrição, rejeição ou redirecionamento humano;
- `Automated evidence`: teste, scanner, pipeline, métrica ou validação automática;
- `Observed evidence`: comportamento verificado diretamente em ambiente ou serviço real;
- `Open question`: questão ainda não respondida;
- `Limitation`: limite conhecido da conclusão.

Explique que essas classificações podem aparecer como subtítulos, listas ou campos do caso, desde que a distinção permaneça inequívoca.

### 4.5 Fluxo de captura

#### Antes da investigação ou implementação

A IA deve registrar, quando aplicável:

- contexto;
- problema observado;
- fatos conhecidos;
- modelo mental atual;
- hipótese inicial;
- alternativas consideradas;
- riscos;
- critérios de aceitação;
- obrigações de prova;
- nível de autonomia concedido à IA.

A hipótese inicial deve ser preservada mesmo se posteriormente estiver errada.

#### Durante o trabalho

Registrar somente eventos significativos:

- nova evidência;
- hipótese descartada;
- tentativa que falhou;
- sugestão rejeitada;
- comportamento inesperado;
- intervenção de Marcelo;
- mudança de escopo;
- mudança do nível de autonomia;
- revisão dos critérios de aceitação;
- descoberta de uma limitação.

Não registrar:

- cada comando executado;
- transcrição integral da conversa;
- logs extensos;
- raciocínio repetitivo;
- mudanças sem impacto no aprendizado.

#### Ao concluir o ciclo

O caso deve registrar:

- solução final;
- evidências obtidas;
- decisão humana final;
- participação da IA;
- mudança do modelo mental;
- alternativas rejeitadas;
- princípio generalizável;
- limites da conclusão;
- possíveis usos no livro;
- links para commits, pull requests, testes e arquivos;
- necessidade ou não de revisão posterior.

#### Revisão posterior

Defina que alguns casos poderão ser revisados após 30 ou 90 dias para verificar:

- se a decisão continuou válida;
- se houve retrabalho;
- se surgiram efeitos não previstos;
- se a conclusão precisa ser corrigida;
- se o aprendizado permanece generalizável.

## 5. Papéis e responsabilidades

O protocolo deve declarar que:

### Marcelo

- define objetivos e critérios relevantes;
- toma decisões de produto e arquitetura;
- aprova mudanças relevantes;
- corrige atribuições incorretas;
- confirma se uma mudança do próprio entendimento ocorreu;
- valida a interpretação pedagógica quando necessário.

### IA

- identifica possíveis gatilhos;
- propõe a abertura ou atualização de um caso;
- preserva hipóteses anteriores;
- registra evidências;
- distingue fatos de inferências;
- não inventa motivações humanas;
- não atribui decisões a Marcelo sem confirmação;
- não conclui produtividade ou qualidade sem evidência;
- atualiza o caso ao longo do ciclo;
- sinaliza lacunas e incertezas.

### Pipeline e ferramentas automatizadas

- fornecem evidências;
- não substituem decisão humana;
- não devem ser tratadas como prova suficiente quando o comportamento real exigir validação adicional.

## 6. Níveis de autonomia da IA

Defina uma escala simples e estável:

- `0 — Explanation`: a IA apenas explica;
- `1 — Suggestion`: a IA sugere alternativas;
- `2 — Planning`: a IA prepara um plano;
- `3 — Scoped editing`: a IA altera arquivos específicos;
- `4 — Full implementation cycle`: a IA implementa e valida a tarefa;
- `5 — Commit or pull request preparation`: a IA prepara commit ou PR;
- `6 — Non-production deployment`: a IA executa ou prepara deploy em ambiente não produtivo;
- `7 — Approved operational action`: a IA executa ação operacional mediante aprovação explícita;
- `8 — Conditional production autonomy`: autonomia limitada, observável e reversível em produção.

O protocolo deve exigir que cada caso registre o maior nível de autonomia utilizado.

## 7. Evidências mínimas

Defina que as evidências devem ser proporcionais ao risco.

Inclua uma tabela semelhante a:

| Tipo de mudança | Evidência mínima esperada |
|---|---|
| Documentação | revisão humana e referências verificadas |
| Refatoração local | testes existentes e confirmação de comportamento |
| Contrato de API | testes de contrato e integração |
| Persistência | teste contra serviço real, emulador fiel ou ambiente equivalente |
| Infraestrutura | validação, plano, scanner e verificação em ambiente não produtivo |
| Segurança | teste negativo, scanner e revisão humana |
| Concorrência | teste que reproduza a condição real |
| Produção | aprovação explícita, observabilidade e estratégia de rollback |

Deixe claro que a tabela é uma referência mínima e pode ser ampliada conforme o risco.

## 8. Regras de integridade

Inclua regras explícitas:

- não inventar narrativa retrospectiva;
- não apresentar inferência como fato;
- não alterar a hipótese inicial depois de conhecer o resultado;
- não atribuir à IA decisão tomada por Marcelo;
- não atribuir a Marcelo uma implementação produzida pela IA sem distinguir os papéis;
- não ocultar erro de teste, diagnóstico, implementação ou documentação;
- não afirmar melhoria de produtividade sem métrica ou evidência;
- não copiar conversas completas;
- não registrar segredos, tokens, dados pessoais ou informações sensíveis;
- não duplicar grandes trechos de código;
- não transformar casos históricos em instruções operacionais;
- não transformar o protocolo em justificativa para documentação excessiva;
- registrar incerteza quando a evidência for incompleta.

## 9. Relação com arquivos de contexto

Defina claramente que:

- `CLAUDE.md` contém regras duráveis de trabalho;
- `.project-context.md` contém estado operacional atual e referências compactas;
- `memory/` contém contexto operacional persistente;
- `docs/backlog.md` contém trabalho planejado ou pendente;
- `docs/book/cases/` contém narrativas históricas;
- `docs/book/syntheses/` contém padrões extraídos de múltiplos casos;
- `docs/engineering/decisions/` contém decisões técnicas atualmente válidas;
- `docs/engineering/experiments/` contém experimentos técnicos.

O protocolo deve proibir a duplicação integral de casos nos arquivos de contexto.

Quando necessário, o contexto operacional deve conter apenas:

- ID do caso;
- título curto;
- status;
- referência ao arquivo;
- impacto operacional ainda relevante.

## 10. Relação com Git

Defina que cada caso deve, quando possível, relacionar:

- commit inicial;
- commit final;
- pull request;
- arquivos relevantes;
- testes relevantes;
- execução de pipeline;
- ADR ou experimento associado.

Inclua uma recomendação opcional para trailers em commits relevantes:

```text
Book-Case: CASE-000
AI-Role: investigation, implementation, test-generation
Human-Decision: descrição curta
Evidence: unit, integration, CI
```

Esses trailers não devem ser obrigatórios para mudanças rotineiras.

## 11. Métricas seletivas

O protocolo deve definir que métricas não serão coletadas em todas as tarefas.

Elas devem ser usadas em:

- experimentos;
- casos de alto potencial para o livro;
- comparação de modos de trabalho;
- investigação de produtividade ou qualidade;
- análise de diferentes níveis de autonomia.

Métricas possíveis:

- duração aproximada;
- quantidade de iterações;
- hipóteses geradas;
- hipóteses rejeitadas;
- alterações descartadas;
- testes criados;
- testes inicialmente inválidos;
- falhas encontradas pela pipeline;
- intervenções humanas relevantes;
- nível de autonomia;
- retrabalho posterior;
- resultado após 30 ou 90 dias.

Deixe claro que linhas de código não devem ser usadas como medida principal de produtividade.

## 12. Sínteses periódicas

Defina que sínteses mensais devem:

- agrupar casos relacionados;
- identificar padrões recorrentes;
- identificar falhas recorrentes da IA;
- registrar intervenções humanas importantes;
- extrair princípios emergentes;
- apontar contradições;
- identificar lacunas de evidência;
- sugerir possíveis capítulos;
- propor experimentos futuros.

As sínteses não devem reescrever integralmente os casos.

## 13. Critérios de encerramento

Um caso pode ser encerrado quando:

- o problema estiver suficientemente compreendido;
- a decisão final estiver registrada;
- as evidências estiverem vinculadas;
- a participação humana e da IA estiver clara;
- a mudança do modelo mental estiver documentada;
- o princípio generalizável estiver descrito;
- os limites da conclusão estiverem explícitos;
- as questões ainda abertas estiverem registradas;
- a necessidade de revisão posterior estiver definida.

Caso a investigação não tenha chegado a uma conclusão, use um status apropriado como `inconclusive` ou `paused`, em vez de forçar um encerramento falso.

## 14. Critérios de qualidade

Um bom registro deve permitir que uma pessoa que não participou da tarefa compreenda:

1. o que aconteceu;
2. o que se acreditava inicialmente;
3. como a IA participou;
4. onde houve decisão ou intervenção humana;
5. quais alternativas foram consideradas;
6. quais evidências mudaram o entendimento;
7. por que a solução foi aceita;
8. quais limitações permanecem;
9. qual aprendizado é generalizável;
10. como o caso pode ser utilizado pedagogicamente.

## 15. Estilo de escrita

O protocolo deve determinar que os casos sejam:

- objetivos;
- técnicos;
- honestos;
- baseados em evidências;
- suficientemente detalhados para reconstruir o aprendizado;
- livres de autopromoção;
- livres de dramatização artificial;
- claros sobre incertezas;
- concisos o suficiente para não virar transcrição de trabalho.

Use português do Brasil.

## 16. Restrições desta etapa

Nesta etapa:

- altere somente `docs/book/capture-protocol.md`;
- não altere o `CLAUDE.md`;
- não altere `.project-context.md`;
- não altere arquivos de `memory/`;
- não altere o backlog;
- não crie skill;
- não crie hooks;
- não crie automações;
- não crie casos reais;
- não extraia casos retroativamente;
- não altere templates;
- não altere métricas;
- não altere código, testes, infraestrutura ou workflows;
- não faça commit sem autorização;
- não execute a suíte completa de testes.

## 17. Validação final

Ao concluir:

1. apresente um resumo das seções criadas;
2. confirme que somente `docs/book/capture-protocol.md` foi alterado;
3. informe qualquer conflito encontrado com a estrutura existente;
4. confirme que o protocolo diferencia documentação operacional de registro histórico;
5. confirme que nenhum caso real, skill ou automação foi criado;
6. não avance para a próxima etapa.
