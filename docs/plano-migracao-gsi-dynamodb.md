# Plano de Migração — GSI de Baixa Cardinalidade (DynamoDB)

> Status: **✅ CONCLUÍDA e validada em dev (2026-06-28, sessão 52).** Ambiente: dev (downtime aceitável, confirmado por Marcelo).
> Achado original: `docs/auditoria-engenharia/07-performance-e-escalabilidade.md`, item 2.
> Esta migração também alimenta o post `postagens/auditoria-engenharia-ia/16-standalone-dynamodb-gsi-partition-key-design.md`.

## Resultado final (execução real)

Todas as 3 fases do plano abaixo foram executadas e validadas contra o ambiente dev real, sem desvio do desenho original:

| Fase | Commit | Validação |
|---|---|---|
| 1 — backup + backfill + novas GSIs | `edb88e5` | Backup completo (14 itens) salvo em `scripts/backups/` (gitignored). Backfill via `scripts/backfill-gsi-markers.mjs` (`--dry-run` depois real): 10× `e_popular_marker`, 14× `e_projeto_marker`, zero erros. `terraform plan`: 2 attribute + 2 GSI adicionados, zero destruição. |
| 2 — backend troca de GSI | `3946d73` | `getPosts`/`adminPosts` migrados para `PopularesPorData_v2`/`ProjetoPorData_v2`. 120/120 testes, lint e `tsc` limpos. Smoke test real contra a API de dev: `/posts/populares` retornou 10/10 itens, `/projeto` retornou 13/14 (1 post com `status=Programado`, corretamente excluído pelo filtro — não é bug). |
| 3 — remoção das GSIs antigas | `5174eb0` | `terraform plan`: 0 add, 15 change (14 são `source_code_hash` de Lambda, não relacionados), 0 destroy. Validação pós-deploy via Node SDK: GSIs antigas (`PopularesPorData`, `ProjetoPorData`) confirmadas ausentes; item count da tabela = 14 (idêntico ao backup); smoke test repetido com os mesmos resultados (10/13). |

**Achado real descoberto durante a execução** (não estava no plano original): `e_projeto = 1` em **100% dos 14 posts** — o pior caso possível de hot partition, toda a tabela concentrada numa única partição lógica. Ilustra o problema de forma mais contundente do que qualquer exemplo hipotético — vale destacar isso no post.

**Lições da execução real, não previstas no plano:**
- AWS CLI no Windows corrompeu o JSON do backup (encoding de caracteres acentuados em `conteudo_html`) — resolvido usando AWS SDK direto via Node em todos os scripts (`scripts/backup-posts-table.mjs`, `scripts/backfill-gsi-markers.mjs`).
- `terraform apply` é responsabilidade exclusiva do pipeline CD (push → `cd.yml`), nunca rodado localmente — isso adicionou 2 ciclos de espera de pipeline (~5-20min cada) ao tempo total.
- Pipeline falhou 2x antes de aplicar a fase 1: uma regressão real de segurança no sanitizer (iframe XSS, ver `a8cf101`) e cota de armazenamento do GitHub Actions esgotada (resolvido tornando o repositório público, após confirmar zero segredos commitados).

## 1. O problema, em concreto

Tabela `marcelo-goncalves-blog-dev-posts` (atualmente **14 itens**) tem 5 GSIs. Duas usam um atributo `Number` restrito a `0`/`1` como **partition key**:

| GSI | hash_key | Valores possíveis | Usado por |
|---|---|---|---|
| `PopularesPorData` | `e_popular` | `0` ou `1` | `getPosts/index.ts:135` (seção "Populares") |
| `ProjetoPorData` | `e_projeto` | `0` ou `1` | `getPosts/index.ts:59` (`/o-projeto`) |

Uma partition key com cardinalidade 2 significa que o índice **nunca distribui dados além de 2 partições físicas**, não importa quanto throughput a conta tenha disponível. Com 14 itens isso não importa. Com volume real (centenas/milhares de posts), toda escrita marcada `e_popular=1` ou `e_projeto=1` concorre pelo mesmo hash de partição — throttling de `ProvisionedThroughputExceededException` em modo `PAY_PER_REQUEST` se o tráfego de leitura/escrita nessa partição específica exceder os limites adaptativos da AWS (atualmente ~3000 RCU / 1000 WCU por partição).

As outras 3 GSIs (`StatusPorData`, `CategoriaPorData`, `StatusProgramadoPorData`) não entram nesta migração — `status` e `categoria_slug` têm cardinalidade maior (3+ valores de status; N categorias) e crescem com o catálogo de conteúdo, não ficam travadas em 2.

## 2. Por que ainda não quebrou (e por que isso não tranquiliza)

