---
id: CASE-001
title: "Refatoração do CLAUDE.md: separando regras, estado e memória histórica"
summary: "CLAUDE.md acumulou 478 linhas misturando regra durável, estado operacional, inventário derivável e histórico de sessão; refatoração extrai o conteúdo não-regra para fontes canônicas em docs/ e reduz o CLAUDE.md a uma constituição operacional curta."
date_started: 2026-08-04
date_closed:
status: active
themes: [context-engineering, ai-collaboration, documentation-architecture]
components: [docs, claude-md]
trigger_types: [refactoring-insight, engineering-tradeoff, mental-model-change]
related_commits: []
related_pull_requests: []
related_files: [CLAUDE.md, docs/README.md, docs/product/vision.md, docs/architecture/system-overview.md, docs/engineering/standards/engineering-principles.md, docs/engineering/standards/code-conventions.md, docs/engineering/standards/testing-strategy.md, docs/engineering/standards/ai-assisted-workflow.md, docs/engineering/standards/git-and-review-workflow.md, docs/operations/environments.md, docs/operations/deployment.md, docs/operations/known-issues.md, frontend/docs/design-system.md, frontend/docs/image-pipeline.md, frontend/docs/seo.md]
related_tests: []
related_pipelines: []
related_adrs: []
related_experiments: []
ai_tool: Claude Code
ai_model: claude-sonnet-5
ai_autonomy_level: 4 — Full implementation cycle
book_potential: high
review_after: 2026-09-03
last_reviewed:
baseline_ref: 060412fa439ca0a1cffdf6360b5b21296bc76a8e
result_ref:
evidence_files:
  - docs/book/cases/evidence/CASE-001/migration-table.md
---

<!-- Este caso é histórico. Documenta o raciocínio no momento da refatoração, não o estado atual do CLAUDE.md — consulte o arquivo em si para o estado vigente. -->

# Resumo do caso

Uma sequência de 7 prompts preparados por Marcelo definiu um processo de reestruturação documental do repositório (fontes canônicas, protocolo de captura de aprendizado, template de caso, skill `engineering-book-capture`, integração ao `CLAUDE.md`). Este caso cobre a última etapa: auditar o `CLAUDE.md` atual (478 linhas, 12 seções, acumulado desde a sessão 42), classificar cada bloco, migrar o que não é regra durável para fontes canônicas em `docs/`, e reduzir o `CLAUDE.md` a uma constituição operacional.

# 1. Contexto

O `CLAUDE.md` deste projeto cresceu organicamente ao longo de mais de 70 sessões de trabalho assistido por IA, acumulando regras de comportamento, URLs de ambiente, inventário de arquitetura, valores completos de design tokens, backlog e convenções de nomenclatura no mesmo arquivo. As 6 etapas anteriores deste processo (protocolo de captura, template de caso, skill, integração da skill) já foram executadas e validadas nesta mesma sessão. `docs/backlog.md` já havia sido extraído do `CLAUDE.md` numa sessão anterior (2026-08-02, item P2.5 de uma auditoria de qualidade), então parte do trabalho de separação já tinha precedente real no projeto.

# 2. Problema observado

## 2.1 Fatos observados

- `Observed fact`: `CLAUDE.md` tem 478 linhas / 40.396 bytes antes desta refatoração (`wc -l -c CLAUDE.md`).
- `Observed fact`: 46 headings `##`/`###` combinados (`grep -c '^##'`/`'^###'`).
- `Observed fact`: seção 5 (Design System) contém valores hexadecimais completos, escalas numéricas completas de tipografia/espaçamento e histórico de redesign com datas de sessão — exemplo de conteúdo `DERIVED`/`HISTORICAL` misturado com regra durável (`--nunca usar Space Grotesk--`).
- `Observed fact`: seção 11 (Dependências Críticas) é uma tabela de versões exatas (`^16.2.4`, `nodejs24.x` etc.) com racional de migração incluindo datas — exemplo de conteúdo `DERIVED` (versões vivem em `package.json`/lockfiles/Terraform) misturado com histórico.
- `Observed fact`: seção 1 (Contexto do Projeto) contém URLs de CloudFront/API Gateway do ambiente `dev` — mudam quando o ambiente for recriado, não são regra durável.
- `Observed fact`: `docs/backlog.md` já existe como fonte canônica separada desde 2026-08-02, precedente direto para este trabalho.
- `Observed fact`: não existiam ainda `docs/README.md`, `docs/product/`, `docs/architecture/system-overview.md` (só imagens em `docs/architecture/`), `docs/engineering/standards/`, `docs/operations/`, `frontend/docs/design-system.md` antes desta tarefa.

## 2.2 Impacto

- `AI inference`: conteúdo operacional e histórico carregado em toda sessão pode competir com regras duráveis pela atenção contextual do modelo. Esta é uma interpretação plausível, não uma medição — não há evidência direta (ex.: caso registrado em que a IA de fato ignorou ou aplicou mal uma regra por causa desse volume) até o momento de abertura deste caso.
- `AI inference`: existe risco de obsolescência silenciosa — quando um valor citado no `CLAUDE.md` (URL, versão, contagem de teste) muda no código real sem que o `CLAUDE.md` seja atualizado junto, a IA passaria a operar com uma premissa desatualizada até que isso fosse notado. Também uma inferência de risco, não um incidente observado neste repositório até aqui (ver seção 7 sobre o gatilho `context-failure`, removido por falta de evidência concreta desse tipo).

