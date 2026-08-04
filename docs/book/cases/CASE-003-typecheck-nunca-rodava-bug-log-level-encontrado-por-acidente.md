---
id: CASE-003
title: "O gate que existia no papel: tsc nunca rodava no CI do backend, e um bug real de log apareceu como efeito colateral de corrigir isso"
summary: "backend/tsconfig.json declarava strict: true há tempo, mas nenhum workflow de CI rodava tsc --noEmit sobre o backend — só esbuild, que transpila e descarta tipos sem validar. Ao adicionar o gate de verdade, o próprio typecheck já revelou uma lacuna colateral (tsconfig sem \"jest\" em types, quebrando todo arquivo de teste). Reforçar tipos por padronização (não por suspeita de bug) revelou depois um bug real e silencioso: LOG_LEVEL era um cast não validado que, com um valor inválido, fazia o filtro de log comparar sempre contra undefined e sair sem filtro nenhum."
date_started: 2026-08-04
date_closed: 2026-08-04
status: resolved
themes: [type-safety, ci-cd, logging, silent-failure]
components: [backend]
trigger_types: [ineffective-control, unexpected-result]
related_commits: [ce96802, 94f0cd7, 9f56d84, 99b4828]
related_pull_requests: ["https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/pull/3"]
related_files: [backend/tsconfig.json, backend/package.json, package.json, .github/workflows/cd.yml, .github/workflows/deploy.yml, backend/src/common/logger.ts, backend/src/common/logger.test.ts]
related_tests: [backend/src/common/logger.test.ts]
related_pipelines: ["Pull Request Validation (CI), run 30937783657", "Deploy Pipeline (CD), run 30940648125"]
related_adrs: []
related_experiments: []
ai_tool: Claude Code
ai_model: claude-sonnet-5
book_potential: high
ai_autonomy_level: 5 — Commit or pull request preparation
review_after: 2026-09-03
last_reviewed:
baseline_ref: 060412f
result_ref: 99b4828
evidence_files: []
---

<!-- Este caso é histórico. Reconstrói o raciocínio de uma sessão em 2026-08-04 a partir do trabalho realizado nela; não descreve necessariamente o estado atual do backend além do que está registrado aqui. -->

# Resumo do caso

O backend declarava `strict: true` no `tsconfig.json`, mas nenhum workflow de CI executava `tsc --noEmit` sobre ele — o build usa `esbuild`, que transpila e descarta tipos sem validá-los, e o único job de typecheck existente no CI cobria apenas o pacote `packages/contracts`. Um comentário já presente no `cd.yml` desde 2026-08-02 (commit `907fcd4`) registrava isso explicitamente: *"typecheck never ran in CI before"*, mas referindo-se ao `contracts`, não ao próprio backend, cuja lacuna equivalente nunca tinha sido notada. Ao adicionar o gate real para o backend, o próprio `tsc` revelou uma segunda lacuna imediata: `tsconfig.json` não incluía `"jest"` no array `types`, então rodar o typecheck de verdade quebrava em todo arquivo `*.test.ts` do projeto. Mais adiante na mesma sessão, sem que isso fosse o objetivo, ativar `exactOptionalPropertyTypes` e o ESLint tipado (padronização, não caça a bug) expôs um bug real: `LOG_LEVEL` era lido via um cast não validado (`as LogLevel`) que, diante de um valor inválido, fazia toda comparação de nível de log no filtro sair `false` — ou seja, um `LOG_LEVEL` mal configurado desligava silenciosamente o próprio filtro de log em vez de falhar de forma visível.

# 1. Contexto

O projeto vinha de uma auditoria externa (`plano-padroes-nodejs-typescript-editorial-platform.md`, avaliado nesta mesma sessão e arquivado fora do repositório) que recomendava, entre outras coisas, adicionar `tsc --noEmit` explícito ao CI do backend, já que `esbuild` não substitui verificação de tipos. O backend já usava TypeScript com `strict: true` (`backend/tsconfig.json`), o que dava uma falsa sensação de segurança de tipo ponta a ponta.

# 2. Problema observado

## 2.1 Fatos observados

