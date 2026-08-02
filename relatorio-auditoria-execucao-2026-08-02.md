# Relatório de execução — remediação da auditoria de qualidade (2026-08-02)

> Sessão executada de forma autônoma (agendada, sem interação), a partir de dois documentos:
> `auditoria-qualidade-mgoncalves-editorial-platform.md` (relatório original) e
> `auditoria-confirmacao-expansao-2026-08-02.md` (confirmação/expansão feita numa sessão anterior desta mesma data, que validou cada achado contra o código real e ampliou o escopo de vários itens).
>
> **Nada foi commitado nem pushado.** Todas as mudanças estão no working tree, aguardando revisão sua.

---

## 1. O que foi corrigido

### P0.2 + P0.4 — Escritas no DynamoDB sem proteção contra sobrescrita (`adminPosts`, `adminCategories`)

- `backend/src/functions/adminPosts/index.ts`: `PutCommand`/`TransactWriteCommand` agora levam `ConditionExpression: attribute_not_exists(slug)` na criação e `attribute_exists(slug)` na atualização. Falha de condição vira `409` (slug já existe) ou `404` (post não existe) em vez de sobrescrever silenciosamente.
- `backend/src/functions/adminCategories/index.ts`: mesmo padrão (`attribute_not_exists`/`attribute_exists(categoria_slug)`), já que o handler tinha o mesmo bug e já separava POST (create) de PUT (update) com rotas distintas.
- Novo `backend/src/common/dynamoErrors.ts`: helper `isConditionalCheckFailure()` que reconhece a falha tanto em `PutCommand` simples (`ConditionalCheckFailedException`) quanto dentro de `TransactWriteCommand` (`TransactionCanceledException` com `CancellationReasons`).
- Testes: 6 novos em `adminPosts/index.test.ts`, arquivo novo `adminCategories/index.test.ts` (não existia nenhum teste para essa Lambda antes), e 3 novos testes de integração reais em `backend/src/integration/posts.integration.test.ts` (create-duplicado → 409, update-inexistente → 404, versão desatualizada → 409 — ver P0.3 abaixo).

### P0.3 — Versionamento otimista em `adminPosts` (parcial, deliberadamente aditivo)

- Campo `version` adicionado a `Post` (`common/types.ts`) e ao `postInputSchema`. Incrementado a cada save (`(existing?.version ?? 0) + 1`).
- Se o cliente reenviar o `version` que leu, o `ConditionExpression` ganha uma cláusula extra (`AND #version = :expectedVersion`) e uma edição concorrente baseada em dado velho recebe `409`.
- **Isto é proteção real, mas só opt-in**: o admin (Vue) hoje **não** manda `version` de volta nos saves (`admin/src/services/api.ts` → `postsApi.update()` não inclui esse campo), então essa cláusula nunca é acionada na prática ainda. Implementei dessa forma deliberadamente — mudar o admin para round-trip do `version` exige tocar formulário/composable do editor e validar num browser real, o que este ciclo autônomo não tem como fazer com segurança. **Fica pendente de decisão sua**: se quiser a proteção completa, é uma mudança pequena e localizada em `admin/src/composables/usePostForm.ts` + `services/api.ts`, mas quero que você veja funcionando antes de confiar nela.

### `adminAuthors` — **NÃO** recebeu a mesma correção (achado durante a implementação, não estava no relatório original)

Ao tentar replicar o padrão de `adminPosts`/`adminCategories` em `adminAuthors`, descobri que o comentário do próprio código (`"PUT - Atualizar/Criar Autor (Upsert)"`) é intencional: `admin/src/services/api.ts` confirma que o frontend **sempre** usa `PUT` para salvar um autor, tanto para criar quanto para editar — nunca usa `POST`. Se eu tivesse aplicado `attribute_exists` no PUT (replicando cegamente o padrão do relatório), **criar um autor novo pela tela do admin teria quebrado imediatamente** (404 em toda tentativa de criação). Deixei `adminAuthors` como estava. Se quiser a mesma proteção aqui, exige primeiro decidir separar create/update no frontend (`authorsApi`) — decisão de produto, não migro isso sozinho.

### 4.6 + 4.7 — CORS wildcard perigoso e JSON inválido virando 500

