/* frontend/app/sobre/page.tsx */

import type { Metadata } from 'next';
import { getAuthor } from '@/lib/api';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import PageHero from '@/components/ui/PageHero';
import './sobre.css';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const FALLBACK_DESC = 'Conheça Marcelo Gonçalves: engenheiro cloud especialista em AWS, DevOps e FinOps, mestre em Linguística e professor há mais de 15 anos.';
const FALLBACK_PHOTO = '/static/foto-perfil-oculos.png';

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const EXPERTISE_AREAS = [
  {
    cat: 'Modernização Operacional',
    title: 'Transformação Digital',
    desc: 'Apps internos, digitalização de processos, integração de sistemas e automação operacional para reduzir retrabalho e acelerar decisões.',
    meta: 'Processos · Integrações · Automação',
    feat: true,
  },
  {
    cat: 'Produtividade com IA',
    title: 'IA Aplicada & Automação Inteligente',
    desc: 'Assistentes internos, AIOps, análise inteligente de logs, automação documental e fluxos com IA para operações mais inteligentes e eficientes.',
    meta: 'LLMs · AIOps · Automação',
  },
  {
    cat: 'Nuvem Empresarial',
    title: 'Arquitetura AWS',
    desc: 'Arquiteturas seguras, escaláveis e resilientes para ambientes cloud preparados para crescer com governança, alta disponibilidade e continuidade operacional.',
    meta: 'AWS · Alta Disponibilidade · Governança',
  },
  {
    cat: 'Entrega Contínua',
    title: 'DevOps & Automação',
    desc: 'Infraestrutura como código, pipelines CI/CD e automações que aceleram entregas, reduzem erros e aumentam previsibilidade operacional.',
    meta: 'Terraform · CI/CD · GitOps',
  },
  {
    cat: 'Gestão de Custos',
    title: 'FinOps',
    desc: 'Otimização de custos, governança financeira e estratégias de consumo inteligente para operar cloud com eficiência e previsibilidade.',
    meta: 'Rightsizing · Savings Plans · Budgets',
  },
  {
    cat: 'Confiabilidade Operacional',
    title: 'Operações & Resiliência',
    desc: 'Administração de ambientes Linux e AWS, observabilidade, backup, resposta a incidentes e sustentação contínua para operações críticas.',
    meta: 'Linux · CloudWatch · Backup',
  },
];

const LANGUAGES = [
  { flag: 'BR', name: 'Português', level: 'Nativo' },
  { flag: 'US', name: 'Inglês', level: 'Avançado' },
  { flag: 'DE', name: 'Alemão', level: 'Avançado' },
];

const CERTS = [
  { tile: 'SA', issuer: 'AWS Certified', name: 'Solutions Architect – Associate', badge: '/static/badges/solutions.png', accent: true },
  { tile: 'SO', issuer: 'AWS Certified', name: 'SysOps Administrator – Associate', badge: '/static/badges/sysops.png' },
  { tile: 'TF', issuer: 'HashiCorp', name: 'Terraform Associate', badge: '/static/badges/terraform.png' },
  { tile: 'CP', issuer: 'AWS Certified', name: 'Cloud Practitioner', badge: '/static/badges/pactitioner.png' },
  { tile: 'SP', issuer: 'Splunk', name: 'Power User', badge: '/static/badges/splunk.png' },
];

const ACAD_ITEMS = [
  { num: '01', type: 'Especialização', name: 'Arquitetura e Projetos de Cloud Computing', logo: '/static/logos/estacio-logo.png', logoAlt: 'Estácio', logoTitle: 'Universidade Estácio de Sá' },
  { num: '02', type: 'Graduação', name: 'Sistemas de Informação', logo: '/static/logos/estacio-logo.png', logoAlt: 'Estácio', logoTitle: 'Universidade Estácio de Sá' },
  { num: '03', type: 'Mestrado', name: 'Linguística Aplicada', logo: '/static/logos/potsdam-logo.png', logoAlt: 'Universidade de Potsdam', logoTitle: 'Universidade de Potsdam' },
  { num: '04', type: 'Graduação', name: 'Bacharelado em Letras', logo: '/static/logos/ufmg-logo.png', logoAlt: 'UFMG', logoTitle: 'Universidade Federal de Minas Gerais' },
];

