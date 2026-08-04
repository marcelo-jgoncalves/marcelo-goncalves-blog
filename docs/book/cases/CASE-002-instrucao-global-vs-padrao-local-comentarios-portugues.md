---
id: CASE-002
title: "Instrução global versus padrão local: comentários em português após a adoção do inglês"
summary: "A regra 'novos comentários em inglês' foi formalizada em 2026-07-29 (commit eed6938), mas comentários novos em português continuaram sendo adicionados por pelo menos 6 dias, quase sempre em arquivos que já tinham comentários em português — só corrigidos por sweeps dedicados, não incrementalmente. Nenhum enforcement automatizado existia; o controle era 100% dependente de revisão humana."
date_started: 2026-08-04
date_closed:
status: active
themes: [ai-collaboration, context-engineering, governance]
components: [claude-md, code-conventions, infra, frontend, admin]
trigger_types: [ai-error, ineffective-control, context-failure, human-intervention]
related_commits: [3824ddd1, eed6938b, b41123bb, 0cbe6b57, 0cc296cc, 39549ca9, b70499e, 81f4ed8c, e4f7f293, 1d2b086f, 409e73e5, 2312e2a4, 060412fa]
related_pull_requests: []
related_files: [CLAUDE.md, docs/engineering/standards/code-conventions.md]
related_tests: []
related_pipelines: []
related_adrs: []
related_experiments: []
ai_tool: Claude Code
ai_model: claude-sonnet-5
book_potential: high
ai_autonomy_level: 4 — Full implementation cycle
review_after: 2026-09-03
last_reviewed:
baseline_ref:
result_ref:
evidence_files:
  - docs/book/cases/evidence/CASE-002/violations-timeline.md
---

<!-- Este caso é histórico. Reconstrói eventos entre 2026-07-29 e 2026-08-04 a partir do Git; não descreve o estado atual do CLAUDE.md nem das convenções vigentes (ver docs/engineering/standards/code-conventions.md para o estado atual). -->

# Resumo do caso

Entre a formalização da regra "comentários novos em inglês" (2026-07-29) e o sweep de tradução completo do repositório (2026-08-04, 6 dias depois), pelo menos 6 commits distintos adicionaram comentários novos em português a código-fonte, quase sempre em arquivos que já tinham comentários legados em português. Apenas 1 desses casos foi corrigido de forma imediata e individual (dentro da mesma sessão, por revisão humana); os outros 5 só foram corrigidos no sweep final. Nenhum mecanismo automatizado (lint, Semgrep, CI) verificava o idioma de um comentário em nenhum momento — o controle dependia inteiramente de a IA seguir a regra por conta própria ou de alguém notar a violação depois.

# 1. Contexto

O projeto adotou, no mesmo dia (2026-07-29), duas regras relacionadas: nomenclatura de código em inglês (commit `3824ddd1`, 04:18) e, 18 minutos depois, uma regra específica para comentários (commit `eed6938b`, 04:36) — "comentário novo (ou editado) deve explicar por que, nunca o que", em inglês. A própria mensagem desse segundo commit já reconhecia o problema de escala: cerca de 730 comentários existentes, quase todos em português, não seriam migrados de imediato — ficaria para uma "sessão dedicada" futura. Essa sessão dedicada só aconteceu em 2026-08-04 (`2312e2a4`), quase 6 dias depois.

# 2. Problema observado

## 2.1 Fatos observados

