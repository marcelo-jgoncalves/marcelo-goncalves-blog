import './servicos.css';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import PageHero from '@/components/ui/PageHero';
import PageCTA from '@/components/ui/PageCTA';

export const revalidate = 3600;

const TITLE = 'Consultoria AWS e DevOps | Marcelo Gonçalves';
const DESCRIPTION = 'Arquitetura, modernização e otimização contínua de ambientes AWS. Serverless, FinOps, DevOps e Segurança Cloud.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/servicos` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/servicos`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: AUTHOR_TWITTER,
  },
};

const servicosJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `Consultoria AWS e DevOps — ${AUTHOR_NAME}`,
  description: 'Consultoria especializada em Arquitetura Serverless, FinOps, DevOps e Engenharia de Nuvem na AWS.',
  url: `${SITE_URL}/servicos`,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Cloud Computing Consulting',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Consultoria',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Diagnóstico AWS', description: 'Análise completa do ambiente para identificar riscos, desperdícios e oportunidades de melhoria.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transformação Cloud', description: 'Modernização completa da infraestrutura com arquiteturas cloud modernas, automatizadas e escaláveis.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Evolução Contínua', description: 'Acompanhamento estratégico para otimização contínua de custos, performance e segurança.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Arquitetura & Modernização', description: 'AWS Architecture, Serverless, Landing Zone e Platform Engineering.' } },
    ],
  },
};