# 3. Modelo mental inicial

Na prática, o `CLAUDE.md` concentrava regras, estado, arquitetura e histórico, funcionando como o principal repositório de contexto operacional do projeto (`Observed fact`, sustentado pela auditoria de conteúdo da seção 2.1). Esse padrão já vinha sendo corrigido incrementalmente antes desta tarefa — `docs/backlog.md` foi extraído do `CLAUDE.md` em 2026-08-02 — mas sem uma arquitetura de informação explícita guiando onde cada tipo de conteúdo deveria viver daí em diante. Não há evidência registrada de que Marcelo tratasse isso conscientemente como uma escolha deliberada de arquitetura antes da proposta que motivou este processo (`proposta_arquitetura_informacao_repositorio.md`) — essa inferência sobre a intenção original não é afirmada aqui.

# 4. Hipótese inicial

Separar regras duráveis, estado operacional, documentação canônica e histórico reduzirá entropia de contexto e risco de obsolescência sem diminuir a capacidade da IA de trabalhar corretamente. (Hipótese a ser avaliada na revisão de 2026-09-03, não uma conclusão antecipada.)

# 5. Alternativas consideradas

Nota de integridade: apenas as alternativas efetivamente pesadas durante a execução estão registradas abaixo. Alternativas estruturais mais amplas (ex.: migração gradual seção por seção ao longo de várias sessões, ou redução agressiva sem criar fontes canônicas novas) **não foram avaliadas de forma independente** nesta tarefa — o processo de 7 prompts definido por Marcelo já fixava esses parâmetros antes da execução (tarefa única controlada, com fontes canônicas obrigatórias por seção do prompt de refatoração, §6). Registrar essas alternativas com análise de vantagem/risco própria seria reconstruir uma decisão que na prática já tinha sido tomada na concepção do processo, não durante esta etapa — por isso não constam aqui como alternativas "consideradas e rejeitadas".

## 5.1 Alternativa A — manter tudo em CLAUDE.md, só reorganizar seções

### Vantagens

Menor esforço imediato; nenhum arquivo novo para manter sincronizado.

### Riscos

Não resolve o problema real (mistura de naturezas de informação); o arquivo continuaria crescendo a cada sessão.

### Motivo da adoção ou rejeição

Rejeitada — o prompt mestre e a proposta de arquitetura (`proposta_arquitetura_informacao_repositorio.md`) definem explicitamente que cada tipo de informação precisa de fonte canônica própria, com o `CLAUDE.md` apontando para ela em vez de conter o detalhe.

## 5.2 Alternativa E — distribuir gotchas técnicos entre os READMEs dos componentes

### Vantagens

Mais aderente ao princípio "documentação próxima ao código" da proposta de arquitetura; cada README concentraria só o que é relevante àquele componente.

### Riscos

Vários gotchas (ex.: `API_URL` vs. `VITE_*`, convenções de CORS/Lambda URL) envolvem mais de um componente ao mesmo tempo — distribuí-los criaria duplicação ou obrigaria escolher arbitrariamente um "dono". Exigiria editar 4 arquivos de componente (`frontend/README.md`, `backend/README.md`, `admin/README.md`, e criar `infra/README.md`, inexistente) dentro de uma tarefa cujo escopo autorizado era a refatoração do `CLAUDE.md`, não uma reorganização ampla do repositório (restrição explícita do prompt, §6.3: "não mova todos os documentos... esta tarefa deve priorizar a refatoração segura do CLAUDE.md, não uma reorganização completa").

### Motivo da adoção ou rejeição

Rejeitada nesta etapa por desproporção de escopo, não por ser tecnicamente inferior — ver Alternativa F.

## 5.3 Alternativa F — consolidar gotchas transversais em `docs/architecture/system-overview.md`

### Vantagens

Um único documento novo em vez de quatro; gotchas que atravessam componente ficam num lugar sem exigir "escolher um dono"; dentro do escopo já permitido pelo prompt (arquitetura é um dos destinos recomendados, §6.2).

### Riscos

Um desenvolvedor trabalhando só no `frontend/`, por exemplo, precisa saber que parte dos gotchas relevantes está em `docs/architecture/`, não só no README do próprio componente — custo de descoberta ligeiramente maior do que se estivesse tudo no README local.

### Motivo da adoção ou rejeição

Adotada — trade-off de escopo (ver Alternativa E) foi decisivo dentro dos limites desta tarefa. Fica como candidato explícito de revisão futura: se o mapa de leitura por componente (`docs/README.md`) não for suficiente para levar alguém até `system-overview.md` na prática, distribuir os gotchas nos READMEs pode ser revisitado como refinamento, não como reversão.

# 6. Riscos e critérios de aceitação

## 6.1 Riscos conhecidos

- Perder regra crítica durante a migração (mitigado pela regra de segurança do prompt: nada `UNKNOWN` é removido).
- Quebrar link interno para arquivo inexistente.
- Reduzir linhas como objetivo em si, sacrificando clareza.

## 6.2 Critérios de aceitação

