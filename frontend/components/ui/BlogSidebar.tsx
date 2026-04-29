// frontend/components/ui/BlogSidebar.tsx

import NewsletterWidget from './NewsletterWidget';
import AdsenseSidebar from './AdsenseSidebar';
import PopularPostsWidget from './PopularPostsWidget';
import './BlogSidebar.css';

interface BlogSidebarProps {
  children?: React.ReactNode;
  adsenseBlockId?: string;
  showPopularPosts?: boolean;
}

export default function BlogSidebar({
  children,
  adsenseBlockId = "sidebar-300x600",
  showPopularPosts = true,
}: BlogSidebarProps) {
  return (
    <aside className="blog-sidebar" aria-label="Barra lateral do blog">

      {children && (
        <div className="sidebar-dynamic-area">
          {children}
        </div>
      )}
      {showPopularPosts && <PopularPostsWidget />}
      <AdsenseSidebar blockId={adsenseBlockId} />
      <NewsletterWidget />

    </aside>
  );
}