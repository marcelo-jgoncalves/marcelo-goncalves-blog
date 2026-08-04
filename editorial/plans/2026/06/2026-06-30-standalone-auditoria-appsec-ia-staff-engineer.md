---
id: POST-PLAN-2026-018
title: "Pedi para a IA Auditar a Própria Segurança do Blog — e Ela Recusou Terminar o Trabalho"
created_at: 2026-06-30
updated_at: 2026-06-30
status: idea
channels: []
source_skill: post-planejamento
planned_publication:
published_at:
canonical_content:
related_case:
related_work_items: []
tags: []
contains_sensitive_content: false
---

<!-- Migrado de projects/publishing-content/postagens/18-standalone-auditoria-appsec-ia-staff-engineer.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "Pedi para a IA Auditar a Própria Segurança do Blog — e Ela Recusou Terminar o Trabalho"

## Títulos alternativos
- "Quatro Camadas de um Mesmo Descuido: Auditoria de AppSec com IA, do Achado ao Bloqueio"
- "`JSON.stringify` Não Escapa `<` — e Outras Coisas que uma Auditoria de Segurança Rasa Não Encontra"

## Tese central

Uma auditoria de segurança feita por IA não vale pelo número de achados — vale pela profundidade de cada um e pela disciplina de não aplicar a correção mais arriscada sem aprovação humana. Este post usa uma auditoria real e dedicada de AppSec (não um item dentro de uma checklist genérica, mas um exercício à parte, ancorado em OWASP ASVS, OWASP API Security Top 10 e AWS Well-Architected Security Pillar) feita no próprio blog. Quatro achados — uma conta admin sem segunda camada de defesa, um XSS armazenado no campo errado, um vazamento de tipo de dados que o TypeScript não pegou, e uma tag `<script>` que podia ser quebrada por um título de post — mostram que profundidade importa mais que cobertura. E o fechamento é o achado mais interessante de todos: a própria IA foi impedida, pelo seu ambiente de execução, de aplicar uma das correções recomendadas — porque a mudança afetava a configuração do repositório, não o código.

## Por que importa

A maior parte do conteúdo sobre "auditoria de segurança com IA" promete uma lista de vulnerabilidades geradas em segundos, como se segurança fosse uma checklist a ser riscada. Isso é raso e, pior, perigoso: incentiva o leitor a tratar "a IA já rodou um scanner" como suficiente. O valor real de uma auditoria de AppSec está em três coisas que um scanner automatizado sozinho não entrega: (1) conectar achados isolados em uma cadeia de risco real (uma conta sem MFA *importa mais* quando ela também controla um campo vulnerável a XSS), (2) ir além do nível de severidade padrão de uma ferramenta para achar o que ela esconde por configuração permissiva, e (3) saber a diferença entre "a IA pode corrigir isso" e "isso precisa de uma decisão humana" — e respeitar essa diferença mesmo quando teria as permissões técnicas para ignorá-la.

## Storytelling sugerido

Abrir pelo achado de maior impacto, do jeito que a própria auditoria o documentou: existe **uma única conta de admin** em todo o sistema, com poder de escrita total sobre o conteúdo público — e ela não tinha MFA, só login por senha. Isoladamente, risco médio. Mas a mesma auditoria, na categoria seguinte, achou que o campo `bio` do autor era salvo sem nenhuma sanitização e renderizado como HTML bruto no rodapé de todo post publicado — um stored XSS real, na superfície de maior exposição do projeto. Mostrar a frase exata que a auditoria escreveu sobre os dois se conectarem: comprometer a única conta dá ao atacante, de brinde, acesso ao XSS. Dois achados médios que juntos formam um achado crítico — esse é o primeiro ensinamento: severidade não é uma propriedade de um achado isolado, é uma propriedade da cadeia.

