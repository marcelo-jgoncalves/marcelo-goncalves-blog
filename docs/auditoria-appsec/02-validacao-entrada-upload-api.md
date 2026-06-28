# Auditoria AppSec — Categoria 2: Validação de Entrada, Upload de Arquivos e Segurança de API

> Data: 2026-06-28
> Referência: OWASP ASVS V5 (Validação de Entrada), V12 (Arquivos), OWASP API Security Top 10 2023
> Escopo: `backend/src/functions/adminPosts`, `adminAuthors`, `adminCategorias`, `mediaUpload`, `backend/src/common/sanitizer.ts`.
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. ~~`adminAuthors` persiste `bio` sem nenhuma sanitização — stored XSS real no blog público~~ — ✅ corrigido

`backend/src/functions/adminAuthors/index.ts:65-75` monta o item a salvar com `bio: data.bio` direto do corpo da requisição. O comentário no código diz "Sanitização básica e mapeamento" — mas **não há nenhuma chamada de sanitização**, nem `sanitizePostHtml()` nem qualquer outra. Isso viola diretamente a regra não-negociável do próprio `CLAUDE.md` (seção 4): *"Sanitização HTML via `backend/src/common/sanitizer.ts` em `savePost()` — nunca persistir HTML bruto."* — a regra existe e é seguida em `adminPosts`, mas não em `adminAuthors`.

O campo `bio` é renderizado como HTML bruto em dois lugares do blog público:
- `frontend/components/post/PostFooter.tsx:24` — `<span dangerouslySetInnerHTML={{ __html: author.bio }} />`
- `frontend/components/ui/AuthorBox.tsx:45` — `dangerouslySetInnerHTML={{ __html: autor.bio }}`

Ambos aparecem no rodapé de **todo post publicado** e na página `/sobre`. Qualquer HTML/JavaScript salvo em `bio` executa no browser de qualquer visitante do site — um stored XSS clássico, na superfície de maior exposição do projeto (tráfego público, não autenticado).

**Por que isso é alto impacto mesmo sendo só 1 admin:** combina diretamente com o achado #1 da Categoria 1 (sem MFA, login só por senha) — se a única conta admin for comprometida, o atacante não precisa de mais nada além de editar o próprio perfil de autor para obter execução de script contra todo visitante do blog.

**Correção aplicada:** `backend/src/functions/adminAuthors/index.ts` agora chama `sanitizePostHtml(data.bio ?? "")` antes do `PutCommand`, mesmo padrão já usado em `adminPosts`. `PostFooter.tsx`/`AuthorBox.tsx` continuam usando `dangerouslySetInnerHTML` (correto agora que a fonte é sanitizada) — anotados com `nosemgrep` + justificativa para não quebrar o novo gate de Semgrep (Categoria 5).

## 🟡 Achados de impacto médio

### 2. ~~Mass assignment em `savePost` — payload do client é espalhado quase sem filtro~~ — ✅ corrigido

`backend/src/functions/adminPosts/index.ts:131-145`:
```ts
const item: Post = {
  ...data as Post,
  conteudo_html: sanitizePostHtml(data.conteudo_html ?? ""),
  data_atualizacao: now,
  data_publicacao: isNew ? (data.data_publicacao || now) : data.data_publicacao!,
  e_popular: ePopular,
  e_projeto: eProjeto,
  e_popular_marker: ePopular === 1 ? "POP" : undefined,
  e_projeto_marker: eProjeto === 1 ? "PROJ" : undefined,
  tempo_leitura_min: Number(data.tempo_leitura_min || 5)
};
```
`...data as Post` espalha o corpo inteiro da requisição no item persistido — `data as Post` é só uma asserção de tipo TypeScript, não uma validação em runtime. Qualquer campo extra enviado pelo client (inclusive um nome de atributo que nenhuma tela do admin jamais envia) é persistido sem checagem. A validação de campo obrigatório existe (`slug`, `titulo`, `autor_id`), mas não há allowlist do que é aceito — é blocklist implícita (só os campos explicitamente sobrescritos depois do spread são "seguros").

Risco prático hoje é baixo (rota já protegida por Cognito, só 1 admin), mas é exatamente o tipo de gap que ASVS V5.1.1 (validação positiva/allowlist) pede para fechar antes que a superfície de quem pode chamar essa rota cresça (ex: um segundo usuário admin, ou uma integração futura).

