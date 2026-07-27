/* frontend/components/ui/PillarCard.tsx
   Card de um dos 4 pilares comerciais (Automação, IA, Sistemas, Cloud) — mesmo
   formato usado na Home e na página central de Serviços (/servicos). Ícone +
   kicker + título + descrição + tags + link "Saiba mais". */

import Link from 'next/link';
import type { ReactNode } from 'react';
import IconTile from './IconTile';
import './PillarCard.css';

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
      className={`pillar-card${wide ? ' pillar-card--wide' : ''}`}
      data-audit={dataAudit}
    >
      <div className="pillar-top">
        <IconTile icon={icon} />
      </div>
      <div className="pillar-kicker">{kicker}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {bullets && (
        <ul className="pillar-bullets">
          {bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
      <div className="pillar-footer">
        <div className="pillar-tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <span className="pillar-more">Saiba mais <span className="arrow" aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}
