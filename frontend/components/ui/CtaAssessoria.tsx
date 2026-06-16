import Link from 'next/link';
import './CtaAssessoria.css';

export default function CtaAssessoria() {
  return (
    <section className="cta-adv" id="assessoria">
      <div className="cta-adv-in" data-audit="cta-adv-in">
        <div className="cta-adv-content">
          <div className="cta-adv-ey">Serviços · Consultoria</div>
          <h2>Precisa de ajuda com seu projeto?</h2>
          <p className="cta-adv-desc">O que você lê aqui, aplicado ao seu negócio. Sem hype, sem overhead. Engenharia cloud com IA onde faz sentido e corte de custo onde é possível.</p>
          <ul className="cta-adv-points">
            <li>
              <span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span>
              <span>Arquitetura <b>AWS</b> sob medida, sem desperdício de custo</span>
            </li>
            <li>
              <span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span>
              <span>Automação e <b>CI/CD</b> de ponta a ponta em código</span>
            </li>
            <li>
              <span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span>
              <span>Adoção de <b>IA</b> com foco em resultado, não em hype</span>
            </li>
          </ul>
        </div>
        <div className="cta-adv-card-wrap">
          <div className="cta-adv-card" data-audit="cta-adv-card">
            <div className="cta-adv-tagline"><span className="dot" />Disponível para novos projetos</div>
            <h3>Clique abaixo e conheça os serviços</h3>
            <p className="cta-adv-sub">Arquitetura, DevOps, FinOps, Serverless e mais. Veja como posso te ajudar.</p>
            <div className="cta-adv-svc">
              <span>Cloud · AWS</span><span>DevOps</span><span>IA aplicada</span><span>Mentoria</span>
            </div>
            <Link className="cta-adv-btn" href="/servicos">Ver todos os serviços <span className="arrow">→</span></Link>
            <div className="cta-adv-reassure">10 frentes de atuação · diagnóstico gratuito</div>
          </div>
        </div>
      </div>
    </section>
  );
}
