/* frontend/app/sobre/page.tsx — specs/ESPECIFICACAO-SOBRE-V2.md */

import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBullseye, faFilter, faCubes, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { getAuthor } from '@/lib/api';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import PageHero from '@/components/ui/PageHero';
import './sobre.css';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const FALLBACK_DESC = 'Conheça Marcelo Gonçalves: engenheiro cloud especialista em AWS, DevOps e FinOps, mestre em Linguística e professor há mais de 15 anos.';
const FALLBACK_PHOTO = '/static/foto-perfil-oculos.png';

const PRINCIPLES = [
  { num: '01', title: 'Simplicidade', text: 'Projetamos soluções fáceis de entender, operar e manter. A complexidade só deve existir quando for realmente necessária — nunca como consequência de decisões mal estruturadas.' },
  { num: '02', title: 'Modularidade', text: 'Construímos sistemas formados por partes bem definidas, independentes e preparadas para evoluir. Assim, o negócio pode crescer sem precisar reconstruir tudo a cada nova necessidade.' },
  { num: '03', title: 'Automação', text: 'Antes de adicionar mais ferramentas, procuramos eliminar esforço manual, reduzir retrabalho e criar processos mais previsíveis. Pessoas devem resolver problemas, não repetir tarefas.' },
  { num: '04', title: 'Precisão', text: 'Cada decisão técnica precisa ter um propósito claro. Tecnologia deve gerar impacto mensurável, melhorar a operação e contribuir diretamente para os objetivos do negócio.' },
  { num: '05', title: 'Evolução', text: 'Criamos arquiteturas preparadas para acompanhar mudanças, novas demandas e novas oportunidades. Crescer deve ser uma evolução natural, não uma sucessão de recomeços.' },
];

const MODULES = [
  { num: '01', icon: faMagnifyingGlass, title: 'Entendemos', text: 'Mapeamos a operação, as limitações e os objetivos reais antes de propor qualquer mudança técnica.', span: 4 },
  { num: '02', icon: faBullseye, title: 'Questionamos', text: 'Revisamos premissas, identificamos desperdícios e verificamos se o problema realmente exige mais tecnologia.', span: 4 },
  { num: '03', icon: faFilter, title: 'Simplificamos', text: 'Eliminamos etapas e dependências desnecessárias para tornar a solução mais clara, previsível e sustentável.', span: 4 },
  { num: '04', icon: faCubes, title: 'Construímos', text: 'Transformamos decisões bem fundamentadas em componentes modulares, seguros e preparados para evoluir sem comprometer o restante da operação.', span: 7 },
  { num: '05', icon: faArrowTrendUp, title: 'Evoluímos', text: 'Observamos os resultados, aprendemos com o uso real e adaptamos a solução conforme o negócio avança.', span: 5 },
];

const METRICS = [
  { value: '10+ anos', label: 'de experiência em tecnologia' },
  { value: 'Cloud', label: 'arquitetura e modernização' },
  { value: 'DevOps', label: 'automação e entrega contínua' },
  { value: 'Engenharia', label: 'soluções preparadas para evoluir' },
];

const EVIDENCE_CARDS = [
  { label: 'Experiência internacional', title: 'Contextos complexos e distribuídos', text: 'Experiência em projetos corporativos, equipes internacionais e ambientes que exigem confiabilidade, segurança e clareza técnica.', tags: ['Enterprise', 'Times globais', 'Ambientes críticos'] },
  { label: 'Certificações principais', title: 'Conhecimento validado na prática', text: 'Certificações estratégicas em arquitetura cloud, operação, infraestrutura como código e observabilidade.', tags: ['AWS', 'Terraform', 'Observabilidade'] },
  { label: 'Especialidades', title: 'Competências que trabalham juntas', text: 'Uma atuação integrada, conectando estratégia, arquitetura, implementação, automação e evolução contínua.', tags: ['Cloud e arquitetura', 'Software', 'Automação', 'IA e integrações'] },
];

const BELIEFS = [
  { num: '01', title: 'Tecnologia com propósito', text: 'Cada ferramenta, sistema ou automação precisa existir para resolver um problema real e gerar impacto mensurável na operação.' },
  { num: '02', title: 'Eficiência antes da complexidade', text: 'Não adicionamos tecnologia por hábito. Primeiro buscamos reduzir etapas, dependências e esforço desnecessário.' },
  { num: '03', title: 'Evolução sem recomeços', text: 'Boas soluções devem crescer junto com o negócio, sem exigir que tudo seja reconstruído a cada nova necessidade.' },
];

