/* frontend/components/ui/IconTile.tsx
   Selo de ícone reutilizável — referência visual: cards de pilar da Home
   (frontend/app/home.css .ih-pillar-icon, hoje duplicado em .feature-card-icon
   e .svc-icon). Único ponto de verdade para forma/tamanho; só ícone, variante
   de cor de fundo e tamanho mudam por uso. */

import type { ReactNode } from 'react';
import './IconTile.css';

interface IconTileProps {
  icon: ReactNode;
  variant?: 'petrol' | 'clay' | 'glass';
  size?: number;
  radius?: number;
  className?: string;
  dataAudit?: string;
}

export default function IconTile({ icon, variant = 'petrol', size = 54, radius = 14, className, dataAudit }: IconTileProps) {
  return (
    <div
      className={`icon-tile icon-tile--${variant}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, borderRadius: radius }}
      data-audit={dataAudit}
    >
      {icon}
    </div>
  );
}
