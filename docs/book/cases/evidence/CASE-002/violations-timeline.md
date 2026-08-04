# Linha do tempo, violações e casos de conformidade — CASE-002

Método: descoberta via `git log --oneline --all -i --grep`, `git log -S/-G`, `git show`, e uma varredura por regex (triagem, não prova) em `git log -p` no intervalo `2026-07-29 04:36:46`..`2026-08-04 08:47:10` sobre `*.ts *.tsx *.vue *.js *.mjs *.jsx *.tf *.css`, seguida de inspeção manual de cada ocorrência candidata (ver corpo do caso para os falsos positivos descartados nessa inspeção). Não há garantia de exaustividade — ver Limitações no corpo do caso.

## 1. Linha do tempo da regra

| Data | Commit | Arquivo | Evento | Redação resumida | Status |
|---|---|---|---|---|---|
| 2026-07-29 04:18:51 | `3824ddd1` | `CLAUDE.md` | Formalização (nomenclatura) | "código = inglês, dado/conteúdo/URL = português"; nomenclatura sem migração retroativa | superseded (conteúdo atual reformulado na refatoração de 2026-08-04, mesmo princípio) |
| 2026-07-29 04:36:46 | `eed6938b` | `CLAUDE.md` | Formalização (comentários) — **marco usado nesta análise** | "Comentário novo (ou editado) deve explicar por que... nunca o que"; comentários existentes (~730, self-reported) explicitamente NÃO migrados de imediato, sessão dedicada planejada | superseded (mesmo princípio, hoje em `docs/engineering/standards/code-conventions.md`) |
| 2026-07-31 13:54:41 | `b41123bb` | `infra/modules/lambda/lambda-iam.tf`, `infra/providers.tf` | Violação (não corrigida individualmente) | Comentários novos em português adicionados 2 dias após o marco | corrigido só em `2312e2a` (6 dias depois) |
| 2026-07-31 14:24:23 | `0cbe6b57` | `infra/modules/api-gateway/main.tf` | Violação (lote grande, não corrigida individualmente) | ~7 comentários novos em português numa refatoração de `for_each` | corrigido só em `2312e2a` |
| 2026-08-01 19:38:49 | `0cc296cc` | 9 specs E2E (`categoria`, `busca`, `sobre`, `projeto`, `visual-audit/*`) | Violação (lote grande, não corrigida individualmente) | Reescrita de specs E2E com comentários novos em português | corrigido só em `2312e2a` (3 dias depois) |
| 2026-08-02 13:36:45 | `39549ca9` | `frontend/scripts/create-test-post.mjs` | Violação | ~14 comentários novos em português explicando bugs de seletor do editor | **corrigido em 10 minutos** por `b70499e` |
| 2026-08-02 13:46:15 | `b70499e` | `create-test-post.mjs`, 3 specs E2E | Correção (autocorreção na mesma sessão) | Commit message cita a causa explicitamente: "matching the surrounding file instead of the project rule" | resolvido |
| 2026-08-02 16:21:38 | `81f4ed8c` | `infra/modules/api-gateway/main.tf`, `infra/providers.tf` | Violação (não corrigida individualmente) | Comentários novos em português sobre CORS e versão do Terraform | corrigido só em `2312e2a` |
| 2026-08-02 16:37:49 | `e4f7f293` | `infra/providers.tf` | Violação (não corrigida individualmente) | Comentário novo em português sobre o pin de versão do Terraform CLI | corrigido só em `2312e2a` |
| 2026-08-02 16:56:39 | `1d2b086f` | `infra/**/*.tf` (múltiplos) | Correção parcial (só infra) | "translate Portuguese code comments to English, enforce why-not-what" — sweep dedicado, mas só do módulo `infra/` | resolvido parcialmente (só infra; frontend/admin/backend ficaram pendentes) |
| 2026-08-03 06:50:52 | `409e73e5` | `.github/workflows/*.yml` | Correção parcial (só workflows) | Tradução de workflows CI/CD PT→EN | resolvido parcialmente (escopo: workflows) |
| 2026-08-04 08:47:10 | `2312e2a4` | 209 arquivos (todo o repo) | Correção final (sweep completo) | "translate and normalize code comments across the codebase" — ~700 comentários avaliados, tradução + remoção de travessão + enforcement why-not-what | resolvido (pendente de validação de recorrência na revisão de 30 dias) |
| 2026-08-04 08:53:42 | `060412fa` | 9 arquivos Terraform | Correção complementar | Remoção de travessão de `description`/`alarm_description` (não são comentários `#`, mas texto de documentação análogo) | resolvido |

**Marco usado na análise quantitativa**: `eed6938b` (2026-07-29 04:36:46), por ser a formalização explícita e específica sobre comentários (distinta da regra de nomenclatura geral em `3824ddd1`, 18 minutos antes, que trata de identificadores, não de comentários). Isso é uma escolha registrada, não a única defensável — `3824ddd1` também poderia ser usado como marco mais amplo, o que estenderia a janela de análise em 18 minutos sem mudar nenhum resultado (nenhum commit ocorreu nesse intervalo).

## 2. Violações confirmadas (amostra, não exaustiva)

