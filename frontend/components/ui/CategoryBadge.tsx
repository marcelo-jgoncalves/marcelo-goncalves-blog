/* frontend/components/ui/CategoryBadge.tsx */
import Link from 'next/link';
import './CategoryBadge.css';

interface CategoryBadgeProps {
  nome: string;
  slug: string;
  icone_fa?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CategoryBadge({ 
  nome, 
  slug, 
  icone_fa, 
  size = 'sm', 
  className = '' 
}: CategoryBadgeProps) {
  
  const combinedClasses = `category-badge category-badge--${size} ${className}`.trim();

  // A Mágica da Performance: O ícone NUNCA é renderizado no DOM em cards (size='sm')
  const showIcon = icone_fa && size !== 'sm';

  return (
    <Link 
      href={`/categoria/${slug}`} 
      className={combinedClasses}
      aria-label={`Ver todos os posts da categoria ${nome}`}
    >
      {/* Ícone condicional com proteção de acessibilidade */}
      {showIcon && (
        <i className={`${icone_fa} category-badge__icon`} aria-hidden="true"></i>
      )}
      <span>{nome}</span>
    </Link>
  );
}