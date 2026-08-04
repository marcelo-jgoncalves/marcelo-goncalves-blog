# Protocolo de captura de aprendizado

## 1. Objetivo

Este protocolo estabelece como identificar, registrar e encerrar eventos de desenvolvimento deste projeto que tenham valor técnico, investigativo ou pedagógico relevante, de forma que possam futuramente servir como matéria-prima para um livro sobre engenharia de software assistida por IA.

O desenvolvimento do produto continua sendo a prioridade. A captura de aprendizado é uma atividade complementar, seletiva e baseada em evidências — nunca um objetivo que compete com a entrega.

## 2. Princípios

- Preservar a evolução do raciocínio, não apenas o resultado final.
- Distinguir claramente observação, hipótese, decisão e evidência.
- Não reescrever retrospectivamente hipóteses iniciais depois de conhecer o resultado.
- Registrar falhas e limitações da IA sem ocultá-las.
- Registrar intervenções humanas relevantes.
- Evitar burocracia em tarefas rotineiras.
- Preferir links para código, commits, testes e pipelines em vez de duplicar conteúdo.
- Registrar somente informações que tenham potencial de gerar aprendizado generalizável.
- Não confundir narrativa histórica com documentação canônica atual.
- Os registros históricos não representam necessariamente o estado atual do sistema.
- Os arquivos de contexto operacional (`CLAUDE.md`, `.project-context.md`, `memory/`) não devem ser transformados em diário histórico.

## 3. Escopo

Este protocolo se aplica a qualquer trabalho de desenvolvimento realizado neste repositório com participação de IA, independentemente da área (frontend, backend, infraestrutura, admin, documentação).

Não se aplica a decisões de produto puramente de negócio sem componente técnico, nem a comunicação externa ao repositório.

## 4. O que deve gerar um estudo de caso

A presença de um gatilho abaixo não obriga automaticamente a criação de um caso extenso — a IA deve avaliar se existe aprendizado não trivial e generalizável antes de propor a abertura.

Gatilhos:

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

## 5. O que não deve gerar um estudo de caso

- correção trivial de texto;
- atualização mecânica de dependência sem surpresa;
- ajuste visual simples;
- refatoração puramente cosmética;
- criação rotineira de arquivo;
- manutenção sem decisão, investigação ou aprendizado relevante;
- execução normal de tarefas já totalmente cobertas por um padrão conhecido.

## 6. Classificação das informações

Todo registro deve classificar explicitamente cada informação relevante em uma das categorias abaixo. As classificações podem aparecer como subtítulos, listas ou campos do caso, desde que a distinção permaneça inequívoca.

- `Observed fact`: fato observado diretamente.
- `AI inference`: interpretação ou hipótese produzida pela IA.
- `AI proposal`: alternativa ou solução sugerida pela IA.
- `Human decision`: decisão tomada por Marcelo.
- `AI implementation`: alteração executada pela IA.
- `Human intervention`: correção, restrição, rejeição ou redirecionamento humano.
- `Automated evidence`: teste, scanner, pipeline, métrica ou validação automática.
- `Observed evidence`: comportamento verificado diretamente em ambiente ou serviço real.
- `Open question`: questão ainda não respondida.
- `Limitation`: limite conhecido da conclusão.

## 7. Fluxo de captura

### 7.1 Antes da investigação ou implementação

Quando aplicável, registrar:

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

### 7.2 Durante o trabalho

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

### 7.3 Ao concluir o ciclo

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

### 7.4 Revisão posterior

Alguns casos poderão ser revisados após 30 ou 90 dias para verificar:

- se a decisão continuou válida;
- se houve retrabalho;
- se surgiram efeitos não previstos;
- se a conclusão precisa ser corrigida;
- se o aprendizado permanece generalizável.

## 8. Papéis e responsabilidades

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

## 9. Níveis de autonomia da IA

Cada caso deve registrar o maior nível de autonomia utilizado durante o ciclo:

- `0 — Explanation`: a IA apenas explica.
- `1 — Suggestion`: a IA sugere alternativas.
- `2 — Planning`: a IA prepara um plano.
- `3 — Scoped editing`: a IA altera arquivos específicos.
- `4 — Full implementation cycle`: a IA implementa e valida a tarefa.
- `5 — Commit or pull request preparation`: a IA prepara commit ou PR.
- `6 — Non-production deployment`: a IA executa ou prepara deploy em ambiente não produtivo.
- `7 — Approved operational action`: a IA executa ação operacional mediante aprovação explícita.
- `8 — Conditional production autonomy`: autonomia limitada, observável e reversível em produção.

## 10. Evidências mínimas