Segundo movimento, mais técnico e mais surpreendente: ao expandir os rulesets do Semgrep para uma cobertura mais profunda de segurança (não mais só `p/typescript`/`p/nodejs`, mas `p/owasp-top-ten`, `p/secrets`, `p/jwt`), e ao testar localmente um nível de severidade mais permissivo que o usado em produção, apareceu um achado que nenhum scan anterior tinha sinalizado: nove pontos do código embutiam dados em uma tag `<script type="application/ld+json">` usando `JSON.stringify` direto. `JSON.stringify` não escapa `<`, `>` nem `/` — um título de post contendo `</script><script>...` quebraria a tag e executaria o que vier depois. Não é um bug exótico, é um detalhe de especificação que qualquer pessoa que já tenha embutido JSON em HTML deveria saber, e que passou direto pelos scans anteriores porque eles nunca miraram ali. O ensinamento: a profundidade de uma auditoria de segurança depende inteiramente de onde você aponta a lente — e ferramentas com configuração permissiva (severidade alta, rulesets genéricos) escondem achados reais atrás da própria permissividade.

Terceiro movimento, sobre uma armadilha clássica de TypeScript: o código que salva um post espalhava o corpo inteiro da requisição num objeto tipado como `Post` usando `...data as Post` — uma asserção de tipo, não uma validação. Em tempo de execução, isso não verifica absolutamente nada; é só uma promessa que o compilador aceita e o runtime ignora. Qualquer campo extra enviado no corpo da requisição ia direto para o banco. Mostrar o antes/depois: a troca para um schema de validação (`zod`) que define exatamente quais campos existem e quais valores são aceitos, descartando silenciosamente qualquer coisa fora disso. O ensinamento: tipagem estática é uma ferramenta de desenvolvimento, não um controle de segurança — elas resolvem problemas diferentes e é fácil confundir uma pela outra.

Fechamento, o achado mais interessante por não ser sobre código: ao tentar aplicar a recomendação de configurar branch protection no repositório (a única ação do backlog que não envolvia nenhuma linha de código, "só" uma chamada de API do GitHub), o próprio ambiente de execução da IA recusou — porque era uma mudança de configuração do repositório com parâmetros escolhidos unilateralmente pelo agente, não pelo humano. A IA documentou o comando exato, pronto para rodar, e parou. Virar essa recusa do ponto fraco aparente para o ponto forte real do exercício: uma auditoria de segurança feita por IA só é confiável na medida em que a IA sabe — e respeita — onde termina o que ela pode decidir sozinha.

## Provas e exemplos reais

| Achado | Antes | Depois |
|---|---|---|
| Stored XSS via `bio` do autor | `backend/src/functions/adminAuthors/index.ts` — `bio: data.bio` direto no item persistido, renderizado depois via `dangerouslySetInnerHTML={{ __html: author.bio }}` em `PostFooter.tsx`/`AuthorBox.tsx` | `bio: sanitizePostHtml(data.bio ?? "")` — mesmo allowlist (`sanitize-html`) já usado em `conteudo_html`, só não tinha sido replicado para este campo |
| Conta única sem segunda camada de defesa | `explicit_auth_flows = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_PASSWORD_AUTH"]` — login direto user/senha habilitado mesmo sem nenhuma tela do admin precisar dele | `explicit_auth_flows = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]` — confirmado por leitura do código do admin que `signIn()` nunca usava `authFlowType` explícito; Amplify v6 já é SRP por padrão |
| JSON-LD vulnerável a quebra de tag | `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />` em 9 pontos do frontend | `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(orgJsonLd) }} />`, onde `jsonLdScript = (d) => JSON.stringify(d).replace(/</g, "\\u003c")` |
| Mass assignment em `savePost` | `const item: Post = { ...data as Post, conteudo_html: sanitizePostHtml(...), ... }` — asserção de tipo, zero validação em runtime | `const parsed = postInputSchema.safeParse(rawData); if (!parsed.success) return { statusCode: 400, ... }` — schema `zod` define exatamente os campos aceitos |
| Upload sem limite de tamanho real | `getSignedUrl(s3, new PutObjectCommand({ Bucket, Key, ContentType }))` — URL pré-assinada sem nenhuma condição de tamanho | `createPresignedPost(s3, { Bucket, Key, Conditions: [["content-length-range", 0, 10_000_000]] })` — o S3 valida e rejeita no próprio upload |
| Branch protection — achado sem código, só configuração | Tentativa de `gh api --method PUT .../branches/main/protection` executada pela IA | Bloqueada pelo ambiente de execução da IA (categoria "mudança de configuração que afeta todos os colaboradores, escolhida pelo agente") — comando documentado, aguardando o humano rodar |

