/* frontend/app/integracao-automacao/page.tsx
   Landing page de pilar — specs/ESPECIFICACAO-INTEGRACAO-AUTOMACAO.md */

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
  IconIntegracaoSistemas,
  IconAutomacaoProcessos,
  IconOrquestracaoProcessos,
  IconApisServicos,
  IconArquiteturasEscalaveis,
} from '@/components/ui/InstitutionalIcons';
import styles from './page.module.css';

const TITLE = `Integração & Automação | ${SITE_NAME}`;
const DESCRIPTION = 'Conectamos sistemas e automatizamos processos para eliminar retrabalho, acelerar operações e garantir que as informações fluam de forma confiável entre toda a empresa.';
const PAGE_URL = `${SITE_URL}/integracao-automacao`;

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
  name: `Integração & Automação | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Systems Integration Consulting',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Integração & Automação',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Integração entre Sistemas', description: 'Conectamos aplicações corporativas para que informações sejam compartilhadas automaticamente entre diferentes plataformas, eliminando atividades manuais e reduzindo erros.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automação de Processos', description: 'Transformamos atividades repetitivas em fluxos automatizados que executam tarefas de forma consistente e rastreável.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Orquestração de Processos', description: 'Criamos fluxos capazes de coordenar diferentes sistemas e serviços para executar processos completos de forma automática.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'APIs e Serviços', description: 'Desenvolvemos APIs que permitem integrar aplicações atuais e futuras sem criar dependências desnecessárias.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Arquiteturas Escaláveis', description: 'Projetamos integrações preparadas para acompanhar o crescimento da empresa, mantendo desempenho, confiabilidade e facilidade de manutenção.' } },
    ],
  },
};

// Automação e Orquestração são os 2 cards principais (size="lg", em destaque no topo
// do grid) — os outros 3 ficam abaixo, menores, somando a mesma largura dos 2 grandes
// (ver .cardGrid em page.module.css). Decisão de produto (2026-07-11), diferente da
// ordem/estrutura original da spec (que tratava os 5 cards como uniformes).
const OQUE_FAZEMOS = [
  {
    Icon: IconAutomacaoProcessos,
    title: 'Automação de Processos',
    text: 'Transformamos atividades repetitivas em fluxos automatizados que executam tarefas de forma consistente e rastreável. O resultado é mais tempo para a equipe focar em atividades estratégicas, com menos erros e retrabalho.',
    tags: ['Aprovações', 'Processamento de Documentos', 'Geração de Relatórios'],
    size: 'lg' as const,
  },
  {
    Icon: IconOrquestracaoProcessos,
    title: 'Orquestração de Processos',
    text: 'Criamos fluxos capazes de coordenar diferentes sistemas e serviços para executar processos completos de forma automática. Isso reduz o tempo de execução de processos complexos e elimina a necessidade de intervenção manual entre etapas.',
    tags: ['Workflows', 'Múltiplos Sistemas', 'Execução Automática'],
    size: 'lg' as const,
  },
  {
    Icon: IconIntegracaoSistemas,
    title: 'Integração entre Sistemas',
    text: 'Conectamos aplicações corporativas para que informações sejam compartilhadas automaticamente entre diferentes plataformas, eliminando atividades manuais e reduzindo erros.',
    tags: ['ERP e CRM', 'Sistemas Internos', 'Plataformas de Pagamento'],
  },
  {
    Icon: IconApisServicos,
    title: 'APIs e Serviços',
    text: 'Desenvolvemos APIs que permitem integrar aplicações atuais e futuras sem criar dependências desnecessárias. Assim, novos sistemas podem ser incorporados com muito mais facilidade.',
    tags: ['APIs REST', 'Baixo Acoplamento', 'Documentação Técnica'],
  },
  {
    Icon: IconArquiteturasEscalaveis,
    title: 'Arquiteturas Escaláveis',
    text: 'Projetamos integrações preparadas para acompanhar o crescimento da empresa, mantendo desempenho, confiabilidade e facilidade de manutenção.',
    tags: ['Alta Disponibilidade', 'Performance', 'Facilidade de Manutenção'],
  },
];

const BENEFICIOS = [
  'Eliminação de tarefas manuais',
  'Redução de erros operacionais',
  'Processos mais rápidos',
  'Informações consistentes entre sistemas',
  'Maior produtividade das equipes',
  'Melhor experiência para clientes',
  'Facilidade para incorporar novos sistemas',
  'Operação preparada para crescer',
];

const ESPECIALIDADES = [
  'Integração de sistemas corporativos',
  'Desenvolvimento de APIs',
  'Automação de processos',
  'Workflows empresariais',
  'Arquiteturas orientadas a eventos',
  'Processamento assíncrono',
  'Integração com serviços em nuvem',
  'Monitoramento de integrações',
];

const DIFERENCIAIS = [
  'Soluções desenvolvidas sob medida',
  'Arquiteturas modernas e escaláveis',
  'Processos orientados à confiabilidade',
  'Fácil evolução e manutenção',
  'Integração nativa com plataformas em nuvem',
  'Monitoramento e rastreabilidade dos fluxos',
];

const FAQ_ITEMS = [
  { question: 'Vocês desenvolvem apenas sistemas novos?', answer: 'Não. Também evoluímos sistemas existentes, modernizamos aplicações legadas e implementamos novas funcionalidades em plataformas já utilizadas pela empresa.' },
  { question: 'O software pode ser integrado aos sistemas que já utilizamos?', answer: 'Sim. Desenvolvemos integrações com ERPs, CRMs, plataformas financeiras, sistemas internos e serviços de terceiros por meio de APIs e outros mecanismos de integração.' },
  { question: 'Como acompanho o andamento do projeto?', answer: 'Trabalhamos com entregas incrementais, permitindo acompanhar a evolução do desenvolvimento, validar funcionalidades e incorporar ajustes ao longo do projeto.' },
  { question: 'O sistema poderá crescer no futuro?', answer: 'Sim. Todas as soluções são projetadas pensando em escalabilidade, manutenção e evolução contínua, reduzindo custos e facilitando a implementação de novas funcionalidades.' },
];

export default function IntegracaoAutomacaoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* HERO — componente padrão do projeto (frontend/components/ui/PageHero.tsx), só conteúdo muda */}
      <PageHero
        singleColumn
        className={styles.iaHero}
        dataAudit="ia2-hero"
        eyebrow="Especialidades · Integração & Automação"
        title={<>Conectamos sistemas e eliminamos retrabalho para tornar sua operação mais <em>inteligente</em>.</>}
        subtitle="À medida que uma empresa cresce, é comum que diferentes sistemas passem a fazer parte da rotina: ERP, CRM, e-commerce, plataformas financeiras, sistemas internos e diversas outras aplicações."
      >
        <p className={styles.heroParagraph2}>
          Quando essas ferramentas não se comunicam, surgem processos manuais, informações duplicadas e perda de produtividade.
        </p>
        <p className={styles.heroParagraph3}>
          Desenvolvemos soluções que integram plataformas e automatizam fluxos de trabalho para que as informações circulem de forma segura, rápida e confiável, permitindo que sua equipe concentre esforços no que realmente importa.
        </p>
        <div className={styles.heroCtaRow}>
          <Link href="/contato?assunto=integracao-automacao" className="btn">
            Solicitar diagnóstico <span aria-hidden="true">→</span>
          </Link>
        </div>
      </PageHero>

      {/* O QUE FAZEMOS — 5 cards (3+2), não 6 */}
      <section id="oquefazemos" className={styles.oquefazemos} data-audit="ia2-oquefazemos">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>O que fazemos</span>
            <h2 className={styles.h2}>Da integração à automação completa da operação</h2>
            <p className={styles.sectionDesc}>Cinco frentes que conectam sistemas e eliminam trabalho manual.</p>
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
                  dataAudit={title === 'Integração entre Sistemas' ? 'ia2-card' : undefined}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className={styles.beneficios} data-audit="ia2-beneficios">
        <div className={styles.beneficiosOverlay} aria-hidden="true" />
        <div className={styles.beneficiosWrap}>
          <div>
            <span className={styles.eyebrowDark}>Benefícios</span>
            <h2 className={styles.h2Dark}>Uma operação conectada, do primeiro ao último sistema</h2>
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

      {/* ESPECIALIDADES — 8 itens, não 10 */}
      <section id="especialidades" className={styles.especialidades} data-audit="ia2-especialidades">
        <div className={styles.especialidadesWrap}>
          <div className={`${styles.sectionHead} ${styles.especialidadesHead}`}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Especialidades</span>
            <h2 className={styles.h2}>Onde temos profundidade real</h2>
            <p className={styles.sectionDesc}>Oito frentes que sustentam cada projeto de integração, da arquitetura à operação contínua.</p>
          </div>
          <div className={styles.especialidadesList}>
            {ESPECIALIDADES.map((item, i) => (
              <div className={styles.especialidadeItem} key={item}>
                <span className={styles.especialidadeNumeral}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.especialidadeTitle}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOSSA ABORDAGEM + DIFERENCIAIS — sem grid de 3 etapas nesta landing */}
      <section id="abordagem" className={styles.abordagem} data-audit="ia2-abordagem">
        <div className={styles.wrap}>
          <div className={styles.abordagemHead}>
            <span className={styles.eyebrowLight}>Nossa abordagem</span>
            <h2 className={styles.h2}>Cada integração deve resolver um problema real do negócio</h2>
            <p className={styles.sectionDesc}>Antes de desenvolver qualquer solução, analisamos como as informações circulam entre pessoas, processos e sistemas. A partir desse entendimento, projetamos uma arquitetura que simplifica a operação, reduz a complexidade e cria uma base preparada para acompanhar a evolução da empresa.</p>
            <p className={styles.sectionDesc}>Nosso objetivo não é apenas conectar aplicações, mas construir uma operação mais eficiente, integrada e sustentável.</p>
          </div>

          <div className={styles.diferenciais} data-audit="ia2-diferenciais">
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

      {/* FAQ */}
      <section id="faq" className={styles.faq} data-audit="ia2-faq">
        <div className={styles.faqWrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Perguntas frequentes</span>
            <h2 className={styles.h2}>Dúvidas antes de começar</h2>
          </div>
          <Faq items={FAQ_ITEMS} dataAudit="ia2-faq-accordion" />
        </div>
      </section>

      {/* CTA FINAL — componente padrão do projeto (frontend/components/ui/CtaAssessoria.tsx), só conteúdo muda */}
      <div data-audit="ia2-cta-final">
        <CtaAssessoria
          id="contato-final"
          eyebrow="Vamos começar"
          title={<>Vamos conversar sobre a sua <em>operação</em>.</>}
          description="Agende uma chamada inicial de 30 minutos. Sem custo, sem compromisso, só clareza sobre como podemos conectar seus sistemas e eliminar retrabalho."
          points={[
            <span key="p1">Diagnóstico objetivo da sua <b>operação atual</b></span>,
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
          ctaHref="/contato?assunto=integracao-automacao"
          ctaLabel="Entrar em contato"
          reassure="Sem compromisso · sem custo"
        />
      </div>
    </>
  );
}
