/* frontend/app/inteligencia-artificial/page.tsx
   Landing page de pilar — specs/ESPECIFICACAO-INTELIGENCIA-ARTIFICIAL.md
   Estabelece o NOVO FLUXO CANÔNICO de seções (§17): Hero → O que fazemos → Casos de
   Aplicação (nova) → Benefícios → Como trabalhamos → FAQ → CTA. Sem Especialidades,
   sem Diferenciais, sem grid de 3 etapas — esse fluxo será retroaplicado às outras 3
   landings (Cloud & DevOps, Engenharia de Software, Integração & Automação) depois. */

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
  IconAssistenteInteligente,
  IconAgenteIA,
  IconIaIntegrada,
  IconEngenhariaQualidade,
  IconBolt,
} from '@/components/ui/InstitutionalIcons';
import styles from './page.module.css';

const TITLE = `Inteligência Artificial | ${SITE_NAME}`;
const DESCRIPTION = 'Aplicamos inteligência artificial para automatizar atividades, acelerar decisões e aumentar a produtividade da equipe com soluções práticas e integradas ao dia a dia.';
const PAGE_URL = `${SITE_URL}/inteligencia-artificial`;

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
  name: `Inteligência Artificial | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Artificial Intelligence Consulting',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Inteligência Artificial',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Assistentes Inteligentes', description: 'Criamos assistentes capazes de apoiar colaboradores e clientes na execução de tarefas, consulta de informações e tomada de decisões.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Agentes de IA', description: 'Desenvolvemos agentes inteligentes capazes de executar tarefas, interagir com diferentes sistemas e automatizar processos complexos com mínima intervenção humana.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IA Integrada aos Sistemas', description: 'Incorporamos inteligência artificial às aplicações existentes para ampliar funcionalidades sem substituir os sistemas já utilizados pela empresa.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Processamento Inteligente de Documentos', description: 'Automatizamos a leitura, interpretação e organização de documentos, reduzindo atividades manuais e aumentando a velocidade dos processos.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automação Inteligente', description: 'Combinamos inteligência artificial e automação para criar fluxos capazes de analisar informações, tomar decisões e executar ações de forma autônoma.' } },
    ],
  },
};

// Agentes de IA e Automação Inteligente são os 2 cards principais (size="lg", em
// destaque no topo do grid) — os outros 3 ficam abaixo, menores, somando a mesma
// largura dos 2 grandes (ver .cardGrid em page.module.css). Decisão de produto
// (2026-07-11), mesmo padrão já aplicado em integracao-automacao/page.tsx.
const OQUE_FAZEMOS = [
  {
    Icon: IconAgenteIA,
    title: 'Agentes de IA',
    text: 'Desenvolvemos agentes inteligentes capazes de executar tarefas, interagir com diferentes sistemas e automatizar processos complexos com mínima intervenção humana.',
    tags: ['Execução de Fluxos', 'Análise de Informações', 'Apoio Operacional'],
    size: 'lg' as const,
  },
  {
    Icon: IconBolt,
    title: 'Automação Inteligente',
    text: 'Combinamos inteligência artificial e automação para criar fluxos capazes de analisar informações, tomar decisões e executar ações de forma autônoma.',
    tags: ['Análise de Dados', 'Decisão Autônoma', 'Execução de Ações'],
    size: 'lg' as const,
  },
  {
    Icon: IconAssistenteInteligente,
    title: 'Assistentes Inteligentes',
    text: 'Criamos assistentes capazes de apoiar colaboradores e clientes na execução de tarefas, consulta de informações e tomada de decisões.',
    tags: ['Atendimento Interno', 'Suporte ao Cliente', 'Autoatendimento'],
  },
  {
    Icon: IconIaIntegrada,
    title: 'IA Integrada aos Sistemas',
    text: 'Incorporamos inteligência artificial às aplicações existentes para ampliar funcionalidades sem substituir os sistemas já utilizados pela empresa.',
    tags: ['Classificação Automática', 'Extração de Informações', 'Recomendações Inteligentes'],
  },
  {
    Icon: IconEngenhariaQualidade,
    title: 'Processamento Inteligente de Documentos',
    text: 'Automatizamos a leitura, interpretação e organização de documentos, reduzindo atividades manuais e aumentando a velocidade dos processos.',
    tags: ['Contratos', 'Notas Fiscais', 'Formulários'],
  },
];

const CASOS_DE_APLICACAO = [
  { title: 'Assistente corporativo', text: 'Disponibilização de um assistente inteligente para consulta de políticas internas, procedimentos e documentação da empresa.' },
  { title: 'Atendimento inteligente', text: 'Chatbots e agentes capazes de responder clientes, registrar solicitações e direcionar demandas automaticamente.' },
  { title: 'Pesquisa inteligente em documentos', text: 'Localização rápida de informações em contratos, manuais, regulamentos e bases de conhecimento.' },
  { title: 'Processamento inteligente de documentos', text: 'Extração automática de informações relevantes de notas fiscais, contratos, formulários e relatórios.' },
  { title: 'Geração de conteúdo', text: 'Produção de respostas, relatórios, resumos e comunicações corporativas com apoio de IA.' },
  { title: 'Agentes de IA para processos', text: 'Desenvolvimento de agentes capazes de analisar informações, interagir com sistemas e executar tarefas de forma autônoma.' },
];

const BENEFICIOS = [
  'Aumento da produtividade das equipes',
  'Redução de atividades repetitivas',
  'Respostas mais rápidas',
  'Melhor uso do conhecimento da empresa',
  'Apoio à tomada de decisões',
  'Redução de custos operacionais',
  'Atendimento mais eficiente',
  'Soluções preparadas para evoluir',
];

const FAQ_ITEMS = [
  { question: 'Minha empresa precisa desenvolver um sistema novo para usar IA?', answer: 'Não. Em muitos casos, a inteligência artificial pode ser integrada aos sistemas já existentes, agregando novas capacidades sem a necessidade de substituir a infraestrutura atual.' },
  { question: 'É possível utilizar informações internas da empresa com segurança?', answer: 'Sim. Projetamos soluções que respeitam os requisitos de segurança e governança, permitindo que a IA utilize documentos, bases de conhecimento e sistemas internos de forma controlada.' },
  { question: 'A IA substitui o trabalho das equipes?', answer: 'Não. O objetivo é automatizar tarefas repetitivas e apoiar decisões, permitindo que as pessoas concentrem seus esforços em atividades estratégicas e de maior valor.' },
  { question: 'Quais empresas podem se beneficiar da IA?', answer: 'Organizações de diferentes portes e segmentos podem aplicar inteligência artificial para otimizar atendimento, operações, análise de documentos, gestão do conhecimento, suporte interno e diversos outros processos.' },
];

export default function InteligenciaArtificialPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* HERO — componente padrão do projeto (frontend/components/ui/PageHero.tsx), só conteúdo muda */}
      <PageHero
        className={styles.aiHero}
        dataAudit="ai-hero"
        eyebrow="Especialidades · Inteligência Artificial"
        title={<>Transformamos inteligência artificial em resultados para o seu <em>negócio</em>.</>}
        subtitle="A inteligência artificial está mudando a forma como as empresas trabalham. Mais do que automatizar tarefas, ela permite acelerar decisões, ampliar a capacidade das equipes e criar experiências mais inteligentes para clientes e colaboradores."
      >
        <p className={styles.heroParagraph2}>
          Desenvolvemos soluções de IA integradas aos processos da sua empresa, sempre com foco em gerar valor real, reduzir custos operacionais e aumentar a produtividade.
        </p>
        <div className={styles.heroCtaRow}>
          <Link href="/contato?assunto=inteligencia-artificial" className="btn">
            Solicitar diagnóstico <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.availability}>
          <span className={styles.availabilityDot} aria-hidden="true" />
          Diagnóstico inicial gratuito de 30 min · resposta em até 24h · 100% remoto
        </div>
      </PageHero>

      {/* O QUE FAZEMOS */}
      <section id="oquefazemos" className={styles.oquefazemos} data-audit="ai-oquefazemos">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>O que fazemos</span>
            <h2 className={styles.h2}>IA aplicada a processos reais da sua empresa</h2>
            <p className={styles.sectionDesc}>Cinco frentes que levam inteligência artificial do conceito à operação do dia a dia.</p>
          </div>
          <div className={styles.cardGrid}>
            {OQUE_FAZEMOS.map(({ Icon, title, text, tags, size }, i) => (
              <Reveal
                as="div"
                key={title}
                delay={i * 60}
                className={`${styles.cardGridItem} ${size === 'lg' ? styles.cardGridItemLg : ''}`}
              >
                <FeatureCard
                  icon={<Icon />}
                  title={title}
                  text={text}
                  tags={tags}
                  size={size}
                  dataAudit={title === 'Assistentes Inteligentes' ? 'ai-card' : undefined}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS DE APLICAÇÃO — nova seção, grade mosaico com hairlines (sem cards) */}
      <section id="casos" className={styles.casos} data-audit="ai-casos">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Casos de Aplicação</span>
            <h2 className={styles.h2}>IA em ação no dia a dia da empresa</h2>
            <p className={styles.sectionDesc}>Seis maneiras concretas de aplicar inteligência artificial na operação.</p>
          </div>
          <div className={styles.casosGrid}>
            {CASOS_DE_APLICACAO.map((caso, i) => (
              <Reveal
                as="div"
                key={caso.title}
                delay={i * 60}
                className={styles.casoItem}
                dataAudit={i === 0 ? 'ai-caso-item' : undefined}
              >
                <span className={styles.casoNumeral}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.casoTitle}>{caso.title}</h3>
                <p className={styles.casoText}>{caso.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className={styles.beneficios} data-audit="ai-beneficios">
        <div className={styles.beneficiosOverlay} aria-hidden="true" />
        <div className={styles.beneficiosWrap}>
          <div>
            <span className={styles.eyebrowDark}>Benefícios</span>
            <h2 className={styles.h2Dark}>IA que gera valor mensurável para a operação</h2>
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

      {/* COMO TRABALHAMOS — só texto, sem grid de etapas, sem bloco Diferenciais */}
      <section id="abordagem" className={styles.abordagem} data-audit="ai-abordagem">
        <div className={styles.wrap}>
          <div className={styles.abordagemHead}>
            <span className={styles.eyebrowLight}>Como trabalhamos</span>
            <h2 className={styles.h2}>Cada projeto começa com uma pergunta simples: onde a IA pode gerar mais valor para o negócio?</h2>
            <p className={styles.sectionDesc}>Antes de implementar qualquer solução, analisamos os processos existentes, identificamos oportunidades de ganho e definimos como a IA pode atuar de forma segura, eficiente e integrada aos sistemas da empresa.</p>
            <p className={styles.sectionDesc}>Nosso objetivo não é substituir pessoas, mas ampliar sua capacidade, automatizar tarefas repetitivas e disponibilizar informações relevantes no momento certo.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={styles.faq} data-audit="ai-faq">
        <div className={styles.faqWrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Perguntas frequentes</span>
            <h2 className={styles.h2}>Dúvidas antes de começar</h2>
          </div>
          <Faq items={FAQ_ITEMS} dataAudit="ai-faq-accordion" />
        </div>
      </section>

      {/* CTA FINAL — componente padrão do projeto (frontend/components/ui/CtaAssessoria.tsx), só conteúdo muda */}
      <div data-audit="ai-cta-final">
        <CtaAssessoria
          id="contato-final"
          eyebrow="Vamos começar"
          title={<>Vamos conversar sobre como aplicar IA no seu <em>negócio</em>.</>}
          description="Agende uma chamada inicial de 30 minutos. Sem custo, sem compromisso, só clareza sobre como a inteligência artificial pode gerar valor real para sua empresa."
          points={[
            <span key="p1">Diagnóstico objetivo de onde a <b>IA gera mais valor</b></span>,
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
          ctaHref="/contato?assunto=inteligencia-artificial"
          ctaLabel="Entrar em contato"
          reassure="Sem compromisso · sem custo"
        />
      </div>
    </>
  );
}