## Conceitos a explicar

- **Blast radius / cadeia de achados**: por que dois achados de severidade média que se conectam (conta sem MFA + campo vulnerável a XSS) formam, juntos, um achado crítico — severidade composta, não soma simples.
- **`JSON.stringify` e a quebra de tag `<script>`**: por que serialização de JSON não tem motivo para escapar `<`/`>`/`/` (não faz parte da gramática JSON), e por que isso se torna perigoso só no momento em que o resultado é embutido dentro de HTML.
- **Asserção de tipo (`as Post`) vs. validação em runtime**: TypeScript é apagado na compilação — `as` não gera nenhum código de verificação, é só uma instrução para o compilador parar de reclamar.
- **Presigned PUT vs. presigned POST no S3**: por que só a segunda forma aceita `Conditions` (incluindo `content-length-range`) — a primeira é uma URL com permissão de escrita sem nenhuma restrição adicional possível.
- **Por que threshold de severidade de uma ferramenta de scan pode esconder achados reais**: rodar em `--severity ERROR` é uma escolha de quanto ruído tolerar, não uma garantia de que `WARNING` não importa.

## Ferramentas gratuitas para identificar cada achado (sem esperar uma auditoria)

Cada um dos quatro achados do storytelling tem uma ferramenta gratuita (a maioria open-source) que o teria pego sem depender de uma auditoria manual — útil para o leitor que quer aplicar isso no próprio projeto, não só ler sobre o nosso:

| Achado | Ferramenta gratuita | O que ela detecta |
|---|---|---|
| Conta admin sem MFA / auth flow fraco no Cognito | **Pacu** (open-source, Rhino Security Labs) tem módulos específicos para enumerar configuração fraca de Cognito User Pools; ou simplesmente `aws cognito-idp describe-user-pool` (CLI, sem custo) para checar `MfaConfiguration` e `ExplicitAuthFlows` direto | Configuração de MFA e fluxos de autenticação habilitados num User Pool, sem precisar de scanner externo |
| Stored XSS via `bio` sem sanitização | **Semgrep** (free/OSS, já usado no projeto) com a regra `javascript.react.security.audit.react-dangerouslysetinnerhtml`; **CodeQL** (gratuito em repositórios públicos no GitHub) faz taint analysis e rastreia se o dado chega a esse sink sem passar por sanitização; **OWASP ZAP** (free) injeta payloads de XSS automaticamente em scan dinâmico | Todo uso de `dangerouslySetInnerHTML`/`v-html` (Semgrep), o caminho do dado da entrada até o sink sem sanitização (CodeQL), ou a reflexão real do payload em runtime (ZAP) |
| JSON-LD vulnerável a quebra de tag (`JSON.stringify` sem escapar `<`) | O mesmo **Semgrep**, mas só aparece com rulesets de segurança expandidos (`p/owasp-top-ten`) rodando num nível de severidade mais permissivo que `ERROR` — foi exatamente assim que este achado surgiu na auditoria real, não com a configuração que já estava em produção | Por que o achado ficou invisível: não é falta de ferramenta, é configuração permissiva (severidade alta, ruleset genérico) escondendo o que ela já seria capaz de ver |
| Mass assignment (`as Post` sem validação em runtime) | **zod/joi/yup** não são scanners — são a ferramenta que previne o problema na origem, não que o detecta depois; para detectar o padrão já existente, **CodeQL** rastreia dado de input do usuário chegando a uma escrita no banco sem passar por validação | A ausência de uma camada de validação entre o corpo da requisição e a persistência |