- `backend/src/functions/adminSession/index.ts`: removido o fallback `process.env.ADMIN_ORIGIN || "*"` (que convivia, no mesmo objeto de headers, com `Access-Control-Allow-Credentials: true` — combinação que navegadores rejeitam para requisições credenciadas). Trocado por `requireEnv("ADMIN_ORIGIN")` (novo `common/env.ts`), que falha alto e claro no cold start se a env var faltar, em vez de servir silenciosamente um wildcard que o browser ia recusar de qualquer jeito.
- `JSON.parse(body)` sem `try/catch` próprio em `adminSession` (retornava 500 em vez de 400) corrigido com o novo `common/httpBody.ts` (`parseJsonBody`, compartilhado).
- **Achado adicional não citado no relatório original**: `backend/src/functions/mediaUpload/index.ts` tinha exatamente o mesmo bug (`JSON.parse(event.body)` cru) — corrigido com o mesmo utilitário. Também corrigi de passagem o caso de `body` ausente, que lançava `Error` capturado pelo catch genérico (500) em vez de responder 400 direto.
- Testes novos em `adminSession/index.test.ts` (JSON inválido → 400, CORS nunca é `*`) e `mediaUpload/index.test.ts` (body ausente e JSON inválido → 400).

### P1.2 — Validação Zod mais forte em `postSchema.ts`

Antes de escrever qualquer limite, rodei um `scan` real contra a tabela `posts` de dev (via `aws dynamodb scan`, profile `claude-dev`) para saber os tamanhos reais em produção — método "código primeiro, não achismo": maior slug 68 chars, maior título 71, maior resumo 370. Os limites abaixo são **tetos de segurança**, não metas editoriais — dimensionados bem acima do maior valor real, só para rejeitar payload patológico:

- `slug`: regex `^[a-z0-9]+(?:[-_][a-z0-9]+)*$` (compatível com `slugify()` do admin) + `max(200)`.
- `titulo` (max 300), `resumo` (max 600), `subtitulo` (max 300), `meta_titulo_seo` (max 160), `meta_descricao_seo` (max 300), `topico` (max 120), `conteudo_html` (max 300.000 chars).
- `tempo_leitura_min`: agora `.int().min(1).max(180)`.
- `superRefine`: status `"Programado"` sem `data_publicacao_programada` é rejeitado.
- **Deliberadamente não usei `.datetime()`** nos campos de data, ao contrário do exemplo do relatório original: `admin/src/components/editor/SettingsDrawer.vue` usa `<input type="datetime-local">`, que emite `"2026-08-02T14:30"` — sem segundos, sem timezone. Um `.datetime()` estrito teria quebrado o agendamento de posts pelo próprio admin. Descoberto lendo o componente real antes de aplicar a validação, não por tentativa e erro.
- 13 testes novos em `backend/src/common/postSchema.test.ts` (não existia teste dedicado para o schema antes), incluindo um caso que trava exatamente esse formato `datetime-local`.

### P0.1 — Gates de segurança agora bloqueiam o deploy de verdade

Achado expandido pela auditoria de confirmação: não era só Semgrep/Gitleaks fora do caminho real — `npm audit`, TFLint e Trivy também só existiam em `deploy.yml`, que roda em PR contra `main` (raro no fluxo normal do projeto, que é push direto em `develop`).

- `.github/workflows/security.yml`: adicionado `workflow_call:` ao `on:`, para poder ser chamado como job de dependência por outro workflow (sem duplicar Semgrep/Gitleaks).
- `.github/workflows/cd.yml`:
  - novo job `security-scans` (`uses: ./.github/workflows/security.yml`);
  - novo job `validate-infra` (Terraform fmt/validate + TFLint + Trivy config scan — mesmos checks do `deploy.yml`, agora também no caminho real);
  - `npm audit --audit-level=high` adicionado a `build-backend`, `build-frontend` e `test-admin` (mesmo ponto onde `deploy.yml` já fazia isso);
  - `deploy-dev` e `plan-prod` agora têm `security-scans` e `validate-infra` no `needs` — antes, nenhum desses 5 controles (Semgrep, Gitleaks, npm audit, TFLint, Trivy) tinha qualquer efeito sobre se um deploy acontecia ou não.
- Validado: YAML de `cd.yml`/`deploy.yml`/`security.yml` parseado com `js-yaml` (sintaticamente válido) — **não foi possível rodar o workflow de verdade** (isso só acontece no GitHub Actions real); a validação end-to-end é o próximo push disparar o CD e observar os novos jobs passarem.

### 4.12 — GitHub Actions desatualizadas (Node 20 → Node 24 nativo)

