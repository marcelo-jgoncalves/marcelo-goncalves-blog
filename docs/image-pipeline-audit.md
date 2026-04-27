# Auditoria da Pipeline de Imagens
> Gerado em: 2026-04-27 | Auditor: Claude (Staff Engineer)  
> Contexto: mobile-first blog brasileiro — performance e SEO são KPIs primários

---

## Fluxo Atual (ponta a ponta)

```
Admin Vue
  └─→ POST /admin/media/upload-url (auth)
      └─→ Lambda mediaUpload → presigned S3 URL (5 min)
  └─→ PUT direto S3 uploads-raw (JPG/PNG)
      └─→ Trigger S3:ObjectCreated
          └─→ Lambda imageProcessor (Sharp)
              → resize(width: 1280, withoutEnlargement: true)
              → toFormat("webp", { quality: 80 })
              → PUT S3 assets — "media/{ts}-{uuid}-{nome}.webp"
              → Cache-Control: public, max-age=31536000, immutable

CloudFront (PriceClass_100)
  └─→ /media/* → S3 assets (TTL min 1d, max 1 ano)
      └─→ Browser recebe 1 arquivo WebP, 1 tamanho (1280px)

Frontend Next.js
  └─→ <Image src={url} fill sizes="...vw" priority />
      → Next/Image gera srcset automático via /_next/image
      → Mas a imagem já é WebP na origem → otimização duplicada/parcial
```

---

## Diagnóstico: O Que Está Bom ✅

- Upload direto ao S3 via presigned URL — correto, não passa pela Lambda no upload
- `Cache-Control: immutable, max-age=31536000` — imagens nunca expiram (nome inclui UUID)
- Sharp com `withoutEnlargement: true` — não estica imagens pequenas
- `quality: 80` — bom equilíbrio entre qualidade e tamanho
- Nomes de arquivo imutáveis (`timestamp-uuid-nome.webp`) — sem conflito de cache
- OAC no CloudFront — S3 privado, só CloudFront acessa

---

## Diagnóstico: Gaps Críticos ❌

---

### GAP 1 — Variante única: zero suporte a mobile 🔴 CRÍTICO

**Estado atual:** A Lambda gera exatamente **1 arquivo** por imagem, com largura máxima de 1280px.

**Impacto:**
- Um usuário em smartphone 390px de largura baixa uma imagem de 1280px.
- Numa imagem típica de capa de post (JPG original ~2MB), o WebP gerado tem ~200-350KB.
- Para mobile, a imagem necessária teria ~30-60KB — **o usuário baixa 5x mais dados do que precisa.**
- Google PageSpeed Insights penaliza isso como "Properly size images" — impacto direto no LCP e no CrUX.
- Core Web Vitals degradados → queda no ranking orgânico.

**O que é necessário:** Gerar múltiplas variantes no processamento (480px, 768px, 1280px) e usar `<picture>` + `srcset` no frontend para servir a variante correta por viewport.

---

### GAP 2 — Formato WebP quando AVIF é o padrão atual 🔴 CRÍTICO

**Estado atual:** Toda imagem é convertida para WebP (lançado pelo Google em 2010, suporte universal desde 2020).

**O problema:** WebP não é mais o estado da arte. AVIF (AV1 Image File Format) é o padrão atual:

| Formato | Tamanho relativo | Suporte browsers | Encode speed |
|---------|-----------------|-----------------|--------------|
| JPEG | 100% (baseline) | Universal | Rápido |
| WebP | ~65-70% do JPEG | 97%+ | Rápido |
| AVIF | ~45-55% do JPEG | 93%+ (Chrome, Firefox, Safari 16+) | Lento |

**Na prática:** Uma imagem de capa convertida para WebP com 200KB teria ~130-150KB em AVIF — **25-35% menor** a qualidade visual equivalente.

**Impacto SEO:** Google considera o formato da imagem como sinal de performance. AVIF pontua melhor em Lighthouse e PageSpeed Insights. A Google já usa AVIF internamente nas imagens do Search.

**Estratégia correta:** Gerar AVIF como formato primário + WebP como fallback para Safari < 16 e outros browsers sem AVIF. O `<picture>` element gerencia isso nativamente no browser.

---

