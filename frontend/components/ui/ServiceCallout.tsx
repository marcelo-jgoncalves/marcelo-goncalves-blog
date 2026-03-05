/* frontend/components/ui/ServiceCallout.tsx*/

import Link from 'next/link';
import './ServiceCallout.css';

export default function ServiceCallout() {
  return (
    <section className="op-service-callout" aria-labelledby="op-callout-title">
      <div className="op-callout-icon-box" aria-hidden="true">
        {/* SVG Manual: Substitui o FontAwesome para otimizar LCP */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      </div>
      
      <h3 id="op-callout-title" className="op-callout-title">
        Precisa de Ajuda?
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