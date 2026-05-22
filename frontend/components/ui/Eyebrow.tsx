import './Eyebrow.css';

interface EyebrowProps {
  text: string;
  color?: string;
}

export default function Eyebrow({ text, color = 'var(--accent)' }: EyebrowProps) {
  return (
    <span className="eyebrow" style={{ color }}>
      {text}
    </span>
  );
}
