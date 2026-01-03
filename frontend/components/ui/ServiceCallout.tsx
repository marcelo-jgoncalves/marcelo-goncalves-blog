import React from 'react';
import Link from 'next/link';

export default function ServiceCallout() {
  return (
    <div className="sidebar-widget widget-services">
      <div className="card-icon-wrapper">
        <i className="fas fa-briefcase" aria-hidden="true"></i>
      </div>
      
      <span className="card-title">Precisa de Ajuda?</span>
      <p className="card-desc">
        Precisa implementar IA, AWS ou DevOps na sua empresa? 
        Veja como posso apoiar o seu projeto.
      </p>
      
      <Link href="/servicos" className="btn-full btn-primary">
        Conheça Meus Serviços
      </Link>
    </div>
  );
}