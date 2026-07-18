/**frontend/app/page.tsx — Home institucional (specs/SPEC-Home.md — Home v6) */

import './home.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import PageHero from '@/components/ui/PageHero';
import StepsTimeline from '@/components/ui/StepsTimeline';
import { IconCycle, IconBolt, IconChip, IconCloud } from '@/components/ui/InstitutionalIcons';
import IconTile from '@/components/ui/IconTile';
import { RESULT_CASE_ILLUSTRATIONS } from '@/components/ui/ResultCaseIllustrations';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/config';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | Consultoria em Tecnologia` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | Consultoria em Tecnologia`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
  },
  twitter: {
    title: `${SITE_NAME} | Consultoria em Tecnologia`,
    description: SITE_DESCRIPTION,
  },
};

const PILLARS = [
  {
    kicker: 'Pilar · Software',
    title: 'Engenharia de Software',
    description: 'Desenvolvemos aplicações web, APIs e plataformas sob medida com foco em desempenho, escalabilidade e qualidade para impulsionar a inovação do seu negócio.',
    bullets: [
      <><strong>Sistemas sob medida</strong> para atender necessidades específicas</>,
      <><strong>Arquiteturas modernas</strong> preparadas para crescer com sua empresa</>,
      <><strong>APIs e microsserviços</strong> para soluções flexíveis e integradas</>,
    ],
    tags: ['Aplicações', 'APIs', 'Arquitetura'],
    Icon: IconCycle,
    wide: true,
    href: '/engenharia-de-software',
  },
  {
    kicker: 'Pilar · Inteligência',
    title: 'Inteligência Artificial',
    description: 'Aplicamos inteligência artificial para automatizar atividades, acelerar decisões e aumentar a produtividade da equipe com soluções práticas e integradas ao dia a dia.',
    bullets: [
      <><strong>Assistentes inteligentes</strong> para apoiar equipes e clientes</>,
      <><strong>Automação com IA</strong> para documentos, análises e atendimento</>,
      <><strong>IA integrada aos sistemas</strong> para processos mais rápidos e eficientes</>,
    ],
    tags: ['IA Generativa', 'Agentes', 'Produtividade'],
    Icon: IconChip,
    wide: true,
    href: '/inteligencia-artificial',
  },
  {
    kicker: 'Pilar · Automação',
    title: 'Integração & Automação',
    description: 'Conectamos sistemas e automatizamos processos para eliminar retrabalho, acelerar operações e garantir que as informações fluam de forma confiável entre toda a empresa.',
    bullets: [
      <><strong>Integração entre sistemas</strong> por APIs e eventos em tempo real</>,
      <><strong>Automação de processos</strong> para eliminar tarefas repetitivas</>,
      <><strong>Workflows inteligentes</strong> que reduzem erros e aumentam a produtividade</>,
    ],
    tags: ['Integrações', 'Automação', 'Produtividade'],
    Icon: IconBolt,
    wide: true,
    href: '/integracao-automacao',
  },
  {
    kicker: 'Pilar · Plataforma',
    title: 'Cloud & DevOps',
    description: 'Projetamos e operamos ambientes em nuvem com foco em escalabilidade, segurança e automação, acelerando entregas e garantindo alta disponibilidade.',
    bullets: [
      <><strong>Arquitetura em nuvem</strong> para ambientes resilientes e escaláveis</>,
      <><strong>DevOps e CI/CD</strong> para implantações rápidas e confiáveis</>,
      <><strong>Infraestrutura como Código</strong> para ambientes padronizados e seguros</>,
    ],
    tags: ['AWS', 'DevOps', 'Infraestrutura'],
    Icon: IconCloud,
    wide: true,
    href: '/cloud-devops',
  },
];

const STEPS = [
  { title: 'Diagnóstico & Oportunidades', description: 'Mapeamos sua operação atual para identificar onde a tecnologia vai destravar o seu negócio.' },
  { title: 'Engenharia de Soluções', description: 'Apresentamos as alternativas ideais sob medida, priorizando eficiência e economia.' },
  { title: 'Implementação', description: 'Executamos o projeto de forma ágil, com arquitetura leve (Serverless) e segurança nativa.' },
  { title: 'Homologação & Entrega', description: 'Validamos cada fluxo junto com a sua equipe para garantir o impacto real combinado.' },
  { title: 'Evolução Contínua', description: 'Mantemos seu sistema otimizado, seguro e pronto para novos desafios de crescimento.' },
];

