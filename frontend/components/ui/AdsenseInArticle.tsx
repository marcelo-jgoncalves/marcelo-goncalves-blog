
'use client'; 

import React, { useEffect } from 'react';
import './AdsenseInArticle.css'; // 🚀 Importando o novo arquivo de estilo

interface AdsenseInArticleProps {
  blockId: string; 
  variant: 'summary-divider' | 'in-content' | 'in-feed'; 
}

const ADSENSE_CONFIGURED = false; // Trocar para true quando o publisher ID estiver ativo

const AdsenseSlot: React.FC<{ blockId: string; className: string; format?: string }> = ({ 
  blockId, 
  className, 
  format = 'auto' 
}) => {
    useEffect(() => {
      if (ADSENSE_CONFIGURED) {
        try {
          // @ts-expect-error adsbygoogle não tem tipos oficiais — injetado pelo script do AdSense
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error('Erro ao carregar o AdSense', err);
        }
      }
    }, []);

    return (
        <div className={`op-adsense-wrapper ${className}`} aria-hidden="true">
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
    adFormat = 'auto'; 
  } else if (variant === 'in-content') {
    placeholderClass = 'adsense-in-content-mock'; 
    placeholderText = `[ADSENSE IN-ARTICLE: ${blockId}]`;
    adFormat = 'auto'; 
  } else if (variant === 'in-feed') {
    placeholderClass = 'adsense-in-feed-mock'; 
    placeholderText = `[ADSENSE IN-FEED: ${blockId}]`;
    adFormat = 'fluid'; 
  }

  if (ADSENSE_CONFIGURED) {
    return <AdsenseSlot blockId={blockId} className={placeholderClass} format={adFormat} />;
  }
  
  // Retorno simplificado para desenvolvimento: apenas uma DIV com a classe correta
  return (
    <div className={`op-adsense-wrapper op-adsense-dev-mock ${placeholderClass}`}>
      <span aria-hidden="true">
        {placeholderText}
      </span>
    </div>
  );
}