- Toda seção original classificada com destino ou justificativa.
- Nenhum conteúdo não-derivável apagado sem novo destino.
- `CLAUDE.md` final entre ~150–220 linhas, com justificativa se ultrapassar.
- Nenhuma regra crítica das seções 12.3 do prompt ausente no resultado final.

## 6.3 Obrigações de prova

| Mudança ou afirmação | Evidência exigida | Evidência obtida | Status |
|---|---|---|---|
| Nenhum link interno quebrado no novo CLAUDE.md | `grep` dos caminhos citados vs. existência real no repositório | `grep -oE` extraiu 15 caminhos entre crases; todos existem exceto `memory/feedback_bash_commands.md`, que não é um caminho do repositório (memória vive fora dele, no sistema de memória automática) e já era referenciado da mesma forma antes desta refatoração — não é uma quebra nova. Checagem automatizável e repetível, não depende de julgamento humano. | satisfied |
| Nenhum conteúdo `UNKNOWN` removido | Tabela de migração completa (Apêndice A), revisão manual | Tabela reconstruída no Apêndice A a partir da memória direta do trabalho executado (a IA não manteve a tabela viva durante a execução original, foi reconstruída nesta revisão) — nenhuma linha classificada como `UNKNOWN`. Como a tabela foi montada retrospectivamente pela mesma IA que fez a migração, e não conferida seção a seção por Marcelo contra o `CLAUDE.md` original, a garantia de que nada foi silenciosamente perdido depende ainda de uma revisão humana independente. | partially-satisfied |
| Regras críticas preservadas | Checklist item a item contra a lista do prompt (§12.3) | Checklist de 11 categorias (papéis, análise vs. ação, perguntas sem ação implícita, investigação incremental, validação por risco, regra de Bash, convenções transversais, Git, contexto/memória, skill do livro, regra de manutenção) conferido por leitura do `CLAUDE.md` novo — todas presentes. Autoavaliação da mesma IA que fez a mudança; não substitui a revisão manual do diff por Marcelo, que é a evidência de maior peso ainda pendente. | partially-satisfied |

Nota: nenhuma das obrigações acima foi marcada `satisfied` de forma que dispense a revisão de Marcelo — mesmo o item "satisfied" (links) é uma checagem mecânica e não cobre julgamento de conteúdo (se a *classificação* de cada seção foi correta), que é o que as outras duas linhas ainda aguardam.

# 7. Participação da IA

| Classificação | Descrição | Referência |
|---|---|---|
| AI implementation | Auditoria, classificação, criação dos documentos canônicos e reescrita do CLAUDE.md | Este caso |

## 7.1 Inferências da IA

A IA inferiu, a partir do padrão já estabelecido em `docs/backlog.md` (extração anterior bem-sucedida), que a mesma estratégia de "resumo + link" é aplicável às demais seções do `CLAUDE.md`.

## 7.2 Propostas da IA

Estrutura de 12 seções sugerida pelo próprio prompt de refatoração foi adotada como proposta de organização do novo `CLAUDE.md`, adaptada aos títulos já em uso no projeto (numeração em português, mantendo consistência com o restante do arquivo).

## 7.3 Implementação realizada pela IA

Ver seção 10 (Solução final) e a tabela de migração em `docs/book/cases/evidence/CASE-001/migration-table.md` (referenciada na seção 11) para o detalhamento completo.

## 7.4 Erros ou limitações da IA

A ser preenchido ao longo do trabalho, se ocorrerem.

# 8. Participação humana

A participação humana não se limitou à autorização final da Etapa 7 — o desenho do processo inteiro é decisão de Marcelo, anterior à execução técnica da IA.

| Classificação | Descrição | Referência |
|---|---|---|
| Human decision | Identificação do problema (CLAUDE.md misturando naturezas de informação) e definição do objetivo de usar o próprio processo como material para o livro | `prompt_mestre_ordem_reestruturacao_processo_trabalho.md` (objetivo declarado na abertura) |
| Human decision | Aprovação prévia da arquitetura documental proposta (fontes canônicas, papel de cada arquivo) | `proposta_arquitetura_informacao_repositorio.md` |
| Human decision | Decisão de executar a mudança em 7 etapas controladas, cada uma exigindo autorização explícita antes de avançar ("prossiga") | `prompt_mestre_ordem_reestruturacao_processo_trabalho.md`, seção "Não execute todas as etapas de uma vez" |
| Human decision | Definição dos limites de escopo de cada etapa (arquivos que podem/não podem ser alterados) | Seção de restrições de cada um dos 7 prompts |
| Human decision | Decisão de criar o protocolo, o template e a skill antes da refatoração do CLAUDE.md | Ordem das Etapas 2-5 do prompt mestre |
| Human decision | Autorização explícita da execução da refatoração do CLAUDE.md em si | `prompt_refatoracao_claude_md_e_captura_para_livro.md`, linha 96 |
| AI implementation | Auditoria, classificação seção a seção, criação dos 14 documentos canônicos e reescrita do `CLAUDE.md` | Este caso, seções 9-10 |

## 8.1 Decisões de Marcelo

A autorização para abrir este caso foi explícita no prompt de execução da refatoração: "A solicitação deste prompt constitui autorização explícita para abrir o caso. Não peça confirmação adicional apenas por formalidade" (`prompt_refatoracao_claude_md_e_captura_para_livro.md`, linha 96). A afirmação anterior de que a autorização era "implícita" estava incorreta — o próprio texto do prompt torna a autorização explícita, não inferida pela IA a partir do contexto.

