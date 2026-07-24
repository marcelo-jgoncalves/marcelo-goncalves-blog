// frontend/components/ui/IconLabelSection.tsx
// Extraído de 3 landings de pilar (automacao/plataforma "Especialidades", software
// "Princípios") — mesmo papel semântico ("grade de competências com ícone e rótulo"),
// só o nome de cada campo do domínio muda. Recebe as classes de CSS Module de cada
// página via prop `classes` para não alterar nenhum seletor CSS existente (zero
// risco visual).

import type { ComponentType, ReactNode } from 'react';

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
  list: string;
  item: string;
  numeral: string;
  itemTitle: string;
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
        <div className={classes.list}>
          {items.map(({ label, Icon }) => (
            <div className={classes.item} key={label}>
              <span className={classes.numeral}>
                <Icon />
              </span>
              <span className={classes.itemTitle}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