export default function ServicosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicosJsonLd) }} />

      {/* 1. Hero */}
      <PageHero>
        <h1 className="hero-title">
          Arquitetura AWS moderna, segura e escalável
        </h1>
        <p className="hero-subtitle">
          👉 Estratégia e implementação AWS do diagnóstico à evolução contínua.
        </p>
        <a href="mailto:marcelo.mjgoncalves@gmail.com?subject=Consultoria%20AWS" className="btn">
          Agendar conversa estratégica
        </a>
      </PageHero>

      {/* 2. Como posso ajudar — 3 cards */}
      <section className="servicos-section">
        <div className="container">
          <h2 className="servicos-section__title">Como posso ajudar</h2>
          <div className="service-cards-grid">

            <div className="service-card">
              <div className="service-card__icon"><i className="fas fa-magnifying-glass"></i></div>
              <h3 className="service-card__name">Diagnóstico AWS</h3>
              <p className="service-card__desc">Análise completa do seu ambiente para identificar riscos, desperdícios e oportunidades de melhoria imediata.</p>
              <ul className="service-card__list">
                <li>Revisão de arquitetura</li>
                <li>Análise de custos</li>
                <li>Segurança e backups</li>
                <li>Roadmap de evolução</li>
              </ul>
              <a href="mailto:marcelo.mjgoncalves@gmail.com?subject=Diagnóstico%20AWS" className="service-card__action">
                Solicitar diagnóstico
              </a>
            </div>

            <div className="service-card service-card--featured">
              <div className="service-card__icon"><i className="fas fa-rocket"></i></div>
              <h3 className="service-card__name">Transformação Cloud</h3>
              <p className="service-card__desc">Modernização completa da sua infraestrutura com arquiteturas cloud modernas, automatizadas e escaláveis.</p>
              <ul className="service-card__list">
                <li>Arquitetura AWS</li>
                <li>Serverless &amp; Containers</li>
                <li>DevOps e IaC</li>
                <li>Segurança by design</li>
              </ul>
              <a href="mailto:marcelo.mjgoncalves@gmail.com?subject=Transformação%20Cloud" className="service-card__action">
                Iniciar projeto
              </a>
            </div>

            <div className="service-card">
              <div className="service-card__icon"><i className="fas fa-chart-line"></i></div>
              <h3 className="service-card__name">Evolução Contínua</h3>
              <p className="service-card__desc">Acompanhamento estratégico para otimização contínua de custos, performance e segurança do seu ambiente.</p>
              <ul className="service-card__list">
                <li>FinOps recorrente</li>
                <li>Observabilidade</li>
                <li>Revisões Well-Architected</li>
                <li>Advisory técnico</li>
              </ul>
              <a href="mailto:marcelo.mjgoncalves@gmail.com?subject=Evolução%20Contínua" className="service-card__action">
                Conversar sobre parceria
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 3. O que está incluso — 4 mini-cards, fundo alt */}
      <section className="servicos-section servicos-section--alt">
        <div className="container">
          <h2 className="servicos-section__title">O que está incluso</h2>
          <div className="incluso-grid">

            <div className="incluso-card">
              <div className="incluso-card__icon"><i className="fas fa-cloud"></i></div>
              <h3 className="incluso-card__name">Arquitetura &amp; Modernização</h3>
              <p>AWS Architecture, Serverless, Landing Zone e Platform Engineering.</p>
            </div>

            <div className="incluso-card">
              <div className="incluso-card__icon"><i className="fas fa-gears"></i></div>
              <h3 className="incluso-card__name">Automação &amp; DevOps</h3>
              <p>Terraform, CI/CD, automação de deploy e infraestrutura reproduzível.</p>
            </div>

            <div className="incluso-card">
              <div className="incluso-card__icon"><i className="fas fa-shield-halved"></i></div>
              <h3 className="incluso-card__name">Segurança &amp; Observabilidade</h3>
              <p>Cloud Security Review, monitoramento inteligente e Disaster Recovery.</p>
            </div>

            <div className="incluso-card">
              <div className="incluso-card__icon"><i className="fas fa-hand-holding-dollar"></i></div>
              <h3 className="incluso-card__name">FinOps &amp; Eficiência</h3>
              <p>Otimização de custos AWS, rightsizing e estratégias de compra inteligentes.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Experiência e Especialização */}
      <section className="servicos-section">
        <div className="container">
          <h2 className="servicos-section__title">Experiência e Especialização</h2>
          <div className="authority-tags">
            <span className="authority-tag">Arquiteturas Serverless AWS</span>
            <span className="authority-tag">Terraform &amp; DevOps</span>
            <span className="authority-tag">FinOps &amp; Otimização de Custos</span>
            <span className="authority-tag">Multi-Account &amp; Governança</span>
            <span className="authority-tag">Segurança Cloud</span>
          </div>
        </div>
      </section>

      {/* 5. Como funciona — 4 steps, fundo alt */}
      <section className="servicos-section servicos-section--alt">
        <div className="container">
          <h2 className="servicos-section__title">Como funciona</h2>
          <div className="steps-grid">

            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Entendimento</h3>
              <p>Compreensão dos desafios e objetivos do seu negócio.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Diagnóstico</h3>
              <p>Análise técnica aprofundada e definição do plano de evolução.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Implementação</h3>
              <p>Execução das melhorias com boas práticas AWS e DevOps.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Evolução</h3>
              <p>Otimização contínua e acompanhamento estratégico.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Prova social — making of */}
      <section className="service-proof-fullwidth">
        <div className="service-proof-fullwidth__inner">
          <h2>
            Não acredite apenas na minha palavra. Veja o{' '}
            <em className="accent-light">making of</em>.
          </h2>
          <p>
            Este blog, da infraestrutura serverless ao frontend Next.js, foi construído
            com as exatas metodologias que ofereço como consultor.
          </p>
          <Link href="/o-projeto" className="service-proof-btn">
            Conheça &quot;O Projeto&quot; →
          </Link>
        </div>
      </section>

      {/* 7. CTA final */}
      <PageCTA
        title="Vamos avaliar sua arquitetura AWS?"
        body="Uma conversa inicial para entender seu cenário e identificar oportunidades reais de melhoria. Sem custo, sem compromisso."
        linkHref="mailto:marcelo.mjgoncalves@gmail.com?subject=Consultoria%20AWS"
        linkText="Agendar conversa estratégica →"
      />
    </>
  );
}
