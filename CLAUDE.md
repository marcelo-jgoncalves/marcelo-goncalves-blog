# CLAUDE.md — Blog Marcelo Gonçalves

> Carregado automaticamente em toda sessão. Leia antes de qualquer ação.

---

## 1. Contexto do Projeto

Site empresarial de consultoria em tecnologia (IA, AWS, DevOps), com blog de autoridade como subseção. Propósito: leads de consultoria + AdSense no blog. **Pivô estrutural na sessão 42:** a Home (`/`) passou a ser institucional (hero, serviços, metodologia, resultados, teaser de blog, CTA) e o antigo blog (que era a home) mudou para `/blog`; nova página `/contato` com formulário de diagnóstico.  
**Owner:** Marcelo Gonçalves (PM/Arquiteto) — você é o Staff Engineer.

**Ambiente ativo:** apenas `dev`. Produção não existe ainda.  
**Branch de trabalho:** `develop` — todo trabalho vai aqui. `main` = snapshot estável.

### Sistema ao vivo (dev)
| Serviço | URL |
|---|---|
| Site público | `https://dsns2wusdrj9z.cloudfront.net` (Home institucional em `/`, blog em `/blog`, contato em `/contato`) |
| Admin Vue | `https://d11ubkpuy1di6r.cloudfront.net` |
| API Gateway | `https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1` |
| Pipeline CD | GitHub Actions → develop ✅ verde |

### Arquivos de contexto obrigatórios
- **`.project-context.md`** — memória viva do projeto. Leia a seção "⚡ PRÓXIMA SESSÃO" ao iniciar.
- **`contexto/seo-audit.md`** — status de 20 itens SEO (18/20 feitos).

---

## 2. Modo de Operação

Você atua como **Autonomous Staff Engineer**, não como assistente passivo.

- Marcelo fornece direção estratégica e decisões de produto.
- Você detecta problemas, planeja, implementa, valida e commita.
- Nunca acumule trabalho não validado. Um ciclo só termina quando: testes passam + pipeline verde + `.project-context.md` atualizado.
- Prefira muitos ciclos pequenos a mudanças grandes.

### Princípios de design (formalizado 2026-07-31)

Projeto é majoritariamente funcional (Lambdas, componentes React/Vue funcionais) — SOLID não se aplica bem aqui e não deve ser forçado. Três princípios já guiam decisões reais do projeto e devem continuar guiando, sempre com julgamento de custo/risco, nunca como regra cega:

