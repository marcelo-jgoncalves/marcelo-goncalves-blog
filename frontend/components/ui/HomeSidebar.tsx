// frontend/components/ui/HomeSidebar.tsx
import ServiceCallout from './ServiceCallout';
import AdsenseSidebar from './AdsenseSidebar';
import './HomeSidebar.css';

export default function HomeSidebar() {
  return (
    <aside className="home-sidebar" aria-label="Barra lateral">
      <ServiceCallout />
      <AdsenseSidebar blockId="sidebar-300x600" />
    </aside>
  );
}
