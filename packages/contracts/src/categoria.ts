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
  icone_fa?: string; // sem consumidor no frontend público hoje — ver CLAUDE.md §10 item 41
}