(As três primeiras linhas vêm direto dos módulos de ferramentas já documentados em `estudos/02-autenticacao-sessao-mfa.md`, `estudos/03-validacao-entrada-xss-mass-assignment.md` e `estudos/07-cicd-supply-chain-security.md` — manter citação consistente com esses arquivos se o post linkar para eles.)

Vale mencionar também, para o achado de fechamento (branch protection bloqueado pelo ambiente de execução): **OpenSSF Scorecard** (free) gera uma nota objetiva de "saúde de supply chain" do repositório — branch protection é um dos itens que ele cobre automaticamente, então o leitor não precisa esperar uma auditoria manual achar isso.

## Implementação real — regra/configuração exata e como cada achado foi resolvido

Detalhe que vale citar no post para sair do "o que" e mostrar o "como", com o trecho real de configuração ou código por trás de cada correção:

**1. Conta admin sem MFA / login direto por senha — `infra/modules/cognito/main.tf`**
- Política de senha endurecida como controle compensatório à ausência de MFA (ASVS V2.1.1): `password_policy { minimum_length = 12, require_lowercase = true, require_numbers = true, require_symbols = true, require_uppercase = true }`.
- `explicit_auth_flows` reduzido de `["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_PASSWORD_AUTH"]` para só `["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]` — a remoção só foi segura porque o código do admin (`auth.ts`) foi lido antes: `signIn()` nunca passava `authFlowType` explícito, e o Amplify v6 já usa SRP como default, então nada quebrou.
- MFA propriamente dito **não foi habilitado nesta rodada** — decisão explícita do Marcelo, não esquecimento. Importante deixar essa distinção clara no post (ver seção "Estratégia de correção", item 5).

**2. Stored XSS via `bio` — `backend/src/functions/adminAuthors/index.ts:72`**
- Antes: `bio: data.bio` direto no item persistido.
- Depois: `bio: sanitizePostHtml(data.bio ?? "")` — reaproveita a mesma função já usada para `conteudo_html`, com allowlist definida em `backend/src/common/sanitizer.ts` (`sanitize-html`): tags permitidas (`h1`-`h6`, `p`, `a`, `img`, `iframe`, etc.), atributos permitidos por tag, `allowedSchemes: ["http", "https", "mailto"]`, e `allowedIframeHostnames` restrito a domínios do YouTube (sem isso, `iframe` na allowlist de tags permitiria `<iframe src="qualquer-coisa.html">`).
- Achado confirmado rodando o Semgrep localmente com `--severity WARNING` em vez do `ERROR` usado em produção — o ruleset `p/owasp-top-ten` já tinha a regra, só não estava configurado para reportar nesse nível.

**3. JSON-LD vulnerável a quebra de tag — novo arquivo `frontend/lib/json-ld.ts`**
- Função inteira: `export function jsonLdScript(data: unknown): string { return JSON.stringify(data).replace(/</g, "\\u003c"); }` — escapa só o `<` (suficiente para impedir o fechamento de `</script>`, sem alterar a semântica do JSON-LD).
- Substituído nas 9 ocorrências de `JSON.stringify(x)` dentro de `dangerouslySetInnerHTML` no projeto: `layout.tsx`, `post/[slug]/page.tsx` (×2), `categoria/[slug]/page.tsx`, `artigos/page.tsx`, `sobre/page.tsx`, `servicos/page.tsx`, `o-projeto/page.tsx`.
- Mesma origem do achado #2: apareceu ao rodar `--severity WARNING` localmente, não fazia parte da auditoria original — foi um achado descoberto *durante a correção* de outro achado, não previsto no escopo.