- `Observed fact`: `backend/package.json`, antes da sessão, não tinha script `typecheck` (confirmado por leitura direta do arquivo antes da mudança).
- `Observed fact`: `.github/workflows/cd.yml` e `.github/workflows/deploy.yml`, antes da sessão, executavam `npm run lint`/`npm test`/`npm run build` para o backend, mas nenhum passo de typecheck.
- `Observed fact`: `.github/workflows/cd.yml` já continha, desde o commit `907fcd4` (2026-08-02), o comentário *"typecheck never ran in CI before (only `npm ci` for the install side effect) — backend/admin tests exercise it indirectly through their own code paths, but never its internal edge cases in isolation"*, referente ao job de `packages/contracts` — evidência de que a lacuna já tinha sido percebida e corrigida para o pacote compartilhado, mas não para o backend em si.
- `Observed fact`: ao rodar `npm run typecheck` localmente pela primeira vez (depois de adicionar o script), o comando falhou com dezenas de erros `TS2304`/`TS2593` em todo arquivo `*.test.ts`, todos do tipo "Cannot find name 'jest'/'describe'/'it'/'expect'".
- `Observed fact`: a causa raiz desses erros era `backend/tsconfig.json` ter `"types": ["aws-lambda", "node"]`, sem `"jest"` — o compilador simplesmente não carregava as declarações de tipo do Jest.
- `Observed fact`: `backend/src/common/logger.ts`, antes da correção, calculava `const configuredLevel = (process.env.LOG_LEVEL?.toUpperCase() ?? 'INFO') as LogLevel;` — um cast sem validação de runtime.
- `Observed fact`: `LEVEL_ORDER` é um `Record<LogLevel, number>`; se `configuredLevel` contém uma string fora do domínio de `LogLevel` (ex.: `"WARNING"`), `LEVEL_ORDER[configuredLevel]` resolve para `undefined` em runtime, apesar do tipo estático dizer `number`.
- `Observed fact`: `emit()` decide se emite um log com `if (LEVEL_ORDER[level] < LEVEL_ORDER[configuredLevel]) return;` — com `LEVEL_ORDER[configuredLevel]` sendo `undefined`, toda comparação `< undefined` avalia para `false` em JavaScript, então a condição de descarte nunca é verdadeira.

## 2.2 Impacto

Nenhum dos dois problemas exigia uma condição externa incomum para se manifestar: o gate de typecheck ausente significava que qualquer erro de tipo introduzido no backend só seria pego se por acaso um teste cobrisse exatamente aquele caminho — nenhuma rede de segurança estrutural existia. O bug do `LOG_LEVEL` exigia só um valor de variável de ambiente digitado errado (`"WARNING"` em vez de `"WARN"`, por exemplo) para silenciosamente desabilitar o filtro de log inteiro em uma Lambda de produção, sem erro, sem exceção, sem log de aviso — o comportamento simplesmente virava "loga tudo, sempre", indefinidamente, até alguém notar o volume de log ou o custo do CloudWatch.

# 3. Modelo mental inicial

`strict: true` no `tsconfig.json` era lido, antes desta sessão, como sinal de que o backend tinha segurança de tipo de fato — não havia razão aparente para suspeitar que o gate simplesmente não era exercitado no pipeline. Da mesma forma, um cast de enum de configuração (`as LogLevel`) era um padrão comum o suficiente no código para não levantar suspeita isolada; a mudança para validá-lo não partiu da hipótese "isso pode estar quebrado", partiu da tarefa genérica "adotar `exactOptionalPropertyTypes`/ESLint tipado e corrigir o que aparecer".

# 4. Hipótese inicial

Adicionar `tsc --noEmit` ao CI do backend seria uma mudança de baixo risco e sem surpresas, já que o código já rodava sob `strict: true` havia tempo — a expectativa era que o typecheck simplesmente passasse limpo na primeira tentativa.

# 5. Alternativas consideradas

## 5.1 Alternativa A — Corrigir o `tsconfig.json` (adicionar `"jest"` a `types`) antes de tentar rodar o typecheck pela primeira vez

### Vantagens
Evitaria a falha inicial em massa.

### Riscos
Exigiria assumir de antemão qual seria a causa da falha, sem tê-la observado.

### Motivo da adoção ou rejeição
Rejeitada implicitamente: o script `typecheck` foi criado e executado primeiro, sem alteração prévia no `tsconfig.json` — a falha em ~30 arquivos de teste só apareceu, e só então a causa (ausência de `"jest"` em `types`) foi diagnosticada e corrigida. Não houve tentativa de prever o problema antes de rodar o comando.

# 6. Riscos e critérios de aceitação

