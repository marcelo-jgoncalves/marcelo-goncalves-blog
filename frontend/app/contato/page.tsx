import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import FaqSection from '@/components/ui/FaqSection';
import ContactForm from '@/components/contact/ContactForm';
import {
  IconEnvelope, IconLinkedin, IconPin,
} from '@/components/ui/InstitutionalIcons';
import { SITE_URL, SITE_NAME, AUTHOR_LINKEDIN_URL, contactChannels } from '@/lib/config';
import styles from './contato.module.css';

export const revalidate = 3600;

const PAGE_TITLE = `Contato | Consultoria em Tecnologia | ${SITE_NAME}`;
const PAGE_DESCRIPTION = 'Apresente um desafio de automação, inteligência artificial, sistemas ou AWS e receba um retorno sobre aderência e próximos passos em até um dia útil.';

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contato` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/contato`,
    type: 'website',
  },
  twitter: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const NEXT_STEPS = [
  { title: 'Você apresenta o contexto', text: 'O formulário reúne as informações necessárias para uma primeira compreensão do desafio.' },
  { title: 'Avaliamos a aderência', text: 'Analisamos se a necessidade está relacionada às competências da consultoria e se precisamos esclarecer algum ponto.' },
  { title: 'Realizamos uma conversa inicial', text: 'Quando houver aderência, combinamos uma conversa para entender melhor o problema, as restrições e os resultados esperados.' },
  { title: 'Definimos o próximo passo', text: 'O próximo passo pode ser uma proposta, um diagnóstico comercial, uma etapa de descoberta ou a indicação de que outro caminho é mais adequado.' },
];

const FAQ_ITEMS = [
  { question: 'Preciso saber qual serviço contratar?', answer: 'Não. Descreva o problema, o processo ou o sistema que precisa evoluir. A primeira análise serve justamente para identificar se existe aderência e qual competência pode participar da solução.' },
  { question: 'A primeira conversa possui custo?', answer: 'Não. A conversa inicial serve para conhecer o contexto, avaliar aderência e esclarecer os primeiros caminhos. Quando o desafio exige levantamento, acesso a ambientes ou recomendações detalhadas, o diagnóstico pode ser estruturado como uma etapa comercial própria.' },
  { question: 'Atendem empresas de qualquer porte?', answer: 'O foco principal são pequenas e médias empresas em crescimento. Também podem ser avaliados projetos específicos para organizações maiores, especialmente quando envolvem AWS, DevOps, automação, integração ou modernização.' },
  { question: 'É necessário utilizar AWS?', answer: 'Não. AWS é a principal especialização em nuvem da consultoria, mas o ponto de partida é o contexto da empresa. Projetos de automação, integração, software e inteligência artificial podem envolver sistemas e ambientes já existentes.' },
  { question: 'O atendimento é remoto?', answer: 'Sim. O atendimento e a maior parte das entregas são realizados remotamente. Eventuais necessidades presenciais devem ser avaliadas separadamente.' },
  { question: 'Em quanto tempo receberei uma resposta?', answer: 'O retorno ocorre em até um dia útil. Mensagens enviadas em fins de semana ou feriados começam a ser consideradas no próximo dia útil.' },
  { question: 'Posso enviar documentos ou acessos pelo formulário?', answer: 'Não. O formulário não aceita anexos e não deve ser usado para enviar senhas, chaves, dados sensíveis ou documentos confidenciais. Caso essas informações sejam necessárias, o canal e os controles adequados serão definidos depois.' },
  { question: 'O envio do formulário garante uma proposta?', answer: 'Não. Primeiro avaliamos a aderência e o nível de definição disponível. O próximo passo pode ser uma conversa, uma etapa de descoberta, um diagnóstico comercial, uma proposta ou a indicação de outro caminho.' },
];

