// frontend/components/ui/AdsenseSidebar.tsx
// 🚀 ARQUITETURA: Isolamento Estrito
import './AdsenseSidebar.css';

interface AdsenseSidebarProps {
  blockId?: string;
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export default function AdsenseSidebar({ blockId = "sidebar-300x600" }: AdsenseSidebarProps) {
  
  if (IS_PRODUCTION) {
    return (
      <div className="sidebar-ad-container" aria-label="Anúncio">
          {/* 🚀 PILAR 3 (Performance): O contêiner pai já reserva o espaço de 600px exatos,
               eliminando qualquer possibilidade de CLS quando o JS do Google carregar. */}
          {/* <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXXX" data-ad-slot={blockId}></ins> */}
      </div>
    );
  }
  
  return (
    <div className="sidebar-ad-container ad-placeholder" aria-label="Espaço de anúncio reservado">
      <span aria-hidden="true">[ADSENSE: {blockId}]</span>
    </div>
  );
}