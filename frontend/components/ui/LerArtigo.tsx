import './LerArtigo.css';

export default function LerArtigo({ color }: { color?: string }) {
  return (
    <span
      className="ler-artigo"
      style={color ? { '--ler-artigo-color': color } as React.CSSProperties : undefined}
    >
      Ler artigo
    </span>
  );
}