const CASES = [
  {
    metrics: [{ value: '-40%', label: 'custo de infraestrutura' }],
    title: 'Redução de 40% no custo de infraestrutura',
    text: 'A infraestrutura apresentava desperdício de recursos e custos crescentes em um ambiente Kubernetes na AWS. Revisamos a arquitetura, ajustamos o right-sizing de CPU e memória, configuramos autoscaling e adotamos uma estratégia híbrida de instâncias On-Demand e Spot, mantendo a disponibilidade e a performance da aplicação.',
    tags: ['FinOps', 'Kubernetes', 'AWS'],
  },
  {
    metrics: [
      { value: '-60%', label: 'custo operacional' },
      { value: '+40%', label: 'performance', accent: true },
    ],
    title: 'Aumento de 40% na performance da aplicação',
    text: 'A aplicação apresentava baixo desempenho, alto consumo de recursos e uma infraestrutura que limitava sua capacidade de crescimento. Reprojetamos a arquitetura da solução, revisamos a configuração do ambiente e implementamos melhorias de infraestrutura que reduziram o custo operacional em 60% e elevaram significativamente a performance da aplicação.',
    tags: ['Arquitetura', 'Cloud', 'Performance'],
  },
  {
    metrics: [{ value: '-70%', label: 'tempo de ciclo de aprovação' }],
    title: 'Redução de 70% no tempo de aprovação de contratos',
    text: 'O processo dependia de planilhas, troca de e-mails e aprovações manuais, gerando atrasos, retrabalho e pouca rastreabilidade. Desenvolvemos um portal interno com fluxo de aprovação automatizado, trilha de auditoria e notificações em cada etapa, tornando o processo mais ágil, seguro e transparente.',
    tags: ['Portal Interno', 'Automação de Fluxo', 'Auditoria'],
  },
  {
    metrics: [{ value: '-85%', label: 'tempo de fechamento mensal' }],
    title: 'Redução de 85% no tempo de fechamento financeiro',
    text: 'O fechamento mensal exigia consolidação manual de dados, conferências repetitivas e geração de relatórios em diferentes sistemas, consumindo tempo da equipe financeira. Automatizamos a consolidação das informações, os lançamentos e a geração de indicadores, reduzindo significativamente o esforço operacional e permitindo que a equipe se concentrasse em análises estratégicas.',
    tags: ['Automação', 'Relatórios', 'Fechamento Financeiro'],
  },
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

export default async function InstitutionalHome() {
  const recentData = await getRecentPosts(3).catch(() => ({ posts: [] }));
  const recent: HomePost[] = recentData?.posts || [];

  return (
    <>
      <PageHero
        singleColumn
        className="ih-hero"
        dataAudit="ih-hero"
        eyebrow="Consultoria em Tecnologia"
        title={<>Tecnologia que sustenta a operação, aumenta eficiência e <em>destrava crescimento</em>.</>}
        subtitle="Desenvolvimento, IA, Automação, Cloud & DevOps aplicados aos problemas reais da sua empresa."
      >
        <div className="ih-hero-actions">
          <Link href="/contato" className="btn">Solicitar diagnóstico</Link>
        </div>
      </PageHero>

      {/* Serviços */}
      <section className="ih-section" id="servicos">
        <div className="wrap">
          <div className="ih-center-head">
            <div className="ih-eyebrow ih-eyebrow--dual">Serviços</div>
            <h2 className="sec-t">Quatro pilares que cobrem toda a sua operação</h2>
            <p className="ih-center-desc">Atuamos com profundidade em cada um deles, da estratégia ao código, da implementação à operação em produção.</p>
          </div>
          <div className="ih-pillars-grid">
            {PILLARS.map((pillar) => (
              <Link href={pillar.href} className={`ih-pillar-card${pillar.wide ? ' ih-pillar-card--wide' : ''}`} key={pillar.title}>
                <div className="ih-pillar-top">
                  <IconTile icon={<pillar.Icon />} />
                </div>
                <div className="ih-pillar-kicker">{pillar.kicker}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <ul className="ih-pillar-bullets">
                  {pillar.bullets.map((bullet, bi) => (
                    <li key={bi}>{bullet}</li>
                  ))}
                </ul>
                <div className="ih-pillar-footer">
                  <div className="ih-pillar-tags">
                    {pillar.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <span className="ih-pillar-more">Saiba mais <span className="arrow" aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section className="ih-section ih-section--surface" id="abordagem">
        <div className="wrap">
          <div className="ih-method-grid" data-audit="ih-method-grid">
            <div className="ih-method-text">
              <div className="ih-eyebrow">Como trabalhamos</div>
              <h2 className="sec-t">Processo estruturado, entrega previsível</h2>
              <p className="sec-desc" style={{ maxWidth: 720 }}>
                Todo projeto começa pela compreensão do desafio de negócio. Antes de propor qualquer solução, analisamos processos, identificamos oportunidades de melhoria e definimos a abordagem técnica mais adequada para alcançar os resultados esperados.
              </p>
            </div>
            <aside className="ih-method-card" data-audit="ih-method-card">
              <span className="ih-mc-label">Nosso Método</span>
              <h3 className="ih-mc-title">Entrega incremental, sem surpresas.</h3>
              <p className="ih-mc-text">
                Desenvolvemos soluções de forma incremental, com escopo bem definido, comunicação transparente e foco em entregas de valor. Assim, reduzimos riscos, mantemos os custos sob controle e garantimos uma evolução consistente do projeto.
              </p>
            </aside>
          </div>
          <StepsTimeline steps={STEPS} dataAudit="ih-steps" />
          <div className="ih-section-footer-center">
            <Link href="/contato" className="btn">Fale conosco</Link>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="ih-results" id="resultados">
        <div className="wrap">
          <div className="ih-center-head">
            <div className="ih-eyebrow ih-eyebrow--dual ih-eyebrow--onDark">Resultados</div>
            <h2 className="ih-results-t">Resultado que aparece na <em>fatura</em></h2>
            <p className="ih-results-desc">Projetos reais de otimização de nuvem e arquitetura, com redução de custo mensurável e sem abrir mão de performance ou disponibilidade.</p>
          </div>
          <div className="ih-cases">
            {CASES.map((c, i) => {
              const Illustration = RESULT_CASE_ILLUSTRATIONS[i];
              return (
                <div className={`ih-case${i % 2 === 1 ? ' ih-case--reverse' : ''}`} key={c.title}>
                  <div className="ih-case-text">
                    <div className="ih-case-metrics">
                      {c.metrics.map((m) => (
                        <div className="ih-case-metric" key={m.label}>
                          <span className="ih-case-metric-v">{m.value}</span>
                          <span className="ih-case-metric-l">{m.label}</span>
                        </div>
                      ))}
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                    <div className="ih-case-tags">
                      {c.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className={`ih-case-visual${i % 2 === 1 ? ' ih-case-visual--alt' : ''}`}>
                    <Illustration />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ih-section-footer-center">
            <Link href="/contato" className="btn">Conte-nos seu desafio</Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      {recent.length > 0 && (
        <section className="ih-section ih-section--sand" id="insights">
          <div className="wrap">
            <div className="ih-center-head">
              <div className="ih-eyebrow ih-eyebrow--dual">Conteúdo técnico</div>
              <h2 className="sec-t">Engenharia compartilhada por quem a vive no dia a dia</h2>
            </div>
            <div className="ih-blog-grid">
              {recent.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="ih-section-footer-center">
              <Link className="btn btn-petrol" href="/blog">Conheça o blog</Link>
            </div>
          </div>
        </section>
      )}

      <CtaAssessoria
        id="contato"
        eyebrow="Vamos conversar"
        title={<>Vamos construir a solução que vai <em>impulsionar</em> seu negócio.</>}
        description="Cada empresa enfrenta desafios diferentes. Desenvolvemos soluções em software, cloud, integração e inteligência artificial para modernizar operações, aumentar a eficiência e apoiar o crescimento do seu negócio."
        ctaHref="/contato"
        ctaLabel="Vamos conversar"
      />
    </>
  );
}
