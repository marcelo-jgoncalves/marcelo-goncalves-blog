import { z } from "zod";

// Matches admin/src/utils/slug.ts's slugify() output (lowercase, \w-derived
// segments joined by single hyphens): underscore is allowed because
// slugify()'s `\w` character class doesn't strip it, even though every real
// slug observed in production is plain alphanumeric-hyphenated.
const SLUG_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

export const POST_STATUSES = ["Publicado", "Rascunho", "Programado"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

// A bare `new Date(raw)` accepts far more than ISO 8601 (RFC 2822, plain
// "2026-08-02", the admin's own datetime-local shape without a timezone
// suffix), which is why this stays a runtime check instead of a regex: the
// goal is "does this resolve to a real instant", not "is this one specific
// string shape".
function parseScheduledDate(raw: string): Date | null {
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// Only enforced when status is actually "Programado": a post that already
// went through postScheduler keeps its now-past data_publicacao_programada
// forever (publishing never clears the field), so a blanket "must be in the
// future" check would 400 on every later edit of an already-published post.
function validateScheduledDate<T extends { status?: PostStatus; data_publicacao_programada?: string | null }>(
  data: T,
  ctx: z.RefinementCtx,
) {
  if (data.status !== "Programado") return;

  if (!data.data_publicacao_programada) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["data_publicacao_programada"],
      message: "A scheduled post requires data_publicacao_programada.",
    });
    return;
  }

  const parsed = parseScheduledDate(data.data_publicacao_programada);
  if (!parsed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["data_publicacao_programada"],
      message: "data_publicacao_programada must be a valid date.",
    });
    return;
  }

  if (parsed.getTime() <= Date.now()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["data_publicacao_programada"],
      message: "data_publicacao_programada must be in the future.",
    });
  }
}

// Normalizes whatever parseable shape data_publicacao_programada arrived in
// (the admin's datetime-local value, a round-tripped ISO string, ...) to a
// full UTC ISO 8601 string. postScheduler compares this field against
// `new Date().toISOString()` as a plain string (StatusProgramadoPorData
// GSI range key), that only sorts correctly if every value written here is
// the same format. Left untouched when unparseable so a non-"Programado"
// save with a legacy/garbage value already in the field isn't blocked by a
// transform that validateScheduledDate above didn't get a chance to reject.
function normalizeScheduledDate<T extends { data_publicacao_programada?: string }>(data: T): T {
  if (!data.data_publicacao_programada) return data;
  const parsed = parseScheduledDate(data.data_publicacao_programada);
  if (!parsed) return data;
  return { ...data, data_publicacao_programada: parsed.toISOString() };
}

// Ceilings, not editorial targets: sized well above every real value seen in
// production data (checked via a live scan while writing this schema: max
// slug 68 chars, max titulo 71, max resumo 370) so no legitimate existing
// post is rejected on its next save. Their job is to reject pathological
// input (a multi-MB string in a text field), not to enforce a house style.
const basePostFields = {
  slug: z.string().min(1).max(200).regex(SLUG_PATTERN, "slug must be lowercase alphanumeric segments joined by hyphens"),
  titulo: z.string().min(1).max(300),
  conteudo_html: z.string().max(300_000).optional(),
  resumo: z.string().max(600).optional(),
  subtitulo: z.string().max(300).optional(),
  imagem_destaque_url: z.string().optional(),
  imagem_destaque_alt_text: z.string().optional(),
  imagem_lqip_base64: z.string().optional(),
  categoria_slug: z.string().optional(),
  subcategoria_slug: z.string().optional(),
  subcategoria_nome: z.string().optional(),
  autor_id: z.string().min(1),
  // data_publicacao stays a loose string: it also flows through this same
  // field on read-modify-write with whatever shape the caller last stored
  // (admin datetime-local, ISO 8601, ...): a strict check here would reject
  // round-tripped data. data_publicacao_programada below is stricter because
  // it is exclusively client-originated (never read-modify-written from a
  // pre-existing value in a different shape) and its ordering-by-string in
  // postScheduler's GSI range key requires every value to share one format.
  data_publicacao: z.string().optional(),
  // Requires an explicit UTC offset (the admin converts its datetime-local
  // input before sending, see localDateTimeToUtcIso()) so postScheduler's
  // string comparison against `new Date().toISOString()` is never comparing
  // two different formats. Empty string is preprocessed to undefined since
  // the admin form's default/cleared value is "", which z.string().datetime()
  // would otherwise reject as a malformed (non-empty) date.
  data_publicacao_programada: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().datetime({ offset: true }).optional(),
  ),
  tempo_leitura_min: z.number().int().min(1).max(180).optional(),
  e_popular: z.union([z.literal(0), z.literal(1)]).optional(),
  e_projeto: z.union([z.literal(0), z.literal(1)]).optional(),
  meta_titulo_seo: z.string().max(160).optional(),
  meta_descricao_seo: z.string().max(300).optional(),
  topico: z.string().max(120).optional(),
  variante_card: z.string().optional(),
};