- `Observed fact`: `eed6938b` (2026-07-29 04:36:46) adicionou ao `CLAUDE.md` a regra "Comentário novo (ou editado) deve explicar por que o código existe daquela forma... nunca o que ele faz" — em inglês, para código novo (texto verificado via `git show eed6938 -- CLAUDE.md`).
- `Observed fact`: a mesma mensagem de commit de `eed6938b` afirma "os ~730 comentários existentes (quase 100% em português)... serão revisados numa sessão própria" — uma autodeclaração do estado anterior, não uma contagem independente feita nesta auditoria (ver Limitações).
- `Observed fact`: entre `eed6938b` (2026-07-29 04:36) e `2312e2a4` (2026-08-04 08:47), pelo menos 6 commits adicionaram comentários novos em português a arquivos de código: `b41123bb`, `0cbe6b57`, `0cc296cc`, `39549ca9`, `81f4ed8c`, `e4f7f293` (ver `docs/book/cases/evidence/CASE-002/violations-timeline.md` para os detalhes de cada um).
- `Observed fact`: em todos os 6 casos da amostra, o arquivo alterado já continha comentários em português antes da violação (infra `.tf` legado ou specs E2E vizinhos com português).
- `Observed fact`: apenas 1 dos 6 casos (`39549ca9`) foi corrigido individualmente, e rapidamente — 10 minutos depois, pelo commit `b70499e`, cuja mensagem afirma explicitamente: "the comments I added while fixing create-test-post.mjs and the E2E specs were written in Portuguese, matching the surrounding file instead of the project rule."
- `Observed fact`: os outros 5 casos só foram corrigidos no sweep final `2312e2a4` (209 arquivos), até 6 dias depois da violação original.
- `Observed fact`: não foi encontrado, em nenhum arquivo de configuração de lint/Semgrep/CI do repositório (`admin/eslint.config.ts`, buscas por `.semgrep*`, workflows `.github/`), qualquer regra que verifique idioma de comentário.
- `Observed fact`: dos 6 commits de violação, 4 têm o trailer `Co-Authored-By: Claude Sonnet 5` (`0cc296cc`, `39549ca9`, `81f4ed8c`, `e4f7f293`); 2 não têm (`b41123bb`, `0cbe6b57`), ambos de 2026-07-31.
- `Observed fact`: verificação direta dos 3 arquivos de maior violação (`lambda-iam.tf`, `api-gateway/main.tf`, `create-test-post.mjs`) no estado atual do repositório não encontrou nenhuma linha de comentário `//`/`#` com português — sem reincidência aparente até o momento desta auditoria.

## 2.2 Impacto

- `AI inference`: o intervalo de até 6 dias entre violação e correção sugere que, sem um sweep dedicado, comentários em português introduzidos incrementalmente tendem a se acumular em vez de serem pegos individualmente — mas a amostra (6 casos) é pequena demais para generalizar uma taxa.
- `AI inference`: a correção em 10 minutos do caso `39549ca9`/`b70499e` mostra que, quando a revisão humana acontece na mesma sessão em que o código foi escrito, a violação é barata de corrigir — o custo alto (6 dias, sweep de 209 arquivos) parece estar associado à ausência de revisão imediata, não à dificuldade de corrigir uma vez encontrada.

# 3. Modelo mental inicial

Antes desta auditoria, o entendimento registrado no `.project-context.md` (sessão 72) já descrevia a varredura final como um evento de larga escala ("~237 arquivos com comentário, ~700 comentários avaliados... até zerar"), mas não detalhava a linha do tempo entre a regra original e esse evento, nem quantificava violações individuais no meio do caminho. O modelo mental implícito era "a regra existia, foi violada esporadicamente, foi corrigida no fim" — sem visibilidade sobre a frequência, o padrão (arquivo já tinha português?) ou a velocidade de correção quando havia revisão humana ativa.

# 4. Hipótese inicial

> Uma regra registrada no contexto da IA funciona como orientação probabilística, mas pode perder força diante de padrões locais dominantes — como comentários legados em outro idioma — quando não existe um controle automatizado que detecte a violação.

Tratada como hipótese a ser avaliada com evidência, não como conclusão antecipada (conforme o prompt que abriu esta auditoria).

# 5. Alternativas consideradas

## 5.1 Alternativa A — usar `3824ddd1` (regra de nomenclatura) como marco, em vez de `eed6938b`

### Vantagens

`3824ddd1` é a primeira formalização da ideia geral "código em inglês", 18 minutos antes da regra específica de comentários.

### Riscos

