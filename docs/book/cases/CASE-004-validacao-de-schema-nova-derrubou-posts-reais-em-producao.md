---
id: CASE-004
title: "O controle que eu mesmo adicionei quebrou produção: version obrigatório no schema rejeitava posts reais mais antigos"
summary: "Ao trocar `result.Item as Post` por validação real via Zod (postEntitySchema/parsePostItem), o campo version foi modelado como obrigatório, seguindo o comentário do próprio código-fonte (\"optimistic concurrency counter\") sem verificar contra os dados reais da tabela. Depois do deploy, múltiplos posts publicados de verdade (salvos antes do campo version existir) passaram a responder 500 no endpoint público, e o build estático do Next.js passou a falhar ao tentar pré-renderizá-los. Diagnosticado via CloudWatch em minutos, corrigido tornando version opcional, com um efeito colateral real capturado pelo vue-tsc no admin."
date_started: 2026-08-04
date_closed: 2026-08-04
status: resolved
themes: [type-safety, data-validation, production-incident, schema-design]
components: [backend, contracts, admin]
trigger_types: [ai-error, unexpected-result, ineffective-control]
related_commits: [314c149, 99b4828, c48e360, f6fea51, bce0e78]
related_pull_requests: ["https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/pull/3", "https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/pull/5"]
related_files: [packages/contracts/src/post.ts, backend/src/common/postPersistence.ts, backend/src/functions/getPost/index.ts, backend/src/functions/adminPosts/index.ts, admin/src/views/DashboardView.vue, backend/src/functions/getPost/index.test.ts, backend/src/functions/adminPosts/index.test.ts]
related_tests: [backend/src/functions/getPost/index.test.ts, backend/src/functions/adminPosts/index.test.ts]
related_pipelines: ["Deploy Pipeline (CD), run 30940648125 (introduziu)", "Pull Request Validation (CI), run 30943931153", "Deploy Pipeline (CD), run 30944140571 (corrigiu)"]
related_adrs: []
related_experiments: []
ai_tool: Claude Code
ai_model: claude-sonnet-5
book_potential: high
ai_autonomy_level: 5 — Commit or pull request preparation
review_after: 2026-09-03
last_reviewed:
baseline_ref: 99b4828
result_ref: bce0e78
evidence_files: []
---

<!-- Este caso é histórico. Reconstrói um incidente real ocorrido e resolvido dentro da mesma sessão em 2026-08-04. Não descreve necessariamente o estado atual do schema além do que está registrado aqui. -->

# Resumo do caso

O trabalho documentado em CASE-003 (Fase 1 do plano de padronização) foi seguido, na mesma sessão, por uma Fase 2: substituir `result.Item as Post` por validação real via Zod (`postEntitySchema`), aplicada nas leituras do DynamoDB que devolvem dado bruto ao cliente (`getPost` público e `adminPosts`). O campo `version` foi modelado como obrigatório no schema, replicando o comentário já existente na antiga `interface Post` ("optimistic concurrency counter, incremented on every save") sem checar se essa afirmação era universalmente verdadeira nos dados reais. Não era: posts publicados antes da feature de versionamento existir, e nunca resalvos desde então, não têm o atributo `version` no DynamoDB. O PR #3 foi mergeado e deployado em `develop`/`dev` com essa lacuna. Pouco depois, ao investigar uma falha de CI aparentemente não relacionada (um segundo PR, só de documentação), ficou claro que o endpoint público estava retornando 500 de forma consistente para vários posts reais — não uma falha transitória, como uma investigação anterior na mesma sessão (sobre um sintoma parecido, antes desse deploy) havia concluído.

# 1. Contexto

