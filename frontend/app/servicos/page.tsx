import Link from 'next/link';

export const revalidate = 3600;

export const metadata = {
  title: 'Consultoria AWS e DevOps | Marcelo Gonçalves',
  description: 'Serviços de consultoria especializada em Arquitetura Serverless, FinOps, DevOps e Engenharia de Nuvem na AWS.',
};

export default function ServicosPage() {
  return (
    <>
      {/* 1. Hero da Página */}
      <section className="hero-section"> {/* Reutilizando classe padrão */}
        <div className="container">
          <h1 className="hero-title">
            Consultoria em AWS, DevOps, FinOps e <span className="highlight">Serverless</span>
          </h1>
          <p className="hero-subtitle">
            Transforme suas ideias em arquiteturas escaláveis, seguras e com custos otimizados, usando a mesma engenharia que move este blog.
          </p>
        </div>
      </section>

      {/* 2. Lista de Serviços */}
      <section className="services-content container">
        
        {/* Serviço 1: Arquitetura */}
        <div className="service-item">
          <div className="service-icon">
            <i className="fas fa-cloud"></i>
          </div>
          <div className="service-text">
            <h2>Arquitetura de Nuvem (AWS)</h2>
            <p>
              Desenho e implementação de soluções robustas e escaláveis na AWS. Foco em arquiteturas que equilibram performance, custo e segurança, utilizando os serviços certos para o seu problema (EC2, Containers, VPC).
            </p>
          </div>
        </div>

        {/* Serviço 2: FinOps */}
        <div className="service-item">
          <div className="service-icon">
            <i className="fas fa-hand-holding-dollar"></i>
          </div>
          <div className="service-text">
            <h2>FinOps & Otimização de Custos</h2>
            <p>
              Auditoria completa da sua fatura AWS. Identificação de desperdícios, implementação de tags de alocação, rightsizing de recursos e estratégias de compra (Savings Plans) para reduzir drasticamente o seu TCO.
            </p>
          </div>
        </div>

        {/* Serviço 3: DevOps (Texto Alterado conforme solicitado) */}
        <div className="service-item">
          <div className="service-icon">
            <i className="fas fa-gears"></i>
          </div>
          <div className="service-text">
            <h2>Automação e DevOps (IaC & CI/CD)</h2>
            <p>
              Criação de pipelines de CI/CD (GitHub Actions) e automação completa de infraestrutura como código (Terraform). Crio o &quot;botão mágico&quot; que permite à sua equipe fazer deploys seguros e repetíveis.
            </p>
          </div>
        </div>

        {/* Serviço 4: Serverless */}
        <div className="service-item">
          <div className="service-icon">
            <i className="fas fa-bolt"></i>
          </div>
          <div className="service-text">
            <h2>Desenvolvimento Serverless</h2>
            <p>
              Construção de backends e APIs de alta performance e custo zero quando ociosos. Especialista em AWS Lambda, API Gateway e DynamoDB para escalar do zero a milhões de usuários sem gerenciar servidores.
            </p>
          </div>
        </div>

      </section>

      {/* 3. Prova Social (Making Of) */}
      <section className="super-destaque">
        <div className="container">
          <h2>Não acredite apenas na minha palavra. Veja o <i>making of</i>.</h2>
          <p>
            Este blog, da infraestrutura serverless ao frontend Next.js, foi construído com as exatas metodologias que ofereço. Acompanhe a jornada técnica.
          </p>
          <Link href="/o-projeto" className="btn btn-primary">
            Conheça &quot;O Projeto&quot; &rarr;
          </Link>
        </div>
      </section>

      {/* 4. CTA Final de Vendas */}
      <section className="sales-cta">
        <div className="container">
          <h2>Pronto para otimizar sua operação?</h2>
          <p>
            Vamos conversar. Agende uma chamada inicial de 30 minutos (sem custo) para discutirmos a sua arquitetura e os seus desafios.
          </p>
          {/* Link fictício, substitua pelo seu link do Calendly/Google Calendar real */}
          <Link href="#" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 35px' }}>
            Agendar Chamada &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}