**4. Mass assignment em `savePost` — novo arquivo `backend/src/common/postSchema.ts`**
- Schema `zod` com `.strip()`: `z.object({ slug: z.string().min(1), titulo: z.string().min(1), conteudo_html: z.string().optional(), ..., e_popular: z.union([z.literal(0), z.literal(1)]).optional(), e_projeto: z.union([z.literal(0), z.literal(1)]).optional() }).strip()` — define exatamente os campos aceitos, espelhando `types.ts`; `.strip()` descarta silenciosamente qualquer campo fora da lista (não rejeita a requisição inteira por um campo extra, só ignora o campo).
- Handler trocou `{ ...data as Post }` por `const parsed = postInputSchema.safeParse(rawData); if (!parsed.success) return { statusCode: 400, ... }`.
- `e_popular`/`e_projeto` fora de `{0,1}` agora são rejeitados com 400 em vez de persistidos sem checagem — fecha também um achado secundário (DynamoDB usa `Number` para esses campos por limitação de GSI, não `Boolean`; sem o `z.union` de literais, qualquer número passaria).

**5. Upload sem limite de tamanho real — `backend/src/functions/mediaUpload/index.ts`**
- Antes: `getSignedUrl(s3, new PutObjectCommand({ Bucket, Key, ContentType }))` — presigned PUT não aceita `Conditions`.
- Depois: `createPresignedPost(s3, { Bucket, Key, Conditions: [["content-length-range", 0, 10_000_000], ["eq", "$Content-Type", tipo_arquivo]], Fields: { "Content-Type": tipo_arquivo } })` — o S3 valida e rejeita o upload no próprio armazenamento, não depende de checagem no client.
- Mudança em cascata: `admin/src/services/api.ts` (`mediaApi.uploadToS3`) e `UploadModal.vue` precisaram trocar de `PUT` simples para `FormData` com os `fields` retornados pelo presigned POST — presigned POST exige um body multipart, não um PUT de corpo único.

**6. Branch protection — bloqueada, comando documentado em `docs/auditoria-appsec/05-supply-chain-iac-cicd.md`**
- Comando pronto, nunca executado: `gh api --method PUT repos/.../branches/main/protection` com `required_status_checks: { strict: true, contexts: ["Deploy Pipeline (CD)", "Security Scan"] }`, `allow_force_pushes: false`, `allow_deletions: false`.
- Bloqueado pelo harness de execução da IA na categoria "[CI Bypass]" — mudança de configuração do GitHub (não código), com parâmetros escolhidos unilateralmente pelo agente, exigindo aprovação humana explícita. Esse é o achado de fechamento do post: a IA documentou e parou, não tentou um caminho alternativo.

**Configuração do scanner que tornou os achados #2 e #3 visíveis — `.github/workflows/security.yml`**
- Antes da auditoria: cada um dos 3 jobs (backend/frontend/admin) rodava só `--config p/typescript --config p/nodejs` (backend também com `p/nodejs`) — rulesets genéricos de linguagem.
- Depois: todos os 3 jobs ganharam `--config p/owasp-top-ten --config p/secrets --config p/jwt`, mantendo `--severity ERROR --error --quiet` em produção (testado localmente: 0 findings novos nesse nível — mudança segura para não quebrar o CI).
- O ponto central para o post: os achados #2 e #3 só apareceram numa rodada de teste local com `--severity WARNING` — a configuração que já estava em produção (`ERROR`) já tinha o ruleset certo instalado, só não estava configurada para reportar naquele nível. A ferramenta já era capaz; a configuração escondia o resultado.

## Prompt de exemplo para uma IA fazer este tipo de auditoria

