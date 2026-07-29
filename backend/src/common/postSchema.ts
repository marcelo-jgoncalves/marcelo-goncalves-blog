//
// `savePost()` used to do `{ ...data as Post }` — a type assertion has no
// runtime effect, so any extra field sent by the client (e.g. a manually
// set `e_popular_marker`, or a nonexistent field) went straight to DynamoDB
// without validation (mass assignment / overposting). This schema mirrors
// backend/src/common/types.ts and is the single source of truth for which
// fields an admin POST/PUT can set — `.strip()` silently discards any field
// outside this list.
import { z } from "zod";

export const postInputSchema = z
  .object({
    slug: z.string().min(1),
    titulo: z.string().min(1),
    conteudo_html: z.string().optional(),
    resumo: z.string().optional(),
    subtitulo: z.string().optional(),
    imagem_destaque_url: z.string().optional(),
    imagem_destaque_alt_text: z.string().optional(),
    imagem_lqip_base64: z.string().optional(),
    categoria_slug: z.string().optional(),
    subcategoria_slug: z.string().optional(),
    subcategoria_nome: z.string().optional(),
    autor_id: z.string().min(1),
    status: z.enum(["Publicado", "Rascunho", "Programado"]).optional(),
    data_publicacao: z.string().optional(),
    data_publicacao_programada: z.string().optional(),
    tempo_leitura_min: z.number().optional(),
    e_popular: z.union([z.literal(0), z.literal(1)]).optional(),
    e_projeto: z.union([z.literal(0), z.literal(1)]).optional(),
    meta_titulo_seo: z.string().optional(),
    meta_descricao_seo: z.string().optional(),
    topico: z.string().optional(),
    variante_card: z.string().optional(),
  })
  .strip();

export type PostInput = z.infer<typeof postInputSchema>;
