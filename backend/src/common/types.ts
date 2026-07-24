// backend/src/common/types.ts

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
  e_popular: number; // DynamoDB não tem boolean em índice, usamos 0 ou 1
  e_projeto: number; // DynamoDB não tem boolean em índice, usamos 0 ou 1
  // Sparse index markers — só existem no item quando o respectivo flag é 1.
  // hash_key de PopularesPorData_v2/ProjetoPorData_v2 (substituem GSIs com
  // hash_key = e_popular/e_projeto, baixa cardinalidade — ver registro
  // histórico arquivado fora do repo em
  // marcelo-goncalves-blog-arquivo/docs-historico/plano-migracao-gsi-dynamodb.md).
  // Nunca lidos/escritos fora de
  // savePost() e getPosts() — e_popular/e_projeto continuam a fonte de
  // verdade para toda lógica de negócio e UI.
  e_popular_marker?: "POP";
  e_projeto_marker?: "PROJ";
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