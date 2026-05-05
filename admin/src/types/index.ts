export type PostStatus = 'Rascunho' | 'Publicado' | 'Programado'

export interface Post {
  slug: string
  titulo: string
  resumo: string
  conteudo_html: string
  categoria_slug: string
  status: PostStatus
  data_publicacao: string
  data_atualizacao?: string
  imagem_destaque_url: string
  imagem_destaque_alt_text: string
  meta_titulo_seo: string
  meta_descricao_seo: string
  e_popular: boolean | 0 | 1
  e_projeto: boolean | 0 | 1
  tempo_leitura_min: number
  autor_id: string
}

export interface Categoria {
  categoria_slug: string
  nome: string
  descricao?: string
}

export interface Autor {
  autor_id: string
  nome_exibicao: string
  bio: string
  foto_avatar_url: string
  foto_avatar_alt_text: string
  linkedin_url: string
  github_url: string
  instagram_url: string
}
