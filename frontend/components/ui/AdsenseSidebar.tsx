// frontend/components/ui/AdsenseSidebar.tsx

import React from 'react';

interface AdsenseSidebarProps {
  blockId: string;
  // A classe CSS 'adsense-vertical' é usada para o estilo do placeholder e para o Adsense real.
}

// Simula a lógica para determinar se deve carregar o AdSense real ou o placeholder.
// Em um projeto real/Next.js, isso garante que o Adsense só é injetado em produção.
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Componente para o slot de anúncio do Google AdSense em produção.
// Ele apenas usa a classe de layout para reservar o espaço (CLS prevention).
const AdsenseSlot: React.FC<{ blockId: string; className: string }> = ({ blockId, className }) => {
    // Nota: A implementação real do Adsense JS (ins class="adsbygoogle" ...)
    // e o carregamento do script seriam feitos aqui ou em um componente wrapper.
    return (
        <div className={className}>
            {/* <ins class="adsbygoogle" data-ad-client="ca-pub-XXXXXX" data-ad-slot={blockId} /> */}
            {/* O conteúdo real do Adsense será renderizado aqui. */}
            {/* Em produção, o CSS do placeholder (borda tracejada e fundo) é automaticamente substituído pelo AdSense. */}
        </div>
    );
};


export default function AdsenseSidebar({ blockId }: AdsenseSidebarProps) {
  
  const placeholderClass = 'adsense-vertical';
  const placeholderText = `[ADSENSE VERTICAL SIDEBAR: ${blockId}]`;

  // 1. Lógica Condicional: Se for Produção, renderiza o slot real (que só tem classes CLS)
  if (IS_PRODUCTION) {
    return <AdsenseSlot blockId={blockId} className={placeholderClass} />;
  }
  
  // 2. Se não for Produção (Desenvolvimento/Placeholder), renderiza o estilo tracejado
  return (
    // Usa a classe CSS que define a borda tracejada, fundo e min-height (Seção 11 do globals.css)
    <div className={placeholderClass}>
      <span aria-hidden="true">{placeholderText}</span>
    </div>
  );
}