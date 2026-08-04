// Icon + title + text + footer card: same pattern as
// frontend/app/servicos/servicos.css (.svc-card) and
// frontend/app/home.css (.ih-pillar-card). Single source of truth for this
// format: only size and content vary per use. Footer is flexible: `tags`
// renders the standard pill row; `footer` accepts any content (e.g. an
// "Exemplo" block with flowing text) for cases where the card doesn't use
// tags; if neither is passed, the card ends at the paragraph (no footer,
// no border).

import type { ReactNode } from 'react';
import IconTile from './IconTile';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  icon?: ReactNode;
  kicker?: string;
  title: string;
  text: string;
  tags?: string[];
  footer?: ReactNode;
  size?: 'md' | 'lg';
  dataAudit?: string;
}

const SIZE_CLASS = {
  md: 'feature-card--md',
  lg: `feature-card--lg ${styles.featureCardLg}`,
};

export default function FeatureCard({ icon, kicker, title, text, tags, footer, size = 'md', dataAudit }: FeatureCardProps) {
  return (
    <div className={`feature-card ${styles.featureCard} ${SIZE_CLASS[size]}`} data-audit={dataAudit}>
      {icon && <IconTile icon={icon} className={`feature-card-icon ${styles.featureCardIcon}`} />}
      {kicker && <span className={`feature-card-kicker ${styles.featureCardKicker}`}>{kicker}</span>}
      <h3 className={`feature-card-title ${styles.featureCardTitle}`}>{title}</h3>
      <p className={`feature-card-text ${styles.featureCardText}`}>{text}</p>
      {footer ?? (tags && tags.length > 0 ? (
        <div className={`feature-card-footer ${styles.featureCardFooter}`}>
          <div className={`feature-card-tags ${styles.featureCardTags}`}>
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      ) : null)}
    </div>
  );
}