Nenhuma violação ocorreu nesses 18 minutos, então o resultado quantitativo seria idêntico — a escolha não muda nenhum número desta análise.

### Motivo da adoção ou rejeição

`eed6938b` foi adotado como marco por ser a formalização específica sobre comentários (não apenas nomenclatura), mas ambos os marcos produzem o mesmo resultado quantitativo — registrado para transparência do método, não porque a escolha fosse controversa na prática.

## 5.2 Alternativa B — contar como violação todo comentário em português no diff, incluindo edições em comentário pré-existente

### Vantagens

Captura também o caso "editar comentário existente sem traduzi-lo", que a regra também cobre ("novo ou editado").

### Riscos

Teria exigido diferenciar, para cada linha `+` de um comentário em português, se a linha `-` correspondente já existia em português (edição cosmética de um comentário já em PT, não uma nova violação) ou se era uma reescrita substancial. Essa distinção exige inspeção manual linha a linha em uma escala que não era viável no orçamento desta auditoria.

### Motivo da adoção ou rejeição

Rejeitada nesta rodada — a auditoria se limitou a comentários genuinamente novos (linha `+` sem `-` correspondente em português já existente), o que é uma contagem mais conservadora (provavelmente subestima o total real). Registrado como limitação explícita, não como decisão definitiva de escopo.

# 6. Riscos e critérios de aceitação

## 6.1 Riscos conhecidos

- Descoberta de violações via regex sobre diff (triagem) pode ter falsos negativos — comentários curtos ou com poucas palavras-chave em português passariam despercebidos.
- Amostra pequena (6 violações confirmadas) limita qualquer inferência estatística.
- Atribuição de autoria de linha individual à IA não é possível com certeza a partir de coautoria de commit.

## 6.2 Critérios de aceitação

- Marco temporal identificado e justificado.
- Ao menos uma violação reconstruída em detalhe suficiente para mostrar mecanismo (não só ocorrência).
- Ao menos um caso de conformidade para evitar narrativa unilateral.
- Controle atual classificado por maturidade com evidência (não suposição).
- Hipótese central avaliada com evidência favorável e contrária, não assumida como comprovada.

## 6.3 Obrigações de prova

| Mudança ou afirmação | Evidência exigida | Evidência obtida | Status |
|---|---|---|---|
| Marco temporal correto e defensável | Commit com diff mostrando a redação exata da regra | `git show eed6938 -- CLAUDE.md`, texto citado na seção 2.1 | satisfied |
| Violações realmente introduzidas após o marco, não preexistentes | Data do commit + diff mostrando linha adicionada (`+`), não modificada | Confirmado para os 6 casos via `git log -p` com filtro de data e inspeção manual do diff | satisfied |
| Nenhum enforcement automatizado existia | Busca em configuração de lint/Semgrep/CI | Buscas em `eslint.config.ts`, `.semgrep*`, `.github/` sem resultado relevante | satisfied |
| Amostra é representativa de todas as violações no período | Comparação com contagem exaustiva (AST completo) | Não realizada — método foi regex de triagem + inspeção manual das ocorrências encontradas, não um parser exaustivo | not-satisfied (limitação assumida, não uma prova de completude) |
| Ausência de reincidência nos arquivos corrigidos | Grep dos arquivos no estado atual | Confirmado para os 3 arquivos de maior violação (`lambda-iam.tf`, `api-gateway/main.tf`, `create-test-post.mjs`) — sem `//`/`#` em português | partially-satisfied (verificado só numa amostra dos arquivos, não nos 209 do sweep completo) |

# 7. Participação da IA

| Classificação | Descrição | Referência |
|---|---|---|
| AI implementation | Provável autoria dos comentários em português em pelo menos 4 dos 6 commits de violação (coautoria registrada) | `docs/book/cases/evidence/CASE-002/violations-timeline.md`, tabela "Violações confirmadas" |
| AI implementation | Correção do caso `39549ca9` (tradução para inglês) em `b70499e`, com participação de IA registrada por coautoria | Commit `b70499e` |

