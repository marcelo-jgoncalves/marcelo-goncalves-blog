// frontend/lib/format.ts

const MONTHS_PT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  return `${day} ${MONTHS_PT[date.getMonth()]} ${date.getFullYear()}`;
}

interface PostWithCategory {
  categoria_slug?: string;
  categoria?: { nome_exibicao: string };
}

export function categoryName(post: PostWithCategory): string {
  if (post?.categoria?.nome_exibicao) return post.categoria.nome_exibicao;
  return (post?.categoria_slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
}
