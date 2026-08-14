# Plans

Planejamentos de postagem (pauta/outline), um arquivo por post candidato, gerados pela skill `post-planning`.

## Organização

Cronológica, por data de criação: `YYYY/MM/YYYY-MM-DD-<slug>.md`. O status do planejamento vive no front matter (`status`), não na pasta — um plano não é movido entre pastas quando muda de status.

Estrutura a partir de `templates/post-plan-template.md`.

## Status permitidos

```text
idea, researching, planned, drafting, ready, scheduled, published, cancelled, archived
```

## Regra de autoridade

Ver `../README.md`. Resumo: o arquivo aqui é a fonte canônica do planejamento; o CMS é a fonte canônica do conteúdo publicado. Depois de `published`, o campo `canonical_content` do front matter aponta para a fonte real — o arquivo não é reescrito para replicar o texto final.

## Segurança

Antes de publicar (versionar) um planejamento neste repositório público, revisar: credenciais, dados pessoais, nomes de clientes, informações internas confidenciais, conteúdo protegido. Marcar `contains_sensitive_content: true` quando aplicável e não commitar sem sanitização.

## Índice de arquivos migrados (nome antigo → destino atual)

Os 26 arquivos abaixo vieram de `projects/publishing-content/postagens/` em 2026-08-04 (work item `docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md`). O guia da série logo adiante usa os nomes antigos (`01-...`, `02-...`) — esta tabela resolve para o caminho real.

| Nome antigo | Caminho atual |
|---|---|
| `01-post-ancora-ia-staff-engineer.md` | `2026/06/2026-06-27-post-ancora-ia-staff-engineer.md` |
| `02-criterio-arquitetura-e-design.md` | `2026/06/2026-06-27-criterio-arquitetura-e-design.md` |
| `03-criterio-qualidade-de-codigo.md` | `2026/06/2026-06-30-criterio-qualidade-de-codigo.md` |
| `04-criterio-cobertura-e-testes.md` | `2026/06/2026-06-30-criterio-cobertura-e-testes.md` |
| `05-criterio-cicd-e-engenharia-de-repositorio.md` | `2026/06/2026-06-30-criterio-cicd-e-engenharia-de-repositorio.md` |
| `06-criterio-seguranca.md` | `2026/06/2026-06-30-criterio-seguranca.md` |
| `07-criterio-observabilidade.md` | `2026/06/2026-06-30-criterio-observabilidade.md` |
| `08-criterio-performance-e-escalabilidade.md` | `2026/06/2026-06-30-criterio-performance-e-escalabilidade.md` |
| `09-criterio-infraestrutura-como-codigo.md` | `2026/06/2026-06-30-criterio-infraestrutura-como-codigo.md` |
| `10-criterio-gestao-de-dependencias.md` | `2026/06/2026-06-30-criterio-gestao-de-dependencias.md` |
| `11-standalone-x-frame-options-meta-tag.md` | `2026/06/2026-06-27-standalone-x-frame-options-meta-tag.md` |
| `12-standalone-pipeline-vermelho-automacao-teatro.md` | `2026/06/2026-06-27-standalone-pipeline-vermelho-automacao-teatro.md` |
| `13-criterio-documentacao-e-governanca.md` | `2026/06/2026-06-30-criterio-documentacao-e-governanca.md` |
| `14-criterio-developer-experience.md` | `2026/06/2026-06-30-criterio-developer-experience.md` |
| `15-criterio-custo-finops.md` | `2026/06/2026-06-30-criterio-custo-finops.md` |
| `16-standalone-dynamodb-gsi-partition-key-design.md` | `2026/06/2026-06-30-standalone-dynamodb-gsi-partition-key-design.md` |
| `17-standalone-ledger-de-tradeoffs-escolha-de-servico.md` | `2026/06/2026-06-30-standalone-ledger-de-tradeoffs-escolha-de-servico.md` |
| `18-standalone-auditoria-appsec-ia-staff-engineer.md` | `2026/06/2026-06-30-standalone-auditoria-appsec-ia-staff-engineer.md` |
| `19-standalone-auditoria-performance-ia-staff-engineer.md` | `2026/06/2026-06-30-standalone-auditoria-performance-ia-staff-engineer.md` |
| `20-standalone-css-modules-vs-css-global.md` | `2026/06/2026-06-30-standalone-css-modules-vs-css-global.md` |
| `21-standalone-validacao-e-memoria-com-criterio.md` | `2026/07/2026-07-13-standalone-validacao-e-memoria-com-criterio.md` |
| `22-standalone-especificar-antes-caos-codigo-ia.md` | `2026/07/2026-07-23-standalone-especificar-antes-caos-codigo-ia.md` |
| `23-standalone-regra-dos-tres-abstracao-errada.md` | `2026/07/2026-07-24-standalone-regra-dos-tres-abstracao-errada.md` |
| `24-standalone-bff-sessao-cognito-single-user.md` | `2026/07/2026-07-24-standalone-bff-sessao-cognito-single-user.md` |
| `post-automacao-criacao-validacao-postagem.md` | `2026/06/2026-06-30-post-automacao-criacao-validacao-postagem.md` |
| `post-diagnostico-antes-de-agir-ia-guessing.md` | `2026/06/2026-06-27-post-diagnostico-antes-de-agir-ia-guessing.md` |

