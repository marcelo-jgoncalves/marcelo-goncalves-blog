import React from 'react';
import NewsletterWidget from './NewsletterWidget';
import AdsenseSidebar from './AdsenseSidebar';

interface BlogSidebarProps {
  children?: React.ReactNode;
  adsenseBlockId?: string;
}

export default function BlogSidebar({ 
  children, 
  adsenseBlockId = "sidebar-300x600" 
}: BlogSidebarProps) {
  return (
    <aside className="sidebar desktop-only">
      
      {/* 1 e 2. Área Dinâmica (Recebe o TOC e o ServiceCallout via children) */}
      <div className="sidebar-dynamic-area">
        {children}
      </div>

      {/* 3. Adsense Vertical (Fixo) */}
      <div className="mt-8">
        <AdsenseSidebar blockId={adsenseBlockId} />
      </div>

      {/* 4. Newsletter (Fixo) */}
      <div className="mt-8">
        <NewsletterWidget />
      </div>

    </aside>
  );
}