import Link from 'next/link';
import './CategoryTag.css';

interface CategoryTagProps {
  text: string;
  icon?: string;
  href?: string;
}

export default function CategoryTag({ text, icon, href }: CategoryTagProps) {
  const content = (
    <>
      {icon && <i className={icon} aria-hidden="true" />}
      {text}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="category-tag">
        {content}
      </Link>
    );
  }

  return (
    <span className="category-tag">
      {content}
    </span>
  );
}
