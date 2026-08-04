// Extracted from the 4 pillar landings: "Nossa abordagem" block (text on the
// left) plus a result/goal/commitment card (aside on the right), same semantic
// role on all 4 pages. Takes each page's own CSS Module classes via the
// `classes` prop so no existing CSS selector changes (zero visual risk).

import type { ReactNode } from 'react';

export interface ApproachHeadClasses {
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

interface ApproachHeadProps {
  dataAudit?: string;
  resultDataAudit?: string;
  eyebrow?: string;
  title: ReactNode;
  description: string;
  resultLabel: string;
  resultTitle: string;
  resultText: string;
  classes: ApproachHeadClasses;
}

export default function ApproachHead({
  dataAudit,
  resultDataAudit,
  eyebrow = 'Nossa abordagem',
  title,
  description,
  resultLabel,
  resultTitle,
  resultText,
  classes,
}: ApproachHeadProps) {
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
