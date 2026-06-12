/* frontend/components/ui/ServiceCallout.tsx*/

import Link from 'next/link';
import Eyebrow from './Eyebrow';
import './ServiceCallout.css';

export default function ServiceCallout() {
  return (
    <section className="op-service-callout" aria-labelledby="op-callout-title">
      <Eyebrow text="Consultoria" color="var(--surface)" />

      <h3 id="op-callout-title" className="op-callout-title">
        Precisa de ajuda <br /> com seu projeto, aplicação ou ambiente?
      </h3>

      <p className="op-callout-desc">
        Precisa implementar IA, AWS ou DevOps na sua empresa?
        Veja como posso apoiar o seu projeto.
      </p>

      <Link href="/servicos" className="op-btn-callout-primary">
        Conheça Meus Serviços
      </Link>
    </section>
  );
}
