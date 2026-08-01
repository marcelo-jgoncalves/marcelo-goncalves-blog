import { ReactNode } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
  className?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  right?: ReactNode;
  statsStrip?: ReactNode;
  dataAudit?: string;
  singleColumn?: boolean;
}

export default function PageHero({
  className,
  eyebrow,
  title,
  subtitle,
  children,
  right,
  statsStrip,
  dataAudit,
  singleColumn,
}: PageHeroProps) {
  return (
    <section
      className={`page-hero ${styles.pageHero}${singleColumn ? ` page-hero--single ${styles.pageHeroSingle}` : ''}${className ? ` ${className}` : ''}`}
      data-audit={dataAudit}
    >
      <div className={`page-hero-in ${styles.pageHeroIn}`}>
        <div className={`page-hero-left ${styles.pageHeroLeft}`}>
          {eyebrow && <div className={`page-hero-ey ${styles.pageHeroEy}`}>{eyebrow}</div>}
          {title && <h1>{title}</h1>}
          {subtitle && <p className={`page-hero-sub ${styles.pageHeroSub}`}>{subtitle}</p>}
          {children}
        </div>
        {right && <div className={`page-hero-right ${styles.pageHeroRight}`}>{right}</div>}
      </div>
      {statsStrip}
    </section>
  );
}
