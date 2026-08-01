import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER, ACCEPTING_NEW_PROJECTS } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import FaqSection from '@/components/ui/FaqSection';
import PageHero from '@/components/ui/PageHero';
import AdvisoryCta from '@/components/ui/AdvisoryCta';
import BenefitsSection from '@/components/ui/BenefitsSection';
import styles from './page.module.css';

const TITLE = `Inteligência Artificial Aplicada | ${SITE_NAME}`;
const DESCRIPTION = 'Assistentes corporativos, processamento de documentos, triagem, extração e agentes com ações controladas, integrados aos processos e sistemas da empresa.';
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
  name: `Inteligência Artificial Aplicada | ${AUTHOR_NAME}`,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: `${SITE_URL}/sobre`,
  },
  areaServed: { '@type': 'Country', name: 'Brazil' },
  serviceType: 'Soluções de inteligência artificial integradas a processos e sistemas',
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

interface TerritorioItem {
  title: string;
  text: string;
  tags?: string[];
}

const TERRITORIOS: { kicker: string; title: string; items: TerritorioItem[] }[] = [
  {
    kicker: 'Conhecimento',
    title: 'Informação interna acessível com contexto e permissão.',
    items: [
      { title: 'Assistentes de conhecimento', text: 'Criamos assistentes conectados a políticas, procedimentos, manuais e bases internas para ajudar equipes e clientes a localizar informações com mais rapidez.', tags: ['Busca contextual', 'Bases internas', 'Respostas com fontes'] },
    ],
  },
  {
    kicker: 'Documentos e informação',
    title: 'Leitura, organização e extração com validação proporcional ao risco.',
    items: [
      { title: 'Processamento inteligente de documentos', text: 'Aplicamos IA à leitura, ao resumo e à organização de contratos, formulários, notas fiscais, relatórios e outros documentos, mantendo validação humana quando a criticidade exige.' },
      { title: 'Classificação, triagem e extração', text: 'Identificamos categorias, prioridades, campos e informações relevantes para encaminhar solicitações, estruturar dados e reduzir etapas manuais.' },
    ],
  },
  {
    kicker: 'Ações e processos',
    title: 'Capacidades de IA incorporadas aos sistemas que a empresa já utiliza.',
    items: [
      { title: 'IA integrada a sistemas e workflows', text: 'Incorporamos capacidades de IA a aplicações e processos existentes para apoiar análises, sugerir próximos passos e acionar fluxos sem substituir desnecessariamente os sistemas atuais.' },
      { title: 'Agentes com ações controladas', text: 'Desenvolvemos agentes capazes de consultar informações e executar ações específicas dentro de limites definidos, com permissões, registros, aprovações e possibilidade de interrupção.' },
    ],
  },
];

const CASOS_DE_APLICACAO = [
  { title: 'Consulta ao conhecimento interno', text: 'Assistente para localizar políticas, procedimentos, manuais e respostas em bases internas, respeitando as permissões de cada usuário.' },
  { title: 'Atendimento com transferência para pessoas', text: 'Atendimento inicial para responder dúvidas conhecidas, registrar solicitações e encaminhar a conversa para uma pessoa quando houver incerteza, exceção ou necessidade de decisão.' },
  { title: 'Leitura e extração de documentos', text: 'Identificação de campos, cláusulas, datas, valores e categorias em documentos, com revisão proporcional ao impacto de eventuais erros.' },
  { title: 'Triagem de solicitações', text: 'Classificação de e-mails, tickets, formulários ou mensagens por assunto, urgência e destino, reduzindo o tempo até o encaminhamento correto.' },
  { title: 'Geração assistida de relatórios e comunicações', text: 'Produção de rascunhos, resumos e relatórios a partir de informações autorizadas, com revisão antes do envio ou da publicação.' },
  { title: 'Apoio a decisões operacionais', text: 'Organização de informações, identificação de padrões e sugestão de próximos passos para que a decisão final seja tomada com mais contexto.' },
];

const BENEFICIOS = [
  'Menos tempo para localizar informações',
  'Redução de etapas repetitivas de leitura e classificação',
  'Triagem mais rápida de solicitações',
  'Respostas mais consistentes em situações conhecidas',
  'Melhor aproveitamento do conhecimento interno',
  'Capacidade de processar maior volume de conteúdo',
  'Apoio à análise e à tomada de decisão',
  'Novas capacidades incorporadas aos sistemas existentes',
];

