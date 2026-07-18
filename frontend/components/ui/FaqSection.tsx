/* frontend/components/ui/FaqSection.tsx
   Seção "Perguntas frequentes" completa (eyebrow + título + acordeão) —
   até aqui duplicada, byte a byte, no page.module.css das 4 landings de pilar
   (Cloud & DevOps, Engenharia de Software, Integração & Automação, IA).
   Único ponto de verdade: só `items` (e opcionalmente eyebrow/título) mudam por uso. */

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
