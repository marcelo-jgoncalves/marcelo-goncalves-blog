// frontend/components/ui/AdsenseInArticle

'use client'; 
import React, { useEffect } from 'react';

interface AdsenseInArticleProps {
  blockId: string; 
  variant: 'summary-divider' | 'in-content' | 'in-feed'; 
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const AdsenseSlot: React.FC<{ blockId: string; className: string; format?: string }> = ({ 
  blockId, 
  className, 
  format = 'auto' 
}) => {
    
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
  let adFormat = 'auto'; 
  
  if (variant === 'summary-divider') {
    placeholderClass = 'adsense-summary-mock';
    placeholderText = `[ADSENSE TOPO: ${blockId}]`;
    adFormat = 'horizontal'; 
  } else if (variant === 'in-content') {
    // 🚀 Trocamos para uma classe CSS controlável e formato 'auto'
    placeholderClass = 'adsense-in-content-mock'; 
    placeholderText = `[ADSENSE IN-ARTICLE: ${blockId}]`;
    adFormat = 'auto'; 
  } else if (variant === 'in-feed') {
    placeholderClass = 'adsense-in-feed-mock'; 
    placeholderText = `[ADSENSE IN-FEED: ${blockId}]`;
    adFormat = 'fluid'; 
  }

  if (IS_PRODUCTION) {
    const adSlot = <AdsenseSlot blockId={blockId} className={placeholderClass} format={adFormat} />;
    if (variant === 'summary-divider') return <div className="summary-ads-wrapper">{adSlot}</div>;
    return adSlot;
  }
  
  // Wrapper limpo, sem margens ou tamanhos fixos
  const devWrapperStyle: React.CSSProperties = { 
    display: 'flex', 
    justifyContent: 'center', 
    width: '100%' 
  };

  const mockBaseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    border: '2px dashed #cbd5e1',
    maxWidth: '100%',
    boxSizing: 'border-box'
  };

  const placeholderElement = (
    <div className={placeholderClass} style={mockBaseStyle}>
      <span aria-hidden="true" style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '10px' }}>
        {placeholderText}
      </span>
    </div>
  );

  if (variant === 'summary-divider') {
    return <div className="summary-ads-wrapper" style={devWrapperStyle}>{placeholderElement}</div>;
  }

  return <div style={devWrapperStyle}>{placeholderElement}</div>;
}