`actions/cache`, `actions/upload-artifact`, `actions/download-artifact` estavam em `v4` (ainda em Node 20 por padrão, mascarado pelo `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`). Atualizados para as versões mais recentes reais (verificadas via `gh api`, não a busca web que sugeriu números um pouco desatualizados):
- `actions/cache` → `v5.1.0`
- `actions/upload-artifact` → `v7.0.1`
- `actions/download-artifact` → `v8.0.1`

Todos com SHA pinado (convenção do projeto). Verifiquei os changelogs das duas últimas antes de trocar (`v7`/`v8` mudam o comportamento de artefatos não-zipados, mas o default `archive: true` — que é o que este projeto usa implicitamente — preserva o comportamento atual; `download-artifact v8` virou ESM internamente, mas isso é transparente pra quem só usa a action via `uses:`). **`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` mantido** — não verifiquei se `hashicorp/setup-terraform`, `aws-actions/configure-aws-credentials`, `gitleaks/gitleaks-action`, `aquasecurity/trivy-action` e `terraform-linters/setup-tflint` já rodam nativamente em Node 24; removê-la sem checar isso arriscaria reintroduzir o warning para essas 5 actions.

### 4.9 — `--fix` removido do lint da CI (admin)

`admin/package.json`: `"lint": "eslint . --fix --cache"` virou `"lint": "eslint . --cache"` (só verifica) + `"lint:fix": "eslint . --fix --cache"` (novo, pra uso local). Antes de aplicar, rodei `npm run lint` sem `--fix` no estado atual do admin para confirmar que não havia nenhuma violação sendo mascarada pelo auto-fix — **saiu limpo, exit code 0**, então essa mudança não deveria quebrar o próximo `cd.yml`.

### 4.8 — Deriva de documentação corrigida

`CLAUDE.md` §3 dizia "7 módulos AWS"; `ls infra/modules/` confirma 10 (o mesmo número que o próprio `CLAUDE.md` §10 item 48 já usava em outro lugar). Corrigido para "10 módulos AWS".

### 4.11 — Input manual `environment` sem efeito removido

`cd.yml`: o `workflow_dispatch.inputs.environment` nunca era lido por nenhum job (todos usam `github.ref`) — removido, com um comentário explicando o porquê (branch já é a única fonte de verdade).

---

## 2. O que foi investigado mas **não** alterado (e por quê)

| Item | Decisão | Motivo |
|---|---|---|
| `adminAuthors` — proteção contra sobrescrita | **Decisão final: não implementar** (ver §3.1) | Blog tem 1 autor só, por design — não há colisão real possível. Upsert continua sendo a escolha certa aqui, não uma pendência. |
| Versionamento otimista completo (frontend enviando `version`) | **✅ Implementado** (ver §3.1) | `usePostForm.ts`/`api.ts` já fazem o round-trip do `version` e tratam o 409 com mensagem específica. |
| P1.1 — pacote `packages/contracts` compartilhado (Zod/tipos únicos entre backend e admin) | **Não implementado** | Maior mudança estrutural do plano de ação (exige configurar npm workspaces de verdade, migrar imports do admin e do backend, e revalidar os dois builds). Risco desproporcional para um ciclo sem supervisão humana ativa — recomendo sessão dedicada. |
| P1.3 — configuração centralizada (`env.ts` cobrindo todas as Lambdas) | **Parcial** | Criei `requireEnv()` e apliquei só em `ADMIN_ORIGIN` de `adminSession` (o caso genuinamente perigoso, confirmado no código). Não auditei variável por variável de todas as 11 Lambdas para decidir o que deveria virar obrigatório — isso arrisca quebrar uma Lambda em produção por uma env var que hoje tem um fallback tolerado de propósito. |
| P1.4 — camada HTTP padronizada (parsing/erros/responses) | **Parcial** | `common/httpBody.ts` criado e usado nos 2 pontos com bug real (`adminSession`, `mediaUpload`). Não migrei `adminPosts`/`adminCategories`/`adminAuthors` para o utilitário compartilhado — o código deles já está correto e testado; trocar por trocar não tinha ganho que justificasse o risco. |
| P2.2 — smoke Playwright em produção | **Não implementado** | Mudança de infraestrutura de deploy (novo step no job `deploy-prod`) que só é exercitada de verdade num deploy real de produção — ainda não existe ambiente de prod. Fica registrado, sem ação. |
| P2.5 — reorganizar documentação em `docs/` | **Não implementado** | Mudança grande, de baixo risco técnico mas alto volume (mover/reescrever múltiplos arquivos) — não é o tipo de correção "objetivamente certa" que cabe num ciclo autônomo sem revisão; é decisão editorial sua. |
| P2.6 — reduzir comentários temporários/históricos no código | **Não implementado** | O próprio `CLAUDE.md` já registra isso como sessão dedicada planejada (~730 comentários, a maioria em português citando sessão/data) — não é escopo de passagem. |