| ID | Data | Commit | Arquivo | Comentário resumido (paráfrase) | Arquivo já tinha PT? | PT próximo? | Corrigido? | Evidência de participação da IA | Confiança |
|---|---|---|---|---|---|---|---|---|---|
| V1 | 2026-07-31 | `b41123bb` | `infra/modules/lambda/lambda-iam.tf` | "role é idêntica entre elas, por isso é a única..." | Sim (arquivo Terraform, legado majoritariamente PT) | Sim | Só no sweep de `2312e2a` (4 dias depois) | Nenhum trailer `Co-Authored-By` neste commit especificamente — não permite afirmar nem negar participação | baixa (autoria da linha) / alta (violação em si, texto literal) |
| V2 | 2026-07-31 | `0cbe6b57` | `infra/modules/api-gateway/main.tf` | ~7 comentários sobre `for_each`/CORS/mapeamento de recursos | Sim | Sim | Só no sweep de `2312e2a` | Sem trailer neste commit | baixa / alta |
| V3 | 2026-08-01 | `0cc296cc` | 9 specs E2E | Comentários explicando cenários de teste (busca, categoria, sobre, projeto, visual-audit) | Parcial — specs novos/reescritos, mas o projeto já tinha muitos comentários PT em outros arquivos de teste | Sim (specs vizinhos) | Só no sweep de `2312e2a` (3 dias depois) | `Co-Authored-By: Claude Sonnet 5` presente neste commit | média (coautoria não prova autoria da linha específica) / alta |
| V4 | 2026-08-02 13:36 | `39549ca9` | `create-test-post.mjs` | ~14 comentários explicando bugs de seletor (callout isolating node, digitação char-a-char) | Sim, arquivo já tinha comentários PT extensos antes desta sessão | Sim, imediatamente adjacentes | **Sim, em 10 minutos** (`b70499e`) | `Co-Authored-By: Claude Sonnet 5`; mensagem de `b70499e` afirma explicitamente "the comments I added" (primeira pessoa de Marcelo revisando o próprio trabalho da sessão) | alta (correção confirma a violação e a atribuição, na própria mensagem do commit corretor) |
| V5 | 2026-08-02 16:21 | `81f4ed8c` | `infra/api-gateway/main.tf`, `providers.tf` | Comentários sobre CORS default e versão do Terraform | Sim | Sim | Só no sweep de `2312e2a` (2 dias depois) | `Co-Authored-By` presente | média / alta |
| V6 | 2026-08-02 16:37 | `e4f7f293` | `infra/providers.tf` | Comentário sobre correção de pin de versão | Sim | Sim | Só no sweep de `2312e2a` | `Co-Authored-By` presente | média / alta |

Todas as 6 violações da amostra ocorreram em arquivos que **já tinham comentários em português antes da regra** (infra `.tf` e specs E2E) — nenhuma violação candidata foi encontrada em arquivo genuinamente novo, sem contexto local em português. Isso é a evidência mais direta a favor da hipótese central, dentro dos limites desta amostra (ver seção "Matriz de evidência causal" no corpo do caso).

## 3. Casos de conformidade (amostra)

| Data | Commit | Arquivo | Situação | Fator contextual relevante |
|---|---|---|---|---|
| 2026-08-02 16:56 | `1d2b086f` | `infra/**/*.tf` | Comentários traduzidos para inglês num sweep dedicado | Sessão explicitamente dedicada a corrigir idioma — instrução direta e imediata no prompt da tarefa, não regra de fundo competindo com padrão local |
| 2026-08-02 13:46 | `b70499e` | `create-test-post.mjs`, specs E2E | Comentários recém-adicionados traduzidos para inglês minutos depois | Mesma sessão de V4 — o autor (Marcelo, revisando/corrigindo) identificou a própria violação da IA rapidamente, sem precisar de ferramenta automatizada |
| 2026-08-04 08:47 | `2312e2a4` | 209 arquivos | Sweep completo, incluindo os 6 arquivos de V1-V6 | Sessão dedicada e extensa (~19 agentes em paralelo por lote, 2 passes de verificação — ver `.project-context.md`, sessão 72) — mostra que a correção em escala exigiu orquestração deliberada, não aconteceu incrementalmente |

Nenhum caso de conformidade "espontânea" foi encontrado — isto é, nenhuma violação em arquivo com PT legado foi corrigida por iniciativa não solicitada da IA no mesmo commit em que apareceu, exceto pela participação humana em V4/`b70499e`. Isso é uma limitação real da amostra: não é possível afirmar que a IA nunca se autocorrigiu sem revisão humana, só que não foi encontrado nenhum caso assim nesta amostra.

## 4. Distribuição (amostra, não contagem exaustiva)

- Commits candidatos identificados no intervalo (2026-07-29 04:36 a 2026-08-04 08:47): **9** commits com adição de comentário novo em português em código (V1-V6 acima, mais `39549ca9`≡V4 já contado, e os 2 sweeps parciais não contam como violação).
- Falsos positivos descartados na inspeção manual: **3** — um comentário em inglês citando nomes próprios em português entre parênteses (`PillarCard.tsx`, "Automação, IA, Sistemas..."), um comentário em inglês pós-correção capturado pelo regex por acidente (`e2e/projeto.spec.ts`, dentro do próprio commit de correção `9c03689`), e um comentário técnico com termo de domínio em português dentro de frase em inglês (`categorias.ts`).
- Violações em arquivo com PT legado: **6 de 6** na amostra (100%) — mas a amostra não inclui todo o histórico, e o método de descoberta (regex sobre diff) tende a favorecer justamente arquivos com muito texto em português ao redor (mais chance de um trecho do diff conter uma palavra do dicionário de triagem). Este viés de amostragem é reconhecido como limitação.
- Violações corrigidas individualmente (mesma sessão ou próxima): **1 de 6** (`39549ca9`/V4, via `b70499e`).
- Violações corrigidas só no sweep final (`2312e2a`, até 6 dias depois): **5 de 6** (V1, V2, V3, V5, V6).
- Reincidência após correção: **nenhuma encontrada** nos arquivos de V1-V6 entre `2312e2a` e o estado atual do repositório (verificado por leitura direta dos arquivos hoje).
