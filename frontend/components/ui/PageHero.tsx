// frontend/components/ui/PageHero.tsx
import './PageHero.css';

interface PageHeroProps {
  children: React.ReactNode;
  /** Elemento semântico — section para páginas de conteúdo, header para listagens */
  as?: 'section' | 'header';
}

export default function PageHero({ children, as: Tag = 'section' }: PageHeroProps) {
  return (
    <Tag className="page-hero">
      <div className="page-hero__inner">
        {children}
      </div>
    </Tag>
  );
}
