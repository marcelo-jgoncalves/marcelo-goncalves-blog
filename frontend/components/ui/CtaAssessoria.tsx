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
    <Link href="/engenharia-de-software">Engenharia de Software</Link>
    <Link href="/inteligencia-artificial">Inteligência Artificial</Link>
    <Link href="/integracao-automacao">Integração & Automação</Link>
    <Link href="/cloud-devops">Cloud & DevOps</Link>
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
  cardTitle = 'Conte-nos seu desafio. Nós ajudamos a encontrar a melhor solução.',
  cardSubtitle = 'Desenvolvimento, IA, automação, infraestrutura e mais. Veja como podemos ajudar.',
  cardBody = DEFAULT_CARD_BODY,
  ctaHref = '/#servicos',
  ctaLabel = 'Explorar os serviços',
  ctaExternal = false,
  reassure = 'Projetos sob medida · Primeira conversa sem compromisso',
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
