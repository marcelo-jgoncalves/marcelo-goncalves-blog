// frontend/components/ui/IconLabelSection.tsx
// Extraído de 3 landings de pilar (automacao/plataforma "Especialidades", software
// "Princípios") — mesmo papel semântico ("grade de competências com ícone e rótulo"),
// só o nome de cada campo do domínio muda. `section`/`wrap`/`head`/`eyebrow`/
// `heading`/`desc` continuam vindo do CSS Module de cada página (variam pouco e não
// eram o problema); a grade em si (`list`/`item`/`numeral`/`itemTitle`) é fixa,
// definida em IconLabelSection.module.css no padrão de /plataforma (2 colunas) —
// antes cada página tinha sua própria cópia, com /automacao e /software divergindo
// de /plataforma (4 colunas em telas largas) sem motivo real (decisão de Marcelo,
// 2026-07-24: unificar no padrão de /plataforma).

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
