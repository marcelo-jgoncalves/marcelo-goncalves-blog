// frontend/components/ui/SuperDestaque.tsx

import React from 'react';
import Link from 'next/link';


interface SuperDestaqueProps {
    title?: string;
    description?: string;
}

export default function SuperDestaque({ title, description }: SuperDestaqueProps) {
  
  // CORREÇÃO 1: Inclui o HTML <span class="highlight"> no defaultTitle
  const defaultTitle = 'Um Blog sobre as tecnologias do futuro, construído <span class="highlight">quase</span> 100% com IA.';
  const defaultDescription = 'Acompanhe a jornada, os desafios e os custos reais de construir este site do zero na AWS.';

  return (
    <section className="super-destaque">
      <div className="container">
        {/* CORREÇÃO 2: Adiciona um wrapper interno para garantir o padding de 20px nas laterais, 
           já que removemos o padding do .container no globals.css para o fundo 100% */}
        <div style={{ padding: '0 20px' }}> 
          
          <h2>
            {/* Renderiza o título usando dangerouslySetInnerHTML para aplicar o <span> highlight */}
            <span dangerouslySetInnerHTML={{ __html: title || defaultTitle }} />
          </h2>
          
          <p>
            {description || defaultDescription}
          </p>
          
          <Link href="/o-projeto" className="btn btn-primary">
            Conheça "O Projeto" &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}