const ETAPAS = [
  { numero: '01', categoria: 'Problema', title: 'Identificar uma tarefa adequada', text: 'Selecionamos um problema com entradas, usuários, resultado esperado e impacto identificáveis. A IA não deve ser adotada apenas porque a tecnologia está disponível.' },
  { numero: '02', categoria: 'Dados', title: 'Avaliar informações e acessos', text: 'Verificamos quais informações são necessárias, quem pode acessá-las, como serão protegidas e quais restrições impedem o uso de determinados dados.' },
  { numero: '03', categoria: 'Qualidade', title: 'Definir como o resultado será avaliado', text: 'Estabelecemos exemplos de referência, métricas, níveis de confiança e situações em que a resposta deve ser recusada, revisada ou encaminhada para uma pessoa.' },
  { numero: '04', categoria: 'Integração', title: 'Conectar a solução com controle', text: 'Conectamos a solução aos sistemas e fluxos necessários, limitando permissões, registrando ações e mantendo aprovações humanas onde o risco exige.' },
  { numero: '05', categoria: 'Operação', title: 'Monitorar, aprender e evoluir', text: 'Acompanhamos qualidade, falhas, custo, tempo de resposta e comportamento de uso para ajustar prompts, dados, regras, modelos ou etapas do processo.' },
];

const GOVERNANCA_DOMINIOS = [
  { numero: '01', title: 'Dados e acesso', items: ['Dados e fontes autorizados para cada caso de uso', 'Permissões limitadas ao necessário'] },
  { numero: '02', title: 'Qualidade e evidência', items: ['Critérios de qualidade e conjuntos de avaliação', 'Respostas fundamentadas e referências quando aplicável'] },
  { numero: '03', title: 'Ações e supervisão', items: ['Aprovação humana para ações de maior impacto', 'Fallback e transferência para pessoas'] },
  { numero: '04', title: 'Operação e evolução', items: ['Logs e trilhas de auditoria', 'Monitoramento de qualidade, uso e custos'] },
];

const FAQ_ITEMS = [
  { question: 'Minha empresa precisa desenvolver um sistema novo para usar IA?', answer: 'Não necessariamente. A IA pode ser integrada a aplicações, documentos e fluxos existentes. Um sistema novo só deve ser considerado quando a interface ou o processo atual não oferece uma forma adequada de incorporar a solução.' },
  { question: 'Como saber se um processo realmente precisa de IA?', answer: 'Avaliamos se a tarefa exige interpretação de linguagem, classificação, extração, síntese ou geração. Quando regras determinísticas ou automação convencional resolvem o problema com menor custo e risco, elas devem ser preferidas.' },
  { question: 'É possível utilizar informações internas da empresa com segurança?', answer: 'É possível estruturar controles de acesso, seleção de fontes, registros e configurações de uso adequados ao caso. A arquitetura depende da sensibilidade dos dados, dos fornecedores escolhidos e das obrigações aplicáveis.' },
  { question: 'Os dados da empresa serão usados para treinar modelos?', answer: 'Isso depende do serviço e do contrato do fornecedor utilizado. Antes da implementação, é necessário verificar as políticas, as configurações de retenção e as opções disponíveis para o ambiente escolhido.' },
  { question: 'Como lidar com respostas incorretas ou inventadas?', answer: 'Definimos fontes, critérios de avaliação, limites de resposta, validações e encaminhamento para pessoas. Em processos críticos, a IA deve apoiar a tarefa, e não atuar como única autoridade.' },
  { question: 'A IA substitui o trabalho das equipes?', answer: 'O objetivo é reduzir esforço em tarefas específicas e ampliar a capacidade das pessoas. A redistribuição do trabalho depende do processo, da qualidade da solução e das decisões da empresa, não apenas da tecnologia.' },
  { question: 'Um agente pode executar ações nos nossos sistemas?', answer: 'Pode, quando existe justificativa e controle adequado. As ações devem ser limitadas por permissões, regras, aprovações, registros e mecanismos de interrupção proporcionais ao impacto.' },
  { question: 'Como a qualidade da solução é medida?', answer: 'Criamos exemplos de referência e métricas relacionadas à tarefa, como precisão de classificação, cobertura, taxa de encaminhamento, tempo economizado ou necessidade de correção humana. A avaliação continua depois da entrada em operação.' },
  { question: 'Como os custos de IA são controlados?', answer: 'Acompanhamos volume de uso, tamanho das entradas e respostas, modelo utilizado, chamadas externas e custo por tarefa. Limites, cache, modelos menores e processamento assíncrono podem ser considerados conforme o caso.' },
  { question: 'Existe manutenção depois da entrega?', answer: 'O modelo de sustentação é definido conforme a solução. Pode incluir monitoramento de qualidade e custos, correções, atualização de fontes, ajustes de prompts e regras, troca de modelos ou transferência estruturada para a equipe do cliente.' },
];

