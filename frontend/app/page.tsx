import './home.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import AdvisoryCta from '@/components/ui/AdvisoryCta';
import PageHero from '@/components/ui/PageHero';
import StepsList from '@/components/ui/StepsList';
import { IconCloud } from '@/components/ui/InstitutionalIcons';
import PillarCard from '@/components/ui/PillarCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBrain, faRobot } from '@fortawesome/free-solid-svg-icons';
import { RESULT_CASE_ILLUSTRATIONS } from '@/components/ui/ResultCaseIllustrations';
import { SITE_URL, SITE_NAME, ACCEPTING_NEW_PROJECTS } from '@/lib/config';

export const revalidate = 300;

const HOME_TITLE = `Consultoria em Automação, Software e AWS | ${SITE_NAME}`;
const HOME_DESCRIPTION = 'Consultoria boutique para automatizar processos, integrar sistemas, desenvolver plataformas e modernizar ambientes AWS com segurança e confiabilidade.';

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
  },
  twitter: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

const PILLARS = [
  {
    kicker: 'Eficiência operacional',
    title: 'Automação e Integração de Processos',
    description: 'Conectamos sistemas e automatizamos atividades repetitivas para reduzir erros, retrabalho e tempo operacional.',
    bullets: [
      <>Integração entre <strong>ERP, CRM e sistemas internos</strong></>,
      <>Workflows para <strong>aprovações, documentos e tarefas recorrentes</strong></>,
      <>Sincronização de <strong>dados, relatórios e notificações</strong></>,
    ],
    tags: ['Integrações', 'Workflows', 'Automação'],
    icon: <FontAwesomeIcon icon={faRobot} />,
    wide: true,
    href: '/automacao',
  },
  {
    kicker: 'IA aplicada',
    title: 'Inteligência Artificial Aplicada',
    description: 'Integramos inteligência artificial a processos, documentos e sistemas para ampliar produtividade, acesso à informação e capacidade de decisão.',
    bullets: [
      <>Assistentes conectados ao <strong>conhecimento da empresa</strong></>,
      <>Extração, classificação e <strong>pesquisa em documentos</strong></>,
      <>Agentes com <strong>regras, permissões e ações controladas</strong></>,
    ],
    tags: ['Assistentes', 'Documentos', 'Agentes'],
    icon: <FontAwesomeIcon icon={faBrain} />,
    wide: true,
    href: '/inteligencia-artificial',
  },
  {
    kicker: 'Engenharia de software',
    title: 'Sistemas e Plataformas Digitais',
    description: 'Construímos e modernizamos sistemas ligados à operação, à integração de informações e à evolução do negócio.',
    bullets: [
      <>Sistemas internos e <strong>portais operacionais</strong></>,
      <>APIs e backends para <strong>integrar dados e serviços</strong></>,
      <>Modernização gradual de <strong>aplicações existentes</strong></>,
    ],
    tags: ['Sistemas', 'APIs', 'Modernização'],
    icon: <FontAwesomeIcon icon={faGear} />,
    wide: true,
    href: '/software',
  },
  {
    kicker: 'Plataformas em nuvem',
    title: 'Cloud, DevOps e Confiabilidade',
    description: 'Estruturamos plataformas em nuvem seguras, automatizadas, observáveis e preparadas para crescer com previsibilidade de custos.',
    bullets: [
      <>Arquitetura AWS, modernização e <strong>infraestrutura como código</strong></>,
      <>CI/CD, containers e <strong>automação de ambientes</strong></>,
      <>Observabilidade, segurança e <strong>recuperação de desastres</strong></>,
    ],
    tags: ['AWS', 'DevOps', 'Confiabilidade'],
    icon: <IconCloud />,
    wide: true,
    href: '/plataforma',
  },
];

const STEPS = [
  { title: 'Entendimento do desafio', description: 'Na conversa inicial, você apresenta o contexto, os principais sintomas e o resultado que espera alcançar. Avaliamos a aderência e definimos o próximo passo.' },
  { title: 'Diagnóstico e plano de ação', description: 'Quando o desafio exige análise aprofundada, mapeamos processos, sistemas, restrições, riscos e oportunidades para definir prioridades e uma abordagem viável.' },
  { title: 'Implementação incremental', description: 'Construímos a solução em ciclos testáveis, priorizando entregas úteis, segurança, manutenibilidade e controle de custos.' },
  { title: 'Validação e entrada em operação', description: 'Validamos os fluxos com as pessoas envolvidas, tratamos ajustes e preparamos a entrada em produção com critérios claros de aceite.' },
  { title: 'Acompanhamento e evolução', description: 'Acompanhamos o comportamento da solução, corrigimos desvios e planejamos novas etapas quando elas geram valor real para a operação.' },
];

