// frontend/components/ui/AdsenseInArticle.tsx

import React from 'react';

interface AdsenseInArticleProps {
  blockId: string; 
  variant: 'summary-divider' | 'in-content'; 
}

// Simula a lógica para determinar se deve carregar o AdSense real ou o placeholder.
// Em um projeto real, você usaria uma variável de ambiente mais específica.
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Componente para o slot de anúncio do Google AdSense
// Em um projeto real, este seria o local onde o script do Adsense é renderizado.
const AdsenseSlot: React.FC<{ blockId: string; className: string }> = ({ blockId, className }) => {
    // A implementação real do Adsense JS iria aqui, usando className para o CLS.
    return (
        <div className={className}>
            {/* Aqui seria renderizado o código do Google AdSense.
                Ex: <ins class="adsbygoogle" data-ad-client="ca-pub-XXXXXX" data-ad-slot={blockId} /> 
            */}
            {/* Para simulação, retornamos apenas o placeholder, mas sem o estilo tracejado */}
        </div>
    );
};


export default function AdsenseInArticle({ blockId, variant }: AdsenseInArticleProps) {
  
  let placeholderClass = '';
  let placeholderText = ''; 
  
  // Define classes e texto baseados na variante
  if (variant === 'summary-divider') {
    // Banner Topo: Responsivo (Retangular Mobile / Horizontal Desktop)
    placeholderClass = 'adsense-content-banner';
    placeholderText = `[ADSENSE TOPO RESPONSIVO: ${blockId}]`;
  } else if (variant === 'in-content') {
    // Banner In-Article: Responsivo (Retangular Mobile / Horizontal Desktop)
    placeholderClass = 'adsense-placeholder-box'; 
    placeholderText = `[ADSENSE IN-ARTICLE RESPONSIVO: ${blockId}]`;
  }

  // 1. Lógica Condicional: Se for Produção, renderiza o slot real (que só tem classes CLS)
  if (IS_PRODUCTION) {
    const adSlot = <AdsenseSlot blockId={blockId} className={placeholderClass} />;

    if (variant === 'summary-divider') {
        return <div className="summary-ads-wrapper">{adSlot}</div>;
    }
    // Retorna apenas o slot para a injeção in-content (wrapper adicionado via injectAd.ts)
    return adSlot;
  }
  
  // 2. Se não for Produção (Desenvolvimento/Placeholder), renderiza o estilo tracejado

  const placeholderElement = (
    // Usa a classe CSS que define a borda tracejada, fundo e min-height
    <div className={placeholderClass}>
      <span aria-hidden="true">{placeholderText}</span>
    </div>
  );

  if (variant === 'summary-divider') {
    // O summary-divider precisa do wrapper de margem
    return <div className="summary-ads-wrapper">{placeholderElement}</div>;
  }

  // O in-content não precisa do wrapper extra no JSX, pois é injetado no HTML
  return placeholderElement;
}