## 7.1 Inferências da IA

Ver seção 2.2 — as duas inferências ali (acúmulo sem revisão imediata; correção barata quando há revisão na mesma sessão) são interpretações desta auditoria, não fatos medidos diretamente.

## 7.2 Propostas da IA

Nenhuma proposta de mudança de processo foi feita nesta auditoria — o escopo desta etapa é só investigação, conforme restrição explícita do prompt que a originou.

## 7.3 Implementação realizada pela IA

Nenhuma implementação de correção foi feita nesta auditoria (não é o escopo). A auditoria em si (leitura de histórico, tabelas, este caso) é a única "implementação" desta etapa.

## 7.4 Erros ou limitações da IA

- O próprio fenômeno investigado (comentário em português apesar da regra) é, por definição, um erro/limitação da IA em cada uma das 6 violações da amostra — mas a causa exata (imitação de padrão local vs. regra pouco saliente vs. outro fator) permanece parcialmente inferida, não comprovada (ver seção 15, Matriz de evidência causal).
- Não é possível, com a evidência disponível, provar autoria de uma linha específica a partir de coautoria de commit — 2 dos 6 commits de violação nem têm o trailer, então a atribuição para eles é ainda mais incerta.

# 8. Participação humana

| Classificação | Descrição | Referência |
|---|---|---|
| Human intervention | Correção de `39549ca9` em 10 minutos, com a causa nomeada explicitamente na mensagem de commit | `b70499e` |
| Human decision | Decisão de tratar a migração de comentários legados como "sessão dedicada futura" em vez de exigir tradução retroativa imediata, no momento da formalização da regra | `eed6938b` (mensagem de commit) |
| Human decision | Decisão de rodar o sweep completo em 2026-08-04 (~19 agentes em paralelo, 2 passes de verificação) | `.project-context.md`, sessão 72 |
| Human decision | Autorização desta auditoria e da abertura deste caso | Prompt de auditoria fornecido por Marcelo nesta sessão |

## 8.1 Decisões de Marcelo

A decisão de não exigir tradução retroativa imediata dos ~730 comentários legados (registrada na própria mensagem de `eed6938b`) é relevante para a interpretação dos resultados: o projeto já tolerava explicitamente a coexistência de português legado com a regra de inglês para código novo — o que preserva um ambiente onde "imitar o vizinho em português" era uma opção sempre presente, não um erro óbvio de contexto ausente.

## 8.2 Intervenções humanas

A correção de `39549ca9` por `b70499e`, 10 minutos depois, é a única intervenção humana corretiva individual encontrada nesta amostra. A mensagem de commit é incomum por nomear a causa em primeira pessoa ("the comments I added... were written in Portuguese, matching the surrounding file instead of the project rule") — uma autoanálise registrada no momento, não reconstruída depois.

## 8.3 Restrições ou redirecionamentos

Nenhuma restrição ou redirecionamento além do já registrado foi encontrada para os outros 5 casos da amostra — eles simplesmente não foram individualmente revisados até o sweep final.

# 9. Investigação e evolução

## 9.1 Evidências coletadas

| Tipo | Referência | O que demonstra | Limitação |
|---|---|---|---|
| Commit | `eed6938b` | Redação exata da regra e reconhecimento explícito do volume de legado em português | Não prova que a regra foi de fato carregada em cada sessão posterior (ver Limitações) |
| Commit | `b70499e` | Autocorreção rápida com causa nomeada pelo autor | Um único caso; não generaliza |
| `git log -p` (janela de 6 dias) | `docs/book/cases/evidence/CASE-002/violations-timeline.md` | 6 violações candidatas, todas em arquivo com PT legado | Método de regex de triagem, não AST exaustivo — pode ter perdido casos |
| Commit | `2312e2a4` | Escopo do sweep final (209 arquivos) | Não decompõe quanto desse total é legado pré-regra vs. violação pós-regra |
| Configuração | `eslint.config.ts`, busca por `.semgrep*`/workflows | Ausência de enforcement automatizado de idioma | Não cobre ferramentas externas ao repositório (ex.: revisão manual fora de registro) |
| Grep no estado atual | 3 arquivos de maior violação | Ausência de reincidência nesses 3 arquivos | Não verificado nos 209 arquivos completos do sweep |

