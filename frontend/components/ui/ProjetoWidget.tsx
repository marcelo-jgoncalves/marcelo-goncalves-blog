// frontend/components/ui/ProjetoWidget.tsx
import Link from 'next/link';
import './ProjetoWidget.css';

export default function ProjetoWidget() {
  return (
    <div className="projeto-widget">
      <div className="projeto-widget__icon" aria-hidden="true">
        <i className="fas fa-layer-group" />
      </div>
      <h3 className="projeto-widget__title">O Projeto</h3>
      <p className="projeto-widget__desc">
        Veja como este blog foi construído do zero na AWS, quase 100% com IA.
      </p>
      <Link href="/o-projeto" className="projeto-widget__btn">
        Acompanhe a Jornada →
      </Link>
    </div>
  );
}
