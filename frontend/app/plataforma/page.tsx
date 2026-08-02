import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import FaqSection from '@/components/ui/FaqSection';
import PageHero from '@/components/ui/PageHero';
import AdvisoryCta from '@/components/ui/AdvisoryCta';
import IconTile from '@/components/ui/IconTile';
import BenefitsSection from '@/components/ui/BenefitsSection';
import {
  IconArquiteturaNuvem,
  IconInfraestruturaCodigo,
  IconCICD,
  IconContainersKubernetes,
  IconObservabilidade,
  IconSegurancaCloud,
} from '@/components/ui/InstitutionalIcons';
import styles from './page.module.css';

const TITLE = `Cloud, DevOps e Confiabilidade AWS | ${SITE_NAME}`;
const DESCRIPTION = 'Arquitetura AWS, infraestrutura como código, CI/CD, containers, observabilidade, segurança, recuperação de desastres e otimização de custos.';
const PAGE_URL = `${SITE_URL}/plataforma`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `Cloud, DevOps e Confiabilidade | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Arquitetura e modernização de plataformas AWS',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Cloud & DevOps',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Arquitetura em Nuvem', description: 'Projetamos ambientes modernos, resilientes e escaláveis utilizando serviços gerenciados e arquiteturas orientadas à alta disponibilidade.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'DevOps', description: 'Automatizamos todo o ciclo de entrega de software para reduzir erros, acelerar implantações e aumentar a confiabilidade das aplicações.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Infraestrutura como Código', description: 'Toda a infraestrutura é descrita em código, permitindo padronização, rastreabilidade e implantação consistente em qualquer ambiente.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Containers e Kubernetes', description: 'Construímos plataformas baseadas em containers para facilitar escalabilidade, isolamento de aplicações e maior eficiência operacional.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Observabilidade', description: 'Monitoramos aplicações e infraestrutura para identificar problemas rapidamente e garantir disponibilidade contínua.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Segurança em Cloud', description: 'Aplicamos boas práticas de segurança desde a arquitetura até a operação dos ambientes.' } },
    ],
  },
};

const ATUACAO = [
  { Icon: IconArquiteturaNuvem, title: 'Arquitetura e modernização AWS', text: 'Projetamos novas arquiteturas e evoluímos ambientes existentes considerando requisitos de segurança, disponibilidade, desempenho, custo e capacidade de manutenção.', tags: ['Arquitetura AWS', 'Modernização', 'Well-Architected'] },
  { Icon: IconInfraestruturaCodigo, title: 'Infraestrutura como código', text: 'Transformamos configurações manuais em definições versionadas, revisáveis e reproduzíveis para reduzir divergências entre ambientes e aumentar a segurança das mudanças.', tags: ['Terraform', 'OpenTofu', 'CloudFormation'] },
  { Icon: IconCICD, title: 'Entrega contínua e automação', text: 'Estruturamos pipelines, validações e estratégias de implantação para tornar mudanças mais previsíveis, rastreáveis e fáceis de interromper ou reverter quando necessário.', tags: ['CI/CD', 'Quality gates', 'Deploys'] },
  { Icon: IconContainersKubernetes, title: 'Containers e plataformas de execução', text: 'Avaliamos e implementamos a forma de execução mais adequada para cada workload, incluindo containers, serviços gerenciados e arquiteturas serverless quando elas reduzem complexidade operacional.', tags: ['ECS', 'EKS', 'Serverless'] },
  { Icon: IconObservabilidade, title: 'Observabilidade e confiabilidade', text: 'Organizamos métricas, logs, traces, dashboards e alertas para reduzir o tempo de detecção, facilitar diagnósticos e acompanhar o comportamento real das aplicações.', tags: ['Métricas', 'Logs e traces', 'Alertas'] },
  { Icon: IconSegurancaCloud, title: 'Segurança, continuidade e custos', text: 'Revisamos identidades, permissões, backups, recuperação de desastres e consumo de recursos para reduzir riscos e tornar decisões de continuidade e custo mais explícitas.', tags: ['IAM', 'Recuperação', 'FinOps'] },
];

const BENEFICIOS = [
  'Ambientes reproduzíveis e versionados',
  'Deploys mais seguros e rastreáveis',
  'Detecção mais rápida de falhas',
  'Diagnósticos apoiados por métricas, logs e traces',
  'Permissões e responsabilidades mais claras',
  'Maior visibilidade sobre custos e capacidade',
  'Recuperação planejada para cenários de falha',
  'Menor dependência de procedimentos manuais',
];

// These are 3 principles of the approach, not sequential steps.
const ABORDAGEM_PRINCIPIOS = [
  { label: 'AWS como especialização principal', title: 'Profundidade onde ela gera decisões melhores.', text: 'A principal especialização em nuvem da consultoria é AWS. Integrações com ambientes existentes, serviços externos e componentes híbridos são consideradas quando o cenário exige.' },
  { label: 'Modernização incremental', title: 'Evoluir sem reescrever tudo.', text: 'Sempre que possível, priorizamos mudanças graduais: automatizar um ambiente, melhorar um pipeline, adicionar observabilidade ou modernizar um componente antes de comprometer toda a plataforma.' },
  { label: 'Operação desde o projeto', title: 'Construir considerando quem vai manter.', text: 'Documentação, automação, observabilidade, segurança e transferência de conhecimento fazem parte da solução. O objetivo é evitar uma arquitetura que funcione apenas enquanto quem a criou está presente.' },
];

// Critérios usados para decidir a profundidade da mudança em cada projeto.
const DECISAO_CRITERIOS = [
  'Contexto atual',
  'Risco operacional',
  'Capacidade da equipe',
  'Criticidade da aplicação',
  'Custo e impacto da mudança',
];

const ESTAGIOS = [
  { title: 'Governar', items: ['Arquitetura AWS e Well-Architected Framework', 'AWS Organizations, governança e ambientes multi-conta'] },
  { title: 'Provisionar', items: ['IAM, identidade e princípio do menor privilégio', 'Terraform, OpenTofu e CloudFormation'] },
  { title: 'Executar', items: ['Docker, ECS, EKS e Kubernetes', 'Lambda, API Gateway e arquiteturas serverless'] },
  { title: 'Observar', items: ['GitHub Actions, GitLab CI, Jenkins e CodePipeline', 'CloudWatch, X-Ray, Prometheus, Grafana e Splunk'] },
  { title: 'Recuperar e otimizar', items: ['Alta disponibilidade, backup e recuperação de desastres', 'FinOps, dimensionamento e otimização de custos'] },
];

const CONFIABILIDADE_ITEMS = [
  'Infraestrutura versionada e revisada',
  'Segregação de ambientes e responsabilidades',
  'Acessos temporários e menor privilégio',
  'Validações e bloqueios antes do deploy',
  'Métricas, logs, traces e alertas acionáveis',
  'Estratégias de rollback e recuperação',
  'Backups e restauração testados conforme a criticidade',
  'Documentação e transferência de conhecimento',
];

const FAQ_ITEMS = [
  { question: 'A consultoria trabalha apenas com AWS?', answer: 'AWS é a principal especialização em nuvem da consultoria. Também avaliamos integrações com ambientes existentes, serviços externos e componentes híbridos quando eles fazem parte do contexto da empresa.' },
  { question: 'Precisamos migrar toda a aplicação para a nuvem?', answer: 'Não. A modernização pode começar por um ambiente, pipeline, serviço ou problema específico. A migração completa só deve ser considerada quando houver justificativa técnica, operacional e econômica.' },
  { question: 'Toda aplicação precisa de Kubernetes?', answer: 'Não. Kubernetes é adequado para alguns cenários, mas adiciona responsabilidades operacionais. ECS, serviços gerenciados, máquinas virtuais ou arquiteturas serverless podem ser opções mais simples, dependendo do workload e da equipe.' },
  { question: 'Serverless é sempre a opção de menor custo?', answer: 'Não. O custo depende do volume, do padrão de uso, da duração das execuções, da transferência de dados e de outros serviços envolvidos. Serverless deve ser escolhido quando seus benefícios técnicos e operacionais compensam suas limitações.' },
  { question: 'É possível melhorar a plataforma sem reescrever a aplicação?', answer: 'Sim. Muitas melhorias podem ser realizadas na infraestrutura, nos pipelines, na observabilidade, na segurança ou em componentes específicos, preservando a maior parte da aplicação existente.' },
  { question: 'Vocês conseguem reduzir nossos custos de AWS?', answer: 'Podemos identificar desperdícios, revisar dimensionamento, modelos de compra, armazenamento e padrões de uso. A economia possível depende do ambiente e não pode ser garantida antes da análise.' },
  { question: 'Como a segurança é tratada?', answer: 'Avaliamos identidade, permissões, segregação de ambientes, proteção de dados, exposição de serviços, trilhas de auditoria e controles de implantação. As medidas são definidas conforme o risco e a responsabilidade compartilhada entre AWS, aplicação e operação.' },
  { question: 'Vocês trabalham com a equipe interna da empresa?', answer: 'Sim. Podemos atuar em conjunto com desenvolvedores, infraestrutura, segurança e produto, contribuindo com arquitetura, implementação, revisão técnica e transferência de conhecimento.' },
  { question: 'Como funciona recuperação de desastres?', answer: 'Primeiro definimos quais falhas precisam ser cobertas, quanto tempo de indisponibilidade é aceitável e quanto dado pode ser perdido. A partir disso, projetamos backups, replicação, procedimentos e testes proporcionais à criticidade.' },
  { question: 'Existe acompanhamento depois da entrega?', answer: 'O modelo de sustentação é definido conforme a solução. Pode incluir acompanhamento inicial, observabilidade, correções, evolução, apoio à operação ou transferência estruturada para a equipe do cliente.' },
];

export default function CloudDevOpsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* HERO — componente padrão do projeto (frontend/components/ui/PageHero.tsx), só conteúdo muda */}
      <PageHero
        singleColumn
        className={styles.cdHero}
        dataAudit="cd-hero"
        eyebrow="Cloud, DevOps e Confiabilidade"
        title="Plataformas AWS mais seguras, observáveis e preparadas para evoluir."
        subtitle="Projetamos e modernizamos arquiteturas, ambientes e processos de entrega para reduzir trabalho manual, aumentar a confiabilidade e dar mais visibilidade sobre desempenho, riscos e custos."
      >
        <div className={styles.heroCtaRow}>
          <Link href="/contato?area=cloud-devops-confiabilidade" className="btn">
            Apresentar um desafio de plataforma
          </Link>
        </div>
        <p className={styles.heroMicrocopy}>Conversa inicial sem compromisso · Retorno em até um dia útil</p>
      </PageHero>

      {/* O QUE ESTRUTURAMOS E MODERNIZAMOS */}
      <section id="atuacao" className={styles.whatWeDo} data-audit="cd-atuacao">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>O que fazemos</span>
            <h2 className={styles.h2}>Da arquitetura à operação contínua da plataforma.</h2>
            <p className={styles.sectionDesc}>Atuamos nos pontos em que a base tecnológica limita entregas, aumenta riscos ou exige esforço operacional excessivo. A solução pode envolver modernização incremental, automação de ambientes, melhoria da observabilidade ou revisão da arquitetura existente.</p>
          </div>
          <div className={styles.layers}>
            {ATUACAO.map(({ Icon, title, text, tags }, i) => (
              <article className={styles.layer} key={title} data-audit={i === 0 ? 'cd-card' : undefined}>
                <IconTile icon={<Icon />} />
                <h3 className={styles.layerTitle}>{title}</h3>
                <p className={styles.layerDesc}>{text}</p>
                <div className={styles.layerTags}>
                  {tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <BenefitsSection
        id="beneficios"
        dataAudit="cd-beneficios"
        title="Menos improviso na infraestrutura. Mais previsibilidade para entregar e operar."
        items={BENEFICIOS}
      />

      {/* NOSSA ABORDAGEM */}
      <section id="abordagem" className={styles.approachSection} data-audit="cd-abordagem">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Nossa abordagem</span>
            <h2 className={styles.h2}>A arquitetura deve responder ao contexto, não ao modismo.</h2>
            <p className={styles.sectionDesc}>Antes de propor serviços ou ferramentas, entendemos os workloads, as dependências, os riscos, a frequência de mudanças, a capacidade da equipe e os objetivos de negócio. A arquitetura é escolhida a partir dessas condições.</p>
          </div>
          <div className={styles.approach}>
            <div className={styles.principles} aria-label="Princípios da abordagem">
              {ABORDAGEM_PRINCIPIOS.map((p, i) => (
                <article className={styles.principle} key={p.label}>
                  <span className={styles.principleIndex} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.principleHeading}>
                    <span className={styles.principleKicker}>{p.label}</span>
                    <h3>{p.title}</h3>
                  </div>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
            <aside className={styles.decision} aria-label="Critérios de decisão arquitetural">
              <div className={styles.decisionCopy}>
                <span className={styles.decisionKicker}>Como decidimos</span>
                <h3>A profundidade certa depende do contexto.</h3>
                <p>Não começamos pela ferramenta. Primeiro avaliamos as condições que determinam o nível adequado de mudança.</p>
              </div>
              <ul className={styles.decisionList}>
                {DECISAO_CRITERIOS.map((criterio, i) => (
                  <li key={criterio}><span>{String(i + 1).padStart(2, '0')}</span>{criterio}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* CAPACIDADES TÉCNICAS */}
      <section id="capacidades" className={styles.capabilitiesSection} data-audit="cd-capacidades">
        <div className={styles.capabilitiesWrap}>
          <div className={`${styles.sectionHead} ${styles.capabilitiesHead}`}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Capacidades técnicas</span>
            <h2 className={styles.h2}>Da fundação da conta à operação das aplicações.</h2>
            <p className={styles.sectionDesc}>As capacidades são combinadas conforme o estágio da plataforma e o problema que precisa ser resolvido. Nenhum projeto precisa utilizar todas elas.</p>
          </div>
          <div className={styles.cycle} aria-label="Ciclo de capacidades técnicas">
            {ESTAGIOS.map((e, i) => (
              <article className={styles.stage} key={e.title}>
                <span className={styles.stageIndex} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{e.title}</h3>
                <div className={styles.stageItems}>
                  {e.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SEGURANÇA, CONFIABILIDADE E CONTINUIDADE */}
      <section id="confiabilidade" className={styles.reliability} data-audit="cd-confiabilidade">
        <div className={styles.reliabilityOverlay} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowDark} ${styles.eyebrowDual}`}>Segurança e confiabilidade</span>
            <h2 className={styles.h2Dark}>Falhas, mudanças e recuperação precisam ser tratadas antes de se tornarem incidentes.</h2>
            <p className={styles.sectionDescDark}>A confiabilidade não depende de um único serviço. Ela resulta da combinação entre arquitetura, automação, visibilidade, segurança e procedimentos testados para responder quando algo não funciona como esperado.</p>
          </div>
          <div className={styles.benefitsList}>
            {CONFIABILIDADE_ITEMS.map((item) => (
              <div className={styles.benefitItem} key={item}>
                <span className="check-icon-clay" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span className={styles.benefitText}>{item}</span>
              </div>
            ))}
          </div>
          <p className={styles.reliabilityClosing}>O nível de redundância, disponibilidade e recuperação deve ser proporcional ao impacto da indisponibilidade e ao investimento que a operação consegue sustentar.</p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        id="perguntas"
        items={FAQ_ITEMS}
        dataAudit="cd-faq"
        eyebrow="Perguntas frequentes"
        title="Dúvidas antes de modernizar uma plataforma"
      />

      {/* CTA FINAL — componente padrão do projeto (frontend/components/ui/AdvisoryCta.tsx), só conteúdo muda */}
      <div data-audit="cd-cta-final">
        <AdvisoryCta
          id="contato"
          eyebrow="Vamos começar"
          title="Qual parte da sua plataforma está limitando a operação?"
          description="Conte o que está acontecendo hoje: deploys arriscados, falhas difíceis de diagnosticar, custos crescentes, ambientes manuais ou uma arquitetura que já não acompanha a aplicação."
          points={[
            <span key="p1">Arquitetura que precisa evoluir sem interromper o negócio</span>,
            <span key="p2">Ambientes e deploys que dependem de procedimentos manuais</span>,
            <span key="p3">Aplicações que precisam ganhar visibilidade, segurança ou confiabilidade</span>,
          ]}
          cardLabel="Primeira conversa"
          cardTitle="Vamos entender o ambiente e avaliar o próximo passo."
          cardBody={<p className="cta-adv-body-text">A conversa inicial serve para verificar a aderência e esclarecer os primeiros caminhos. Análises que exigem levantamento, acesso ao ambiente ou recomendações detalhadas podem ser estruturadas como um diagnóstico comercial.</p>}
          ctaHref="/contato?area=cloud-devops-confiabilidade"
          ctaLabel="Apresentar um desafio de plataforma"
          reassure="Sem compromisso · Retorno em até um dia útil"
        />
      </div>
    </>
  );
}