const COMPANIES = [
  { name: 'Accenture', logo: '/static/logos/accenture-logo.png' },
  { name: 'Deutsche Bahn', logo: '/static/logos/deutsche-bahn-logo.png' },
  { name: 'anynines', logo: '/static/logos/anynines-logo.png' },
  { name: 'CrediSIS', logo: '/static/logos/credisis-logo.png' },
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
    title: { absolute: `Sobre — ${nome}` },
    description: desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Sobre — ${nome}`,
      description: desc,
      url: canonicalUrl,
      type: 'profile',
      siteName: SITE_NAME,
      locale: 'pt_BR',
      ...(avatarUrl && { images: [{ url: avatarUrl, alt: `Foto de ${nome}` }] }),
    },
    twitter: { card: 'summary_large_image', title: `Sobre — ${nome}`, description: desc, creator: AUTHOR_TWITTER },
  };
}

export default async function SobrePage() {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const author = authorData?.autor || {};
  const linkedinUrl = author.linkedin_url || '#';
  const githubUrl = author.github_url || '#';
  const instagramUrl = author.instagram_url || '#';
  const nome = author.nome_exibicao || AUTHOR_NAME;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: nome,
    url: `${SITE_URL}/sobre`,
    image: author.foto_avatar_url || undefined,
    jobTitle: 'Engenheiro Cloud — AWS, DevOps & IA',
    description: author.bio || FALLBACK_DESC,
    sameAs: [linkedinUrl, githubUrl, instagramUrl].filter((u) => u && u !== '#'),
    knowsAbout: ['AWS', 'Arquitetura Serverless', 'DevOps', 'Terraform', 'FinOps', 'Inteligência Artificial', 'Linguística'],
    worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      {/* ── HERO ── */}
      <PageHero
        className="sobre-hero"
        dataAudit="sobre-hero"
        eyebrow={`Sobre · ${nome}`}
        title={<>Transformo complexidade técnica em <em>operações inteligentes</em>, eficientes e escaláveis</>}
        subtitle="Combino experiência prática em infraestrutura, DevOps e FinOps para modernizar ambientes, automatizar processos e tornar operações mais eficientes."
        right={
          <div className="sobre-photo-frame" data-audit="sobre-photo-frame">
            {author.foto_avatar_url ? (
              <ResponsiveImage className="sobre-pf-slot" src={author.foto_avatar_url} alt={nome} priority />
            ) : (
              <img className="sobre-pf-slot" src={FALLBACK_PHOTO} alt={nome} />
            )}
            <div className="sobre-pf-tag"><span className="sobre-dot" />Engenheiro Cloud · AWS</div>
          </div>
        }
        statsStrip={
          <div className="sobre-hero-stats" data-audit="sobre-hero-stats">
            <div className="sobre-hstat"><span className="v">10+</span><span className="l">Anos de experiência</span></div>
            <div className="sobre-hstat"><span className="v">8+</span><span className="l">Anos com AWS</span></div>
            <div className="sobre-hstat"><span className="v">3+</span><span className="l">Países</span></div>
            <div className="sobre-hstat"><span className="v">15+</span><span className="l">Anos de ensino</span></div>
          </div>
        }
      >
        <div className="sobre-hero-actions">
          <a className="sobre-btn-clay" href="#assessoria">Trabalhe comigo <span className="sobre-arrow">→</span></a>
        </div>
        <div className="sobre-hero-socials">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96s-2.08 1.4-2.08 2.86V21H9z" /></svg>
          </a>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" /></svg>
          </a>
        </div>
      </PageHero>

      {/* ── TRAJETÓRIA ── */}
      <section className="sobre-traj">
        <div className="wrap">
          <div className="sobre-traj-grid" data-audit="sobre-traj-grid">
            <div className="sobre-traj-left">
              <div className="sec-ey">Trajetória</div>
              <h2 className="sec-t sobre-traj-title">Uma carreira entre o código e a sala de aula</h2>
              <p>
                Especialista em <strong>cloud, automação e eficiência operacional</strong>, construo
                soluções que ajudam empresas a reduzir complexidade, ganhar escala e operar com mais
                inteligência. Minha atuação combina infraestrutura resiliente, automação de processos,
                IA aplicada e arquiteturas preparadas para evoluir com o negócio.
              </p>
              <p>
                Ao longo da carreira, colaborei com empresas no <strong>Brasil e no exterior</strong>,
                refinando métodos que equilibram agilidade técnica, governança e sustentabilidade
                operacional — uma experiência que molda como penso tecnologia: como ferramenta para
                gerar eficiência real.
              </p>
            </div>
            <div className="sobre-traj-quote" data-audit="sobre-traj-quote">
              <div className="sobre-tq-mark">&ldquo;</div>
              <p className="sobre-tq-text">
                Entre a engenharia e a estratégia, meu papel é transformar complexidade em
                sistemas, automações e operações que funcionam melhor.
              </p>
              <div className="sobre-tq-foot">
                <div className="sobre-tq-author">
                  <span className="n">Marcelo Gonçalves</span>
                  <span className="r">Engenheiro &amp; Professor</span>
                </div>
                <div className="sobre-tq-stat">
                  <span className="v">15+</span>
                  <span className="l">Anos ensinando</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sobre-traj-companies" data-audit="sobre-traj-companies">
            <div className="sobre-tc-wrapper">
              <div className="sec-ey sobre-tc-ey">Experiência</div>
              <div className="sobre-tc-label">Empresas que marcaram a <span className="sobre-clay-text">trajetória</span></div>
              <p className="sobre-tc-sub">Atuação em empresas líderes no Brasil e no exterior, do código à escala global.</p>
            </div>
            <div className="sobre-tc-list">
              {COMPANIES.map((c) => (
                <div className="sobre-tc-item" key={c.name}>
                  <img className="sobre-tc-logo" src={c.logo} alt={c.name} title={c.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ÁREAS ── */}
      <section className="sobre-areas">
        <div className="wrap">
          <div className="sobre-areas-head">
            <div className="sec-ey">Especialidades</div>
            <h2 className="sec-t">Áreas em que atuo</h2>
            <p className="sec-desc">Da transformação digital à operação em produção. Aplico cloud, automação e IA para tornar operações mais eficientes, seguras e escaláveis.</p>
          </div>
          <div className="sobre-areas-grid" data-audit="sobre-areas-grid">
            {EXPERTISE_AREAS.map((area) => (
              <div
                key={area.title}
                className={`sobre-area-card${area.feat ? ' sobre-feat' : ''}`}
                data-audit={area.feat ? 'sobre-area-feat' : undefined}
              >
                <span className="sobre-ac-cat">{area.cat}</span>
                <div className="sobre-ac-title">{area.title}</div>
                <p className="sobre-ac-desc">{area.desc}</p>
                <div className="sobre-ac-meta">{area.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAL ── */}
      <section className="sobre-dif">
        <div className="wrap" data-audit="sobre-dif-wrap">
          <div className="sobre-dif-grid">
            <div className="sobre-dif-col-l">
              <div className="sobre-dif-ey">O Diferencial</div>
              <h2 className="sobre-dif-title">Engenharia encontra <em>linguagem</em></h2>
              <div className="sobre-dif-seal">
                <span className="k">Formação</span>
                <span className="v">Engenharia + Letras<br />Mestrado em Linguística</span>
              </div>
            </div>
            <div className="sobre-dif-col-r">
              <span className="sobre-dif-quotemark">&ldquo;</span>
              <p className="sobre-dif-quote">
                No mundo atual, onde a IA e os modelos de linguagem dominam a arquitetura,
                entender a estrutura da palavra é o que me permite conectar o <em>como</em>{' '}
                técnico ao <em>porquê</em> estratégico.
              </p>
              <div className="sobre-dif-by">
                <span className="nm">Marcelo Gonçalves</span>
                <span className="ln" />
              </div>
            </div>
          </div>
          <div className="sobre-dif-langs">
            <span className="sobre-dif-langs-label">Idiomas</span>
            <div className="sobre-dif-langs-row">
              {LANGUAGES.map((lang) => (
                <span className="sobre-dif-lang" key={lang.name}>
                  <span className="f">{lang.flag}</span>
                  <span className="n">{lang.name}</span>
                  <span className="l">{lang.level}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICAÇÕES ── */}
      <section className="sobre-certs">
        <div className="wrap">
          <div className="sobre-certs-head">
            <div className="sec-ey">Credenciais</div>
            <h2 className="sec-t">Certificações</h2>
            <p className="sec-desc">Credenciais que validam na prática o que aplico no dia a dia — da arquitetura de soluções à automação de infraestrutura e observabilidade.</p>
          </div>
          <div className="sobre-certs-grid" data-audit="sobre-certs-grid">
            {CERTS.map((cert) => (
              <div className={`sobre-cert-card${cert.accent ? ' sobre-accent' : ''}`} key={cert.tile}>
                <div className="sobre-cert-top">
                  <img className="sobre-cert-badge" src={cert.badge} alt={`Selo de certificação ${cert.name}`} width={64} height={64} />
                  <span className="sobre-cert-verified">{CHECK_ICON}Verificada</span>
                </div>
                <div className="sobre-cert-body">
                  <span className="sobre-cert-issuer">{cert.issuer}</span>
                  <span className="sobre-cert-name">{cert.name}</span>
                </div>
              </div>
            ))}

            <div className="sobre-cert-card sobre-cert-card--soon">
              <div className="sobre-cert-body">
                <span className="sobre-cert-issuer">Sempre estudando</span>
                <span className="sobre-cert-name sobre-cert-name--soon">Próxima certificação a caminho →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BASE ACADÊMICA ── */}
      <section className="sobre-acad">
        <div className="wrap">
          <div className="sobre-acad-card" data-audit="sobre-acad-card">
            <div className="sobre-acad-left">
              <div className="sec-ey">Formação</div>
              <h2 className="sec-t sobre-acad-title">Base acadêmica multidisciplinar</h2>
              <p>
                Uma formação que conecta a precisão da engenharia à clareza da comunicação. Cada
                disciplina contribui para uma visão única — da arquitetura cloud à estrutura da
                linguagem.
              </p>
            </div>
            <div className="sobre-acad-right">
              {ACAD_ITEMS.map((item) => (
                <div className="sobre-acad-item" key={item.num}>
                  <div className="sobre-acad-tile">
                    <img src={item.logo} alt={item.logoAlt} title={item.logoTitle} />
                  </div>
                  <div className="sobre-acad-txt">
                    <span className="sobre-acad-type">{item.type}</span>
                    <span className="sobre-acad-name">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaAssessoria />
    </>
  );
}
