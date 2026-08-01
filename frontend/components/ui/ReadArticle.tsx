import styles from './ReadArticle.module.css';

export default function ReadArticle({ color }: { color?: string }) {
  return (
    <span
      className={`${styles.readArticle} read-article`}
      style={color ? { '--read-article-color': color } as React.CSSProperties : undefined}
    >
      Ler artigo
    </span>
  );
}
