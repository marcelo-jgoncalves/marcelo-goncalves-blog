/* frontend/components/ui/Pagination.tsx */
import Link from 'next/link';
import './Pagination.css';

interface PaginationProps {
  basePath: string;
  page: number;
  totalPages: number;
  nextToken?: string;          // token para a próxima página (vem da API)
  currentPageToken?: string;   // token usado para carregar a página atual (vem da URL)
  prevTokens?: string;         // tokens anteriores separados por vírgula
}

export default function Pagination({
  basePath,
  page,
  totalPages,
  nextToken,
  currentPageToken,
  prevTokens = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // --- URL da próxima página ---
  let nextUrl: string | null = null;
  if (nextToken) {
    // Empilha o token da página atual nos prevTokens para poder voltar
    const newPrevTokens = [prevTokens, currentPageToken].filter(Boolean).join(',');
    const params = new URLSearchParams({ nextToken, page: String(page + 1) });
    if (newPrevTokens) params.set('prevTokens', newPrevTokens);
    nextUrl = `${basePath}?${params.toString()}`;
  }

  // --- URL da página anterior ---
  let prevUrl: string | null = null;
  if (page > 1) {
    if (page === 2) {
      prevUrl = basePath; // página 1 não tem cursor
    } else {
      const stack = prevTokens.split(',').filter(Boolean);
      const lastToken = stack[stack.length - 1];
      const remaining = stack.slice(0, -1).join(',');
      const params = new URLSearchParams({ nextToken: lastToken, page: String(page - 1) });
      if (remaining) params.set('prevTokens', remaining);
      prevUrl = `${basePath}?${params.toString()}`;
    }
  }

  return (
    <nav className="op-pagination" aria-label="Paginação de postagens">

      {prevUrl ? (
        <Link href={prevUrl} className="op-page-number" rel="prev" aria-label="Página anterior">
          ← Anterior
        </Link>
      ) : (
        <span className="op-page-number op-page-number--disabled" aria-hidden="true">
          ← Anterior
        </span>
      )}

      <span className="op-page-info" aria-current="page">
        Página {page} de {totalPages}
      </span>

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
