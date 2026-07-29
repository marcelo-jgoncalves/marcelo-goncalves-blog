// "Benefícios/Resultados" section for the pillar landings — self-contained
// (own visual, no longer depends on page classes): clay checkmark with no
// background, 2-column grid with no borders, large headline. See
// BeneficiosSection.module.css.

import type { ReactNode } from 'react';
import styles from './BeneficiosSection.module.css';

const CHECK_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

interface BeneficiosSectionProps {
  id?: string;
  dataAudit?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  items: string[];
}

export default function BeneficiosSection({
  id = 'beneficios',
  dataAudit,
  eyebrow = 'Benefícios',
  title,
  description,
  items,
}: BeneficiosSectionProps) {
  return (
    <section id={id} className={styles.section} data-audit={dataAudit}>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.wrap}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 className={styles.heading}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.list}>
          {items.map((item) => (
            <div className={styles.item} key={item}>
              <span className={styles.checkIcon} aria-hidden="true">
                {CHECK_ICON}
              </span>
              <span className={styles.text}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
