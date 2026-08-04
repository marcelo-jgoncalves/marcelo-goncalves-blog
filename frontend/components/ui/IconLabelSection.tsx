// Extracted from 3 pillar landing pages (automacao/plataforma "Especialidades",
// software "Princípios"): same semantic role ("grid of competencies with icon
// and label"), only the domain field names differ. `section`/`wrap`/`head`/
// `eyebrow`/`heading`/`desc` still come from each page's CSS Module (they vary
// little and weren't the problem); the grid itself (`list`/`item`/`numeral`/
// `itemTitle`) is fixed, defined in IconLabelSection.module.css matching
// /plataforma's pattern (2 columns): previously each page had its own copy,
// with /automacao and /software diverging into 4 columns on wide screens for
// no real reason.

import type { ComponentType, ReactNode } from 'react';
import styles from './IconLabelSection.module.css';

export interface IconLabelItem {
  label: string;
  Icon: ComponentType;
}

export interface IconLabelSectionClasses {
  section: string;
  wrap: string;
  head: string;
  eyebrow: string;
  heading: string;
  desc: string;
}

interface IconLabelSectionProps {
  id: string;
  dataAudit?: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  items: IconLabelItem[];
  classes: IconLabelSectionClasses;
}

export default function IconLabelSection({
  id,
  dataAudit,
  eyebrow,
  title,
  description,
  items,
  classes,
}: IconLabelSectionProps) {
  return (
    <section id={id} className={classes.section} data-audit={dataAudit}>
      <div className={classes.wrap}>
        <div className={classes.head}>
          <span className={classes.eyebrow}>{eyebrow}</span>
          <h2 className={classes.heading}>{title}</h2>
          <p className={classes.desc}>{description}</p>
        </div>
        <div className={styles.list}>
          {items.map(({ label, Icon }) => (
            <div className={styles.item} key={label}>
              <span className={styles.numeral}>
                <Icon />
              </span>
              <span className={styles.itemTitle}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
