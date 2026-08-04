/** Macro areas used in the Artigos filter. Assigned per Category. */
export const MACRO_AREAS = [
  { value: 'ia', label: 'Inteligência Artificial' },
  { value: 'devops', label: 'DevOps' },
  { value: 'cloud', label: 'Cloud · AWS' },
  { value: 'eng', label: 'Engenharia' },
  { value: 'bastidores', label: 'Bastidores' },
] as const

/** Visual (gradient) variants of the redesigned PostCard: t-* classes applied via variante_card. */
export const CARD_VARIANTS = [
  { value: 't-petrol', label: 'Petróleo' },
  { value: 't-deep', label: 'Petróleo Profundo' },
  { value: 't-soft', label: 'Petróleo Suave' },
  { value: 't-clay', label: 'Argila' },
  { value: 't-teal', label: 'Verde-azulado' },
  { value: 't-moss', label: 'Musgo' },
] as const
