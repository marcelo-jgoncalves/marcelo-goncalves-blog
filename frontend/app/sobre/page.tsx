/* frontend/app/sobre/page.tsx — ajustes/ajuste-08-especificacao-completa-pagina-sobre.md */

import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBullseye, faFilter, faCubes, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { getAuthor } from '@/lib/api';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER, ACCEPTING_NEW_PROJECTS } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import AdvisoryCta from '@/components/ui/AdvisoryCta';
import PageHero from '@/components/ui/PageHero';
import IconTile from '@/components/ui/IconTile';
import FeatureCard from '@/components/ui/FeatureCard';
import './sobre.css';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const TITLE = `Sobre a Consultoria | ${SITE_NAME}`;
const DESCRIPTION = 'Conheça a consultoria boutique liderada por Marcelo Gonçalves, sua visão de engenharia, experiência em tecnologia, certificações e forma de conduzir projetos.';
const FALLBACK_PHOTO = '/static/foto-perfil-oculos.png';

// §7.4: três resultados curtos da Visão.
const VISION_RESULTS = [
  'Menos esforço manual',
  'Sistemas mais integrados',
  'Soluções preparadas para evoluir',
];

// §9.6-9.10: cinco princípios de engenharia.
const PRINCIPLES = [
  { num: '01', title: 'Simplicidade', text: 'Projetamos soluções fáceis de entender, operar e manter. A complexidade só deve existir quando o problema realmente exige.' },
  { num: '02', title: 'Modularidade', text: 'Organizamos sistemas em partes bem definidas, com responsabilidades claras e capacidade de evolução sem reconstruções desnecessárias.' },
  { num: '03', title: 'Automação', text: 'Procuramos eliminar esforço repetitivo, reduzir retrabalho e criar processos previsíveis antes de adicionar novas ferramentas.' },
  { num: '04', title: 'Clareza e precisão', text: 'Cada decisão técnica precisa ter propósito, critérios explícitos e relação direta com o resultado esperado para a operação.' },
  { num: '05', title: 'Evolução', text: 'Construímos soluções preparadas para mudanças, novas demandas e crescimento, sem transformar cada etapa em um novo começo.' },
];

// §11.6-11.10: cinco etapas do processo decisório (distinto dos princípios).
const DECISIONS = [
  { num: '01', icon: faMagnifyingGlass, title: 'Entendemos o contexto', text: 'Mapeamos a operação, as pessoas envolvidas, os sistemas existentes, as limitações e o resultado que precisa ser alcançado.', span: 4 },
  { num: '02', icon: faBullseye, title: 'Questionamos premissas', text: 'Verificamos se o problema está corretamente definido e se ele exige mais tecnologia, uma integração, uma mudança de processo ou uma combinação dessas alternativas.', span: 4 },
  { num: '03', icon: faFilter, title: 'Priorizamos impacto', text: 'Comparamos esforço, risco, dependências e retorno esperado para identificar a evolução mais útil e viável.', span: 4 },
  { num: '04', icon: faCubes, title: 'Projetamos a solução', text: 'Definimos componentes, integrações, responsabilidades e critérios técnicos proporcionais ao contexto e à capacidade de manutenção.', span: 7 },
  { num: '05', icon: faArrowTrendUp, title: 'Validamos e evoluímos', text: 'Observamos o uso real, verificamos os resultados e ajustamos a solução conforme a operação aprende e o negócio avança.', span: 5 },
];

// §12.6: tags de função de Marcelo (sem tag genérica "Engenharia").
const LEADER_TAGS = ['Arquitetura', 'Cloud e DevOps', 'Automação'];

