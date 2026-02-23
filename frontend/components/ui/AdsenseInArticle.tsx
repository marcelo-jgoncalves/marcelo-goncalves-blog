// frontend/components/ui/AdsenseInArticle.tsx

import React from 'react';

interface AdsenseInArticleProps {
  blockId: string; 
  variant: 'summary-divider' | 'in-content' | "in-feed"; 
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const AdsenseSlot: React.FC<{ blockId: string; className: string }> = ({ blockId, className }) => {
    return (
        <div className={className}>
            {/* Aqui seria renderizado o código do Google AdSense. */}
        </div>
    );
};

export default function AdsenseInArticle({ blockId, variant }: AdsenseInArticleProps) {
  
  let placeholderClass = '';
  let placeholderText = ''; 
  
  // Define classes e texto baseados na variante
  if (variant === 'summary-divider') {
    placeholderClass = 'adsense-content-banner';
    placeholderText = `[ADSENSE TOPO RESPONSIVO: ${blockId}]`;
  } else if (variant === 'in-content') {
    placeholderClass = 'adsense-placeholder-box'; 
    placeholderText = `[ADSENSE IN-ARTICLE RESPONSIVO: ${blockId}]`;
  } else if (variant === 'in-feed') {
    // 🚀 AQUI: Adicionamos a lógica para a nova variante
    placeholderClass = 'adsense-placeholder-box'; // Reutilizando a classe do box
    placeholderText = `[ADSENSE IN-FEED RESPONSIVO: ${blockId}]`;
  }

  // 1. Lógica Condicional (Produção)
  if (IS_PRODUCTION) {
    const adSlot = <AdsenseSlot blockId={blockId} className={placeholderClass} />;

    if (variant === 'summary-divider') {
        return <div className="summary-ads-wrapper">{adSlot}</div>;
    }
    // Como a página d'O Projeto já envolve o in-feed numa div com margem,
    // podemos apenas retornar o slot puro aqui, igual ao in-content.
    return adSlot;
  }
  
  // 2. Placeholder para Desenvolvimento
  const placeholderElement = (
    <div className={placeholderClass}>
      <span aria-hidden="true">{placeholderText}</span>
    </div>
  );

  if (variant === 'summary-divider') {
    return <div className="summary-ads-wrapper">{placeholderElement}</div>;
  }

  return placeholderElement;
}