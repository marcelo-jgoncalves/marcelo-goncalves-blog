import Link from 'next/link';
import type { ReactNode } from 'react';
import './CtaAssessoria.css';

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const DEFAULT_POINTS: ReactNode[] = [
  <span key="p1">Arquitetura <b>AWS</b> sob medida, sem desperdício de custo</span>,
  <span key="p2">Automação e <b>CI/CD</b> de ponta a ponta em código</span>,
  <span key="p3">Adoção de <b>IA</b> com foco em resultado, não em hype</span>,
];

const DEFAULT_CARD_BODY = (
  <div className="cta-adv-svc">
    <span>Cloud · AWS</span><span>DevOps</span><span>IA aplicada</span><span>Mentoria</span>
  </div>
);

interface CtaAssessoriaProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  points?: ReactNode[];
  cardTagline?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardBody?: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  ctaExternal?: boolean;
  reassure?: string;
}

export default function CtaAssessoria({
  id = 'assessoria',
  eyebrow = 'Serviços · Assessoria',
  title = 'Precisa de ajuda com seu projeto?',
  description = 'O que você lê aqui, aplicado ao seu negócio. Sem hype, sem overhead. Engenharia cloud com IA onde faz sentido e corte de custo onde é possível.',
  points = DEFAULT_POINTS,
  cardTagline = 'Disponível para novos projetos',
  cardTitle = 'Clique abaixo e conheça os serviços',
  cardSubtitle = 'Arquitetura, DevOps, FinOps, Serverless e mais. Veja como posso te ajudar.',
  cardBody = DEFAULT_CARD_BODY,
  ctaHref = '/servicos',
  ctaLabel = 'Ver todos os serviços',
  ctaExternal = false,
  reassure = '10 frentes de atuação · diagnóstico gratuito',
}: CtaAssessoriaProps) {
  return (
    <section className="cta-adv" id={id}>
      <div className="cta-adv-in" data-audit="cta-adv-in">
        <div className="cta-adv-content">
          <div className="cta-adv-ey">{eyebrow}</div>
          <h2>{title}</h2>
          <p className="cta-adv-desc">{description}</p>
          <ul className="cta-adv-points">
            {points.map((point, i) => (
              <li key={i}>
                <span className="ck">{CHECK_ICON}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="cta-adv-card-wrap">
          <div className="cta-adv-card" data-audit="cta-adv-card">
            <div className="cta-adv-tagline"><span className="dot" />{cardTagline}</div>
            <h3>{cardTitle}</h3>
            <p className="cta-adv-sub">{cardSubtitle}</p>
            {cardBody}
            {ctaExternal ? (
              <a className="cta-adv-btn" href={ctaHref}>
                {ctaLabel} <span className="arrow">→</span>
              </a>
            ) : (
              <Link className="cta-adv-btn" href={ctaHref}>
                {ctaLabel} <span className="arrow">→</span>
              </Link>
            )}
            <div className="cta-adv-reassure">{reassure}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