Com 14 posts, ~7 caem em cada valor de `e_popular`/`e_projeto`. DynamoDB infla automaticamente a capacidade de partições pequenas via *adaptive capacity* — o problema é estrutural, não visível em métricas até o volume crescer. Não há alarme hoje que detectaria isso (`docs/observability-slo.md` cobre erros 5xx e burn-rate, não distribuição de partição).

## 3. Decisão de design: novo atributo, não nova tabela

**Opção escolhida:** manter a tabela `posts`, adicionar um novo atributo de alta cardinalidade nas duas GSIs problemáticas, recriá-las.

**Atributo proposto:** `slug` (já existe, é a hash_key primária, cardinalidade = N posts) combinado com o booleano original via **sparse index pattern**:

- Em vez de `hash_key = e_popular` (0/1), usar `hash_key = e_popular_marker` — um atributo string que só existe no item quando `e_popular = 1` (ex: valor fixo `"POP"`), e a **sort key** continua `data_atualizacao`.
- Isso transforma a GSI num **sparse index**: só itens com `e_popular=1` aparecem nela (o atributo simplesmente não existe nos demais, e DynamoDB omite itens sem o atributo da GSI automaticamente). Itens "populares" ainda concorrem pela mesma partição lógica (`"POP"`), MAS o volume de itens com `e_popular=1` tende a ser uma fração pequena e estável do catálogo (curadoria editorial, não todo post) — o que já é um padrão aceitável em DynamoDB para "listas curadas" pequenas, diferente de uma partição recebendo 50% do tráfego de escrita de toda a tabela.

**Por que não usar `slug` puro como hash_key:** isso eliminaria o GSI inteiro (viraria uma Query por item único, sem sentido — você já tem `GetItem` na tabela base pra isso). O propósito do índice é agrupar "todos os populares" — precisa manter um agrupamento, só não pode ser literalmente `0`/`1` sozinho.

**Alternativa descartada:** prefixo aleatório (write-sharding clássico, ex: `e_popular#<hash(slug) % N>`). Mais "correto" em teoria para altíssima escala, mas exige fan-out de N queries paralelas na leitura para reagregar — overhead de código desproporcional para um blog com curadoria editorial pequena (populares/projeto são *flags raros*, não um campo com distribuição 50/50 real esperada em produção). O padrão sparse index resolve o problema real (hash 0/1 viciado) sem essa complexidade.

## 4. Mudanças necessárias, por camada

### 4.1 Terraform (`infra/modules/dynamodb/main.tf`)
- Novos atributos: `e_popular_marker` (S), `e_projeto_marker` (S) — sparse, só setados quando o respectivo booleano é `1`.
- GSIs `PopularesPorData`/`ProjetoPorData`: `hash_key` trocado de `e_popular`/`e_projeto` (N) para `e_popular_marker`/`e_projeto_marker` (S).
- **DynamoDB não permite alterar `hash_key` de uma GSI existente in-place** — Terraform vai propor `destroy + create` da GSI (não da tabela inteira). Isso é seguro: GSIs são reconstruídas pela AWS a partir dos dados da tabela base automaticamente, sem exigir migração manual de dados *para a GSI em si*. O que exige nosso cuidado é popular o novo atributo `_marker` nos itens existentes ANTES de recriar a GSI (senão a GSI nasce vazia).

### 4.2 Backend
- `backend/src/common/types.ts`: manter `e_popular`/`e_projeto` como estão (não mudam de schema na tabela base — são só os campos de UI/lógica de negócio). Adicionar os campos derivados `e_popular_marker?`/`e_projeto_marker?` só na camada de persistência.
- `backend/src/functions/adminPosts/index.ts` (`savePost`/`updatePost`): ao salvar, se `e_popular === 1`, setar `e_popular_marker = "POP"`; se `e_popular === 0`, **remover** o atributo (`REMOVE` no UpdateExpression, não setar `""`/`0` — sparse index exige ausência do atributo, não um valor vazio). Mesma lógica para `e_projeto_marker = "PROJ"`.
- `backend/src/functions/getPosts/index.ts`: trocar `KeyConditionExpression: "e_popular = :popular"` por `"e_popular_marker = :marker"` (valor fixo `"POP"`), idem para `e_projeto`.
- Testes (`getPosts/index.test.ts`, `adminPosts/index.test.ts`): atualizar mocks que hoje fixam `e_popular: 0 | 1` nos itens de teste.

### 4.3 Admin
- Nenhuma mudança visível ao usuário — `e_popular`/`e_projeto` continuam sendo o toggle 0/1 na UI (`admin/src/views/EditorView.vue`). O marker é interno, gerado pelo backend ao salvar.

