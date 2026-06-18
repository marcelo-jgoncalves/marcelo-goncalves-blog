/* frontend/app/servicos/page.tsx */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import './servicos.css';
import PageHero from '@/components/ui/PageHero';
import CtaAssessoria from '@/components/ui/CtaAssessoria';

const TITLE = `Assessoria em AWS, DevOps, FinOps e IA | ${SITE_NAME}`;
const DESCRIPTION = 'Assessoria especializada em arquitetura AWS, DevOps, FinOps, segurança, observabilidade e IA aplicada — da estratégia ao deploy em produção.';

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
  name: `Assessoria AWS, DevOps e IA — ${AUTHOR_NAME}`,
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
    name: 'Serviços de Assessoria',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transformação Digital', description: 'Automatize processos, elimine tarefas repetitivas e conecte seus sistemas para operar com mais velocidade, controle e menos retrabalho.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automação de Processos', description: 'Elimine tarefas repetitivas, reduza retrabalho e acelere operações com automações inteligentes, integrações entre sistemas e execução automática de rotinas críticas.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Arquitetura de Nuvem (AWS)', description: 'Estruture ambientes cloud seguros, escaláveis e preparados para crescer com alta disponibilidade, governança e continuidade operacional desde a base.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Migração de Aplicações', description: 'Leve seus sistemas para a nuvem com segurança, menos risco e mínima interrupção, modernizando sua operação para ganhar escala, eficiência e flexibilidade.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IA Aplicada & Automação Inteligente', description: 'Transforme IA em produtividade real com automações, assistentes inteligentes e fluxos personalizados que reduzem trabalho manual, aceleram decisões e aumentam eficiência operacional.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'DevOps & Entrega Contínua', description: 'Automatize entregas, padronize infraestrutura e acelere deploys com mais segurança, previsibilidade e menos erros operacionais.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Observabilidade & Resiliência Operacional', description: 'Monitore sua infraestrutura, aplicações e processos em tempo real para antecipar falhas, reduzir indisponibilidade e garantir operações mais estáveis e previsíveis.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'FinOps & Otimização de Custos', description: 'Reduza desperdícios, aumente previsibilidade e otimize seus investimentos em cloud com governança financeira, rightsizing e estratégias inteligentes de consumo.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Backup & Disaster Recovery', description: 'Proteja seus dados e garanta continuidade operacional com estratégias de backup automatizado, planos de DR e políticas de retenção que reduzem risco e mantêm seu negócio ativo.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Segurança em Nuvem', description: 'Proteja sua infraestrutura, aplicações e dados com controles de acesso, boas práticas de segurança e governança para reduzir riscos, fortalecer conformidade e garantir continuidade operacional.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SysAdmin & Servidores Linux', description: 'Garanta estabilidade, segurança e alta performance para seus servidores Linux com administração especializada, troubleshooting avançado e sustentação contínua para ambientes críticos.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Desenvolvimento Serverless', description: 'Desenvolva APIs, automações e aplicações escaláveis com alta disponibilidade, menor custo operacional e sem a complexidade de gerenciar servidores.' } },
    ],
  },
};

