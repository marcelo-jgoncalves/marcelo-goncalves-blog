/* frontend/app/servicos/page.tsx */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import './servicos.css';

const TITLE = `Consultoria em AWS, DevOps, FinOps e IA | ${SITE_NAME}`;
const DESCRIPTION = 'Consultoria especializada em arquitetura AWS, DevOps, FinOps, segurança, observabilidade e IA aplicada — da estratégia ao deploy em produção.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
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

export const revalidate = 3600;

const servicosJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `Consultoria AWS, DevOps e IA — ${AUTHOR_NAME}`,
  description: DESCRIPTION,
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
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IA Aplicada & Engenharia de Prompts', description: 'Adoção de IA com foco em resultado — prompts, automações e fluxos que entregam respostas precisas e reutilizáveis em produção.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Observabilidade & Engenharia de Logs', description: 'Métricas, logs e tracing centralizados na AWS com alertas inteligentes e análise comportamental.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'FinOps & Otimização de Custos', description: 'Auditoria da fatura AWS, rightsizing de recursos e estratégias de compra para reduzir o TCO.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'DevOps & Entrega Contínua', description: 'Pipelines de CI/CD e infraestrutura como código para deploys seguros e repetíveis.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Desenvolvimento Serverless', description: 'Backends e APIs de alta performance com AWS Lambda, API Gateway e DynamoDB.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Arquitetura de Nuvem (AWS)', description: 'Desenho e implementação de soluções robustas e escaláveis na AWS.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Segurança em Nuvem', description: 'Auditoria AWS baseada no Well-Architected Framework e plano de remediação priorizado.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transformação Digital', description: 'Modernização de processos, conformidade com a LGPD e integração de sistemas.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SysAdmin & Servidores Linux', description: 'Administração, hardening de segurança e automação operacional de servidores Linux.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Migração de Aplicações', description: 'Rehosting, replatforming e modernização do legado on-premise para a AWS, sem downtime surpresa.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automação de Processos', description: 'Scripts, integrações e robôs que eliminam tarefas manuais e reduzem erros.' } },
    ],
  },
};

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function ServicosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicosJsonLd) }} />

      {/* HERO */}
      <section className="svc-hero" data-audit="svc-hero">
        <div className="svc-hero-in" data-audit="svc-hero-in">
          <div className="svc-hero-left">
            <div className="svc-ey">Serviços · Consultoria</div>
            <h1>Consultoria em AWS, DevOps, FinOps e <em>Serverless</em></h1>
            <p className="svc-sub">Adote arquiteturas escaláveis com a mesma engenharia que move este blog — da decisão de stack ao deploy em produção.</p>
            <div className="svc-hero-actions">
              <a className="svc-btn-clay-hero" href="#contato">Entrar em contato <span className="svc-arrow">→</span></a>
              <a className="svc-btn-ghost" href="#servicos">Ver serviços ↓</a>
            </div>
          </div>

          <div className="svc-hero-panel" data-audit="svc-hero-panel">
            <div className="svc-tagline"><span className="svc-dot"></span>Disponível para novos projetos</div>
            <div className="svc-hp-row">
              <span className="svc-hp-v svc-clay">30 min</span>
              <span className="svc-hp-l">Diagnóstico inicial gratuito</span>
            </div>
            <div className="svc-hp-row">
              <span className="svc-hp-v">24h</span>
              <span className="svc-hp-l">Tempo de resposta</span>
            </div>
            <div className="svc-hp-row">
              <span className="svc-hp-v">100%</span>
              <span className="svc-hp-l">Remoto · sem compromisso</span>
            </div>
          </div>
        </div>

        <div className="svc-stats-strip" data-audit="svc-stats-strip">
          <div className="svc-stat-item"><span className="svc-v">10</span><span className="svc-l">Frentes de atuação</span></div>
          <div className="svc-stat-item"><span className="svc-v">AWS</span><span className="svc-l">Especialização cloud</span></div>
          <div className="svc-stat-item"><span className="svc-v">IaC</span><span className="svc-l">Tudo em código</span></div>
          <div className="svc-stat-item"><span className="svc-v">FinOps</span><span className="svc-l">Custo sob controle</span></div>
        </div>
      </section>

      {/* SERVIÇOS — PARTE 1 */}
      <section className="svc-section" id="servicos">
        <div className="wrap">
          <div className="svc-sec-head" data-audit="svc-sec-head">
            <div className="svc-sec-ey">O que eu faço</div>
            <h2 className="svc-sec-t">Engenharia de ponta a ponta na nuvem</h2>
            <p className="svc-sec-desc">Dez frentes de atuação que cobrem o ciclo completo — da estratégia com IA à operação otimizada, segura e observável.</p>
          </div>

          <div className="svc-grid" data-audit="svc-grid-1">
            {/* 01 — IA Aplicada (wide, destaque) */}
            <div className="svc-card svc-wide" data-audit="svc-card-wide">
              <div className="svc-wide-media">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="8" width="16" height="12" rx="2" /><path d="M12 8V4M9 4h6" /><circle cx="9" cy="14" r="1.2" /><circle cx="15" cy="14" r="1.2" /><path d="M2 13v3M22 13v3" />
                  </svg>
                </div>
                <span className="svc-wide-num">01</span>
              </div>
              <div className="svc-wide-body">
                <div className="svc-wtag">Destaque · Diferencial</div>
                <h3>IA Aplicada & Engenharia de Prompts</h3>
                <p>Adoção de IA com foco em resultado, não em hype. Formado em Letras com mestrado em Linguística, conecto a estrutura da linguagem à arquitetura dos modelos — prompts, automações e fluxos que entregam respostas precisas e reutilizáveis em produção.</p>
              </div>
              <div className="svc-wide-tags">
                <span>Prompt Engineering</span>
                <span>LLMs</span>
                <span>Automação</span>
              </div>
            </div>

            {/* 02 — Observabilidade */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19h16" /><path d="M7 16V9M11.5 16V5M16 16v-4" /><circle cx="19" cy="6" r="2.2" /><path d="m20.6 7.6 1.4 1.4" />
                  </svg>
                </div>
                <span className="svc-num">02</span>
              </div>
              <h3>Observabilidade & Engenharia de Logs</h3>
              <p>Observabilidade completa na AWS com métricas, logs e tracing centralizados. Alertas inteligentes e análise comportamental para detectar falhas e ameaças antes que impactem o negócio.</p>
              <div className="svc-tags">
                <span>Métricas</span>
                <span>Logs</span>
                <span>Tracing</span>
              </div>
            </div>

            {/* 03 — FinOps */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 16.5c2-1.2 4-1.2 6 0s4 1.2 6 0" /><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M12 9.2v.2M12 10.6v.2" /><path d="M18 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8" />
                  </svg>
                </div>
                <span className="svc-num">03</span>
              </div>
              <h3>FinOps & Otimização de Custos</h3>
              <p>Auditoria completa da sua fatura AWS. Identificação de desperdícios, tags de alocação, rightsizing de recursos e estratégias de compra para reduzir drasticamente o seu TCO.</p>
              <div className="svc-tags">
                <span>Savings Plans</span>
                <span>Rightsizing</span>
                <span>Tags</span>
              </div>
            </div>

            {/* 04 — DevOps */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                  </svg>
                </div>
                <span className="svc-num">04</span>
              </div>
              <h3>DevOps & Entrega Contínua</h3>
              <p>Criação de pipelines de CI/CD e infraestrutura como código. Crio o &quot;botão mágico&quot; que permite à sua equipe fazer deploys seguros, repetíveis e sem medo — com cultura de entrega contínua.</p>
              <div className="svc-tags">
                <span>GitHub Actions</span>
                <span>Terraform</span>
                <span>CI/CD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAKING OF */}
      <section className="svc-makingof">
        <div className="svc-makingof-in" data-audit="svc-makingof-in">
          <div className="svc-mo-left">
            <div className="svc-mo-ey">Prova viva</div>
            <h2>Não acredite apenas na minha palavra. Veja o <em>making of</em>.</h2>
            <p>Este blog, da infraestrutura serverless ao frontend Next.js, foi construído com as exatas metodologias que ofereço — e cada decisão está documentada publicamente.</p>
            <Link className="svc-mo-cta" href="/o-projeto">Conheça &quot;O Projeto&quot; <span className="svc-arrow">→</span></Link>
          </div>

          <div className="svc-mo-right">
            <div className="svc-proof-card" data-audit="svc-proof-card">
              <div className="svc-proof-label"><span className="svc-dot"></span>Construído em público</div>
              <div className="svc-proof-stack">
                <div className="svc-proof-item">
                  <div className="svc-pi-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" /></svg>
                  </div>
                  <div className="svc-pi-txt">
                    <span className="svc-pi-t">Backend 100% serverless</span>
                    <span className="svc-pi-d">Lambda · API Gateway · DynamoDB</span>
                  </div>
                </div>
                <div className="svc-proof-item">
                  <div className="svc-pi-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
                  </div>
                  <div className="svc-pi-txt">
                    <span className="svc-pi-t">Deploy por código</span>
                    <span className="svc-pi-d">GitHub Actions · Terraform</span>
                  </div>
                </div>
                <div className="svc-proof-item">
                  <div className="svc-pi-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="M7 16V9M11.5 16V5M16 16v-4" /></svg>
                  </div>
                  <div className="svc-pi-txt">
                    <span className="svc-pi-t">Custo e métricas expostos</span>
                    <span className="svc-pi-d">CloudWatch · Dashboard público</span>
                  </div>
                </div>
              </div>
              <div className="svc-proof-foot">
                <div className="svc-pf-stack">
                  <span className="svc-pf-v">~100%</span>
                  <span className="svc-pf-l">Construído com IA</span>
                </div>
                <div className="svc-pf-stack" style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <span className="svc-pf-v">12 mo</span>
                  <span className="svc-pf-l">Em produção</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS — PARTE 2 */}
      <section className="svc-section svc-section-cont">
        <div className="wrap">
          <div className="svc-grid" data-audit="svc-grid-2">
            {/* 05 — Serverless */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" /></svg>
                </div>
                <span className="svc-num">05</span>
              </div>
              <h3>Desenvolvimento Serverless</h3>
              <p>Construção de backends e APIs de alta performance e custo zero quando ociosos. Especialista em escalar do zero a milhões de usuários sem gerenciar servidores.</p>
              <div className="svc-tags">
                <span>Lambda</span>
                <span>API Gateway</span>
                <span>DynamoDB</span>
              </div>
            </div>

            {/* 06 — Arquitetura AWS (destaque) */}
            <div className="svc-card svc-feat" data-audit="svc-card-feat">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.6-1.4A4 4 0 0 0 6 19h11.5z" /></svg>
                </div>
                <span className="svc-num">06</span>
              </div>
              <h3>Arquitetura de Nuvem (AWS)</h3>
              <p>Desenho e implementação de soluções robustas e escaláveis na AWS. Foco em arquiteturas que equilibram performance, custo e segurança — usando os serviços certos para o seu problema.</p>
              <div className="svc-tags">
                <span>EC2</span>
                <span>Containers</span>
                <span>VPC</span>
              </div>
            </div>

            {/* 07 — Segurança */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>
                </div>
                <span className="svc-num">07</span>
              </div>
              <h3>Segurança em Nuvem</h3>
              <p>Auditoria completa da sua conta AWS baseada no Well-Architected Framework. Identificação de vulnerabilidades, configurações inadequadas e plano de remediação priorizado.</p>
              <div className="svc-tags">
                <span>Well-Architected</span>
                <span>Auditoria</span>
                <span>Remediação</span>
              </div>
            </div>

            {/* 08 — Transformação Digital (wide, alt/petrol) */}
            <div className="svc-card svc-wide svc-alt" data-audit="svc-card-wide-alt">
              <div className="svc-wide-media">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                </div>
                <span className="svc-wide-num">08</span>
              </div>
              <div className="svc-wide-body">
                <div className="svc-wtag">Destaque · Estratégia</div>
                <h3>Transformação Digital</h3>
                <p>Levo a tecnologia para perto de quem decide. Tiro o papel e o retrabalho da operação, deixo seus dados em conformidade e faço seus sistemas conversarem entre si — sem jargão, com foco em resultado.</p>
                <ul className="svc-wide-list">
                  <li><strong>Apps internos rápidos</strong> para digitalizar formulários em papel e fluxos de aprovação</li>
                  <li><strong>Conformidade & segurança</strong> — adequação à LGPD e rotinas automáticas de backup</li>
                  <li><strong>Integração de sistemas</strong> que você já usa, para eles &quot;conversarem&quot; e eliminarem a digitação dupla</li>
                </ul>
              </div>
              <div className="svc-wide-tags">
                <span>Modernização</span>
                <span>Conformidade</span>
                <span>Eficiência</span>
              </div>
            </div>

            {/* 09 — SysAdmin */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /><path d="M7 7.5h.01M7 16.5h.01" /></svg>
                </div>
                <span className="svc-num">09</span>
              </div>
              <h3>SysAdmin & Servidores Linux</h3>
              <p>Administração e manutenção de servidores Linux em produção. Hardening de segurança, scripting em Bash, tuning de performance e automação operacional com foco em confiabilidade e rastreabilidade.</p>
              <div className="svc-tags">
                <span>Bash</span>
                <span>Systemd</span>
                <span>Hardening</span>
              </div>
            </div>

            {/* 10 — Migração */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h13M4 8l4-4M4 8l4 4" /><path d="M20 16H7M20 16l-4-4M20 16l-4 4" /></svg>
                </div>
                <span className="svc-num">10</span>
              </div>
              <h3>Migração de Aplicações</h3>
              <p>Migração de aplicações da e para a nuvem com plano de risco controlado. Rehosting, replatforming e modernização — do legado on-premise ao ambiente AWS, sem downtime surpresa.</p>
              <div className="svc-tags">
                <span>Rehosting</span>
                <span>Replatforming</span>
                <span>Zero-downtime</span>
              </div>
            </div>

            {/* 11 — Automação */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="2" /><path d="M7 11v3a2 2 0 0 0 2 2h4" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
                </div>
                <span className="svc-num">11</span>
              </div>
              <h3>Automação de Processos</h3>
              <p>Automatizo qualquer tarefa repetitiva — de rotinas operacionais a fluxos de negócio. Scripts, integrações e robôs que eliminam o trabalho manual, reduzem erros e devolvem horas produtivas à sua equipe.</p>
              <div className="svc-tags">
                <span>Scripts</span>
                <span>Integrações</span>
                <span>Webhooks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="svc-cta-final" id="contato">
        <div className="svc-cta-final-in" data-audit="svc-cta-final-in">
          <div className="svc-cf-left">
            <div className="svc-ey">Vamos começar</div>
            <h2>Vamos trabalhar <em>juntos</em>?</h2>
            <p className="svc-desc">Agende uma chamada inicial de 30 minutos. Sem custo, sem compromisso — só clareza sobre como posso ajudar.</p>
            <ul className="svc-cf-points">
              <li><span className="svc-ck">{CHECK_ICON}</span><span>Diagnóstico objetivo da sua <b>infraestrutura</b> e dos próximos passos</span></li>
              <li><span className="svc-ck">{CHECK_ICON}</span><span>Plano de ação claro, <b>sem pressão de venda</b></span></li>
              <li><span className="svc-ck">{CHECK_ICON}</span><span>Resposta em até <b>24h</b>, 100% remoto</span></li>
            </ul>
          </div>

          <div className="svc-cf-card" data-audit="svc-cf-card">
            <div className="svc-tagline"><span className="svc-dot"></span>Disponível para novos projetos</div>
            <h3>Vamos conversar sobre o seu</h3>
            <p className="svc-cf-sub">Conte o desafio e eu retorno com um plano objetivo. Diagnóstico inicial gratuito.</p>
            <div className="svc-cf-meta">
              <div className="svc-cf-meta-row">
                <span className="svc-ml">Chamada inicial</span>
                <span className="svc-mv svc-clay">30 min · gratuita</span>
              </div>
              <div className="svc-cf-meta-row">
                <span className="svc-ml">Formato</span>
                <span className="svc-mv">100% remoto</span>
              </div>
              <div className="svc-cf-meta-row">
                <span className="svc-ml">Tempo de resposta</span>
                <span className="svc-mv">até 24h</span>
              </div>
            </div>
            <a className="svc-btn-clay-final" href="mailto:contato@marcelogoncalves.com">Entrar em contato <span className="svc-arrow">→</span></a>
            <p className="svc-reassure">Sem compromisso · sem custo</p>
          </div>
        </div>
      </section>
    </>
  );
}