export async function generateMetadata(): Promise<Metadata> {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const autor = authorData?.autor;
  const nome = autor?.nome_exibicao || AUTHOR_NAME;
  const rawBio = autor?.bio?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? '';
  const desc = rawBio ? rawBio.substring(0, 160) : FALLBACK_DESC;
  const canonicalUrl = `${SITE_URL}/sobre`;
  const avatarUrl = autor?.foto_avatar_url;

  return {
    title: { absolute: `Sobre | ${nome}` },
    description: desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Sobre | ${nome}`,
      description: desc,
      url: canonicalUrl,
      type: 'profile',
      siteName: SITE_NAME,
      locale: 'pt_BR',
      ...(avatarUrl && { images: [{ url: avatarUrl, alt: `Foto de ${nome}` }] }),
    },
    twitter: { card: 'summary_large_image', title: `Sobre | ${nome}`, description: desc, creator: AUTHOR_TWITTER },
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
    jobTitle: 'Engenheiro Cloud, AWS, DevOps & IA',
    description: author.bio || FALLBACK_DESC,
    knowsAbout: ['AWS', 'Arquitetura Serverless', 'DevOps', 'Terraform', 'FinOps', 'Inteligência Artificial'],
    worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd) }} />

      {/* ── HERO ── */}
      <PageHero
        className="sobre-hero"
        dataAudit="sobre-hero"
        eyebrow="Sobre Nós"
        title={<>Toda empresa merece uma tecnologia que <em>acompanhe seu crescimento</em>.</>}
        subtitle="Criamos soluções que aumentam a eficiência operacional por meio de engenharia, automação e inteligência artificial. Porque crescer não deveria significar conviver com processos cada vez mais complexos."
        right={
          <div className="sobre-hero-right-col">
            <div className="sobre-hero-panel" data-audit="sobre-hero-panel">
              <div className="sobre-hp-tag"><span className="sobre-dot" />Nossa Visão</div>
              <p className="sobre-hp-quote">Tecnologia deve ampliar a capacidade de uma empresa, não aumentar o esforço necessário para operá-la.</p>
              <div className="sobre-hp-list">
                <div className="sobre-hp-row"><span className="k">Processos</span><span className="v">mais simples</span></div>
                <div className="sobre-hp-row"><span className="k">Operações</span><span className="v">mais eficientes</span></div>
                <div className="sobre-hp-row sobre-hp-row--last"><span className="k">Soluções</span><span className="v">preparadas para evoluir</span></div>
              </div>
            </div>
            <div className="sobre-hero-actions">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- <a> nativo intencional: next/link não dispara scroll até o hash no 1º clique (mesmo padrão de HeaderNav.tsx) */}
              <a className="btn sobre-btn-clay" href="/#servicos">Conheça nossos serviços</a>
            </div>
          </div>
        }
      />

      {/* ── NOSSA ORIGEM ── */}
      <section className="sobre-origem">
        <div className="wrap sobre-origem-grid" data-audit="sobre-origem-grid">
          <div className="sobre-origem-text">
            <div className="sec-ey">Nossa Origem</div>
            <h2 className="sobre-origem-title">Tecnologia só gera valor quando ajuda uma empresa a <em>operar melhor</em>.</h2>
            <p>Ao longo dos anos, vimos empresas investirem em novas ferramentas esperando mais velocidade e produtividade.</p>
            <p>Muitas vezes o resultado foi o contrário: processos mais complexos e sistemas que deixaram de conversar entre si.</p>
            <p>Por isso construímos uma visão diferente: soluções que simplificam operações e dão espaço para o que realmente importa.</p>
          </div>
          <aside className="sobre-origem-mission" data-audit="sobre-origem-mission">
            <span className="sobre-om-label">Nossa Missão</span>
            <h3 className="sobre-om-title">Transformar tecnologia em eficiência operacional.</h3>
            <p className="sobre-om-text">Fazemos isso por meio de engenharia, automação e inteligência artificial, construindo sistemas preparados para acompanhar cada nova etapa do negócio.</p>
          </aside>
        </div>
      </section>

      {/* ── NOSSA FILOSOFIA ── */}
      <section className="sobre-filosofia" id="filosofia">
        <div className="wrap">
          <div className="sobre-center-head">
            <div className="sec-ey sobre-ey-center">Nossa Filosofia</div>
            <h2 className="sec-t">Eficiência nasce de decisões <em>bem projetadas</em>.</h2>
            <p className="sec-desc sobre-desc-center">Nossa forma de pensar combina clareza, engenharia e visão de longo prazo. Cada solução precisa funcionar bem hoje, continuar compreensível amanhã e evoluir sem comprometer tudo o que já foi construído.</p>
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
        </div>
      </section>

      {/* ── COMO PENSAMOS ── */}
      <section className="sobre-abordagem" id="abordagem">
        <div className="wrap">
          <div className="sobre-abordagem-head" data-audit="sobre-abordagem-head">
            <div className="sobre-abordagem-head-l">
              <div className="sec-ey">Como Pensamos</div>
              <h2 className="sobre-abordagem-title">Boa engenharia começa antes da <em>implementação</em>.</h2>
            </div>
            <p className="sobre-abordagem-desc">Não começamos escolhendo ferramentas. Primeiro entendemos o contexto, questionamos premissas e simplificamos o problema. A tecnologia entra depois, como consequência de decisões bem fundamentadas.</p>
          </div>
          <div className="sobre-modules-grid" data-audit="sobre-modules-grid">
            {MODULES.map((m) => (
              <div
                className="sobre-module"
                style={{ gridColumn: `span ${m.span}` }}
                key={m.num}
              >
                <div className="sobre-module-top">
                  <span className="sobre-module-num">{m.num}</span>
                  <span className="sobre-module-mark" aria-hidden="true"><FontAwesomeIcon icon={m.icon} /></span>
                </div>
                <h3 className="sobre-module-title">{m.title}</h3>
                <p className="sobre-module-text">{m.text}</p>
                <span className="sobre-module-corner" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="sobre-approach-note">
            <p>Não é uma sequência rígida. É um conjunto de critérios que orienta cada decisão técnica, do início à evolução da solução.</p>
            <span className="sobre-approach-sig">Engenharia com propósito</span>
          </div>
        </div>
      </section>

      {/* ── O QUE ESTÁ POR TRÁS ── */}
      <section className="sobre-behind" id="lideranca" aria-labelledby="behind-title">
        <div className="sobre-behind-container">
          <header className="sobre-behind-head">
            <div className="sobre-behind-label"><span /><span className="txt">O que está por trás</span><span /></div>
            <h2 id="behind-title" className="sobre-behind-h2">Engenharia conduzida por quem <em>constrói todos os dias</em>.</h2>
          </header>

          <article className="sobre-behind-card" data-audit="sobre-behind-card">
            <div className="sobre-behind-photo">
              {author.foto_avatar_url ? (
                <ResponsiveImage src={author.foto_avatar_url} alt={nome} fill priority />
              ) : (
                <img src={FALLBACK_PHOTO} alt={nome} width={720} height={960} loading="lazy" decoding="async" />
              )}
              <div className="sobre-behind-photo-note">
                <div>
                  <span className="n">Marcelo Gonçalves</span>
                  <span className="r">Liderança técnica e fundador</span>
                </div>
                <span className="sobre-behind-chip">Engenharia</span>
              </div>
            </div>
            <div className="sobre-behind-content">
              <span className="sobre-behind-label-sm">Liderança técnica</span>
              <h3 className="sobre-behind-h3">Marcelo Gonçalves</h3>
              <p>A visão da empresa nasce de experiência prática projetando, modernizando e operando soluções de tecnologia em ambientes com diferentes níveis de escala, maturidade e complexidade.</p>
              <p>O trabalho conecta engenharia de software, cloud, automação e inteligência artificial às necessidades reais da operação, sem transformar ferramentas em protagonistas do projeto.</p>
              <p className="sobre-behind-emphasis">Mais do que implementar sistemas, o papel da liderança técnica é ajudar empresas a tomar decisões melhores e construir soluções que continuem fazendo sentido ao longo do tempo.</p>
              <div className="sobre-behind-metrics" data-audit="sobre-behind-metrics">
                {METRICS.map((m) => (
                  <div className="sobre-behind-metric" key={m.value}>
                    <span className="v">{m.value}</span>
                    <span className="l">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="sobre-evidence-grid" data-audit="sobre-evidence-grid">
            {EVIDENCE_CARDS.map((c) => (
              <div className="sobre-evidence-card" key={c.label}>
                <span className="sobre-ev-label">{c.label}</span>
                <h3 className="sobre-ev-title">{c.title}</h3>
                <p className="sobre-ev-text">{c.text}</p>
                <div className="sobre-ev-tags">
                  {c.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── NO QUE ACREDITAMOS ── */}
      <section className="sobre-beliefs" aria-labelledby="belief-title">
        <div className="sobre-beliefs-container">
          <header className="sobre-beliefs-head">
            <div className="sobre-beliefs-label"><span />No que acreditamos<span className="sobre-beliefs-label-line-r" /></div>
            <h2 id="belief-title" className="sobre-beliefs-h2">Tecnologia não existe para impressionar. Existe para tornar empresas <em>mais eficientes</em>.</h2>
            <p className="sobre-beliefs-desc">Acreditamos em uma engenharia clara, modular e preparada para acompanhar cada etapa do negócio. Tecnologia deve reduzir esforço, eliminar desperdícios e ampliar a capacidade das pessoas de realizar um trabalho melhor.</p>
          </header>

          <div className="sobre-beliefs-grid" data-audit="sobre-beliefs-grid">
            {BELIEFS.map((b) => (
              <article className="sobre-belief" key={b.num}>
                <span className="sobre-belief-num">{b.num}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      <CtaAssessoria
        eyebrow="Vamos trabalhar juntos"
        title="Pronto para começar? Vamos conversar sobre seu projeto."
        description="Se o que você viu aqui faz sentido para o seu momento, o próximo passo é simples: uma conversa sem compromisso para entender seu cenário."
        ctaHref="/contato"
        ctaLabel="Vamos conversar"
      />
    </>
  );
}
