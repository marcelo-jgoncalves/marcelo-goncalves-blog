/**frontend/app/page.tsx — Home institucional (specs/SPEC-Home.md — Home v6) */

import './home.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import PageHero from '@/components/ui/PageHero';
import StepsTimeline from '@/components/ui/StepsTimeline';
import { IconCycle, IconBolt, IconChip, IconCloud, IconLayers } from '@/components/ui/InstitutionalIcons';
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
    kicker: 'Pilar · Estratégia',
    title: 'Transformação Digital',
    description: 'Modernizamos a operação de ponta a ponta, substituindo processos lentos por fluxos digitais que reduzem custo e preparam a empresa para crescer.',
    bullets: [
      <><strong>Sistemas e portais sob medida</strong> para centralizar a operação</>,
      <><strong>Fim de planilhas e retrabalho</strong>, com fluxos digitalizados</>,
      <><strong>Integração entre ferramentas</strong> para a informação fluir em tempo real</>,
    ],
    tags: ['Digitalização', 'Agilidade', 'Eficiência'],
    Icon: IconCycle,
  },
  {
    kicker: 'Pilar · Operações',
    title: 'Automação',
    description: 'Colocamos a rotina da empresa no piloto automático, eliminando tarefas manuais e repetitivas que tomam o tempo da equipe.',
    bullets: [
      <><strong>Relatórios, documentos e alertas</strong> gerados automaticamente</>,
      <><strong>Sistemas sincronizados</strong>, sem retrabalho manual</>,
      <><strong>Operação escalável 24/7</strong> sem inflar a equipe</>,
    ],
    tags: ['Piloto Automático', 'Zero Retrabalho', 'Ganho de Tempo'],
    Icon: IconBolt,
  },
  {
    kicker: 'Pilar · Inovação',
    title: 'IA Aplicada',
    description: 'Levamos IA para o dia a dia da operação: decisões mais rápidas, tarefas complexas automatizadas e mais capacidade de entrega para o time.',
    bullets: [
      <><strong>Assistentes e copilotos de IA</strong> para atendimento e suporte</>,
      <><strong>Análise preditiva</strong> que transforma dados em decisões</>,
      <><strong>Processamento inteligente</strong> de documentos e rotinas</>,
    ],
    tags: ['Produtividade', 'Inteligência', 'Decisões Rápidas'],
    Icon: IconChip,
  },
  {
    kicker: 'Pilar · Infraestrutura',
    title: 'Computação na Nuvem & DevOps',
    description: 'Construímos a base técnica para crescer sem limites: nuvem segura, escalável e com entregas previsíveis do commit à produção.',
    bullets: [
      <><strong>Arquitetura e migração AWS</strong> com custo sob controle</>,
      <><strong>Segurança, IAM e hardening</strong> de ambientes</>,
      <><strong>CI/CD e infraestrutura como código</strong> com Terraform</>,
    ],
    tags: ['AWS Cloud', 'DevOps & CI/CD', 'Alta Disponibilidade'],
    Icon: IconCloud,
    wide: true,
  },
  {
    kicker: 'Pilar · Engenharia',
    title: 'Aplicações Modernas & Serverless',
    description: 'Desenvolvemos sistemas sob medida em arquitetura serverless, com agilidade, segurança e custo mínimo de infraestrutura.',
    bullets: [
      <><strong>Sistemas serverless</strong> que escalam automaticamente</>,
      <><strong>Portais, dashboards e CRMs leves</strong> sob medida</>,
      <><strong>APIs e microsserviços</strong> para destravar processos específicos</>,
    ],
    tags: ['Serverless', 'Sistemas Leves', 'Eficiência Financeira'],
    Icon: IconLayers,
    wide: true,
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
    title: 'FinOps & Otimização de Custos em Kubernetes',
    text: 'Implementação de CloudWatch Container Insights, Metrics Server e Vertical Pod Autoscaler em clusters Amazon EKS de produção, com right-sizing de CPU e memória e um modelo híbrido de instâncias On-Demand e Spot, sem impacto em performance ou disponibilidade.',
    tags: ['Amazon EKS', 'FinOps', 'Kubernetes'],
  },
  {
    metrics: [
      { value: '-60%', label: 'custo operacional' },
      { value: '+40%', label: 'performance', accent: true },
    ],
    title: 'Recriação de Arquitetura & Reconfiguração de Ambiente',
    text: 'Reprojeto da arquitetura de uma aplicação e reconfiguração completa do ambiente de execução, reduzindo custo operacional e elevando a performance da aplicação.',
    tags: ['Arquitetura', 'Cloud', 'Performance'],
  },
  {
    metrics: [{ value: '-70%', label: 'tempo de ciclo de aprovação' }],
    title: 'Digitalização do Fluxo de Aprovação de Contratos',
    text: 'Substituição de um processo baseado em planilhas e e-mail por um portal interno com aprovação em etapas, trilha de auditoria e notificações automáticas, eliminando gargalos manuais e o retrabalho entre áreas.',
    tags: ['Portal Interno', 'Automação de Fluxo', 'Auditoria'],
  },
  {
    metrics: [{ value: '-85%', label: 'tempo de fechamento mensal' }],
    title: 'Automação do Fechamento Financeiro Mensal',
    text: 'Automatização da consolidação de relatórios, conciliação de lançamentos e geração de indicadores, eliminando o trabalho manual repetido todo fim de mês.',
    tags: ['Automação', 'Relatórios', 'Fechamento Contábil'],
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
        className="ih-hero"
        dataAudit="ih-hero"
        eyebrow="Consultoria em Tecnologia"
        title={<>Tecnologia que sustenta a operação, aumenta eficiência e destrava <em>crescimento</em>.</>}
        subtitle="Transformação digital, Inteligência Artificial aplicada, automação, computação na nuvem, DevOps e aplicações modernas, aplicados aos problemas reais da sua empresa."
      >
        <div className="ih-hero-actions">
          <Link href="/contato" className="ih-btn ih-btn--clay">Agendar diagnóstico <span aria-hidden="true">→</span></Link>
          <a href="#servicos" className="ih-btn ih-btn--petrol">Conhecer serviços</a>
        </div>
        <div className="ih-hero-trust">
          <span className="ih-hero-dot" aria-hidden="true" />
          Diagnóstico inicial gratuito de 30 min · resposta em até 24h · 100% remoto
        </div>
      </PageHero>

      {/* Serviços */}
      <section className="ih-section" id="servicos">
        <div className="wrap">
          <div className="ih-center-head">
            <div className="ih-eyebrow ih-eyebrow--dual">Serviços</div>
            <h2 className="sec-t">Cinco pilares, engenharia de ponta a ponta</h2>
            <p className="ih-center-desc">Especialização em poucas áreas, com profundidade. Cada pilar reúne as capacidades que entregam resultado, da estratégia à operação otimizada.</p>
          </div>
          <div className="ih-pillars-grid">
            {PILLARS.map((pillar, i) => (
              <Link href="/contato" className={`ih-pillar-card${pillar.wide ? ' ih-pillar-card--wide' : ''}`} key={pillar.title}>
                <div className="ih-pillar-top">
                  <div className="ih-pillar-icon"><pillar.Icon /></div>
                  <span className="ih-pillar-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="ih-pillar-kicker">{pillar.kicker}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <ul className="ih-pillar-bullets">
                  {pillar.bullets.map((bullet, bi) => (
                    <li key={bi}>{bullet}</li>
                  ))}
                </ul>
                <div className="ih-pillar-tags">
                  {pillar.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className="ih-section-footer-center">
            <Link href="/contato" className="ih-btn ih-btn--clay">Fale sobre o seu desafio <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section className="ih-section ih-section--surface" id="abordagem">
        <div className="wrap">
          <div className="ih-method-text">
            <div className="ih-eyebrow">Como trabalhamos</div>
            <h2 className="sec-t">Processo estruturado, entrega previsível</h2>
            <p className="sec-desc" style={{ maxWidth: 720 }}>
              Não somos apenas executores. Unimos a governança de grandes projetos à agilidade que o mercado exige, atuando de forma consultiva para mapear gargalos invisíveis na sua operação e sugerir as melhores alternativas tecnológicas. Com base no histórico comprovado do nosso núcleo sênior, desenhamos soluções com escopo enxuto para garantir retorno rápido, custos sob controle e uma entrega totalmente sem surpresas.
            </p>
          </div>
          <div className="ih-method-label">As 5 Etapas do Nosso Método</div>
          <StepsTimeline steps={STEPS} dataAudit="ih-steps" />
          <div className="ih-section-footer-center">
            <Link href="/contato" className="ih-btn ih-btn--clay">Fale com o time <span aria-hidden="true">→</span></Link>
            <span className="ih-method-credit">Conduzido por Marcelo Gonçalves · Arquiteto de soluções</span>
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
            {CASES.map((c, i) => (
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
                  Ilustração do case (placeholder)
                </div>
              </div>
            ))}
          </div>
          <div className="ih-section-footer-center">
            <Link href="/contato" className="ih-btn ih-btn--clay">Falar com o time <span aria-hidden="true">→</span></Link>
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
              <Link className="ih-btn ih-btn--petrol" href="/blog">Conheça o blog <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      )}

      <CtaAssessoria
        id="contato"
        eyebrow="Vamos conversar"
        title={<>Vamos construir a <em>evolução</em> da sua empresa.</>}
        description="Toda empresa tem oportunidades de melhoria: algumas resolvidas com automação, outras com modernização da infraestrutura, outras com Inteligência Artificial. O primeiro passo é entender o seu cenário."
        ctaHref="/contato"
        ctaLabel="Agendar diagnóstico"
      />
    </>
  );
}
