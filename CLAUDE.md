# CLAUDE.md — Blog Marcelo Gonçalves

> Carregado automaticamente em toda sessão. Leia antes de qualquer ação.

---

## 1. Contexto do Projeto

Blog de autoridade sobre IA, AWS e DevOps. Propósito: AdSense + leads para consultoria.  
**Owner:** Marcelo Gonçalves (PM/Arquiteto) — você é o Staff Engineer.

**Ambiente ativo:** apenas `dev`. Produção não existe ainda.  
**Branch de trabalho:** `develop` — todo trabalho vai aqui. `main` = snapshot estável.

### Sistema ao vivo (dev)
| Serviço | URL |
|---|---|
| Blog público | `https://dsns2wusdrj9z.cloudfront.net` |
| Admin Vue | `https://d11ubkpuy1di6r.cloudfront.net` |
| API Gateway | `https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1` |
| Pipeline CD | GitHub Actions → develop ✅ verde |

### Arquivos de contexto obrigatórios
- **`.project-context.md`** — memória viva do projeto. Leia a seção "⚡ PRÓXIMA SESSÃO" ao iniciar.
- **`docs/contract.md`** — padrões de engenharia não-negociáveis (logging, SEO, design system, segurança).
- **`docs/audit-report.md`** — histórico de dívida técnica e o que foi resolvido.
- **`docs/seo-audit.md`** — status de 20 itens SEO (16/20 feitos).

---

## 2. Modo de Operação

Você atua como **Autonomous Staff Engineer**, não como assistente passivo.

- Marcelo fornece direção estratégica e decisões de produto.
- Você detecta problemas, planeja, implementa, valida e commita.
- Nunca acumule trabalho não validado. Um ciclo só termina quando: testes passam + pipeline verde + `.project-context.md` atualizado.
- Prefira muitos ciclos pequenos a mudanças grandes.

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

---

## 3. Arquitetura

```
marcelo-goncalves-blog/
├── frontend/    # Next.js 16 + OpenNext v3 (blog público)
├── backend/     # Node.js 20 + TypeScript — 9 Lambdas
├── admin/       # Vue 3 + Vite + Pinia + AWS Amplify (CMS)
├── infra/       # Terraform — 7 módulos AWS
└── docs/        # Documentação viva do projeto
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
- `NEXT_PUBLIC_API_URL`: injetado em runtime via Lambda env var. Build usa placeholder `https://build-placeholder.local`. Validação dentro de `getApiUrl()`.
- Admin (`VITE_*` vars): baked no build — o CD builda o admin **após** terraform apply outputs.

### Segurança / CORS
- Lambda URL: `authorization_type = "AWS_IAM"` + OAC SigV4. Só CloudFront pode invocar.
- `ADMIN_ORIGIN = "https://${module.admin.cloudfront_url}"` — definido via Terraform, não hardcoded.

### SEO — proteção dev
- `app/robots.ts` e `app/layout.tsx` detectam `SITE_URL.includes('cloudfront.net')` e emitem `Disallow: /` + `noindex, nofollow`.
- **Nunca remover** essa lógica sem confirmar que `SITE_URL` é o domínio definitivo.
- Toda constante de SEO vive em `frontend/lib/config.ts` — nunca repetir URL ou nome do blog em string literal.

---

## 5. Design System (não-negociável)

### Fontes
| Variável CSS | Fonte | Uso |
|---|---|---|
| `--font-display` | DM Sans | Headings, UI, botões, nav |
| `--font-sans` | Inter | Body, parágrafos |
| `--font-mono` | JetBrains Mono | Código |

**Nunca** usar `Space Grotesk` — foi removido.

### Paleta
```css
--accent: #3B5F8A        /* Classic Blue — CTA, links, ativo */
--accent-hover: #2D4F76
--accent-light: #EBF1F8
--dark-900: #111827      /* Headings */
--dark-700: #374151      /* Body text */
--slate-50:  #F8FAFC     /* Page bg */
--border-color: #E2E8F0
```

**Nunca** usar `--aws-orange`, `--aws-dark`, `--gray-*` — foram removidos.  
Referência completa: `docs/design-system/design-reference.md`.

### Logo
```
Marcelo    → color: var(--dark-900)  — DM Sans 700
Gonçalves  → color: var(--accent)   — DM Sans 700
```

---

## 6. Imagens (pipeline obrigatória)

- **Upload**: formatos aceitos = PNG, JPEG, WebP, HEIC, HEIF. Extensões maiúsculas normalizadas automaticamente.
- **imageProcessor** gera 6 variantes por upload: `{base}-480.avif`, `{base}-480.webp`, `{base}-768.avif`, `{base}-768.webp`, `{base}-1280.avif`, `{base}-1280.webp`.
- **Nunca** renderizar imagens de conteúdo com `<Image>` Next.js diretamente — usar `<ResponsiveImage>` (`frontend/components/ui/ResponsiveImage.tsx`).
- `imagem_destaque_url` no DynamoDB: basePath sem extensão (novos posts) ou URL `.webp` (retrocompat).
- Alt text: nunca string vazia — fallback mínimo = título do post.

---

## 7. Testes

| Workspace | Runner | Comando | Total |
|---|---|---|---|
| `backend/` | Jest | `npm test` | 96 testes |
| `frontend/` | Jest | `npm test` | 45 testes |
| `admin/` | Vitest | `npm test` | 16 testes |
| `frontend/` | Playwright | `npm run test:e2e` | smoke tests |

- `tsconfig.test.json` separado no backend com `"types": ["jest"]`.
- `npm audit --audit-level=high` roda em cada job de CI. Zero high/critical tolerado.
- Admin: 11 moderate residuais em aws-amplify@6 — aceito como risco conhecido (fix exige downgrade breaking para v5).

---

## 8. Commits e Pipeline

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
| `/servicos` | `ProfessionalService` |
| Novas listagens | `BreadcrumbList` |

---

## 10. Backlog Atual

### Aguarda ação de Marcelo
1. **Seed de categorias** — logar no admin e criar via UI (Cognito: `us-east-1_EuJTxL0vs`)
2. **URLs sociais reais** — LinkedIn, GitHub, Instagram para footer e author box
3. **Favicon + Web App Manifest** — bloqueiam 4/20 itens SEO
4. **Ferramenta de agendamento** — Calendly ou similar para CTA em /servicos
5. **`NEXT_PUBLIC_SITE_URL`** — configurar via Terraform quando o domínio definitivo estiver pronto

### Próximas entregas técnicas
6. **Design system — componentes visuais restantes** — PostCard, Hero, CategoryCard, CTA, newsletter widget (tokens já aplicados; visuais detalhados das seções pendentes)
7. **Testes E2E Playwright** — expandir `e2e/smoke.spec.ts` com golden path (home, post, busca, categoria)
8. **SEO residual** — favicon, manifest, links sociais (depende de assets de Marcelo)
9. **LQIP (blur placeholder)** — campo novo no DynamoDB + imageProcessor salva base64 tiny

### Baixa prioridade
10. Paginação bidirecional — limitação DynamoDB
11. WAF no Admin CloudFront — quando houver tráfego real
12. Cognito: migrar `ALLOW_USER_PASSWORD_AUTH` → SRP
13. Preview de imagens no admin

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
| Terraform | ~1.14 | State no S3 |
| Node.js Actions | — | `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` (deadline Jun 2026) |