## 8.2 Intervenções humanas

Nenhuma intervenção humana corretiva ocorreu durante a execução técnica da refatoração até este ponto — não houve rejeição, correção ou redirecionamento de uma proposta da IA no meio do trabalho. Isso é distinto de dizer que não houve participação humana: o desenho, o escopo e os critérios do processo (ver tabela acima) foram definidos e aprovados previamente por Marcelo, antes da IA iniciar a execução técnica.

## 8.3 Restrições ou redirecionamentos

O processo definido pelo prompt mestre já restringia fortemente o escopo por etapa antes da execução começar — a ausência de correção humana durante o trabalho reflete que essas restrições foram eficazes em prevenir desvio, não a ausência de supervisão humana no processo como um todo.

# 9. Investigação e evolução

## 9.1 Evidências coletadas

| Tipo | Referência | O que demonstra | Limitação |
|---|---|---|---|
| Comando | `wc -l -c CLAUDE.md` | 478 linhas / 40.396 bytes antes da refatoração | Medida pontual, não captura qualidade do conteúdo |
| Comando | `grep -c '^##'`/`'^###'` CLAUDE.md | 46 headings combinados | — |
| Listagem | `ls docs/`, `ls frontend/docs/` | Estrutura canônica de destino ainda incompleta antes desta tarefa | — |

## 9.2 Tentativas realizadas

Contagem verificada via `git status --short --untracked-files=all` contra `docs/` e `frontend/docs/`, diferenciando o que pertence a esta etapa (Etapa 7) do que já tinha sido criado nas Etapas 0-3 do processo (estrutura de `docs/book/`, protocolo, template):

- **14 documentos canônicos criados nesta etapa** (todos novos, nenhum "atualizado" — não existiam antes): `docs/README.md`; `docs/product/vision.md`; `docs/architecture/system-overview.md`; `docs/engineering/standards/{ai-assisted-workflow,code-conventions,engineering-principles,git-and-review-workflow,testing-strategy}.md` (5); `docs/operations/{deployment,environments,known-issues}.md` (3); `frontend/docs/{design-system,image-pipeline,seo}.md` (3). Total: 1+1+1+5+3+3 = 14.
- **1 arquivo reescrito** (não criado): `CLAUDE.md`, de 478 para 116 linhas. Não conta como "documento canônico novo" — é o próprio arquivo que a tarefa reduz.
- **1 estudo de caso criado**: este próprio arquivo (`CASE-001-...md`), pela skill/protocolo de captura, não um "documento canônico" no sentido do prompt de refatoração.

A afirmação anterior ("15 documentos canônicos novos") estava incorreta por erro de soma (1+1+5+3+3+1 = 14, não 15) e por contar implicitamente o índice junto sem separar categorias com clareza. Corrigido acima.

## 9.3 Tentativas que falharam

Nenhuma tentativa precisou ser revertida.

## 9.4 Hipóteses descartadas

Ver seção 5 (Alternativas consideradas), 5.2/5.3 — a hipótese de distribuir os gotchas técnicos entre os READMEs de componente foi avaliada e descartada em favor de consolidá-los em `docs/architecture/system-overview.md`, por proporcionalidade de escopo, não por inferioridade técnica.

## 9.5 Mudanças de escopo ou estratégia

Nenhuma mudança de escopo — o trabalho seguiu o plano das seções 4-8 do prompt sem desvio material.

# 10. Solução final

`CLAUDE.md` reescrito de 478 para 116 linhas (12 seções numeradas, aderentes à estrutura sugerida pelo prompt: papel/autoridade, princípios, início de sessão, análise/autorização, investigação, critérios de conclusão, restrição de Bash, convenções transversais, Git, mapa de fontes canônicas, captura de aprendizado, regra de manutenção). Conteúdo não-regra migrado para 14 documentos canônicos novos em `docs/` e `frontend/docs/` (ver seção 9.2 para a contagem verificada e o Apêndice A para o mapeamento seção a seção). Nenhum código de aplicação, infraestrutura ou workflow foi alterado.

A revisão buscou preservar o significado operacional das regras, migrando, resumindo ou removendo conteúdo derivável sem alteração intencional de seu sentido. Isso é diferente de afirmar que "nenhum valor foi alterado, só realocado" — uma redução de 478 para 116 linhas envolve necessariamente seleção (o que fica vs. o que sai), compressão (regras reduzidas a uma frase com link) e reformulação (reescrita de texto, não cópia literal em vários pontos). A fidelidade dessa compressão ao sentido original é uma afirmação da IA que executou a mudança, não uma prova — a confirmação final depende da revisão manual de Marcelo comparando o `CLAUDE.md` novo contra o antigo (disponível via `git diff`).

# 11. Evidência de antes e depois

<!-- Seção adicionada retroativamente, ao atualizar este caso para o padrão introduzido depois de sua abertura original (revisão pedida por Marcelo). Ver seção 16 para a limitação de baseline_ref não capturado na hora. -->

## Aplicabilidade

