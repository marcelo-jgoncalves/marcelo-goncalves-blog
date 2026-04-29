/* frontend/components/ui/Pagination.tsx */
import Link from 'next/link';
import './Pagination.css';

interface PaginationProps {
  basePath: string;
  nextToken?: string;          // token para a próxima página (vem da API)
  // Props opcionais — quando presentes ativam o modo "Página X de Y"
  page?: number;               // página atual (1-based)
  totalPages?: number;         // total de páginas
  currentPageToken?: string;   // token usado para carregar a página atual (vem da URL)
  prevTokens?: string;         // tokens anteriores separados por vírgula
}

export default function Pagination({
  basePath,
  nextToken,
  page = 1,
  totalPages,
  currentPageToken,
  prevTokens = '',
}: PaginationProps) {
  const hasPagination = !!nextToken || (totalPages !== undefined && totalPages > 1);
  if (!hasPagination) return null;

  // --- URL da próxima página ---
  let nextUrl: string | null = null;
  if (nextToken) {
    const params = new URLSearchParams({ nextToken, page: String(page + 1) });
    if (totalPages !== undefined) {
      const newPrevTokens = [prevTokens, currentPageToken].filter(Boolean).join(',');
      if (newPrevTokens) params.set('prevTokens', newPrevTokens);
    }
    nextUrl = `${basePath}?${params.toString()}`;
  }

  // --- URL da página anterior (só disponível com totalPages e cursor stack) ---
  let prevUrl: string | null = null;
  if (totalPages !== undefined && page > 1) {
    if (page === 2) {
      prevUrl = basePath;
    } else {
      const stack = prevTokens.split(',').filter(Boolean);
      const lastToken = stack[stack.length - 1];
      const remaining = stack.slice(0, -1).join(',');
      const params = new URLSearchParams({ nextToken: lastToken, page: String(page - 1) });
      if (remaining) params.set('prevTokens', remaining);
      prevUrl = `${basePath}?${params.toString()}`;
    }
  }

  const showPageInfo = totalPages !== undefined && totalPages > 0;

  return (
    <nav className="op-pagination" aria-label="Paginação de postagens">

      {showPageInfo && (
        prevUrl ? (
          <Link href={prevUrl} className="op-page-number" rel="prev" aria-label="Página anterior">
            ← Anterior
          </Link>
        ) : (
          <span className="op-page-number op-page-number--disabled" aria-hidden="true">
            ← Anterior
          </span>
        )
      )}

      {showPageInfo && (
        <span className="op-page-info" aria-current="page">
          Página {page} de {totalPages}
        </span>
      )}

      {nextUrl ? (
        <Link href={nextUrl} className="op-page-number" rel="next" aria-label="Próxima página">
          Próxima →
        </Link>
      ) : (
        <span className="op-page-number op-page-number--disabled" aria-hidden="true">
          Próxima →
        </span>
      )}

    </nav>
  );
}
