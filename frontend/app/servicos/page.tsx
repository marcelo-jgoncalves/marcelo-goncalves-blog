import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import PageHero from '@/components/ui/PageHero';
import FeatureCard from '@/components/ui/FeatureCard';
import PillarCard from '@/components/ui/PillarCard';
import FaqSection from '@/components/ui/FaqSection';
import AdvisoryCta from '@/components/ui/AdvisoryCta';
import Reveal from '@/components/ui/Reveal';
import {
  IconAutomacaoProcessos,
  IconIntegracaoSistemas,
  IconModernizacaoSistemas,
  IconArquiteturaNuvem,
  IconPesquisaDocumentos,
  IconArquiteturasEscalaveis,
  IconIaIntegrada,
  IconApisServicos,
  IconSegurancaCloud,
} from '@/components/ui/InstitutionalIcons';
import styles from './page.module.css';

const TITLE = `Serviços | ${SITE_NAME}`;
const DESCRIPTION = 'Automação e integração de processos, inteligência artificial aplicada, sistemas e plataformas digitais, cloud e DevOps — combinados a partir do problema da sua empresa, não da tecnologia.';
const PAGE_URL = `${SITE_URL}/servicos`;

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
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const revalidate = 3600;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `Serviços | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Consultoria em automação, inteligência artificial, sistemas e cloud',
};

// Six situations that lead to contact — not a "negative block", but
// acknowledging the problem before any mention of technology.
const PROBLEMAS = [
  { Icon: IconAutomacaoProcessos, title: 'Processos manuais e repetitivos', text: 'A equipe gasta horas copiando dados, conferindo informações, atualizando planilhas ou executando tarefas que poderiam seguir regras automatizadas.' },
  { Icon: IconIntegracaoSistemas, title: 'Sistemas desconectados', text: 'Informações precisam ser transferidas manualmente entre ERP, CRM, plataformas financeiras, e-mails e ferramentas internas.' },
  { Icon: IconModernizacaoSistemas, title: 'Software que não acompanha a empresa', text: 'O sistema atual se tornou difícil de evoluir, não cobre novos processos ou depende de adaptações improvisadas.' },
  { Icon: IconArquiteturaNuvem, title: 'Infraestrutura complexa ou pouco confiável', text: 'Deploys são arriscados, falhas são difíceis de diagnosticar, custos aumentam e a operação depende de procedimentos manuais.' },
  { Icon: IconPesquisaDocumentos, title: 'Informação difícil de localizar e utilizar', text: 'Documentos, regras e conhecimento estão espalhados, tornando consultas, decisões e atendimento mais lentos.' },
  { Icon: IconArquiteturasEscalaveis, title: 'Crescimento sustentado por improvisações', text: 'A empresa continua funcionando, mas cada novo cliente, processo ou unidade aumenta o esforço e a possibilidade de erro.' },
];

const FRENTES = [
  {
    title: 'Eficiência e automação da operação',
    text: 'Reduzimos tarefas manuais, conectamos sistemas e aplicamos inteligência artificial a processos, documentos e fluxos de trabalho.',
    servicos: [
      { name: 'Automação e Integração de Processos', href: '/automacao' },
      { name: 'Inteligência Artificial Aplicada', href: '/inteligencia-artificial' },
    ],
  },
  {
    title: 'Plataformas e modernização tecnológica',
    text: 'Construímos e modernizamos sistemas, arquiteturas e ambientes em nuvem para aumentar confiabilidade, segurança e capacidade de evolução.',
    servicos: [
      { name: 'Sistemas e Plataformas Digitais', href: '/software' },
      { name: 'Cloud, DevOps e Confiabilidade', href: '/plataforma' },
    ],
  },
];

// Same names/copy as used on the Home (PILLARS).
const SERVICOS = [
  {
    Icon: IconAutomacaoProcessos,
    kicker: 'Eficiência operacional',
    title: 'Automação e Integração de Processos',
    text: 'Conectamos sistemas e automatizamos atividades repetitivas para reduzir erros, retrabalho e tempo operacional.',
    tags: ['Integrações', 'Workflows', 'Automação'],
    href: '/automacao',
  },
  {
    Icon: IconIaIntegrada,
    kicker: 'IA aplicada',
    title: 'Inteligência Artificial Aplicada',
    text: 'Integramos inteligência artificial a processos, documentos e sistemas para ampliar produtividade, acesso à informação e capacidade de decisão.',
    tags: ['Assistentes', 'Documentos', 'Agentes'],
    href: '/inteligencia-artificial',
  },
  {
    Icon: IconApisServicos,
    kicker: 'Engenharia de software',
    title: 'Sistemas e Plataformas Digitais',
    text: 'Construímos e modernizamos sistemas ligados à operação, à integração de informações e à evolução do negócio.',
    tags: ['Sistemas', 'APIs', 'Modernização'],
    href: '/software',
  },
  {
    Icon: IconSegurancaCloud,
    kicker: 'Plataformas em nuvem',
    title: 'Cloud, DevOps e Confiabilidade',
    text: 'Estruturamos plataformas em nuvem seguras, automatizadas, observáveis e preparadas para crescer.',
    tags: ['AWS', 'DevOps', 'Confiabilidade'],
    href: '/plataforma',
  },
];

const SOLUCAO_COMBINADA = [
  'Automação e Integração para conectar o recebimento, a validação e o cadastro',
  'Inteligência Artificial para extrair e classificar as informações',
  'Sistemas e Plataformas para oferecer uma interface de revisão',
  'Cloud e DevOps para hospedar, proteger e monitorar a solução',
];

const ETAPAS = [
  { numero: '01', title: 'Conversa inicial', text: 'Você apresenta o contexto, os principais sintomas e o resultado que espera alcançar.' },
  { numero: '02', title: 'Diagnóstico', text: 'Quando o desafio exige análise aprofundada, mapeamos processos, sistemas, restrições, riscos e oportunidades.' },
  { numero: '03', title: 'Plano de ação', text: 'Definimos prioridades, abordagem, etapas, responsabilidades e uma estimativa inicial de esforço e investimento.' },
  { numero: '04', title: 'Implementação incremental', text: 'A solução evolui em ciclos testáveis, priorizando entregas úteis, controle de risco e aprendizado.' },
  { numero: '05', title: 'Acompanhamento e evolução', text: 'Monitoramos resultados, tratamos ajustes e planejamos novas etapas quando elas geram valor para a operação.' },
];

const INDICADA = [
  'A empresa possui processos recorrentes que precisam ganhar eficiência',
  'Sistemas e ferramentas já não acompanham o crescimento',
  'Existe necessidade de integração ou automação',
  'A organização busca uma solução adaptada ao próprio contexto',
  'Há disposição para envolver os responsáveis pelo processo',
  'O projeto precisa combinar visão de negócio e profundidade técnica',
];

const NAO_INDICADA = [
  'A necessidade é apenas um site institucional simples',
  'O objetivo é suporte técnico cotidiano',
  'A empresa procura exclusivamente alocação de profissionais',
  'Não existe disponibilidade para participar do levantamento',
  'A decisão será baseada apenas no menor preço possível',
];

const DIFERENCIAIS = [
  'Liderança técnica direta',
  'Problema antes da ferramenta',
  'Evolução incremental',
  'Engenharia para manutenção',
  'Estrutura adaptável',
  'Transparência sobre riscos, limites e custos',
];

const FAQ_ITEMS = [
  { question: 'Preciso saber qual serviço contratar?', answer: 'Não. O primeiro passo é compreender o problema, os sistemas envolvidos e o resultado esperado.' },
  { question: 'É possível começar por um projeto pequeno?', answer: 'Sim. Sempre que possível, priorizamos um fluxo, módulo ou problema com impacto relevante e escopo controlado.' },
  { question: 'Vocês substituem os sistemas atuais?', answer: 'Apenas quando isso for necessário. Muitas vezes, o melhor caminho é integrar, complementar ou modernizar gradualmente o que já existe.' },
  { question: 'A consultoria trabalha apenas com AWS?', answer: 'AWS é a principal especialização em cloud. Também consideramos integrações com sistemas existentes, serviços externos e ambientes híbridos.' },
  { question: 'Quem participa do projeto?', answer: 'Marcelo Gonçalves lidera o diagnóstico e as principais decisões técnicas. Especialistas complementares podem ser incorporados quando o escopo exigir.' },
  { question: 'Vocês oferecem manutenção após a entrega?', answer: 'O modelo de sustentação é definido de acordo com a solução e pode incluir acompanhamento, correções, evolução, observabilidade ou transferência para a equipe do cliente.' },
];

export default function ServicosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* HERO */}
      <PageHero
        singleColumn
        className={styles.svcHero}
        dataAudit="svc-hero"
        eyebrow="Serviços de tecnologia e engenharia"
        title="Soluções integradas para tornar sua operação mais eficiente e preparada para crescer."
        subtitle="Automatizamos processos, conectamos sistemas, construímos plataformas e modernizamos ambientes em nuvem a partir dos desafios reais da sua empresa."
      >
        <div className={styles.heroCtaRow}>
          <Link href="/contato" className="btn">Apresentar um desafio</Link>
          <a href="#servicos-especializados" className="btn btn-petrol">Conhecer os serviços</a>
        </div>
        <p className={styles.heroMicrocopy}>Você não precisa saber qual tecnologia contratar. A primeira etapa é entender o problema e avaliar o caminho mais adequado.</p>
      </PageHero>

      {/* PROBLEMAS QUE RESOLVEMOS */}
      <section id="problemas" className={styles.oquefazemos} data-audit="svc-problemas">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Quando a tecnologia deixa de acompanhar a operação</span>
            <h2 className={styles.h2}>Gargalos operacionais raramente começam como grandes problemas.</h2>
            <p className={styles.sectionDesc}>Eles surgem em tarefas repetitivas, informações espalhadas, integrações manuais e sistemas que funcionam, mas exigem cada vez mais esforço para sustentar o crescimento.</p>
          </div>
          <div className={styles.cardGrid}>
            {PROBLEMAS.map(({ Icon, title, text }, i) => (
              <Reveal as="div" key={title} delay={i * 60}>
                <FeatureCard icon={<Icon />} title={title} text={text} dataAudit={i === 0 ? 'svc-problema-card' : undefined} />
              </Reveal>
            ))}
          </div>
          <p className={styles.problemasClosing}>Nosso trabalho começa identificando quais desses gargalos geram maior impacto e quais podem ser resolvidos com uma evolução viável, segura e proporcional à realidade da empresa.</p>
        </div>
      </section>

      {/* DUAS FRENTES DE ATUAÇÃO */}
      <section id="frentes" className={styles.frentes} data-audit="svc-frentes">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Duas frentes complementares</span>
            <h2 className={styles.h2}>Melhoramos a operação e a base tecnológica que a sustenta.</h2>
            <p className={styles.sectionDesc}>Alguns desafios começam nos processos da empresa. Outros estão nos sistemas, nas aplicações ou na infraestrutura. Em muitos projetos, as duas dimensões precisam evoluir juntas.</p>
          </div>
          <div className={`${styles.frentesGrid} ${styles.frontsPanel}`}>
            {FRENTES.map((f, i) => (
              <div className={`${styles.frenteCard} ${styles.front}`} data-front={String(i + 1).padStart(2, '0')} key={f.title}>
                <h3 className={styles.frenteTitle}>{f.title}</h3>
                <p className={styles.frenteText}>{f.text}</p>
                <ul className={styles.frenteList}>
                  {f.servicos.map((s) => (
                    <li key={s.href}><Link href={s.href}>{s.name}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS ESPECIALIZADOS */}
      <section id="servicos-especializados" className={styles.especialidades} data-audit="svc-especializados">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Serviços especializados</span>
            <h2 className={styles.h2}>Quatro competências que trabalham juntas para melhorar sua operação.</h2>
          </div>
          <div className={styles.pillarsGrid}>
            {SERVICOS.map(({ Icon, kicker, title, text, tags, href }) => (
              <PillarCard
                key={title}
                icon={<Icon />}
                kicker={kicker}
                title={title}
                description={text}
                tags={tags}
                href={href}
                wide
              />
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÕES INTEGRADAS */}
      <section id="solucoes-integradas" className={styles.abordagem} data-audit="svc-integradas">
        <div className={styles.wrap}>
          <div className={styles.integratedLayout}>
            <div className={`${styles.sectionHead} ${styles.headLeft} ${styles.integratedHead}`}>
              <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Um problema pode exigir várias competências</span>
              <h2 className={styles.h2}>A solução é desenhada como um conjunto, não como uma soma de tecnologias.</h2>
              <p className={styles.sectionDesc}>Em muitos projetos, automação, software, inteligência artificial e cloud participam da mesma solução. Definimos a combinação necessária a partir do processo, dos riscos e do resultado esperado.</p>
            </div>
            <div className={`${styles.exemploCard} ${styles.integratedExample}`}>
              <span className={styles.subblocoKicker}>Exemplo</span>
              <p className={styles.exemploIntro}>Uma empresa recebe documentos por e-mail, copia informações para planilhas e depois realiza cadastros manuais no ERP. A solução pode combinar:</p>
              <ul className={styles.exemploList}>
                {SOLUCAO_COMBINADA.map((item, i) => (
                  <li key={item} data-index={String(i + 1).padStart(2, '0')}>{item}</li>
                ))}
              </ul>
              <p className={styles.exemploResultado}><strong>Resultado:</strong> menos digitação, redução de erros, maior rastreabilidade e um processo capaz de crescer sem exigir aumento proporcional de trabalho manual.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO O TRABALHO COMEÇA */}
      <section id="como-comeca" className={styles.comoComeca} data-audit="svc-como-comeca">
        <div className={styles.confiabilidadeOverlay} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowDark} ${styles.eyebrowDual}`}>Do problema ao plano de ação</span>
            <h2 className={styles.h2Dark}>Antes de propor tecnologia, entendemos o que precisa mudar.</h2>
          </div>
          <div className={styles.etapasGrid}>
            {ETAPAS.map((etapa) => (
              <div className={styles.etapa} key={etapa.numero}>
                <div className={styles.etapaCirculo}>{etapa.numero}</div>
                <h3 className={styles.etapaTitle}>{etapa.title}</h3>
                <p className={styles.etapaText}>{etapa.text}</p>
              </div>
            ))}
          </div>
          <p className={styles.comoComecaNota}>A conversa inicial é sem compromisso. Diagnósticos que exigem levantamento, análise técnica ou recomendações detalhadas podem ser estruturados como uma entrega comercial própria.</p>
        </div>
      </section>

      {/* PARA QUEM A CONSULTORIA É INDICADA */}
      <section id="para-quem" className={styles.paraQuem} data-audit="svc-para-quem">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Aderência</span>
            <h2 className={styles.h2}>Trabalhamos melhor com empresas que já possuem uma operação real e precisam fazê-la evoluir.</h2>
          </div>
          <div className={styles.paraQuemGrid}>
            <div className={styles.paraQuemCol}>
              <h3 className={styles.paraQuemTitle}>Indicada quando</h3>
              <ul className={styles.paraQuemList}>
                {INDICADA.map((item) => (
                  <li key={item}><span className={styles.checkPos} aria-hidden="true">✓</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.paraQuemCol}>
              <h3 className={styles.paraQuemTitle}>Provavelmente não é a melhor opção quando</h3>
              <ul className={styles.paraQuemList}>
                {NAO_INDICADA.map((item) => (
                  <li key={item}><span className={styles.checkNeg} aria-hidden="true">–</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS DA ENTREGA */}
      <section id="diferenciais" className={styles.diferenciaisSection} data-audit="svc-diferenciais">
        <div className={styles.wrap}>
          <div className={styles.diferenciaisBlock}>
            <div className={`${styles.sectionHead} ${styles.headLeft}`}>
              <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Como conduzimos cada projeto</span>
              <h2 className={styles.h2}>Proximidade na decisão, profundidade na engenharia e clareza na execução.</h2>
            </div>
            <div className={`${styles.diferenciaisGrid} ${styles.diffGrid}`}>
              {DIFERENCIAIS.map((item) => (
                <div className={styles.diferencialItem} key={item}>
                  <span className={styles.diferencialCheck} aria-hidden="true">✓</span>
                  <span className={styles.diferencialText}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        id="perguntas"
        items={FAQ_ITEMS}
        dataAudit="svc-faq"
        eyebrow="Perguntas frequentes"
        title="Dúvidas antes de começar"
      />

      {/* CTA FINAL */}
      <div data-audit="svc-cta-final">
        <AdvisoryCta
          id="contato"
          eyebrow="Comece pelo problema"
          title="Conte o que está limitando sua operação."
          description="Descreva o processo, sistema ou desafio que precisa evoluir. Vamos avaliar a aderência, esclarecer os primeiros caminhos e definir se faz sentido avançar para um diagnóstico."
          points={[
            <span key="p1">Processos manuais que consomem tempo e geram retrabalho</span>,
            <span key="p2">Sistemas desconectados ou difíceis de evoluir</span>,
            <span key="p3">Plataformas que precisam ganhar segurança, confiabilidade ou escala</span>,
          ]}
          cardLabel="Primeira conversa"
          cardTitle="Vamos entender o problema e avaliar o próximo passo."
          cardBody={<p className="cta-adv-body-text">Você não precisa saber qual tecnologia ou serviço contratar. Começamos pelo contexto e identificamos o caminho mais adequado.</p>}
          ctaHref="/contato"
          ctaLabel="Apresentar um desafio"
          reassure="Conversa inicial sem compromisso · Retorno em até um dia útil"
        />
      </div>
    </>
  );
}
