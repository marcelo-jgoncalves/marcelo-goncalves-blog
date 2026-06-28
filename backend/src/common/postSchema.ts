// backend/src/common/postSchema.ts
//
// `savePost()` fazia `{ ...data as Post }` — um type assertion não tem
// efeito em runtime, então qualquer campo extra enviado pelo client (ex:
// `e_popular_marker` setado manualmente, ou um campo inexistente) ia direto
// pro DynamoDB sem validação (mass assignment / overposting, achado AppSec
// Cat. 4). Este schema espelha backend/src/common/types.ts e é a única
// fonte de verdade sobre quais campos um POST/PUT de admin pode setar —
// `.strip()` descarta silenciosamente qualquer campo fora desta lista.
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
