'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Aqui, dentro de um Client Component, o 'ssr: false' é permitido.
const ShareButtons = dynamic(() => import('./ShareButtons'), {
  ssr: false,
  loading: () => (
    // Placeholder idêntico ao original para evitar pulo visual
    <div 
      className="share-section" 
      style={{ minHeight: '52px' }} 
      aria-hidden="true" 
    />
  ),
});

export default ShareButtons;