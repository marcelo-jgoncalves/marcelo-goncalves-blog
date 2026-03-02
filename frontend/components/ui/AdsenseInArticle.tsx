'use client'; // Necessário se for rodar o push() do AdSense no client-side
import React, { useEffect } from 'react';

interface AdsenseInArticleProps {
  blockId: string; 
  variant: 'summary-divider' | 'in-content' | 'in-feed'; 
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 🚀 Adicionamos a propriedade "format" para domar o Google
const AdsenseSlot: React.FC<{ blockId: string; className: string; format?: string }> = ({ 
  blockId, 
  className, 
  format = 'auto' 
}) => {
    
    // Injeta o anúncio assim que o componente é montado no lado do cliente
    useEffect(() => {
      if (IS_PRODUCTION) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error('Erro ao carregar o AdSense', err);
        }
      }
    }, []);

    return (
        <div className={className} aria-hidden="true">
            {/* 🚀 A tag real do Google. Substitua o data-ad-client pelo seu ID real! */}
            <ins 
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-SEU_ID_AQUI" 
              data-ad-slot={blockId}
              data-ad-format={format}
              data-full-width-responsive="true"
            />
        </div>
    );
};

export default function AdsenseInArticle({ blockId, variant }: AdsenseInArticleProps) {
  
  let placeholderClass = '';
  let placeholderText = ''; 
  let adFormat = 'auto'; // Formato padrão
  
  if (variant === 'summary-divider') {
    placeholderClass = 'adsense-content-banner';
    placeholderText = `[ADSENSE TOPO: ${blockId}]`;
    adFormat = 'horizontal'; // Força formato horizontal no topo
  } else if (variant === 'in-content') {
    placeholderClass = 'adsense-placeholder-box'; 
    placeholderText = `[ADSENSE IN-ARTICLE: ${blockId}]`;
    adFormat = 'rectangle'; // 🚀 A MÁGICA: Pede explicitamente o bloco quadrado 300x250
  } else if (variant === 'in-feed') {
    placeholderClass = 'adsense-placeholder-box'; 
    placeholderText = `[ADSENSE IN-FEED: ${blockId}]`;
    adFormat = 'fluid'; // Ideal para feeds
  }

  // 1. Lógica Condicional (Produção)
  if (IS_PRODUCTION) {
    const adSlot = <AdsenseSlot blockId={blockId} className={placeholderClass} format={adFormat} />;

    if (variant === 'summary-divider') {
        return <div className="summary-ads-wrapper">{adSlot}</div>;
    }
    return adSlot;
  }
  
  // 2. Placeholder para Desenvolvimento
  const placeholderElement = (
    <div className={placeholderClass}>
      <span aria-hidden="true" style={{ fontSize: '0.8rem', color: '#666' }}>{placeholderText}</span>
    </div>
  );

  if (variant === 'summary-divider') {
    return <div className="summary-ads-wrapper" style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>{placeholderElement}</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
       {placeholderElement}
    </div>
  );
}