## 9.2 Tentativas realizadas

Busca por termos (`git log --grep`), busca por conteúdo em diff (`git log -p` com filtro de data + regex), reconstrução individual de 6 commits de violação e 3 commits de correção via `git show`, verificação de enforcement em configuração de lint/CI, verificação de reincidência via grep no estado atual.

## 9.3 Tentativas que falharam

Nenhuma tentativa metodológica precisou ser abandonada — a regex de triagem funcionou o suficiente para encontrar uma amostra útil, com falsos positivos identificáveis por inspeção manual (ver seção 9.4).

## 9.4 Hipóteses descartadas

Três ocorrências candidatas foram descartadas após inspeção manual, por serem falsos positivos do regex de triagem:
- `frontend/components/ui/PillarCard.tsx` (commit `7c7d9d05`): comentário em inglês citando nomes próprios em português entre parênteses ("Automação, IA, Sistemas") — `language-neutral`, não violação.
- `frontend/e2e/projeto.spec.ts` (commit `9c03689a`): capturado pelo regex dentro do próprio commit de correção (o texto já estava em inglês; o regex reagiu a uma palavra acentuada isolada) — não violação.
- `backend/src/common/categorias.ts` (commit `f382866b`): comentário técnico em inglês citando um termo de domínio em português — `language-neutral`, não violação.

## 9.5 Mudanças de escopo ou estratégia

Nenhuma mudança de escopo — a auditoria seguiu o plano do prompt original, com a exceção registrada na Alternativa B (seção 5.2): decisão consciente de não tentar diferenciar edição-de-comentário-existente de comentário-genuinamente-novo por limitação de orçamento de investigação.

# 10. Solução final

Não aplicável — esta é uma auditoria, não uma implementação de correção. O "resultado" é o conjunto de evidências e a avaliação da hipótese causal (seção 15).

# 11. Evidência de antes e depois

## Aplicabilidade

- Status: `not-applicable`
- Justificativa: este caso é puramente investigativo — não há uma transformação implementada por esta tarefa para documentar como antes/depois. As comparações antes/depois relevantes são de commits históricos de terceiros (Marcelo/sessões anteriores), já documentadas como Camada 1 (exemplos no corpo deste caso, seção 2.1) e Camada 3 (`docs/book/cases/evidence/CASE-002/violations-timeline.md`) — não como a transformação própria deste caso.

# 12. Evidências de validação

## 12.1 Evidências automatizadas

- `git show eed6938 -- CLAUDE.md`: confirma a redação exata da regra e sua data.
- `git log -1 --format="%H %ci %s"` para os 13 commits relacionados: confirma datas e ordem cronológica.
- `git log -p` filtrado por data + regex de triagem: base para a tabela de violações.
- `grep` de enforcement em configuração de lint/CI: nenhum resultado relevante.
- `grep` de reincidência nos 3 arquivos de maior violação: nenhum resultado.

## 12.2 Evidências observadas

Leitura manual de cada diff candidato a violação (`git show <commit>`) para confirmar que a linha era genuinamente nova (não uma edição cosmética de comentário PT preexistente) e para classificar corretamente os 3 falsos positivos descartados.

## 12.3 Evidências ausentes ou insuficientes

- Não foi feita uma contagem exaustiva via AST/parser de todos os comentários do repositório no período — o método foi regex de triagem mais inspeção manual das ocorrências encontradas, o que pode ter deixado casos de fora (falsos negativos não detectáveis com este método).
- Não foi verificada reincidência nos 209 arquivos completos do sweep `2312e2a4`, só numa amostra de 3.
- Não há como confirmar, para os 2 commits sem trailer `Co-Authored-By` (`b41123bb`, `0cbe6b57`), se a IA participou ou não — ausência de trailer não é evidência de ausência de participação (nem presença é prova de autoria de uma linha específica).
- Não é possível reconstruir se a regra estava de fato "carregada" na sessão de cada uma das 6 violações — só que ela existia no `CLAUDE.md` commitado naquele momento.