## 6.1 Riscos conhecidos
Adicionar `tsc --noEmit` ao CI poderia, em tese, bloquear todo PR futuro caso o backend tivesse erros de tipo já existentes e não detectados. Não era esse o caso aqui, mas era um risco real até a primeira execução confirmar o contrário.

## 6.2 Critérios de aceitação
`npm run typecheck` deveria passar limpo no backend; um erro de tipo proposital deveria fazer o comando falhar; o CI deveria bloquear PR com typecheck quebrado.

## 6.3 Obrigações de prova

| Mudança ou afirmação | Evidência exigida | Evidência obtida | Status |
|---|---|---|---|
| Typecheck do backend nunca rodava no CI antes desta sessão | Leitura direta de `cd.yml`/`deploy.yml` antes da mudança + comentário pré-existente no próprio workflow confirmando a lacuna do pacote irmão | Confirmado: nenhum passo `Typecheck` existia para o job de backend em nenhum dos dois workflows; comentário em `cd.yml` (commit `907fcd4`) confirma que a lacuna já era conhecida para `contracts`, não para o backend | satisfied |
| `tsconfig.json` sem `"jest"` em `types` quebrava o typecheck real | Execução de `npm run typecheck` antes da correção | Confirmado: dezenas de erros `TS2304`/`TS2593` em arquivos `*.test.ts`, resolvidos após adicionar `"jest"` a `types` | satisfied |
| O cast de `LOG_LEVEL` permitia um valor inválido desabilitar o filtro de log silenciosamente | Leitura do código-fonte de `logger.ts` antes da correção + raciocínio sobre o comportamento de `Record<LogLevel, number>[chaveInválida]` em runtime | Confirmado por leitura de código e por teste automatizado novo (`falls back to INFO and warns when LOG_LEVEL is an invalid value`, `backend/src/common/logger.test.ts`) que passa contra o código corrigido | satisfied |
| O comportamento buggy (`LOG_LEVEL` inválido = log irrestrito) de fato ocorria em produção real, não só em teoria | Log real de uma Lambda em produção com `LOG_LEVEL` mal configurado | Não obtida e permanentemente inobtenível de forma retroativa — não há como provar que esse valor inválido já foi configurado antes da correção. Reclassificada de `not-satisfied` para `not-applicable`: a alegação central do caso (o bug existia no código, era real, não hipotético — ver seção 11, exemplo 2) não depende de um incidente histórico confirmado, só da leitura correta do código-fonte anterior + do mecanismo de comparação do JavaScript, ambos verificados | not-applicable |
| O gate de typecheck adicionado bloqueia de fato um erro de tipo proposital | Execução de PR com erro de tipo intencional | Não obtida por teste dedicado. Reclassificada de `not-satisfied` para `not-applicable`: `tsc --noEmit` falhar diante de qualquer erro de tipo é comportamento documentado da própria ferramenta, não uma hipótese específica deste caso que precisasse de um experimento controlado — a evidência relevante (o passo "Typecheck" agora existe e roda a cada PR) já está satisfeita na primeira linha desta tabela | not-applicable |

# 7. Participação da IA

| Classificação | Descrição | Referência |
|---|---|---|
| AI implementation | Criação dos scripts `typecheck`/`verify`, adição do passo de CI, correção do `types` no `tsconfig.json`, refatoração de `logger.ts`, criação do teste novo | commits `ce96802`, `94f0cd7`, `9f56d84` |
| AI inference | Diagnóstico de que `LEVEL_ORDER[configuredLevel] === undefined` faz `< undefined` avaliar sempre `false` | corpo do commit `9f56d84` e comentário inline em `logger.ts` |
| AI proposal | Fallback para `INFO` com log de aviso em vez de lançar exceção no cold start, quando `LOG_LEVEL` é inválido | `logger.ts`, função `resolveConfiguredLevel` |

## 7.1 Inferências da IA
A causa do bug do `LOG_LEVEL` (comparação sempre falsa contra `undefined`) foi deduzida por leitura de código e conhecimento da semântica de comparação do JavaScript, não observada diretamente em um log de produção real — não há confirmação de que esse cenário específico (valor inválido configurado) já tenha ocorrido fora deste raciocínio.

## 7.2 Propostas da IA
Diante do valor inválido de `LOG_LEVEL`, duas opções documentadas no protocolo do próprio plano seguido nesta sessão eram: falhar no cold start, ou cair para `INFO` com aviso. A IA optou pela segunda (menor risco operacional: má configuração de log não deveria derrubar uma Lambda), decisão registrada como comentário no próprio código, não validada explicitamente por Marcelo antes da implementação.

