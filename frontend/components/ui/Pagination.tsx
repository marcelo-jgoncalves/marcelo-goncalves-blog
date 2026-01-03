import Link from 'next/link';

interface PaginationProps {
  nextToken?: string;
  basePath: string;
}

export default function Pagination({ nextToken, basePath }: PaginationProps) {
  // Se não houver nextToken, chegamos ao fim (ou é página única)
  if (!nextToken) {
    return null;
  }

  return (
    <nav className="pagination">
      {/* Nota: Com DynamoDB/nextToken, não sabemos o número da página anterior 
        sem manter estado complexo. Focaremos na navegação "Próxima" 
        que é o padrão robusto para NoSQL.
      */}
      
      <span className="page-numbers current">Atual</span>
      
      <Link 
        href={`${basePath}?nextToken=${encodeURIComponent(nextToken)}`} 
        className="page-numbers"
      >
        Próxima &rarr;
      </Link>
    </nav>
  );
}