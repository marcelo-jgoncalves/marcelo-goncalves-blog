/* frontend/components/ui/FeatureCard.tsx
   Card de ícone + título + texto + rodapé — mesmo padrão hoje duplicado em
   frontend/app/servicos/servicos.css (.svc-card) e frontend/app/home.css (.ih-pillar-card).
   Único ponto de verdade para esse formato: só tamanho (size) e conteúdo mudam por uso.
   Rodapé é flexível: `tags` renderiza a fileira padrão de pills; `footer` aceita
   qualquer conteúdo (ex. bloco "Exemplo" com fluxo de texto — specs/ESPECIFICACAO-
   INTEGRACAO-AUTOMACAO.md §7) para os casos em que o card não usa tags; se nenhum
   dos dois for passado, o card termina no parágrafo (sem rodapé, sem borda). */

import type { ReactNode } from 'react';
import IconTile from './IconTile';
import './FeatureCard.css';

interface FeatureCardProps {
  icon: ReactNode;
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
      <IconTile icon={icon} className="feature-card-icon" />
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