Mais cedo na mesma sessão, uma falha do build do Next.js ao pré-renderizar `/post/testeerroedicao` (antes do deploy de PR #3) tinha sido investigada e atribuída a uma falha transitória (cold start/throttling), com evidência de que o post respondia 200 normalmente via `curl` direto. Essa conclusão está registrada no histórico da conversa desta sessão, não em um caso formal. Depois do merge/deploy de PR #3 (Fase 2: validação de schema), a mesma classe de falha reapareceu — desta vez em um PR diferente, não relacionado ao backend (só documentação).

# 2. Problema observado

## 2.1 Fatos observados

- `Observed fact`: após o merge de PR #3 (commit `99b4828`) e o deploy correspondente (run `30940648125`, verde), `curl` direto contra `GET /post/testeerroedicao` passou a retornar `500` de forma consistente (3 tentativas seguidas, `curl -w "%{http_code}"`).
- `Observed fact`: os logs do CloudWatch da Lambda `getPost` (`aws logs tail /aws/lambda/marcelo-goncalves-blog-dev-getPost`) mostravam, para múltiplos slugs distintos (`testeerroedicao`, `teste-teste`, `novo-teste-apos-refatoracao-da-barra-lateral-em-novo-componente`), a mesma mensagem: `"post_item_invalid"`, `"issues":["version"]`, seguida de `"get_post_error"`, `"error":"Persisted post item failed validation"`.
- `Observed fact`: `postEntitySchema` (`packages/contracts/src/post.ts`, commit `314c149`) declarava `version: z.number().int()` — sem `.optional()`.
- `Observed fact`: um PR subsequente, de documentação apenas (sem tocar em backend/contracts), também falhou o build do Next.js ao tentar pré-renderizar outro post real (`decima-primeira-pagina-para-teste-futuro-de-paginacao`), confirmando que o problema afetava múltiplos posts, não um caso isolado.
- `Observed fact`: `vue-tsc --build` no admin falhou com `TS2345`/`TS2322` em `DashboardView.vue`, linhas 175 e 220, ambas assumindo que `post.version` era sempre `number` — quebrado assim que `Post.version` virou `number | undefined` na correção.

## 2.2 Impacto

Todo carregamento do endpoint público `GET /post/{slug}` para um post sem `version` retornava 500 em vez do conteúdo real — impacto direto em visitantes reais do site, não um ambiente de teste isolado. O build de produção do frontend (que busca todo post publicado em tempo de build para geração estática) ficou bloqueado por completo: um único post problemático interrompe `next build` inteiro (`exiting the build`), afetando o deploy de qualquer mudança de frontend, não só a do post em si.

# 3. Modelo mental inicial

O comentário já presente no código antes desta sessão ("optimistic concurrency counter, incremented on every save") foi lido como uma afirmação universal sobre o dado persistido — a suposição implícita era que todo post real no DynamoDB tem `version`, porque toda escrita passa por `savePost()`, que sempre define esse campo.

# 4. Hipótese inicial

Ao investigar a primeira falha de build (`/post/testeerroedicao`, antes do deploy de PR #3), a hipótese formulada foi: "falha transitória de infraestrutura (cold start/throttling), não um defeito de código" — sustentada por um `curl` direto retornando 200 na hora. Essa hipótese estava correta *naquele momento*, mas deixou de ser válida assim que PR #3 foi deployado — sem que isso fosse percebido até a investigação da segunda ocorrência.

# 5. Alternativas consideradas

## 5.1 Alternativa A — Corrigir o dado (adicionar `version` retroativamente aos posts legados no DynamoDB)

### Vantagens
Manteria o schema estritamente correto ("todo post tem version").

### Riscos
Mutação de dado real de produção/dev fora de um fluxo de escrita normal (`savePost()`), sem o mesmo controle de concorrência/auditoria; risco de esconder o problema real (o schema estava certo, mas os dados "errados") em vez de corrigi-lo na camada certa.

### Motivo da adoção ou rejeição
Rejeitada implicitamente — não foi tentada. A correção aplicada (Alternativa B) resolveu sem exigir escrita em dado real de produção.

## 5.2 Alternativa B — Tornar `version` opcional no schema

### Vantagens
Reflete a realidade observada dos dados (`Observed fact`, não suposição); não exige tocar em dado real de produção; `savePost()` já tratava `existing?.version ?? 0` como caso esperado, então o resto do código já estava preparado para essa possibilidade.

### Riscos
Exigia auditar todo consumidor de `Post.version` no admin/backend para achar assunções escondidas de "é sempre number" — risco de deixar algum outro ponto quebrado.

### Motivo da adoção ou rejeição
Adotada. O próprio `vue-tsc` (não uma varredura manual) achou o único outro ponto real de risco (`DashboardView.vue`), confirmando que a mudança de tipo era segura de propagar.

# 6. Riscos e critérios de aceitação

## 6.1 Riscos conhecidos
Tornar `version` opcional poderia, em tese, esconder um bug real em outro lugar que dependesse de `version` sempre existir sem checagem — mitigado ao rodar `vue-tsc`/`tsc` no admin e no backend depois da mudança, que capturam exatamente esse tipo de uso.

## 6.2 Critérios de aceitação
`GET /post/{slug}` deveria voltar a responder 200 para todo post publicado real, incluindo os legados sem `version`; `npm run verify` (backend) e `type-check`/`lint`/`test` (admin) deveriam passar limpos; o deploy real deveria confirmar o comportamento corrigido.

## 6.3 Obrigações de prova

| Mudança ou afirmação | Evidência exigida | Evidência obtida | Status |
|---|---|---|---|
| O bug afetava posts reais em produção/dev, não só um cenário hipotético | Logs reais do CloudWatch mostrando o erro em múltiplos slugs | Confirmado: `post_item_invalid`/`issues:["version"]` em pelo menos 3 slugs distintos, via `aws logs tail` contra a Lambda real | satisfied |
| A correção (`version` opcional) de fato resolve o problema em produção real | `curl` direto contra o endpoint público, para múltiplos posts, após o deploy da correção | Confirmado: 5 slugs testados via `curl -w "%{http_code}"` após o deploy do PR #5 (run `30944140571`, verde), todos retornando 200 | satisfied |
| A correção não introduziu nenhuma regressão nova no admin/backend | `npm run verify` (backend), `type-check`/`lint`/`test` (admin) | Confirmado: 220 testes backend + typecheck + lint limpos; `vue-tsc --build`, `eslint`, 43 testes Vitest do admin limpos após o fix do `DashboardView.vue` | satisfied |
| O build de deploy completo (não só os testes isolados) passa depois da correção | Pipeline de CD (`cd.yml`) verde após o merge do fix | Confirmado: run `30944140571`, todos os 9 jobs verdes, incluindo "1b. Build Frontend" (o job que originalmente falhava) | satisfied |
| Existem outros posts reais afetados além dos 3-5 identificados nesta sessão | Varredura completa da tabela `posts` por itens sem `version` | Não obtida — não foi feita uma varredura sistemática da tabela inteira, só verificação pontual dos slugs que apareceram nos logs/builds durante o incidente | not-satisfied |

# 7. Participação da IA

| Classificação | Descrição | Referência |
|---|---|---|
| AI error | Modelou `version` como obrigatório no schema sem validar contra os dados reais da tabela antes do deploy | commit `314c149` |
| AI implementation | Diagnóstico via CloudWatch, correção do schema, correção do `DashboardView.vue`, testes de regressão novos | commits `c48e360`, `f6fea51` |
| AI inference | A causa provável de posts sem `version` ser "salvos antes do campo existir, nunca resalvos desde então" — inferida do comentário já existente no código (`adminPosts/index.ts`) sobre esse mesmo padrão, não confirmada com uma consulta direta à data de criação desses posts especificamente |

## 7.1 Inferências da IA
A afirmação de que os posts afetados são especificamente "legados, nunca resalvos" é uma inferência razoável (consistente com o comentário pré-existente no código e com o comportamento de `savePost()`), não uma verificação direta de quando cada post específico foi criado pela última vez.

## 7.2 Propostas da IA
Entre corrigir o dado (Alternativa A) e corrigir o schema (Alternativa B), a IA escolheu e implementou a B diretamente, sem apresentar as duas como opção formal a Marcelo antes de agir — justificado pela urgência (produção real servindo 500) e pelo baixo risco da opção escolhida, mas é uma decisão técnica autônoma, não uma decisão humana confirmada previamente.

## 7.3 Implementação realizada pela IA
Toda a correção (schema, testes de regressão em dois arquivos de teste, fix do `DashboardView.vue`, commits, PR, diagnóstico via CloudWatch, verificação pós-deploy via `curl`) foi executada pela IA nesta sessão.

## 7.4 Erros ou limitações da IA
O erro central deste caso é o próprio: modelar um campo como obrigatório com base em um comentário de código ("sempre incrementado a cada save") em vez de validar contra uma amostra real dos dados persistidos antes de ativar uma validação estrita numa fronteira pública. O erro só foi descoberto porque a IA, investigando uma falha de CI aparentemente não relacionada (documentação), notou que o padrão de falha (mesma classe de erro, post diferente) não batia com a conclusão de "transitório" da investigação anterior, e insistiu em verificar via `curl`/logs reais em vez de assumir que era o mesmo problema já resolvido.

# 8. Participação humana

| Classificação | Descrição | Referência |
|---|---|---|
| Human decision | Marcelo autorizou explicitamente o merge do PR #5 mesmo com um check de CI vermelho (a falha circular do build de frontend), depois de a IA expor o raciocínio e pedir confirmação | conversa desta sessão, PR #5 |

## 8.1 Decisões de Marcelo
Marcelo não participou do diagnóstico técnico em si (root cause via CloudWatch, escolha entre Alternativa A/B) — isso foi autônomo da IA. A decisão humana registrada é a autorização explícita para mergear com um check vermelho, feita via pergunta direta da IA antes de agir (ação de risco segundo as regras operacionais do projeto).

## 8.2 Intervenções humanas
Nenhuma intervenção corretiva de Marcelo durante o diagnóstico ou a implementação da correção — a IA identificou, diagnosticou e corrigiu o próprio erro sem redirecionamento humano no conteúdo técnico.

## 8.3 Restrições ou redirecionamentos
Nenhum.

# 9. Investigação e evolução

## 9.1 Evidências coletadas

| Tipo | Referência | O que demonstra | Limitação |
|---|---|---|---|
| Log real (CloudWatch) | `aws logs tail /aws/lambda/marcelo-goncalves-blog-dev-getPost`, múltiplas entradas `post_item_invalid` | Confirma a causa raiz exata (`issues:["version"]`) e que afetava múltiplos posts reais, não um caso isolado | Amostra limitada à janela de tempo consultada (~20 min); não cobre todo o histórico do problema |
| Comportamento observado (curl direto) | `curl -w "%{http_code}"` contra `/post/{slug}` para 5 slugs, antes e depois do fix | Antes: 500 consistente (3 tentativas). Depois: 200 em todos os 5 | Não é uma varredura completa da tabela — só os slugs que apareceram nos logs/builds durante o incidente |
| Pipeline de CI | PR #5, run `30943931153`: backend/admin/contracts/integração/infra verdes, frontend vermelho (causa circular documentada) | Confirma que a correção não quebra nada fora do próprio problema que está resolvendo | O check de frontend não pôde ser validado como verde *neste* PR — só depois do merge, via CD |
| Pipeline de CD | Run `30944140571`, todos os 9 jobs verdes após o merge do PR #5 | Confirma a correção completa, incluindo o build de frontend que estava bloqueado | — |

## 9.2 Tentativas realizadas
1. Diagnóstico da falha do PR de documentação assumindo, a princípio, que seria o mesmo problema transitório já "resolvido" antes do deploy de PR #3.
2. `curl` direto revelou 500 consistente, não 200 — refutando a hipótese de "mesma causa, já resolvida".
3. Consulta aos logs reais do CloudWatch confirmou a causa exata em minutos.
4. Correção do schema, seguida de `vue-tsc` no admin revelando o efeito colateral em `DashboardView.vue`.
5. Correção do `DashboardView.vue`, validação completa local, PR, merge (com confirmação explícita de Marcelo dado o check vermelho circular), deploy, confirmação final via `curl` em 5 posts reais.

## 9.3 Tentativas que falharam
Nenhuma tentativa de correção falhou — a causa raiz foi identificada corretamente na primeira consulta aos logs, sem hipóteses intermediárias descartadas.

## 9.4 Hipóteses descartadas
A hipótese de que a nova falha (no PR de documentação) seria "a mesma falha transitória de antes" foi descartada assim que o `curl` direto mostrou 500 consistente em vez de 200 — diferente do resultado observado na investigação anterior, dentro da mesma sessão.

## 9.5 Mudanças de escopo ou estratégia
O trabalho passou de "revisar/mergear PR de documentação" para "investigar e corrigir uma regressão de produção real" no meio do fluxo, ao perceber que o padrão de falha não correspondia à conclusão anterior.

# 10. Solução final

`version` passou a ser `z.number().int().optional()` em `postEntitySchema`, alinhado ao que `savePost()` já assumia (`existing?.version ?? 0`). `DashboardView.vue` (admin) passou a tratar `post.version ?? 0` nos dois pontos que assumiam um `number` garantido, aproveitando que o backend já ignora o valor de `version` enviado quando o item não tem esse atributo (`attribute_not_exists(#version) OR ...` na `ConditionExpression` de delete). Dois testes de regressão novos (`getPost`, `adminPosts`) cobrem explicitamente um item sem `version` retornando 200.

# 11. Evidência de antes e depois

## Aplicabilidade

- Status: `required`
- Justificativa: correção de bug real em produção, com mudança de comportamento verificável (500 → 200) e mudança de schema/tipo com efeito em cascata.

## Referências

| Estado | Referência | Arquivo ou escopo |
|---|---|---|
| Antes (bug introduzido) | commit `99b4828` (merge de PR #3) | `packages/contracts/src/post.ts` |
| Depois (bug corrigido) | commit `bce0e78` (merge de PR #5) | `packages/contracts/src/post.ts`, `admin/src/views/DashboardView.vue` |

## Reprodução

```bash
git diff 99b4828..bce0e78 -- packages/contracts/src/post.ts admin/src/views/DashboardView.vue
```

## Exemplo representativo 1 — o campo que derrubou produção

### Antes

```typescript
version: z.number().int(), // optimistic concurrency counter, incremented on every save
```

### Depois

```typescript
// Optional: posts saved before this field existed (and never re-saved
// since) have no version attribute in DynamoDB at all — confirmed against
// real dev data. savePost()'s `existing?.version ?? 0` already treats a
// missing version as 0, so this isn't a gap introduced by making it optional.
version: z.number().int().optional(),
```

### O que mudou
Uma linha de schema, mas com efeito real em produção: a diferença entre "assumir que o comentário do código é verdade" e "verificar contra o dado real antes de ativar uma validação estrita numa fronteira pública".

### Por que este exemplo foi escolhido
É a linha exata que causou o incidente e a linha exata que o resolveu — o menor exemplo possível que ainda captura a causa raiz inteira.

### Classificação da evidência
- `Observed fact`: a versão "antes" está no commit `99b4828`, deployado e confirmado via logs reais causando 500.
- `Observed fact`: a versão "depois" está no commit `bce0e78`, deployado e confirmado via `curl` retornando 200 nos mesmos posts.
- `Limitation`: não há confirmação de que **todos** os posts afetados foram identificados — só os que apareceram nos logs durante a janela do incidente (ver 6.3).

## Exemplo representativo 2 — o efeito colateral capturado pelo type-checker, não por um teste

### Antes

```typescript
return postsApi.delete(slug, post!.version)
```

### Depois

```typescript
// Legacy posts saved before the version field existed have none: the
// backend's ConditionExpression already accepts any value in that case
// (attribute_not_exists(#version) OR ...), so 0 is a safe placeholder.
return postsApi.delete(slug, post!.version ?? 0)
```

### O que mudou
`post.version` deixou de ser garantidamente `number` quando `Post.version` virou opcional; `vue-tsc --build` (não um teste de comportamento, nem revisão manual) capturou os dois pontos reais que dependiam disso silenciosamente.

### Por que este exemplo foi escolhido
Demonstra o valor prático de rodar o type-checker de um consumidor downstream (`admin`) depois de mudar um schema compartilhado (`packages/contracts`) — o bug já existia em potencial antes desta sessão (a `interface Post` antiga também não garantia `version` nos dados reais, só no tipo), mas só ficou visível quando o tipo passou a refletir a realidade.

### Classificação da evidência
- `Observed fact`: `vue-tsc --build` falhou com `TS2345`/`TS2322` nessas duas linhas antes da correção, e passou limpo depois.
- `AI inference`: o uso de `0` como fallback é seguro porque a `ConditionExpression` do backend ignora o valor enviado quando o item não tem `version` — inferido pela leitura do código do backend (`adminPosts/index.ts`), não testado com um delete real contra um post legado nesta sessão.
- `Limitation`: não foi executado um delete real (nem em teste de integração, nem manualmente) contra um post legado sem `version` para confirmar o comportamento fim-a-fim — a evidência é de leitura de código + type-check, não de comportamento observado nesse fluxo específico.

## Casos contrários ou de controle
Não foi encontrado, nesta investigação, nenhum post real que tivesse `version` ausente e ainda assim funcionasse corretamente antes da correção — o padrão observado (500 para todo post sem `version`) foi consistente em todos os slugs verificados. Isso é evidência a favor da causa raiz identificada, não uma limitação da busca por contra-exemplos.

## Evidência completa
- Diff reproduzível: ver comando em "Reprodução" acima.
- Pacote de evidências: not-applicable — dois exemplos curtos são suficientes para o aprendizado central.
- Tabela de migração: not-applicable.
- Patch preservado: not-applicable.
- Testes e validações: `backend/src/functions/getPost/index.test.ts` e `backend/src/functions/adminPosts/index.test.ts` (2 casos novos); `npm run verify` (backend, 220 testes); `type-check`/`lint`/`vitest` (admin, 43 testes); PR #5 (run `30943931153`); CD run `30944140571` (verde, incluindo o build de frontend que estava bloqueado).

# 12. Evidências de validação

## 12.1 Evidências automatizadas
`npm run verify` no backend (typecheck + lint + 220 testes, incluindo os 2 casos de regressão novos). `vue-tsc --build` + `eslint` + `vitest run` (43 testes) no admin. Pipeline de CD completo (run `30944140571`) verde após o merge, incluindo o job de build de frontend que estava bloqueado antes da correção.

## 12.2 Evidências observadas
`curl` direto contra o endpoint público real, para 5 slugs distintos, confirmando 500 antes e 200 depois do deploy da correção — comportamento observado em ambiente real (`dev`), não simulado.

## 12.3 Evidências ausentes ou insuficientes
Não foi feita uma varredura completa da tabela `posts` real para contar quantos itens no total não têm `version` — só os slugs que apareceram nos logs/builds durante o incidente foram confirmados. Não foi testado um delete real (via admin ou script) contra um post legado sem `version` para confirmar o comportamento fim-a-fim do fallback `?? 0` no `DashboardView.vue` — a confiança nesse ponto vem de leitura de código, não de execução observada.

# 13. Mudança do modelo mental

## 13.1 Antes
Um comentário de código descrevendo uma invariante ("sempre incrementado a cada save") era tratado como fato suficiente para modelar um campo como obrigatório num schema de validação — mesmo esse mesmo comentário, em outro lugar do código, já reconhecendo a exceção ("posts saved before the version field existed").

## 13.2 Depois
Uma invariante documentada em comentário descreve a intenção de design, não necessariamente o estado de todos os dados já persistidos antes dessa intenção existir. Ativar validação estrita numa fronteira que serve tráfego real exige checar contra uma amostra real dos dados, não só contra a lógica de escrita atual — especialmente quando o próprio código já sinaliza (em outro comentário) que exceções históricas existem.

## 13.3 O que provocou a mudança
A investigação da segunda ocorrência da falha de build, que não batia com a hipótese de "transitório" já estabelecida na sessão — a IA notou a inconsistência e verificou via logs reais em vez de reaplicar a conclusão anterior sem checar.

# 14. Princípio generalizável

Um comentário de código que descreve uma invariante ("X é sempre Y") é uma afirmação sobre a intenção do código que a escreve, não uma prova sobre todos os dados já existentes antes dela. Antes de transformar essa invariante em uma validação estrita numa fronteira que serve tráfego real (não só em testes), vale checar uma amostra real dos dados — e, quando o próprio código já contém uma ressalva sobre exceções históricas (como o comentário sobre "posts saved before version existed" já continha), essa ressalva deveria ter sido o primeiro lugar a checar.

# 15. Limites da conclusão

Este caso demonstra a causa raiz, a correção e a validação para os slugs especificamente observados durante o incidente — não quantifica o total de posts afetados na tabela real, nem confirma o comportamento fim-a-fim do delete de um post legado no fluxo do admin (só via leitura de código + type-check). Ambos os pontos estão registrados explicitamente em 6.3/12.3, não devem ser inferidos como resolvidos.

# 16. Questões em aberto

- Quantos posts reais na tabela `posts` não têm `version`, além dos identificados durante este incidente? Não foi feita uma varredura completa.
- O fallback `?? 0` no delete de um post legado, no admin, se comporta como esperado num teste end-to-end real (não só leitura de código)? Não testado nesta sessão.
- Deveria existir uma migração de dados (Alternativa A, rejeitada aqui) para eventualmente eliminar a necessidade de `version` opcional, ou o campo permanece opcional indefinidamente? Não decidido — decisão de produto/arquitetura em aberto para Marcelo.

# 17. Potencial para o livro

## 17.1 Tema ou capítulo possível
"O controle que você mesmo adiciona pode ser o bug" — como uma mudança bem-intencionada (substituir cast por validação real) pode introduzir uma regressão pior do que o problema que resolve, se a validação não for checada contra dados reais antes do deploy.

## 17.2 Pergunta pedagógica central
Como equilibrar "validar de verdade os dados numa fronteira pública" com "não quebrar dados reais legítimos que nunca seguiram a invariante assumida"? E como a IA percebeu que uma conclusão anterior própria ("é transitório") precisava ser revisitada, em vez de reaplicada automaticamente?

## 17.3 Elementos necessários
CASE-003 como pano de fundo (mesma sessão, controle relacionado mas tema diferente); o log real do CloudWatch (sanitizado); o diff de uma linha que causou e resolveu o incidente; a linha do tempo curta (deploy → sintoma → diagnóstico → fix → deploy → confirmação) para mostrar a velocidade de resposta possível quando a observabilidade (logs estruturados, já corrigidos em CASE-003) está em vigor.

## 17.4 Exercício possível para o leitor
Dado um comentário de código afirmando uma invariante sobre um campo, e o schema de validação correspondente, pedir para o leitor identificar que pergunta deveria ser feita antes de tornar esse campo obrigatório numa fronteira pública.

# 18. Referências

- Commits: `314c149` (introduziu o bug), `99b4828` (deploy do bug), `c48e360`, `f6fea51` (correção), `bce0e78` (deploy da correção)
- Pull requests: https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/pull/3, https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/pull/5
- Pipelines: CD run `30940648125` (introduziu), CI run `30943931153`, CD run `30944140571` (corrigiu)
- Arquivos: `packages/contracts/src/post.ts`, `backend/src/common/postPersistence.ts`, `admin/src/views/DashboardView.vue`, `backend/src/functions/getPost/index.test.ts`, `backend/src/functions/adminPosts/index.test.ts`
- Caso relacionado (mesma sessão, tema diferente): CASE-003

# 19. Revisão posterior

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