```
Quero uma auditoria de Application Security dedicada e profunda deste
repositório — não uma menção de segurança dentro de uma revisão geral de
qualidade de código, um exercício à parte.

Use como referência (cite o item específico de cada framework em todo
achado, não só "boas práticas de segurança"):
- OWASP ASVS (Application Security Verification Standard), nível 1 como
  piso obrigatório + itens de nível 2 onde o risco justificar
- OWASP API Security Top 10, se o backend for uma API
- [framework de cloud equivalente ao seu provedor — ex.: AWS
  Well-Architected Security Pillar, Azure Security Benchmark]

Antes de qualquer correção: só leia e analise. Para cada categoria do
framework, declare explicitamente o que foi verificado e como (leitura
de código, inspeção de infraestrutura como código, consulta real ao
provedor de cloud via CLI, teste dinâmico contra o ambiente de dev — não
produção). Não generalize "parece seguro" sem mostrar o trecho de código
ou comando que sustenta essa conclusão.

Para cada achado: classifique a severidade, explique o porquê em termos
de impacto real (não "viola best practice X" sem explicar o que isso
permite a um atacante), e identifique se ele se conecta a outro achado
formando uma cadeia de risco maior do que a soma das partes.

Entregável: um arquivo por categoria + um sumário executivo com a lista
de achados ordenada por severidade e um backlog de remediação ordenado
pelo risco de implementar a correção (não pela gravidade do achado —
um achado grave com correção de risco zero deve vir antes de um achado
médio com correção arriscada).

Não aplique nenhuma correção nesta etapa. Aguarde aprovação explícita
antes de mudar qualquer código ou configuração de infraestrutura.
```

## Estratégia de prevenção — para não precisar desta auditoria em primeiro lugar

O padrão que conecta os quatro achados não é falta de cuidado pontual — é a ausência de um **contrato de engenharia explícito, escrito antes da primeira linha de código**, que torne certas decisões impossíveis de esquecer:

- **Sanitização em um único ponto de entrada, não por campo.** O `bio` ficou vulnerável porque a regra "sanitize antes de persistir HTML" existia, mas só para um campo (`conteudo_html`); o segundo campo HTML que apareceu no projeto não herdou a regra automaticamente. A prevenção correta não é "lembrar de sanitizar `bio`" — é um tipo/wrapper no nível do banco (`SanitizedHtml`) que só pode ser criado passando pela função de sanitização, tornando o caminho inseguro literalmente impossível de compilar.
- **Schema de validação desde o primeiro endpoint, não como débito técnico.** Se `zod` (ou equivalente) entra no projeto no commit que cria o primeiro Lambda de escrita, "mass assignment" nunca chega a ser um padrão estabelecido para depois ser corrigido em N endpoints — é a única forma de escrever um endpoint novo desde o início.
- **Checklist de segurança no template de novo componente, não na auditoria.** Toda vez que um dado do usuário é embutido em HTML (JSON-LD, atributos, texto), a pergunta "isso passa por escaping automático ou eu estou montando a string à mão?" devia fazer parte do template/snippet que se copia para criar a página — não de uma auditoria que descobre isso meses depois.
- **Configuração de repositório (branch protection, secret scanning) no dia da criação do repositório, não quando ele atinge importância.** É barato e reversível — não há motivo para depender de uma auditoria posterior lembrar disso.

## Estratégia de correção — quando o achado já existe em produção

Quando a prevenção falhou e o achado já está no código, a ordem de trabalho que funcionou nesta auditoria foi:

