/* frontend/components/ui/Pagination.tsx */
import Link from 'next/link';
import './Pagination.css'; // 🚀 Pilar 2: Importando o CSS isolado do componente

interface PaginationProps {
  nextToken?: string;
  basePath: string;
}

export default function Pagination({ nextToken, basePath }: PaginationProps) {
  if (!nextToken) {
    return null;
  }

  return (
    // 🚀 Pilar 4: aria-label adicionado para acessibilidade impecável
    <nav className="op-pagination" aria-label="Paginação de postagens">
      
      <span className="op-page-number current" aria-current="page">
        Atual
      </span>
      
      <Link
        href={`${basePath}?nextToken=${encodeURIComponent(nextToken)}`}
        className="op-page-number"
        aria-label="Ir para a próxima página"
        rel="next"
      >
        Próxima &rarr;
      </Link>
    </nav>
  );
}