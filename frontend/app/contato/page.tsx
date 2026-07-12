/**frontend/app/contato/page.tsx */

import './contato.css';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import StepsTimeline from '@/components/ui/StepsTimeline';
import Faq from '@/components/ui/Faq';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import ContactForm from '@/components/contact/ContactForm';
import {
  IconCycle, IconChip, IconCloud, IconBolt,
  IconEnvelope, IconLinkedin, IconGithub, IconPin,
} from '@/components/ui/InstitutionalIcons';
import { SITE_URL, SITE_NAME, AUTHOR_LINKEDIN_URL, AUTHOR_GITHUB_URL } from '@/lib/config';

export const revalidate = 3600;

const PAGE_DESCRIPTION = 'Solicite um diagnóstico gratuito. Cada empresa possui desafios diferentes: vamos entender o seu cenário e identificar oportunidades de evolução.';

export const metadata: Metadata = {
  title: { absolute: `Contato | ${SITE_NAME}` },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contato` },
  openGraph: {
    title: `Contato | ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/contato`,
    type: 'website',
  },
  twitter: {
    title: `Contato | ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
  },
};

const STEPS = [
  { title: 'Recebemos sua solicitação', description: 'Analisamos as informações enviadas para compreender o contexto inicial da sua empresa.' },
  { title: 'Entramos em contato', description: 'Retornamos em até um dia útil para esclarecer dúvidas e entender melhor suas necessidades.' },
  { title: 'Agendamos uma conversa', description: 'Realizamos uma reunião para conhecer sua empresa, seus desafios e seus objetivos.' },
  { title: 'Avaliamos oportunidades', description: 'Identificamos como tecnologia, automação, cloud ou Inteligência Artificial podem gerar valor para o seu negócio.' },
  { title: 'Elaboramos uma proposta', description: 'Caso exista aderência entre suas necessidades e nossos serviços, apresentamos uma proposta personalizada.' },
];

// Mesmos 4 pilares de frontend/app/page.tsx (PILLARS) — mantidos em sincronia
// manualmente (não há módulo compartilhado ainda). Ver docs/analise-funil-ctas-servicos.md.
const AREAS = [
  { title: 'Engenharia de Software', description: 'Aplicações web, APIs e plataformas sob medida, com foco em desempenho e escalabilidade.', Icon: IconCycle, href: '/engenharia-de-software' },
  { title: 'Inteligência Artificial', description: 'IA aplicada para automatizar atividades, acelerar decisões e aumentar a produtividade.', Icon: IconChip, href: '/inteligencia-artificial' },
  { title: 'Cloud & DevOps', description: 'Ambientes em nuvem escaláveis, seguros e automatizados, com alta disponibilidade.', Icon: IconCloud, href: '/cloud-devops' },
  { title: 'Integração & Automação', description: 'Conectamos sistemas e automatizamos processos para eliminar retrabalho.', Icon: IconBolt, href: '/integracao-automacao' },
];

const FAQ_ITEMS = [
  {
    question: 'Atendem empresas de qualquer porte?',
    answer: 'Nosso foco principal são pequenas e médias empresas, mas também atuamos em projetos específicos para organizações maiores.',
  },
  {
    question: 'É necessário utilizar AWS?',
    answer: 'Não. A tecnologia utilizada depende das necessidades do projeto. Nosso objetivo é encontrar a solução mais adequada para cada cenário.',
  },
  {
    question: 'Vocês trabalham remotamente?',
    answer: 'Sim. Atendemos empresas em todo o Brasil de forma remota e, quando necessário, também podemos realizar atendimentos presenciais.',
  },
  {
    question: 'O diagnóstico possui custo?',
    answer: 'O primeiro contato é destinado ao entendimento do cenário e à avaliação inicial das necessidades da empresa. Caso seja necessário um trabalho mais aprofundado de diagnóstico ou consultoria estratégica, isso será discutido de forma transparente antes do início do projeto.',
  },
];

