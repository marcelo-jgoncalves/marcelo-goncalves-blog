// frontend/components/ui/ProjetoWidget.tsx
import Link from 'next/link';
import Eyebrow from './Eyebrow';
import './ProjetoWidget.css';

export default function ProjetoWidget() {
  return (
    <div className="projeto-widget">
      <Eyebrow text="O Projeto" color="white" />
      <h3 className="projeto-widget__title">Acompanhe a construção<br />desta<br />plataforma</h3>
      <p className="projeto-widget__desc">
        Uma série contínua sobre infraestrutura, arquitetura, automações e desenvolvimento com IA — documentando cada etapa do projeto na prática.
      </p>
      <Link href="/o-projeto" className="projeto-widget__btn">
        Acompanhe a Jornada
      </Link>
    </div>
  );
}