export default function ServicosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicosJsonLd) }} />

      {/* HERO */}
      <PageHero
        className="svc-hero"
        dataAudit="svc-hero"
        eyebrow="Serviços · Assessoria"
        title={<>Assessoria em AWS, DevOps, FinOps e <em>Serverless</em></>}
        subtitle="Adote arquiteturas escaláveis com a mesma engenharia que move este blog — da decisão de stack ao deploy em produção."
        right={
          <div className="svc-hero-panel" data-audit="svc-hero-panel">
            <div className="svc-tagline"><span className="svc-dot"></span>Disponível para novos projetos</div>
            <div className="svc-hp-row"><span className="svc-hp-v svc-clay">30 min</span><span className="svc-hp-l">Diagnóstico inicial gratuito</span></div>
            <div className="svc-hp-row"><span className="svc-hp-v">24h</span><span className="svc-hp-l">Tempo de resposta</span></div>
            <div className="svc-hp-row"><span className="svc-hp-v">100%</span><span className="svc-hp-l">Remoto · sem compromisso</span></div>
          </div>
        }
        statsStrip={
          <div className="svc-stats-strip" data-audit="svc-stats-strip">
            <div className="svc-stat-item"><span className="svc-v">10</span><span className="svc-l">Frentes de atuação</span></div>
            <div className="svc-stat-item"><span className="svc-v">AWS</span><span className="svc-l">Especialização cloud</span></div>
            <div className="svc-stat-item"><span className="svc-v">IaC</span><span className="svc-l">Tudo em código</span></div>
            <div className="svc-stat-item"><span className="svc-v">FinOps</span><span className="svc-l">Custo sob controle</span></div>
          </div>
        }
      >
        <div className="svc-hero-actions">
          <a className="svc-btn-clay-hero" href="#contato">Entrar em contato <span className="svc-arrow">→</span></a>
        </div>
      </PageHero>

      {/* SERVIÇOS — PARTE 1 */}
      <section className="svc-section svc-section-part1" id="servicos">
        <div className="wrap">
          <div className="svc-sec-head" data-audit="svc-sec-head">
            <div className="svc-sec-ey">O que eu faço</div>
            <h2 className="svc-sec-t">Engenharia de ponta a ponta na nuvem</h2>
            <p className="svc-sec-desc">Dez frentes de atuação que cobrem o ciclo completo — da estratégia com IA à operação otimizada, segura e observável.</p>
          </div>

          <div className="svc-grid" data-audit="svc-grid-1">
            {/* 01 — Transformação Digital (wide, alt/petrol) */}
            <div className="svc-card svc-wide svc-alt" data-audit="svc-card-wide-alt">
              <div className="svc-wide-media">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                </div>
                <span className="svc-wide-num">01</span>
              </div>
              <div className="svc-wide-body">
                <div className="svc-wtag">Destaque · Estratégia</div>
                <h3>Transformação Digital</h3>
                <p>Automatize processos, elimine tarefas repetitivas e conecte seus sistemas para operar com mais velocidade, controle e menos retrabalho.</p>
                <ul className="svc-wide-list">
                  <li><strong>Desenvolvimento de apps internos</strong> e portais operacionais para digitalizar processos e fluxos de aprovação</li>
                  <li><strong>Automação de tarefas repetitivas</strong>, introduza IA aplicada, documentos, relatórios e rotinas manuais</li>
                  <li><strong>Integração entre sistemas e dados</strong> para eliminar retrabalho, reduzir erros e acelerar decisões</li>
                </ul>
              </div>
              <div className="svc-wide-tags">
                <span>Eficiência</span>
                <span>Conformidade</span>
                <span>Modernização</span>
              </div>
            </div>

            {/* 02 — Automação de Processos */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="2" /><path d="M7 11v3a2 2 0 0 0 2 2h4" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
                </div>
                <span className="svc-num">02</span>
              </div>
              <h3>Automação de Processos</h3>
              <p>Elimine tarefas repetitivas, reduza retrabalho e acelere operações com automações inteligentes, integrações entre sistemas e execução automática de rotinas críticas.</p>
              <div className="svc-tags">
                <span>Workflows</span>
                <span>Integrações</span>
                <span>Automação</span>
              </div>
            </div>

            {/* 03 — Arquitetura AWS (destaque) */}
            <div className="svc-card svc-feat" data-audit="svc-card-feat">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.6-1.4A4 4 0 0 0 6 19h11.5z" /></svg>
                </div>
                <span className="svc-num">03</span>
              </div>
              <h3>Arquitetura de Nuvem (AWS)</h3>
              <p>Estruture ambientes cloud seguros, escaláveis e preparados para crescer com alta disponibilidade, governança e continuidade operacional desde a base.</p>
              <div className="svc-tags">
                <span>AWS</span>
                <span>Escalabilidade</span>
                <span>Alta Disponibilidade</span>
              </div>
            </div>

            {/* 04 — Migração */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h13M4 8l4-4M4 8l4 4" /><path d="M20 16H7M20 16l-4-4M20 16l-4 4" /></svg>
                </div>
                <span className="svc-num">04</span>
              </div>
              <h3>Migração de Aplicações</h3>
              <p>Leve seus sistemas para a nuvem com segurança, menos risco e mínima interrupção, modernizando sua operação para ganhar escala, eficiência e flexibilidade.</p>
              <div className="svc-tags">
                <span>Migração Cloud</span>
                <span>Modernização</span>
                <span>AWS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS — PARTE 2 */}
      <section className="svc-section svc-section-cont">
        <div className="wrap">
          <div className="svc-grid" data-audit="svc-grid-2">
            {/* 05 — IA Aplicada (wide, destaque) */}
            <div className="svc-card svc-wide" data-audit="svc-card-wide">
              <div className="svc-wide-media">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="8" width="16" height="12" rx="2" /><path d="M12 8V4M9 4h6" /><circle cx="9" cy="14" r="1.2" /><circle cx="15" cy="14" r="1.2" /><path d="M2 13v3M22 13v3" />
                  </svg>
                </div>
                <span className="svc-wide-num">05</span>
              </div>
              <div className="svc-wide-body">
                <div className="svc-wtag">Destaque · Diferencial</div>
                <h3>IA Aplicada & Automação Inteligente</h3>
                <p>Transforme IA em produtividade real com automações, assistentes inteligentes e fluxos personalizados que reduzem trabalho manual, aceleram decisões e aumentam eficiência operacional.</p>
              </div>
              <div className="svc-wide-tags">
                <span>LLMs</span>
                <span>Automação</span>
                <span>Assistentes IA</span>
              </div>
            </div>

            {/* 06 — DevOps */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                  </svg>
                </div>
                <span className="svc-num">06</span>
              </div>
              <h3>DevOps & Entrega Contínua</h3>
              <p>Automatize entregas, padronize infraestrutura e acelere deploys com mais segurança, previsibilidade e menos erros operacionais.</p>
              <div className="svc-tags">
                <span>CI/CD</span>
                <span>Terraform</span>
                <span>Automação</span>
              </div>
            </div>

            {/* 07 — Observabilidade */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19h16" /><path d="M7 16V9M11.5 16V5M16 16v-4" /><circle cx="19" cy="6" r="2.2" /><path d="m20.6 7.6 1.4 1.4" />
                  </svg>
                </div>
                <span className="svc-num">07</span>
              </div>
              <h3>Observabilidade & Resiliência Operacional</h3>
              <p>Monitore sua infraestrutura, aplicações e processos em tempo real para antecipar falhas, reduzir indisponibilidade e garantir operações mais estáveis e previsíveis.</p>
              <div className="svc-tags">
                <span>Monitoramento</span>
                <span>Logs</span>
                <span>Alertas</span>
              </div>
            </div>

            {/* 08 — FinOps */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 16.5c2-1.2 4-1.2 6 0s4 1.2 6 0" /><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M12 9.2v.2M12 10.6v.2" /><path d="M18 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8" />
                  </svg>
                </div>
                <span className="svc-num">08</span>
              </div>
              <h3>FinOps & Otimização de Custos</h3>
              <p>Reduza desperdícios, aumente previsibilidade e otimize seus investimentos em cloud com governança financeira, rightsizing e estratégias inteligentes de consumo.</p>
              <div className="svc-tags">
                <span>Rightsizing</span>
                <span>Savings Plans</span>
                <span>Governança</span>
              </div>
            </div>

            {/* 09 — Backup & DR (wide, moss/petrol+clay) */}
            <div className="svc-card svc-wide svc-moss" data-audit="svc-card-wide-moss">
              <div className="svc-wide-media">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 9v4c0 1.66 4.03 3 9 3s9-1.34 9-3V9" /><path d="M3 13v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4" />
                  </svg>
                </div>
                <span className="svc-wide-num">09</span>
              </div>
              <div className="svc-wide-body">
                <div className="svc-wtag">Destaque · Continuidade</div>
                <h3>Backup & Disaster Recovery</h3>
                <p>Proteja seus dados e garanta continuidade operacional com estratégias de backup automatizado, planos de DR e políticas de retenção que reduzem risco e mantêm seu negócio ativo mesmo diante de falhas.</p>
                <ul className="svc-wide-list">
                  <li><strong>Backups automatizados e validados</strong> com restore testado, frequência configurável e armazenamento seguro</li>
                  <li><strong>Planos de disaster recovery (DR)</strong> com RTO e RPO definidos, failover documentado e ambientes de contingência prontos para ativação</li>
                  <li><strong>Estratégias de retenção, conformidade</strong> e auditoria de dados para atender requisitos regulatórios e proteger informações críticas</li>
                </ul>
              </div>
              <div className="svc-wide-tags">
                <span>Backup</span>
                <span>Continuidade</span>
                <span>Disaster Recovery</span>
              </div>
            </div>

            {/* 10 — Segurança */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>
                </div>
                <span className="svc-num">10</span>
              </div>
              <h3>Segurança em Nuvem</h3>
              <p>Proteja sua infraestrutura, aplicações e dados com controles de acesso, boas práticas de segurança e governança para reduzir riscos, fortalecer conformidade e garantir continuidade operacional.</p>
              <div className="svc-tags">
                <span>IAM</span>
                <span>Hardening</span>
                <span>Compliance</span>
              </div>
            </div>

            {/* 11 — SysAdmin */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /><path d="M7 7.5h.01M7 16.5h.01" /></svg>
                </div>
                <span className="svc-num">11</span>
              </div>
              <h3>SysAdmin & Servidores Linux</h3>
              <p>Garanta estabilidade, segurança e alta performance para seus servidores Linux com administração especializada, troubleshooting avançado e sustentação contínua para ambientes críticos.</p>
              <div className="svc-tags">
                <span>Linux</span>
                <span>Hardening</span>
                <span>Performance</span>
              </div>
            </div>

            {/* 12 — Serverless */}
            <div className="svc-card">
              <div className="svc-top">
                <div className="svc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" /></svg>
                </div>
                <span className="svc-num">12</span>
              </div>
              <h3>Desenvolvimento Serverless</h3>
              <p>Desenvolva APIs, automações e aplicações escaláveis com alta disponibilidade, menor custo operacional e sem a complexidade de gerenciar servidores.</p>
              <div className="svc-tags">
                <span>APIs</span>
                <span>Lambda</span>
                <span>Escalabilidade</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaAssessoria
        id="contato"
        eyebrow="Vamos começar"
        title={<>Vamos trabalhar <em>juntos</em>?</>}
        description="Agende uma chamada inicial de 30 minutos. Sem custo, sem compromisso — só clareza sobre como posso ajudar."
        points={[
          <span key="p1">Diagnóstico objetivo da sua <b>infraestrutura</b> e dos próximos passos</span>,
          <span key="p2">Plano de ação claro, <b>sem pressão de venda</b></span>,
          <span key="p3">Resposta em até <b>24h</b>, 100% remoto</span>,
        ]}
        cardTagline="Disponível para novos projetos"
        cardTitle="Vamos conversar sobre o seu projeto"
        cardSubtitle="Conte o desafio e eu retorno com um plano objetivo. Diagnóstico inicial gratuito."
        cardBody={
          <div className="cta-adv-meta">
            <div className="cta-adv-meta-row">
              <span className="cta-adv-ml">Chamada inicial</span>
              <span className="cta-adv-mv clay">30 min · gratuita</span>
            </div>
            <div className="cta-adv-meta-row">
              <span className="cta-adv-ml">Formato</span>
              <span className="cta-adv-mv">100% remoto</span>
            </div>
            <div className="cta-adv-meta-row">
              <span className="cta-adv-ml">Tempo de resposta</span>
              <span className="cta-adv-mv">até 24h</span>
            </div>
          </div>
        }
        ctaHref="mailto:contato@marcelogoncalves.com"
        ctaLabel="Entrar em contato"
        ctaExternal={true}
        reassure="Sem compromisso · sem custo"
      />
    </>
  );
}
