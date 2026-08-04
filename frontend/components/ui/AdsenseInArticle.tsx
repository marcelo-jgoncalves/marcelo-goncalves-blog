
'use client';

import React, { useEffect } from 'react';
import styles from './AdsenseInArticle.module.css';

interface AdsenseInArticleProps {
  blockId: string;
  variant: 'summary-divider' | 'in-content' | 'in-feed';
}

const ADSENSE_CONFIGURED = false; // Switch to true once the publisher ID is active

const AdsenseSlot: React.FC<{ blockId: string; className: string; format?: string }> = ({
  blockId,
  className,
  format = 'auto'
}) => {
    useEffect(() => {
      if (ADSENSE_CONFIGURED) {
        try {
          // @ts-expect-error adsbygoogle has no official types, injected by the AdSense script
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error('Erro ao carregar o AdSense', err);
        }
      }
    }, []);

    return (
        <div className={`${styles.opAdsenseWrapper} ${className}`} aria-hidden="true">
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
    placeholderClass = styles.adsenseSummaryMock;
    placeholderText = `[ADSENSE TOPO: ${blockId}]`;
    adFormat = 'auto';
  } else if (variant === 'in-content') {
    placeholderClass = styles.adsenseInContentMock;
    placeholderText = `[ADSENSE IN-ARTICLE: ${blockId}]`;
    adFormat = 'auto';
  } else if (variant === 'in-feed') {
    placeholderClass = styles.adsenseInFeedMock;
    placeholderText = `[ADSENSE IN-FEED: ${blockId}]`;
    adFormat = 'fluid';
  }

  if (ADSENSE_CONFIGURED) {
    return <AdsenseSlot blockId={blockId} className={placeholderClass} format={adFormat} />;
  }

  // Simplified return for development: just a div with the correct class
  return (
    <div className={`${styles.opAdsenseWrapper} ${styles.opAdsenseDevMock} ${placeholderClass}`}>
      <span aria-hidden="true">
        {placeholderText}
      </span>
    </div>
  );
}