O README original, os 4 PDFs de referência pessoal e o capítulo de ebook citado abaixo continuam fora do repositório, em `projects/publishing-content/postagens/` (o README de lá tem uma nota apontando para cá).

---

<!-- Conteúdo abaixo migrado literalmente de projects/publishing-content/postagens/00-README-planejamento-serie.md em 2026-08-04. Referências a arquivos usam os nomes antigos da tabela acima. -->

# Planejamento da série: Auditoria de Engenharia World-Class na Prática

> Índice e guia de uso destes arquivos. Cada arquivo desta pasta é o planejamento de UMA postagem (ou do capítulo de ebook) — não o texto final. Conteúdo gerado a partir da auditoria real do blog (`marcelo-goncalves-blog/docs/auditoria-engenharia/`), sessão 2026-06-27.

## Por que esta série existe

A auditoria que fizemos no próprio blog é matéria-prima rara: é uma IA atuando como Staff Engineer, auditando um sistema real, com achados verificáveis (números, trechos de código, CVEs nomeados). A maioria do conteúdo sobre "IA + engenharia" no mercado é hype ou tutorial genérico. Esta série é prova de trabalho.

## Ordem de publicação sugerida

1. **Post-âncora** (`01-post-ancora-ia-staff-engineer.md`) — publica primeiro, sozinho. É o que vende a série e atrai tráfego/backlink para os demais.
2. **Posts standalone de maior viralidade entre devs** (publicar nas primeiras 2-3 semanas, intercalados com a série, para manter momentum):
   - `11-standalone-x-frame-options-meta-tag.md`
   - `12-standalone-pipeline-vermelho-automacao-teatro.md`
   - `16-standalone-dynamodb-gsi-partition-key-design.md` + `17-standalone-ledger-de-tradeoffs-escolha-de-servico.md` — **publicar como par**, nessa ordem (#17 antes do #16). São complementares: #17 é o panorama (4 achados do DynamoDB — billing `PAY_PER_REQUEST` acertado, paginação cursor-based, ausência de full-text search, ausência de `COUNT` agregado nativo — amarrados pela mesma causa raiz arquitetural, com os 3 padrões de resposta possíveis: aceitar/contornar/construir o agregado); #16 é o mergulho técnico profundo em apenas um desses achados (GSI de baixa cardinalidade), com walkthrough de migração real. Cada um linka o outro — ver seção "Relação com o post #16/#17" dentro de cada arquivo. #17 também linka o #19 (achado #4, contador) para quem quiser a implementação completa.
   - `18-standalone-auditoria-appsec-ia-staff-engineer.md` — publicar depois de `06-criterio-seguranca.md` (ver seção "Relação com o post #6" dentro do arquivo). Nasce de uma auditoria de AppSec **dedicada** (OWASP ASVS + API Security Top 10 + AWS Well-Architected Security Pillar), diferente da auditoria geral que originou o #6. Traz 4 achados reais (MFA/XSS encadeados, JSON-LD injection, mass assignment, upload sem limite), exemplo de prompt de auditoria reutilizável, e o achado mais atípico da série até agora: a própria IA foi bloqueada pelo ambiente de execução ao tentar aplicar uma correção de configuração do repositório (branch protection) sem aprovação humana explícita.
   - `19-standalone-auditoria-performance-ia-staff-engineer.md` — publicar depois de `07-criterio-performance-e-escalabilidade.md` (ver seção "Relação com o post #7" dentro do arquivo). Nasce de uma auditoria de performance **dedicada** (AWS Well-Architected Performance Efficiency Pillar), com a mesma estrutura do #18 mas para o domínio de performance — e a mesma disciplina central: medir com dado real (k6, CloudWatch, Lighthouse) antes de priorizar. Achado mais contraintuitivo da série: a rota apontada como maior risco pela auditoria geral (`/busca`, `Scan` completo) foi a *mais rápida* no teste de carga real, porque o anti-padrão é de escalabilidade futura, não de latência atual. Achado de maior prioridade real: LCP médio (2.74s) fora do threshold "Good" do Core Web Vitals, com causa raiz correlacionada por duas ferramentas independentes (CloudWatch + Lighthouse). Fechamento espelha o #18: a IA identificou um "fix" óbvio (remover query de `COUNT`) que, na investigação, se revelou uma decisão de produto disfarçada (apaga "Página X de Y" da paginação) — e recusou aplicar sem confirmação humana, mesmo com autorização ampla para "aplicar correções sem custo".
   - `20-standalone-css-modules-vs-css-global.md` — sem dependência de publicação de outro post, pode entrar em qualquer ponto do calendário. Nasce de uma pergunta direta do Marcelo durante uma sessão (não de uma auditoria estruturada): por que o projeto tem 177 arquivos `.css` globais e só 2 `.module.css`, sem nenhuma decisão documentada por trás da diferença. Tema: escopo de CSS garantido por convenção (prefixo manual) vs. por ferramenta (CSS Modules), e por que "o projeto vai crescer muito" não significa automaticamente "deveríamos migrar tudo agora" — a decisão final foi regra nova só pra código futuro, sem reescrever o que já funciona. Bom exemplo de post sobre processo de decisão, não sobre bug.
   - `21-standalone-validacao-e-memoria-com-criterio.md` — sem dependência de publicação de outro post, mesmo perfil do #20 (decisão de processo, não bug de código). Nasce de duas decisões formalizadas na mesma sessão: validação de frontend proporcional ao risco (parar de tirar screenshot pra toda edição pequena, medir com JS em vez de inspecionar visualmente) e critério do que vale registrar em memória de longo prazo (arquivo de contexto caiu de 455 pra 110 linhas). Gancho real: um bug de overflow horizontal (`NewsletterCTA`, `min-width:auto` num grid item) que nenhum screenshot revelou, só uma medição direta. Bom exemplo de "IA auditando os próprios hábitos de processo", ângulo ainda não coberto pela série.
   - `22-standalone-especificar-antes-caos-codigo-ia.md` — sem dependência de publicação de outro post, mas bom par temático com o #20 (mesma tensão: consistência garantida por ferramenta vs. por disciplina humana, em domínio diferente). Nasce de uma sequência real de 7 rodadas de correção de tamanho de fonte na Home (H3 de cards, parágrafos de leitura, bullets, timeline, CTA de card, links e CTAs do rodapé) — cada correção certa isoladamente, mas reveladora de uma lacuna estrutural: escala de tokens + lint sintático (Stylelint) garantem *que* um token seja usado, nunca *qual* token cabe a cada papel. Post prescritivo, não "gotcha": apresenta uma pilha de 4 camadas (vocabulário/escala → lint sintático → mapa de papel semântico documentado → teste que verifica o papel, não só o valor), com um segundo exemplo real e independente em espaçamento (`--eyebrow-gap`/`--sp-4`/`--title-gap` usados de forma divergente pro mesmo papel, ainda não corrigido no código) provando que o problema é estrutural, não peculiaridade de tipografia. Fecha com gancho pra um framework maior que o Marcelo quer formalizar depois.
   - `23-standalone-regra-dos-tres-abstracao-errada.md` — sem dependência de publicação de outro post, mesmo perfil dos #20/#21/#22 (decisão de processo/arquitetura, não bug). Nasce de uma pergunta direta do Marcelo durante a sessão de 2026-07-24: dois cards visualmente quase gêmeos (`sobre-module` em "Como Pensamos" e `op-rm-card` em "Próximas Etapas", ambos usando grid de 12 colunas com `span` variável, um copiado do outro na mesma sessão) levantaram a pergunta óbvia de unificar num componente só. Resposta apoiada em três referências (regra dos três, AHA, "a abstração errada" de Sandi Metz) e no contraponto real do próprio projeto (`FeatureCard.tsx`, extraído por reuso genuíno de papel em 2+ lugares, não por parecença visual): critério é papel semântico, não forma. Bom material de processo real: a primeira tentativa de "estilo não-linear" (só numeração P-xx/F-xx) foi corrigida de rumo pelo Marcelo antes de chegar no mosaico de verdade.
   - `24-standalone-bff-sessao-cognito-single-user.md` — sem dependência de publicação de outro post. **Atualizado em 2026-07-24 (mesmo dia): implementação completa e validada em produção (dev)**, não mais só plano — pode ser escrito de ponta a ponta. Nasce de uma auditoria "world class" mais ampla (3 agentes em paralelo) que achou o token do Cognito do admin em `localStorage` — corrigido de imediato pra `sessionStorage` (mitigação mínima). Dali, uma sequência real de perguntas na mesma sessão escala a decisão: vale ir além sendo o admin single-user? É boa prática validada por fontes de mercado (IETF, OWASP, padrão BFF, Auth0/Duende)? A resposta final foi implementar a versão mais rigorosa (sessão opaca revogável + store server-side), não a mínima (cookie com JWT direto). O material mais forte acabou sendo a depuração pós-implementação: um loop de redirect que sobreviveu a 2 correções "corretas" segundo a doc oficial da AWS (causa real era um trigger de Terraform, não a config testada), e o mesmo padrão de erro repetido em miniatura no rate limit dedicado do login (2 valores errados de `method_path` antes de entender que o modelo do recurso precisava mudar). Post irmão de tema com `18-standalone-auditoria-appsec-ia-staff-engineer.md` (mesma superfície Cognito/admin, achados diferentes).
3. **Série completa dos 12 critérios da auditoria**, na ordem do framework (cada um referencia o anterior/próximo):
   - `02-criterio-arquitetura-e-design.md`
   - `03-criterio-qualidade-de-codigo.md`
   - `04-criterio-cobertura-e-testes.md`
   - `05-criterio-cicd-e-engenharia-de-repositorio.md`
   - `06-criterio-seguranca.md`
   - `07-criterio-observabilidade.md`
   - `08-criterio-performance-e-escalabilidade.md`
   - `09-criterio-infraestrutura-como-codigo.md`
   - `10-criterio-gestao-de-dependencias.md`
   - `13-criterio-documentacao-e-governanca.md`
   - `14-criterio-developer-experience.md`
   - `15-criterio-custo-finops.md` — fecha a série, conecta de volta ao post-âncora.

A auditoria-mãe (`docs/auditoria-engenharia/01..12-*.md`) está completa — os 12 critérios foram cobertos em 2026-06-27. Nenhum planejamento de post está mais pendente por falta de achado.

## Capítulo de ebook

O capítulo de ebook derivado desta auditoria (`ebook-capitulo-contrato-para-ia.md`) **foi movido** para `postagens/ebook-content/` — pasta dedicada a consolidar todo o material de ebook do blog (este capítulo + os casos de estudo de debugging + futuros capítulos), em `projects/publishing-content/`, fora do repositório. Fora de escopo desta migração.

## Fio condutor entre os posts (não repetir, fazer referenciar)

- Todo post da série cita a auditoria-mãe e linka o post-âncora.
- Cada post de critério fecha apontando para o próximo da lista (criar senso de série, não posts soltos).
- Números reais (contagens, nomes de CVE, nomes de arquivo) são o que diferencia esta série de conteúdo genérico — nunca abstrair os exemplos em "imagine um sistema que...".
- Tom: peer técnico sênior narrando uma investigação real, não "10 dicas". Storytelling existe (abertura com tensão/cena concreta), mas sem infantilizar — sem analogias forçadas, sem emoji, sem "você já passou por isso?" genérico.

## O padrão que atravessa a série inteira (usar no fechamento do último post)

Depois dos 12 critérios, um padrão se repete com força suficiente para ser o fio condutor da série: **"desenho correto, ativação ou vigilância pendente"**. Aparece como alarme de CloudWatch desligado (critério 6), `prd.tfvars` sem as flags de produção que o próprio contrato exige (critério 8), ausência de orçamento AWS (critério 12), lint instalado mas nunca rodado em CI (critério 3/5), e até no incidente de pipeline fora do roteiro (cota de armazenamento esgotada sem alerta). Vale nomear esse padrão explicitamente no post de fechamento (`15-criterio-custo-finops.md`) e, possivelmente, revisitar essa frase no título de um post-resumo final, se a série tiver bom desempenho e justificar um "post 13: o que os 12 critérios têm em comum".

## Fonte de verdade

Toda alegação técnica destes planejamentos foi extraída de `marcelo-goncalves-blog/docs/auditoria-engenharia/0X-*.md` e da própria sessão de auditoria. Ao escrever o texto final, **validar novamente** o estado do código antes de publicar (pode ter mudado entre a auditoria e a escrita do post).

Exceção: `20-standalone-css-modules-vs-css-global.md` e `21-standalone-validacao-e-memoria-com-criterio.md` não nascem da auditoria — vêm de decisões de processo tomadas em sessões de desenvolvimento normais (regras formalizadas em `CLAUDE.md`, seções 5 e 7). Mesmo padrão de honestidade com números reais se aplica.