export default function ContatoPage() {
  return (
    <>
      <PageHero
        singleColumn
        className={styles.ctHero}
        dataAudit="ct-hero"
        eyebrow="Contato"
        title="Conte o que está limitando sua operação."
        subtitle="Você não precisa saber qual serviço contratar. Descreva o processo, sistema ou desafio que precisa evoluir e vamos avaliar a aderência e o próximo passo."
      >
        <div className={styles.ctHeroActions}>
          <a href="#formulario-contato" className={`btn ${styles.ctBtnPrimary}`}>Ir para o formulário</a>
        </div>
        <p className={styles.ctHeroMicrocopy}>Retorno em até um dia útil · Primeira conversa sem compromisso</p>
      </PageHero>

      {/* Bloco principal: formulário + próximos passos, lado a lado */}
      <section className={`${styles.ctSection} ${styles.ctSectionSurface}`} id="formulario-contato">
        <div className={`wrap ${styles.ctMainGrid}`}>
          <div className="ct-form-col">
            <div className="sec-ey">Apresente o contexto</div>
            <h2 className="sec-t">O que sua empresa precisa melhorar?</h2>
            <p className="sec-desc" style={{ maxWidth: 460 }}>
              Informe apenas o necessário para entendermos a situação inicial. Não envie senhas, credenciais, documentos confidenciais ou dados pessoais sensíveis pelo formulário.
            </p>
            <div className={styles.ctGuarantees}>
              <div className={styles.ctGuarantee}><span className="ck">✓</span>Retorno em até um dia útil</div>
              <div className={styles.ctGuarantee}><span className="ck">✓</span>Primeira conversa sem compromisso</div>
              <div className={styles.ctGuarantee}><span className="ck">✓</span>Seus dados serão usados apenas para responder à solicitação e conduzir os próximos passos</div>
            </div>
            <Suspense fallback={<div className="contact-form-card" />}>
              <ContactForm />
            </Suspense>
          </div>

          <aside className={styles.ctNextSteps} data-audit="ct-next-steps">
            <div className="sec-ey">Próximos passos</div>
            <h2 className={styles.ctNextStepsTitle}>O que acontece depois do envio</h2>
            <ol className={styles.ctNextStepsList}>
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title}>
                  <span className={styles.ctNextStepsNum}>{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={styles.ctNextStepsNote}>O envio do formulário não cria obrigação de contratação ou de apresentação de proposta.</p>
          </aside>
        </div>
      </section>

      {/* Canais alternativos */}
      <section id="canais" className={styles.ctSection}>
        <div className={`wrap ${styles.ctOtherwaysGrid}`}>
          <div>
            <div className="sec-ey">Outros canais</div>
            <h2 className={`sec-t ${styles.ctOtherwaysTitle}`}>Prefere entrar em contato de outra forma?</h2>
            <p className="sec-desc" style={{ maxWidth: 420 }}>Use o canal mais conveniente. Para projetos, o formulário costuma ajudar a reunir o contexto inicial.</p>
          </div>
          <div className={styles.ctContactCards}>
            <a className={styles.ctContactCard} href="mailto:contato@marcelogoncalves.com">
              <div className={`ct-icon-box ${styles.ctIconBoxSm}`}><IconEnvelope /></div>
              <span className={styles.ctContactCardText}>
                <span className={styles.ctContactK}>E-mail</span>
                <span className={styles.ctContactV}>contato@marcelogoncalves.com</span>
                <span className={styles.ctContactAux}>Para mensagens mais detalhadas ou quando preferir usar seu próprio cliente de e-mail.</span>
              </span>
            </a>
            {contactChannels.whatsappUrl && (
              <a className={styles.ctContactCard} href={contactChannels.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <div className={`ct-icon-box ${styles.ctIconBoxSm}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.6 6.6 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.4l.3-.4.2-.3a.5.5 0 0 0 0-.5c-.1-.1-.5-1.2-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.1 3.6c.6.2 1 .4 1.4.5a3.3 3.3 0 0 0 1.5.1 2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c-.1-.1-.2-.1-.4-.2z" /></svg>
                </div>
                <span className={styles.ctContactCardText}>
                  <span className={styles.ctContactK}>WhatsApp</span>
                  <span className={styles.ctContactV}>Conversar pelo WhatsApp</span>
                  <span className={styles.ctContactAux}>Para iniciar uma conversa breve. Informações detalhadas podem ser enviadas depois pelos canais adequados.</span>
                </span>
              </a>
            )}
            <a className={styles.ctContactCard} href={AUTHOR_LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <div className={`ct-icon-box ${styles.ctIconBoxSm}`}><IconLinkedin /></div>
              <span className={styles.ctContactCardText}>
                <span className={styles.ctContactK}>LinkedIn</span>
                <span className={styles.ctContactV}>Acessar perfil no LinkedIn</span>
                <span className={styles.ctContactAux}>Para conhecer a trajetória profissional e acompanhar publicações técnicas.</span>
              </span>
            </a>
            <div className={`${styles.ctContactCard} ${styles.ctContactCardStatic}`}>
              <div className={`ct-icon-box ${styles.ctIconBoxSm}`}><IconPin /></div>
              <span className={styles.ctContactCardText}>
                <span className={styles.ctContactK}>Localização</span>
                <span className={styles.ctContactV}>Belo Horizonte, MG · Atendimento remoto</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        id="perguntas"
        items={FAQ_ITEMS}
        eyebrow="Perguntas frequentes"
        title="Dúvidas antes do primeiro contato"
        dataAudit="ct-faq"
      />
      <div className={`wrap ${styles.ctFaqFooter}`}>
        <span>Pronto para apresentar o contexto?</span>
        <a href="#formulario-contato" className={styles.ctFaqFooterLink}>Ir para o formulário →</a>
      </div>
    </>
  );
}
