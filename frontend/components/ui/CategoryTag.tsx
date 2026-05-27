import './CategoryTag.css';

interface CategoryTagProps {
  text: string;
  color?: string;
  backgroundColor?: string;
}

export default function CategoryTag({
  text,
  color = 'var(--accent)',
  backgroundColor = '#ffffff'
}: CategoryTagProps) {
  return (
    <span className="category-tag" style={{ color, backgroundColor }}>
      {text}
    </span>
  );
}
