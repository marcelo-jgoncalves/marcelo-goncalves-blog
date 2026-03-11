/* frontend/components/ui/ReadMoreLink.tsx */

import Link from 'next/link';
import './ReadMoreLink.css';

interface ReadMoreLinkProps {
  href: string;
  text?: string;
  className?: string;
  ariaLabel?: string; 
}

/**
 * ReadMoreLink - Componente de navegação com BEM e Acessibilidade.
 * @param ariaLabel - Essencial para o E-E-A-T (Contexto para o Crawler)
 */
export default function ReadMoreLink({ 
  href, 
  text = "Ler mais", 
  className = "",
  ariaLabel 
}: ReadMoreLinkProps) {
  
  // Combinação de classes garantindo a manutenção da BEM base
  const combinedClasses = `read-more-link ${className}`.trim();

  return (
    <Link 
      href={href} 
      className={combinedClasses}
      aria-label={ariaLabel || text}
    >
      {text}
      <span className="read-more-link__icon" aria-hidden="true">
        →
      </span>
    </Link>
  );
}