- Status: `required`
- Justificativa: refatoração concreta com migração de conteúdo real entre arquivos — atende ao critério do protocolo ("refatoração... transformação de regra documentada em controle executável").

## Referências

| Estado | Referência | Arquivo ou escopo |
|---|---|---|
| Antes | commit `060412fa439ca0a1cffdf6360b5b21296bc76a8e` (HEAD no início desta tarefa) | `CLAUDE.md` |
| Depois | working tree (ainda não commitado) | `CLAUDE.md` e os 14 documentos canônicos listados na seção 18 |

## Reprodução

```bash
git diff 060412fa439ca0a1cffdf6360b5b21296bc76a8e -- CLAUDE.md
```

O estado "depois" ainda está no working tree, não em um commit — o comando acima mostra o diff contra o `HEAD` original, mas não captura os 14 arquivos novos (que não existiam no baseline, então não aparecem como modificação de um arquivo rastreado). Para ver os arquivos novos: `git status --short --untracked-files=all docs/ frontend/docs/`. Quando este trabalho for commitado, `result_ref` deve ser atualizado com o hash real e esta seção revisada.

## Exemplo representativo 1 — Design system: valores completos saindo do CLAUDE.md

### Antes

```text
--petrol:        #0F4C5C;   /* cor primária de marca */
--petrol-deep:   #08323D;   /* header/footer escuro */
--clay:          #C9603C;   /* cor de destaque/CTA (laranja) */
[... 10 outras variáveis com valor hex completo ...]

Nunca usar --aws-orange, --aws-dark, --gray-* — foram removidos do frontend e do admin.
```

### Depois

```text
Fonte de valores executáveis: frontend/app/globals.css (:root) e prints/tokens.md.
Este documento explica princípios e papéis, não repete os valores.

Nunca usar --aws-orange, --aws-dark, --gray-* — removidos do frontend e do admin.
```

### O que mudou

Os 13 valores hexadecimais completos da paleta Petrol/Clay/Ivory saíram do `CLAUDE.md` e passaram a viver só no CSS (`globals.css`) e em `frontend/docs/design-system.md`, que explica o papel de cada cor sem repetir o valor. A regra de proibição (`--aws-orange` etc.) foi preservada quase literalmente nos dois lados.

### Por que este exemplo foi escolhido

É o caso mais claro de conteúdo `DERIVED` misturado com regra durável no `CLAUDE.md` original — os valores hex mudam se a paleta for redesenhada, mas a proibição de reintroduzir tokens antigos é um invariante que sobrevive a esse redesenho. O exemplo mostra a diferença na prática, não só na teoria.

### Classificação da evidência

- `Observed fact`: os 13 valores hex saíram do `CLAUDE.md` e a proibição de tokens antigos foi preservada em ambos os lados (comparação direta de texto).
- `AI inference`: nenhuma nesta comparação específica — é uma constatação textual direta, não uma interpretação.
- `Limitation`: este exemplo não prova que nenhum outro valor tenha sido alterado durante a migração — é uma amostra, não uma auditoria completa (essa é a função da tabela de migração no pacote de evidências).

## Exemplo representativo 2 — Gotcha técnico consolidado, não distribuído

### Antes

```text
### Next.js 16
- `params` é Promise — sempre `await params` antes de desestruturar em qualquer `page.tsx`.
- ISR: posts individuais `revalidate: 60`, listagens `revalidate: 300`, páginas estáticas `revalidate = 3600`.
```

(dentro de `## 4. Regras Críticas`, junto com OpenNext, DynamoDB, Backend, Sharp.js, variáveis de ambiente, CORS, CloudFront e SEO — 9 subseções técnicas no mesmo bloco do CLAUDE.md)

### Depois

```text
## Invariantes críticos transversais
- **Next.js 16 — `params` é Promise**: sempre `await params` antes de desestruturar em
  qualquer `page.tsx`. ISR: posts individuais `revalidate: 60`, listagens `revalidate: 300`,
  páginas estáticas `revalidate = 3600`.
[... mais 8 invariantes no mesmo formato ...]
```

(em `docs/architecture/system-overview.md`)

### O que mudou

As 9 subseções técnicas da antiga seção 4 do `CLAUDE.md` foram condensadas em uma lista de 9 itens dentro de `system-overview.md`, cada um reduzido a 1-3 linhas. O conteúdo factual (Next.js/DynamoDB/Sharp etc.) não mudou de sentido, só de formato e localização.

### Por que este exemplo foi escolhido

Ilustra a Alternativa E vs. F registrada na seção 5 deste caso: a decisão de consolidar em vez de distribuir pelos READMEs de componente é visível neste exemplo específico — o gotcha do Next.js só faz sentido junto dos outros 8 porque compartilham o mesmo critério de seleção (cross-componente, alto risco, não óbvio no código), não porque pertencem ao mesmo componente.

### Classificação da evidência

- `Observed fact`: as 9 subseções técnicas foram consolidadas em uma única lista em `system-overview.md`.
- `AI inference`: a leitura desse invariante continua igualmente acessível a partir do novo local — inferência, não medição (nenhuma sessão real testou a descoberta ainda, ver seção 15).
- `Limitation`: este exemplo não demonstra se um desenvolvedor trabalhando só no `frontend/` de fato encontraria esse gotcha em `docs/architecture/`, em vez de esperar encontrá-lo em `frontend/README.md`.

