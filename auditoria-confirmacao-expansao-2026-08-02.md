# Confirmação e expansão da auditoria de qualidade (2026-08-02)

> Este documento audita o próprio `auditoria-qualidade-mgoncalves-editorial-platform.md` — verifica cada achado contra o código real da branch `develop` (não contra a descrição do relatório) e registra onde a realidade é igual, pior ou diferente do que foi relatado. Serve de insumo para a sessão de remediação agendada.

---

## Metodologia

Cada item da seção 4 do relatório original foi checado lendo o arquivo/linha real apontado como evidência (quando existia) e, nos casos relevantes, buscando o mesmo padrão em arquivos irmãos que o relatório não citou (para saber se o achado é isolado ou sistêmico).

---

## Achados CONFIRMADOS exatamente como descritos

- **4.2 — Contratos duplicados / não é workspace real.** `package.json` raiz confirmado sem campo `workspaces`; instalação via `install:all` entrando em cada pasta. `scripts/check-types-drift.mjs` confirmado baseado em regex (`extractTypeAliases`, `normalizeUnion`), só compara a entidade `Post`.
- **4.3 — Validação semântica fraca.** `backend/src/common/postSchema.ts` confirmado campo a campo: `status` opcional, `slug`/`titulo`/`resumo` sem `.max()`, sem regex de slug, `tempo_leitura_min: z.number().optional()` sem `.int()`/`.min()`/`.max()`, datas como `z.string()` livre.
- **4.8 — Deriva de documentação (contagem de módulos).** Confirmado e localizado com precisão: `CLAUDE.md` linha 125 (`§3 Arquitetura`) diz **"7 módulos AWS"**; `ls infra/modules/` retorna **10** (`admin`, `api-gateway`, `cognito`, `dynamodb`, `finops`, `frontend`, `lambda`, `media`, `observability`, `security-monitoring`) — o mesmo número que o próprio `CLAUDE.md` §10 item 48 já usa em outro lugar. É uma linha desatualizada isolada, não uma divergência estrutural — correção mecânica, sem risco.
- **4.9 — `--fix` no lint da CI.** Confirmado: `admin/package.json` → `"lint": "eslint . --fix --cache"`. `frontend` e `backend` não têm esse problema (`eslint .` puro). Isolado ao admin.
- **4.10 — Smoke Playwright só em dev.** Confirmado lendo `cd.yml` linha a linha: `deploy-dev` roda `npx playwright test e2e/smoke.spec.ts` (linhas 393-399); `deploy-prod` só tem o bloco de `curl` (linhas 589-613), sem nenhum step de Playwright.
- **4.11 — Input `environment` do `workflow_dispatch` sem efeito.** Confirmado: `cd.yml` linha 8-15 declara o input, mas todos os `if:` de job usam `github.ref == 'refs/heads/...'` (linhas 246, 417, 471, 484) — o input nunca é lido em lugar nenhum do arquivo.

---

## Achados CONFIRMADOS e PIORES/MAIORES do que o relatório descreveu

### 4.1 — Scans de segurança não bloqueiam o deploy (era "crítico"; a checagem mostrou que o problema é mais amplo)

O relatório citou só Semgrep/Gitleaks (`security.yml`) como desconectados do deploy. Conferindo `deploy.yml` também: **`npm audit --audit-level=high`, TFLint e Trivy também só existem em `deploy.yml`** — que, pelo próprio `CLAUDE.md` (§10, item 48), "só dispara em PR contra `main`, raro nesse fluxo de trabalho" (o fluxo normal é push direto em `develop`, que dispara só `cd.yml`).

Ou seja: **nenhum** dos 5 controles de segurança/qualidade mencionados no relatório (Semgrep, Gitleaks, npm audit, TFLint, Trivy) está no caminho que o projeto realmente usa no dia a dia. `cd.yml` roda só `check-types-drift`, lint, testes unitários/integração e build antes do `terraform apply -auto-approve` em dev. O achado do relatório está correto, mas subestima o tamanho do gap.

### 4.4 / 4.5 — Escrita sem proteção contra sobrescrita/concorrência (confirmado, e presente em mais lugares)

O relatório cita só `adminPosts`. Confirmado lá (`PutCommand` sem `ConditionExpression` tanto no create quanto no update, `backend/src/functions/adminPosts/index.ts:207-215`) — e o **mesmo padrão existe em `adminAuthors/index.ts:112` e `adminCategories/index.ts:121`** (ambos `PutCommand` puro, sem condição). Nenhum dos 3 CRUDs administrativos tem proteção contra slug/id duplicado ou concorrência. Se a remediação for aplicada, o padrão deveria ser o mesmo nos 3 lugares, não só em posts.

### 4.6 — CORS wildcard + credentials (o relatório descreveu como risco teórico; no código é uma combinação real e ativa)

