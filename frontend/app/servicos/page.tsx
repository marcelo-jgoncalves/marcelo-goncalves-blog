import './servicos.css';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import PageHero from '@/components/ui/PageHero';
import PageCTA from '@/components/ui/PageCTA';

export const revalidate = 3600;

const TITLE = 'Consultoria AWS e DevOps | Marcelo Gonçalves';
const DESCRIPTION = 'Serviços de consultoria especializada em Arquitetura Serverless, FinOps, DevOps e Engenharia de Nuvem na AWS.';

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
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Arquitetura de Nuvem (AWS)', description: 'Desenho e implementação de soluções robustas e escaláveis na AWS.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'FinOps & Otimização de Custos', description: 'Auditoria da fatura AWS, rightsizing e estratégias de compra.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automação e DevOps (IaC & CI/CD)', description: 'Pipelines de CI/CD com GitHub Actions e Terraform.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Desenvolvimento Serverless', description: 'Backends e APIs com AWS Lambda, API Gateway e DynamoDB.' } },
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
          Consultoria em AWS, DevOps, FinOps e <span className="highlight">Serverless</span>
        </h1>
        <p className="hero-subtitle">
          Adote arquiteturas escaláveis e com engenharia similar a deste blog.
        </p>
      </PageHero>

      {/* 2. Serviços 1–3 */}
      <div className="services-content">
        <div className="service-item">
          <div className="service-icon"><i className="fas fa-cloud"></i></div>
          <div className="service-text">
            <h2>Arquitetura de Nuvem (AWS)</h2>
            <p>Desenho e implementação de soluções robustas e escaláveis na AWS. Foco em arquiteturas que equilibram performance, custo e segurança, utilizando os serviços certos para o seu problema (EC2, Containers, VPC).</p>
          </div>
        </div>

        <div className="service-item">
          <div className="service-icon"><i className="fas fa-hand-holding-dollar"></i></div>
          <div className="service-text">
            <h2>FinOps & Otimização de Custos</h2>
            <p>Auditoria completa da sua fatura AWS. Identificação de desperdícios, implementação de tags de alocação, rightsizing de recursos e estratégias de compra (Savings Plans) para reduzir drasticamente o seu TCO.</p>
          </div>
        </div>

        <div className="service-item">
          <div className="service-icon"><i className="fas fa-gears"></i></div>
          <div className="service-text">
            <h2>Automação e DevOps (IaC & CI/CD)</h2>
            <p>Criação de pipelines de CI/CD (GitHub Actions) e automação completa de infraestrutura como código (Terraform). Crio o &quot;botão mágico&quot; que permite à sua equipe fazer deploys seguros e repetíveis.</p>
          </div>
        </div>
      </div>

      {/* 3. Prova social — fullwidth, fundo azul profundo */}
      <section className="service-proof-fullwidth">
        <div className="service-proof-fullwidth__inner">
          <h2>
            Não acredite apenas na minha palavra. Veja o{' '}
            <em style={{ color: '#000000', fontStyle: 'italic' }}>making of</em>.
          </h2>
          <p>
            Este blog, da infraestrutura serverless ao frontend Next.js, foi construído
            com as exatas metodologias que ofereço.
          </p>
          <Link href="/o-projeto" className="service-proof-btn">
            Conheça &quot;O Projeto&quot; →
          </Link>
        </div>
      </section>

      {/* 4. Serviço 4 */}
      <div className="services-content">
        <div className="service-item">
          <div className="service-icon"><i className="fas fa-bolt"></i></div>
          <div className="service-text">
            <h2>Desenvolvimento Serverless</h2>
            <p>Construção de backends e APIs de alta performance e custo zero quando ociosos. Especialista em AWS Lambda, API Gateway e DynamoDB para escalar do zero a milhões de usuários sem gerenciar servidores.</p>
          </div>
        </div>
      </div>

      {/* 3. CTA final — agendar chamada */}
      <PageCTA
        title="Vamos trabalhar juntos?"
        body="Agende uma chamada inicial de 30 minutos. Sem custo, sem compromisso — só clareza sobre como posso ajudar."
        linkHref="mailto:marcelo.mjgoncalves@gmail.com?subject=Consultoria%20AWS"
        linkText="Entrar em Contato →"
      />
    </>
  );
}