As evidências devem ser proporcionais ao risco. A tabela abaixo é uma referência mínima e pode ser ampliada conforme o risco da mudança.

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

## 11. Evidência de antes e depois

Princípio central: **o estudo de caso preserva exemplos representativos e explicados; o Git e os artefatos de evidência preservam a comparação completa e reproduzível.** O caso não é o lugar para copiar diffs inteiros ou arquivos completos — é o lugar para apontar, com precisão, o que comparar e por quê.

O sistema trabalha em três camadas.

### 11.1 Camada 1 — Exemplo representativo dentro do caso

O próprio caso inclui trechos curtos e literais de antes/depois quando houver transformação concreta. Cada exemplo registra: aspecto demonstrado, estado anterior, estado posterior, arquivo, referência histórica, descrição objetiva da mudança, motivo da seleção, e a classificação de evidência correspondente (`Observed fact`/`AI inference`/`Human decision`/`Limitation`, conforme a seção 6).

### 11.2 Camada 2 — Referência reproduzível no Git

Sempre que possível, o caso registra referência anterior, referência posterior, arquivos relevantes e o comando para reproduzir o diff (`git diff <baseline-ref>..<result-ref> -- <arquivo>`). Nunca inventar hash, tag ou commit. Quando a mudança ainda não tiver sido commitada: usar o `HEAD` anterior como `baseline_ref` quando correto, registrar o estado posterior como working tree, não inventar `result_ref`, não commitar apenas para produzir uma referência — atualizar o caso depois, quando o commit real existir.

### 11.3 Camada 3 — Pacote separado de evidências

Quando a comparação for extensa ou tiver alto valor pedagógico, criar `docs/book/cases/evidence/CASE-NNN/`, com arquivos como `before-after.md`, `migration-table.md` ou um `.patch` descritivo. Não obrigatório em todo caso; não criar diretório vazio.

Critérios para criar o diretório separado (ao menos um precisa ocorrer — por padrão, preferir exemplo curto dentro do próprio caso): comparação envolve vários arquivos; mais de dois ou três exemplos importantes; tabela de migração extensa; diff completo com valor pedagógico significativo; trechos tornariam o caso principal excessivamente longo; evidência precisa permanecer estável independentemente de alterações futuras no arquivo original; material com potencial claro de uso no livro; transformação não compreensível por um único trecho curto.

### 11.4 Quando a seção é obrigatória

A seção "Evidência de antes e depois" do template é obrigatória (`required`) quando o caso envolver transformação concreta: refatoração, correção de bug, mudança arquitetural, alteração de processo, mudança de comportamento, falha da IA seguida de correção, intervenção humana que modificou a solução, substituição de abordagem, migração, melhoria de segurança, mudança de modelo mental acompanhada de alteração verificável, ou transformação de regra documentada em controle executável.

Pode ser `not-applicable` quando o caso for puramente investigativo, conceitual, inconclusivo sem mudança implementada, baseado em decisão ainda não executada, ou uma observação sem artefato comparável — sempre com justificativa registrada, nunca por omissão silenciosa.

### 11.5 Regras para os trechos

Os exemplos devem ser extraídos de estados reais, literais (não reconstruídos de memória), curtos, com apenas o contexto necessário, informando arquivo e referência, usando `[...]` para cortes, preservando formatação relevante. Evitar duplicar arquivos inteiros ou conteúdo derivável que possa ser reproduzido pelo Git. Não copiar grandes blocos apenas para tornar o caso mais impressionante — a seleção privilegia clareza e representatividade, não volume.

### 11.6 Evitar seleção tendenciosa

A captura de antes/depois não funciona como propaganda da solução. Quando relevante, registrar também: exemplo em que o problema não ocorreu, caso que contradiga a hipótese, comportamento correto anterior à solução, regressão posterior, situação em que a mudança não produziu melhoria, e a diferença entre correlação e causalidade observada. Buscar casos contrários é parte do trabalho de captura quando eles forem necessários para testar a hipótese, não um extra opcional.

### 11.7 Uso de patches

Arquivos `.patch` são opcionais e excepcionais — só quando o diff completo tiver alto valor pedagógico, a comparação não puder depender apenas do histórico futuro, houver necessidade de congelar exatamente o estado da transformação, o patch estiver livre de segredos, o tamanho for razoável, e a existência do patch estiver justificada no caso. Não criar patch para toda tarefa; não armazenar patch gerado automaticamente sem inspeção; preferir um comando Git reproduzível quando ele for suficiente.

### 11.8 Tabelas de migração

