// Complete "Perguntas frequentes" section (eyebrow + title + accordion),
// previously duplicated byte for byte across the 4 pillar landings' page
// files. Single source of truth: only `items` (and optionally
// eyebrow/title) vary per use.

import Faq, { type FaqItem } from './Faq';
import './FaqSection.css';

interface FaqSectionProps {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  id?: string;
  dataAudit?: string;
}

export default function FaqSection({
  items,
  eyebrow = 'Perguntas frequentes',
  title = 'Dúvidas antes de começar',
  id = 'faq',
  dataAudit,
}: FaqSectionProps) {
  return (
    <section id={id} className="faq-section" data-audit={dataAudit}>
      <div className="faq-section-wrap">
        <div className="faq-section-head">
          <span className="faq-section-eyebrow">{eyebrow}</span>
          <h2 className="faq-section-title">{title}</h2>
        </div>
        <Faq items={items} dataAudit={dataAudit ? `${dataAudit}-accordion` : undefined} />
      </div>
    </section>
  );
}
