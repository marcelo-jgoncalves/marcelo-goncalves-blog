// frontend/components/ui/AdsenseContentBanner.tsx

import React from 'react';
// Não precisamos do Next/Script para a fase de placeholder
// Ele será adicionado quando a implementação real for iniciada.

interface AdsenseContentBannerProps {
  // Passamos o ID do bloco (slot) para ser visível no placeholder durante o desenvolvimento
  blockId: string; 
}

export default function AdsenseContentBanner({ blockId }: AdsenseContentBannerProps) {
  return (
    // Usa a classe que garante: 
    // 1. Responsividade (width: 100%, max-width: 728px)
    // 2. Prevenção de CLS (height: 90px)
    // 3. Estilização do placeholder (borda tracejada)
    <div className="adsense-content-banner">
      
      {/* O texto do placeholder para visualização */}
      <span aria-hidden="true">
        [ADSENSE PLACEHOLDER: {blockId} (728x90)]
      </span>
      
      {/* Aqui é onde o código real do AdSense será injetado depois */}
    </div>
  );
}