// Hardcoded cases — validate against real records/measurements before
// publishing to production. Until validated, don't describe these as
// "real projects" anywhere in this section's copy.
const CASES = [
  {
    metrics: [{ value: '-70%', label: 'tempo do ciclo de aprovação' }],
    title: 'Redução de 70% no ciclo de aprovação de contratos',
    text: 'O processo dependia de planilhas, trocas de e-mail e aprovações manuais, gerando atrasos, retrabalho e pouca rastreabilidade. Desenvolvemos um portal interno com fluxo automatizado, trilha de auditoria e notificações em cada etapa, tornando o processo mais rápido, seguro e transparente.',
    tags: ['Portal interno', 'Automação de fluxo', 'Auditoria'],
  },
  {
    metrics: [{ value: '-85%', label: 'tempo de fechamento mensal' }],
    title: 'Redução de 85% no tempo de fechamento financeiro',
    text: 'O fechamento mensal exigia consolidação manual de dados, conferências repetitivas e relatórios produzidos em diferentes sistemas. Automatizamos a consolidação das informações, os lançamentos e a geração de indicadores, reduzindo o esforço operacional e liberando a equipe para análises de maior valor.',
    tags: ['Automação', 'Relatórios', 'Operação financeira'],
  },
  {
    metrics: [{ value: '-40%', label: 'custo de infraestrutura' }],
    title: 'Redução de 40% no custo de infraestrutura',
    text: 'O ambiente Kubernetes na AWS apresentava desperdício de recursos e custos crescentes. Revisamos a arquitetura, ajustamos o dimensionamento de CPU e memória, configuramos autoscaling e adotamos uma combinação adequada de instâncias On-Demand e Spot, preservando disponibilidade e desempenho.',
    tags: ['FinOps', 'Kubernetes', 'AWS'],
  },
  {
    metrics: [
      { value: '+40%', label: 'performance', accent: true },
      { value: '-60%', label: 'custo operacional' },
    ],
    title: 'Mais performance com menor custo operacional',
    text: 'A aplicação apresentava baixo desempenho, alto consumo de recursos e uma infraestrutura que limitava sua evolução. Reprojetamos a arquitetura da solução e revisamos a configuração do ambiente, elevando a performance em 40% e reduzindo o custo operacional em 60%.',
    tags: ['Arquitetura', 'Cloud', 'Performance'],
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
  // Fetches more than 3 because test-post filtering happens here, before
  // rendering — never only via CSS. The backend already restricts the
  // query to status="Publicado" (getPosts/index.ts), so drafts never
  // reach this point.
  const recentData = await getRecentPosts(9).catch(() => ({ posts: [] }));
  const recent: HomePost[] = (recentData?.posts || [])
    .filter((post: HomePost) =>
      post.titulo &&
      post.slug &&
      post.data_publicacao &&
      post.resumo &&
      !post.titulo.toLowerCase().startsWith('[teste]'),
    )
    .slice(0, 3);

  return (
    <>
      <PageHero
        singleColumn
        className="ih-hero"
        dataAudit="ih-hero"
        eyebrow="Consultoria boutique de tecnologia"
        title="Engenharia para uma operação mais eficiente, integrada e preparada para crescer."
        subtitle="Ajudamos pequenas e médias empresas em crescimento a eliminar gargalos, automatizar processos, conectar sistemas e modernizar as plataformas que sustentam o negócio."
      >
        <div className="ih-hero-actions">
          <Link href="/contato" className="btn">Apresentar um desafio</Link>
          <a href="#servicos" className="btn btn-petrol">Conhecer os serviços</a>
        </div>
        <p className="ih-hero-microcopy">Conversa inicial sem compromisso · Retorno em até um dia útil</p>
      </PageHero>

      {/* Serviços */}
      <section className="ih-section" id="servicos">
        <div className="wrap">
          <div className="ih-center-head">
            <div className="ih-eyebrow ih-eyebrow--dual">Serviços</div>
            <h2 className="sec-t">Quatro competências que trabalham juntas para melhorar sua operação.</h2>
            <p className="sec-desc ih-center-desc">Partimos do problema, não da ferramenta. Combinamos automação, inteligência artificial, software e cloud conforme o contexto, sem exigir que você escolha previamente uma tecnologia.</p>
          </div>
          <div className="ih-pillars-grid">
            {PILLARS.map((pillar) => (
              <PillarCard
                key={pillar.title}
                icon={pillar.icon}
                kicker={pillar.kicker}
                title={pillar.title}
                description={pillar.description}
                bullets={pillar.bullets}
                tags={pillar.tags}
                href={pillar.href}
                wide={pillar.wide}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section className="ih-section ih-section--surface" id="como-trabalhamos">
        <div className="wrap">
          <div className="ih-method-grid" data-audit="ih-method-grid">
            <div className="ih-method-text">
              <div className="ih-eyebrow">Como trabalhamos</div>
              <h2 className="sec-t">Um processo claro para reduzir incerteza e construir o que realmente precisa evoluir.</h2>
              <p className="sec-desc" style={{ maxWidth: 720 }}>
                Cada projeto começa pela compreensão do contexto, dos processos e dos resultados esperados. A tecnologia é definida somente depois que o problema, as restrições e as prioridades estão claros.
              </p>
            </div>
            <aside className="ih-method-card" data-audit="ih-method-card">
              <span className="ih-mc-label">Nosso método</span>
              <h3 className="ih-mc-title">Entregas incrementais, decisões transparentes.</h3>
              <p className="ih-mc-text">
                Estruturamos o trabalho em etapas úteis e testáveis, com escopo visível, comunicação direta e validação contínua. Isso reduz riscos, evita compromissos prematuros e permite que a solução evolua com base no que aprendemos durante o projeto.
              </p>
            </aside>
          </div>
          <StepsList steps={STEPS} dataAudit="ih-steps" />
          <div className="ih-section-footer-center">
            <Link href="/contato" className="btn">Apresentar um desafio</Link>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="ih-results" id="resultados">
        <div className="wrap">
          <div className="ih-center-head">
            <div className="ih-eyebrow ih-eyebrow--dual ih-eyebrow--onDark">Resultados</div>
            <h2 className="sec-t sec-t--onDark ih-results-t">Impacto mensurável em processos e plataformas.</h2>
            <p className="sec-desc sec-desc--onDark ih-results-desc">Exemplos de melhorias alcançadas por meio de automação, software, arquitetura e otimização de ambientes em nuvem.</p>
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
          <p className="ih-results-note">Os resultados variam conforme o contexto, o escopo e as condições de cada projeto.</p>
          <div className="ih-section-footer-center">
            <Link href="/contato" className="btn">Apresentar um desafio</Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="ih-section ih-section--sand" id="conteudo">
        <div className="wrap">
          <div className="ih-center-head">
            <div className="ih-eyebrow ih-eyebrow--dual">Conteúdo técnico</div>
            <h2 className="sec-t">Engenharia aplicada, decisões explicadas e aprendizados de produção.</h2>
            <p className="sec-desc ih-center-desc">Artigos sobre cloud, automação, inteligência artificial e desenvolvimento, com contexto, escolhas técnicas, erros e resultados observados na prática.</p>
          </div>
          {recent.length > 0 && (
            <div className="ih-blog-grid">
              {recent.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
          <div className="ih-section-footer-center">
            <Link className="btn btn-petrol" href="/artigos">Explorar o blog</Link>
          </div>
        </div>
      </section>

      <AdvisoryCta
        id="vamos-conversar"
        eyebrow="Vamos conversar"
        title="Conte o que está limitando sua operação."
        description="Descreva o processo, sistema ou desafio que precisa evoluir. Vamos avaliar a aderência, esclarecer os primeiros caminhos e definir se faz sentido avançar para um diagnóstico."
        points={[
          <span key="p1">Processos manuais que consomem tempo e geram retrabalho</span>,
          <span key="p2">Sistemas desconectados ou difíceis de evoluir</span>,
          <span key="p3">Plataformas que precisam ganhar segurança, confiabilidade ou escala</span>,
        ]}
        cardTagline={ACCEPTING_NEW_PROJECTS ? 'Disponível para novos projetos' : null}
        cardLabel="Primeira conversa"
        cardTitle="Vamos entender o problema e avaliar o próximo passo."
        cardBody={<p className="cta-adv-body-text">Você não precisa saber qual tecnologia ou serviço contratar. Começamos pelo contexto e identificamos o caminho mais adequado.</p>}
        ctaHref="/contato"
        ctaLabel="Apresentar um desafio"
        reassure="Sem compromisso · Retorno em até um dia útil"
      />
    </>
  );
}