## Exemplo representativo 3 — Caso de controle: conteúdo preservado quase sem alteração

### Antes

```text
### Captura de aprendizado para o livro

Este projeto também funciona como laboratório sobre engenharia de software assistida por IA.
[...]
As regras detalhadas estão em `docs/book/capture-protocol.md` e
`.claude/skills/engineering-book-capture/SKILL.md`; a estrutura canônica de um caso está em
`docs/book/cases/templates/case-template.md`.
```

(seção inserida no `CLAUDE.md` durante a Etapa 5 deste mesmo processo, antes desta refatoração)

### Depois

Texto idêntico, apenas reposicionado de "## 2. Modo de Operação" (subseção) para "## 11. Captura de aprendizado para o livro" (seção própria) no novo `CLAUDE.md`.

### O que mudou

Nada no conteúdo — só a posição hierárquica.

### Por que este exemplo foi escolhido

Funciona como caso de controle (ver "Casos contrários" abaixo): nem toda seção do `CLAUDE.md` original precisou de compressão ou remoção. Esta já tinha sido escrita como resumo operacional na Etapa 5, então a classificação correta era `KEEP`, não `MOVE`/`DERIVED` — o exemplo evita dar a impressão de que a refatoração tratou tudo da mesma forma.

### Classificação da evidência

- `Observed fact`: o texto desta seção é idêntico antes e depois, exceto pela posição.
- `Limitation`: nenhuma interpretação necessária aqui — é o exemplo mais direto do conjunto.

## Casos contrários ou de controle

O Exemplo representativo 3 acima já funciona como caso de controle: mostra que a hipótese da refatoração ("separar regra de estado/histórico reduz o arquivo") não implicou reescrever todo o `CLAUDE.md` uniformemente — parte do conteúdo já estava no formato correto e só mudou de posição. Isso é evidência contra uma leitura simplista de que "toda seção era um problema a ser resolvido por compressão".

Não foi encontrado, até o momento desta atualização, um exemplo de regressão (algo que ficou pior ou mais difícil de encontrar após a migração) — porque nenhuma sessão real usou o `CLAUDE.md` novo ainda (ver seção 15, "eficácia operacional ainda não foi demonstrada"). Registrado como lacuna: a busca por caso contrário de regressão real só é possível na revisão de 2026-09-03.

## Evidência completa

- Diff reproduzível: `git diff 060412fa439ca0a1cffdf6360b5b21296bc76a8e -- CLAUDE.md` (para `CLAUDE.md`; arquivos novos via `git status`, ver "Reprodução" acima).
- Pacote de evidências: `docs/book/cases/evidence/CASE-001/`.
- Tabela de migração: `docs/book/cases/evidence/CASE-001/migration-table.md`.
- Patch preservado: not-applicable — o diff é pequeno o bastante para ser reproduzido diretamente por `git diff` quando o commit existir; não há necessidade de congelar um `.patch`.
- Testes e validações: not-applicable — tarefa puramente documental (ver seção 12.3).

# 12. Evidências de validação

Esta seção diferencia explicitamente **verificação automatizada** (repetível por qualquer pessoa, independente de quem executou a mudança) de **inspeção manual feita pela própria IA** (não é validação independente — é autoavaliação do autor da mudança, com o viés que isso implica).

## 12.1 Evidências automatizadas

- `wc -l -c CLAUDE.md` (antes) e novamente após a reescrita: 478→116 linhas, 40.396→~9.400 bytes.
- `grep -c '^##'` / `grep -c '^###'`: 46 headings combinados antes, 12 depois.
- `grep -oE '`[a-zA-Z0-9_./-]+\.(md|ts|tsx|json|yml)`' CLAUDE.md` (extração dos 15 caminhos citados) seguido de checagem de existência de cada um: todos existem, exceto `memory/feedback_bash_commands.md` — não é um caminho do repositório (o `memory/` deste projeto vive fora dele, no sistema de memória automática) e já era referenciado da mesma forma no `CLAUDE.md` anterior à refatoração. Registrado como ressalva, não como falha.
- `grep -niE` no novo `CLAUDE.md` por padrões proibidos pelo prompt (§12.4: sessão/hash de commit/URL de ambiente/versão exata/hex/vulnerabilidade atual/data histórica): único termo encontrado foi a palavra genérica "sessão" em sentido estrutural ("início de sessão", "sessão futura"), nunca narrando uma sessão específica.
- `git status --short --untracked-files=all`: confirma que nenhum arquivo fora de `CLAUDE.md` e `docs/`/`frontend/docs/` foi tocado nesta etapa (nenhum código, teste, infraestrutura ou workflow).

## 12.2 Evidências observadas (inspeção manual pela IA — não é validação independente)

Leitura completa de cada documento canônico criado, comparando contra o texto original do `CLAUDE.md`, para verificar que o conteúdo migrado corresponde ao original. Esta é uma checagem feita pela mesma IA que executou a migração — tem o mesmo ponto cego de qualquer autor revisando o próprio trabalho, e não substitui a comparação de um leitor independente (Marcelo). A tabela de migração no Apêndice A é o artefato que torna essa comparação possível para um terceiro, mas ela também foi montada pela IA, não conferida linha a linha por Marcelo ainda.

