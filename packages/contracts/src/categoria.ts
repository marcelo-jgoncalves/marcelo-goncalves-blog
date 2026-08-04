export interface Subcategoria {
  slug: string;
  nome: string;
}

export interface Categoria {
  categoria_slug: string;
  nome: string;
  descricao?: string;
  macro_areas?: string[]; // grouping used in Articles filters: ia | devops | cloud | eng | bastidores
  subcategorias?: Subcategoria[]; // fixed sub-taxonomy, defined per category in the admin
  icone_fa?: string; // no consumer in the public frontend yet
}
