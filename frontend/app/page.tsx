/**frontend/app/page.tsx — Home institucional (site empresarial) */

import './home.css';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getRecentPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import PageHero from '@/components/ui/PageHero';
import StepsTimeline from '@/components/ui/StepsTimeline';
import { IconCycle, IconBolt, IconCloud, IconChip, IconChart } from '@/components/ui/InstitutionalIcons';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME } from '@/lib/config';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | Consultoria de tecnologia` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | Consultoria de tecnologia`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
  },
  twitter: {
    title: `${SITE_NAME} | Consultoria de tecnologia`,
    description: SITE_DESCRIPTION,
  },
};

const PAINS = [
  { n: '01', label: 'Processos lentos' },
  { n: '02', label: 'Retrabalho constante' },
  { n: '03', label: 'Sistemas desconectados' },
  { n: '04', label: 'Infraestrutura difícil de manter' },
  { n: '05', label: 'Pouca automação' },
  { n: '06', label: 'Baixo uso de IA' },
];

const SERVICES = [
  {
    title: 'Transformação Digital',
    description: 'Digitalização de processos, modernização operacional e integração entre sistemas.',
    Icon: IconCycle,
  },
  {
    title: 'Automação Inteligente',
    description: 'Automação de tarefas, workflows e operações, utilizando IA quando fizer sentido.',
    Icon: IconBolt,
  },
  {
    title: 'Cloud & Infraestrutura',
    description: 'Arquiteturas modernas, seguras, escaláveis e preparadas para crescer com o negócio.',
    Icon: IconCloud,
  },
  {
    title: 'Inteligência Artificial',
    description: 'Assistentes internos, análise de dados e aplicações práticas de IA no dia a dia.',
    Icon: IconChip,
  },
  {
    title: 'Modernização Tecnológica',
    description: 'Atualização de aplicações, observabilidade, DevOps, FinOps e evolução contínua.',
    Icon: IconChart,
  },
];

const STEPS = [
  { title: 'Diagnóstico', description: 'Entendemos seu cenário, prioridades e onde a tecnologia trava o negócio.' },
  { title: 'Planejamento', description: 'Desenhamos o caminho, com escopo, prazos e resultados esperados.' },
  { title: 'Implementação', description: 'Executamos com engenharia moderna, automação e segurança desde o início.' },
  { title: 'Acompanhamento', description: 'Medimos, ajustamos e garantimos a entrega do resultado combinado.' },
  { title: 'Evolução Contínua', description: 'A tecnologia acompanha o negócio: melhorias e novas oportunidades ao longo do tempo.' },
];

const DIFERENCIAIS = [
  'Soluções sob medida',
  'Engenharia moderna',
  'Automação desde o primeiro dia',
  'IA aplicada ao negócio',
  'Arquiteturas preparadas para crescer',
  'Foco em resultado',
];

interface HomePost {
  slug: string;
  titulo: string;
  resumo?: string;
  categoria_slug: string;
  categoria?: { nome_exibicao: string };
  data_publicacao?: string;
  tempo_leitura_min?: number;
  imagem_destaque_url?: string;
  imagem_destaque_alt_text?: string;
  imagem_lqip_base64?: string;
}

function delay(ms: number): CSSProperties {
  return { '--reveal-delay': `${ms}ms` } as CSSProperties;
}