# 13. Mudança do modelo mental

## 13.1 Antes

"A regra existia, foi violada esporadicamente, foi corrigida no fim" — sem detalhe sobre frequência, padrão ou velocidade de correção.

## 13.2 Depois

A violação não foi esporádica no sentido de rara: pelo menos 6 casos identificáveis em 6 dias, com um padrão claro (100% da amostra em arquivos com português legado próximo) e uma diferença marcante de velocidade de correção entre revisão imediata (10 minutos) e ausência de revisão (até 6 dias, resolvido só em sweep).

## 13.3 O que provocou a mudança

A reconstrução commit-a-commit (não apenas a leitura do resultado final do sweep) revelou a existência do caso `39549ca9`/`b70499e` — um exemplo isolado de autocorreção rápida que não aparecia em nenhum resumo anterior do projeto, e que muda a interpretação de "por que a correção em massa foi necessária": não porque toda violação é invisível até o sweep, mas porque só há correção rápida quando há revisão humana ativa na mesma sessão.

# 14. Princípio generalizável

Uma regra declarada no contexto de um agente de IA (`CLAUDE.md` ou equivalente) funciona como uma orientação probabilística, não como um controle executável — ela compete, na prática, com o padrão textual imediatamente visível no arquivo sendo editado. Nesta amostra, toda violação ocorreu em um arquivo com contexto local em português; a única variável que separou correção rápida de correção tardia (até 6 dias) não foi a regra em si, mas a presença ou ausência de revisão humana na mesma sessão em que o código foi escrito. Isso sustenta, com evidência real (não hipotética), a diferença entre política documentada e controle verificável: sem enforcement automatizado, uma regra de estilo depende inteiramente de quando (e se) um humano olha o diff.

# 15. Limites da conclusão

- A amostra (6 violações, 1 correção individual) é pequena — suficiente para ilustrar o mecanismo com evidência real, insuficiente para uma afirmação estatística sobre taxa de violação ou tempo médio de correção.
- A causa da violação (imitação de padrão local) é uma inferência bem sustentada pela correlação de 100% (6 de 6) com arquivos de PT legado, mas correlação não é prova de causalidade — não há como observar diretamente o "raciocínio" da IA no momento da geração de cada comentário.
- A auditoria cobre um único projeto e um único período de 6 dias — não generaliza para outros projetos, outras regras de estilo, ou outros modelos.
- Ausência de reincidência foi verificada só numa amostra de 3 arquivos, não nos 209 do sweep completo.

## Matriz de evidência causal

| Hipótese | Evidência favorável | Evidência contrária | Confiança | O que ainda falta |
|---|---|---|---|---|
| Imitação do padrão local | 100% (6/6) das violações da amostra ocorreram em arquivo com PT legado próximo; `b70499e` nomeia isso explicitamente como causa | Nenhuma violação foi encontrada em arquivo genuinamente novo, então não há grupo de controle direto para comparar taxas | média-alta | Um caso de violação em arquivo sem PT legado (se existir) mudaria a leitura |
| Regra global pouco saliente / ausência de enforcement | Confirmado: nenhum lint/Semgrep/CI verifica idioma; controle é `documented-only` (ver seção 16) | A regra estava de fato no `CLAUDE.md`, arquivo carregado em toda sessão — não é "regra perdida", é "regra sem consequência automática" | alta | Nenhuma — bem sustentada pela ausência confirmada de tooling |
| Ausência de revisão imediata como fator determinante do tempo de correção | Diferença observada de 10 minutos (com revisão) vs. até 6 dias (sem revisão) na mesma amostra | Amostra de 1 caso com revisão imediata — não permite generalizar a "toda vez que há revisão, a correção é rápida" | média | Mais casos de violação corrigida individualmente para comparar tempos |
| Contexto da conversa/sessão em português influenciando o idioma do comentário | Plausível — sessões de trabalho neste projeto são majoritariamente em português (como esta própria auditoria) | Não verificado diretamente — exigiria acesso ao prompt/conversa de cada sessão de violação, não disponível a partir do Git sozinho | baixa (não testável com os dados disponíveis) | Registros de sessão/conversa das 6 violações, que não existem retroativamente |
| Erro ocasional sem padrão identificável | — | Contradita pela consistência de 100% em arquivo com PT legado — um erro verdadeiramente ocasional não teria essa correlação tão forte na amostra | baixa | — |

