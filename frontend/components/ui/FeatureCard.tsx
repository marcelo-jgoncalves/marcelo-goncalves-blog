// Icon + title + text + footer card — same pattern as
// frontend/app/servicos/servicos.css (.svc-card) and
// frontend/app/home.css (.ih-pillar-card). Single source of truth for this
// format: only size and content vary per use. Footer is flexible: `tags`
// renders the standard pill row; `footer` accepts any content (e.g. an
// "Exemplo" block with flowing text) for cases where the card doesn't use
// tags; if neither is passed, the card ends at the paragraph (no footer,
// no border).

import type { ReactNode } from 'react';
import IconTile from './IconTile';
import './FeatureCard.css';

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

export default function FeatureCard({ icon, kicker, title, text, tags, footer, size = 'md', dataAudit }: FeatureCardProps) {
  return (
    <div className={`feature-card feature-card--${size}`} data-audit={dataAudit}>
      {icon && <IconTile icon={icon} className="feature-card-icon" />}
      {kicker && <span className="feature-card-kicker">{kicker}</span>}
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-text">{text}</p>
      {footer ?? (tags && tags.length > 0 ? (
        <div className="feature-card-footer">
          <div className="feature-card-tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      ) : null)}
    </div>
  );
}