A redução de 478→116 linhas, por si só, **não comprova melhoria** — é uma métrica de tamanho, não de qualidade ou de preservação de sentido; o próprio prompt de refatoração adverte contra essa inferência (§9, §12.6).

## 12.3 Evidências ausentes ou insuficientes

- **Revisão manual do diff por Marcelo** — não ocorreu ainda; é a evidência de maior peso pendente, a única capaz de confirmar ou refutar a classificação seção a seção do Apêndice A.
- **Teste controlado da skill `engineering-book-capture`** — não ocorreu; esta própria revisão do CASE-001 foi feita diretamente pela IA seguindo instruções detalhadas de Marcelo, não como um exercício autônomo da skill em ação.
- **Uso do novo `CLAUDE.md` em sessões futuras reais** — não ocorreu; é o teste que realmente pressiona se alguma regra crítica foi perdida ou comprimida a ponto de deixar de ser encontrável.
- **Avaliação após 30 dias** (`review_after: 2026-09-03`) — pendente por definição.
- Esta tarefa é puramente documental — não há suíte de testes de código aplicável, conforme restrição explícita do prompt (§14).
- Não houve leitura linha-a-linha de `package.json`/lockfiles/workflows/Terraform durante esta etapa — o conteúdo derivável correspondente já estava tratado como tal na seção de dependências do `CLAUDE.md` anterior. Limitação registrada: se algum desses arquivos tivesse um dado crítico não documentado em lugar nenhum do `CLAUDE.md` anterior, ele não teria como ser descoberto nesta tarefa.

# 13. Mudança do modelo mental

## 13.1 Antes

`CLAUDE.md` como único repositório de verdade operacional — regra, estado, arquitetura, inventário e histórico misturados no mesmo arquivo, crescendo a cada sessão.

## 13.2 Depois

`CLAUDE.md` como constituição operacional curta (116 linhas) que aponta para fontes canônicas especializadas; cada tipo de informação (produto, arquitetura, padrão de engenharia, operação, componente, histórico) tem exatamente um lugar de verdade.

## 13.3 O que provocou a mudança

A aplicação direta da tabela de classificação (`KEEP`/`MOVE`/`DERIVED`/`HISTORICAL` etc.) a cada seção do `CLAUDE.md` original tornou visível, seção por seção, que a maior parte do conteúdo (design system com valores hex, tabela de dependências com versões exatas, URLs de ambiente) era `DERIVED` ou `TEMPORARY`, não regra durável — um padrão que já tinha precedente parcial no projeto (extração do backlog em 2026-08-02) mas nunca tinha sido aplicado de forma sistemática ao arquivo inteiro.

# 14. Princípio generalizável

Um `CLAUDE.md`/system prompt de agente também tem arquitetura de informação, e ela se degrada da mesma forma que a de um sistema de software: sem uma regra explícita de "o que pertence aqui", tende a acumular todo tipo de conteúdo por conveniência (é mais rápido escrever ali do que criar um documento novo), até que o custo de manter esse arquivo sincronizado com a realidade supera o valor de tê-lo centralizado. A pergunta operacional que separa regra de não-regra é simples e repetível: "isso muda como a IA trabalha em várias sessões futuras, ou é só verdade agora?" — se for só verdade agora, não pertence à constituição operacional.

# 15. Limites da conclusão

Este caso avalia a *estrutura* da migração (classificação, cobertura, ausência de perda aparente), não a *eficácia* dela em uso real — isso só é observável em sessões futuras que efetivamente precisem consultar as novas fontes canônicas sob pressão de uma tarefa real, não numa auditoria deliberada como esta ou nesta própria revisão. A redução de 478→116 linhas não é, por si só, prova de melhoria (o próprio prompt adverte contra essa inferência, §9 e §12.6) — é uma métrica objetiva que só ganha significado quando cruzada com a revisão de 30 dias.

Estado da conclusão, para deixar explícito:

- a refatoração estrutural **foi concluída** (arquivos criados, `CLAUDE.md` reescrito, nenhum outro arquivo tocado);
- a integridade documental **foi parcialmente validada** (checagens automatizadas passaram; classificação seção a seção existe mas não foi conferida por Marcelo);
- a eficácia operacional (a hipótese da seção 4) **ainda não foi demonstrada** — nenhuma sessão real usou o novo `CLAUDE.md` sob pressão de trabalho até este ponto;
- a avaliação longitudinal **continua pendente**, com data sugerida em `review_after`.

# 16. Questões em aberto