# 16. Questões em aberto

- A causa raiz exata (imitação de padrão local vs. combinação de fatores) permanece uma inferência bem sustentada, não uma prova — ver Matriz de evidência causal.
- Não se sabe se o padrão de "correção rápida com revisão, correção lenta sem revisão" se mantém numa amostra maior — só 1 caso de correção individual foi encontrado.
- Não se sabe se há reincidência nos 203 arquivos do sweep que não foram reverificados individualmente nesta auditoria.
- Não foi possível determinar, para os 2 commits sem trailer de coautoria, se houve participação de IA.

# 17. Avaliação do controle atual

Classificação de maturidade: **`documented-only`**.

Justificativa, item a item (seção "Auditoria do controle atual" do prompt original):
- A política era clara? Parcialmente — "novo ou editado, em inglês" é razoavelmente claro, mas não define explicitamente o que conta como "editado o suficiente para exigir tradução" (ver Alternativa B, seção 5.2, que tropeçou nessa mesma ambiguidade ao tentar auditar).
- Estava na fonte correta? Sim — `CLAUDE.md`, carregado em toda sessão.
- Era carregada no momento adequado? Presumivelmente sim (estava commitada antes de cada violação), mas não há como confirmar que o modelo "leu e aplicou" em cada sessão específica.
- Existiam exceções explícitas? Sim — comentários legados eram uma exceção tolerada deliberadamente, o que por natureza cria a condição de "padrão local competindo com regra global" observada.
- Havia conflitos? Não identificado nenhum conflito de regra — o conflito era entre a regra e o texto vizinho no arquivo, não entre duas regras.
- Era verificável? Não — nenhuma ferramenta checava isso (confirmado, seção 2.1).
- Sua violação produzia alguma consequência? Não automaticamente — só se um humano notasse no diff.
- Dependia apenas de revisão humana? Sim, inteiramente — confirmado pela ausência de qualquer tooling e pela distribuição observada (correção rápida só quando havia revisão ativa).
- Houve reincidência após correção? Não encontrada na amostra verificada (3 arquivos), mas não checada de forma exaustiva.

# 18. Alternativas futuras (avaliação, sem implementação)

| Alternativa | Cobertura | Falsos positivos | Custo | Manutenção | Capacidade de bloquear |
|---|---|---|---|---|---|
| Regra contextual mais explícita no `CLAUDE.md` (definir "novo" com mais precisão, instrução explícita para não imitar comentário legado vizinho) | Baixa-média — ainda depende de a IA aplicar corretamente | N/A (não é detecção automática) | Muito baixo | Muito baixo | Não bloqueia, só reduz ambiguidade |
| Migração de legado (gradual, ao tocar o arquivo) | Alta a longo prazo, mas lenta | N/A | Médio (tempo espalhado) | Baixo | Não bloqueia; reduz a superfície de "padrão local em PT" com o tempo |
| Checklist de PR / revisão específica de comentários novos | Média-alta, mas 100% dependente de disciplina humana | Nenhum (é revisão manual) | Baixo por PR, alto agregado (tempo humano) | Médio | Bloqueia só se o revisor de fato aplicar o checklist |
| Script baseado em diff (detecta linha `+` de comentário com heurística de idioma) | Média — detecção de idioma automática é imperfeita em comentários curtos/técnicos, como o próprio prompt desta auditoria adverte | Provavelmente relevante em comentários curtos, termos técnicos ou nomes de domínio em português (ex.: os 3 falsos positivos desta auditoria mostram o tipo de erro esperado) | Baixo a médio (ferramenta simples) | Médio (heurística pode precisar ajuste) | Pode bloquear como gate, mas o risco de falso positivo bloqueante é real — mais seguro como warning primeiro |
| Semgrep com regra dedicada | Potencialmente alta para casos estruturados | Média (mesma limitação de detecção de idioma) | Médio (já há infraestrutura Semgrep no projeto, mas precisa de regra nova) | Médio | Pode bloquear, mesma ressalva de falsos positivos |

