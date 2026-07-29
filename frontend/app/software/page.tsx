/* frontend/app/software/page.tsx
   Landing page de pilar — ajustes/ajuste-12-pagina-sistemas-plataformas-digitais.md */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER, ACCEPTING_NEW_PROJECTS } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import FaqSection from '@/components/ui/FaqSection';
import PageHero from '@/components/ui/PageHero';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import Pill from '@/components/ui/Pill';
import Kicker from '@/components/ui/Kicker';
import IndexNumber from '@/components/ui/IndexNumber';
import BeneficiosSection from '@/components/ui/BeneficiosSection';
import {
  IconSustentacaoEvolucao,
  IconApisIntegracoes,
  IconModernizacaoSistemas,
  IconArquiteturaSoftware,
  IconCycle,
  IconPropriedadeAcesso,
  IconDividaTecnica,
} from '@/components/ui/InstitutionalIcons';
import styles from './page.module.css';

const TITLE = `Sistemas e Plataformas Digitais | ${SITE_NAME}`;
const DESCRIPTION = 'Desenvolvimento e modernização de sistemas internos, portais operacionais, APIs, plataformas documentais e aplicações integradas à operação.';
const PAGE_URL = `${SITE_URL}/software`;

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
  name: `Sistemas e Plataformas Digitais | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Desenvolvimento e modernização de sistemas empresariais',
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

// §9-14: seis soluções, sem qualidades técnicas (arquitetura/qualidade/sustentação) como entregas comerciais separadas.
const SOLUCOES = [
  { kicker: 'Operação interna', title: 'Sistemas internos', text: 'Ferramentas para organizar processos, regras, cadastros, aprovações, tarefas e informações que hoje dependem de planilhas ou aplicações fragmentadas.', tags: ['Processos', 'Cadastros', 'Operação'] },
  { kicker: 'Experiência e acompanhamento', title: 'Portais operacionais', text: 'Interfaces para clientes, parceiros ou equipes acompanharem solicitações, documentos, etapas e responsabilidades em um fluxo centralizado.', tags: ['Acompanhamento', 'Workflows', 'Perfis de acesso'] },
  { kicker: 'Capacidades compartilhadas', title: 'APIs e backends', text: 'Serviços para concentrar regras de negócio, integrar dados e disponibilizar capacidades de forma documentada para aplicações e parceiros autorizados.', tags: ['APIs', 'Regras de negócio', 'Integrações'] },
  { kicker: 'Informação e governança', title: 'Plataformas documentais e de conteúdo', text: 'Soluções para criar, organizar, revisar, publicar, distribuir ou consultar documentos e conteúdos com controle de acesso e histórico.', tags: ['Documentos', 'Conteúdo', 'Versionamento'] },
  { kicker: 'Evolução sem ruptura', title: 'Módulos e integrações', text: 'Componentes que complementam sistemas existentes, automatizam etapas e conectam aplicações sem exigir a substituição imediata da base atual.', tags: ['Módulos', 'Extensões', 'Integrações'] },
  { kicker: 'Redução de risco técnico', title: 'Modernização de aplicações', text: 'Evolução gradual de sistemas com arquitetura difícil de manter, baixa cobertura de testes, limitações de integração ou risco elevado a cada mudança.', tags: ['Arquitetura', 'Testes', 'Evolução gradual'] },
];

// Painel "antes de construir" — quando usar ferramenta pronta, conectar,
// evoluir uma base existente ou justificar software próprio.
const DECISOES = [
  { Icon: IconSustentacaoEvolucao, opcao: 'Ferramenta pronta', condicao: 'Quando já atende ao processo.', acao: 'usar' },
  { Icon: IconApisIntegracoes, opcao: 'Integração', condicao: 'Quando é preciso conectar o que existe.', acao: 'conectar' },
  { Icon: IconModernizacaoSistemas, opcao: 'Adaptação', condicao: 'Quando uma base atual pode evoluir.', acao: 'evoluir' },
  { Icon: IconArquiteturaSoftware, opcao: 'Software próprio', condicao: 'Quando a regra específica justifica construir.', acao: 'construir', accent: true },
];

// §15.5: oito benefícios — item 8 usa a formulação neutra (§15.6), condicionada ao contrato.
const BENEFICIOS = [
  'Processos centralizados em uma interface adequada à operação',
  'Menor dependência de planilhas e controles paralelos',
  'Informações consistentes entre sistemas',
  'Regras de negócio aplicadas de forma previsível',
  'Maior rastreabilidade de ações e alterações',
  'Integrações mais fáceis de manter',
  'Evolução por módulos e etapas',
  'Clareza sobre código, documentação e responsabilidades de manutenção',
];

// §17-21: cinco etapas da abordagem (construir é decisão de negócio, não só técnica).
const ETAPAS = [
  { numero: '01', categoria: 'Descoberta', title: 'Entender o processo', text: 'Mapeamos usuários, regras, informações, exceções, sistemas envolvidos e o resultado que a solução precisa produzir.' },
  { numero: '02', categoria: 'Decisão', title: 'Avaliar construir, integrar ou adaptar', text: 'Comparamos ferramentas existentes, possibilidades de integração e desenvolvimento próprio para evitar a criação de um sistema desnecessário.' },
  { numero: '03', categoria: 'Escopo', title: 'Definir a primeira entrega útil', text: 'Priorizamos um conjunto de funcionalidades que resolva parte relevante do problema e possa ser validado antes de ampliar o escopo.' },
  { numero: '04', categoria: 'Construção', title: 'Construir com critérios verificáveis', text: 'Implementamos regras, integrações, segurança, testes e observabilidade com critérios de aceite definidos para cada etapa.' },
  { numero: '05', categoria: 'Operação', title: 'Operar, aprender e evoluir', text: 'Acompanhamos o uso real, corrigimos desvios e priorizamos novas funcionalidades conforme o impacto observado na operação.' },
];

// §21.4-21.6: três princípios dentro da mesma seção da abordagem.
const ABORDAGEM_PRINCIPIOS = [
  { label: 'Escopo', title: 'Decisões visíveis antes de compromissos maiores.', text: 'Funcionalidades, integrações, restrições e critérios de aceite são registrados para reduzir interpretações diferentes durante o projeto.' },
  { label: 'Participação', title: 'O processo precisa ser validado por quem o conhece.', text: 'Responsáveis pelo negócio participam da priorização, esclarecem regras e validam as entregas. A tecnologia não substitui o conhecimento operacional.' },
  { label: 'Evolução', title: 'Arquitetura proporcional ao estágio da solução.', text: 'A base técnica deve suportar o próximo ciclo de crescimento sem antecipar complexidade e custos que ainda não são necessários.' },
];

// §22.6: dez capacidades de engenharia, agrupadas em 5 camadas da pilha técnica.
const CAMADAS = [
  { kicker: 'Fundação', title: 'Domínio e arquitetura', items: ['Arquitetura de software e definição de componentes', 'APIs REST e integração entre serviços'] },
  { kicker: 'Aplicação', title: 'Execução e interfaces', items: ['Backends e processamento assíncrono', 'Aplicações web e interfaces operacionais'] },
  { kicker: 'Controle', title: 'Identidade e dados', items: ['Autenticação, autorização e perfis de acesso', 'Modelagem e persistência de dados'] },
  { kicker: 'Confiança', title: 'Integração e qualidade', items: ['Integração com serviços AWS', 'Testes automatizados e quality gates'] },
  { kicker: 'Continuidade', title: 'Entrega e operação', items: ['Observabilidade, logs e rastreabilidade', 'CI/CD e infraestrutura como código'] },
];

// §23.6: oito itens do checklist de qualidade, manutenção e evolução.
const QUALIDADE_ITEMS = [
  'Código versionado e revisado',
  'Testes proporcionais ao risco de cada fluxo',
  'Validação automática antes de mudanças',
  'Logs, métricas e rastreabilidade de erros',
  'Documentação técnica e operacional',
  'Gestão de dependências e vulnerabilidades',
  'Estratégias de implantação e reversão',
  'Modelo de manutenção definido antes da entrega',
];

// §23.7-23.9: três subblocos da seção de qualidade (sem rótulo, só H3 + texto).
const QUALIDADE_SUBBLOCOS = [
  { Icon: IconCycle, title: 'Manutenção após a entrega', text: 'O modelo pode incluir acompanhamento inicial, correções, evolução contínua, observabilidade ou transferência estruturada para a equipe do cliente. Escopo, prazo de atendimento e responsabilidades devem ser definidos contratualmente.' },
  { Icon: IconPropriedadeAcesso, title: 'Propriedade e acesso', text: 'Repositórios, credenciais, ambientes e documentação devem ter responsáveis definidos. A forma de entrega e os direitos sobre o código precisam estar explícitos na proposta e no contrato.' },
  { Icon: IconDividaTecnica, title: 'Dívida técnica', text: 'Atalhos, limitações e decisões temporárias devem ser registrados para que a empresa consiga avaliar riscos e priorizar correções futuras.' },
];

// §25-34: dez perguntas frequentes.
const FAQ_ITEMS = [
  { question: 'Como saber se precisamos de um sistema próprio?', answer: 'Um sistema próprio costuma fazer sentido quando o processo é relevante, possui regras específicas e não é atendido adequadamente por ferramentas existentes. Antes de desenvolver, avaliamos alternativas prontas, integrações e adaptações.' },
  { question: 'Vocês desenvolvem qualquer tipo de software?', answer: 'A atuação é concentrada em sistemas e plataformas ligados à operação, integração de informações, documentos, automação e serviços empresariais. Projetos como sites simples, jogos ou aplicativos de entretenimento não são o foco principal.' },
  { question: 'É possível começar por uma versão menor?', answer: 'Sim. Priorizamos uma primeira entrega que resolva parte relevante do problema e permita validar regras, uso e integração antes de ampliar o escopo.' },
  { question: 'É necessário substituir o sistema atual?', answer: 'Não necessariamente. Podemos criar módulos, integrações ou modernizar componentes de forma gradual. A substituição completa só deve ser considerada quando a base atual impede uma evolução segura e economicamente viável.' },
  { question: 'Como funciona a definição do escopo?', answer: 'Mapeamos usuários, processos, regras, integrações, restrições e critérios de aceite. Em projetos com alto nível de incerteza, o diagnóstico e a descoberta podem ser estruturados como uma etapa comercial antes da implementação.' },
  { question: 'O prazo e o preço podem ser definidos na primeira conversa?', answer: 'Normalmente não. A primeira conversa permite avaliar aderência e contexto. Prazo e investimento dependem do escopo, das integrações, dos riscos e do nível de definição disponível.' },
  { question: 'Quem participa do projeto?', answer: 'Marcelo Gonçalves lidera o entendimento, a arquitetura e as principais decisões técnicas. Especialistas complementares podem ser incorporados quando o escopo exige competências adicionais.' },
  { question: 'O código e a documentação são entregues?', answer: 'A forma de entrega, os acessos, os repositórios e os direitos sobre o código devem ser definidos na proposta e no contrato. A recomendação é evitar dependências ocultas e garantir clareza sobre manutenção e continuidade.' },
  { question: 'Existe manutenção depois que o sistema entra em produção?', answer: 'O modelo de sustentação é definido conforme a solução. Pode incluir acompanhamento inicial, correções, monitoramento, evolução contínua ou transferência estruturada para a equipe do cliente.' },
  { question: 'É possível integrar inteligência artificial ou automações ao sistema?', answer: 'Sim, quando existe um caso de uso adequado. Automação e inteligência artificial podem ser incorporadas como capacidades do sistema, com regras, permissões, avaliação e controles proporcionais ao impacto.' },
];

export default function SistemasPlataformasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* HERO — componente padrão do projeto (frontend/components/ui/PageHero.tsx), só conteúdo muda */}
      <PageHero
        singleColumn
        className={styles.esHero}
        dataAudit="esw-hero"
        eyebrow="Sistemas e Plataformas Digitais"
        title="Sistemas que organizam a operação e evoluem com o negócio."
        subtitle="Construímos e modernizamos sistemas internos, portais, APIs e plataformas ligados a processos específicos da empresa, com integração, segurança e capacidade de manutenção desde o projeto."
      >
        <div className={styles.heroCtaRow}>
          <Link href="/contato?area=sistemas-plataformas" className="btn">
            Apresentar uma necessidade de sistema
          </Link>
        </div>
        <p className={styles.heroMicrocopy}>Conversa inicial sem compromisso · Retorno em até um dia útil</p>
      </PageHero>

      {/* O QUE DESENVOLVEMOS — cabeçalho fixo + nota de núcleo + linhas editoriais numeradas */}
      <section id="solucoes" className={styles.oquefazemos} data-audit="esw-solucoes">
        <div className={styles.wrap}>
          <div className={styles.editorialLayout}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowLight}>O que desenvolvemos</span>
              <h2 className={styles.h2}>Soluções digitais ligadas ao funcionamento real da empresa.</h2>
              <p className={styles.sectionDesc}>Atuamos quando ferramentas prontas não atendem adequadamente ao processo, quando sistemas existentes precisam evoluir ou quando uma nova camada digital pode reduzir fragmentação e dependência de controles manuais.</p>
              <div className={styles.coreNote}>
                <span className={styles.coreNoteKicker}>Núcleo</span>
                <strong>Processos e regras de negócio</strong>
                <p>O sistema nasce da operação que precisa organizar, não de uma lista genérica de funcionalidades.</p>
              </div>
            </div>
            <div className={styles.solutionList}>
              {SOLUCOES.map(({ kicker, title, text, tags }, i) => (
                <article className={styles.solutionRow} key={title} data-audit={i === 0 ? 'esw-card' : undefined}>
                  <IndexNumber className={styles.solutionIndex}>{String(i + 1).padStart(2, '0')}</IndexNumber>
                  <div>
                    <Kicker className={styles.solutionKicker}>{kicker}</Kicker>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <ul className={styles.solutionTags}>
                    {tags.map((tag) => <li key={tag}><Pill>{tag}</Pill></li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <BeneficiosSection
        id="beneficios"
        dataAudit="esw-beneficios"
        title="Menos fragmentação. Mais clareza sobre processos, dados e responsabilidades."
        items={BENEFICIOS}
      />

      {/* NOSSA ABORDAGEM — painel "antes de construir" + percurso de 5 etapas + 3 princípios */}
      <section id="abordagem" className={styles.abordagem} data-audit="esw-abordagem">
        <div className={styles.wrap}>
          <div className={`${styles.sectionHead} ${styles.abordagemHead}`}>
            <span className={styles.eyebrowLight}>Nossa abordagem</span>
            <h2 className={styles.h2}>Construir software é uma decisão de negócio, não apenas técnica.</h2>
            <p className={styles.sectionDesc}>Antes de iniciar o desenvolvimento, avaliamos se uma solução pronta, uma integração ou uma mudança de processo resolve a necessidade com menor custo e risco. Software próprio é indicado quando a especificidade da operação justifica construir.</p>
          </div>
          <div className={styles.decisionPanel}>
            <Kicker className={styles.decisionKicker}>Antes de construir</Kicker>
            <div className={styles.decisionTrack}>
              {DECISOES.map((d) => (
                <article className={`${styles.decisionCard} ${d.accent ? styles.decisionCardOwn : ''}`} key={d.opcao}>
                  <span className={styles.decisionCardIcon} aria-hidden="true">
                    <d.Icon />
                  </span>
                  <h3>{d.opcao}</h3>
                  <p>{d.condicao}</p>
                  <Kicker className={styles.decisionCardAction}>{d.acao}</Kicker>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.processBlock}>
            <div className={styles.processTitle}>
              <span>Como o projeto avança, etapa por etapa</span>
              <p>Cada etapa entrega algo utilizável e verificável antes da próxima começar. As decisões de escopo, integração e controle são proporcionais ao risco e à maturidade da solução em cada momento.</p>
            </div>
            <ol className={styles.processList}>
              {ETAPAS.map((etapa) => (
                <li key={etapa.title}>
                  <span aria-hidden="true">{etapa.numero}</span>
                  <div>
                    <Kicker className={styles.processStepCategory}>{etapa.categoria}</Kicker>
                    <h3>{etapa.title}</h3>
                    <p>{etapa.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.principlesRow}>
            {ABORDAGEM_PRINCIPIOS.map((p) => (
              <article key={p.label}>
                <span>{p.label}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CAPACIDADES DE ENGENHARIA — pilha de 5 camadas técnicas */}
      <section id="capacidades" className={styles.capacidades} data-audit="esw-capacidades">
        <div className={styles.wrap}>
          <div className={styles.capacidadesLayout}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowLight}>Capacidades de engenharia</span>
              <h2 className={styles.h2}>Da regra de negócio à operação em produção.</h2>
              <p className={styles.sectionDesc}>As capacidades são combinadas conforme o tipo de sistema, o estágio do produto, as integrações e os requisitos de segurança e manutenção.</p>
            </div>
            <div className={styles.stack}>
              {CAMADAS.map((c, i) => (
                <article className={styles.stackLayer} key={c.title}>
                  <span className={styles.stackNumber} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.stackTitle}>
                    <small>{c.kicker}</small>
                    <h3>{c.title}</h3>
                  </div>
                  <ul className={styles.stackItems}>
                    {c.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUALIDADE E CONTINUIDADE — matriz numerada + 3 contratos */}
      <section id="qualidade" className={styles.qualidade} data-audit="esw-qualidade">
        <div className={styles.qualidadeOverlay} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.qualidadeTop}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowDark}>Qualidade e continuidade</span>
              <h2 className={styles.h2Dark}>A entrega não termina quando a primeira versão entra em produção.</h2>
              <p className={styles.sectionDescDark}>Um sistema útil precisa continuar compreensível, observável e modificável. Por isso, qualidade não é uma etapa final: ela influencia arquitetura, testes, documentação, implantação e sustentação.</p>
            </div>
            <div className={styles.beneficiosList}>
              {QUALIDADE_ITEMS.map((item) => (
                <div className={styles.beneficioItem} key={item}>
                  <span className={styles.qualidadeCheckIcon} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className={styles.beneficioText}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.qualidadeSubblocos}>
            {QUALIDADE_SUBBLOCOS.map((s) => (
              <div className={styles.qualidadeSubbloco} key={s.title}>
                <span className={styles.qualidadeSubblocoIndex} aria-hidden="true"><s.Icon /></span>
                <h3 className={styles.privacidadeTitle}>{s.title}</h3>
                <p className={styles.privacidadeText}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        id="perguntas"
        items={FAQ_ITEMS}
        dataAudit="esw-faq"
        eyebrow="Perguntas frequentes"
        title="Dúvidas antes de desenvolver ou modernizar um sistema"
      />

      {/* CTA FINAL — componente padrão do projeto (frontend/components/ui/CtaAssessoria.tsx), só conteúdo muda */}
      <div data-audit="esw-cta-final">
        <CtaAssessoria
          id="contato"
          eyebrow="Vamos começar"
          title="Qual processo ou sistema precisa evoluir?"
          description="Conte como a operação funciona hoje, o que está limitando o trabalho e quais sistemas estão envolvidos. Vamos avaliar se o melhor caminho é desenvolver, integrar ou modernizar."
          points={[
            <span key="p1">Processos importantes ainda dependentes de planilhas</span>,
            <span key="p2">Sistemas que não acompanham novas regras ou integrações</span>,
            <span key="p3">Necessidade de uma plataforma operacional específica</span>,
          ]}
          cardTagline={ACCEPTING_NEW_PROJECTS ? 'Disponível para novos projetos' : null}
          cardLabel="Primeira conversa"
          cardTitle="Vamos entender a necessidade antes de propor um sistema."
          cardBody={<p className="cta-adv-body-text">A conversa inicial serve para avaliar a aderência e esclarecer os primeiros caminhos. Descoberta, levantamento de requisitos e definição detalhada de escopo podem ser estruturados como uma etapa comercial própria.</p>}
          ctaHref="/contato?area=sistemas-plataformas"
          ctaLabel="Apresentar uma necessidade de sistema"
          reassure="Sem compromisso · Retorno em até um dia útil"
        />
      </div>
    </>
  );
}