- **DRY** — motivação por trás dos componentes reutilizáveis do design system (`Pill`, `Kicker`/`IndexNumber`, `IconTile`, `FaqSection`, `BeneficiosSection`, `FullwidthCallout`, ver §10). Contrapeso deliberado: CSS legado duplicado (177 arquivos `.css` globais, ex-sistemas de botão) **não é migrado retroativamente** só por causa de duplicação — risco de regressão visual maior que o ganho.
- **KISS** — motivação por trás de escolher a solução mais simples que resolve o problema atual: Algolia em vez de OpenSearch (#16), cron+Lambda em vez de DynamoDB Streams para reconciliação de contador (#23), CloudFront invalidation (Fase 1) em vez da infra completa de on-demand revalidation (Fase 2, #28).
- **YAGNI** — não construir capacidade antes de um gatilho real de necessidade: mesmos itens #16/#23/#28 acima têm gatilho explícito documentado para revisitar; `icone_fa`/assets de `/sobre` (#40/#41) implementados na origem mas com a *seção* de consumo deliberadamente não construída até decisão de Marcelo.

### Protocolo de início de sessão
1. Ler seção "⚡ PRÓXIMA SESSÃO" do `.project-context.md`
2. Se houver dúvida sobre estado real da infra, validar via AWS CLI (profile `claude-dev`)
3. Nunca assumir — sempre verificar

### Antes de qualquer commit
- Build passa
- Testes passam (`npm test` em cada workspace afetado)
- Lint/typecheck limpos
- Comportamento no browser validado (quando aplicável)
- `.project-context.md` atualizado se houver mudança arquitetural

### Protocolos de Feedback (Sessão 35+) — CRÍTICO

**3 regras estabelecidas com Marcelo (2026-05-22):**

1. **Analysis vs Action** — Quando solicitado análise:
   - Ler código/arquivos, extrair dados, apresentar achados
   - NUNCA modificar código na análise
   - Ação requer instrução explícita ("mude", "aplique", "fix", etc.)

2. **Questions Only Answer** — Quando perguntado algo:
   - Responder a pergunta especificamente
   - NÃO assumir ações adicionais
   - NÃO tomar ação baseada na resposta

3. **Incremental Investigation Protocol** — Ao debugar problemas:
   - **ANTES:** Estado atual + modelo mental + hipótese + mudança mínima + teste
   - **DEPOIS:** Resultado + diferença vs esperado
   - **APRENDIZADO:** Modelo mental atualizado + por que falhou + próxima hipótese
   - Documentar em `ACTIVE_INVESTIGATIONS.md`

Ver `memory/` para referência completa (`feedback_*.md`).

### Regra de Bash — UMA operação por chamada (CRÍTICO)

Nunca usar `&&`, `||`, `;`, `$()`, `&` final ou `>` em um único comando Bash — dispara prompt de permissão mesmo com `bypassPermissions` ativo.

| Padrão proibido | Padrão correto |
|---|---|
| `cd "..." && npm run dev` | Chamada 1: `cd "..."` / Chamada 2: `npm run dev` |
| `cd "..." && npm test` | Chamada 1: `cd "..."` / Chamada 2: `npm test` |
| `cd "..." && terraform plan` | Chamada 1: `cd "..."` / Chamada 2: `terraform plan` |
| `sleep 8 && curl ...` | Chamada 1: `sleep 8` / Chamada 2: `curl ...` |
| `npm run dev > file.log &` | Chamada com `run_in_background: true`, sem `&` e sem `>` |
| `cmd1 && cmd2 && cmd3` | 3 chamadas separadas |

### Convenção de nomenclatura — idioma (sessão 2026-07-29, obrigatória a partir de agora)

Regra fixa, sem exceção em código novo: **código = inglês, dado/conteúdo/URL = português.**

| Categoria | Idioma |
|---|---|
| Tokens de design, classes CSS (Modules e global), nomes de componente React/Vue, variáveis/funções/tipos internos, nomes de arquivo/pasta de código, comentários de código | **Inglês** |
| Campos persistidos no DynamoDB, rotas (`app/`), IDs de âncora de seção, atributos `data-audit`, copy visível ao usuário | **Português** (mantidos como estão — nunca migrar; renomear rota/campo de dado é risco alto sem ganho real) |

Motivo: auditoria de nomenclatura (sessão 2026-07-29) achou substantivo em português dentro de casca estrutural em inglês repetido em 3 categorias independentes e sem critério (`qualidadeSubblocoIndex`, `AbordagemHead`, `adminCategorias`) — não era decisão, era hábito. Ajustes de baixo/médio risco corrigidos na mesma sessão (CSS Modules, nomes de componente React, diretórios de Lambda); as classes CSS globais com prefixo por página (`sobre-*`/`op-*`/`post-*`/`svc-*`, seção 5) **não foram traduzidas** — são referenciadas por seletor descendente/`:nth-child` entre arquivos (risco médio, exige sessão de validação visual dedicada, mesmo padrão de decisão do item #45 do backlog) — ficam em português como estão até uma rodada própria.

Ver `memory/feedback_bash_commands.md` para todos os padrões com exemplos.

### Conteúdo de comentário de código — regra "why, not what" (sessão 2026-07-29)

Comentário novo (ou editado) deve explicar **por que** o código existe daquela forma — restrição não-óbvia, workaround de bug específico, trade-off consciente — nunca **o que** ele faz (nome bem escolhido já responde isso).

**Nunca incluir dentro do comentário**: número de sessão, data, nome de quem pediu, referência a ticket/issue, ou qualquer contexto de processo ("sessão 43", "decisão de Marcelo em 2026-07-23", "achado da auditoria X"). Esse tipo de informação pertence à **mensagem de commit** ou a `memory/`/`.project-context.md`, nunca ao código-fonte — o código sobrevive ao processo que o gerou, mas o comentário com "sessão 43" não significa nada pra quem ler daqui a 2 anos sem esse contexto.

**Retroativo, sessão dedicada planejada**: ao contrário da convenção de nomenclatura (§ acima, que não migra retroativamente), os ~730 comentários existentes (quase 100% em português, vários citando sessão/data/decisão dentro do texto) **serão revisados e ajustados a este padrão numa sessão própria** — traduzir para inglês e remover contexto de processo, preservando o "why" real. Até essa sessão acontecer, não trate um comentário antigo fora do padrão como bug a corrigir de passagem — é trabalho da sessão dedicada, não de edições pontuais.

Também não marcar no código que uma mudança foi feita por IA (nem comentário `// gerado por IA`, nem assinatura no corpo do arquivo) — a atribuição de autoria de IA fica só na mensagem de commit (`Co-Authored-By: Claude ...`), nunca no código.

---

## 3. Arquitetura

```
mgoncalves-editorial-platform/
├── frontend/    # Next.js 16 + OpenNext v3 (blog público)
├── backend/     # Node.js 22 + TypeScript — 11 Lambdas
├── admin/       # Vue 3 + Vite + Pinia + AWS Amplify (CMS)
├── infra/       # Terraform — 7 módulos AWS
└── contexto/        # Documentação viva do projeto
```

**AWS profile local:** `claude-dev` — SEMPRE usar este.  
**Terraform state:** `s3://marcelo-goncalves-blog-dev-tfstate/blog/terraform.tfstate`  
**CD automático:** push em `develop` dispara build → terraform apply → deploy completo.

---

## 4. Regras Críticas (quebrar = bug em produção)

### Next.js 16
- `params` é Promise — **sempre** `await params` antes de desestruturar em qualquer `page.tsx`.
- ISR: posts individuais `revalidate: 60`, listagens `revalidate: 300`, páginas estáticas `revalidate = 3600`.
- Toda nova `page.tsx` DEVE ter `generateMetadata()` com `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`.

### OpenNext v3
- ZIP do Next.js: `frontend/.open-next/server-functions/default/` (PLURAL). `index.mjs` na raiz do ZIP.

### DynamoDB
- `e_popular` e `e_projeto` são `Number (0/1)` — não Boolean. Limitação de GSI.

### Backend (Lambdas)
- **Nunca** usar `console.log` — sempre `logger.info/debug/warn/error` de `backend/src/common/logger.ts`.
- Logs = JSON estruturado com `level`, `message`, `timestamp`, `requestId`.
- Sanitização HTML via `backend/src/common/sanitizer.ts` em `savePost()` — nunca persistir HTML bruto.
- Novas Lambdas: incluir `tracing_config { mode = local.xray_mode }` desde o primeiro commit.

### Sharp.js / Build
- `backend/build.js` usa `npm install --os=linux --cpu=x64`. **Não alterar.**
- No Windows: `build.js` usa `PowerShell Compress-Archive` (não `zip`).

### Variáveis de ambiente
- `API_URL` (sem prefixo `NEXT_PUBLIC_`): lida em runtime do `process.env` real da Lambda. `NEXT_PUBLIC_*` seria baked pelo Next.js/SWC no bundle em build time — não funciona para runtime injection.
- Admin (`VITE_*` vars): baked no build — o CD builda o admin **após** terraform apply outputs.

### Segurança / CORS
- Lambda URL: `authorization_type = "AWS_IAM"` + OAC SigV4. Só CloudFront pode invocar.
- `ADMIN_ORIGIN = "https://${module.admin.cloudfront_url}"` — definido via Terraform, não hardcoded.

### CloudFront / Assets estáticos
- Arquivos em `public/` (`.ico`, `.webmanifest`, `.png` root-level) **precisam de `ordered_cache_behavior` explícito** apontando para `S3-Assets` — o behavior padrão roteia tudo para Lambda (que não serve `public/`).
- `/_next/image` retorna 404 para imagens locais (`src="/..."`): não há Lambda de image optimizer neste deploy. Nunca usar `<Image>` Next.js com `src` local — usar `<img>` com `unoptimized` ou CSS.
- `app/favicon.ico` tem prioridade sobre `public/favicon.ico` no Next.js App Router.

### SEO — proteção dev
- `app/robots.ts` e `app/layout.tsx` detectam `SITE_URL.includes('cloudfront.net')` e emitem `Disallow: /` + `noindex, nofollow`.
- **Nunca remover** essa lógica sem confirmar que `SITE_URL` é o domínio definitivo.
- Toda constante de SEO vive em `frontend/lib/config.ts` — nunca repetir URL ou nome do blog em string literal.

---

## 5. Design System (não-negociável)

### Fontes
| Variável CSS | Fonte | Uso |
|---|---|---|
| `--font-display` | Inter | Headings, UI, botões, nav |
| `--font-sans` | Inter | Body, parágrafos |
| `--font-mono` | JetBrains Mono | Código, eyebrows/labels/badges pequenos (uso textual, não numérico isolado) |
| `--font-numbers` | Inter (`var(--font-display)`) | Todo número-índice decorativo (`01`/`02`/`03`, contadores de card/etapa/timeline) |

**Nunca** usar `Space Grotesk` ou `DM Sans` — foram removidos do frontend e do admin.

**`--font-numbers` (sessão 2026-07-28)** — JetBrains Mono renderiza o glifo `0` com um ponto no meio por padrão (característica de design da fonte, sem alternativa via `font-feature-settings` — testado e confirmado, não é toggle). Decisão de Marcelo: não gostou do visual em números grandes/decorativos. Todo elemento que renderiza um número-índice sozinho (via `padStart(2, '0')`, CSS `counter()` decorativo ou `content: attr(data-index)`) usa `var(--font-numbers)`, nunca `var(--mono)`/`var(--font-mono)` diretamente — mesmo em componentes compartilhados (`TableOfContents`, `StepsList`, `StepsTimeline`). Texto misto com letras (eyebrow, label, tag, badge de categoria) continua em `--font-mono` normalmente — a mudança é só para números isolados.

### Paleta de cores — Petrol / Clay / Ivory (redesign 2026, fonte de verdade corrente)

Declarada em `frontend/app/globals.css` (`:root`). Substituiu por completo a paleta azul (`--accent`/`--dark-900`/`--surface-*`/`--dark-warm-*`/etc.) de uma versão anterior do design system — nenhum desses tokens antigos existe mais no código (confirmado via grep em todo `frontend/`); não usá-los em nenhuma referência nova.

```css
--petrol:        #0F4C5C;   /* cor primária de marca */
--petrol-deep:   #08323D;   /* header/footer escuro */
--petrol-soft:   #5B8B96;   /* acentos suaves sobre fundo escuro */
--ink:           #0C2027;   /* texto mais escuro */
--slate:         #3C5A64;   /* texto secundário */
--steel:         #7E969E;   /* texto terciário/muted */
--ivory:         #FAF8F3;   /* fundo claro (base) */
--surface:       #FFFFFF;   /* cartões, superfícies elevadas */
--sand:          #F0ECE2;   /* fundo alternativo suave */
--line:          #E4DDD0;   /* bordas discretas */
--clay:          #C9603C;   /* cor de destaque/CTA (laranja) */
--clay-hover:    #A94C2D;   /* hover do clay */
--clay-soft:     #F3DDD0;   /* tint suave do clay */
--moss:          #3F6B47;   /* verde de apoio (uso pontual) */
```

**Nunca** usar `--aws-orange`, `--aws-dark`, `--gray-*` — foram removidos do frontend e do admin.  
**AdSense:** usar flag `ADSENSE_CONFIGURED` em `AdsenseInArticle.tsx`, nunca `NODE_ENV` — em produção `NODE_ENV === 'production'` torna o bloco invisível.

Lista completa de tokens (cor, espaçamento, tipografia, radius, sombra) com papel de cada um: `prints/tokens.md`.

### Escala de espaçamento — base 4px (13 tokens, `--sp-1..13`)
```css
--sp-1:    4px;   /* micro — pontos, separadores finos */
--sp-2:    8px;   /* xs — gap de ícone/label, padding de badge */
--sp-3:   12px;   /* sm — gap de nav links, gap de lista no footer */
--sp-4:   16px;   /* base — margin-top de texto secundário, badge margin */
--sp-5:   20px;   /* md — gap de grid especialidade, margin de badge */
--sp-6:   24px;   /* lg — gap de botão, padding nav h */
--sp-7:   32px;   /* xl — inset compacto de card, hero-actions margin */
--sp-8:   40px;   /* 2xl — padding horizontal do wrap */
--sp-9:   48px;   /* 3xl — margin-bottom do sec-head, padding XL de card */
--sp-10:  64px;   /* 4xl — padding seção apertada / hero postagem */
--sp-11:  80px;   /* 5xl — padding seção accent/band escura */
--sp-12:  96px;   /* 6xl — padding canônico de seção */
--sp-13: 128px;   /* 7xl — padding-top do layout de postagem */
```
Única escala de layout — `--space-1..7` (legacy, base 8px) foi removida por completo, sem alias de compatibilidade.

### Escala tipográfica fluida — 11 tokens (`--type-*`, `clamp()` 400px→1280px)
```css
--type-caption:      clamp(0.79rem, 0.745rem + 0.18vw, 0.889rem);   /* 12.6 → 14.2px */
--type-label:        clamp(0.889rem, 0.838rem + 0.2vw, 1rem);       /* 14.2 → 16px */
--type-body-sm:      clamp(1rem, 0.943rem + 0.23vw, 1.125rem);      /*   16 → 18px */
--type-body:         clamp(1.125rem, 1.061rem + 0.26vw, 1.266rem);  /*   18 → 20.25px */
--type-lead:         clamp(1.266rem, 1.122rem + 0.58vw, 1.582rem);  /* 20.25 → 25.3px */
--type-h4:           clamp(1.424rem, 1.172rem + 1.01vw, 1.978rem);  /* 22.8 → 31.6px */
--type-h3:           clamp(1.602rem, 1.206rem + 1.58vw, 2.472rem);  /* 25.6 → 39.6px */
--type-h2:           clamp(1.802rem, 1.216rem + 2.34vw, 3.09rem);   /* 28.8 → 49.4px */
--type-h1:           clamp(2.028rem, 1.193rem + 3.34vw, 3.863rem);  /* 32.4 → 61.8px */
--type-display-sm:   clamp(2.281rem, 1.123rem + 4.63vw, 4.828rem);  /* 36.5 → 77.3px */
--type-display-lg:   clamp(2.566rem, 0.989rem + 6.31vw, 6.035rem);  /*   41 → 96.6px */
```
Única escala de fonte — `--text-xs..--text-4xl` (fixa, legacy) foi removida por completo.

### Espaçamento de prosa (`--prose-sp-*`, só dentro de `.post-content`)
```css
--prose-sp-1: 0.5em;  --prose-sp-2: 1em;  --prose-sp-3: 1.5em;  --prose-sp-4: 2em;  --prose-sp-5: 2.5em;
```
Deliberadamente em `em`, não `--sp-*`: espaçamento editorial escala com o tamanho da fonte do elemento, não é uma medida fixa de página.

### Border radius
```css
--radius-sm: 4px;  --radius-md: 6px;  --radius-lg: 10px;  --radius-xl: 12px;  --radius-full: 9999px;
```

### Ritmo vertical entre seções
**Regra global:** `section { margin-block: var(--sp-10) }` (64px) aplicada em `globals.css`.  
**Exceções obrigatórias** (`margin-block: 0`): `PageHero`, `SuperDestaque` e qualquer seção fullwidth com padding próprio.  
**Sidebars:** filhos diretos com `margin-block: 0` — `gap` do flex é o único responsável pelo ritmo entre widgets.  
**Colunas editoriais** (home-main, op-articles-feed, op-timeline-feed): sections sobrescrevem o global com `margin-block` menor; primeiro filho sempre `margin-top: 0`.

### Logo
```
Marcelo    → header: color var(--ivory) · footer: color #fff
Gonçalves  → header: color var(--clay) · footer: color var(--petrol-soft)
```
Fonte: Inter (`--font-display`) — nunca DM Sans/Space Grotesk.

### Botões — sistema único (sessão 42, `f1f6a4c`)

Todo botão/CTA do site (frontend público) usa exatamente **duas classes**, definidas globalmente em `frontend/app/globals.css`:
```
.btn          → laranja/clay (var(--clay)), cor primária — usar por padrão
.btn.btn-petrol → petróleo (var(--petrol-deep)), secundária
```
Mesma forma sempre (`padding: 14px 22px; border-radius: 12px; font-weight: 600`), variando **só texto e largura**. Hover troca de cor (clay⇄petrol, com borda clara sutil para não sumir sobre fundos da mesma cor) — mesmo padrão do botão "Voltar ao topo" do Footer.  
**Nunca criar uma nova classe de botão com cor/padding/radius próprios.** Se um componente precisa de contexto de layout (largura 100%, altura fixa, sombra específica, ícone de seta com fonte mono), crie uma classe local **sem** propriedades de cor/forma e aplique-a **junto** com `.btn`/`.btn-petrol` (ex.: `className="btn cta-adv-btn"`, onde `cta-adv-btn` só define `width:100%` e a sombra).  
Isso substituiu 14 sistemas de botão distintos que existiam antes (`.btn-outline`/`.btn-ghost`/`.btn-white`/`.btn-outline-dark`, `.fwc-btn`, `.cta-adv-btn`, `.home-btn-*`, `.ct-btn-primary`, `.sobre-hero__btn-*`, `.sobre-btn-clay`, `.op-btn-callout-primary`, `.svc-btn-clay-hero`, `.widget-newsletter .btn-full`) — todos continuam existindo como nomes de classe (para não quebrar seletores CSS descendentes/contexto), mas nenhum define mais cor ou padding, só o que for específico daquele componente.

### CSS Modules vs. CSS global (regra decidida em 2026-06-29)

- **Componente novo a partir de agora → `.module.css`.** Evita colisão de nome de classe (sem garantia de tooling hoje — convenção de prefixo manual `sobre-*`/`op-*`/`pc-*`/`post-*` depende de disciplina, não de compilador) e dá uma rede de segurança mínima contra typo (`styles.foo` inexistente vira `undefined`, em vez de uma string solta que silenciosamente não estiliza nada).
- **CSS existente (177 arquivos `.css` globais) → não migrar retroativamente.** Custo real (reescrever seletores `:nth-child`/descendentes que cruzam elementos, ex. `.sobre-tc-item:nth-child(1) .sobre-tc-logo`, com risco de regressão visual em todas as páginas) maior que o ganho (proteção contra um problema que a convenção de prefixo já mitiga na prática). Só editar um arquivo `.css` existente se já estiver tocando naquele componente por outro motivo — não é proibido, só não é prioridade isolada.
- Variáveis CSS (`--petrol`, `--sp-*` etc.) continuam globais em `globals.css` independente da escolha — CSS Modules não as afeta, só escopa classes/ids.
- Os 2 arquivos que já eram `.module.css` antes desta regra (`PostFooter.module.css`, `ShareRail.module.css`) foram a motivação original — escolha pontual de quem escreveu, nunca formalizada até agora.

### Tokens de tipografia e espaçamento — obrigatório, com enforcement automático (sessão 2026-07-18/19)

Nenhuma exceção manual. `font-size`/`margin*`/`padding*`/`gap`/`row-gap`/`column-gap` **só aceitam `var(--sp-*)`, `var(--type-*)` ou `var(--prose-sp-*)`** (mais os aliases `--gap-grid`/`--gap-loose`/`--eyebrow-gap`/`--title-gap`) — nunca valor `px`/`rem`/`em` cru. Isso não é uma convenção de estilo, é uma regra do **Stylelint** (`.stylelintrc.json`, plugin `stylelint-declaration-strict-value`), que roda em `npm run lint` — o mesmo comando que o CI já executa 3x no pipeline (`.github/workflows/deploy.yml`). Um valor hardcoded novo **quebra o build**, não depende de review humano pra ser pego.

- **`--sp-1..13`** (base 4px) — única escala de layout. `--space-1..7` (legacy, base 8px) foi removida por completo, sem alias de compatibilidade.
- **`--type-caption..--type-display-lg`** (11 tokens, `clamp()` fluido 400px→1280px) — única escala de fonte. `--text-xs..--text-4xl` (fixa) foi removida por completo.
- **`--prose-sp-1..5`** (em `em`: 0.5/1/1.5/2/2.5) — escala separada, só para ritmo vertical dentro de `.post-content` (parágrafo, H2/H3 do artigo). Deliberadamente em unidade relativa, não `--sp-*`: espaçamento editorial escala com o tamanho da fonte do elemento, não é uma medida fixa de página.
- **Exceção sem token, mas com teto matemático na própria regra**: `margin`/`padding`/`gap` com magnitude `≤3px` passam sem exigir token (regex `/^-?[0-3](\.\d+)?px$/` no `.stylelintrc.json`) — ajuste óptico de alinhamento (ex. `gap: 2px` entre separador de meta, `margin-top: 1px` de baseline de ícone) é menor que o menor degrau da escala (`--sp-1` = 4px) por natureza, forçar pro grid quebraria o alinhamento que a linha existe pra corrigir.
- **Exceção pontual, exige comentário no código**: valores fora até dessa margem (numerais decorativos tipo "404", letra capitular, geometria de posicionamento calculada, técnica `sr-only`) precisam de `/* stylelint-disable-next-line scale-unlimited/declaration-strict-value -- motivo */` na linha anterior — a exceção fica visível no diff do PR, nunca silenciosa. Rodar `npm run lint:css` isoladamente pra checar só CSS.

#### Papel → token mínimo (sessão 2026-07-23) — a regra que falta no Stylelint

O Stylelint acima garante *que* um token seja usado, nunca *qual* token cabe a cada papel — `font-size: var(--type-label)` num parágrafo de leitura passa no lint com a mesma limpeza que `var(--type-body-sm)` no mesmo lugar. Essa lacuna já causou uma auditoria inteira (7 elementos da Home + Footer pousados no menor token da escala, sem decisão, só ausência de regra — ver `git log`, commit `311e522`). Tabela de referência pra não repetir:

| Papel do elemento | Token mínimo | Nunca abaixo de |
|---|---|---|
| Texto de leitura corrida (parágrafo, descrição, excerpt) | `--type-body-sm` | 16px mobile |
| Link/CTA interativo (nav, "ler mais", botão textual) | `--type-label` | 14.2px mobile |
| Título de card/widget (H3 dentro de card) | `--type-lead` | 20.25px mobile |
| Metadado/decorativo (eyebrow, tag, badge, timestamp, copyright) | `--type-caption` | sem piso — papel é intencionalmente pequeno |

Mesma lacuna existe no lado de espaçamento — exemplo real e **ainda não corrigido**, deixado aqui de propósito como lembrete: `--title-gap` (10px, comentário `/* título → descrição */` no próprio token) não é usado por nenhuma das 3 implementações reais desse papel no projeto (`sec-desc` usa `--sp-6`=24px, `.ih-center-desc` usa `--eyebrow-gap`=14px, `.ih-results-desc` usa `--sp-4`=16px). Não convergir sem validação visual dedicada — `.sec-desc` é usado em 5 páginas (`page.tsx`, `contato`, `o-projeto`, `artigos`, `sobre`).

Antes de escrever `font-size`/`margin`/`padding` novo: identificar o papel do elemento na tabela acima, não só "parece do tamanho certo".

---

## 6. Imagens (pipeline obrigatória)

- **Upload**: formatos aceitos = PNG, JPEG, WebP, HEIC, HEIF. Extensões maiúsculas normalizadas automaticamente.
- **imageProcessor** gera 6 variantes por upload e as grava no bucket `assets` sob `media/`: `{base}-480.avif`, `{base}-480.webp`, `{base}-768.avif`, `{base}-768.webp`, `{base}-1280.avif`, `{base}-1280.webp`.
- **CloudFront** `media/*` → `S3-Assets` (bucket de assets estáticos, não o uploads-raw).
- **CD pipeline**: `aws s3 sync ... --exclude "media/*"` para preservar variantes entre deploys.
- **Nunca** renderizar imagens de conteúdo com `<Image>` Next.js diretamente — sempre `<ResponsiveImage>` (`frontend/components/ui/ResponsiveImage.tsx`).
- **`ResponsiveImage`** sempre strip extensão do `src` antes de usar como basePath (cobre URLs antigas do admin com `.webp` appended e novos basePaths sem extensão).
- `imagem_destaque_url` no DynamoDB: basePath sem extensão (novos posts) ou URL `.webp` legada — ambos funcionam via strip.
- Alt text: nunca string vazia — fallback mínimo = título do post.

### Assets estáticos do site (logos, badges) — pipeline separada (sessão 2026-06-29)

Categoria diferente de imagem: não vem de upload de usuário, é parte do código-fonte, muda raramente. Por isso é otimizada em **build-time** (script local), não em runtime (Lambda) — usar o `imageProcessor` pra isso seria over-engineering.

- **`scripts/optimize-static-images.mjs`** (Sharp, mesmo pacote do `imageProcessor`) gera 2 variantes por imagem — `{nome}-1x.{avif,webp}` e `{nome}-2x.{avif,webp}` — no tamanho de exibição real em CSS (largura para badges quadrados, altura para logos retangulares). **Não** usa breakpoints de viewport (480/768/1280) como o `ResponsiveImage` — esses elementos têm tamanho fixo em CSS em qualquer largura de tela; o único eixo que importa é densidade de pixel (1x/2x retina).
- **`StaticPicture.tsx` (removido, sessão 51)** — existia pra consumir essas variantes via `<picture>` com `srcSet` de densidade (`1x, 2x`), AVIF→WebP fallback, mas nunca chegou a ser usado em nenhuma página real (ver backlog §10 item 40) e foi deletado por estar órfão. Se a seção de logos/badges do `/sobre` for implementada no futuro, recriar um componente equivalente antes de consumir essas variantes — não existe hoje.
- **`assets-source/`** (raiz do repo, fora de `frontend/public/`) guarda os PNGs originais de alta resolução — nunca comitar arquivo-fonte não otimizado dentro de `frontend/public/static/`, só o output do script.
- Fotos de pessoas/conteúdo (avatar, hero) continuam pelo fluxo normal de upload (`imageProcessor`) mesmo se vierem de um arquivo local — sobem direto pro bucket `uploads-raw` (mesma convenção de key do admin: `{YYYY}/{MM}/{DD}/{timestamp}-{random}-{nome}`) em vez de virar asset estático.

---

## 7. Testes

| Workspace | Runner | Comando | Total |
|---|---|---|---|
| `backend/` | Jest | `npm test` | 172 testes |
| `backend/` | Jest + DynamoDB Local | `npm run test:integration` | 5 testes (handlers reais contra DynamoDB real — ver `src/integration/`, backlog §10 item 55) |
| `frontend/` | Jest | `npm test` | 81 testes |
| `admin/` | Vitest | `npm test` | 27 testes |
| `frontend/` | Playwright | `npm run test:e2e` | 37 testes (smoke, home-layout, post, artigos, busca, categoria) |

- `tsconfig.test.json` separado no backend com `"types": ["jest"]`.
- `npm audit --audit-level=high` roda em cada job de CI. Zero high/critical tolerado.
- Admin: 0 vulnerabilidades (resolvido via `npm audit fix` sem --force, incluindo `shell-quote` critical).
- Backend: 19 moderate residuais (js-yaml via jest/istanbul, dev-only) — aceito como risco conhecido (fix exige downgrade breaking de ts-jest).
- Frontend: 22 moderate residuais (esbuild/open-next, js-yaml/ts-jest, postcss/next) — aceito como risco conhecido (fix exigiria downgrade para next@9 ou open-next@0.0.1, inviável).

### Estratégia de validação local (sessão 44, 2026-07-13)

Validar mudanças de frontend em nível proporcional ao risco, não uniformemente — screenshot/Playwright para toda edição pequena desperdiça tempo.

| Nível | Quando | Validação |
|---|---|---|
| 1 — sempre | Toda edição | `tsc --noEmit` + `eslint` |
| 2 — copy puro | Texto/label sem CSS | Só nível 1 |
| 3 — CSS local/escopado | Espaçamento, cor, tamanho num componente | `page.evaluate` com sweep de `getBoundingClientRect()` (overflow-check) — não screenshot. Foi essa técnica, não inspeção visual, que achou os bugs reais da auditoria de 2026-07-12 |
| 4 — mudança estrutural | Novo componente, grid/flex novo | 1 screenshot mobile (390px) + desktop (1440px) só da seção afetada |
| 5 — componente compartilhado | `PageHero`, `Footer`, `HeaderNav`, tokens em `globals.css` | Nível 4 + overflow-check em 2-3 páginas representativas, não nas 17 rotas |
| 6 — auditoria completa | Só sob pedido explícito de Marcelo | Full sweep das rotas |

`npm test`/e2e continuam só sob pedido explícito (regra já em vigor, não muda). Detalhes e racional completo em `memory/feedback_testing_strategy_tiers.md`.

### Estratégia de registro em contexto/memória (sessão 44, 2026-07-13)

Cada fato mora em exatamente 1 lugar — nunca duplicar entre `CLAUDE.md`, `.project-context.md` e `memory/`.

| Onde | O que vive aqui | O que NÃO vive aqui |
|---|---|---|
| `CLAUDE.md` | Regras de projeto duráveis: arquitetura, design system, gotchas críticos, backlog técnico (única lista, §10) | Narrativa de sessão, "o que fizemos hoje" |
| `.project-context.md` | Status atual + changelog compacto (1-8 linhas por sessão, linkando pra memória) | Prosa longa por commit, valores de pixel, passo a passo — isso já está no `git log`/`git show` |
| `memory/` (`feedback`) | Regras de comportamento anti-repetição de erro, válidas em qualquer sessão futura | Diário de execução ("rodei X, funcionou") |
| `memory/` (`project`) | Fatos duráveis e não-óbvios específicos do projeto | Itens já fechados/resolvidos sem pendência — viram 1 linha de changelog, não um arquivo |

**Checklist antes de gravar qualquer coisa** (memória ou `.project-context.md`):
1. Isso muda o que uma sessão futura faz, mesmo sem lembrar desta conversa? Se não → não grava.
2. Já é derivável do `git log`/código? Se sim → não grava (exceção: quando o "porquê" não está no commit).
3. Já existe um arquivo/seção pra isso? Se sim → atualiza, não cria um novo.
4. É um fato fechado/resolvido sem pendência? Se sim → 1 linha de changelog, não um arquivo próprio.
5. É genuinamente "não repita esse erro" ou "aqui está algo não-óbvio"? Só isso justifica memória `feedback`/`project`.

Auditoria que motivou esta regra: sessão 44 encontrou `.project-context.md` com 455 linhas (60-70% diário cronológico) e 7 arquivos de memória órfãos/duplicados/superados — cortado para ~110 linhas e 45 arquivos sem perder conhecimento durável. Detalhes em `memory/feedback_context_recording_strategy.md`.

---

## 8. Commits e Pipeline

### Estratégia de branch (formalizado 2026-07-31)

GitFlow completo (`release/*`, `hotfix/*`, `support/*`) não foi adotado — ele resolve um problema de cadência de release versionada que este projeto não tem (CD dispara em todo push em `develop`, sem ambiente de produção ainda). Variante simplificada, coerente com o fluxo já existente:

- **`main`** — snapshot estável. Não recebe commit direto.
- **`develop`** — branch de integração. Todo trabalho converge pra cá; push em `develop` dispara o pipeline CD (build → terraform apply → deploy). Continua sendo onde o trabalho do dia a dia acontece, como já era antes desta formalização.
- **`feature/*` / `fix/*`** — de vida curta, nascem de `develop`, voltam via PR. Nome do branch reflete o tipo do Conventional Commit predominante (`feature/nome-curto`, `fix/nome-curto`). Usar para mudanças que fazem sentido revisar como unidade antes de entrar em `develop` (ex.: a próxima rodada de a11y) — não é obrigatório para ajustes pontuais de uma linha, que podem seguir direto em `develop` como já acontecia.
- **Sem `release/*`/`hotfix/*` por enquanto** — não há ambiente de produção nem versionamento formal que justifique isolar uma correção urgente do que está em desenvolvimento. **Gatilho pra revisitar**: produção existir de fato, criando um cenário real de "corrigir prod sem levar junto o que ainda está em `develop`".

**Conventional Commits** obrigatório:
```
feat: add X
fix: resolve Y
refactor: simplify Z
test: add tests for W
chore: update dependency
docs: update context
```

Após commit:
```bash
git push
gh run list   # verificar pipeline
```

Pipeline vermelha = trabalho incompleto. Investigar antes de continuar.

---

## 9. JSON-LD por tipo de página (obrigatório)

| Página | Schema |
|---|---|
| Layout (todas) | `Organization` + `WebSite` com `SearchAction` |
| `/post/[slug]` | `BlogPosting` + `BreadcrumbList` |
| `/categoria/[slug]` | `BreadcrumbList` |
| `/sobre` | `Person` |
| As 4 landings de pilar | `ProfessionalService` (escopado a cada pilar) |
| Novas listagens | `BreadcrumbList` |

---

## 10. Backlog Atual

### Aguarda ação de Marcelo
1. **URLs sociais reais** — LinkedIn, GitHub, Instagram para footer e author box
2. ~~**Favicon + Web App Manifest**~~ ✅ Deployados sessão 16 — SEO agora 18/20
3. **Ferramenta de agendamento** — Calendly ou similar para CTA em /contato
4. **`NEXT_PUBLIC_SITE_URL`** — configurar via Terraform quando o domínio definitivo estiver pronto
5. **Publisher ID AdSense** — quando ativo: `ADSENSE_CONFIGURED = true` em `AdsenseInArticle.tsx` + descomentar stub AdSense em `frontend/lib/consent.ts → loadScriptsByConsent()`
6. **AWS Support ticket** — elevar Lambda concurrent executions de 10 → 1000
7. ~~**Conteúdo definitivo LGPD**~~ ✅ **já implementado** — achado na auditoria de `contexto/` (sessão 2026-07-24): as 3 páginas (`/politica-de-privacidade`, `/politica-de-cookies`, `/termos-de-uso`) já têm o conteúdo definitivo (confirmado comparando `.tsx` real com os rascunhos, mesma data "18 de julho de 2026", `{SITE_URL}` resolvendo pra valor real). Item estava desatualizado no backlog — corrigido, sem nenhuma mudança de código necessária. Rascunhos originais arquivados em `marcelo-goncalves-blog-arquivo/docs-historico/conteudo-legal/`.
8. **Google Analytics** — quando GA4 configurado, descomentar stub analytics em `frontend/lib/consent.ts → loadScriptsByConsent()` com `G-XXXXXXXXXX` real

### Notas de pipeline (não-negociável)
- **Static assets S3 sync sem `--delete`** — arquivos Next.js têm hash de conteúdo; `--delete` causa race condition com 403 pós-deploy. Manter apenas no admin SPA.
- **Cache-Control `immutable` em `public/`** — o S3 sync aplica `max-age=31536000, immutable` em todos os assets. Correto para `_next/static/**` (hashed), mas arquivos de `public/` (ex: imagens sem hash no nome) ficam cacheados no browser por 1 ano. Workaround imediato: hard-refresh (Ctrl+Shift+R). Fix pendente (#20 backlog): separar o sync em dois passos.
- **Semgrep** (`security.yml`) roda em todo push para `develop`/`main` — não remover.
- **Dependabot** abre PRs toda segunda — revisar e mergear regularmente para manter deps atualizadas.

### Admin CMS — padrões obrigatórios
- **Design system próprio do admin (sessão 39, "Painel de conteúdo"):** o admin **não** compartilha mais paleta com o frontend público — usa petróleo/argila/marfim, não o azul do site. Tokens em `admin/src/assets/main.css`: `--accent:#C9603C` (argila), `--petrol:#0F4C5C`, `--petrol-deep:#08323D`, `--moss:#3F6B47`, `--slate-50..400` (marfim/areia/aço/ardósia), `--dark-900/700` (petróleo/tinta). Fontes: Inter + JetBrains Mono + Newsreader (serifada, usada só no corpo da tela de escrita). **Nunca** reintroduzir a paleta azul antiga (`#3B5F8A`) nem `--aws-orange`/`--aws-dark`/`--gray-*`/Space Grotesk/DM Sans no admin. Marca continua "Marcelo Gonçalves" — nunca usar o nome fictício "IA Decifrada" do protótipo de referência.
- **Tela de escrita (`EditorView.vue`) é full-bleed** — rota top-level fora do `AdminLayout` (`router/index.ts`), sem a sidebar do admin, porque tem sua própria barra superior com "‹ Posts". Capa com upload real (não gradiente decorativo), título/subtítulo `contenteditable` (Enter navega entre campos), sumário lateral construído a partir dos H2/H3 reais do Tiptap, modo foco, pré-visualização full-screen, gaveta de configurações (ícone na barra superior) para os campos que não têm lugar na folha de escrita em si (slug, categoria, SEO, destaques, alt text da capa).
- **Editor rich text:** usar `RichTextEditor` (Tiptap, já instalado em `admin/src/components/tiptap/`) — bubble menu + floating menu + toolbar fixa com callouts/tabelas/YouTube/código já cobrem mais blocos que qualquer protótipo baseado em `execCommand`; não reimplementar do zero. `QuillEditor` (`@vueup/vue-quill`) **não está instalado** — não usar.
- **Toasts:** usar o composable `admin/src/composables/useToast.ts` (`const { toast, showToast } = useToast()`) — nunca declarar `toast`/`showToast` local numa view. Duração única de 2600ms com `clearTimeout` do anterior. Nunca `alert()` ou `window.confirm()` (exceto para guards de navegação).
- **Dirty state:** formulários de edição devem rastrear mudanças com `JSON.stringify` snapshot + `onBeforeRouteLeave` guard.
- **Tipos centralizados:** `admin/src/types/index.ts` — Post, Categoria (inclui `icone_fa?`), Autor, PostStatus. Não redefinir inline.
- **Slug:** usar `slugify()` de `admin/src/utils/slug.ts` — não duplicar a lógica.
- **Listagem de posts (`GET /admin/posts`) — campos exigidos pelo `ProjectionExpression`:** a Dashboard precisa de `categoria_slug`, `imagem_destaque_url`, `tempo_leitura_min`, `e_popular`, `e_projeto` além de `slug/titulo/status/data_atualizacao/autor_id`. Esses 5 campos já estão projetados na GSI `StatusPorData` (`infra/modules/dynamodb/main.tf`) — se algum campo novo for exibido na Dashboard no futuro, checar se ele também está no `non_key_attributes` da GSI antes de assumir que só falta expandir o `ProjectionExpression` do handler.
- **`savePost()` (adminPosts) nunca deve gravar `data_publicacao` vazio** — os GSIs esparsos `PopularesPorData_v2`/`ProjetoPorData_v2` usam esse campo como range key; uma string vazia num atributo de chave de índice (mesmo esparso) é rejeitada pelo DynamoDB assim que `e_popular`/`e_projeto` viram 1. Sempre cair no valor já existente (update) ou `now` (create/nunca teve).
- **Formulário de Categorias preserva campos extras não-expostos** (ex: `icone_fa`, `descricao_seo`) porque `openModal()` faz spread do objeto completo antes de aplicar os campos do form — mas isso não substitui ter um `<input>` visível pra cada campo real usado no frontend público. Ao adicionar um novo campo de categoria consumido em produção, sempre expor no formulário, mesmo que tecnicamente "sobreviveria" ao spread. **`icone_fa` hoje não tem nenhum consumidor no frontend público** (ver backlog §10 item 41) — não assumir que esse dado é exibido em produção.

### CMP — Consent Management (padrões obrigatórios)
- **Consent Mode v2:** `<Script strategy="beforeInteractive">` em `layout.tsx` seta `ad_storage/analytics_storage: denied` ANTES de qualquer script de ads. **Nunca remover.**
- **Storage:** `localStorage['cmp_consent_v1']` com campos `{ essential, analytics, ads, timestamp, version }`. `CONSENT_VERSION` em `frontend/lib/consent.ts` — incrementar invalida consents antigos.
- **Script loader:** stubs comentados em `loadScriptsByConsent()` — descomentar para AdSense e Analytics quando configurados. `Set<string>` previne double-inject.
- **Event bus Footer→Modal:** Footer dispara `window.dispatchEvent(new CustomEvent('openConsentModal'))`. `ConsentManager` ouve. Não usar prop drilling.
- **Páginas legais:** `/politica-de-privacidade`, `/politica-de-cookies`, `/termos-de-uso` — CSS compartilhado em `frontend/app/legal.css`. Conteúdo definitivo aguarda Marcelo.
- **Testes:** `frontend/__tests__/consent.test.ts` com `@jest-environment jsdom` — 17 testes cobrindo storage, versioning e gtag Consent Mode.

### Componentes de layout reutilizáveis (padrões obrigatórios)
- **`Pagination`** — componente único em artigos e o-projeto. Deve ficar **fora** do grid de duas colunas (entre `</grid>` e `<NewsletterCTA />`). Botão "← Anterior" funciona sem `totalPages` via cursor stack. "Página X de Y" só aparece quando `totalPages` é passado.
- **`home-main` (flex column)** — usar `gap: var(--space-4)` + `margin: 0` nos banners. NUNCA combinar gap + margin nos banners — causa duplo espaçamento e margin collapsing em seções vazias.
- **`FullwidthCallout`** — componente único para CTAs fullwidth e inline. Props: `variant` (light/gradient/newsletter/dark/navy), `border`, `size` (md/lg), `rounded` (border-radius 14px — uso dentro de container), `maxWidth`, `icon`, `iconVariant` (light/dark), `title: ReactNode`, `description`, `href`/`ctaText`/`ctaVariant`. `SuperDestaque` é um thin wrapper sobre ele. **Nunca criar nova seção CTA manualmente** — usar este componente. CTA fullwidth de página = `variant="dark"`; CTA inline dentro de container = `variant="navy" rounded`.
- **`PageHero` de coluna única** (sessão 45, 2026-07-15) — toda hero sem `right` (imagem/dado na 2ª coluna) usa a prop `singleColumn`, nunca `--ph-cols`/`--ph-h1-max`/`--ph-sub-max` redefinidos por página. `.page-hero--single` em `PageHero.css` já fixa `--ph-cols: 1fr` + `--ph-h1-max: 32ch` + `--ph-sub-max: 56ch` (o padrão da Home, que usa quase toda a largura da coluna). Motivo: overrides pontuais por página (em `page.module.css`) ficavam com `max-width` bem menor que a coluna real (ex.: 900px numa coluna de 1160px) — texto "sobrava" espaço vazio à direita, e por estar em CSS Module por rota (carregado de forma assíncrona em dev) havia risco de flash com o grid de 2 colunas padrão antes do CSS da rota carregar. Nunca redeclarar essas 3 variáveis numa página nova — só `--ph-pad` é passível de override local. **Sessão 47 (2026-07-18):** `text-wrap: balance` removido de `.page-hero h1` — a Home usava quase toda a largura do `max-width` disponível, mas balance minimiza a largura de títulos mais curtos nas outras páginas (aparência "mais estreita" que a Home mesmo com o mesmo `--ph-h1-max`). Sem balance, todo título preenche a linha até o limite antes de quebrar, igual à Home. O quadriculado das heroes escuras (`::before` com grid+glow) também foi movido pra dentro de `PageHero.css` como default — antes cada página reimplementava a mesma regra (ver histórico em `git log -- frontend/components/ui/PageHero.css`); só `blog.css`/`artigos.css` mantêm overrides próprios (mask/gradiente ligeiramente diferentes, via seletor `.page-hero.<classe>::before` com especificidade maior).
- **`IconTile`** (sessão 47) — selo de ícone reutilizável (referência: ícones dos cards de pilar da Home). Props: `icon`, `size` (default 54), `radius` (default 14), `variant` (`petrol`/`clay`/`glass`), `className`. Usado por `FeatureCard` (prop `icon`) e diretamente na Home; substituiu 3 implementações CSS idênticas (`.ih-pillar-icon`, `.feature-card-icon`, `.svc-icon` — a última removida junto com `/servicos`).
- **`Pill`** (`components/ui/Pill.tsx`, sessão 2026-07-29) — tag/badge mono reutilizável (`<span>`, padding+borda+`border-radius:999px`, cor petrol, `text-transform:uppercase`). Extraído da duplicação em `FeatureCard.css`/`PillarCard.css`/`PostCard.css` e vários `page.module.css` (13 arquivos com a mesma receita). Só props: `children`, `className`. Hoje usado em `/software` (tags de `.solutionTags`); não migrado retroativamente pros outros 12 arquivos — usar sempre que criar uma pill nova, migrar um arquivo existente só se já estiver mexendo nele por outro motivo.
- **`Kicker` / `IndexNumber`** (`components/ui/Kicker.tsx` / `IndexNumber.tsx`, sessão 2026-07-29) — **regra obrigatória, não estilística:** todo rótulo pequeno acima de título de item/card (kicker — diferente de `Eyebrow`, que rotula a seção inteira) e todo número-índice pequeno ao lado dele (tipo `01`/`02`) usam **peso normal (herdado, nunca `font-weight` explícito)** e **cor `--clay`** (ou `--clay` claro via prop `dark` em fundo escuro — `#F0B29A`). `Kicker`: `font-family: var(--mono)`, `letter-spacing:.12em`, uppercase. `IndexNumber`: `font-family: var(--font-numbers)` (ver token abaixo), mesmo tamanho/cor do kicker ao lado. Motivo: esse exato bug (`font-weight:700` num kicker, deixando-o mais pesado que o `Eyebrow` da mesma página) apareceu 3 vezes seguidas em sessões diferentes (`/automacao`, `/inteligencia-artificial`, `/software`) antes de virar componente — sempre porque cada página recriava a classe do zero. **Nunca** declarar `font-weight` num kicker/index-number novo; se `stylelint`/review não pegar isso (a regra de peso não é enforced por lint, só por convenção), conferir visualmente contra o `Eyebrow` da mesma seção. Não confundir com números-índice **grandes** e decorativos (`.principleIndex` de `/automacao`, `--type-display-sm`) — esses continuam com tratamento próprio por página, maior e mais expressivo; `IndexNumber` é só para o par pequeno kicker+número (`--type-caption`).
- **`FaqSection`** (sessão 47) — seção completa de FAQ (eyebrow + título + `Faq` accordion), antes duplicada byte a byte nas 4 landings de pilar. Props: `items` (obrigatório), `eyebrow` (default `"Perguntas frequentes"`), `title` (default `"Dúvidas antes de começar"`), `id` (default `"faq"`), `dataAudit`. Usada nas 4 landings e em `/contato`.
- **`BeneficiosSection`** (`components/ui/BeneficiosSection.tsx`, sessão 2026-07-29) — seção "Benefícios/Resultados" das landings de pilar, **autocontida** (CSS Module próprio, `BeneficiosSection.module.css`) — não recebe mais `classes` prop com CSS de cada página (API antiga, quebrada nesta sessão). Visual: fundo Petrol, `clip-path: inset(0)` (nunca `overflow:hidden` — quebra `position:sticky` de qualquer filho, ver nota abaixo), headline `--type-h1`, checkmark `--clay` sem fundo/caixa colorida (não é mais número nem ícone com box), grade 2 colunas sem bordas visíveis. Props: `id` (default `"beneficios"`), `dataAudit`, `eyebrow` (default `"Benefícios"`), `title`, `description?`, `items` (`string[]`). Usada nas 4 landings de pilar (`/automacao`, `/plataforma`, `/software`, `/inteligencia-artificial` — nesta última, a seção "Resultados esperados" foi migrada e o eyebrow renomeado para "Benefícios", unificando com as outras 3). Eyebrow sempre `--clay` (não usar tom mais claro tipo `#F0B29A`/`#E8A582` — erro que existia em 3 das 4 páginas antes desta unificação).
  - **Pegadinha de `position: sticky` dentro de CSS Grid** (achada tentando aplicar sticky em duas seções de `/software`, `/inteligencia-artificial`): duas causas distintas, confirmadas por medição real (`getBoundingClientRect` em scroll incremental, não só inspeção visual — captura estática não distingue "grudado" de "coincidência de posição"):
    1. `overflow` diferente de `visible` em QUALQUER ancestral (mesmo só `overflow-x`, que o browser computa `overflow-y:auto` automaticamente) quebra sticky, porque cria um novo contexto de scroll. Fix: `clip-path` em vez de `overflow:hidden` pra recortes decorativos.
    2. **Causa mais comum, achada depois:** se o item sticky é filho de um grid SEM `align-items`/`align-self` explícito, o padrão (`stretch`) estica o item pra mesma altura do irmão mais alto — aí não sobra "trilho" nenhum pro sticky se mover (a métrica reveladora: `sticky.offsetHeight === irmão.offsetHeight`). Fix: `align-self: start` no elemento sticky (não precisa de wrapper extra) — ver `.processTitle`/`.abordagemHead` de `/software` como referência funcional confirmada. A ideia antiga de "`align-items` != `stretch` quebra sticky" (registrada numa sessão anterior) era o diagnóstico invertido — mantida aqui só como contexto histórico do erro.
- **`PostCard`** (sessão 30) — `<Link>` wrapper direto, sem `<article>` intermediário. Background `var(--surface-card)`, `border-radius: 20px`, `box-shadow: var(--neu-raised)`. Sem imagem, sem meta row, sem categoria overlay. Título: navy → hover accent. CTA "Ler artigo →" com `margin-top: auto`.
- **Post page `h2` numeração** — feita via CSS counter (`counter-reset` em `.post-content`, `::before` com `decimal-leading-zero`). Box: `48×48px, background: var(--accent-10), border-radius: 16px, color: var(--accent)`. Não requer mudança no Tiptap nem no TSX.
- **`AuthorBox`** — card dark com `background: var(--dark-warm)` = `#1E374C` (navy), avatar quadrado `border-radius: 24px`, eyebrow "Sobre o autor" `font-mono`, `::before` blob azul `blur(60px)`. TSX não muda — só CSS.
- **`TOC` desktop** — container `background: #1E374C` navy, `::before` blob azul como AuthorBox. Eyebrow em `rgba(138,180,232,0.90)`. Items default `#ffffff`; item ativo `rgba(138,180,232,0.90)` + `border-left: 2px solid` mesma cor.
- **`RelatedPostsSection`** (sessão 30) — posicionada DENTRO de `post-footer-safe-zone` após `<AuthorBox>`. 4 posts em grid `repeat(2,1fr)`. Cards: `surface-card` + `neu-raised`, sem imagem.
- **Eyebrows de widgets** — padrão único: traço `::before` (`width: 24px; height: 1px; background: currentColor`) + texto uppercase, `font-size: var(--text-sm)`, `font-weight: 400`. Sem pill/badge.
- **`NewsletterCTA`** — fullwidth com `background: var(--accent)`, overlay `::before` (ember + navy gradients). Grid 2 colunas: texto (eyebrow, H2 cream + `<em>` navy, desc, stats) + form (input cream, botão coral `#E89B8E`). Reescrito baseado em `prot-pre-footer-CTAs.html` opção D.

### Próximas entregas técnicas
9. ✅ **resolvido (2026-08-02)** — cobertura E2E ampliada nas 3 rotas que faltavam fluxo próprio: `/todos-artigos` ganhou testes de paginação real (clicar "Próxima" avança `page`/`nextToken` na URL e troca o primeiro card da grade; "Anterior" volta sem cursor) e busca com termo vazio; `/categoria/[slug]` ganhou um describe novo cobrindo categoria sem posts (slug inventado, sempre `posts=[]`, evita depender de um slug real que pode ganhar posts no futuro e silenciosamente parar de testar o estado vazio) — estado vazio, fallback de título derivado do slug, ausência de paginação; `/post/[slug]` ganhou TOC (clique rola até a heading — `TableOfContents.tsx` faz `preventDefault()`+`scrollIntoView`, não navegação real, então a asserção certa é `toBeInViewport`, não URL), clique em post relacionado, e presença de link funcional no rail de compartilhamento. 30 testes novos, validados localmente em chromium+firefox com `--workers=1` (rodar o suite inteiro em paralelo contra um único dev server sobrecarrega e gera falso-negativo de timeout — não é regressão, é contenção de recurso do ambiente local).
10. **SEO residual** — links sociais reais (#16) e agendamento (#18) — dependem de Marcelo
11. **LQIP (blur placeholder)** — campo novo no DynamoDB + imageProcessor salva base64 tiny
12. **CMP — validar no browser** — testar incognito, DevTools → Application → Storage → `cmp_consent_v1`

### Performance — pendentes da auditoria (sessão 18)
13. ~~GSI projections KEYS_ONLY/INCLUDE~~ ✅ **resolvido** (2026-06-28) — as 5 GSIs (`StatusPorData`, `CategoriaPorData`, `ProjetoPorData_v2`, `PopularesPorData_v2`, `StatusProgramadoPorData`) trocaram `projection_type = "ALL"` por `"INCLUDE"` em `infra/modules/dynamodb/main.tf`. `non_key_attributes` de cada uma foi extraído dos consumidores reais (queries em `getPosts`/`adminPosts`/`postScheduler` + componentes de listagem do frontend, ver registro histórico arquivado (`marcelo-goncalves-blog-arquivo/docs-historico/investigacao-dynamodb.md`)) — nenhuma das 5 precisa de `conteudo_html` (o maior campo, motivo original do achado), `meta_titulo_seo/descricao_seo`, `subtitulo`, `topico` ou `variante_card`. Nenhuma mudança de código em backend/frontend foi necessária (queries não declaram `ProjectionExpression` próprio, exceto `adminPosts`/`postScheduler`, que já pediam exatamente os campos agora incluídos). Não foi necessário recriar a tabela — confirmado via `terraform plan`: a tabela é atualizada in-place; só as 5 GSIs são deletadas e recriadas (mesmas keys, projection nova), com backfill automático da AWS a partir dos itens existentes. 145 testes backend passando.
~~14. **getPostsByCategory: Limit + FilterExpression**~~ ✅ **investigado e esclarecido (2026-08-02)** — não era um bug, o código já estava correto: o comentário em `getPostsByCategory` (`backend/src/functions/getPosts/index.ts`) já documentava deliberadamente por que `FilterExpression` NÃO é usado (contaria itens antes do filtro no DynamoDB, undercount quando há rascunhos na categoria) — o filtro por `status` já acontece em memória após o `Query`, que é o comportamento certo. Adicionar `FilterExpression` teria sido uma regressão, não uma correção. Item fechado sem mudança de código; caso uma categoria acumule muitos rascunhos no futuro (>20, arbitrário) e isso afete paginação na prática, revisitar com uma GSI composta (`categoria_slug` + `status`), mesmo padrão de `StatusPorData`.
15. ~~CloudFront `static/*` TTL explícito~~ ✅ **já implementado** — confirmado em código (`infra/modules/frontend/cloudfront.tf:277-279`, `default_ttl`/`max_ttl` explícitos). Item estava desatualizado no backlog; corrigido na auditoria de performance dedicada (sessão 2026-06-28).
16. **Full-text search (Algolia)** — searchPosts é full table scan O(n). Estratégia decidida (Algolia, não OpenSearch — custo fixo de cluster injustificável para este volume). Plano completo em `contexto/plano-busca-algolia.md`. **Sem gatilho de volume** (decisão 2026-06-28) — entra na fila de prioridades de implementação, não espera 500+ posts.

### Performance — pendentes da auditoria dedicada (`contexto/auditoria-performance/`, sessão 2026-06-28)
21. 🟡 **PRIORIDADE MÁXIMA — `nextjs-server` Duration variável (793ms-1.892ms)** — causa raiz não confirmada (cold start? efeito de `provisioned_concurrency=0` em dev?). Correlacionado 1:1 com LCP médio real fora do threshold "Good" do Core Web Vitals (2.74s, medido via Lighthouse real) **e** com FCP (mesmo TTFB alimenta os dois — runs com `server-response-time` pior, ex. 1.820ms, têm o FCP mais alto entre as 8 execuções reais). Elevado a prioridade máxima em 2026-06-28 (Marcelo) — antes de subir produção e antes de publicar posts reais para validação. SEO/Core Web Vitals é critério de negócio explícito. **Causa raiz parcial encontrada e corrigida em 2026-06-29:** `/post/[slug]` nunca tinha `generateStaticParams` — a rota nunca entrava no sistema de ISR do Next.js, então `export const revalidate = 60` era um no-op silencioso; toda visita era SSR puro, sem possibilidade de cache no CloudFront (`Cache-Control: no-store`, `X-Cache: Miss` em 100% das requisições, confirmado via curl + `prerender-manifest.json` com `dynamicRoutes: []`). Corrigido (`generateStaticParams` enumerando os 13 slugs publicados via `getAllPosts`); validado em produção pós-deploy: `Cache-Control: s-maxage=60` + `X-Cache: RefreshHit from cloudfront` + mesmo `x-amzn-RequestId` repetido em requisições consecutivas (Lambda não é mais reinvocado a cada hit). No caminho, achado e corrigido um bug ativo não relacionado: a policy IAM do `getPosts` não tinha `dynamodb:GetItem` (faltou ao introduzir `postCounters.ts` no item #22), causando 500 silencioso em `/artigos`/`/o-projeto` — ver commit `37b6de7`. **Ainda pendente:** `/artigos` e `/categoria/[slug]` continuam sem cache (leem `searchParams` para paginação, o que força SSR dinâmico independente de `revalidate` — ver item #27). Rebaixado de 🔴 pra 🟡 porque a página de post (a mais visitada/auditada) já está resolvida. **Lighthouse real re-rodado em 2026-06-29** (`contexto/auditoria-performance/04-perf-cwv-pos-fix-isr.md`): em `/post/[slug]` (única página tocada pelo fix), TTFB pior-caso caiu de 1.820ms pra 1.053ms (-42%) e LCP médio de 2.70s pra 2.37s (-12%, cruzando pra dentro do threshold "Good" ≤2.5s em 2 das 3 execuções vs. 1 das 3 antes); `/` e `/artigos` (grupo de controle, não tocados) ficaram dentro da mesma faixa de ruído de antes — confirma que a melhora é causada pelo fix, não coincidência. TBT alto pontual (341ms num run) fica como possível próximo passo, fora do escopo desta rodada.
22. ~~`getAllPosts`/`getProjectPosts`: query duplicada de `COUNT`~~ ✅ **resolvido** — decisão do Marcelo (2026-06-28): manter "Página X de Y" e aplicar a melhor prática (contador atômico), não trocar por paginação sem contagem total. Implementado: `backend/src/common/postCounters.ts` mantém `total_publicado`/`total_projeto_publicado` num item de metadata (`slug = "__METADATA__#posts_counters"`, sparse — não aparece em nenhuma GSI nem na busca). Atualizado via `ADD` atômico em 3 pontos de escrita: `adminPosts.savePost`/`deletePost` (delta calculado a partir do estado anterior, lido via `GetCommand` antes do overwrite) e `postScheduler.publishPost` (transição Programado→Publicado). `getAllPosts`/`getProjectPosts` agora leem o contador via `GetCommand` (1 RCU) em vez de uma 2ª `Query` na GSI inteira. Backfill inicial rodado via `scripts/backfill-post-counters.mjs` (13/13 confirmado contra os dados reais de dev). 145 testes backend passando (+ novos testes de `postCounters.test.ts` e dos 3 pontos de escrita).
23. **Contador atômico (`postCounters.ts`) sem job de reconciliação** — a correção do item #22 depende de todo caminho de escrita que muda `status`/`e_projeto` chamar `computeCounterDeltas`/`applyCounterDeltas`. Hoje isso é garantido só por levantamento manual (`grep` confirmou nesta sessão que só `adminPosts`/`postScheduler` tocam esses campos na tabela `posts`, `imageProcessor` só escreve LQIP) + testes que fixam o comportamento dos 3 pontos atuais — **não há nenhum mecanismo estrutural que impeça um futuro 4º caminho de escrita (nova Lambda, script de bulk-import) de esquecer de atualizar o contador**, nem um job que detecte divergência depois que ela acontecer. Falta: job de reconciliação periódico (recontar via Scan/Query real e comparar com `total_publicado`/`total_projeto_publicado`, alertando ou autocorrigindo se divergir). **Decisão (2026-06-28, registro histórico arquivado (`marcelo-goncalves-blog-arquivo/docs-historico/investigacao-dynamodb.md`) ponto 4):** usar cron + Lambda (mesmo padrão de `postScheduler`/EventBridge), não DynamoDB Streams — Streams resolveria o problema na raiz, mas introduziria um padrão arquitetural novo no projeto para um risco hoje teórico (só 2 Lambdas escrevem `status`/`e_projeto`); reavaliar se esse número crescer. O job seria, na prática, agendar `scripts/backfill-post-counters.mjs` (já faz exatamente o recálculo necessário). Tratar futuramente.
26. ~~Habilitar PITR (Point-in-Time Recovery) no DynamoDB — só em produção~~ ✅ **toggle implementado** (2026-06-28) — confirmado via `aws dynamodb describe-continuous-backups` (registro histórico arquivado (`marcelo-goncalves-blog-arquivo/docs-historico/investigacao-dynamodb.md`) ponto 2): `PointInTimeRecoveryStatus: DISABLED` em dev, correto por decisão explícita do Marcelo, PITR não deve ser ativado em dev. Variável `enable_point_in_time_recovery` criada seguindo exatamente o mesmo padrão de `enable_xray_tracing`/`enable_guardduty`: declarada em `infra/variables.tf` e em `infra/modules/dynamodb/main.tf`, passada via `module "dynamodb"` em `infra/main.tf`, bloco `point_in_time_recovery { enabled = var.enable_point_in_time_recovery }` adicionado nas 3 tabelas (`posts`/`autores`/`categorias`). `dev.tfvars` = `false` (mantém estado atual), `prd.tfvars` = `true`. `terraform fmt`/`validate` confirmados limpos (apply é só via pipeline). Falta apenas: ambiente de produção ser criado e a pipeline aplicar — nenhuma ação local pendente. Custo real quando ativo: ~$0.20/GB-mês em `us-east-1`.
24. ~~**~22-29 KiB de JavaScript não utilizado no bundle do frontend**~~ ✅ **investigado (2026-06-29)** — `ANALYZE=true npx next build --webpack` + inspeção módulo-a-módulo dos 4 chunks principais: o achado literal do Lighthouse (`unused-javascript`) é overhead inerente do runtime React/Next (RSC client runtime, segment cache, server-action-reducer) — não é código removível. **Achado real adjacente, corrigido:** FontAwesome era importado via `@fortawesome/fontawesome-free/css/all.min.css` (CSS de ~2000 ícones, 74KB) para apenas ~22 ícones usados no projeto; além disso `optimizePackageImports` apontava pro pacote CSS (inerte, nunca importado via JS). Migrado para componentes SVG (`@fortawesome/react-fontawesome` + `free-{solid,regular,brands}-svg-icons`), com `config.autoAddCss = false` + import estático de `fontawesome-svg-core/styles.css` (33.2KB, utilitário só — sem glifos). Medido: 22 ícones distintos usados somam 14.7KB de SVG inline (tree-shaken, só os ícones de cada página entram no bundle daquela rota) vs 74KB de CSS bloqueante carregado em 100% das páginas antes — webfonts (`.woff2` solid/regular/brands) também eliminados por completo (zero `@font-face`). Caso especial não-React (`CopyCodeLogic.tsx`, manipulação de DOM puro) usa a API vanilla `icon(faX).html.join('')`. Caso especial de prop dinâmica (`FullwidthCallout.tsx`, `icon="fa-envelope"` string) resolvido via `ICON_MAP` fechado. 16 arquivos de componente/página convertidos; CSS com seletor `i` → `svg` em 5 arquivos (`post.css`, `Breadcrumb.css`, `ShareButtons.css`, `ShareWidget.css`, `SystemStatus.css`). `@next/bundle-analyzer` permanece em `next.config.ts` gated por `ANALYZE=true` para auditorias futuras.
25. **Core Web Vitals/Lighthouse rodado só em mobile, nunca em desktop** — confirmado via `configSettings.formFactor` dos relatórios reais (`.lighthouseci/`): a auditoria PERF-CWV usou o default do Lighthouse/lhci (mobile, viewport 412×823, CPU 4x mais lento, rede simulada ~1.6Mbps) — correto para SEO (Google usa mobile-first indexing), mas significa que nunca medimos a experiência desktop separadamente. Baixo esforço: já existe toda a infraestrutura (`scripts/performance-audit/lighthouse/lighthouserc.json`); falta só rodar de novo com `"formFactor": "desktop"` (config novo ou flag `--preset=desktop`) para ter visibilidade comparativa. Sem urgência de SEO, mas útil para saber se a experiência desktop já está OK ou também precisa de atenção depois do #21.
27. ✅ **resolvido (2026-08-01, achado C3 da auditoria de engenharia)** — diagnóstico via `curl` no ambiente dev mostrou que o quadro tinha mudado desde o registro original: **(a)** `/artigos` foi consertada por efeito colateral da troca de papéis com `/todos-artigos` (deixou de ler `searchParams`, entrou no ISR de verdade — origem emite `s-maxage=300`, CloudFront dá Hit com Age); **(b)** `/categoria/[slug]` e `/todos-artigos` (herdeira da paginação, fora do radar deste item) continuavam `no-store` + Miss em 100% das requisições — o override antigo por `default_ttl` era no-op, porque com `min_ttl=0` o CloudFront respeita o `no-store` da origem. Fix (decisão de Marcelo, opção "forçar na borda"): cache policy customizada `force_edge_300` (min=default=max=300s — única combinação em que o CloudFront cacheia apesar do `no-store`; query string na cache key) nos behaviors de `/categoria/*` e `/todos-artigos`; `/artigos` migrada pra managed `UseOriginCacheControlHeaders-QueryStrings`. Os 3 behaviors saíram de `forwarded_values` (deprecated) pra cache/origin request policies modernas (`AllViewerExceptHostHeader` — Lambda URL rejeita Host forwarding por SigV4). `/todos-artigos` adicionada aos paths de invalidação on-demand nos 3 pontos de escrita (adminPosts/postScheduler) — sem isso o TTL forçado seguraria post recém-publicado por até 5min. **Validado ao vivo pós-deploy** via `curl -I` 2x consecutivas: `/todos-artigos` → `Hit, Age: 29`; `/categoria/[slug]` → `Hit, Age: 52`. **2026-08-02**: o `default_cache_behavior` (rota `*`, cobre todas as páginas SSR) também migrado pra `Managed-CachingDisabled` (mesmo TTL 0/0/0 que já tinha) + `AllViewerExceptHostHeader` — os 4 behaviors do frontend estão todos em policies modernas agora, nenhum resta em `forwarded_values`. **🔴 Regressão achada e corrigida na mesma data, algumas horas depois** (validando Lighthouse desktop): `/artigos` estava retornando **403 `AccessDeniedException` em 100% das requisições**, com **zero invocação da Lambda** (confirmado via CloudWatch — sem `START`/`END`/`REPORT` nos logs de `nextjs-server` na janela do teste) — o erro acontecia na camada CloudFront↔OAC, antes de chegar à função. Causa raiz: a cache policy `UseOriginCacheControlHeaders-QueryStrings` (gerenciada pela AWS, usada por `/artigos` desde a migração acima) tem **`host` na própria whitelist de headers** — headers de cache policy são somados aos do origin request policy no que é enviado à origem, então isso reintroduzia exatamente o Host header incorreto que `AllViewerExceptHostHeader` existe pra excluir, quebrando a assinatura SigV4 do OAC pra Lambda Function URL. `/todos-artigos`/`/categoria/*` nunca tiveram esse problema porque usam a policy customizada `force_edge_300`, que já tinha `header_behavior = "none"`. Fix: nova policy customizada `origin_cache_control_qs_no_host` (`infra/modules/frontend/cloudfront.tf`) — mesma semântica de TTL/query-string da gerenciada, mas sem whitelist de headers — substituindo a gerenciada em `/artigos`. Acabou sendo, na prática, o mesmo padrão que `force_edge_300` já usava, só que respeitando o `Cache-Control` real da origem em vez de forçar 300s fixos. **Validado ao vivo pós-deploy**: `curl -I` → `200`, `X-Cache: Hit from cloudfront`, `Age: 5`, `Cache-Control: s-maxage=300` respeitado — não só o 403 sumiu, o cache ISR passou a funcionar de fato (2 tentativas de apply: a 1ª falhou por `Comment` da cache policy passar do limite do CloudFront (~128 chars), corrigido no commit seguinte).
    **(registro histórico)** `/artigos` e `/categoria/[slug]` sem cache no CloudFront (mesma causa-raiz do #21) — confirmado em 2026-06-29 (mesma investigação do #21): ambas as rotas leem `searchParams` (cursor/`nextToken`/`page` da paginação) diretamente no componente da página, o que força renderização dinâmica no App Router **independente** do `export const revalidate` declarado — `Cache-Control: private, no-cache, no-store` e `X-Cache: Miss from cloudfront` em 100% das requisições, mesmo na página 1 sem query string. Analisadas 3 opções de correção: **(a)** Suspense + Partial Prerendering (PPR) — a forma "correta" no Next.js, mas `experimental.ppr` ainda não tem histórico de produção longo, e exige mover a busca de posts para um componente filho + skeleton de loading, risco médio-alto de regressão visual/funcional; **(b)** paginação path-based (`/artigos/pagina/2`) — exigiria abandonar o cursor opaco do DynamoDB (não é enumerável em `generateStaticParams`) e voltar a paginação por offset, ou pré-computar a cadeia de cursors no build — mudança arquitetural maior, conflita com a decisão já fechada do item #17 (paginação bidirecional cursor-based, escolhida por eficiência de query); **(c)** força de TTL no CloudFront via Terraform (cache behavior override ignorando o `no-store` da origem) — menor risco de código, mas exige incluir `nextToken`/`page`/`prevTokens` na cache key pra não servir a página errada pra usuário errado, e só ajudaria a página 1 (sem query string) — páginas 2+ são únicas por natureza. **Decisão (2026-06-29, Marcelo):** não tocar agora — paginação cursor-based foi decisão recente e deliberada (#17), misturar com ajuste de cache no mesmo dia aumenta risco de um problema mascarar o outro. Tratar como item de backlog próprio, com sessão de validação dedicada.
28. ~~Invalidação de cache sob demanda (CloudFront) — Fase 1~~ ✅ **implementada (2026-06-29)** — `backend/src/common/cacheInvalidation.ts` (novo, mesmo estilo de `postCounters.ts`) chama `cloudfront:CreateInvalidation` via `@aws-sdk/client-cloudfront` nos 3 pontos de escrita (`adminPosts.savePost`/`deletePost`, `postScheduler.publishPost`), sempre `/post/{slug}` + `/` quando a transição afeta o que a home exibe (post passou a ou deixou de contar como Publicado). Best-effort — falha de invalidação só gera `logger.warn`, nunca bloqueia a resposta de save/publish/delete. IAM: `data "aws_caller_identity"` + statement `cloudfront:CreateInvalidation` adicionado a `adminPosts_policy`/`postScheduler_policy`, escopado à ARN da distribution. **Achado de design:** `module.frontend.cloudfront_distribution_id` (output já existia) não pôde ser referenciado diretamente em `module.lambda` — criaria ciclo `lambda → frontend → api-gateway → lambda`. Resolvido com `var.frontend_cloudfront_distribution_id` como valor literal em `dev.tfvars`/`prd.tfvars` (não referência de módulo), com comentário explicando o porquê. 156/156 testes backend passando (11 novos: `cacheInvalidation.test.ts` + asserts nos 3 pontos de chamada em `adminPosts`/`postScheduler`). Plano completo: registro histórico arquivado fora do repo (`marcelo-goncalves-blog-arquivo/docs-historico/plano-cache-invalidation-cloudfront.md`). **Validado ponta a ponta em produção (dev) pós-deploy** — invocação direta do `adminPosts` (resave no-op autorizado explicitamente) confirmou: `200 "Post saved"`, zero erro nos logs, `aws cloudfront list-invalidations` mostra invalidação criada no mesmo timestamp do save com `Paths: ["/post/{slug}"]` (sem `"/"`, correto pra uma edição que já era Publicado), e `curl -I` na página pública confirmou `X-Cache: Miss from cloudfront` imediatamente após — prova de que o cache antigo foi descartado de verdade na borda, não só que a chamada não deu erro. A Fase 2 — infraestrutura completa de on-demand revalidation do Next.js/OpenNext (bucket S3 de cache + tabela DynamoDB de tags + fila SQS + rota webhook `app/api/revalidate` com segredo) — foi **deliberadamente deferida**, mesmo padrão de decisão de #16/#18/#23 (não construir capacidade cara/complexa antes de um gatilho real). Motivo: o OpenNext 3.1.3 hoje só tem cache `/tmp` efêmero por instância Lambda — sem aquela infra, a Fase 1 (CloudFront) já elimina o problema na prática enquanto o tráfego for baixo (2-20 req/dia, `contexto/auditoria-performance/01-perf-load.md`), porque o Lambda raramente fica "quente" entre uma edição e a próxima visita real. **Gatilho explícito pra revisitar:** tráfego real alto o suficiente pra manter o Lambda quente com frequência (o que tornaria o cache interno do OpenNext desatualizado mesmo com o CloudFront invalidado), ou decisão de antecipar antes do lançamento em produção. **Validação possível antes do gatilho:** a correção técnica do mecanismo (não a necessidade) pode ser testada via `k6` em dev simulando carga sustentada pra manter o Lambda quente artificialmente — distinto de validar que o tráfego real justifica a complexidade, que só dá pra saber com dado de produção.

### Baixa prioridade
46. **Sem gate de aprovação antes do `terraform apply` em dev** — achado durante a análise de qualidade do Terraform (sessão 2026-07-31): `cd.yml` roda `terraform apply -auto-approve` direto no push em `develop`, sem nenhum plan revisado por humano antes (nem `deploy.yml`, que roda no PR, executa `plan` — só `fmt`/`validate`/Trivy, sem credenciais AWS). Decisão explícita de Marcelo: **não implementar agora** — dev é o único ambiente hoje, sem tráfego real, e o próprio CD "push em develop dispara deploy" é a filosofia declarada do projeto; adicionar fricção de aprovação manual custaria mais do que protege enquanto só existe esse ambiente. **Gatilho explícito pra revisitar**: ambiente de produção existir de fato — nesse ponto, adicionar plan revisado + approval gate (via GitHub Environments, que `cd.yml` já usa parcialmente — `environment: production` já existe no job, checar se já tem proteção configurada) antes do apply em prod, mantendo dev como está (auto-apply, sem gate).
47. **Nomenclatura mista `camelCase`/`snake_case` no módulo `lambda`** — achado na mesma análise: `aws_lambda_function` usa `snake_case` (`get_post`, `admin_posts`), mas as chaves do `for_each` de IAM role/`local.lambda_role_names` (sessão 2026-07-31, `lambda-iam.tf`) mantiveram o `camelCase` original (`"getPost"`, `"adminPosts"`) para não trocar o `moved` recém-aplicado. Corrigir exige um novo ciclo de `moved` blocks nos mesmos 10 recursos (trocar a chave do map força novo endereço `aws_iam_role.function_role["get_post"]`) — **decisão: não mexer de novo tão cedo no mesmo lugar**, dar um intervalo antes de outro refactor ali. Mesmo padrão de nomenclatura mista existe em menor grau no `api-gateway` (`local.cors_preflight_endpoints`, chaves `snake_case` lá, então não é universal no projeto).
~~48. **Sem README por módulo nem `terraform-docs`, sem `tflint`/`checkov`**~~ ✅ **resolvido (2026-08-02)** — `infra/.tflint.hcl` (ruleset `terraform` + `aws` 0.40.0) rodado recursivamente contra os 10 módulos: 24 achados, todos de baixo risco (mesmo padrão do Stylelint em CSS, §5) — `required_version`/`required_providers` faltando em 9 módulos (só `observability` tinha `versions.tf`; 3 módulos já tinham `terraform.tf` vazio — `admin`/`frontend`/`media` — preenchidos; os demais ganharam `versions.tf` novo), 3 variáveis de `observability` sem `type` declarado, e 1 variável morta (`budget_monthly_limit_usd` em `finops` — nunca consumida por nenhum resource, o `aws_budgets_budget` real é criado manualmente por decisão já documentada no próprio módulo; removida em cascata do módulo, de `infra/main.tf` e de `infra/variables.tf`). Zero achados após as correções; `terraform fmt -check -recursive` e `terraform validate` limpos (1 warning pré-existente em `admin/cloudfront.tf`, não relacionado). README.md gerado via `terraform-docs` (`infra/.terraform-docs.yml`, formato tabela, seção de providers ocultada) nos 10 módulos, com título + 1 linha de descrição prepend manualmente (o gerador não extrai isso sem comentário de cabeçalho nos módulos). Job `3. Validar Infra (Terraform)` em `deploy.yml` ganhou 3 steps novos (`setup-tflint` v6.3.0, cache de plugins, `tflint --recursive`) — no mesmo drive-by, corrigido um bug latente pré-existente nesse job (steps de `terraform init`/`fmt`/`validate` rodavam sem `working-directory: infra`, então nunca encontravam o `.tf`; não pego antes porque `deploy.yml` só dispara em PR contra `main`, raro nesse fluxo de trabalho — `cd.yml`, que dispara a cada push em `develop`, sempre teve o `working-directory` correto). `checkov` avaliado e não adicionado: seria redundante com Trivy `scan-type: config` (já rodando no mesmo job, mesma classe de achado — segurança/config IaC), tflint cobre a lacuna real que faltava (convenções/lint, não segurança).
56. ✅ **resolvido (2026-08-02)** — locking do Terraform state migrado de DynamoDB (`dynamodb_table`) para S3-nativo (`use_lockfile`), achado da auditoria de versões da mesma data (o próprio `terraform init` 1.15.8 já marcava `dynamodb_table` como deprecated). Confirmado localmente antes de tocar no CD: `terraform init`/`plan` reais contra o bucket de dev funcionam tanto em modo dual (`dynamodb_table`+`use_lockfile` simultâneos, caminho de migração documentado pela HashiCorp) quanto standalone (só `use_lockfile`) — lock adquirido e liberado sem erro nos dois casos, nenhum objeto `.tflock` órfão sobrando no bucket depois. Decisão de Marcelo: cutover direto (não dual-mode com bake period) — ambiente é single-admin/dev-only, sem risco real de apply concorrente, e o próprio CD já serializa applies por push em `develop`; dual-mode existiria só pra mitigar um risco que este projeto não tem. Atualizados: `infra/providers.tf` (bloco `backend "s3"` + comentário), `infra/backend.hcl.example`, `infra/backend.hcl` (local, gitignored), os 3 pontos de `-backend-config="dynamodb_table=..."` em `.github/workflows/cd.yml` (dev + 2x prod), e `scripts/bootstrap-state.sh` (parou de criar a tabela DynamoDB pra ambientes futuros). Tabela `marcelo-goncalves-blog-dev-tflock` deletada via AWS CLI (não era gerenciada por Terraform, criada manualmente no bootstrap) — nada mais a referencia. **Ainda pendente**: observar o próximo push em `develop` confirmar que o CD aplica com sucesso usando só `use_lockfile` (validação end-to-end real, não só local) — regra do projeto é `terraform apply` só rodar via pipeline, nunca local.
17. ~~Paginação bidirecional~~ ✅ Implementada em artigos e o-projeto
18. WAF no Admin CloudFront — quando houver tráfego real
~~19. Cognito: migrar `ALLOW_USER_PASSWORD_AUTH` → SRP~~ ✅ **já implementado** — confirmado na auditoria de engenharia 2026-08-01: `explicit_auth_flows` só tem `ALLOW_USER_SRP_AUTH`+`ALLOW_REFRESH_TOKEN_AUTH` (`infra/modules/cognito/main.tf`) e o admin usa SRP por padrão via Amplify v6. Item estava obsoleto no backlog.
51. **MFA no Cognito (TOTP) + Advanced Security Mode** — achado da auditoria de engenharia 2026-08-01 (`contexto/auditoria-engenharia-2026-08.md`): o user pool do admin não tem MFA nem threat protection. Single admin + SRP + senha 12+ mitigam; MFA é o próximo degrau. **Decisão de Marcelo (2026-08-01): deixar em backlog**, não implementar agora.
52. **`/servicos` — mantida** — removida em 2026-08-02 (mesma sessão) e revertida horas depois a pedido de Marcelo ("ainda preciso da `/servicos`"). `frontend/app/servicos/` restaurado via `git revert` do commit de remoção (`29973e5`); `HeaderNav` (trigger + item "Visão geral" do dropdown), `Footer`, e os 3 CTAs "Conhecer os serviços" voltaram a apontar pra `/servicos` como antes. Nenhuma decisão pendente — a página fica.
~~53. **`EditorView.vue` (1143 linhas) e `RichTextEditor.vue` (1146)**~~ ✅ **resolvido (2026-08-02)** — extraídos em 7 composables (`admin/src/composables/usePostForm.ts`, `useTiptapExtensions.ts`, `useTiptapCommands.ts`, `useDrawerFocusTrap.ts`, `useEditorOutline.ts`, `useEditableTitleSubtitle.ts`) + 6 subcomponentes (`components/editor/EditorTopbar.vue`/`SettingsDrawer.vue`/`PostPreviewOverlay.vue`, `components/tiptap/EditorToolbar.vue`/`EditorBubbleMenus.vue`/`EditorFloatingMenu.vue`) + `utils/sanitizeHtml.ts`. `SettingsDrawer`/`PostPreviewOverlay` usam `defineModel` (Vue 3.5) para `form`/`open` em vez de mutação direta de prop, evitando `vue/no-mutating-props`. Refactor puramente estrutural, sem mudança de comportamento — `vue-tsc`/`eslint`/`npm test` (27/27)/`npm run build` limpos. **Não unificado**: `useTiptapCommands` continua duplicado com `buildSlashCommandItems` de `SlashCommand.ts` — assinaturas diferentes (`range` de digitação vs. clique de botão), risco de mudar comportamento não valia o ganho estrutural.
55. **Testes de integração contra DynamoDB Local (2026-08-02) — 5 casos, extensível.** `backend/src/integration/*.integration.test.ts` roda os handlers reais (`adminPosts`/`getPosts`/`postScheduler`) contra uma tabela real (schema espelhado de `infra/modules/dynamodb/main.tf` em `src/integration/setup.ts`) — cobre a classe de bug que testes unitários (mockam `dynamo.send` inteiro) não conseguem pegar: string vazia em range key de GSI, rollback atômico real de `TransactWriteItems`, correção de marker esparso via GSI. Roda via `npm run test:integration` (config separado, `jest.integration.config.js`, nunca dentro do `npm test` normal — `jest.config.js` tem `testPathIgnorePatterns` excluindo `*.integration.test.ts`). CI: novo job `test-backend-integration` em `cd.yml` (gateando deploy-dev/plan-prod, mesmo padrão do `test-admin`) e em `deploy.yml`, com `services: dynamodb` (imagem `amazon/dynamodb-local` pinada por digest, única exceção no projeto a pin-por-SHA de GH Action — Docker Hub não tem o mesmo mecanismo, usado digest do manifest como equivalente). Ao adicionar um novo caminho de escrita transacional, adicionar um teste aqui em vez de só no mock.
54. **Trocar `dlq_alert_email` pro e-mail da empresa quando existir** — as DLQs de imageProcessor/postScheduler (achado C1 da auditoria 2026-08, implementadas 2026-08-01) notificam via SNS o e-mail configurado em `dlq_alert_email` (`infra/env/dev.tfvars` e `prd.tfvars`) — hoje o e-mail pessoal de Marcelo, por decisão explícita dele até a caixa corporativa existir. Quando o domínio/e-mail da empresa estiverem prontos (mesmo gatilho do endpoint de contato), atualizar o valor nos 2 tfvars — a variável já existe justamente pra troca ser 1 linha por ambiente. Considerar trocar `alarm_email`/`budget_alert_email` na mesma passada.
56. **Migrar o locking do Terraform state: DynamoDB (`dynamodb_table`) → S3-native (`use_lockfile`)** — achado durante a validação da migração do Terraform CLI pra 1.15.8 (auditoria de versões, sessão 2026-08-02): o backend S3 (`infra/backend.hcl`/`backend.hcl.example`, 3 pontos em `.github/workflows/cd.yml`) ainda usa a tabela DynamoDB dedicada `marcelo-goncalves-blog-dev-tflock` (não gerenciada por Terraform, criada manualmente no bootstrap) pro locking — mecanismo deprecado desde o Terraform 1.10/1.11 em favor do locking nativo do S3 (`use_lockfile`), confirmado pelo aviso real do `terraform init` (`"dynamodb_table" is deprecated`). Sem prazo de EOL anunciado. **Decisão de tratar como sessão própria**: mexe no mecanismo que protege o state real de dev contra apply concorrente, blast radius diferente de um bump de versão — validar `use_lockfile` local antes de tocar no CD, decidir destino da tabela DynamoDB (apagar ou manter), lembrar que `apply` real só roda via pipeline (validação end-to-end = observar o próximo push em `develop`, não `apply` local). Ver `contexto/auditoria-versoes-2026-08.md` pro contexto completo.
~~20. Preview de imagens no admin (upload pipeline já existe)~~ ✅ **resolvido (2026-08-02)** — `UploadModal.vue` mostra o arquivo selecionado via `URL.createObjectURL(file)` assim que o usuário escolhe o arquivo (antes de terminar o upload — janela que antes não tinha nenhum preview), com overlay "Enviando..." durante o presigned POST. Object URL revogado ao trocar de arquivo ou desmontar o modal (`onBeforeUnmount`) — sem vazamento de memória.
~~29. **Toast de "Publicar" no admin ainda pode passar despercebido**~~ ✅ **resolvido (2026-07-31)** — `publish()` (`EditorView.vue`) aguarda 1400ms após `showToast(...)` antes do `router.push('/')`, tempo suficiente pra ver a confirmação antes da navegação desmontar a view (toast não é singleton, `useToast.ts`).
30. ~~**CSP do admin bloqueia estilos inline que o próprio Tiptap injeta**~~ ✅ **resolvido (2026-07-03, commit `1701b7e`)** — `'unsafe-inline'` adicionado ao `style-src` em `infra/modules/admin/cloudfront.tf`.
31. ~~**`frontend/scripts/create-test-post.mjs` não exercita todos os recursos do editor**~~ ✅ **resolvido (2026-06-30)** — adicionados ao script: negrito/itálico (via seleção + `Ctrl+B`/`Ctrl+I`), lista numerada (input rule `1. `), link (toolbar + `window.prompt` interceptado via `page.once('dialog', ...)`), divisor horizontal, os 4 callouts que faltavam (info/warn/error/ok — "tip" já existia), citação em destaque (pull quote), tabela 3x3 (preenchida via `Tab` entre células) e vídeo do YouTube (mesmo padrão de `dialog` do link). Validação estendida em dois pontos: round-trip do servidor (`reloadedHtml` checa `<strong>`, `<em>`, `<ol>`, `content-link`, `<hr>`, `<table>`, `data-youtube-video`, `pull`, `closing` e `class="callout {tipo}"` exato, confirmado lendo `Callout.ts` → `renderHTML`) e página pública (`<table>`, `<ol>`, `<hr>`, `youtube`). Helper `clickDocEnd()` (clique em `y: 6000` dentro do ProseMirror) resolve o problema de nodes de bloco (tabela/youtube/pullQuote/closingFlourish) deixarem a seleção presa dentro do nó inserido. Não validado em execução real ainda (requer `contexto/creds.txt` e ambiente live) — só `node --check` (sintaxe) confirmado.
32. ✅ **resolvido (2026-08-02)** — upload real de imagem no admin (capa + inline) validado ponta a ponta contra o ambiente real (Cognito real, S3 real, CloudFront real), 5 rodadas até estabilizar. `frontend/scripts/create-test-post.mjs` estava quebrado desde o redesign full-bleed do editor (sessões 39-41) e nunca tinha rodado com sucesso — path de credenciais errado (`docs/creds.txt` → `contexto/creds.txt`) mascarava isso. Reescrito para bater com a UI atual: título/subtítulo são `contenteditable`, não `<input>`; slug/resumo/categoria/SEO/alt-text vivem na gaveta de configurações (`SettingsDrawer.vue`), não numa "main-column"; botão de capa é `.ia-add-cover`/`.ia-cover-btn` na folha do editor, não num painel; status é um radiogroup (`.ia-segmented`), não um `<select>`; "Salvar"/"Publicar" são dois botões distintos (`.ia-btn-save`/`.ia-btn-publish`), e `publish()` já força `status='Publicado'` sozinho. Três bugs reais achados e corrigidos rodando contra produção (dev), não só por leitura de código:
    - **Callout "tip" sem classe "callout"** — `Callout.ts` dá tratamento especial ao tipo `tip` (`wrapperClass = type==='tip' ? 'tip' : 'callout ${type}'`) — só os outros 4 tipos levam o prefixo. O script detectava a inserção do primeiro callout com o seletor errado (`.callout p`, deveria ser `.tip p`).
    - **`clickDocEnd()` ficava preso dentro de nodes "isolating"** — a causa mais séria: clicar perto da borda do último bloco (callout/tabela/citação/vídeo — todos `isolating: true` no schema) mantinha o cursor DENTRO do node em vez de posicionar depois dele. Resultado ao vivo: todo o texto de negrito/lista numerada/link acabou digitado dentro do primeiro callout, um bug em cascata que também derrubava a inserção dos blocos seguintes. Corrigido usando o gap cursor do ProseMirror (`ArrowDown` depois de clicar dentro do último node — Gapcursor vem por padrão no `@tiptap/starter-kit`), que escapa corretamente do node isolating quando ele é o último do documento.
    - **Título digitado caractere-por-caractere embaralhava o texto** — `page.keyboard.type()` num `contenteditable` com acentos + delay entre teclas corrompeu a ordem do texto num teste real (ex.: "Produção: 7 Técnicas Práticas[TESTE] Como..."). Trocado para setar `innerText` de uma vez + disparar `input` — atômico, sem corrida.
    - Também corrigido, sem relação com a UI: `page.evaluate(fn, arg1, arg2)` — a API só aceita 1 argumento extra, "Too many arguments" nunca tinha sido pego porque o fluxo nunca chegava tão longe antes.
    Achado registrado mas não perseguido further (não bloqueia o item): o vídeo do YouTube não aparece no HTML relido logo após o reload do admin, mas a página pública renderiza ele corretamente (confirmado nas últimas rodadas) — parece um gap de round-trip específico do parser do Tiptap (`parseHTML` da extensão de YouTube), não perda de dado real; timing de leitura pós-reload também foi reforçado (espera por `<table` antes de ler) sem eliminar esse achado específico. Também achado e **corrigido na mesma sessão**: os previews de imagem locais (`UploadModal.vue`, via `URL.createObjectURL`, item #20) violavam a CSP do admin (`img-src` não incluía `blob:`) — console error reproduzido em toda run, não bloqueava o upload em si (a imagem final via S3/CDN funcionava), mas era um bug real. Fix: `blob:` adicionado ao `img-src` em `infra/modules/admin/cloudfront.tf`.
~~33. **Slash command (`/`)** do protótipo "Editor de Escrita" não foi implementado~~ ✅ **resolvido (2026-08-02)** — `admin/src/components/tiptap/SlashCommand.ts` (novo, `@tiptap/suggestion` adicionado como dependência direta, `^2.11.0` — alinhado à trava de Tiptap v2 do projeto) + `SlashCommandList.vue` (popup Vue via `VueRenderer`/`tippy.js`, navegação por seta/Enter/Escape, mesmo padrão oficial do Tiptap pra Vue 3). 18 comandos disponíveis (todos os blocos já existentes na toolbar/floating-menu — H2/H3, listas, código, citação, imagem, tabela, YouTube, os 5 callouts, pull quote, closing flourish, divisor, link), reutilizando exatamente a mesma lógica de inserção (`deleteRange` + as mesmas chains). Imagem é o único comando que não duplica lógica — chama a mesma função `emit('request-upload')` que o botão da toolbar já usava, via option `onRequestImage` passada na `.configure()`. `npm audit fix` (sem `--force`) resolveu de brinde as 4 vulnerabilidades que a nova dependência trouxe. **Botão de margem "+" (gutter) do protótipo não foi replicado** — o floating-menu já cobre a mesma necessidade (aparece em linha vazia) e agora o slash command cobre o resto; um terceiro mecanismo pro mesmo fim não pareceu justificado. **Validado ao vivo em produção (dev) pós-deploy** via Playwright contra `https://d11ubkpuy1di6r.cloudfront.net` — login funciona em produção (diferente de localhost, ver `memory/reference_admin_local_dev_env.md`); `/` abriu o menu com os 18 comandos, digitar filtrou em tempo real (`tabela` → só "Inserir tabela"), Enter inseriu a tabela 3x3 removendo o texto `/tabela` da linha. Teste feito num post real (`ia-em-cada-etapa...`) e desfeito via Ctrl+Z + reload sem salvar — confirmado que o guard de dirty-state (`onBeforeRouteLeave`) pediu confirmação antes de descartar, e o post voltou ao estado original ("Salvo", sem a tabela de teste).
~~34. **Acessibilidade da tela de escrita nunca auditada**~~ ✅ **auditado e corrigido (2026-08-02)** — achado original estava parcialmente desatualizado: título/subtítulo `contenteditable` já tinham `role="textbox"`/`aria-label` e os toggles já tinham `role="switch"`/`aria-checked` (implementados em algum momento entre o redesign e agora, sem registro no backlog). Gaps reais encontrados e corrigidos: 2 botões ícone-only na topbar (`title` sem `aria-label` — "Ver no Blog", "Configurações do post"), botão "✕" de fechar a dica de atalhos sem `aria-label`, e o radiogroup de Status (Rascunho/Publicado/Programado) sem roving tabindex — todos os 3 `role="radio"` ficavam focáveis via Tab ao mesmo tempo, fora do padrão ARIA de radiogroup (Tab deveria entrar só na opção marcada, setas movem a seleção). `EditorView.vue`: `onStatusRadioKeydown` novo (setas move + foca), `:tabindex` condicional nos 3 botões.
~~35. Corrigir o pin do Gitleaks Action em `security.yml`~~ ✅ **resolvido (2026-07-12, commit `2ebab67`)** — causa era um typo de 1 caractere no SHA pinado (`...329070c8` em vez do real `...329070c7`, confirmado via `gh api`). Security Scan verde novamente.
~~36. **`<title>` duplicado em `/busca?q=...`**~~ ✅ **resolvido (2026-07-31)** — causa confirmada: `metadata.title` já incluía `SITE_NAME` como string simples, e o `template: "%s | SITE_NAME"` do `layout.tsx` raiz aplicava em cima de novo. Fix: `title: { absolute: ... }` em vez de string simples (mesmo padrão já usado em `/artigos`, `/politica-de-*`, `/termos-de-uso`). Mesma causa achada e corrigida também em `categoria/[slug]/page.tsx` (caso "categoria não encontrada", não estava no achado original).
~~37. **Categoria "Devops Automacao" sem acento/capitalização correta num card do blog**~~ ✅ **resolvido (2026-08-02)** — não era dado de teste, era bug real de renderização: nenhum post no DynamoDB jamais teve o campo `categoria` (join denormalizado) preenchido — `getPosts`/`getPost` sempre retornavam só `categoria_slug`, e o frontend (`categoryName()` em `frontend/lib/format.ts`) caía no fallback de Title-Case do slug (`devops-automacao` → "Devops Automacao", sem "&"/acento — impossível de derivar de um slug ASCII). Corrigido na raiz: novo `backend/src/common/categorias.ts` (`getCategoriaNomeMap`/`attachCategoriaNome`, 1 `Scan` da tabela `categorias` — pequena, ~7 itens, sem paginação) usado por todos os handlers que retornam posts publicamente (`getAllPosts`/`getPostsByCategory`/`getPopularPosts`/`getRecentPosts`/`getProjectPosts`/`searchPosts` em `getPosts/index.ts`, e `getPost/index.ts`, que passou a devolver `{ post, category }`). `getPostsByCategory` também parou de ecoar `category.nome = categorySlug` (mesmo bug, no cabeçalho da página de categoria — embora `/categoria/[slug]/page.tsx` não consuma esse campo hoje, tem seu próprio `CATEGORY_META` estático). IAM: `CATEGORIAS_TABLE` env var + `dynamodb:Scan` adicionados às Lambdas `getPosts`/`getPost` (`infra/modules/lambda/main.tf`/`lambda-iam.tf`). 3 testes novos (backend, 175/175 passando) travando o comportamento.
~~38. **A11y — 4 achados pendentes da auditoria de 2026-06-30**~~ ✅ **resolvido/reavaliado (2026-08-02)** — dos 4: (a) div decorativo (`aria-hidden`) antes do `<h3>` nos cards "mais lidos" corrigido movendo o elemento (`position:absolute`, sem efeito visual) pra depois do heading no JSX (`frontend/app/artigos/page.tsx`, achado originalmente atribuído a `page.tsx`/Home, mas a seção "mais lidos" vive em `artigos/page.tsx`); (b) e (c) — 2 links focáveis pro mesmo post e `div.art-empty` sempre no DOM — não encontrados após varredura de `/artigos`, `/todos-artigos`, `PostCard`, `RelatedPostsSection`, `/o-projeto`: parecem ter sido corrigidos incidentalmente na reescrita de rotas do item #44 (2026-07-27), que antecede este achado; (d) `ConsentModal`/`ConsentManager` já implementa `restoreFocus()` completo (via `previousFocusRef`) em todos os caminhos de fechamento (Escape, clique no overlay, botão fechar, aceitar/rejeitar/salvar) — já estava correto, achado desatualizado.
~~39. **Lighthouse — medir TBT pós-fixes de 2026-06-30**~~ ✅ **remedido (2026-08-02)** — `npx lighthouse@11` direto (não `lhci autorun`, que crasha na limpeza do tmp do Chrome no Windows) contra a Home real (dev), 3 execuções: TBT 27.5ms e 198ms nas 2 que completaram (1 falhou por timeout do Chrome, sem relatório), ambas abaixo do pico de 341ms pré-fix. Detalhe completo em `contexto/auditoria-performance/05-tbt-pos-fixes-2026-06-30.md`.
41. **`icone_fa` (campo de Categoria, admin) sem nenhum consumidor no frontend público** — achado na auditoria de accuracy sweep do CLAUDE.md (sessão 51, 2026-07-23): o doc afirmava que `frontend/components/ui/CategoryBadge.tsx` renderizava esse campo, mas esse componente estava órfão (nunca importado) e foi removido na mesma sessão. Confirmado via grep que `icone_fa` não aparece em nenhum arquivo de `frontend/` — só existe em `admin/src/types/index.ts` e `admin/src/views/CategoriesView.vue` (onde é só editado, nunca lido de volta pro público). Editores podem hoje escolher um ícone por categoria no admin sem efeito nenhum no site. Decidir: implementar a renderização (ex.: badge de categoria com ícone) ou remover o campo do formulário/tipo se a ideia foi abandonada.
40. **Assets de `/sobre` otimizados mas nunca implementados na página** — achado na auditoria de componentes órfãos (sessão 51, 2026-07-23): `assets-source/{logos,badges}/` + `frontend/public/static/{logos,badges}/` têm 44 variantes já otimizadas (AVIF/WebP, 1x/2x, via `scripts/optimize-static-images.mjs`) — logos de empresas/instituições (Accenture, Deutsche Bahn, UFMG, Estácio, Potsdam, anynines, Credisis) e badges de certificação (AWS SysOps, AWS Solutions Architect, Splunk, Terraform). Nenhum é referenciado em `frontend/app/` ou `frontend/components/` — confirmado via grep. Corresponde a uma seção de "empresas/certificações" prototipada em `contexto/sobre-page.jsx` que nunca chegou a ser portada pro `app/sobre/page.tsx` real. `StaticPicture.tsx` (o componente que consumiria essas variantes) foi removido na mesma auditoria por estar órfão — precisa ser recriado (ou algo equivalente) se essa seção for implementada. **Decisão de Marcelo (2026-07-23): deixar em backlog** — não implementar nem apagar os assets por enquanto.
42. **Ajuste 17A (navegação global) — implementado 2026-07-27 com escopo reduzido**, pendências parcialmente resolvidas em 2026-08-02:
    - ✅ **resolvido** — drawer mobile agora tem semântica modal completa: `role="dialog"`/`aria-modal`/`aria-label` no painel, overlay dedicado (`.navMobileOverlay`, fecha ao clicar fora), focus trap real (Tab/Shift+Tab cicla dentro do drawer, mesmo padrão de `trapFocus` do `ConsentModal.tsx`), Escape fecha e devolve foco ao botão trigger, `aria-haspopup="dialog"` no trigger. Validado ao vivo via Playwright (drawer abre, overlay aparece, Escape fecha com foco de volta no botão, Shift+Tab do primeiro item vai pro último — trap confirmado).
    - ✅ **resolvido** — z-index formalizado em escala de tokens (`--z-sticky`/`--z-drawer`/`--z-modal`/`--z-modal-top` em `globals.css`), aplicada aos 4 usos page-level que já existiam (header sticky, drawer, consent banner/modal) sem mudar nenhum valor. `.navIn`/`.foot-in` (z-index 0/1 locais, dentro de containers com `isolation:isolate`) deliberadamente não tokenizados — não competem com o resto da página, só entre si.
    - **ainda pendente**: analytics de navegação (`navigation_primary_click` etc., §37 do ajuste) — não instrumentado, sem GA4 configurado ainda (depende do item #8); configuração de navegação não extraída pra módulo tipado próprio (`lib/navigation.ts`); validação formal (zoom 200%/400%, leitores de tela reais NVDA/VoiceOver/TalkBack, navegação sem JavaScript, todos os breakpoints do ajuste) não executada — fora do que dá pra automatizar nesta sessão.
43. **Ajuste 17B (rodapé global) — implementado 2026-07-27 com escopo reduzido**, pendências parcialmente resolvidas em 2026-08-02:
    - ✅ **resolvido** — "Voltar ao topo" agora é `<a href="#top">` real (fallback funcional sem JS), com `id="top"` no `<body>` (`frontend/app/layout.tsx`); o `scrollTo({behavior:'smooth'})` continua como progressive enhancement via `preventDefault()` no `onClick`.
    - identidade visual do rodapé mantida no tema escuro petróleo/clay já em produção — decisão deliberada, ver texto original abaixo;
    - `mailto:contato@marcelogoncalves.com` exibido sem confirmar se a caixa está operacional — externo, não é algo que se resolve em código;
    - analytics do rodapé (`footer_service_click` etc.) não instrumentado — mesmo motivo do #42 (sem GA4 ainda);
    - validação formal não executada: contraste AA medido, impressão, zoom 200%, leitores de tela, breakpoints completos.
44. **Rotas `/artigos` e `/todos-artigos` trocaram de papel (2026-07-27, a pedido de Marcelo)** — `/artigos` agora é a página inicial curada do blog (destaques, mais lidos, recentes, IA, O Projeto — conteúdo que antes vivia em `/blog`, removida sem redirect); `/todos-artigos` é a listagem completa paginada + busca (conteúdo que antes vivia em `/artigos`). Todos os CTAs "ver todos os artigos"/"todos os artigos" internos (`RelatedPostsSection`, `/o-projeto`, `/categoria/[slug]` estado vazio) foram atualizados pra `/todos-artigos`; breadcrumbs de `/post/[slug]` e `/categoria/[slug]` continuam apontando "Artigos" pra `/artigos` (raiz da seção). Sitemap atualizado (removida entrada `/blog`, adicionada `/todos-artigos`). Pendências:
    - `frontend/e2e/artigos.spec.ts` e `frontend/e2e/visual-audit/artigos.audit.spec.ts` testam contra `/artigos` mas já estavam desatualizados antes desta mudança (referenciam `.art-filterbar`/`.art-chip`, que não existem no código atual) — precisam ser reescritos do zero contra o conteúdo real de cada rota, não só re-apontados;
    - nenhum redirect de `/blog` foi criado (decisão explícita de Marcelo) — qualquer link externo/histórico apontando pra `/blog` cai em 404;
    - `AUTHOR_INSTAGRAM_URL`/outros textos "Blog" residuais em `lib/config.ts` (`BLOG_DESCRIPTION`) não foram renomeados, só reaproveitados — nome da constante ficou desalinhado do papel atual (usada por `/artigos`, não mais por `/blog`).
45. **Revisão visual seção-a-seção (`/servicos`, `/automacao`) — em andamento, protótipos pendentes de implementação:** `automacao-v3.html`, `plataforma.html`/`plataforma.md`, `software.html`/`software.md` (raiz do repo) foram salvos por Marcelo mas ainda não processados — provável continuação da reformulação nas páginas de pilar restantes. Padrão de trabalho: cada protótipo aprova só a(s) seção(ões) citada(s) explicitamente, nunca a página inteira; valores de espaçamento/fonte sempre convertidos pros tokens do projeto (protótipos usam `clamp()`/px cru, que o `stylelint` rejeita); perguntar antes de tocar em componente compartilhado (ex.: `IconLabelSection`, usado em `/automacao`+`/plataforma`+`/software` — a solução em `/automacao` foi uma seção customizada só ali, sem alterar o componente). Pendência conhecida: `automacao-standalone-revisada-v2.html` também contém uma proposta de redesign pra seção "Confiabilidade e controle" (`#confiabilidade`, grid 3 colunas com boxes bordeados) que **não foi implementada** — só as 3 seções pedidas explicitamente (Nossa abordagem, Capacidades técnicas, O que fazemos) foram feitas. **Sessão 2026-07-29:** `/software` "Nossa abordagem" (painel "Antes de construir" + timeline "Como o projeto avança" + "Qualidade e continuidade") implementada a partir de `softwarev4.html`, com refinamento iterativo (ícones em vez de números nos cards de decisão e nos subblocos de qualidade, sempre cor `--clay`; linha de conexão da timeline copiada byte a byte de `/inteligencia-artificial`). Novos protótipos ainda não processados apareceram na raiz nesta sessão: `inteligencia-artificial.html`/`.md`.
49. **Migração completa de CSS Modules concluída (2026-08-01)** — os 39 arquivos `.css` globais legados do frontend foram migrados para `.module.css` (37 migrados via padrão "dual hook" — className plano + classe hasheada no mesmo elemento, pra não quebrar seletores cross-file/E2E — 1 arquivo morto removido). Exceção arquitetural mantida deliberadamente global: `frontend/app/post/[slug]/postContent.css` (`.post-content`/`.post-toc-*`), porque estiliza HTML renderizado pelo Tiptap e persistido no DynamoDB — uma classe hasheada em build-time não pode alcançar conteúdo já publicado. `globals.css` também continua global (tokens de design compartilhados). Suíte E2E (9 arquivos reescritos contra a estrutura real das rotas) caiu de 38 falhas (todas debt de teste desatualizado) para 7 achados genuínos de drift visual, listados abaixo — nenhum é bug de app, todos são divergência prototipo-vs-implementação pré-existente, só agora visível porque o teste passou a comparar a rota certa:
    - `/plataforma`, `/software`, `/automacao`, `/inteligencia-artificial` (as 4 landings de pilar): grid vs. flex nos cards de layout + padding drift em `.op-tl-card`/cards de timeline (protótipo usa `26px 28px`, app usa `0px`/token diferente);
    - `/artigos`: drift de cor em elementos do card de curadoria (`color` diverge entre protótipo e app);
    - `/post/[slug]`: drift de espaçamento fora dos 2 casos já documentados como divergência esperada (backlog social links, margin auto-centering);
    - `/o-projeto`: `.op-tl-card` com `flexDirection`/`gap` divergentes do protótipo (`row`/`24px` no app vs. `column`/`10px` no protótipo), mesma causa-raiz do drift de padding acima.
    Nenhum desses 7 foi corrigido — ficam registrados aqui como pendência de validação visual dedicada (mesmo padrão de decisão do item #45), não como bug a corrigir de passagem.
    **Investigado a fundo em 2026-08-02 (ainda sem correção aplicada — decisão consciente, não esquecimento):** rodei os 5 specs de audit reais (`e2e/visual-audit/*.audit.spec.ts`) contra a Home e as 4 landings de pilar + `/o-projeto`. Achado central: **não são desvios pontuais de 1 token errado** — são diferenças estruturais grandes e consistentes (`display: grid` no app vs `flex` no protótipo, `width` divergindo por centenas de px, `padding` de seção `48px` no app vs `100px` no protótipo, em toda seção de toda landing). Ex. concreto verificado visualmente (`/o-projeto`, `.opTlCard`): o protótipo tem card em coluna (imagem em cima, padding uniforme `26px 28px`), o app tem card em linha (imagem à esquerda 320px, padding só no corpo) — captura de tela confirmou que o layout atual do app é coerente, bem executado e visualmente melhor integrado à lista do que forçar de volta o layout do protótipo seria. Forçar os valores do protótipo de volta arriscaria **regressão visual real em produção**, não correção — exatamente o risco que a nota original deste item já sinalizava ("pendência de validação visual dedicada"). Conclusão: mantido como está, não tratado como bug de código. Requer literalmente o que o texto original pedia — Marcelo decidir, olhando lado a lado, se o protótipo ou o app atual é a referência certa para cada seção, antes de qualquer mudança de CSS.
50. **Reforço da regra de comentário "why not what" (2026-08-01)** — a regra já existia (seção "Conteúdo de comentário de código" acima) mas foi violada nesta mesma sessão: comentários novos escritos em português com referência a sessão/data/decisão foram introduzidos nos 9 specs E2E reescritos no item #49, corrigidos depois de Marcelo apontar a violação. **Reforço prático, não regra nova:** antes de finalizar qualquer PR/commit que adicione comentário novo, rodar `grep -inE "sessão|202[0-9]-[0-9]{2}-[0-9]{2}|decisão de Marcelo|pedido de Marcelo|pedido explícito|CLAUDE\.md §"` nos arquivos tocados — qualquer match num comentário novo (não em comentário pré-existente, esses ficam exemptos até a sessão dedicada) é a mesma violação se repetindo.

---

## 11. Dependências Críticas

| Componente | Versão | Notas |
|---|---|---|
| Next.js | ^16.2.4 | `params` é Promise — `await params` |
| OpenNext | ^3.1.3 | Output: `server-functions/default/` (PLURAL) |
| Tiptap | 2.11.0 | Fixado em v2 — **não migrar para v3** |
| AWS Amplify | ^6.15.8 | Auth via `aws-amplify/auth` |
| Sharp | ^0.33.2 | Build com `--os=linux --cpu=x64` |
| esbuild | ^0.27.0 | `format: 'cjs'` obrigatório |
| Lambda runtime | nodejs22.x | LTS ativo, EOL 30/04/2027 — migrado de nodejs20.x em 2026-08-02 (deadline AWS era 30/09/2026) |
| Terraform | ~> 1.15 | State no S3 — pin alinhado ao CD (1.15.8), ver `infra/providers.tf`. Migrado de `~> 1.8` em 2026-08-02: esse pin nunca travou de fato em 1.8.x (`~>` com 2 componentes libera toda a série 1.x — quem pinava era só o literal no CI); changelog 1.9→1.15 conferido, nenhuma breaking change real. Locking migrado de `dynamodb_table` para `use_lockfile` (S3-nativo) em 2026-08-02 — ver §10 backlog para o racional completo |
| Terraform AWS provider | ~> 6.0 | Migrado de v5 em 2026-08-02 — breaking changes documentadas não tocavam recurso nenhum do projeto (confirmado por `grep`); único achado real foi `response_templates` de `aws_api_gateway_gateway_response` (default da AWS que o v6 passou a tratar como "deveria ficar vazio" — corrigido declarando o valor explícito) |
| GitHub Actions (checkout/setup-node) | v6 (pinado por SHA) | Atualizado de v4 em 2026-08-02 — `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` já resolvido (v6 roda em Node 24 nativamente) |
