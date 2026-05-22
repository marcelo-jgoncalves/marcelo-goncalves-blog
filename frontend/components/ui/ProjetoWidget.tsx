// frontend/components/ui/ProjetoWidget.tsx
import Link from 'next/link';
import Eyebrow from './Eyebrow';
import './ProjetoWidget.css';

export default function ProjetoWidget() {
  return (
    <div className="projeto-widget">
      <Eyebrow text="O Projeto" color="white" />
      <h3 className="projeto-widget__title">Veja como este blog foi construído</h3>
      <p className="projeto-widget__desc">
        Do zero na AWS, quase 100% com IA. Uma jornada técnica documentada em tempo real.
      </p>
      <Link href="/o-projeto" className="projeto-widget__btn">
        Acompanhe a Jornada
      </Link>
    </div>
  );
}