// §13.2-13.5: quatro blocos de experiência, certificações e competências.
const AUTHORITY_CARDS = [
  { kicker: 'Experiência', destaque: '10+ anos', title: 'Tecnologia aplicada a ambientes reais', text: 'Experiência projetando, modernizando e operando soluções com diferentes níveis de escala, maturidade e criticidade.' },
  { kicker: 'Atuação internacional', title: 'Projetos no Brasil e na Alemanha', text: 'Vivência em equipes distribuídas e ambientes corporativos que exigem comunicação clara, segurança, confiabilidade e disciplina de engenharia.', tags: ['Brasil', 'Alemanha', 'Equipes distribuídas'] },
  { kicker: 'Certificações', title: 'Conhecimento técnico validado', text: 'Certificações em arquitetura e operação AWS, infraestrutura como código e observabilidade complementam a experiência prática.', certList: ['AWS Certified Solutions Architect – Associate', 'AWS Certified SysOps Administrator – Associate', 'HashiCorp Certified: Terraform Associate'] },
  { kicker: 'Competências', title: 'Capacidades que trabalham juntas', text: 'Uma atuação integrada entre estratégia técnica, arquitetura, implementação, automação e evolução contínua.', certList: ['Arquitetura AWS', 'Cloud e DevOps', 'Automação e integração', 'Sistemas e plataformas', 'Inteligência artificial aplicada'] },
];

export async function generateMetadata(): Promise<Metadata> {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const avatarUrl = authorData?.autor?.foto_avatar_url;
  const canonicalUrl = `${SITE_URL}/sobre`;

  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: canonicalUrl,
      type: 'profile',
      siteName: SITE_NAME,
      locale: 'pt_BR',
      ...(avatarUrl && { images: [{ url: avatarUrl, alt: `Foto de ${AUTHOR_NAME}` }] }),
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, creator: AUTHOR_TWITTER },
  };
}