export default async function InstitutionalHome() {
  const recentData = await getRecentPosts(3).catch(() => ({ posts: [] }));
  const recent: HomePost[] = recentData?.posts || [];

  return (
    <>
      <PageHero
        className="ih-hero"
        dataAudit="ih-hero"
        eyebrow="Consultoria de tecnologia"
        title={<>Tecnologia para empresas que querem <em>evoluir</em>.</>}
        subtitle="Modernizamos operações, automatizamos processos e aplicamos Inteligência Artificial para tornar empresas mais eficientes, escaláveis e preparadas para crescer."
        decoration={
          <div className="ih-hero-decoration" aria-hidden="true">
            <div className="ih-hero-grid" />
            <div className="ih-hero-glow-1" />
            <div className="ih-hero-glow-2" />
          </div>
        }
      >
        <div className="ih-hero-actions reveal" style={delay(180)}>
          <Link href="/contato" className="btn">Agendar diagnóstico <span aria-hidden="true">→</span></Link>
          <Link href="/servicos" className="ih-btn-outline">Conhecer serviços</Link>
        </div>
        <div className="ih-hero-status reveal" style={delay(240)}>
          <span className="ih-hero-status-dot" aria-hidden="true" />
          Da estratégia à execução, engenharia moderna aplicada ao seu negócio
        </div>
      </PageHero>

      {/* O problema */}
      <section className="ih-section">
        <div className="wrap ih-problema-grid">
          <div className="reveal">
            <div className="sec-ey">O ponto de partida</div>
            <h2 className="sec-t">Tecnologia só faz sentido quando gera resultado.</h2>
            <p className="sec-desc" style={{ maxWidth: 460 }}>
              Cada empresa enfrenta desafios diferentes. Nossa missão é transformar esses desafios em oportunidades, aplicando tecnologia de forma estratégica, nunca como um fim em si mesma.
            </p>
          </div>
          <div className="ih-pains-grid reveal" style={delay(120)}>
            {PAINS.map((pain) => (
              <div className="ih-pain-cell" key={pain.n}>
                <span className="ih-pain-num">{pain.n}</span>
                <span className="ih-pain-label">{pain.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como ajudamos */}
      <section className="ih-section ih-section--surface">
        <div className="wrap">
          <div className="sec-head-row reveal">
            <div className="left">
              <div className="sec-ey">Serviços</div>
              <h2 className="sec-t">Como ajudamos sua empresa a evoluir.</h2>
            </div>
            <Link className="sec-link sec-link-clay" href="/servicos">Ver todos os serviços →</Link>
          </div>
          <div className="ih-services-grid" data-audit="ih-services-grid">
            {SERVICES.map((svc, i) => (
              <div className="ih-service-card reveal" style={delay((i % 3) * 70)} key={svc.title}>
                <div className="ih-icon-box"><svc.Icon /></div>
                <h3>{svc.title}</h3>
                <p>{svc.description}</p>
              </div>
            ))}
            <Link href="/contato" className="ih-diagnostic-card reveal" style={delay(140)}>
              <span className="ih-diagnostic-label">Não sabe por onde começar?</span>
              <h3>Um diagnóstico gratuito mostra onde a tecnologia pode acelerar sua empresa.</h3>
              <span className="ih-diagnostic-link">Agendar diagnóstico <span aria-hidden="true">→</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Abordagem */}
      <section className="ih-section">
        <div className="wrap">
          <div className="ih-center-head reveal">
            <div className="sec-ey" style={{ justifyContent: 'center' }}>Nossa abordagem</div>
            <h2 className="sec-t">Do problema ao resultado, em etapas claras.</h2>
          </div>
          <div className="reveal" style={delay(100)}>
            <StepsTimeline steps={STEPS} dataAudit="ih-steps" />
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="ih-section ih-section--surface">
        <div className="wrap ih-dif-grid">
          <div className="reveal">
            <div className="sec-ey">Por que nós</div>
            <h2 className="sec-t">Muito além da implementação.</h2>
            <p className="sec-desc" style={{ maxWidth: 380 }}>
              Uma consultoria que combina visão estratégica com execução técnica, do primeiro diagnóstico à evolução contínua.
            </p>
          </div>
          <div className="ih-chips-grid reveal" style={delay(120)}>
            {DIFERENCIAIS.map((label) => (
              <div className="ih-chip" key={label}>
                <span className="ih-chip-check" aria-hidden="true">✓</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      {recent.length > 0 && (
        <section className="ih-section">
          <div className="wrap">
            <div className="sec-head-row reveal">
              <div className="left">
                <div className="sec-ey">Blog</div>
                <h2 className="sec-t">Conhecimento que gera autoridade.</h2>
                <p className="sec-desc">Compartilhamos aprendizados para ajudar empresas e profissionais a evoluírem continuamente.</p>
              </div>
              <Link className="sec-link sec-link-clay" href="/blog">Ver blog →</Link>
            </div>
            <div className="ih-blog-grid" data-audit="ih-blog-grid">
              {recent.map((post, i) => (
                <div className="reveal" style={delay((i % 3) * 80)} key={post.slug}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quem somos + Fundador (teaser) */}
      <section className="ih-section ih-section--surface">
        <div className="wrap ih-about-grid">
          <div className="reveal">
            <div className="sec-ey">Quem somos</div>
            <h2 className="sec-t">Uma consultoria feita para pequenas e médias empresas.</h2>
            <p className="sec-desc" style={{ maxWidth: 480 }}>
              Ajudamos organizações a modernizar processos, automatizar operações, adotar computação em nuvem e aplicar Inteligência Artificial para gerar eficiência, segurança e crescimento sustentável.
            </p>
          </div>
          <div className="ih-founder-teaser reveal" style={delay(120)}>
            <div className="sec-ey">Fundador</div>
            <h3>{AUTHOR_NAME}</h3>
            <p>
              Cloud, DevOps, automação e arquitetura de soluções aplicados a problemas reais de negócio, de pequenas empresas a projetos maiores.
            </p>
            <Link className="sec-link sec-link-clay" href="/sobre">Conheça minha trajetória →</Link>
          </div>
        </div>
      </section>

      <section className="ih-cta-final" id="contato">
        <div className="ih-cta-final-glow" aria-hidden="true" />
        <div className="ih-cta-final-in reveal">
          <h2>Vamos construir a <em>evolução</em> da sua empresa.</h2>
          <p>
            Toda empresa tem oportunidades de melhoria: algumas resolvidas com automação, outras com modernização da infraestrutura, outras com Inteligência Artificial. O primeiro passo é entender o seu cenário.
          </p>
          <Link href="/contato" className="ih-cta-final-btn">Agendar diagnóstico <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}