### GAP 3 — CloudFront PriceClass_100 exclui o Brasil 🔴 CRÍTICO

**Estado atual:** `price_class = "PriceClass_100"` no CloudFront da distribuição.

**O que significa:**
- `PriceClass_100` = América do Norte + Europa + Israel.
- `PriceClass_200` = PriceClass_100 + **América do Sul (Brasil)** + Japão + Austrália + Índia.
- `PriceClass_All` = todos os PoPs globais.

**O problema:** O blog é 100% em português, destinado ao público brasileiro. Com PriceClass_100, um usuário em São Paulo que acessa `/media/foto.webp` não está sendo servido pelo PoP de São Paulo (GRU). Ele está sendo roteado para o PoP mais próximo dentro do PriceClass_100, que pode ser Miami ou Ashburn (Virginia).

**Latência estimada:**
- São Paulo → PoP em São Paulo (GRU): ~5-15ms
- São Paulo → PoP em Miami (EUA): ~100-150ms

**Impacto direto:** LCP (Largest Contentful Paint) é frequentemente a imagem de capa do post. 100ms+ de latência adicional apenas para carregar a imagem é uma diferença enorme e visível para o usuário brasileiro.

**Fix:** Mudar para `PriceClass_200`. A diferença de custo é marginal em volumes baixos/médios — CloudFront cobra por GB transferido, não por PoP.

---

### GAP 4 — Sharp ausente das dependências de produção 🔴 CRÍTICO

**Estado atual:** `backend/package.json` tem `"@types/sharp"` em `devDependencies`, mas `sharp` em si **não está em `dependencies`**.

**Impacto:** A Lambda `imageProcessor` provavelmente não tem o sharp disponível em runtime. O build com esbuild pode estar bundlando o sharp (se instalado localmente), mas sharp é uma dependência nativa (binários C++ compilados para Linux x64) — se for bundlada sem o processo correto (`--os=linux --cpu=x64`), a Lambda falha em runtime com erro de módulo nativo.

**Verificação:** O `build.js` já faz `npm install --os=linux --cpu=x64` para o `imageProcessor`? Ou só para as outras Lambdas? Isto precisa ser auditado com urgência.

---

### GAP 5 — Sem blur placeholder (LQIP) 🟡 ALTO

**Estado atual:** Next/Image com `fill` não tem `blurDataURL` configurado. O espaço da imagem fica vazio (branco/transparente) enquanto carrega.

**O que é LQIP:** Low Quality Image Placeholder — uma versão minúscula da imagem (4x4 ou 8x8 pixels, ~50-200 bytes em base64) que é inlined no HTML como blur placeholder. O usuário vê um blur colorido da imagem em vez de um espaço vazio enquanto a imagem carrega.

**Impacto:**
- CLS (Cumulative Layout Shift) menor — o espaço da imagem é reservado visualmente com o blur.
- Percepção de velocidade melhor — o usuário vê conteúdo imediatamente, mesmo que seja blur.
- UX significativamente melhor em conexões lentas (mobile 3G/4G).

**Como implementar:** Gerar o LQIP no `imageProcessor` e armazenar junto com a URL da imagem no DynamoDB, ou gerar na Lambda de upload e retornar no `finalPath`.

---

### GAP 6 — `next.config.ts` remotePatterns muito amplo 🟡 ALTO

**Estado atual:**
```typescript
remotePatterns: [
  { protocol: "https", hostname: "**.cloudfront.net" },
  { protocol: "https", hostname: "**.amazonaws.com" },
]
```

**Problema:** O wildcard `**` permite que Next/Image otimize imagens de **qualquer** distribuição CloudFront ou bucket S3 da AWS — não apenas os do projeto. Isso abre vetor de abuso (alguém pode fazer o servidor Next.js buscar e reprocessar imagens de outras contas AWS).

**Fix:** Especificar os hostnames exatos:
```typescript
remotePatterns: [
  { protocol: "https", hostname: "dsns2wusdrj9z.cloudfront.net" },
]
```

---

### GAP 7 — Next/Image Image Optimization vs CloudFront: responsabilidade duplicada 🟡 ALTO

**Estado atual:** As imagens são WebP no S3/CloudFront. Quando o `<Image>` do Next.js tenta otimizá-las via `/_next/image`, ele recebe um WebP e tenta re-otimizar. O resultado é uma cadeia ineficiente.