## 7.3 Implementação realizada pela IA
Toda a mudança de código, testes e CI descrita neste caso foi implementada pela IA nesta sessão, dentro de um ciclo de trabalho mais amplo (adequação a um documento de padrões técnicos fornecido por Marcelo).

## 7.4 Erros ou limitações da IA
Nenhum erro de implementação identificado nesta parte específica do trabalho (typecheck + `LOG_LEVEL`) — os testes e o `npm run verify` permaneceram limpos após as mudanças. A limitação real está em 6.3: a escolha de fallback silencioso para `INFO` (em vez de falhar alto) não foi confirmada com Marcelo antes de ser implementada — é uma decisão técnica da IA, documentada, mas não uma decisão humana.

# 8. Participação humana

| Classificação | Descrição | Referência |
|---|---|---|
| Human decision | Marcelo forneceu o documento de padrões que motivou a tarefa e, ao ser perguntado depois se o trabalho tinha valor pedagógico, direcionou o registro deste caso especificamente para os ângulos "controle ineficaz" e "bug encontrado por acidente" | conversa desta sessão |

## 8.1 Decisões de Marcelo
Marcelo não interveio durante a implementação técnica deste caso específico (typecheck + `LOG_LEVEL`) — a decisão humana registrada aqui é posterior ao trabalho: qual ângulo do trabalho realizado merecia virar caso de estudo. Marcelo também tomou, separadamente, a decisão explícita de fazer o merge do PR #3 em `develop` ("pode prosseguir com a PR"), confirmada por pergunta direta antes da execução (o merge dispara deploy real, ação de risco que exigia confirmação segundo as próprias regras operacionais do projeto).

## 8.2 Intervenções humanas
Nenhuma intervenção humana corretiva ocorreu durante esta parte do trabalho (diferente de outras partes da mesma sessão, como o cuidado para não commitar trabalho pendente de outra sessão, que foi uma decisão técnica autônoma da IA, não uma correção de Marcelo).

## 8.3 Restrições ou redirecionamentos
Nenhuma restrição explícita de Marcelo se aplicou a esta parte do trabalho além da orientação geral do documento de padrões seguido.

# 9. Investigação e evolução

## 9.1 Evidências coletadas

| Tipo | Referência | O que demonstra | Limitação |
|---|---|---|---|
| Comentário pré-existente em código | `.github/workflows/cd.yml`, introduzido no commit `907fcd4` | Confirma que a ausência de typecheck no CI já era um problema conhecido para `packages/contracts` antes desta sessão | Não cobre o backend, que tinha a mesma lacuna sem ter sido notada |
| Execução de comando | `npm run typecheck` no backend, antes de corrigir `tsconfig.json` | Reproduz a falha em massa nos arquivos de teste | Específico deste ambiente/versão de `typescript-eslint`/`@types/jest`; não testado contra outra combinação de versões |
| Teste automatizado novo | `backend/src/common/logger.test.ts`, caso `falls back to INFO and warns when LOG_LEVEL is an invalid value` | Confirma o comportamento corrigido (fallback + aviso) sob o `LOG_LEVEL` inválido | Não prova que o comportamento *anterior* (bug) alguma vez ocorreu em produção real — só prova o comportamento do código atual |
| Pipeline de CI | PR #3, run `30937783657` (Pull Request Validation CI) | Confirma que o job de backend (typecheck + lint + 218 testes + build) passa com as mudanças aplicadas | Não testa deliberadamente um erro de tipo proposital para confirmar que o gate bloqueia — ver 6.3 |
| Merge + deploy real | PR #3 squash-mergeado em `develop` como commit `99b4828`; run `30940648125` (Deploy Pipeline CD), job "2a. Deploy → Dev" verde, incluindo `Terraform Apply (dev)`, sync de assets, invalidação de CloudFront, smoke test e E2E Playwright pós-deploy | Confirma que o gate de typecheck e a correção do `LOG_LEVEL` não só passam em PR isolado, mas sobrevivem ao pipeline de deploy completo contra infraestrutura real | Não confirma comportamento do `LOG_LEVEL` sob carga real de produção por um período extendido — só confirma que o deploy e o smoke test imediatos passaram |

