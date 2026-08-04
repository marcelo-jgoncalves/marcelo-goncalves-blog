// Card for one of the 4 commercial pillars (Automação, IA, Sistemas,
// Cloud): same format used on the Home and the central Serviços page
// (/servicos).

import Link from 'next/link';
import type { ReactNode } from 'react';
import IconTile from './IconTile';
import styles from './PillarCard.module.css';

interface PillarCardProps {
  icon: ReactNode;
  kicker: string;
  title: string;
  description: string;
  bullets?: ReactNode[];
  tags: string[];
  href: string;
  wide?: boolean;
  dataAudit?: string;
}

export default function PillarCard({
  icon,
  kicker,
  title,
  description,
  bullets,
  tags,
  href,
  wide,
  dataAudit,
}: PillarCardProps) {
  return (
    <Link
      href={href}
      className={`pillar-card ${styles.pillarCard}${wide ? ` ${styles.pillarCardWide}` : ''}`}
      data-audit={dataAudit}
    >
      <div className={styles.pillarTop}>
        <IconTile icon={icon} />
      </div>
      <div className={styles.pillarKicker}>{kicker}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {bullets && (
        <ul className={styles.pillarBullets}>
          {bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
      <div className={styles.pillarFooter}>
        <div className={styles.pillarTags}>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <span className={`pillar-more ${styles.pillarMore}`}>Saiba mais <span className="arrow" aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}