export default async function SobrePage() {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const author = authorData?.autor || {};
  const nome = author.nome_exibicao || AUTHOR_NAME;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: nome,
    url: `${SITE_URL}/sobre`,
    image: author.foto_avatar_url || undefined,
    jobTitle: 'Fundador e líder técnico',
    description: DESCRIPTION,
    knowsAbout: ['AWS', 'Cloud', 'DevOps', 'Automação', 'Engenharia de Software'],
    worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd) }} />

      {/* ── HERO ── */}
      <PageHero
        singleColumn
        className="sobre-hero"
        dataAudit="sobre-hero"
        eyebrow="Sobre a consultoria"
        title="Engenharia próxima da operação, com responsabilidade direta sobre as decisões que sustentam a solução."
        subtitle="Somos uma consultoria boutique liderada por Marcelo Gonçalves. Combinamos automação, inteligência artificial, software e arquitetura em nuvem para ajudar empresas a operar com mais eficiência, integração e confiabilidade."
      >
        <div className="sobre-hero-actions">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- <a> nativo intencional: next/link não dispara scroll até o hash no 1º clique (mesmo padrão de HeaderNav.tsx) */}
          <a className="btn sobre-btn-clay" href="/#servicos">Conhecer os serviços</a>
        </div>
      </PageHero>

      {/* ── NOSSA VISÃO ── */}
      <section className="sobre-visao" id="visao">
        <div className="wrap sobre-center-head">
          <div className="sec-ey sobre-ey-center">Nossa visão</div>
          <h2 className="sobre-visao-quote">Tecnologia deve ampliar a capacidade de uma empresa, não aumentar o esforço necessário para operá-la.</h2>
        </div>
        <div className="wrap sobre-visao-list" data-audit="sobre-visao-list">
          {VISION_RESULTS.map((item) => (
            <span className="sobre-visao-item" key={item}>{item}</span>
          ))}
        </div>
      </section>

      {/* ── ORIGEM E PROPÓSITO ── */}
      <section className="sobre-origem" id="origem">
        <div className="wrap sobre-origem-grid" data-audit="sobre-origem-grid">
          <div className="sobre-origem-text">
            <div className="sec-ey">Por que a consultoria existe</div>
            <h2 className="sobre-origem-title">Tecnologia só gera valor quando melhora a forma como a empresa opera.</h2>
            <p>Depois de mais de dez anos atuando em tecnologia no Brasil e na Alemanha, Marcelo Gonçalves acompanhou projetos com diferentes níveis de escala, maturidade e complexidade.</p>
            <p>Em muitos contextos, o desafio não era a ausência de ferramentas, mas o excesso de etapas, integrações frágeis, processos manuais e decisões técnicas que aumentavam o esforço necessário para manter a operação.</p>
            <p>A consultoria nasceu dessa experiência: aproximar engenharia e operação para construir soluções mais simples, integradas e capazes de evoluir sem transformar tecnologia em uma nova fonte de complexidade.</p>
          </div>
          <aside className="sobre-origem-mission" data-audit="sobre-origem-mission">
            <span className="sobre-om-label">Nosso propósito</span>
            <h3 className="sobre-om-title">Transformar tecnologia em eficiência operacional.</h3>
            <p className="sobre-om-text">Fazemos isso conectando processos, sistemas e plataformas com decisões técnicas proporcionais ao problema, ao risco e à realidade de cada empresa.</p>
          </aside>
        </div>
      </section>

      {/* ── PRINCÍPIOS DE ENGENHARIA ── */}
      <section className="sobre-filosofia" id="principios">
        <div className="wrap">
          <div className="sobre-center-head">
            <div className="sec-ey sobre-ey-center">Princípios de engenharia</div>
            <h2 className="sec-t">Eficiência nasce de decisões bem projetadas.</h2>
            <p className="sec-desc sobre-desc-center">Cada solução precisa funcionar no presente, continuar compreensível no futuro e evoluir sem comprometer o que já está em operação.</p>
          </div>
          <div className="sobre-principles-list" data-audit="sobre-principles-list">
            {PRINCIPLES.map((p) => (
              <div className="sobre-principle-row" key={p.num}>
                <span className="sobre-pr-num">{p.num}</span>
                <h3 className="sobre-pr-title">{p.title}</h3>
                <p className="sobre-pr-text">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="sobre-manifesto" data-audit="sobre-manifesto">
            <h3 className="sobre-manifesto-frase">Tecnologia não existe para impressionar. Existe para tornar empresas mais eficientes.</h3>
            <p className="sobre-manifesto-texto">Ferramentas, sistemas e automações só fazem sentido quando reduzem esforço, eliminam desperdícios e ampliam a capacidade das pessoas de realizar um trabalho melhor.</p>
          </div>
        </div>
      </section>

      {/* ── COMO TOMAMOS DECISÕES ── */}
      <section className="sobre-abordagem" id="decisoes">
        <div className="wrap">
          <div className="sobre-abordagem-head" data-audit="sobre-abordagem-head">
            <div className="sec-ey sobre-ey-center">Como tomamos decisões</div>
            <h2 className="sobre-abordagem-title">Boa engenharia começa antes da implementação.</h2>
            <p className="sobre-abordagem-desc">Não começamos escolhendo ferramentas. Primeiro entendemos o contexto, testamos premissas, priorizamos o impacto e somente então definimos a solução.</p>
          </div>
          <div className="sobre-modules-grid" data-audit="sobre-modules-grid">
            {DECISIONS.map((m) => (
              <div
                className="sobre-module"
                style={{ gridColumn: `span ${m.span}` }}
                key={m.num}
              >
                <div className="sobre-module-top">
                  <span className="sobre-module-num">{m.num}</span>
                  <IconTile
                    icon={<FontAwesomeIcon icon={m.icon} />}
                    variant="clay"
                    className="sobre-module-mark"
                  />
                </div>
                <h3 className="sobre-module-title">{m.title}</h3>
                <p className="sobre-module-text">{m.text}</p>
                <span className="sobre-module-corner" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUEM LIDERA A CONSULTORIA ── */}
      <section className="sobre-behind" id="lideranca" aria-labelledby="behind-title">
        <div className="sobre-behind-container">
          <header className="sobre-behind-head">
            <div className="sec-ey sec-ey--dual">Quem lidera a consultoria</div>
            <h2 id="behind-title" className="sobre-behind-h2">Liderança técnica presente do diagnóstico à evolução.</h2>
          </header>

          <article className="sobre-behind-card" data-audit="sobre-behind-card">
            <div className="sobre-behind-photo">
              {author.foto_avatar_url ? (
                <ResponsiveImage src={author.foto_avatar_url} alt="Marcelo Gonçalves, fundador e líder técnico da consultoria" fill priority />
              ) : (
                <img src={FALLBACK_PHOTO} alt="Marcelo Gonçalves, fundador e líder técnico da consultoria" width={720} height={960} loading="lazy" decoding="async" />
              )}
            </div>
            <div className="sobre-behind-content">
              <span className="sobre-behind-label-sm">Liderança técnica</span>
              <h3 className="sobre-behind-h3">Marcelo Gonçalves</h3>
              <div className="sobre-behind-tags" data-audit="sobre-behind-tags">
                {LEADER_TAGS.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <p>Marcelo Gonçalves é engenheiro de Cloud e DevOps com mais de dez anos de experiência em tecnologia e atuação em projetos no Brasil e na Alemanha.</p>
              <p>Sua experiência reúne arquitetura AWS, infraestrutura como código, containers, integração de sistemas, automação e engenharia de software em ambientes que exigem segurança, confiabilidade e capacidade de evolução.</p>
              <p>Na consultoria, participa diretamente do entendimento do problema, da definição da solução e das principais decisões técnicas. O objetivo não é apenas implementar tecnologia, mas ajudar a empresa a construir algo que continue fazendo sentido depois da entrega.</p>
              <div className="sobre-boutique" data-audit="sobre-boutique">
                <h3 className="sobre-boutique-title">Uma estrutura adaptável ao projeto</h3>
                <p className="sobre-boutique-text">A liderança e a responsabilidade técnica permanecem centralizadas em Marcelo. Quando o escopo exige competências complementares, especialistas podem ser incorporados à entrega de acordo com a necessidade, sem que o cliente perca proximidade, clareza ou continuidade nas decisões.</p>
              </div>
            </div>
          </article>

          {/* Experiência, certificações e competências — mesmo macrobloco de
              autoridade da liderança (§3.3 item 9 da spec), não uma seção à parte. */}
          <div className="sobre-evidence-grid" id="experiencia" data-audit="sobre-evidence-grid">
            {AUTHORITY_CARDS.map((c) => {
              let footer;
              if (c.destaque) {
                footer = <span className="sobre-exp-destaque">{c.destaque}</span>;
              } else if (c.certList) {
                footer = (
                  <ul className="sobre-cert-list">
                    {c.certList.map((cert) => <li key={cert}>{cert}</li>)}
                  </ul>
                );
              }
              return (
                <FeatureCard
                  key={c.kicker}
                  kicker={c.kicker}
                  title={c.title}
                  text={c.text}
                  tags={c.tags}
                  footer={footer}
                />
              );
            })}
          </div>
        </div>
      </section>

      <AdvisoryCta
        id="contato"
        eyebrow="Vamos conversar"
        title="Conte o que sua empresa precisa melhorar."
        description="Descreva o processo, sistema ou desafio que precisa evoluir. Vamos avaliar a aderência, esclarecer os primeiros caminhos e definir se faz sentido avançar para um diagnóstico."
        points={[
          <span key="p1">Processos manuais que consomem tempo e geram retrabalho</span>,
          <span key="p2">Sistemas desconectados ou difíceis de evoluir</span>,
          <span key="p3">Plataformas que precisam ganhar segurança, confiabilidade ou escala</span>,
        ]}
        cardTagline={ACCEPTING_NEW_PROJECTS ? 'Disponível para novos projetos' : null}
        cardLabel="Primeira conversa"
        cardTitle="Vamos entender o problema e avaliar o próximo passo."
        cardBody={<p className="cta-adv-body-text">Você não precisa saber qual tecnologia ou serviço contratar. Começamos pelo contexto e identificamos o caminho mais adequado.</p>}
        ctaHref="/contato"
        ctaLabel="Apresentar um desafio"
        reassure="Sem compromisso · Retorno em até um dia útil"
      />
    </>
  );
}