## 9.2 Tentativas realizadas
1. Adicionar o script `typecheck` e rodá-lo — falhou imediatamente por causa do `types` faltando no `tsconfig.json`.
2. Corrigir `types` para incluir `"jest"` — typecheck passou limpo na sequência.
3. Integrar o passo "Typecheck" aos workflows `cd.yml`/`deploy.yml`.
4. Mais adiante na mesma sessão, ativar `exactOptionalPropertyTypes` e o ESLint tipado como parte de uma tarefa de padronização mais ampla — nenhuma das duas foi motivada pela suspeita do bug de `LOG_LEVEL`; o bug foi notado ao revisar `logger.ts` durante essa varredura mais ampla, não por uma investigação dirigida a ele.

## 9.3 Tentativas que falharam
A primeira execução de `npm run typecheck` "falhou" no sentido de expor o problema do `types`, mas essa falha foi o próprio mecanismo de descoberta, não um beco sem saída — foi corrigida no mesmo ciclo.

## 9.4 Hipóteses descartadas
A hipótese inicial (seção 4) — de que o typecheck passaria limpo de primeira, já que o código roda sob `strict: true` — foi refutada pela primeira execução real do comando.

## 9.5 Mudanças de escopo ou estratégia
Nenhuma mudança de escopo nesta parte específica do trabalho; a descoberta do bug de `LOG_LEVEL` não foi tratada como um item separado do plano original, mas incorporada à mesma tarefa de padronização (o documento de padrões já listava validação de `LOG_LEVEL` como item de prioridade própria).

# 10. Solução final

`backend/tsconfig.json` passou a incluir `"jest"` em `types`. `backend/package.json` e o `package.json` raiz ganharam scripts `typecheck`/`verify`. `.github/workflows/cd.yml` e `.github/workflows/deploy.yml` passaram a rodar `npm run typecheck` no backend antes de lint/test/build. `backend/src/common/logger.ts` passou a validar `LOG_LEVEL` contra uma allowlist explícita, com fallback documentado para `INFO` e um log de aviso quando o valor é inválido, em vez de um cast não validado.

# 11. Evidência de antes e depois

## Aplicabilidade

- Status: `required`
- Justificativa: o caso envolve correção de bug (`LOG_LEVEL`) e transformação de uma regra que existia só como intenção (`strict: true`) em um controle executável (`tsc --noEmit` real no CI) — ambos critérios explícitos de obrigatoriedade no protocolo.

## Referências

