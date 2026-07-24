/* frontend/app/plataforma/page.tsx
   Landing page de pilar — specs/ESPECIFICACAO-CLOUD-DEVOPS.md */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import FaqSection from '@/components/ui/FaqSection';
import PageHero from '@/components/ui/PageHero';
import CtaAssessoria, { CTA_DIAGNOSIS_META } from '@/components/ui/CtaAssessoria';
import FeatureCard from '@/components/ui/FeatureCard';
import Reveal from '@/components/ui/Reveal';
import BeneficiosSection from '@/components/ui/BeneficiosSection';
import IconLabelSection from '@/components/ui/IconLabelSection';
import AbordagemHead from '@/components/ui/AbordagemHead';
import {
  IconArquiteturaNuvem,
  IconDevOps,
  IconInfraestruturaCodigo,
  IconContainersKubernetes,
  IconObservabilidade,
  IconSegurancaCloud,
  IconBolt,
  IconFinOps,
  IconAltaDisponibilidade,
  IconCICD,
} from '@/components/ui/InstitutionalIcons';
import styles from './page.module.css';

const TITLE = `Cloud & DevOps | ${SITE_NAME}`;
const DESCRIPTION = 'Projetamos e operamos ambientes em nuvem com foco em escalabilidade, segurança e automação, acelerando entregas e garantindo alta disponibilidade.';
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
  name: `Cloud & DevOps | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Cloud Computing Consulting',
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

const OQUE_FAZEMOS = [
  { Icon: IconArquiteturaNuvem, title: 'Arquitetura em Nuvem', text: 'Projetamos ambientes modernos, resilientes e escaláveis utilizando serviços gerenciados e arquiteturas orientadas à alta disponibilidade.', tags: ['Arquitetura AWS', 'Multiambiente', 'Alta Disponibilidade'] },
  { Icon: IconDevOps, title: 'DevOps', text: 'Automatizamos todo o ciclo de entrega de software para reduzir erros, acelerar implantações e aumentar a confiabilidade das aplicações.', tags: ['CI/CD', 'Blue/Green', 'GitOps'] },
  { Icon: IconInfraestruturaCodigo, title: 'Infraestrutura como Código', text: 'Toda a infraestrutura é descrita em código, permitindo padronização, rastreabilidade e implantação consistente em qualquer ambiente.', tags: ['Terraform', 'Versionamento', 'Ambientes Reproduzíveis'] },
  { Icon: IconContainersKubernetes, title: 'Containers e Kubernetes', text: 'Construímos plataformas baseadas em containers para facilitar escalabilidade, isolamento de aplicações e maior eficiência operacional.', tags: ['Kubernetes', 'Amazon EKS', 'Docker'] },
  { Icon: IconObservabilidade, title: 'Observabilidade', text: 'Monitoramos aplicações e infraestrutura para identificar problemas rapidamente e garantir disponibilidade contínua.', tags: ['Logs Centralizados', 'Métricas', 'Alertas'] },
  { Icon: IconSegurancaCloud, title: 'Segurança em Cloud', text: 'Aplicamos boas práticas de segurança desde a arquitetura até a operação dos ambientes.', tags: ['IAM', 'Gestão de Segredos', 'Criptografia'] },
];

const BENEFICIOS = [
  'Redução do tempo de implantação',
  'Maior disponibilidade das aplicações',
  'Menor risco operacional',
  'Automação de tarefas repetitivas',
  'Padronização dos ambientes',
  'Redução de custos em nuvem',
  'Maior segurança e governança',
  'Previsibilidade de custos com FinOps',
];

const ESPECIALIDADES = [
  { label: 'Arquitetura AWS', Icon: IconArquiteturaNuvem },
  { label: 'Kubernetes (EKS)', Icon: IconContainersKubernetes },
  { label: 'Serverless', Icon: IconBolt },
  { label: 'DevOps', Icon: IconDevOps },
  { label: 'Infraestrutura como Código', Icon: IconInfraestruturaCodigo },
  { label: 'Observabilidade', Icon: IconObservabilidade },
  { label: 'Otimização de Custos (FinOps)', Icon: IconFinOps },
  { label: 'Alta Disponibilidade', Icon: IconAltaDisponibilidade },
  { label: 'Segurança em Cloud', Icon: IconSegurancaCloud },
  { label: 'CI/CD', Icon: IconCICD },
];

const ETAPAS = [
  { title: 'Diagnóstico do ambiente', text: 'Entendemos os objetivos do negócio e avaliamos a infraestrutura existente.' },
  { title: 'Arquitetura & automação', text: 'Projetamos a arquitetura moderna e implementamos toda a automação necessária.' },
  { title: 'Evolução contínua', text: 'Entregamos uma plataforma pronta para evoluir com segurança e escalabilidade.' },
];

const FAQ_ITEMS = [
  { question: 'Minha empresa precisa estar na AWS?', answer: 'Não. Trabalhamos principalmente com AWS, mas os princípios de arquitetura e automação podem ser aplicados em outros ambientes de nuvem ou infraestrutura híbrida.' },
  { question: 'Vocês assumem ambientes já existentes?', answer: 'Sim. Podemos modernizar ambientes legados, revisar arquiteturas, otimizar custos e implantar novas práticas de DevOps sem a necessidade de reconstruir toda a infraestrutura.' },
  { question: 'É possível reduzir custos em nuvem?', answer: 'Sim. Avaliamos continuamente a utilização dos recursos para eliminar desperdícios, otimizar arquiteturas e adotar estratégias que reduzam o custo operacional sem comprometer desempenho ou disponibilidade.' },
  { question: 'Vocês oferecem suporte após a implantação?', answer: 'Sim. Podemos atuar tanto na implantação quanto na evolução contínua da plataforma, acompanhando o crescimento da infraestrutura e a operação dos ambientes.' },
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
        eyebrow="Pilar · Plataforma"
        title={<>Construímos plataformas em nuvem preparadas para <em>crescer</em>.</>}
        subtitle="Projetamos e operamos ambientes cloud modernos, seguros e escaláveis para acelerar entregas, reduzir a complexidade operacional e apoiar o crescimento do seu negócio."
      >
        <div className={styles.heroCtaRow}>
          <Link href="/contato?assunto=cloud-devops" className="btn">
            Solicitar diagnóstico
          </Link>
        </div>
      </PageHero>

      {/* O QUE FAZEMOS */}
      <section id="oquefazemos" className={styles.oquefazemos} data-audit="cd-oquefazemos">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>O que fazemos</span>
            <h2 className={styles.h2}>Engenharia de nuvem, de ponta a ponta</h2>
            <p className={styles.sectionDesc}>Seis frentes que cobrem da arquitetura ao dia a dia operacional da sua infraestrutura.</p>
          </div>
          <div className={styles.cardGrid}>
            {OQUE_FAZEMOS.map(({ Icon, title, text, tags }, i) => (
              <Reveal as="div" key={title} delay={i * 60}>
                <FeatureCard
                  icon={<Icon />}
                  title={title}
                  text={text}
                  tags={tags}
                  dataAudit={i === 0 ? 'cd-card' : undefined}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <BeneficiosSection
        dataAudit="cd-beneficios"
        title="Infraestrutura preparada para crescer com o negócio"
        items={BENEFICIOS}
        classes={{
          section: styles.beneficios,
          overlay: styles.beneficiosOverlay,
          wrap: styles.beneficiosWrap,
          eyebrow: styles.eyebrowDark,
          heading: styles.h2Dark,
          list: styles.beneficiosList,
          item: styles.beneficioItem,
          checkIcon: styles.checkIcon,
          text: styles.beneficioText,
        }}
      />

      {/* ESPECIALIDADES */}
      <IconLabelSection
        id="especialidades"
        dataAudit="cd-especialidades"
        eyebrow="Especialidades"
        title="Onde fazemos a diferença"
        description="Dez frentes que sustentam cada projeto de nuvem, da arquitetura ao dia a dia operacional."
        items={ESPECIALIDADES}
        classes={{
          section: styles.especialidades,
          wrap: styles.especialidadesWrap,
          head: `${styles.sectionHead} ${styles.especialidadesHead}`,
          eyebrow: `${styles.eyebrowLight} ${styles.eyebrowDual}`,
          heading: styles.h2,
          desc: styles.sectionDesc,
        }}
      />

      {/* NOSSA ABORDAGEM */}
      <section id="abordagem" className={styles.abordagem} data-audit="cd-abordagem">
        <div className={styles.wrap}>
          <AbordagemHead
            dataAudit="cd-abordagem-grid"
            resultDataAudit="cd-result-card"
            title="Cada empresa, um diagnóstico diferente"
            description="Cada empresa possui necessidades diferentes. Por isso, iniciamos cada projeto entendendo os objetivos do negócio e avaliando o ambiente existente. A partir desse diagnóstico, projetamos uma arquitetura moderna, implementamos toda a automação necessária e entregamos uma plataforma preparada para evoluir com segurança, desempenho e escalabilidade."
            resultLabel="Compromisso"
            resultTitle="Simples de operar, pronta para durar."
            resultText="Nosso compromisso é construir soluções simples de operar, resilientes e alinhadas às melhores práticas de engenharia."
            classes={{
              grid: styles.abordagemGrid,
              head: styles.abordagemHead,
              eyebrow: styles.eyebrowLight,
              heading: styles.h2,
              desc: styles.sectionDesc,
              resultCard: styles.resultCard,
              resultLabel: styles.resultCardLabel,
              resultTitle: styles.resultCardTitle,
              resultText: styles.resultCardText,
            }}
          />

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
        </div>
      </section>

      {/* FAQ */}
      <FaqSection items={FAQ_ITEMS} dataAudit="cd-faq" />

      {/* CTA FINAL — componente padrão do projeto (frontend/components/ui/CtaAssessoria.tsx), só conteúdo muda */}
      <div data-audit="cd-cta-final">
        <CtaAssessoria
          id="contato-final"
          eyebrow="Vamos começar"
          title={<>Vamos conversar sobre a sua <em>infraestrutura</em>?</>}
          description="Agende uma chamada inicial de 60 minutos sem custo e sem compromisso para discutirmos como podemos cuidar dos seus ambientes."
          points={[
            <span key="p1">Diagnóstico objetivo da sua <b>infraestrutura</b> atual</span>,
            <span key="p2">Plano de ação claro, <b>sem pressão de venda</b></span>,
            <span key="p3">Resposta <b>rápida</b>, 100% remoto</span>,
          ]}
          cardTagline="Disponível para novos projetos"
          cardTitle="Diagnóstico inicial gratuito"
          cardBody={CTA_DIAGNOSIS_META}
          ctaHref="/contato?assunto=cloud-devops"
          ctaLabel="Entrar em contato"
          reassure="Sem compromisso · sem custo"
        />
      </div>
    </>
  );
}
