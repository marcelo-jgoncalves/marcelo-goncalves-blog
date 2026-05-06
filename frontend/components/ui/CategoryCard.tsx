import Link from 'next/link';
import './CategoryCard.css';

interface CategoryCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export default function CategoryCard({ href, icon, title, description }: CategoryCardProps) {
  return (
    <Link href={href} className="category-card">
      <div className="category-icon">
        <i className={icon} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <p className="category-card__description">{description}</p>
    </Link>
  );
}