export default function InteligenciaArtificialPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* HERO — componente padrão do projeto (frontend/components/ui/PageHero.tsx), só conteúdo muda */}
      <PageHero
        singleColumn
        className={styles.aiHero}
        dataAudit="ai-hero"
        eyebrow="Inteligência Artificial Aplicada"
        title="Inteligência artificial integrada aos processos, documentos e sistemas da sua empresa."
        subtitle="Desenvolvemos soluções que ajudam equipes a localizar conhecimento, processar informações e executar etapas controladas da operação, com critérios de qualidade, permissões e supervisão definidos desde o projeto."
      >
        <div className={styles.heroCtaRow}>
          <Link href="/contato?area=inteligencia-artificial" className="btn">
            Apresentar uma oportunidade de IA
          </Link>
        </div>
        <p className={styles.heroMicrocopy}>Conversa inicial sem compromisso · Retorno em até um dia útil</p>
      </PageHero>

      {/* O QUE DESENVOLVEMOS — 3 territórios editoriais, sem grade de cards */}
      <section id="solucoes" className={styles.whatWeDo} data-audit="ai-solucoes">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrowLight}>O que desenvolvemos</span>
            <h2 className={styles.h2}>Soluções de IA conectadas ao contexto real da operação.</h2>
            <p className={styles.sectionDesc}>A solução pode consultar conhecimento, interpretar documentos, apoiar decisões ou executar ações limitadas. O desenho depende do problema, dos dados disponíveis e do nível de controle exigido.</p>
          </div>
          <div className={styles.territories}>
            {TERRITORIOS.map((t, i) => (
              <article className={styles.territory} key={t.kicker} data-audit={i === 0 ? 'ai-card' : undefined}>
                <span className={styles.territoryIndex} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.territoryHeading}>
                  <span className={styles.territoryKicker}>{t.kicker}</span>
                  <h3>{t.title}</h3>
                </div>
                <div className={`${styles.territoryBody} ${t.items.length > 1 ? styles.territoryBodyTwo : ''}`}>
                  {t.items.map((item) => (
                    <div className={styles.territoryItem} key={item.title}>
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                      {item.tags && (
                        <div className={styles.territoryTags}>
                          {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS DE APLICAÇÃO — composição assimétrica, cabeçalho fixo + catálogo numerado */}
      <section id="aplicacoes" className={styles.useCasesSection} data-audit="ai-aplicacoes">
        <div className={styles.wrap}>
          <div className={styles.applicationsLayout}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowLight}>Casos de aplicação</span>
              <h2 className={styles.h2}>Onde a IA pode apoiar a operação.</h2>
              <p className={styles.sectionDesc}>Os exemplos abaixo representam pontos de partida. A viabilidade depende dos dados, das integrações, dos riscos e da forma como o resultado será avaliado.</p>
            </div>
            <div className={styles.usecases}>
              {CASOS_DE_APLICACAO.map((caso, i) => (
                <article className={styles.usecase} key={caso.title} data-audit={i === 0 ? 'ai-caso-item' : undefined}>
                  <span className={styles.usecaseIndex} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className={styles.usecaseTitle}>{caso.title}</h3>
                    <p className={styles.usecaseText}>{caso.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <BenefitsSection
        id="beneficios"
        dataAudit="ai-beneficios"
        eyebrow="Benefícios"
        title="Mais acesso à informação, menos esforço em tarefas de interpretação."
        items={BENEFICIOS}
      />

      {/* NOSSA ABORDAGEM — cabeçalho fixo + percurso vertical de 5 decisões + manifesto */}
      <section id="abordagem" className={styles.approachSection} data-audit="ai-abordagem">
        <div className={styles.wrap}>
          <div className={styles.approachLayout}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowLight}>Nossa abordagem</span>
              <h2 className={styles.h2}>Começamos pelo problema, pelos dados e pela forma de medir a qualidade.</h2>
              <p className={styles.sectionDesc}>Nem todo processo precisa de inteligência artificial. Primeiro avaliamos se regras, integração ou automação convencional já resolvem o problema. Quando a IA é adequada, definimos o escopo, os limites e os critérios de avaliação antes de conectá-la à operação.</p>
            </div>
            <div className={styles.decisionPath}>
              {ETAPAS.map((etapa) => (
                <article className={styles.decisionStep} key={etapa.title}>
                  <span className={styles.decisionStepIndex} aria-hidden="true">{etapa.numero}</span>
                  <div>
                    <span className={styles.decisionStepCategory}>{etapa.categoria}</span>
                    <h3>{etapa.title}</h3>
                    <p>{etapa.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className={styles.manifesto} data-audit="ai-manifesto">
            <span className={styles.manifestoKicker}>Princípio de projeto</span>
            <h3 className={styles.manifestoTitle}>IA integrada à operação, não um chatbot isolado.</h3>
            <p className={styles.manifestoText}>O valor surge quando a solução participa de um processo definido, utiliza informações autorizadas e produz um resultado que pode ser avaliado.</p>
          </aside>
        </div>
      </section>

      {/* GOVERNANÇA E CONTROLE — capítulo estrutural, 4 domínios + privacidade integrada */}
      <section id="governanca" className={styles.governance} data-audit="ai-governanca">
        <div className={styles.governanceOverlay} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.governanceLayout}>
            <header>
              <span className={styles.eyebrowDark}>Governança e controle</span>
              <h2 className={styles.h2Dark}>Qualidade, permissões e supervisão fazem parte da solução.</h2>
              <p className={styles.sectionDescDark}>Soluções de IA podem produzir respostas incorretas, incompletas ou inadequadas ao contexto. Por isso, o projeto precisa definir como avaliar resultados, limitar acessos, registrar decisões e transferir situações de risco para pessoas responsáveis.</p>
              <p className={styles.governancePrinciple}>O nível de automação deve ser proporcional ao impacto de uma resposta ou ação incorreta.</p>
            </header>
            <div className={styles.governanceDomains}>
              {GOVERNANCA_DOMINIOS.map((dominio) => (
                <article className={styles.governanceDomain} key={dominio.title}>
                  <span className={styles.governanceDomainIndex} aria-hidden="true">{dominio.numero}</span>
                  <div>
                    <h3>{dominio.title}</h3>
                    <ul className={styles.governanceDomainList}>
                      {dominio.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.privacyBlock}>
            <h3 className={styles.privacyTitle}>Privacidade e uso de dados</h3>
            <p className={styles.privacyText}>A arquitetura deve considerar a natureza das informações, os fornecedores envolvidos, as configurações de retenção, os controles de acesso e as obrigações aplicáveis ao tratamento dos dados.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        id="perguntas"
        items={FAQ_ITEMS}
        dataAudit="ai-faq"
        eyebrow="Perguntas frequentes"
        title="Dúvidas antes de aplicar IA à operação"
      />

      {/* CTA FINAL — componente padrão do projeto (frontend/components/ui/AdvisoryCta.tsx), só conteúdo muda */}
      <div data-audit="ai-cta-final">
        <AdvisoryCta
          id="contato"
          eyebrow="Vamos começar"
          title="Qual tarefa poderia ganhar velocidade com melhor acesso à informação?"
          description="Conte o processo, os documentos ou o conhecimento envolvidos e o resultado que sua empresa espera alcançar. Vamos avaliar se a IA é adequada e qual deve ser o próximo passo."
          points={[
            <span key="p1">Informações difíceis de localizar em documentos e bases internas</span>,
            <span key="p2">Tarefas recorrentes de leitura, classificação ou triagem</span>,
            <span key="p3">Sistemas que podem receber apoio inteligente com controles definidos</span>,
          ]}
          cardTagline={ACCEPTING_NEW_PROJECTS ? 'Disponível para novos projetos' : null}
          cardLabel="Primeira conversa"
          cardTitle="Vamos entender o problema antes de propor IA."
          cardBody={<p className="cta-adv-body-text">A conversa inicial serve para avaliar a aderência e esclarecer os primeiros caminhos. Análises de dados, riscos, integrações e critérios de qualidade podem ser estruturadas como um diagnóstico comercial.</p>}
          ctaHref="/contato?area=inteligencia-artificial"
          ctaLabel="Apresentar uma oportunidade de IA"
          reassure="Sem compromisso · Retorno em até um dia útil"
        />
      </div>
    </>
  );
}
