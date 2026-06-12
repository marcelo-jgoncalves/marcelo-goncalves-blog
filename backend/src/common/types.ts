// backend/src/common/types.ts

export interface Post {
  slug: string;
  titulo: string;
  conteudo_html: string;
  resumo: string;
  imagem_destaque_url: string;
  imagem_destaque_alt_text: string; // Acessibilidade (Blueprint v1.7)
  imagem_lqip_base64?: string;     // data URI inline para blur placeholder (LQIP)
  categoria_slug: string;
  autor_id: string;
  status: 'Publicado' | 'Rascunho' | 'Programado';
  data_publicacao: string; // ISO 8601
  data_atualizacao: string; // ISO 8601
  data_publicacao_programada?: string;
  tempo_leitura_min: number;
  e_popular: number; // DynamoDB não tem boolean em índice, usamos 0 ou 1
  e_projeto: number; // DynamoDB não tem boolean em índice, usamos 0 ou 1
  meta_titulo_seo?: string; // SEO (Blueprint v1.7)
  meta_descricao_seo?: string; // SEO (Blueprint v1.7)
  topico?: string; // eyebrow exibido no card (pc-cat) — pode diferir da categoria
  variante_card?: string; // variante visual do card (gradiente): t-petrol | t-deep | t-soft | t-clay | t-teal | t-moss
}

export interface Autor {
  autor_id: string;
  nome_exibicao: string;
  bio: string;
  foto_avatar_url: string;
  foto_avatar_alt_text: string;
  linkedin_url: string;
  github_url: string;
  instagram_url?: string;
}

export interface Categoria {
  categoria_slug: string;
  nome: string;
  descricao?: string;
  macro_areas?: string[]; // agrupamento usado nos filtros de Artigos: ia | devops | cloud | eng | bastidores
}