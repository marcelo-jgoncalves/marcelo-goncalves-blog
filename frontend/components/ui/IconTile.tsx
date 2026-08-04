// Reusable icon badge, visual reference: the Home's pillar cards
// (frontend/app/home.css .ih-pillar-icon, previously duplicated in
// .feature-card-icon and .svc-icon). Single source of truth for
// shape/size; only icon, background color variant and size vary per use.

import type { ReactNode } from 'react';
import styles from './IconTile.module.css';

interface IconTileProps {
  icon: ReactNode;
  variant?: 'petrol' | 'clay' | 'glass';
  size?: number;
  radius?: number;
  className?: string;
  dataAudit?: string;
}

const VARIANT_CLASS = {
  petrol: styles.petrol,
  clay: styles.clay,
  glass: styles.glass,
} as const;

export default function IconTile({ icon, variant = 'petrol', size = 54, radius = 14, className, dataAudit }: IconTileProps) {
  return (
    <div
      className={`${styles.iconTile} icon-tile ${VARIANT_CLASS[variant]}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, borderRadius: radius }}
      data-audit={dataAudit}
    >
      {icon}
    </div>
  );
}