**Correção aplicada:** `backend/src/common/postSchema.ts` define um schema `zod` que espelha `common/types.ts` — `savePost()` agora chama `postInputSchema.safeParse(rawData)` e retorna 400 em caso de falha. `.object()` do zod já descarta (strip) qualquer chave fora do schema por padrão, eliminando o `...data as Post` blind spread. Testado: campo desconhecido (`isAdmin`) e `e_popular_marker` (campo derivado, nunca aceito do client) confirmados ausentes do item persistido; `e_popular: 2` (fora do domínio 0/1) corretamente rejeitado com 400.

### 3. ~~`mediaUpload` aceita `Content-Type` do client sem allowlist e sem limite de tamanho~~ — ✅ corrigido

`backend/src/functions/mediaUpload/index.ts:26,50`: `tipo_arquivo` vem direto do body da requisição e é usado como `ContentType` no `PutObjectCommand` que gera a URL pré-assinada — sem checar contra a lista de formatos aceitos (`CLAUDE.md` seção 6 lista PNG/JPEG/WebP/HEIC/HEIF como os únicos aceitos, mas o Lambda não aplica esse allowlist). Também não há nenhum limite de tamanho de arquivo na URL pré-assinada (`getSignedUrl` não define `ContentLengthRange` via policy condition).

**Correção aplicada (parte 1, sessão anterior):** allowlist de `Content-Type` adicionado (`ALLOWED_CONTENT_TYPES`, rejeita com 400 qualquer valor fora de PNG/JPEG/WebP/HEIC/HEIF).

**Correção aplicada (parte 2):** `mediaUpload` migrado de presigned PUT (`PutObjectCommand` + `getSignedUrl`) para presigned POST (`createPresignedPost` de `@aws-sdk/s3-presigned-post`), com `Conditions: [["content-length-range", 0, 10MB], ["eq", "$Content-Type", tipo_arquivo]]` — o S3 agora valida e rejeita o upload no próprio servidor se o arquivo exceder 10MB, em vez de depender só do limite client-side já existente em `UploadModal.vue`. `admin/src/services/api.ts` (`mediaApi.uploadToS3`) e `UploadModal.vue` atualizados para enviar `FormData` com os `fields` retornados, em vez de um `PUT` simples.

### 4. ~~Nenhuma biblioteca de validação de schema no backend~~ — ✅ corrigido

`backend/package.json` não tinha `zod`/`joi`/`yup`/equivalente — confirmado por busca direta. A validação de entrada em cada Lambda era manual e inconsistente: alguns checavam só presença de campo (`if (!data.slug || !data.titulo || !data.autor_id)`), nenhum validava tipo, formato ou tamanho máximo de string. Isso era a causa raiz dos achados #2 e #3.

**Correção aplicada:** `zod` adicionado como dependência; `backend/src/common/postSchema.ts` é o primeiro schema centralizado do projeto, usado em `savePost()`. Os demais Lambdas (`adminAuthors`, `adminCategorias`) continuam com validação manual — ficou fora do escopo desta rodada por serem superfícies menores (poucos campos, sem o histórico de mass assignment que motivou o fix em `adminPosts`); considerar estender o padrão a eles numa próxima sessão.

## 🟢 Pontos positivos (manter)

- `backend/src/common/sanitizer.ts` continua sendo um allowlist sólido para `conteudo_html` (tags/atributos explícitos, schemes restritos, `allowedIframeHostnames` corrigido na sessão 52) — o problema não é a ferramenta, é a ferramenta não ser aplicada uniformemente em todos os Lambdas que persistem HTML.
- `uploads-raw` privado (public access block) mitiga boa parte do risco prático do achado #3.
- Todas as rotas de mutação (`adminPosts`, `adminAuthors`, `adminCategorias`, `mediaUpload`) exigem Cognito — a superfície de quem pode explorar os achados acima já está reduzida à única conta admin (o que, por sua vez, é exatamente por que o achado #1 desta categoria se conecta tão diretamente ao achado #1 da Categoria 1).

## Resumo

O achado #1 (stored XSS via `bio`) é o mais sério desta auditoria até agora — é uma violação direta e concreta de uma regra que o próprio projeto já havia estabelecido como não-negociável, só não aplicada de forma consistente em todos os Lambdas que persistem HTML. Os demais achados (mass assignment, upload sem allowlist/limite, falta de lib de validação) têm risco prático menor hoje (single-admin, bucket privado), mas são a mesma causa raiz: ausência de uma camada de validação de entrada centralizada e consistente.
