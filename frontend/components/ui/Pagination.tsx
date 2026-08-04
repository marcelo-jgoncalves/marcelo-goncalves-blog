import Link from 'next/link';
import styles from './Pagination.module.css';

interface PaginationProps {
  basePath: string;
  nextToken?: string;
  page?: number;
  totalPages?: number;
  currentPageToken?: string;
  prevTokens?: string;
  /** Section id to scroll to after changing page (without "#"). Without this, scroll position is preserved as-is. */
  scrollToId?: string;
}

export default function Pagination({
  basePath,
  nextToken,
  page = 1,
  totalPages,
  currentPageToken,
  prevTokens = '',
  scrollToId,
}: PaginationProps) {
  const hasPagination = !!nextToken || page > 1;
  if (!hasPagination) return null;

  const hash = scrollToId ? `#${scrollToId}` : '';

  let nextUrl: string | null = null;
  if (nextToken) {
    const params = new URLSearchParams({ nextToken, page: String(page + 1) });
    const newPrevTokens = [prevTokens, currentPageToken].filter(Boolean).join(',');
    if (newPrevTokens) params.set('prevTokens', newPrevTokens);
    nextUrl = `${basePath}?${params.toString()}${hash}`;
  }

  let prevUrl: string | null = null;
  if (page > 1) {
    if (page === 2) {
      prevUrl = `${basePath}${hash}`;
    } else {
      const stack = prevTokens.split(',').filter(Boolean);
      const lastToken = stack[stack.length - 1];
      const remaining = stack.slice(0, -1).join(',');
      const params = new URLSearchParams({ nextToken: lastToken, page: String(page - 1) });
      if (remaining) params.set('prevTokens', remaining);
      prevUrl = `${basePath}?${params.toString()}${hash}`;
    }
  }

  const showPageInfo = totalPages !== undefined && totalPages > 0;

  return (
    <nav className={`${styles.opPagination} op-pagination`} aria-label="Paginação de postagens">

      {prevUrl ? (
        <Link href={prevUrl} className={styles.opPageNumber} rel="prev" aria-label="Página anterior" scroll={!scrollToId ? false : undefined}>
          Anterior
        </Link>
      ) : (
        <span className={`${styles.opPageNumber} ${styles.opPageNumberDisabled}`} aria-hidden="true">
          Anterior
        </span>
      )}

      {showPageInfo && (
        <span className={styles.opPageInfo} aria-current="page">
          Página {page} de {totalPages}
        </span>
      )}

      {nextUrl ? (
        <Link href={nextUrl} className={styles.opPageNumber} rel="next" aria-label="Próxima página" scroll={!scrollToId ? false : undefined}>
          Próxima
        </Link>
      ) : (
        <span className={`${styles.opPageNumber} ${styles.opPageNumberDisabled}`} aria-hidden="true">
          Próxima
        </span>
      )}

    </nav>
  );
}