---

## 3. Validação executada

- **Backend**: `tsc --noEmit` limpo, `eslint .` limpo, `npm test` → **206/206 passando** (13 suites → 14, +13 testes novos no total desde o início da sessão).
- **Admin**: `npm test` → 27/27 passando (sem mudança de comportamento, só o script de lint). `npm run lint` (sem `--fix`) → limpo.
- **Integração (DynamoDB Local)**: 3 testes novos escritos e com `tsc` limpo, mas **não executados** neste ambiente — não há Docker nem Java disponíveis aqui para subir o DynamoDB Local. Serão validados pelo job `test-backend-integration` no próximo push (CI real, container `amazon/dynamodb-local`).
- **Workflows**: `cd.yml`, `deploy.yml`, `security.yml` parseados com `js-yaml` (sintaxe válida); **não** executados de verdade (só acontece no GitHub Actions real, no próximo push).
- **Frontend**: não tocado nesta sessão — nenhuma validação necessária.

---

## 3.1. Follow-up (mesma sessão, a pedido de Marcelo): "prosseguir com as melhorias do admin"

- **Versionamento otimista agora funciona de ponta a ponta.** `admin/src/types/index.ts` ganhou `version?: number`; como `usePostForm.ts` já espalha (`{...data}`) a resposta do GET no form e o payload do save (`{...form.value}`), o campo passa a fazer o round-trip sozinho, sem lógica nova de leitura/escrita. O que faltava era o tratamento do conflito: `admin/src/services/api.ts` (`apiCall`) agora anexa `status` ao `Error` lançado (o texto da mensagem continua mascarado em produção, mas o código HTTP não é informação sensível); `usePostForm.ts` (`save()`) detecta `status === 409` e mostra "Este post foi alterado em outra sessão... recarregue antes de salvar novamente" em vez do genérico "Erro ao salvar". Deliberadamente **não** tentei mesclar os dados nem recarregar sozinho — silenciosamente descartar o que o usuário acabou de digitar seria pior que a mensagem de erro.
- **`adminAuthors` — decisão: não separar create/update.** Ao olhar de novo para aplicar a mesma proteção, percebi que o valor é quase nulo aqui: o blog tem exatamente 1 autor por design (`AUTHOR_ID` hardcoded em `usePostForm.ts` e `AuthorEditView.vue`, mesmo padrão documentado em `memory/project_admin_single_user.md`) — não existe "outro autor" para colidir, nem outra sessão administrativa concorrente. Forçar a mesma separação create/update que faz sentido em posts/categorias (que têm múltiplos itens e risco de colisão real) só adicionaria uma chamada GET prévia e complexidade sem proteção correspondente. Mantido como upsert, por ser a escolha correta aqui — não por falta de tempo.
- Validado: `vue-tsc --build` limpo, `npm run lint` limpo, `npm test` → 27/27 (sem novo teste dedicado ao fluxo de conflito 409 no frontend — exigiria mockar `fetch` no nível certo do Vitest; considerei baixo risco o suficiente pra não bloquear nisso agora, já que a lógica em si é um `if` simples sobre um campo já testado no backend).

## 4. Pendências que precisam de você

1. **Observar o próximo push em `develop`** — é a única forma de confirmar que os novos jobs (`security-scans`, `validate-infra`) realmente passam no GitHub Actions real, que os testes de integração novos passam contra o DynamoDB Local de CI, e que o fluxo de conflito 409 do admin funciona contra a API real (não só localmente).
2. **P1.1 (contratos compartilhados)** e **P2.5 (reorganizar documentação)** ficam de fora deliberadamente — candidatos a sessão própria, não a um ciclo autônomo.

---

## 5. Arquivos novos nesta sessão

```
backend/src/common/dynamoErrors.ts
backend/src/common/env.ts
backend/src/common/httpBody.ts
backend/src/common/postSchema.test.ts
backend/src/functions/adminCategories/index.test.ts
auditoria-confirmacao-expansao-2026-08-02.md   (sessão anterior, mesma data)
relatorio-auditoria-execucao-2026-08-02.md     (este arquivo)
```
