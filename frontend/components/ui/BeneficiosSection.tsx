// frontend/components/ui/BeneficiosSection.tsx
// Extraído das 4 landings de pilar (automacao, inteligencia-artificial, plataforma,
// software) — mesmo papel semântico ("lista de benefícios do pilar") repetido byte a
// byte nas 4. Recebe as classes de CSS Module de cada página via prop `classes`
// para não alterar nenhum seletor CSS existente (zero risco visual).

import type { ReactNode } from 'react';

const CHECK_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export interface BeneficiosSectionClasses {
  section: string;
  overlay: string;
  wrap: string;
  eyebrow: string;
  heading: string;
  description?: string;
  list: string;
  item: string;
  checkIcon: string;
  text: string;
}

interface BeneficiosSectionProps {
  id?: string;
  dataAudit?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  items: string[];
  classes: BeneficiosSectionClasses;
}

export default function BeneficiosSection({
  id = 'beneficios',
  dataAudit,
  eyebrow = 'Benefícios',
  title,
  description,
  items,
  classes,
}: BeneficiosSectionProps) {
  return (
    <section id={id} className={classes.section} data-audit={dataAudit}>
      <div className={classes.overlay} aria-hidden="true" />
      <div className={classes.wrap}>
        <div>
          <span className={classes.eyebrow}>{eyebrow}</span>
          <h2 className={classes.heading}>{title}</h2>
          {description && <p className={classes.description}>{description}</p>}
        </div>
        <div className={classes.list}>
          {items.map((item) => (
            <div className={classes.item} key={item}>
              <span className={classes.checkIcon} aria-hidden="true">
                {CHECK_ICON}
              </span>
              <span className={classes.text}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
