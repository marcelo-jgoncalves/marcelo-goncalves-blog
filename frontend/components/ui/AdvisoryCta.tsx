import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './AdvisoryCta.module.css';

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

function AdvisoryCard({ styles }: { styles: Record<string, string> }) {
  return (
    <div className={`cta-adv-svc ${styles.ctaAdvSvc}`}>
      <Link href="/software">Engenharia de Software</Link>
      <Link href="/inteligencia-artificial">Inteligência Artificial</Link>
      <Link href="/automacao">Integração & Automação</Link>
      <Link href="/plataforma">Cloud & DevOps</Link>
    </div>
  );
}

const DEFAULT_CARD_BODY = <AdvisoryCard styles={styles} />;

// Bloco de garantias padrão do diagnóstico gratuito — usado como `cardBody` pelas
// 4 landings de pilar (software, inteligencia-artificial, automacao, plataforma).
export const CTA_DIAGNOSIS_META = (
  <div className={`cta-adv-meta ${styles.ctaAdvMeta}`}>
    <div className={`cta-adv-meta-row ${styles.ctaAdvMetaRow}`}>
      <span className={`cta-adv-ml ${styles.ctaAdvMl}`}>Chamada inicial</span>
      <span className={`cta-adv-mv clay ${styles.ctaAdvMv} ${styles.clay}`}>60 min · gratuita</span>
    </div>
    <div className={`cta-adv-meta-row ${styles.ctaAdvMetaRow}`}>
      <span className={`cta-adv-ml ${styles.ctaAdvMl}`}>Formato</span>
      <span className={`cta-adv-mv ${styles.ctaAdvMv}`}>100% remoto</span>
    </div>
    <div className={`cta-adv-meta-row ${styles.ctaAdvMetaRow}`}>
      <span className={`cta-adv-ml ${styles.ctaAdvMl}`}>Tempo de resposta</span>
      <span className={`cta-adv-mv ${styles.ctaAdvMv}`}>max. 2h</span>
    </div>
  </div>
);

interface AdvisoryCtaProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  points?: ReactNode[];
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
  cardLabel,
  cardTitle = 'Conte-nos seu desafio. Nós ajudamos a encontrar a melhor solução.',
  cardBody = DEFAULT_CARD_BODY,
  ctaHref = '/#servicos',
  ctaLabel = 'Explorar os serviços',
  ctaExternal = false,
  reassure = 'Projetos sob medida · Primeira conversa sem compromisso',
}: AdvisoryCtaProps) {
  return (
    <section className={`cta-adv ${styles.ctaAdv}`} id={id}>
      <div className={`cta-adv-in ${styles.ctaAdvIn}`} data-audit="cta-adv-in">
        <div className={`cta-adv-content ${styles.ctaAdvContent}`}>
          <div className={`cta-adv-ey ${styles.ctaAdvEy}`}>{eyebrow}</div>
          <h2>{title}</h2>
          <p className={`cta-adv-desc ${styles.ctaAdvDesc}`}>{description}</p>
          <ul className={`cta-adv-points ${styles.ctaAdvPoints}`}>
            {points.map((point, i) => (
              <li key={i}>
                <span className="ck check-icon-clay">{CHECK_ICON}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="cta-adv-card-wrap">
          <div className={`cta-adv-card ${styles.ctaAdvCard}`} data-audit="cta-adv-card">
            {cardLabel && <div className={`cta-adv-label ${styles.ctaAdvLabel}`}><span className={`dot ${styles.ctaAdvLabelDot}`} />{cardLabel}</div>}
            <h3>{cardTitle}</h3>
            {cardBody}
            {ctaExternal || ctaHref.includes('#') ? (
              <a className={`btn cta-adv-btn ${styles.ctaAdvBtn}`} href={ctaHref}>
                {ctaLabel}
              </a>
            ) : (
              <Link className={`btn cta-adv-btn ${styles.ctaAdvBtn}`} href={ctaHref}>
                {ctaLabel}
              </Link>
            )}
            <div className={`cta-adv-reassure ${styles.ctaAdvReassure}`}>{reassure}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
