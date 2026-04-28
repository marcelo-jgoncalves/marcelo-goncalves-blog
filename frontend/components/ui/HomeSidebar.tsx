// frontend/components/ui/HomeSidebar.tsx
import ServiceCallout from './ServiceCallout';
import PopularPostsWidget from './PopularPostsWidget';
import AdsenseSidebar from './AdsenseSidebar';
import ProjetoWidget from './ProjetoWidget';
import './HomeSidebar.css';

export default function HomeSidebar() {
  return (
    <aside className="home-sidebar" aria-label="Barra lateral">
      <ServiceCallout />
      <PopularPostsWidget />
      <AdsenseSidebar blockId="sidebar-300x600" />
      <ProjetoWidget />
    </aside>
  );
}
