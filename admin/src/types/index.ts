export type PostStatus = 'Rascunho' | 'Publicado' | 'Programado'

export interface Post {
  slug: string
  titulo: string
  resumo: string
  subtitulo?: string
  conteudo_html: string
  categoria_slug: string
  subcategoria_slug?: string
  subcategoria_nome?: string
  status: PostStatus
  data_publicacao: string
  data_atualizacao?: string
  imagem_destaque_url: string
  imagem_destaque_alt_text: string
  meta_titulo_seo: string
  meta_descricao_seo: string
  // Number (0/1), never boolean — sparse GSI limitation in DynamoDB, same
  // contract as backend/src/common/types.ts. `boolean` used to be accepted
  // here, but the API never really sends/receives true/false; the
  // `!!`/`? 1 : 0` in EditorView.vue already converts it to a local UI
  // state (checkbox), which is boolean only there, not in the wire contract.
  e_popular: 0 | 1
  e_projeto: 0 | 1
  tempo_leitura_min: number
  autor_id: string
  topico?: string
  variante_card?: string
}

export interface Subcategoria {
  slug: string
  nome: string
}

export interface Categoria {
  categoria_slug: string
  nome: string
  descricao?: string
  macro_areas?: string[]
  subcategorias?: Subcategoria[]
  icone_fa?: string
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