1. **Confirmar o achado contra o estado real, não contra a leitura do código isolada** — para o `bio`, isso significou ler os dois pontos de renderização (`PostFooter.tsx`, `AuthorBox.tsx`) antes de declarar "stored XSS confirmado", não só ver que `sanitizePostHtml` estava ausente.
2. **Corrigir a causa raiz uma vez, depois auditar todos os lugares onde o mesmo padrão se repete** — depois de corrigir o JSON-LD em `layout.tsx`, a busca foi por todas as outras 8 ocorrências de `JSON.stringify(...)` dentro de `dangerouslySetInnerHTML` no projeto inteiro, não só no arquivo onde o scan apontou.
3. **Validar contra o ambiente real depois do deploy, não só localmente** — todo achado de infraestrutura (Cognito, CloudTrail, GuardDuty) foi reconfirmado via AWS CLI contra a conta real depois do `terraform apply` do pipeline, não só inferido a partir do `terraform plan`.
4. **Tratar a recusa de aplicar uma mudança automaticamente como informação, não como obstáculo a contornar** — quando o ambiente de execução bloqueou a alteração de branch protection, a resposta certa foi documentar o comando pronto e parar, não procurar um caminho alternativo para forçar a mudança.
5. **Registrar o que foi corrigido e o que ficou de fora por decisão, não por esquecimento** — MFA e TLS moderno ficaram fora desta rodada por escolha explícita do responsável pelo projeto, não porque a auditoria "não viu". Essa diferença precisa estar documentada, ou a próxima pessoa que ler o backlog não sabe se é um achado esquecido ou uma decisão tomada.

## Estrutura sugerida (H2s)

1. Uma conta, dois achados médios, um problema crítico
2. O título de post que poderia ter quebrado uma tag `<script>`
3. O `as Post` que o TypeScript deixou passar
4. O achado que a própria IA se recusou a corrigir
5. O que isso ensina sobre prevenir (antes) e corrigir (depois)

## Fecho / CTA

Linka para `06-criterio-seguranca.md` ("Segurança: a proteção que existe no código mas não no navegador") como o capítulo de origem — aquele post tratou segurança como 1 de 12 critérios de uma auditoria de engenharia geral; este é o mergulho dedicado que aquele capítulo apontava como próximo passo natural. Linka também para o post #11 (`11-standalone-x-frame-options-meta-tag.md`), que é sobre um achado de segurança anterior do mesmo projeto (header que não funciona via meta tag) — mostrando que segurança não é um evento único, é um processo contínuo de descobrir a próxima camada.

## Fonte interna

- `docs/auditoria-appsec/00-metodologia.md` (sumário executivo, 4 achados de alto impacto + 13 de impacto médio)
- `docs/auditoria-appsec/01-autenticacao-sessao-controle-acesso.md` (achado MFA/SRP)
- `docs/auditoria-appsec/02-validacao-entrada-upload-api.md` (achados XSS, mass assignment, upload)
- `docs/auditoria-appsec/05-supply-chain-iac-cicd.md` (achado JSON-LD, branch protection bloqueado)
- `docs/auditoria-appsec/06-arquitetura-logging-dados-observabilidade.md` (achado CloudTrail/GuardDuty)
- `docs/plano-auditoria-appsec.md` (metodologia e frameworks de referência, fonte do prompt de exemplo)
- `backend/src/common/postSchema.ts`, `frontend/lib/json-ld.ts` (código real das correções)

## Relação com o post #6 (criterio-seguranca)

Este post e `06-criterio-seguranca.md` cobrem o mesmo domínio (segurança) em profundidades e momentos diferentes — não são duplicados:

- **#6** nasceu de uma auditoria de engenharia **geral**, onde segurança era 1 de 12 critérios avaliados — achados mais superficiais (header que não funciona via meta tag, sanitização dessincronizada entre client/server), encontrados no mesmo passe que cobriu arquitetura, testes, CI/CD etc.
- **#18 (este)** nasceu de uma auditoria **dedicada só a AppSec**, ancorada em frameworks específicos de segurança (OWASP ASVS, API Security Top 10, AWS Well-Architected Security Pillar), com tempo e profundidade que uma auditoria geral não permite — por isso encontra achados que exigem cadeia de raciocínio (MFA + XSS), configuração de ferramenta (severidade do Semgrep) e um detalhe de especificação (`JSON.stringify`) que só aparecem quando alguém procura especificamente por eles.

**Ordem de publicação sugerida:** #6 antes (mostra que segurança apareceu como gap notável mesmo numa auditoria geral), #18 depois (mostra o que aparece quando você dedica uma auditoria inteira ao tema) — reforça a tese de que profundidade encontra coisas que cobertura ampla não encontra.