// Creation never accepts a client-sent version: the server always starts a
// new item at version 1, and `.strip()` on the object below silently drops
// a `version` key if one is sent, same as any other unrecognized field.
export const createPostInputSchema = z
  .object({
    ...basePostFields,
    // Default rather than required: a client that omits status entirely
    // (e.g. a bare "save draft" action) still needs a real value to persist
    // falling back to "Rascunho" is safer than letting the field reach
    // savePost() as undefined and land in DynamoDB that way.
    status: z.enum(POST_STATUSES).default("Rascunho"),
  })
  .strip()
  .superRefine(validateScheduledDate)
  .transform(normalizeScheduledDate);

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

// Update requires version: it's the client's optimistic-concurrency token
// (round-tripped from a prior GET), and skipping the field must not silently
// skip the ConditionExpression's version clause in savePost(). `.strict()`
// (not `.strip()` like create) rejects an unknown/internal field outright:
// savePost() merges this payload onto the existing item (PATCH semantics),
// so a field silently stripped here would silently fail to update instead
// of being visibly rejected.
//
// Every other base field is `.partial()`-ed to optional here: savePost()'s
// merge already treats an omitted field as "keep the existing value" (real
// PATCH semantics), but until this schema matched that, the *contract*
// still required `slug`/`titulo`/`autor_id` on every update: the only
// reason a client could get away with a partial payload in practice was
// that the one real client (the admin form) always sends the full object.
// A future caller sending just `{ version, titulo }` would have failed
// validation despite the backend being able to handle it correctly.
export const updatePostInputSchema = z
  .object({
    ...z.object(basePostFields).partial().shape,
    // Nullable only where savePost()'s merge treats an explicit `null` as
    // "delete this key from the persisted item": every other optional
    // field simply stays untouched when omitted from a partial payload, so
    // only fields with a real "remove it" use case (cover subtitle, LQIP
    // placeholder) need the extra null branch.
    subtitulo: basePostFields.subtitulo.nullable(),
    imagem_lqip_base64: basePostFields.imagem_lqip_base64.nullable(),
    status: z.enum(POST_STATUSES).optional(),
    version: z.number().int().min(0),
    // Accepted, never trusted: the admin form's local state (loaded from a
    // prior GET) naturally round-trips this field on every save, and
    // `.strict()` would otherwise 400 a normal update. savePost() always
    // overwrites it with the server's own `now`, regardless of what's sent.
    data_atualizacao: z.string().optional(),
  })
  .strict()
  .superRefine(validateScheduledDate)
  .transform(normalizeScheduledDate);

export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;

// Response shape for both create and update, shared between backend
// (adminPosts/index.ts) and admin (services/api.ts) so the client parses the
// same fields it needs to sync local form state (slug/version/data_atualizacao)
// instead of trusting an untyped body.
export const savePostResponseSchema = z.object({
  message: z.string(),
  slug: z.string(),
  version: z.number().int(),
  data_atualizacao: z.string(),
});

export type SavePostResponse = z.infer<typeof savePostResponseSchema>;

// Persisted shape in DynamoDB, a superset of the input schemas
// (server-computed fields like data_atualizacao and the sparse GSI markers
// never come from a client request).
export interface Post {
  slug: string;
  titulo: string;
  conteudo_html: string;
  resumo: string;
  subtitulo?: string; // displayed in the post page hero, below the title
  imagem_destaque_url: string;
  imagem_destaque_alt_text: string;
  imagem_lqip_base64?: string; // inline data URI for the LQIP blur placeholder
  categoria_slug: string;
  subcategoria_slug?: string; // fixed sub-taxonomy, defined in the category's subcategories
  subcategoria_nome?: string; // denormalized on save to avoid a join at read time
  autor_id: string;
  status: PostStatus;
  data_publicacao: string; // ISO 8601
  data_atualizacao: string; // ISO 8601
  data_publicacao_programada?: string;
  tempo_leitura_min: number;
  e_popular: 0 | 1; // DynamoDB has no boolean type for an indexed attribute
  e_projeto: 0 | 1; // DynamoDB has no boolean type for an indexed attribute
  // Sparse index markers, only exist on the item when the corresponding
  // flag is 1. Hash key of PopularesPorData_v2/ProjetoPorData_v2. Never
  // read/written outside of savePost() and getPosts(): e_popular/e_projeto
  // remain the source of truth for all business logic and UI.
  e_popular_marker?: "POP";
  e_projeto_marker?: "PROJ";
  meta_titulo_seo?: string;
  meta_descricao_seo?: string;
  topico?: string; // eyebrow shown on the card (pc-cat), may differ from the category
  variante_card?: string; // card visual variant (gradient): t-petrol | t-deep | t-soft | t-clay | t-teal | t-moss
  version: number; // optimistic concurrency counter, incremented on every save
}
