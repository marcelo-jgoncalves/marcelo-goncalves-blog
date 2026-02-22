/* frontend/components/ui/BlogSidebar.tsx */

import React from 'react';
import NewsletterWidget from './NewsletterWidget';
import AdsenseSidebar from './AdsenseSidebar';
import ServiceCallout from './ServiceCallout';

interface BlogSidebarProps {
  children?: React.ReactNode;
  adsenseBlockId?: string;
}

export default function BlogSidebar({ 
  children, 
  adsenseBlockId = "sidebar-300x600" 
}: BlogSidebarProps) {
  return (
    <aside className="sidebar hidden desktop-only">
      
      {/* 1. Área Dinâmica (Injetada pela página: System Status, TOC, etc) */}
      {children}

      {/* 2. Newsletter (Fixo) */}
      <NewsletterWidget />

      {/* 3. Adsense Vertical (Fixo) */}
      <AdsenseSidebar blockId={adsenseBlockId} />

      {/* 4. Service Callout (Fixo) */}
      <ServiceCallout />

    </aside>
  );
}