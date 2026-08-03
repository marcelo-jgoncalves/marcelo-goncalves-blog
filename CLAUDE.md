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

- **DRY** — motivação por trás dos componentes reutilizáveis do design system (`Pill`, `Kicker`/`IndexNumber`, `IconTile`, `FaqSection`, `BeneficiosSection`, `FullwidthCallout`, ver `docs/backlog.md`). Contrapeso deliberado: CSS legado duplicado (177 arquivos `.css` globais, ex-sistemas de botão) **não é migrado retroativamente** só por causa de duplicação — risco de regressão visual maior que o ganho.
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
├── infra/       # Terraform — 10 módulos AWS
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
- **`StaticPicture.tsx` (removido, sessão 51)** — existia pra consumir essas variantes via `<picture>` com `srcSet` de densidade (`1x, 2x`), AVIF→WebP fallback, mas nunca chegou a ser usado em nenhuma página real (ver `docs/backlog.md` item 40) e foi deletado por estar órfão. Se a seção de logos/badges do `/sobre` for implementada no futuro, recriar um componente equivalente antes de consumir essas variantes — não existe hoje.
- **`assets-source/`** (raiz do repo, fora de `frontend/public/`) guarda os PNGs originais de alta resolução — nunca comitar arquivo-fonte não otimizado dentro de `frontend/public/static/`, só o output do script.
- Fotos de pessoas/conteúdo (avatar, hero) continuam pelo fluxo normal de upload (`imageProcessor`) mesmo se vierem de um arquivo local — sobem direto pro bucket `uploads-raw` (mesma convenção de key do admin: `{YYYY}/{MM}/{DD}/{timestamp}-{random}-{nome}`) em vez de virar asset estático.

---

## 7. Testes

| Workspace | Runner | Comando | Total |
|---|---|---|---|
| `backend/` | Jest | `npm test` | 208 testes |
| `backend/` | Jest + DynamoDB Local | `npm run test:integration` | 10 testes (handlers reais contra DynamoDB real — ver `src/integration/`, `docs/backlog.md` item 55) |
| `frontend/` | Jest | `npm test` | 81 testes |
| `admin/` | Vitest | `npm test` | 43 testes |
| `frontend/` | Playwright | `npm run test:e2e` | 93 testes, 19 specs (smoke, home-layout, post, artigos, todos-artigos, busca, categoria, sobre, projeto, spacing-role, typography-role, visual-audit), rodando em Chromium + Firefox |

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
| `CLAUDE.md` | Regras de projeto duráveis: arquitetura, design system, gotchas críticos | Backlog técnico (vive em `docs/backlog.md`, única lista); narrativa de sessão, "o que fizemos hoje" |
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

Backlog técnico único do projeto: ver [`docs/backlog.md`](docs/backlog.md) (extraído daqui em 2026-08-02, reorganização de documentação — item P2.5 da auditoria de qualidade). Regras/arquitetura/design system deste arquivo continuam valendo; `docs/backlog.md` só tem a lista de itens de trabalho.

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
| Terraform | ~> 1.15 | State no S3 — pin alinhado ao CD (1.15.8), ver `infra/providers.tf`. Migrado de `~> 1.8` em 2026-08-02: esse pin nunca travou de fato em 1.8.x (`~>` com 2 componentes libera toda a série 1.x — quem pinava era só o literal no CI); changelog 1.9→1.15 conferido, nenhuma breaking change real. Locking migrado de `dynamodb_table` para `use_lockfile` (S3-nativo) em 2026-08-02 — ver `docs/backlog.md` para o racional completo |
| Terraform AWS provider | ~> 6.0 | Migrado de v5 em 2026-08-02 — breaking changes documentadas não tocavam recurso nenhum do projeto (confirmado por `grep`); único achado real foi `response_templates` de `aws_api_gateway_gateway_response` (default da AWS que o v6 passou a tratar como "deveria ficar vazio" — corrigido declarando o valor explícito) |
| GitHub Actions (checkout/setup-node) | v6 (pinado por SHA) | Atualizado de v4 em 2026-08-02 — `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` já resolvido (v6 roda em Node 24 nativamente) |
