// frontend/components/ui/ShareButtonsWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Importação dinâmica com SSR desligado
const ShareButtons = dynamic(() => import('./ShareButtons'), {
  ssr: false, 
  loading: () => (
    // Placeholder para evitar pulo visual (CLS)
    <div 
      className="share-section" 
      style={{ minHeight: '52px' }} 
      aria-hidden="true" 
    />
  ),
});

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtonsWrapper(props: ShareButtonsProps) {
  return <ShareButtons {...props} />;
}