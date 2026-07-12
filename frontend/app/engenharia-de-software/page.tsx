/* frontend/app/engenharia-de-software/page.tsx
   Landing page de pilar — specs/ESPECIFICACAO-ENGENHARIA-SOFTWARE.md */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import Faq from '@/components/ui/Faq';
import PageHero from '@/components/ui/PageHero';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import FeatureCard from '@/components/ui/FeatureCard';
import Reveal from '@/components/ui/Reveal';
import {
  IconSistemasSobMedida,
  IconApisIntegracoes,
  IconArquiteturaSoftware,
  IconModernizacaoSistemas,
  IconEngenhariaQualidade,
  IconSustentacaoEvolucao,
} from '@/components/ui/InstitutionalIcons';
import styles from './page.module.css';

const TITLE = `Engenharia de Software | ${SITE_NAME}`;
const DESCRIPTION = 'Desenvolvemos aplicações web, APIs e plataformas sob medida com foco em desempenho, escalabilidade e qualidade para impulsionar a inovação do seu negócio.';
const PAGE_URL = `${SITE_URL}/engenharia-de-software`;

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
  name: `Engenharia de Software | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Software Engineering Consulting',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Engenharia de Software',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sistemas Sob Medida', description: 'Desenvolvemos aplicações alinhadas às necessidades específicas do seu negócio, eliminando limitações de soluções genéricas.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'APIs e Integrações', description: 'Projetamos APIs modernas que permitem a comunicação segura e eficiente entre sistemas internos e serviços de terceiros.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Arquitetura de Software', description: 'Projetamos soluções preparadas para crescer, priorizando desempenho, escalabilidade e facilidade de manutenção.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Modernização de Sistemas', description: 'Atualizamos aplicações legadas para arquiteturas modernas, reduzindo riscos e preparando a empresa para novos desafios.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Engenharia de Qualidade', description: 'Incorporamos qualidade ao processo de desenvolvimento para garantir maior confiabilidade e reduzir problemas em produção.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sustentação e Evolução', description: 'Após a entrega, continuamos apoiando a evolução da solução, implementando melhorias e novas funcionalidades conforme o crescimento do negócio.' } },
    ],
  },
};

const OQUE_FAZEMOS = [
  { Icon: IconSistemasSobMedida, title: 'Sistemas Sob Medida', text: 'Desenvolvemos aplicações alinhadas às necessidades específicas do seu negócio, eliminando limitações de soluções genéricas.', tags: ['Sistemas Corporativos', 'Portais Empresariais', 'Aplicações Web'] },
  { Icon: IconApisIntegracoes, title: 'APIs e Integrações', text: 'Projetamos APIs modernas que permitem a comunicação segura e eficiente entre sistemas internos e serviços de terceiros.', tags: ['APIs REST', 'Integrações com ERPs', 'Webhooks'] },
  { Icon: IconArquiteturaSoftware, title: 'Arquitetura de Software', text: 'Projetamos soluções preparadas para crescer, priorizando desempenho, escalabilidade e facilidade de manutenção.', tags: ['Arquitetura em Camadas', 'Orientada a Eventos', 'Serverless'] },
  { Icon: IconModernizacaoSistemas, title: 'Modernização de Sistemas', text: 'Atualizamos aplicações legadas para arquiteturas modernas, reduzindo riscos e preparando a empresa para novos desafios.', tags: ['Refatoração', 'Migração Tecnológica', 'Evolução de Sistemas'] },
  { Icon: IconEngenhariaQualidade, title: 'Engenharia de Qualidade', text: 'Incorporamos qualidade ao processo de desenvolvimento para garantir maior confiabilidade e reduzir problemas em produção.', tags: ['Testes Automatizados', 'Testes E2E', 'Revisão de Código'] },
  { Icon: IconSustentacaoEvolucao, title: 'Sustentação e Evolução', text: 'Após a entrega, continuamos apoiando a evolução da solução, implementando melhorias e novas funcionalidades conforme o crescimento do negócio.', tags: ['Evolução Contínua', 'Novos Módulos', 'Suporte Técnico'] },
];

const BENEFICIOS = [
  'Maior produtividade das equipes',
  'Redução de retrabalho',
  'Processos mais eficientes',
  'Sistemas preparados para crescer',
  'Integração entre plataformas',
  'Maior segurança e confiabilidade',
  'Facilidade de manutenção',
  'Redução de custos operacionais',
];

const ETAPAS = [
  { title: 'Entendimento do problema', text: 'Entendemos os objetivos do negócio e identificamos oportunidades de melhoria.' },
  { title: 'Arquitetura & desenvolvimento incremental', text: 'Projetamos a arquitetura da solução e desenvolvemos de forma incremental, validando cada etapa.' },
  { title: 'Software robusto e evolutivo', text: 'Entregamos um sistema preparado para evoluir e gerar valor desde as primeiras entregas.' },
];

const DIFERENCIAIS = [
  'Arquiteturas modernas e escaláveis',
  'Desenvolvimento orientado por boas práticas de engenharia',
  'Integração nativa com plataformas em nuvem',
  'APIs projetadas para facilitar futuras integrações',
  'Código limpo, documentado e versionado',
  'Foco em desempenho, segurança e manutenibilidade',
];

const PRINCIPIOS = [
  'Arquiteturas escaláveis e resilientes',
  'Código limpo e de fácil manutenção',
  'Desenvolvimento orientado por testes',
  'Segurança desde a concepção da solução',
  'Integração e entrega contínua (CI/CD)',
  'Observabilidade desde o primeiro deploy',
  'Documentação e transferência de conhecimento',
  'Gestão contínua de dívida técnica',
];

const FAQ_ITEMS = [
  { question: 'Vocês desenvolvem apenas sistemas novos?', answer: 'Não. Também evoluímos sistemas existentes, modernizamos aplicações legadas e implementamos novas funcionalidades em plataformas já utilizadas pela empresa.' },
  { question: 'O software pode ser integrado aos sistemas que já utilizamos?', answer: 'Sim. Desenvolvemos integrações com ERPs, CRMs, plataformas financeiras, sistemas internos e serviços de terceiros por meio de APIs e outros mecanismos de integração.' },
  { question: 'Como acompanho o andamento do projeto?', answer: 'Trabalhamos com entregas incrementais, permitindo acompanhar a evolução do desenvolvimento, validar funcionalidades e incorporar ajustes ao longo do projeto.' },
  { question: 'O sistema poderá crescer no futuro?', answer: 'Sim. Todas as soluções são projetadas pensando em escalabilidade, manutenção e evolução contínua, reduzindo custos e facilitando a implementação de novas funcionalidades.' },
];

export default function EngenhariaDeSoftwarePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* HERO — componente padrão do projeto (frontend/components/ui/PageHero.tsx), só conteúdo muda */}
      <PageHero
        className={styles.esHero}
        dataAudit="esw-hero"
        eyebrow="Serviços · Engenharia de Software"
        title={<>Desenvolvemos software que impulsiona o seu <em>negócio</em>.</>}
        subtitle="Cada empresa possui desafios únicos. Por isso, desenvolvemos sistemas, aplicações e plataformas sob medida que automatizam processos, integram informações e apoiam o crescimento do seu negócio."
      >
        <p className={styles.heroParagraph2}>
          Combinamos arquitetura moderna, boas práticas de engenharia e tecnologias consolidadas para entregar soluções seguras, escaláveis e preparadas para evoluir junto com sua empresa.
        </p>
        <div className={styles.heroCtaRow}>
          <Link href="/contato?assunto=engenharia-de-software" className="btn">
            Falar sobre o meu projeto <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.availability}>
          <span className={styles.availabilityDot} aria-hidden="true" />
          Diagnóstico inicial gratuito de 30 min · resposta em até 24h · 100% remoto
        </div>
      </PageHero>

      {/* O QUE FAZEMOS */}
      <section id="oquefazemos" className={styles.oquefazemos} data-audit="esw-oquefazemos">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>O que fazemos</span>
            <h2 className={styles.h2}>Software sob medida, do código à operação</h2>
            <p className={styles.sectionDesc}>Seis frentes que cobrem da concepção à evolução contínua do seu sistema.</p>
          </div>
          <div className={styles.cardGrid}>
            {OQUE_FAZEMOS.map(({ Icon, title, text, tags }, i) => (
              <Reveal as="div" key={title} delay={i * 60}>
                <FeatureCard
                  icon={<Icon />}
                  title={title}
                  text={text}
                  tags={tags}
                  dataAudit={i === 0 ? 'esw-card' : undefined}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className={styles.beneficios} data-audit="esw-beneficios">
        <div className={styles.beneficiosOverlay} aria-hidden="true" />
        <div className={styles.beneficiosWrap}>
          <div>
            <span className={styles.eyebrowDark}>Benefícios</span>
            <h2 className={styles.h2Dark}>Soluções desenvolvidas para a realidade da sua empresa</h2>
          </div>
          <div className={styles.beneficiosList}>
            {BENEFICIOS.map((item) => (
              <div className={styles.beneficioItem} key={item}>
                <span className={styles.checkIcon} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span className={styles.beneficioText}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOSSA ABORDAGEM + DIFERENCIAIS */}
      <section id="abordagem" className={styles.abordagem} data-audit="esw-abordagem">
        <div className={styles.wrap}>
          <div className={styles.abordagemHead}>
            <span className={styles.eyebrowLight}>Nossa abordagem</span>
            <h2 className={styles.h2}>Um bom software começa pela compreensão do problema</h2>
            <p className={styles.sectionDesc}>Antes de escrever qualquer linha de código, entendemos os objetivos do negócio, analisamos os processos existentes e identificamos oportunidades de melhoria. Com base nesse entendimento, projetamos a arquitetura da solução, desenvolvemos de forma incremental e validamos continuamente cada etapa do projeto.</p>
            <p className={styles.sectionDesc}>O resultado é um software robusto, preparado para evoluir e gerar valor desde as primeiras entregas.</p>
          </div>

          <div className={styles.etapasGrid}>
            <div className={styles.etapasLine} aria-hidden="true" />
            {ETAPAS.map((etapa, i) => (
              <div className={styles.etapa} key={etapa.title}>
                <div className={i === 2 ? styles.etapaCirculoClay : styles.etapaCirculo}>{i + 1}</div>
                <h4 className={styles.etapaTitle}>{etapa.title}</h4>
                <p className={styles.etapaText}>{etapa.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.diferenciais} data-audit="esw-diferenciais">
            <div className={styles.diferenciaisHead}>
              <span className={styles.eyebrowLight}>Diferenciais</span>
              <h3 className={styles.h2}>O que nos diferencia</h3>
            </div>
            <div className={styles.diferenciaisGrid}>
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

      {/* PRINCÍPIOS DE ENGENHARIA */}
      <section id="principios" className={styles.principios} data-audit="esw-principios">
        <div className={styles.principiosWrap}>
          <div className={styles.principiosHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Maturidade técnica</span>
            <h2 className={styles.h2}>Princípios de Engenharia</h2>
            <p className={styles.principiosDesc}>O que guia cada decisão técnica, do primeiro commit à operação em produção.</p>
          </div>
          <div className={styles.principiosList}>
            {PRINCIPIOS.map((item, i) => (
              <div className={styles.principioItem} key={item}>
                <span className={styles.principioNumeral}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.principioTitle}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={styles.faq} data-audit="esw-faq">
        <div className={styles.faqWrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Perguntas frequentes</span>
            <h2 className={styles.h2}>Dúvidas antes de começar</h2>
          </div>
          <Faq items={FAQ_ITEMS} dataAudit="esw-faq-accordion" />
        </div>
      </section>

      {/* CTA FINAL — componente padrão do projeto (frontend/components/ui/CtaAssessoria.tsx), só conteúdo muda */}
      <div data-audit="esw-cta-final">
        <CtaAssessoria
          id="contato-final"
          eyebrow="Vamos começar"
          title={<>Vamos conversar sobre o seu <em>software</em>.</>}
          description="Agende uma chamada inicial de 30 minutos. Sem custo, sem compromisso, só clareza sobre como podemos construir o software certo para o seu negócio."
          points={[
            <span key="p1">Diagnóstico objetivo do seu <b>sistema atual</b></span>,
            <span key="p2">Plano de ação claro, <b>sem pressão de venda</b></span>,
            <span key="p3">Resposta em até <b>24h</b>, 100% remoto</span>,
          ]}
          cardTagline="Disponível para novos projetos"
          cardTitle="Diagnóstico inicial gratuito"
          cardSubtitle="Conte o desafio e retornamos com um plano objetivo."
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
          ctaHref="/contato?assunto=engenharia-de-software"
          ctaLabel="Entrar em contato"
          reassure="Sem compromisso · sem custo"
        />
      </div>
    </>
  );
}
