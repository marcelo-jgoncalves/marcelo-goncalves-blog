//
// `savePost()` used to do `{ ...data as Post }` — a type assertion has no
// runtime effect, so any extra field sent by the client (e.g. a manually
// set `e_popular_marker`, or a nonexistent field) went straight to DynamoDB
// without validation (mass assignment / overposting). This schema mirrors
// backend/src/common/types.ts and is the single source of truth for which
// fields an admin POST/PUT can set — `.strip()` silently discards any field
// outside this list.
import { z } from "zod";

// Matches admin/src/utils/slug.ts's slugify() output (lowercase, \w-derived
// segments joined by single hyphens) — underscore is allowed because
// slugify()'s `\w` character class doesn't strip it, even though every real
// slug observed in production is plain alphanumeric-hyphenated.
const SLUG_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

// Ceilings, not editorial targets: sized well above every real value seen in
// production data (checked via a live scan while writing this schema — max
// slug 68 chars, max titulo 71, max resumo 370) so no legitimate existing
// post is rejected on its next save. Their job is to reject pathological
// input (a multi-MB string in a text field), not to enforce a house style.
export const postInputSchema = z
  .object({
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
    status: z.enum(["Publicado", "Rascunho", "Programado"]).optional(),
    // Not `.datetime()`: the admin's scheduling field is an
    // <input type="datetime-local">, which emits "2026-08-02T14:30" — no
    // seconds, no timezone suffix. Real ISO 8601 (from data_atualizacao)
    // also flows through this same field on read-modify-write, so the
    // format actually varies by caller; a strict datetime check would reject
    // the admin's own scheduling requests.
    data_publicacao: z.string().optional(),
    data_publicacao_programada: z.string().optional(),
    tempo_leitura_min: z.number().int().min(1).max(180).optional(),
    e_popular: z.union([z.literal(0), z.literal(1)]).optional(),
    e_projeto: z.union([z.literal(0), z.literal(1)]).optional(),
    meta_titulo_seo: z.string().max(160).optional(),
    meta_descricao_seo: z.string().max(300).optional(),
    topico: z.string().max(120).optional(),
    variante_card: z.string().optional(),
    // Optimistic concurrency: sent back only by a client that read the post
    // first (round-trip from a previous GET's `version`). Absent from every
    // request today because the admin UI doesn't wire this through yet — see
    // adminPosts/index.ts savePost() for how its presence changes behavior.
    version: z.number().int().min(0).optional(),
  })
  .strip()
  .superRefine((data, ctx) => {
    if (data.status === "Programado" && !data.data_publicacao_programada) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data_publicacao_programada"],
        message: "A scheduled post requires data_publicacao_programada.",
      });
    }
  });

export type PostInput = z.infer<typeof postInputSchema>;
