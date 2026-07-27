/* frontend/app/automacao/page.tsx
   Landing page de pilar — ajustes/ajuste-09-pagina-automacao-integracao.md */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER, ACCEPTING_NEW_PROJECTS } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import FaqSection from '@/components/ui/FaqSection';
import PageHero from '@/components/ui/PageHero';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import FeatureCard from '@/components/ui/FeatureCard';
import Reveal from '@/components/ui/Reveal';
import BeneficiosSection from '@/components/ui/BeneficiosSection';
import IconLabelSection from '@/components/ui/IconLabelSection';
import {
  IconIntegracaoSistemas,
  IconAutomacaoProcessos,
  IconOrquestracaoProcessos,
  IconApisServicos,
  IconArquiteturasEscalaveis,
  IconArquiteturaNuvem,
  IconObservabilidade,
  IconEventos,
  IconAsync,
  IconProcessamentoDocumentos,
} from '@/components/ui/InstitutionalIcons';
import styles from './page.module.css';

const TITLE = `Automação e Integração de Processos | ${SITE_NAME}`;
const DESCRIPTION = 'Automatize processos, conecte ERP, CRM e sistemas internos e reduza retrabalho com integrações confiáveis, rastreáveis e preparadas para evoluir.';
const PAGE_URL = `${SITE_URL}/automacao`;

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
  name: `Automação e Integração de Processos | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Automação e integração de sistemas',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Automação',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automação de Processos', description: 'Transformamos tarefas repetitivas e baseadas em regras em fluxos automatizados, com execução consistente, registros de cada etapa e tratamento explícito das exceções.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Integração entre Sistemas', description: 'Conectamos aplicações para que dados circulem automaticamente entre ERP, CRM, plataformas financeiras, serviços externos e sistemas internos.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Workflows e Aprovações', description: 'Estruturamos fluxos com responsáveis, regras, prazos, notificações e trilhas de auditoria para reduzir esperas e aumentar a visibilidade sobre cada processo.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Processamento de Documentos e Dados', description: 'Automatizamos o recebimento, a validação, a transformação e o encaminhamento de documentos e informações entre pessoas e sistemas.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'APIs e Serviços de Integração', description: 'Desenvolvemos interfaces documentadas e componentes de integração para conectar aplicações atuais e facilitar a incorporação de novos sistemas no futuro.' } },
    ],
  },
};

// §7-11: cinco entregas comerciais distintas.
const ENTREGAS = [
  { Icon: IconAutomacaoProcessos, title: 'Automação de processos', text: 'Transformamos tarefas repetitivas e baseadas em regras em fluxos automatizados, com execução consistente, registros de cada etapa e tratamento explícito das exceções.', tags: ['Tarefas recorrentes', 'Regras de negócio', 'Rastreabilidade'] },
  { Icon: IconIntegracaoSistemas, title: 'Integração entre sistemas', text: 'Conectamos aplicações para que dados circulem automaticamente entre ERP, CRM, plataformas financeiras, serviços externos e sistemas internos.', tags: ['ERP e CRM', 'Sistemas internos', 'Serviços externos'] },
  { Icon: IconOrquestracaoProcessos, title: 'Workflows e aprovações', text: 'Estruturamos fluxos com responsáveis, regras, prazos, notificações e trilhas de auditoria para reduzir esperas e aumentar a visibilidade sobre cada processo.', tags: ['Aprovações', 'Notificações', 'Auditoria'] },
  { Icon: IconProcessamentoDocumentos, title: 'Processamento de documentos e dados', text: 'Automatizamos o recebimento, a validação, a transformação e o encaminhamento de documentos e informações entre pessoas e sistemas.', tags: ['Documentos', 'Validação', 'Relatórios'] },
  { Icon: IconApisServicos, title: 'APIs e serviços de integração', text: 'Desenvolvemos interfaces documentadas e componentes de integração para conectar aplicações atuais e facilitar a incorporação de novos sistemas no futuro.', tags: ['APIs', 'Webhooks', 'Baixo acoplamento'] },
];

// §12.5: oito benefícios.
const BENEFICIOS = [
  'Menos tarefas repetitivas',
  'Redução de erros de transferência e digitação',
  'Processos mais rápidos e previsíveis',
  'Informações consistentes entre sistemas',
  'Maior rastreabilidade das etapas',
  'Equipes menos dependentes de controles manuais',
  'Facilidade para incorporar novos sistemas',
  'Capacidade de crescer sem aumentar o retrabalho na mesma proporção',
];

// §13.5-13.7: três subblocos da abordagem.
const ABORDAGEM_SUBBLOCOS = [
  { label: 'Começar pelo processo', title: 'Automatizar uma etapa útil antes de ampliar o escopo.', text: 'Sempre que possível, iniciamos pelo processo com melhor relação entre impacto, risco e esforço. Isso permite validar a abordagem, corrigir premissas e ampliar a solução com mais segurança.' },
  { label: 'Preservar o que funciona', title: 'Integrar antes de substituir.', text: 'Não propomos trocar sistemas apenas para viabilizar uma automação. Quando a base atual é adequada, criamos integrações e camadas complementares para reduzir mudanças desnecessárias.' },
  { label: 'Manter controle', title: 'Automação não significa perder visibilidade.', text: 'Definimos logs, alertas, permissões, pontos de validação e formas de intervenção para que a empresa consiga acompanhar o fluxo e agir quando uma situação foge do esperado.' },
];

// §14.7: oito capacidades técnicas.
const CAPACIDADES = [
  { label: 'Integração de sistemas corporativos', Icon: IconIntegracaoSistemas },
  { label: 'APIs e webhooks', Icon: IconApisServicos },
  { label: 'Arquiteturas orientadas a eventos', Icon: IconEventos },
  { label: 'Processamento assíncrono', Icon: IconAsync },
  { label: 'Filas, retentativas e filas de mensagens não processadas', Icon: IconOrquestracaoProcessos },
  { label: 'Idempotência e prevenção de duplicidades', Icon: IconArquiteturasEscalaveis },
  { label: 'Monitoramento, logs e alertas', Icon: IconObservabilidade },
  { label: 'Integração com serviços em nuvem', Icon: IconArquiteturaNuvem },
];

// §15.5: seis itens do checklist de confiabilidade e controle.
const CONFIABILIDADE_ITEMS = [
  'Regras e responsabilidades claramente definidas',
  'Validação de dados antes do processamento',
  'Retentativas controladas e tratamento de indisponibilidades',
  'Prevenção de registros duplicados',
  'Logs, métricas e alertas sobre o fluxo',
  'Intervenção humana quando a exceção exige análise',
];

// §16: oito perguntas frequentes.
const FAQ_ITEMS = [
  { question: 'É necessário substituir os sistemas que já utilizamos?', answer: 'Não necessariamente. Em muitos projetos, o melhor caminho é conectar, complementar ou reorganizar o fluxo existente. A substituição só deve ser considerada quando a limitação do sistema impede uma solução confiável ou economicamente viável.' },
  { question: 'É possível começar por um único processo?', answer: 'Sim. Sempre que possível, começamos por um fluxo com impacto relevante e escopo controlado. Isso permite validar a abordagem antes de ampliar a automação para outras áreas.' },
  { question: 'Quais processos podem ser automatizados?', answer: 'Processos repetitivos, baseados em regras e com entradas e resultados identificáveis costumam ser bons candidatos. Aprovações, consolidação de dados, geração de relatórios, notificações, cadastros e processamento de documentos são exemplos comuns.' },
  { question: 'Vocês conseguem integrar sistemas legados?', answer: 'Depende das interfaces disponíveis, do acesso aos dados e das restrições do sistema. Quando não existe uma API adequada, avaliamos alternativas seguras e sustentáveis antes de propor a integração.' },
  { question: 'O que acontece quando um sistema fica indisponível?', answer: 'A solução pode utilizar filas, retentativas, alertas e mecanismos de retomada para evitar perda de informações. O desenho exato depende da criticidade do processo e do comportamento de cada sistema envolvido.' },
  { question: 'Como evitamos dados duplicados ou processamentos repetidos?', answer: 'Projetamos identificadores, validações e regras de idempotência para que uma mesma solicitação não produza efeitos duplicados quando houver reenvios, falhas ou retentativas.' },
  { question: 'A equipe consegue acompanhar o que a automação está fazendo?', answer: 'Sim. Definimos registros, indicadores, alertas e, quando necessário, interfaces de acompanhamento para que as pessoas responsáveis consigam visualizar o estado e tratar exceções.' },
  { question: 'Como funciona a manutenção depois da entrega?', answer: 'O modelo de sustentação é definido conforme a solução. Pode incluir acompanhamento inicial, correções, monitoramento, evolução contínua ou transferência estruturada para a equipe do cliente.' },
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
        eyebrow="Automação e Integração de Processos"
        title="Reduza tarefas manuais e conecte os sistemas que sustentam sua operação."
        subtitle="Automatizamos fluxos, integramos aplicações e organizamos a circulação de informações para reduzir retrabalho, erros e tempo operacional — sem exigir a substituição imediata dos sistemas que sua empresa já utiliza."
      >
        <div className={styles.heroCtaRow}>
          <Link href="/contato" className="btn">
            Apresentar um processo
          </Link>
        </div>
        <p className={styles.heroMicrocopy}>Conversa inicial sem compromisso · Retorno em até um dia útil</p>
      </PageHero>

      {/* O QUE AUTOMATIZAMOS E INTEGRAMOS */}
      <section id="entregas" className={styles.oquefazemos} data-audit="ia2-entregas">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>O que fazemos</span>
            <h2 className={styles.h2}>Processos mais conectados, previsíveis e fáceis de acompanhar.</h2>
            <p className={styles.sectionDesc}>Começamos pelos fluxos que concentram mais esforço, erros ou dependências manuais. A solução pode integrar ferramentas existentes, automatizar etapas específicas ou criar uma camada operacional para coordenar todo o processo.</p>
          </div>
          <div className={styles.cardGrid}>
            {ENTREGAS.map(({ Icon, title, text, tags }, i) => (
              <Reveal as="div" key={title} delay={i * 60}>
                <FeatureCard
                  icon={<Icon />}
                  title={title}
                  text={text}
                  tags={tags}
                  dataAudit={i === 0 ? 'ia2-card' : undefined}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <BeneficiosSection
        id="beneficios"
        dataAudit="ia2-beneficios"
        title="Menos esforço para operar. Mais controle para evoluir."
        description="Os ganhos dependem do processo e do contexto, mas uma automação bem projetada deve reduzir atividades repetitivas sem retirar visibilidade, controle ou capacidade de intervenção."
        items={BENEFICIOS}
        classes={{
          section: styles.beneficios,
          overlay: styles.beneficiosOverlay,
          wrap: styles.beneficiosWrap,
          eyebrow: styles.eyebrowDark,
          heading: styles.h2Dark,
          description: styles.beneficiosDescription,
          list: styles.beneficiosList,
          item: styles.beneficioItem,
          checkIcon: styles.checkIcon,
          text: styles.beneficioText,
        }}
      />

      {/* NOSSA ABORDAGEM — 3 subblocos, antes das capacidades técnicas */}
      <section id="abordagem" className={styles.abordagem} data-audit="ia2-abordagem">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowLight} ${styles.eyebrowDual}`}>Nossa abordagem</span>
            <h2 className={styles.h2}>Cada automação deve resolver um problema real da operação.</h2>
            <p className={styles.sectionDesc}>Antes de automatizar, entendemos como o processo funciona, quem participa, quais sistemas estão envolvidos, onde ocorrem exceções e como o resultado será medido. Só então definimos o fluxo, as integrações e os controles necessários.</p>
          </div>
          <div className={styles.subblocosGrid}>
            {ABORDAGEM_SUBBLOCOS.map((s) => (
              <div className={styles.subbloco} key={s.label}>
                <span className={styles.subblocoLabel}>{s.label}</span>
                <h3 className={styles.subblocoTitle}>{s.title}</h3>
                <p className={styles.subblocoText}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPACIDADES TÉCNICAS */}
      <IconLabelSection
        id="capacidades"
        dataAudit="ia2-capacidades"
        eyebrow="Capacidades técnicas"
        title="A engenharia que sustenta cada integração."
        description="Selecionamos padrões e componentes conforme o volume, a criticidade, os sistemas envolvidos e a capacidade de manutenção da empresa."
        items={CAPACIDADES}
        classes={{
          section: styles.especialidades,
          wrap: styles.especialidadesWrap,
          head: `${styles.sectionHead} ${styles.especialidadesHead}`,
          eyebrow: `${styles.eyebrowLight} ${styles.eyebrowDual}`,
          heading: styles.h2,
          desc: styles.sectionDesc,
        }}
      />

      {/* CONFIABILIDADE E CONTROLE */}
      <section id="confiabilidade" className={styles.confiabilidade} data-audit="ia2-confiabilidade">
        <div className={styles.confiabilidadeOverlay} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={`${styles.eyebrowDark} ${styles.eyebrowDual}`}>Confiabilidade e controle</span>
            <h2 className={styles.h2Dark}>A automação precisa continuar segura quando algo foge do esperado.</h2>
            <p className={styles.sectionDescDark}>Integrações dependem de sistemas externos, dados variáveis e condições que nem sempre estão sob o mesmo controle. Por isso, projetamos formas de detectar falhas, evitar duplicidades, retomar o processamento e tornar cada etapa rastreável.</p>
          </div>
          <div className={styles.beneficiosList}>
            {CONFIABILIDADE_ITEMS.map((item) => (
              <div className={styles.beneficioItem} key={item}>
                <span className={styles.checkIcon} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span className={styles.beneficioText}>{item}</span>
              </div>
            ))}
          </div>
          <p className={styles.confiabilidadeClosing}>O objetivo não é ocultar a complexidade, mas impedir que ela seja transferida para quem opera o processo.</p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        id="perguntas"
        items={FAQ_ITEMS}
        dataAudit="ia2-faq"
        eyebrow="Perguntas frequentes"
        title="Dúvidas antes de automatizar um processo"
      />

      {/* CTA FINAL — componente padrão do projeto (frontend/components/ui/CtaAssessoria.tsx), só conteúdo muda */}
      <div data-audit="ia2-cta-final">
        <CtaAssessoria
          id="contato"
          eyebrow="Vamos começar"
          title="Qual processo está consumindo mais tempo da sua equipe?"
          description="Conte como o fluxo funciona hoje, quais sistemas participam e onde estão os principais gargalos. Vamos avaliar a aderência e definir se faz sentido avançar para um diagnóstico."
          points={[
            <span key="p1">Tarefas repetitivas e transferências manuais de dados</span>,
            <span key="p2">Aprovações lentas ou difíceis de acompanhar</span>,
            <span key="p3">Sistemas que precisam trocar informações com mais confiabilidade</span>,
          ]}
          cardTagline={ACCEPTING_NEW_PROJECTS ? 'Disponível para novos projetos' : null}
          cardLabel="Primeira conversa"
          cardTitle="Vamos entender o processo e avaliar o próximo passo."
          cardBody={<p className="cta-adv-body-text">A conversa inicial serve para verificar a aderência e esclarecer os primeiros caminhos. Diagnósticos que exigem levantamento e recomendações detalhadas podem ser estruturados como uma entrega comercial própria.</p>}
          ctaHref="/contato"
          ctaLabel="Apresentar um processo"
          reassure="Sem compromisso · Retorno em até um dia útil"
        />
      </div>
    </>
  );
}