- `docs/engineering/standards/git-and-review-workflow.md` não existia antes desta tarefa (confirmado na Etapa 6 do processo) — foi criado nesta etapa, dentro do escopo autorizado pelo prompt mestre (§7 da Etapa 7: "se o documento canônico de Git ainda não existir e sua criação for necessária para receber conteúdo removido do CLAUDE.md, crie-o somente se isso estiver dentro do escopo permitido pelo prompt de refatoração" — a seção 6.2 do prompt de refatoração já listava esse documento entre os destinos recomendados).
- O `CLAUDE.md` final ficou em 116 linhas, abaixo da faixa preferencial sugerida pelo prompt (150-220 linhas). Não foi adicionado conteúdo de preenchimento para atingir a faixa — o prompt também proíbe isso explicitamente (§9: "não apagar informação apenas para atingir a meta", e por simetria, não adicionar por atingir uma meta também não é uma boa prática). Fica como questão em aberto para a revisão humana: 116 linhas é suficiente, ou alguma regra crítica foi comprimida demais?
- Não houve teste controlado da skill `engineering-book-capture` nem revisão manual do diff por Marcelo — ambos são passos previstos no encerramento do processo do prompt mestre, fora do escopo desta etapa específica, e são a razão pela qual o status deste caso permanece `active`, não `resolved`.
- A tabela de migração (`docs/book/cases/evidence/CASE-001/migration-table.md`) foi reconstruída retrospectivamente pela IA a partir da memória do trabalho executado, não mantida viva durante a execução original. Isso é uma limitação de processo registrada para a síntese futura: o protocolo de captura (seção "Fluxo de captura", "ao concluir o ciclo") prevê registrar a tabela de migração como parte do encerramento, não depois, sob pedido de revisão — e a atualização do sistema de captura que introduziu a seção "Evidência de antes e depois" (seção 11 deste caso) formalizou essa mesma lição para casos futuros.
- Este caso não teve `baseline_ref` capturado no momento da abertura (a skill, na época, ainda não pedia isso) — o hash usado no front matter (`060412f`) foi obtido agora, retrospectivamente, via `git log`, não registrado no instante em que o trabalho começou. É o mesmo tipo de lacuna que a seção 11 deste caso ilustra como exemplo de limitação.

# 17. Potencial para o livro

## 17.1 Tema ou capítulo possível

Engenharia de contexto para agentes de IA: por que "mais contexto" não é "melhor contexto", e como aplicar separação de responsabilidades documentais a um `CLAUDE.md`/system prompt que cresce organicamente.

## 17.2 Pergunta pedagógica central

Como decidir, de forma repetível, se uma informação pertence à "constituição operacional" de um agente ou a uma fonte canônica externa que ele consulta sob demanda?

## 17.3 Elementos necessários

Antes/depois do `CLAUDE.md` (linhas, seções), tabela de migração completa (`docs/book/cases/evidence/CASE-001/migration-table.md`), critério de decisão usado (5 perguntas da regra de manutenção), os 3 exemplos representativos de antes/depois da seção 11.

## 17.4 Exercício possível para o leitor

Dado um trecho de system prompt real, classificar cada frase como regra durável, estado, fato derivável ou histórico, usando a mesma tabela de classificação deste protocolo.

# 18. Referências

- `CLAUDE.md` (arquivo reescrito, 478→116 linhas).
- `docs/README.md`, `docs/product/vision.md`, `docs/architecture/system-overview.md` (novos, 3).
- `docs/engineering/standards/{engineering-principles,code-conventions,testing-strategy,ai-assisted-workflow,git-and-review-workflow}.md` (novos, 5).
- `docs/operations/{environments,deployment,known-issues}.md` (novos, 3).
- `frontend/docs/{design-system,image-pipeline,seo}.md` (novos, 3).
- Total: 14 documentos canônicos novos + 1 arquivo reescrito (ver seção 9.2 para a verificação).
- `docs/book/cases/evidence/CASE-001/migration-table.md`: tabela de migração completa, seção a seção (movida do corpo do caso para este arquivo separado ao atualizar o caso para o novo padrão de evidência de antes e depois — ver seção 11).
- Nenhum commit ainda — aguardando autorização explícita de Marcelo, conforme protocolo padrão do projeto.

# 19. Revisão posterior

Revisão sugerida em 2026-09-03. Além do preenchimento padrão da tabela abaixo, verificar especificamente os seguintes indicadores observáveis — evitar critério puramente subjetivo ("parece que funcionou"):

- alguma regra removida do `CLAUDE.md` precisou ser restaurada porque a IA não a encontrou na fonte canônica nova quando precisou dela;
- a IA procurou informação no lugar errado (ex.: tentou achar um valor de token em `CLAUDE.md` em vez de `frontend/docs/design-system.md`) antes de ser corrigida;
- alguma duplicação reapareceu entre `CLAUDE.md` e uma fonte canônica (o mesmo fato mantido em dois lugares de novo);
- algum link do mapa de fontes canônicas ficou apontando para um documento desatualizado ou removido;
- o `CLAUDE.md` voltou a crescer de forma perceptível desde a refatoração (checar linhas);
- houve correção humana de Marcelo causada especificamente por a IA ter operado com contexto insuficiente após a redução;
- levou mais tempo/passos para localizar uma informação do que levaria antes (dificuldade de navegação entre documentos);
- surgiu conflito entre o que uma fonte canônica descreve e o estado real do repositório (documento não revisado após uma mudança de código);
- alguma fonte canônica criada nesta tarefa nunca foi de fato consultada em uma sessão real, sugerindo que o conteúdo dela deveria estar em outro lugar (ou que não era necessário como documento separado).

| Campo | Registro |
|---|---|
| Data da revisão | 2026-09-03 (sugerida) |
| Decisão ainda válida | Pendente — revisão ainda não ocorreu |
| Retrabalho observado | Pendente |
| Efeitos não previstos | Pendente |
| Nova evidência | Pendente |
| Correções necessárias | Pendente |
| Princípio ainda generalizável | Pendente |
| Novo status | Pendente |