**Cenário atual:**
1. Browser pede `/_next/image?url=https://cdn.../media/img.webp&w=640&q=75`
2. Lambda SSR (Next.js) busca `img.webp` do CloudFront (1280px)
3. Next.js re-processa com Sharp: resize para 640px e re-encoda
4. Serve ao browser

**Problema:** Cada request de imagem novo (diferente `w=` ou `q=`) passa pela Lambda SSR, que busca a imagem do CloudFront e reprocessa. Isso tem custo de Lambda + latência adicional.

**Alternativa mais eficiente:** Pré-gerar os tamanhos no `imageProcessor` e servir diretamente do CloudFront sem passar pela Next.js Image Optimization API. Isso elimina a Lambda SSR do caminho crítico das imagens.

---

### GAP 8 — CORS do bucket de uploads muito aberto 🟢 MENOR

**Estado atual:** `allowed_origins = ["*"]` no bucket S3 de uploads.

**Impacto limitado:** O upload requer URL assinada gerada pela Lambda autenticada. Sem a URL assinada, o `AllowOrigins: *` não ajuda um atacante. Mas é má prática e pode ser restringido à URL do admin.

---

## Proposta de Solução: Pipeline de Imagens Responsiva

### Visão geral da arquitetura proposta

```
Admin Upload (sem mudança)
  └─→ PUT S3 uploads-raw (JPG/PNG original)
      └─→ S3 trigger → Lambda imageProcessor (Sharp) [ATUALIZADO]

Lambda imageProcessor — gera 6 arquivos:
  ├─→ media/{nome}-480.avif   (mobile — 480px, AVIF q75)
  ├─→ media/{nome}-480.webp   (mobile fallback — 480px, WebP q80)
  ├─→ media/{nome}-768.avif   (tablet — 768px, AVIF q80)
  ├─→ media/{nome}-768.webp   (tablet fallback — 768px, WebP q80)
  ├─→ media/{nome}-1280.avif  (desktop — 1280px, AVIF q80)
  └─→ media/{nome}-1280.webp  (desktop fallback — 1280px, WebP q80)

DynamoDB — campo imagem_destaque_url:
  Armazena base path: "media/{nome}"
  Frontend constrói as URLs completas

Frontend — <picture> element:
  <picture>
    <source
      media="(max-width: 480px)"
      srcSet="media/{nome}-480.avif"
      type="image/avif"
    />
    <source
      media="(max-width: 480px)"
      srcSet="media/{nome}-480.webp"
      type="image/webp"
    />
    <source
      media="(max-width: 768px)"
      srcSet="media/{nome}-768.avif"
      type="image/avif"
    />
    <source
      media="(max-width: 768px)"
      srcSet="media/{nome}-768.webp"
      type="image/webp"
    />
    <source srcSet="media/{nome}-1280.avif" type="image/avif" />
    <img src="media/{nome}-1280.webp" alt="..." />
  </picture>
```

---

## Backlog Priorizado

| # | Item | Prioridade | Esforço | Impacto |
|---|------|-----------|---------|---------|
| 1 | CloudFront: `PriceClass_100` → `PriceClass_200` | 🔴 CRÍTICO | Baixo (1 linha Terraform) | Latência Brasil |
| 2 | Verificar/corrigir sharp em production dependencies | 🔴 CRÍTICO | Baixo | Lambda imageProcessor funcional |
| 3 | Lambda imageProcessor: gerar variantes mobile (480px) e tablet (768px) | 🔴 CRÍTICO | Médio | Core Web Vitals mobile |
| 4 | Lambda imageProcessor: adicionar AVIF como formato primário | 🔴 CRÍTICO | Baixo (Sharp suporta nativamente) | 25-35% menos dados transferidos |
| 5 | Backend mediaUpload: retornar `basePath` sem extensão | 🟡 ALTO | Baixo | Permite frontend construir URLs por formato/tamanho |
| 6 | Frontend PostCard + PostPage: usar `<picture>` com AVIF + WebP + srcset | 🟡 ALTO | Médio | Mobile UX e Core Web Vitals |
| 7 | DynamoDB: migrar `imagem_destaque_url` para base path | 🟡 ALTO | Médio | Compatibilidade com multi-tamanho |
| 8 | Lambda imageProcessor: gerar LQIP (blur placeholder 8x8 em base64) | 🟡 ALTO | Baixo | CLS e percepção de velocidade |
| 9 | Frontend: usar `blurDataURL` no `<Image>` com o LQIP gerado | 🟡 ALTO | Baixo | CLS e percepção de velocidade |
| 10 | Admin ImageNode.vue: atualizar retry para suportar multi-formato | 🟡 ALTO | Baixo | Consistência com novo pipeline |
| 11 | `next.config.ts`: restringir remotePatterns para hostname exato | 🟢 MENOR | Baixo | Segurança |
| 12 | S3 uploads CORS: restringir `AllowedOrigins` para URL do admin | 🟢 MENOR | Baixo | Segurança |

