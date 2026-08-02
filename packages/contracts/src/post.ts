import { z } from "zod";

// Matches admin/src/utils/slug.ts's slugify() output (lowercase, \w-derived
// segments joined by single hyphens) — underscore is allowed because
// slugify()'s `\w` character class doesn't strip it, even though every real
// slug observed in production is plain alphanumeric-hyphenated.
const SLUG_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

export const POST_STATUSES = ["Publicado", "Rascunho", "Programado"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

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
    status: z.enum(POST_STATUSES).optional(),
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
    // first (round-trip from a previous GET's `version`).
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

// Persisted shape in DynamoDB — a superset of PostInput (server-computed
// fields like data_atualizacao and the sparse GSI markers never come from
// a client request).
export interface Post {
  slug: string;
  titulo: string;
  conteudo_html: string;
  resumo: string;
  subtitulo?: string; // exibido na hero da página de postagem, abaixo do título
  imagem_destaque_url: string;
  imagem_destaque_alt_text: string; // Acessibilidade (Blueprint v1.7)
  imagem_lqip_base64?: string; // data URI inline para blur placeholder (LQIP)
  categoria_slug: string;
  subcategoria_slug?: string; // sub-taxonomia fixa, definida nas subcategorias da categoria
  subcategoria_nome?: string; // denormalizado no save — evita join em tempo de leitura
  autor_id: string;
  status: PostStatus;
  data_publicacao: string; // ISO 8601
  data_atualizacao: string; // ISO 8601
  data_publicacao_programada?: string;
  tempo_leitura_min: number;
  e_popular: 0 | 1; // DynamoDB has no boolean type for an indexed attribute
  e_projeto: 0 | 1; // DynamoDB has no boolean type for an indexed attribute
  // Sparse index markers — only exist on the item when the corresponding
  // flag is 1. Hash key of PopularesPorData_v2/ProjetoPorData_v2. Never
  // read/written outside of savePost() and getPosts() — e_popular/e_projeto
  // remain the source of truth for all business logic and UI.
  e_popular_marker?: "POP";
  e_projeto_marker?: "PROJ";
  meta_titulo_seo?: string; // SEO (Blueprint v1.7)
  meta_descricao_seo?: string; // SEO (Blueprint v1.7)
  topico?: string; // eyebrow exibido no card (pc-cat) — pode diferir da categoria
  variante_card?: string; // variante visual do card (gradiente): t-petrol | t-deep | t-soft | t-clay | t-teal | t-moss
  version?: number; // optimistic concurrency counter, incremented on every save
}