O relatório apresenta isso como um risco abstrato de configuração. Conferindo `backend/src/functions/adminSession/index.ts`:
```ts
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "*";        // linha 18
...
"Access-Control-Allow-Credentials": "true",                   // linha 25
```
**As duas linhas coexistem no mesmo objeto `baseHeaders`.** Hoje `ADMIN_ORIGIN` está sempre setado via Terraform (não é `*` em produção), então o navegador nunca vê essa combinação de fato — mas o fallback existe e, se a env var faltar por qualquer motivo (erro de deploy, novo ambiente mal configurado), o Lambda serviria `Access-Control-Allow-Origin: *` + `Access-Control-Allow-Credentials: true` simultaneamente, o que os navegadores rejeitam para requisições credenciadas — quebrando login do admin de forma confusa (parece bug de CORS genérico, não de env var faltando). `adminPosts`/`mediaUpload` têm o mesmo fallback `|| "*"` mas **sem** `Allow-Credentials`, então não têm esse risco específico — só `adminSession` combina os dois.

### 4.7 — JSON inválido tratado inconsistentemente (confirmado, e mais um caso encontrado)

Relatório cita `adminSession` como o caso ruim. Confirmado: `JSON.parse(body)` na linha 49, sem try/catch próprio — cai no catch genérico do handler e vira `500`. `adminPosts`/`adminCategories`/`adminAuthors` já têm o padrão correto (`parseJsonBody` com try/catch dedicado, `getPosts` idem para `nextToken`). **Achado adicional não citado no relatório:** `backend/src/functions/mediaUpload/index.ts:44` tem o mesmo bug — `JSON.parse(event.body)` sem try/catch próprio, dentro de um try/catch genérico que devolve `500` para JSON malformado. São 2 Lambdas com o bug (`adminSession`, `mediaUpload`), não 1.

### 4.12 — Actions com aviso de runtime Node (relatório foi vago; aqui estão os alvos concretos)

O relatório recomendava só "identificar as actions" sem nomear nenhuma. Levantamento de todas as actions usadas nos 3 workflows (`cd.yml`, `deploy.yml`, `security.yml`) e checagem via busca externa (GitHub changelog):

| Action | Versão atual no projeto | Versão com Node 24 nativo |
|---|---|---|
| `actions/cache` | `v4` | `v5` |
| `actions/upload-artifact` | `v4` | `v6` |
| `actions/download-artifact` | `v4` | `v7` |
| `actions/checkout` | `v6.1.0` | já Node 24 ✅ |
| `actions/setup-node` | `v6.5.0` | já Node 24 ✅ |

O `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: 'true'` presente em `cd.yml`/`security.yml` é exatamente o workaround temporário para essas 3 actions (`cache`/`upload-artifact`/`download-artifact`) ainda rodarem em Node 20 por padrão — GitHub vai forçar Node 24 em todas as actions a partir de 2 de junho de 2026 independente dessa env var, então o fix real é o bump de versão, não manter o workaround. `hashicorp/setup-terraform@v3`, `aws-actions/configure-aws-credentials@v4`, `gitleaks/gitleaks-action@v2`, `aquasecurity/trivy-action@v0.36.0`, `terraform-linters/setup-tflint@v6.3.0` não foram checados individualmente contra a mesma fonte — ficam como pendência menor.

---

## Achados NÃO verificados nesta rodada (ficam para a sessão de remediação verificar ao tocar no código)

- 4.5 em profundidade (se o fluxo de update de `postCounters.ts`/transação já teria alguma proteção parcial contra concorrência que o relatório não visse) — não lido a fundo, só confirmada a ausência de campo de versão.
- Itens 3.x (pontos fortes) — aceitos como descritos, não há motivo prático para re-auditar elogios antes de uma sessão de correção.
- `postScheduler`, `getPost`, `imageProcessor` e demais Lambdas não mencionadas no relatório original — não escaneadas linha a linha; só `getPosts` foi olhada de relance (confirma padrão correto de parse de `nextToken`).

---

## Conclusão

O relatório original é **factualmente sólido** — nenhum achado se mostrou falso ou fabricado. Onde há diferença, é sempre na direção de **o problema real ser um pouco maior** do que o texto sugeria (mais Lambdas afetadas, mais controles de segurança fora do gate, uma combinação de CORS que existe de fato no código e não só em tese). Isso reforça, não enfraquece, o plano de ação do relatório original — a remediação agendada deve tratar os "Achados confirmados e piores" acima como escopo adicional dentro dos mesmos itens P0/P1/P2 já definidos (ex.: P0.2 deve cobrir `adminAuthors`/`adminCategories` além de `adminPosts`; 4.7/P1.4 deve cobrir `mediaUpload` além de `adminSession`).
