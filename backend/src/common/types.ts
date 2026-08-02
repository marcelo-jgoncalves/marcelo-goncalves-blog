
export interface Post {
  slug: string;
  titulo: string;
  conteudo_html: string;
  resumo: string;
  subtitulo?: string; // exibido na hero da página de postagem, abaixo do título
  imagem_destaque_url: string;
  imagem_destaque_alt_text: string; // Acessibilidade (Blueprint v1.7)
  imagem_lqip_base64?: string;     // data URI inline para blur placeholder (LQIP)
  categoria_slug: string;
  subcategoria_slug?: string; // sub-taxonomia fixa, definida nas subcategorias da categoria
  subcategoria_nome?: string; // denormalizado no save — evita join em tempo de leitura
  autor_id: string;
  status: 'Publicado' | 'Rascunho' | 'Programado';
  data_publicacao: string; // ISO 8601
  data_atualizacao: string; // ISO 8601
  data_publicacao_programada?: string;
  tempo_leitura_min: number;
  e_popular: number; // DynamoDB has no boolean type for an indexed attribute, so we use 0 or 1
  e_projeto: number; // DynamoDB has no boolean type for an indexed attribute, so we use 0 or 1
  // Sparse index markers — only exist on the item when the corresponding
  // flag is 1. Hash key of PopularesPorData_v2/ProjetoPorData_v2 (replace
  // GSIs with hash_key = e_popular/e_projeto, which have low cardinality).
  // Never read/written outside of savePost() and getPosts() — e_popular/
  // e_projeto remain the source of truth for all business logic and UI.
  e_popular_marker?: "POP";
  e_projeto_marker?: "PROJ";
  meta_titulo_seo?: string; // SEO (Blueprint v1.7)
  meta_descricao_seo?: string; // SEO (Blueprint v1.7)
  topico?: string; // eyebrow exibido no card (pc-cat) — pode diferir da categoria
  variante_card?: string; // variante visual do card (gradiente): t-petrol | t-deep | t-soft | t-clay | t-teal | t-moss
  version?: number; // optimistic concurrency counter, incremented on every save
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

export interface Subcategoria {
  slug: string;
  nome: string;
}

export interface Categoria {
  categoria_slug: string;
  nome: string;
  descricao?: string;
  macro_areas?: string[]; // agrupamento usado nos filtros de Artigos: ia | devops | cloud | eng | bastidores
  subcategorias?: Subcategoria[]; // sub-taxonomia fixa, definida no admin por categoria
}