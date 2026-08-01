import styles from './Eyebrow.module.css';

interface EyebrowProps {
  text: string;
  color?: string;
}

export default function Eyebrow({ text, color = 'var(--petrol)' }: EyebrowProps) {
  return (
    <span className={styles.eyebrow} style={{ color }}>
      {text}
    </span>
  );
}