export default function ContatoPage() {
  return (
    <>
      <PageHero
        className="ct-hero"
        dataAudit="ct-hero"
        eyebrow="Contato"
        title={<>Vamos conversar sobre a <em>evolução</em> da sua empresa.</>}
        subtitle="Cada empresa possui desafios diferentes. Quer você esteja buscando modernizar sua infraestrutura, automatizar processos, aplicar Inteligência Artificial ou iniciar uma jornada de transformação digital, estamos prontos para entender seu cenário e identificar oportunidades de evolução."
      >
        <div className="ct-hero-actions">
          <a href="#form" className="btn ct-btn-primary">Solicitar diagnóstico <span aria-hidden="true">↓</span></a>
        </div>
      </PageHero>

      {/* Formulário */}
      <section className="ct-section ct-section--surface" id="form">
        <div className="wrap ct-form-grid">
          <div>
            <div className="sec-ey">Solicitação</div>
            <h2 className="sec-t">Conte um pouco sobre a sua empresa.</h2>
            <p className="sec-desc" style={{ maxWidth: 400 }}>
              Pedimos apenas o essencial para iniciar uma boa conversa. Os campos opcionais ajudam a entender melhor o seu cenário, mas fique à vontade.
            </p>
            <div className="ct-guarantees">
              <div className="ct-guarantee"><span className="ck">✓</span>Retorno em até um dia útil</div>
              <div className="ct-guarantee"><span className="ck">✓</span>Conversa consultiva, sem compromisso</div>
              <div className="ct-guarantee"><span className="ck">✓</span>Seus dados ficam apenas conosco</div>
            </div>
          </div>
          <Suspense fallback={<div className="contact-form-card" />}>
            <ContactForm />
          </Suspense>
        </div>
      </section>

      {/* Como funciona */}
      <section className="ct-section">
        <div className="wrap">
          <div className="sec-head-row">
            <div className="left">
              <div className="sec-ey">Como funciona</div>
              <h2 className="sec-t">O que acontece depois do envio.</h2>
            </div>
          </div>
          <StepsTimeline steps={STEPS} dataAudit="ct-steps" />
        </div>
      </section>

      {/* Como podemos ajudar */}
      <section className="ct-section ct-section--surface">
        <div className="wrap">
          <div className="sec-head-row">
            <div className="left">
              <div className="sec-ey">Áreas de atuação</div>
              <h2 className="sec-t">Como podemos ajudar.</h2>
              <p className="sec-desc">Identifique rapidamente o cenário mais próximo do seu. Toda solução parte do entendimento do negócio.</p>
            </div>
          </div>
          <div className="ct-areas-grid" data-audit="ct-areas-grid">
            {AREAS.map((area) => (
              <Link href={area.href} className="ct-area-card" key={area.title}>
                <div className="ct-icon-box"><area.Icon /></div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Outras formas de contato */}
      <section className="ct-section">
        <div className="wrap ct-otherways-grid">
          <div>
            <div className="sec-ey">Outras formas de contato</div>
            <h2 className="sec-t" style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.4rem)' }}>Prefere falar direto? Estamos por aqui.</h2>
            {/* WhatsApp fica pendente até termos um número real (backlog #1, .project-context.md) */}
          </div>
          <div className="ct-contact-cards">
            <a className="ct-contact-card" href="mailto:contato@marcelogoncalves.com">
              <div className="ct-icon-box ct-icon-box--sm"><IconEnvelope /></div>
              <span className="ct-contact-card-text">
                <span className="ct-contact-k">E-mail</span>
                <span className="ct-contact-v">contato@marcelogoncalves.com</span>
              </span>
            </a>
            <a className="ct-contact-card" href={AUTHOR_LINKEDIN_URL} target="_blank" rel="noreferrer">
              <div className="ct-icon-box ct-icon-box--sm"><IconLinkedin /></div>
              <span className="ct-contact-card-text">
                <span className="ct-contact-k">LinkedIn</span>
                <span className="ct-contact-v">/in/marcelo-jgoncalves</span>
              </span>
            </a>
            <a className="ct-contact-card" href={AUTHOR_GITHUB_URL} target="_blank" rel="noreferrer">
              <div className="ct-icon-box ct-icon-box--sm"><IconGithub /></div>
              <span className="ct-contact-card-text">
                <span className="ct-contact-k">GitHub</span>
                <span className="ct-contact-v">/marcelo-jgoncalves</span>
              </span>
            </a>
            <div className="ct-contact-card ct-contact-card--static">
              <div className="ct-icon-box ct-icon-box--sm"><IconPin /></div>
              <span className="ct-contact-card-text">
                <span className="ct-contact-k">Localização</span>
                <span className="ct-contact-v">Brasil · atendimento remoto</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ct-section ct-section--surface">
        <div className="wrap ct-faq-wrap">
          <div className="ct-center-head">
            <div className="sec-ey" style={{ justifyContent: 'center' }}>Perguntas frequentes</div>
            <h2 className="sec-t">Dúvidas antes de começar.</h2>
          </div>
          <Faq items={FAQ_ITEMS} dataAudit="ct-faq" />
        </div>
      </section>

      <CtaAssessoria
        id="chamada-final"
        eyebrow="Vamos conversar"
        title={<>Vamos construir o próximo passo da <em>evolução</em> da sua empresa.</>}
        description="A tecnologia evolui constantemente. Empresas que conseguem transformar essa evolução em vantagem competitiva estão mais preparadas para crescer, inovar e enfrentar novos desafios."
        ctaHref="#form"
        ctaLabel="Solicitar diagnóstico"
      />
    </>
  );
}