---

## Estimativa de Ganho por Item

### Item 1 — PriceClass_200
- Latência para usuário brasileiro: -100ms+ em cada request de mídia
- Impacto no LCP: muito significativo (imagem de capa é frequentemente o LCP element)

### Item 3 + 6 — Variantes mobile
- Payload mobile: de ~200-350KB para ~30-60KB por imagem de capa
- Redução: 80-85% em dados transferidos para mobile

### Item 4 — AVIF
- Payload vs WebP: -25-35% por imagem a qualidade visual equivalente
- Ex: imagem desktop de 300KB WebP → ~200KB AVIF

### Combinado (itens 1+3+4):
- Usuário mobile hoje: ~350KB + latência EUA
- Usuário mobile após: ~40KB AVIF + latência Brasil
- **Redução estimada: 88-90% em dados + -100ms latência**

---

## Considerações de Implementação

### Compatibilidade retroativa
Os posts existentes têm `imagem_destaque_url` com a URL completa do WebP (ex: `https://cdn.../media/ts-uuid-nome.webp`). A migração para base path precisa:
1. Lambda imageProcessor gerar variantes para novas imagens
2. Frontend detectar se a URL é "antiga" (termina em `.webp`) ou "nova" (base path) e renderizar `<img>` simples ou `<picture>` respectivamente
3. Script de migração opcional: reprocessar imagens existentes

### AVIF e tempo de encode
Sharp com AVIF é mais lento que WebP (3-10x). Para a Lambda com memória de 1024MB:
- WebP 1280px: ~200-500ms
- AVIF 1280px: ~1-3s
- 6 variantes (3 AVIF + 3 WebP): ~5-10s total

O timeout atual é 60s — suficiente. Mas se o volume de uploads crescer, considerar paralelizar as conversões com `Promise.all()` dentro da Lambda.

### Sharp e binários nativos
Sharp usa binários C++ compilados. O `build.js` já instala com `--os=linux --cpu=x64` para as Lambdas que precisam de processamento de imagem. Verificar que o `imageProcessor` está incluído nesse processo.

---

## Progresso das Implementações

| # | Item | Status | Data |
|---|------|--------|------|
| 1 | CloudFront PriceClass_200 | ✅ feito | 2026-04-27 |
| 2 | Sharp em devDependencies (testes) | ✅ feito | 2026-04-27 |
| 3 | Variantes mobile/tablet no imageProcessor | ✅ feito | 2026-04-27 |
| 4 | AVIF no imageProcessor | ✅ feito | 2026-04-27 |
| 5 | mediaUpload retorna basePath | ✅ feito | 2026-04-27 |
| 6 | Frontend: componente ResponsiveImage + picture + srcset | ✅ feito | 2026-04-27 |
| 7 | DynamoDB: novos posts já gravam basePath via EditorView | ✅ feito | 2026-04-27 |
| 8 | LQIP no imageProcessor | ⏳ pendente — requer campo novo no DynamoDB | — |
| 9 | blurDataURL no frontend | ⏳ pendente — depende do item 8 | — |
| 10 | Admin ImageNode: atualizado (inline usa -1280.webp) | ✅ feito | 2026-04-27 |
| 11 | remotePatterns exato (hostname específico) | ✅ feito | 2026-04-27 |
| 12 | S3 CORS restrito | ⏳ pendente — baixa prioridade | — |