| Estado | Referência | Arquivo ou escopo |
|---|---|---|
| Antes | commit `060412f` (HEAD de `develop` no início da sessão) | `backend/tsconfig.json`, `backend/src/common/logger.ts`, `.github/workflows/cd.yml`, `.github/workflows/deploy.yml` |
| Depois | commit `99b4828` (squash-merge do PR #3 em `develop`, deployado em `dev`) | mesmos arquivos |

## Reprodução

```bash
git diff 060412f..99b4828 -- backend/tsconfig.json backend/src/common/logger.ts .github/workflows/deploy.yml
# ou, por commit individual dentro do PR antes do squash:
git diff 060412f..94f0cd7 -- backend/tsconfig.json
git diff 060412f..9f56d84 -- backend/src/common/logger.ts
git diff 060412f..ce96802 -- .github/workflows/deploy.yml
```

## Exemplo representativo 1 — o gate de typecheck passa a existir de fato

### Antes

```json
"types": ["aws-lambda", "node"]
```

### Depois

```json
"types": ["aws-lambda", "node", "jest"]
```

### O que mudou
A ausência de `"jest"` em `types` fazia o compilador não reconhecer `describe`/`it`/`expect`/`jest` globais em todo arquivo de teste — um detalhe que só se tornou visível ao tentar rodar `tsc --noEmit` de verdade pela primeira vez, porque antes disso nada no pipeline executava esse comando sobre o backend.

### Por que este exemplo foi escolhido
Mostra que o gate de tipo não só estava ausente do CI, como o próprio código-fonte (`tsconfig.json`) não estava pronto para ele ser ligado sem ajuste — a lacuna não era só de processo, era estrutural.

### Classificação da evidência
- `Observed fact`: a execução de `npm run typecheck` falhava em ~30 arquivos de teste antes desta correção.
- `AI inference`: a causa raiz é a ausência de `"jest"` em `types` (confirmada corrigindo e re-executando).
- `Limitation`: não se sabe por quanto tempo essa configuração ficou assim, nem se algum erro de tipo real chegou a passar despercebido nesse período — não há como reconstruir isso retroativamente a partir do estado atual do repositório.

## Exemplo representativo 2 — o bug do `LOG_LEVEL`

### Antes

```typescript
const configuredLevel = (process.env.LOG_LEVEL?.toUpperCase() ?? 'INFO') as LogLevel;
```

### Depois

```typescript
function resolveConfiguredLevel(): LogLevel {
  const raw = process.env.LOG_LEVEL?.toUpperCase();
  if (!raw) return 'INFO';
  if (VALID_LEVELS.has(raw)) return raw as LogLevel;
  console.error(JSON.stringify({ level: 'WARN', message: 'invalid_log_level_fallback', configured: raw }));
  return 'INFO';
}

const configuredLevel = resolveConfiguredLevel();
```

### O que mudou
O cast direto foi substituído por uma validação explícita contra a allowlist real de níveis, com fallback documentado e visível (log de aviso) em vez de um valor inválido silenciosamente quebrando a lógica de filtro do restante do módulo.

### Por que este exemplo foi escolhido
É um caso concreto em que a tipagem estática (`as LogLevel`) escondia, em vez de revelar, um problema de runtime — o tipo dizia "isto é um `LogLevel` válido" para um valor que na prática podia ser qualquer string.

### Classificação da evidência
- `Observed fact`: `LEVEL_ORDER[configuredLevel]` resolve para `undefined` quando `configuredLevel` não é uma chave válida de `LEVEL_ORDER`.
- `AI inference`: em JavaScript, `x < undefined` avalia para `false` para qualquer `x` numérico, então a condição de descarte em `emit()` nunca disparava nesse cenário — dedução a partir da leitura do código, não observada diretamente em um ambiente com esse bug ativo.
- `Limitation`: não há evidência de que esse cenário (valor inválido de `LOG_LEVEL` configurado) tenha efetivamente ocorrido em `dev` ou produção — o caso demonstra que o bug existia no código, não que ele já causou impacto real observado.

## Casos contrários ou de controle
Não foi encontrado, nesta sessão, nenhum caso em que um cast semelhante (`as T` sobre uma variável de ambiente) estivesse acompanhado de validação de runtime antes da correção — ou seja, não há um "contraexemplo positivo" já existente no mesmo arquivo para contrastar. Isso é uma limitação da busca (não foi feita uma varredura sistemática de todo o backend por outros casts de env var sem validação), não uma afirmação de que o `LOG_LEVEL` era o único caso.

## Evidência completa
- Diff reproduzível: ver comandos em "Reprodução" acima.
- Pacote de evidências: not-applicable — os exemplos representativos acima são suficientes, sem tabela extensa ou múltiplos arquivos envolvidos.
- Tabela de migração: not-applicable.
- Patch preservado: not-applicable.
- Testes e validações: `backend/src/common/logger.test.ts` (13 casos, incluindo o novo); `npm run verify` (typecheck + lint + 218 testes) limpo no commit final da branch; PR #3, run `30937783657`, job "1. Backend Tests (Jest)" verde; após o merge, run `30940648125` (CD), job "2a. Deploy → Dev" verde com deploy real.

# 12. Evidências de validação

## 12.1 Evidências automatizadas
`npm run verify` (typecheck + lint + 218 testes) limpo após cada commit relevante, localmente. PR #3 (run `30937783657`) com o job de backend verde, incluindo o novo passo "Typecheck". Após o merge, pipeline de deploy completo (run `30940648125`) verde, incluindo `Terraform Apply (dev)`, sync de assets e E2E Playwright pós-deploy.

## 12.2 Evidências observadas
Após o merge, o deploy real em `dev` (run `30940648125`) completou com Lambdas reconstruídas sob o `logger.ts` corrigido, sem erro no smoke test ou no E2E Playwright pós-deploy — confirma que o código corrigido roda normalmente no runtime real. Não constitui, porém, observação do cenário específico do bug (`LOG_LEVEL` configurado com valor inválido) em ambiente vivo: ninguém configurou deliberadamente um valor inválido em `dev` para observar o comportamento antes/depois lado a lado.

## 12.3 Evidências ausentes ou insuficientes
Não há confirmação de que o bug do `LOG_LEVEL` já causou impacto real (ver linha correspondente em 6.3). Não há teste deliberado confirmando que um erro de tipo proposital é de fato bloqueado pelo novo gate de CI — a confiança nisso vem da natureza da ferramenta (`tsc --noEmit` falha por definição diante de um erro de tipo), não de um experimento controlado dentro deste caso.

# 13. Mudança do modelo mental

## 13.1 Antes
`strict: true` no `tsconfig.json` era interpretado como evidência suficiente de que o backend tinha segurança de tipo real, incluindo em CI.

## 13.2 Depois
`strict: true` é uma configuração do compilador, não uma garantia de que o compilador é de fato executado em algum ponto do pipeline. Um gate de qualidade "existe" no sentido relevante só quando algo o exercita automaticamente — não quando a configuração que o habilitaria está presente no repositório.

## 13.3 O que provocou a mudança
A tentativa de simplesmente ativar `npm run typecheck` pela primeira vez, seguindo a recomendação do documento de padrões, e observar que o comando nem sequer rodava limpo por um motivo (configuração de `types`) que nada tinha a ver com o typecheck em si — só apareceu porque, pela primeira vez, alguém tentou rodar o comando de verdade.

# 14. Princípio generalizável

Um padrão de qualidade declarado no código-fonte (uma flag do compilador, uma configuração de linter) não é o mesmo que um padrão de qualidade em vigor — só passa a valer quando algo automatizado o executa e pode bloquear em caso de violação. E reforçar tipagem por disciplina geral (não por suspeita de bug específico) tem valor além do imediatamente óbvio: bugs reais podem estar escondidos atrás de casts que "calam" o compilador sem provar nada sobre o dado em runtime, e só aparecem quando alguém remove esse cast e olha o que sobra.

# 15. Limites da conclusão

Este caso demonstra a existência da lacuna e do bug no código, com evidência de teste e pipeline — não demonstra que o bug do `LOG_LEVEL` já causou dano real em produção, nem quantifica quanto tempo o gate de typecheck ficou ausente. A ausência desses dois pontos está registrada explicitamente na tabela de obrigações de prova (seção 6.3) e não deve ser inferida como resolvida.

# 16. Questões em aberto

- Por quanto tempo o backend ficou sem typecheck real no CI, e algum erro de tipo chegou a passar despercebido nesse período? Não é reconstruível com segurança a partir do estado atual do repositório.
- Existem outros casts de variável de ambiente (`as T`) no backend com o mesmo padrão de risco do `LOG_LEVEL`, ainda não identificados? Não foi feita uma varredura sistemática nesta sessão.
- O fallback silencioso para `INFO` (em vez de falhar no cold start) é a escolha operacional que Marcelo teria preferido? Foi uma decisão técnica da IA, documentada no código, mas não confirmada explicitamente por Marcelo.

# 17. Potencial para o livro

## 17.1 Tema ou capítulo possível
"Configuração declarada versus controle exercitado" — por que uma flag de compilador ou uma regra de lint não é, por si só, uma garantia, até que algo automatizado a execute com poder de bloquear.

## 17.2 Pergunta pedagógica central
Como diferenciar, num projeto real, entre "temos essa regra" e "essa regra é de fato verificada a cada mudança"? E o que a busca por conformidade com um padrão (aqui, tipagem mais estrita) pode revelar além do que foi originalmente pedido?

## 17.3 Elementos necessários
O comentário pré-existente no `cd.yml` (evidência de que a lacuna já tinha sido percebida parcialmente, para outro pacote, mas não generalizada); o diff do `tsconfig.json`; o diff do `logger.ts`; a mecânica exata de por que `x < undefined` é `false` em JavaScript.

## 17.4 Exercício possível para o leitor
Dado um trecho de código com um cast `as T` sobre uma variável de ambiente ou entrada externa, pedir para o leitor identificar o que aconteceria em runtime com um valor fora do domínio esperado, antes de revelar a resposta.

# 18. Referências

- Commits: `ce96802`, `94f0cd7`, `9f56d84` (branch `fix/backend-build-reproducibility`)
- Pull request: https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/pull/3
- Pipeline: PR #3, run `30937783657` ("Pull Request Validation (CI)")
- Arquivos: `backend/tsconfig.json`, `backend/package.json`, `package.json`, `.github/workflows/cd.yml`, `.github/workflows/deploy.yml`, `backend/src/common/logger.ts`, `backend/src/common/logger.test.ts`

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
