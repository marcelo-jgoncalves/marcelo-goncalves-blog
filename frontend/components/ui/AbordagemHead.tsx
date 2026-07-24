// frontend/components/ui/AbordagemHead.tsx
// Extraído das 4 landings de pilar — bloco "Nossa abordagem" (texto à esquerda) +
// card de resultado/objetivo/compromisso (aside à direita), mesmo papel semântico
// nas 4 páginas. Recebe as classes de CSS Module de cada página via prop `classes`
// para não alterar nenhum seletor CSS existente (zero risco visual).

import type { ReactNode } from 'react';

export interface AbordagemHeadClasses {
  grid: string;
  head: string;
  eyebrow: string;
  heading: string;
  desc: string;
  resultCard: string;
  resultLabel: string;
  resultTitle: string;
  resultText: string;
}

interface AbordagemHeadProps {
  dataAudit?: string;
  resultDataAudit?: string;
  eyebrow?: string;
  title: ReactNode;
  description: string;
  resultLabel: string;
  resultTitle: string;
  resultText: string;
  classes: AbordagemHeadClasses;
}

export default function AbordagemHead({
  dataAudit,
  resultDataAudit,
  eyebrow = 'Nossa abordagem',
  title,
  description,
  resultLabel,
  resultTitle,
  resultText,
  classes,
}: AbordagemHeadProps) {
  return (
    <div className={classes.grid} data-audit={dataAudit}>
      <div className={classes.head}>
        <span className={classes.eyebrow}>{eyebrow}</span>
        <h2 className={classes.heading}>{title}</h2>
        <p className={classes.desc}>{description}</p>
      </div>
      <aside className={classes.resultCard} data-audit={resultDataAudit}>
        <span className={classes.resultLabel}>{resultLabel}</span>
        <h3 className={classes.resultTitle}>{resultTitle}</h3>
        <p className={classes.resultText}>{resultText}</p>
      </aside>
    </div>
  );
}