Nenhuma recomendação de bloqueio automático é feita sem avaliação de falsos positivos, conforme restrição do prompt original — os 3 falsos positivos encontrados nesta própria auditoria (seção 9.4) são evidência direta de que detecção automática de idioma erra em casos reais deste projeto.

# 19. Potencial para o livro

## 19.1 Tema ou capítulo possível

Instrução não é controle: por que uma regra registrada no contexto de um agente de IA não se comporta como um gate, e o que isso implica para quem projeta convenções para colaboração humano-IA.

## 19.2 Pergunta pedagógica central

Por que uma IA continua violando uma regra que está claramente registrada em seu contexto — e o que essa pergunta revela sobre a diferença entre "declarar uma política" e "ter um controle verificável"?

## 19.3 Elementos necessários

A regra original (`eed6938b`) com sua concessão explícita ao legado; o par violação/correção em 10 minutos (`39549ca9`/`b70499e`) como exemplo vívido e citável (a mensagem de commit já é quase uma legenda pronta); a Matriz de evidência causal (seção 15); a classificação `documented-only` do controle (seção 17); os 3 falsos positivos (seção 9.4) como contraponto contra soluções automáticas ingênuas.

## 19.4 Exercício possível para o leitor

Dado o texto exato da regra em `eed6938b` e um trecho de diff real de `39549ca9`, pedir ao leitor para prever se haveria violação, e depois comparar com o resultado real e a explicação do próprio autor em `b70499e`.

## Contraste didático

```text
Regra declarada (eed6938b)
      ↓
Comportamento inconsistente (6 violações em 6 dias, 100% em arquivo com PT legado)
      ↓
Auditoria histórica (este caso)
      ↓
Hipótese sustentada por correlação, não prova causal direta
      ↓
Controle atual: documented-only, zero enforcement automatizado
      ↓
Alternativas futuras avaliadas, nenhuma implementada ainda
```

# 20. Referências

- Regra: `eed6938b` (formalização), `3824ddd1` (nomenclatura, mesmo dia).
- Violações: `b41123bb`, `0cbe6b57`, `0cc296cc`, `39549ca9`, `81f4ed8c`, `e4f7f293`.
- Correções: `b70499e` (individual), `1d2b086f` (parcial, infra), `409e73e5` (parcial, workflows), `2312e2a4` (sweep completo), `060412fa` (complementar, travessão em descrições Terraform).
- `docs/book/cases/evidence/CASE-002/violations-timeline.md`: linha do tempo completa, tabela de violações, tabela de conformidade, distribuição.
- `.project-context.md`, changelog da sessão 72 (2026-08-04): contexto do sweep final, incluindo o achado de que agentes em paralelo relataram falsamente conclusão sem editar nada — achado de processo relacionado, não desta auditoria.

# 21. Revisão posterior

| Campo | Registro |
|---|---|
| Data da revisão | 2026-09-03 (mesma data do CASE-001, para revisão conjunta) |
| Decisão ainda válida | Pendente |
| Retrabalho observado | Pendente — verificar se novas violações do mesmo padrão surgiram |
| Efeitos não previstos | Pendente |
| Nova evidência | Pendente |
| Correções necessárias | Pendente |
| Princípio ainda generalizável | Pendente |
| Novo status | Pendente |
