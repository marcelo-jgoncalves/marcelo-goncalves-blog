import Link from 'next/link';
import type { ReactNode } from 'react';
import './CtaAssessoria.css';

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const DEFAULT_POINTS: ReactNode[] = [
  <span key="p1">Sistemas desenvolvidos para a realidade da sua empresa</span>,
  <span key="p2">Processos integrados e automatizados</span>,
  <span key="p3">Plataformas escaláveis preparadas para crescer</span>,
];

const DEFAULT_CARD_BODY = (
  <div className="cta-adv-svc">
    <Link href="/software">Engenharia de Software</Link>
    <Link href="/inteligencia-artificial">Inteligência Artificial</Link>
    <Link href="/automacao">Integração & Automação</Link>
    <Link href="/plataforma">Cloud & DevOps</Link>
  </div>
);

// Bloco de garantias padrão do diagnóstico gratuito — usado como `cardBody` pelas
// 4 landings de pilar (software, inteligencia-artificial, automacao, plataforma).
export const CTA_DIAGNOSIS_META = (
  <div className="cta-adv-meta">
    <div className="cta-adv-meta-row">
      <span className="cta-adv-ml">Chamada inicial</span>
      <span className="cta-adv-mv clay">60 min · gratuita</span>
    </div>
    <div className="cta-adv-meta-row">
      <span className="cta-adv-ml">Formato</span>
      <span className="cta-adv-mv">100% remoto</span>
    </div>
    <div className="cta-adv-meta-row">
      <span className="cta-adv-ml">Tempo de resposta</span>
      <span className="cta-adv-mv">max. 2h</span>
    </div>
  </div>
);

interface AdvisoryCtaProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  points?: ReactNode[];
  cardTagline?: string | null;
  cardLabel?: string;
  cardTitle?: string;
  cardBody?: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  ctaExternal?: boolean;
  reassure?: string;
}

export default function AdvisoryCta({
  id = 'assessoria',
  eyebrow = 'Serviços · Assessoria',
  title = 'Precisa de ajuda com seu projeto?',
  description = 'O que você lê aqui, aplicado ao seu negócio. Sem hype, sem overhead. Engenharia cloud com IA onde faz sentido e corte de custo onde é possível.',
  points = DEFAULT_POINTS,
  cardTagline = 'Disponível para novos projetos',
  cardLabel,
  cardTitle = 'Conte-nos seu desafio. Nós ajudamos a encontrar a melhor solução.',
  cardBody = DEFAULT_CARD_BODY,
  ctaHref = '/#servicos',
  ctaLabel = 'Explorar os serviços',
  ctaExternal = false,
  reassure = 'Projetos sob medida · Primeira conversa sem compromisso',
}: AdvisoryCtaProps) {
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
            {cardTagline && <div className="cta-adv-tagline"><span className="dot" />{cardTagline}</div>}
            {cardLabel && <div className="cta-adv-label">{cardLabel}</div>}
            <h3>{cardTitle}</h3>
            {cardBody}
            {ctaExternal || ctaHref.includes('#') ? (
              <a className="btn cta-adv-btn" href={ctaHref}>
                {ctaLabel}
              </a>
            ) : (
              <Link className="btn cta-adv-btn" href={ctaHref}>
                {ctaLabel}
              </Link>
            )}
            <div className="cta-adv-reassure">{reassure}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
