/* frontend/components/ui/Pagination.tsx */
import Link from 'next/link';
import './Pagination.css';

interface PaginationProps {
  basePath: string;
  nextToken?: string;
  page?: number;
  totalPages?: number;
  currentPageToken?: string;
  prevTokens?: string;
}

export default function Pagination({
  basePath,
  nextToken,
  page = 1,
  totalPages,
  currentPageToken,
  prevTokens = '',
}: PaginationProps) {
  const hasPagination = !!nextToken || page > 1;
  if (!hasPagination) return null;

  // --- URL da próxima página ---
  let nextUrl: string | null = null;
  if (nextToken) {
    const params = new URLSearchParams({ nextToken, page: String(page + 1) });
    const newPrevTokens = [prevTokens, currentPageToken].filter(Boolean).join(',');
    if (newPrevTokens) params.set('prevTokens', newPrevTokens);
    nextUrl = `${basePath}?${params.toString()}`;
  }

  // --- URL da página anterior ---
  let prevUrl: string | null = null;
  if (page > 1) {
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

      {prevUrl ? (
        <Link href={prevUrl} className="op-page-number" rel="prev" aria-label="Página anterior" scroll={false}>
          ← Anterior
        </Link>
      ) : (
        <span className="op-page-number op-page-number--disabled" aria-hidden="true">
          ← Anterior
        </span>
      )}

      {showPageInfo && (
        <span className="op-page-info" aria-current="page">
          Página {page} de {totalPages}
        </span>
      )}

      {nextUrl ? (
        <Link href={nextUrl} className="op-page-number" rel="next" aria-label="Próxima página" scroll={false}>
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
