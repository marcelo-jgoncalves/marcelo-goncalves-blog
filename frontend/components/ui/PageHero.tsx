import { ReactNode } from 'react';
import './PageHero.css';

interface PageHeroProps {
  className?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  right?: ReactNode;
  statsStrip?: ReactNode;
  decoration?: ReactNode;
  dataAudit?: string;
}

export default function PageHero({
  className,
  eyebrow,
  title,
  subtitle,
  children,
  right,
  statsStrip,
  decoration,
  dataAudit,
}: PageHeroProps) {
  return (
    <section
      className={`page-hero${className ? ` ${className}` : ''}`}
      data-audit={dataAudit}
    >
      {decoration}
      <div className="page-hero-in">
        <div className="page-hero-left">
          {eyebrow && <div className="page-hero-ey">{eyebrow}</div>}
          {title && <h1>{title}</h1>}
          {subtitle && <p className="page-hero-sub">{subtitle}</p>}
          {children}
        </div>
        {right && <div className="page-hero-right">{right}</div>}
      </div>
      {statsStrip}
    </section>
  );
}
