// frontend/components/ui/AdsenseSidebar.tsx
import './AdsenseSidebar.css';

interface AdsenseSidebarProps {
  blockId?: string;
}

const ADSENSE_CONFIGURED = false; // Trocar para true quando o publisher ID estiver ativo

export default function AdsenseSidebar({ blockId = "sidebar-300x600" }: AdsenseSidebarProps) {
  if (ADSENSE_CONFIGURED) {
    return (
      <div className="sidebar-ad-container" aria-label="Anúncio">
        <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXXX" data-ad-slot={blockId}></ins>
      </div>
    );
  }

  return (
    <div className="sidebar-ad-container ad-placeholder" aria-label="Espaço reservado para anúncio">
      <span aria-hidden="true">AdSense — 300×600</span>
    </div>
  );
}