Quando o caso envolver redistribuição de conteúdo, responsabilidades ou arquivos, considerar `migration-table.md` (dentro do pacote de evidências, quando existir) com colunas `Elemento original | Classificação | Ação | Destino | Justificativa | Evidência`, usando as classificações `KEEP`/`KEEP-SUMMARY`/`MOVE`/`DERIVED`/`TEMPORARY`/`HISTORICAL`/`CONFLICT`/`UNKNOWN`. Preservar a tabela quando ela constituir uma obrigação de prova importante; nunca remover itens `UNKNOWN` apenas para completar a migração.

### 11.9 Segurança e privacidade

Antes de preservar qualquer trecho ou patch, verificar a presença de credenciais, tokens, chaves, segredos, endpoints sensíveis, dados pessoais, dados de clientes, informações internas confidenciais, payloads privados, identificadores que não deveriam ser publicados, ou conteúdo protegido/licenciado inadequadamente. Havendo informação sensível: não copiar literalmente, usar redação explícita (`<redacted>`), preservar apenas o mínimo necessário, explicar que houve redação, não armazenar o segredo em patches, e não depender apenas do fato de o repositório ser privado.

### 11.10 Compatibilidade com casos existentes

A estrutura de evidência de antes/depois é retrocompatível — casos anteriores a esta seção podem permanecer sem os novos campos, receber a seção posteriormente em revisão manual, ou marcá-la como indisponível quando a evidência histórica não puder ser reconstruída com segurança. Não inventar snapshots retrospectivos; não forçar atualização em massa dos casos já existentes.

## 12. Regras de integridade

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
- registrar incerteza quando a evidência for incompleta;
- não classificar uma autorização como "implícita" sem antes verificar se o texto que a originou já era explícito — releia a fonte antes de escolher entre `Human decision` explícita e inferência de intenção;
- não registrar contagem, tamanho ou lista de arquivos por estimativa de memória — obter de um comando verificável (`git status`, `git diff --stat`, `wc -l` etc.) no momento do registro, não recalcular depois;
- classificar fato observado e inferência da IA no momento em que a informação é registrada pela primeira vez, não deixar essa separação para uma revisão posterior — se a distinção não estiver clara no momento, registrar como incerteza (`Open question`), não como fato.

## 13. Relação com os arquivos de contexto

- `CLAUDE.md` contém regras duráveis de trabalho.
- `.project-context.md` contém estado operacional atual e referências compactas.
- `memory/` contém contexto operacional persistente.
- `docs/backlog.md` contém trabalho planejado ou pendente.
- `docs/book/cases/` contém narrativas históricas.
- `docs/book/syntheses/` contém padrões extraídos de múltiplos casos.
- `docs/engineering/decisions/` contém decisões técnicas atualmente válidas.
- `docs/engineering/experiments/` contém experimentos técnicos.

É proibida a duplicação integral de casos nos arquivos de contexto. Quando necessário, o contexto operacional deve conter apenas:

- ID do caso;
- título curto;
- status;
- referência ao arquivo;
- impacto operacional ainda relevante.

## 14. Relação com Git, commits e pull requests

Cada caso deve, quando possível, relacionar:

- commit inicial;
- commit final;
- pull request;
- arquivos relevantes;
- testes relevantes;
- execução de pipeline;
- ADR ou experimento associado.

Recomendação opcional de trailers em commits relevantes:

```text
Book-Case: CASE-000
AI-Role: investigation, implementation, test-generation
Human-Decision: descrição curta
Evidence: unit, integration, CI
```

Esses trailers não são obrigatórios para mudanças rotineiras.

## 15. Métricas seletivas

Métricas não são coletadas em todas as tarefas. Devem ser usadas em:

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

Linhas de código não devem ser usadas como medida principal de produtividade.

## 16. Sínteses periódicas

Sínteses mensais devem:

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

## 17. Critérios de encerramento de um caso

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

Caso a investigação não tenha chegado a uma conclusão, usar um status apropriado como `inconclusive` ou `paused`, em vez de forçar um encerramento falso.

`resolved` exige que toda obrigação de prova relevante do caso esteja `satisfied` (não `pending`/`partially-satisfied`) e que nenhuma conclusão dependa de uma revisão humana, teste ou uso real ainda não realizado. Trabalho tecnicamente concluído mas com validação em aberto é `active`, não `resolved` — implementação pronta não é o mesmo que conclusão sustentada por evidência.

## 18. Critérios de qualidade do registro

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

### Estilo de escrita

Os casos devem ser:

- objetivos;
- técnicos;
- honestos;
- baseados em evidências;
- suficientemente detalhados para reconstruir o aprendizado;
- livres de autopromoção;
- livres de dramatização artificial;
- claros sobre incertezas;
- concisos o suficiente para não virar transcrição de trabalho.

Escritos em português do Brasil.
