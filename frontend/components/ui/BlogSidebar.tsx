// frontend/components/ui/BlogSidebar.tsx

import NewsletterWidget from './NewsletterWidget';
import AdsenseSidebar from './AdsenseSidebar';
import './BlogSidebar.css';

interface BlogSidebarProps {
  children?: React.ReactNode;
  adsenseBlockId?: string;
}

export default function BlogSidebar({ 
  children, 
  adsenseBlockId = "sidebar-300x600" 
}: BlogSidebarProps) {
  return (
    /* 🚀 ARQUITETURA: Classes limpas, sem prefixos, sem redundâncias */
    <aside className="blog-sidebar" aria-label="Barra lateral do blog">
      
      {children && (
        <div className="sidebar-dynamic-area">
          {children}
        </div>
      )}
      
      <AdsenseSidebar blockId={adsenseBlockId} />
      <NewsletterWidget />

    </aside>
  );
}