### 4.4 Dados existentes (migração)
- 14 posts atuais precisam de backfill do atributo `_marker` ANTES da GSI nova existir (script único, não recorrente).

## 5. Passo a passo da migração (dev, downtime aceito)

1. **Backup/Export** — `aws dynamodb export-table-to-point-in-time` (ou simplesmente um `scan` completo salvo em JSON local, dado que são só 14 itens — export formal é overkill nesse volume, mas vale documentar a ferramenta certa para quando o volume crescer).
2. **Script de backfill** (`scripts/backfill-gsi-markers.mjs`, mesmo padrão de `scripts/backfill-lqip.mjs`): `Scan` na tabela, para cada item com `e_popular=1` → `UpdateItem SET e_popular_marker = "POP"`; idem `e_projeto`. Roda em modo `--dry-run` primeiro.
3. **Terraform apply (fase 1)** — adicionar os atributos + as 2 novas GSIs (`PopularesPorData_v2`/`ProjetoPorData_v2`, nomes novos para rodar em paralelo com as antigas, zero downtime de leitura).
4. **Validar** — Query manual via AWS CLI nas GSIs novas, comparar contagem de itens retornados com a contagem esperada (quantos posts têm `e_popular=1` hoje, via scan).
5. **Atualizar código backend** (`getPosts`, `adminPosts`) para usar as GSIs novas + lógica de marker.
6. **Deploy backend** (CD pipeline normal, branch `develop`).
7. **Smoke test** — endpoints reais (`/artigos` seção populares, `/o-projeto`) retornando os mesmos posts de antes.
8. **Terraform apply (fase 2)** — remover as GSIs antigas (`PopularesPorData`/`ProjetoPorData`) e os atributos `e_popular`/`e_projeto` da definição de atributos da tabela (o campo em si continua existindo nos itens via DynamoDB schemaless — só para de ser declarado como `attribute` do Terraform, que só é necessário para chaves de índice).
9. **Validação final** — zero erros em CloudWatch, contagem de itens idêntica antes/depois (`scan --select COUNT`).

## 6. Critério de "zero perda de dados"

- Contagem de itens da tabela base (`scan --select COUNT`) idêntica antes e depois em todas as fases (a tabela base nunca é recriada, só as GSIs).
- Contagem de itens retornados pela query "populares" e "projeto" idêntica antes/depois (comparar contra o scan manual de quantos itens têm `e_popular=1`/`e_projeto=1`).
- Spot-check de 3 posts aleatórios: `conteudo_html`, `titulo`, `slug` idênticos via `GetItem` direto antes/depois (a tabela base não é tocada, mas validar mesmo assim por rigor, já que isso vira conteúdo de post técnico).

## 7. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Backfill incompleto (item escapa do marker) | Script roda `--dry-run` primeiro, conta itens esperados vs. atualizados, falha alto-e-claro se não bater |
| GSI nova fica inconsistente por alguns segundos após `UpdateItem` (replicação assíncrona de GSI é eventual, não síncrona) | Aguardar ~5-10s após backfill antes de validar queries na GSI nova |
| Esquecer de tratar `e_popular_marker` ausente como "falsy" no front/admin | Não é necessário — admin/frontend nunca leem o marker, só o backend o gera/consulta internamente |
| Terraform tentar destruir a GSI antiga antes da nova estar validada | Plano em 2 fases explícitas (seção 5) evita isso — fase 1 só adiciona, fase 2 (remoção) só roda depois do deploy de código + smoke test |

## 8. Estimativa de esforço

| Etapa | Tempo estimado |
|---|---|
| Script de backfill + dry-run | 30min |
| Terraform fase 1 (novas GSIs) + validate/plan | 30min |
| Mudança de código backend (2 Lambdas + testes) | 45min |
| Deploy + smoke test | 20min |
| Terraform fase 2 (remoção das antigas) + validate/plan | 20min |
| Validação final + documentação do resultado | 15min |
| **Total** | **~2h40min** |

(Escrita do post separadamente — não contabilizada aqui, é trabalho de conteúdo, não de engenharia.)

## 9. O que NÃO está nesta migração

- `StatusPorData`, `CategoriaPorData`, `StatusProgramadoPorData` — cardinalidade aceitável, fora de escopo.
- `projection_type = "ALL"` em todas as GSIs (achado #3 da auditoria, duplica `conteudo_html`) — problema relacionado mas independente; resolver junto encareceria/atrasaria esta migração sem necessidade.
- `searchPosts` full table scan (achado #1, maior risco real) — tratado em iniciativa separada (OpenSearch/Algolia), não é sobre GSI design.
