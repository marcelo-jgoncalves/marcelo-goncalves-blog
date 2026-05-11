import './sobre.css';
import type { Metadata } from 'next';
import { getAuthor } from '@/lib/api';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import AvatarImage from '@/components/ui/AvatarImage';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
import Link from 'next/link';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const FALLBACK_DESC = 'Conheça Marcelo Gonçalves, especialista em AWS com mais de 8 anos de experiência, Mestre em Linguística e criador do blog.';

const EXPERTISE_AREAS = [
  { titulo: 'Arquitetura AWS',    descricao: 'Design de soluções seguras e escaláveis seguindo o Well-Architected Framework.', icon: 'fa-cloud' },
  { titulo: 'DevOps & Automação', descricao: 'Infraestrutura como Código (Terraform) e pipelines de CI/CD eficientes.',          icon: 'fa-gears' },
  { titulo: 'Serverless',         descricao: 'Arquiteturas orientadas a eventos com Lambda, API Gateway e DynamoDB.',             icon: 'fa-bolt' },
  { titulo: 'FinOps',             descricao: 'Governança financeira e otimização de custos para máxima eficiência na nuvem.',     icon: 'fa-hand-holding-dollar' },
];

const FORMACAO = [
  { icon: 'fa-graduation-cap', titulo: 'Sistemas de Informação',         subtitulo: 'Graduação · Fundamentos de engenharia.' },
  { icon: 'fa-cloud',          titulo: 'Pós em Arquitetura Cloud',        subtitulo: 'Especialização em nuvem e escalabilidade.' },
  { icon: 'fa-book-open',      titulo: 'Graduação em Letras',             subtitulo: 'Base analítica voltada para a linguagem.' },
  { icon: 'fa-flask',          titulo: 'Mestrado em Linguística',         subtitulo: 'Análise de sistemas complexos e estruturais.' },
];

const CERTS = [
  { id: '3d246d86-7316-43af-9094-f0f3459970ce', nome: 'Solutions Architect', nivel: 'Associate',          imagem: '/static/badges/solutions.png',     abbr: 'AWS' },
  { id: '9b4b2ee7-9fd5-4a71-8b4a-40f1d6aac606', nome: 'SysOps Administrator', nivel: 'Associate',         imagem: '/static/badges/sysops.png',        abbr: 'AWS' },
  { id: 'eb295814-0c5c-4961-a685-84c80e779439', nome: 'HashiCorp Terraform', nivel: 'Certified Associate', imagem: '/static/badges/terraform.png',     abbr: 'TF'  },
  { id: '02d3ce05-a8d2-4b85-9dde-b14c22e10397', nome: 'Splunk Core',         nivel: 'Certified Power User',imagem: '/static/badges/splunk.png',        abbr: 'SPLK'},
  { id: '5326ba20-c51f-4565-a7fc-36fcc3fccf7d', nome: 'Cloud Practitioner',  nivel: 'Foundational',        imagem: '/static/badges/pactitioner.png',   abbr: 'AWS' },
];

const LANGUAGES = [
  { nome: 'Português', nivel: 'Nativo',       flag: '🇧🇷' },
  { nome: 'Inglês',    nivel: 'Fluente',       flag: '🇺🇸' },
  { nome: 'Alemão',    nivel: 'Intermediário', flag: '🇩🇪' },
];

export async function generateMetadata(): Promise<Metadata> {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const autor = authorData?.autor;
  const nome = autor?.nome_exibicao || 'Marcelo Gonçalves';
  const rawBio = autor?.bio?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? '';
  const desc = rawBio ? rawBio.substring(0, 160) : FALLBACK_DESC;
  const canonicalUrl = `${SITE_URL}/sobre`;
  const avatarUrl = autor?.foto_avatar_url;

  return {
    title: { absolute: `Sobre Mim | ${nome}` },
    description: desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Sobre Mim | ${nome}`,
      description: desc,
      url: canonicalUrl,
      type: 'profile',
      siteName: SITE_NAME,
      locale: 'pt_BR',
      ...(avatarUrl && { images: [{ url: avatarUrl, alt: `Foto de ${nome}` }] }),
    },
    twitter: { card: 'summary_large_image', title: `Sobre Mim | ${nome}`, description: desc, creator: AUTHOR_TWITTER },
  };
}

export default async function SobrePage() {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const author = authorData?.autor || {};
  const linkedinUrl = author.linkedin_url || '#';
  const githubUrl   = author.github_url   || '#';
  const avatarUrl   = author.foto_avatar_url;
  const nome        = author.nome_exibicao || 'Marcelo Gonçalves';

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: nome,
    url: `${SITE_URL}/sobre`,
    image: avatarUrl || undefined,
    jobTitle: 'Especialista em AWS & DevOps',
    description: author.bio || FALLBACK_DESC,
    sameAs: [linkedinUrl, githubUrl].filter((u) => u && u !== '#'),
    knowsAbout: ['AWS', 'Arquitetura Serverless', 'DevOps', 'Terraform', 'FinOps', 'Inteligência Artificial'],
    worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="sobre-hero">
        <div className="sobre-hero-inner container">

          <div className="sobre-portrait">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={`Foto de ${nome}`} />
            ) : (
              <div className="sobre-portrait__placeholder">
                <i className="fa-solid fa-user" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="sobre-hero-text">
            <div className="sobre-eyebrow">Sobre · Conheça a Jornada</div>
            <h1 className="sobre-hero-name">
              Marcelo <span className="accent">Gonçalves</span>
            </h1>
            <div className="sobre-hero-tagline">
              Engenheiro de Cloud &amp; Especialista AWS · Educador
            </div>
            <p className="sobre-hero-lede">
              Arquiteto focado em alta disponibilidade e eficiência, com mais de 8 anos de experiência
              resolvendo desafios técnicos complexos no Brasil e no exterior — e mais de 15 anos
              traduzindo tecnologia em sala de aula.
            </p>
            <div className="sobre-hero-meta">
              <div className="sobre-meta-item">
                <i className="fas fa-cloud" aria-hidden="true" />
                <span><strong>8+</strong> anos em Cloud</span>
              </div>
              <div className="sobre-meta-item">
                <i className="fas fa-chalkboard-user" aria-hidden="true" />
                <span><strong>15+</strong> anos como professor</span>
              </div>
              <div className="sobre-meta-item">
                <i className="fas fa-earth-americas" aria-hidden="true" />
                <span><strong>BR · EU</strong> projetos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIO + SIDEBAR ────────────────────────────── */}
      <div className="sobre-layout container">

        <section className="sobre-bio">
          <h2>Trajetória Profissional</h2>
          <p>
            Com <strong>mais de 8 anos de experiência</strong> no ecossistema de tecnologia, atuo como
            Engenheiro de Cloud projetando infraestruturas que sustentam negócios em escala global.
            Minha carreira é definida pela busca de resiliência, automação e arquiteturas que envelhecem bem.
          </p>
          <p>
            Colaborei com empresas líderes no <strong>Brasil e no exterior</strong>, como{' '}
            <strong>Accenture</strong>, <strong>Anynines</strong> e <strong>Credisis</strong>. Essa atuação
            internacional me permitiu refinar metodologias que equilibram agilidade técnica com governança
            corporativa.
          </p>

          <p className="sobre-expertise-intro">Áreas em que atuo no dia a dia</p>

          <div className="sobre-expertise-grid">
            {EXPERTISE_AREAS.map((area) => (
              <div key={area.titulo} className="sobre-expertise-card">
                <div className="sobre-expertise-ico">
                  <i className={`fas ${area.icon}`} aria-hidden="true" />
                </div>
                <h4>{area.titulo}</h4>
                <p>{area.descricao}</p>
              </div>
            ))}
          </div>

          <p className="sobre-after-grid">
            Como <strong>professor há mais de 15 anos</strong>, acredito que a tecnologia só atinge seu
            potencial máximo quando é comunicada com clareza. Meu objetivo é mentorar e traduzir conceitos
            complexos para o mercado — uma ponte entre o detalhe da engenharia e a decisão estratégica.
          </p>

          {/* Caixa diferencial */}
          <div className="sobre-differential">
            <div className="sobre-eyebrow sobre-eyebrow--light">O Diferencial</div>
            <h3>Engenharia encontra linguagem</h3>
            <blockquote>
              Minha base não é apenas engenharia. Sou formado em Letras, com Mestrado em Linguística.
              No mundo atual, onde a IA e os modelos de linguagem dominam a arquitetura, entender a
              estrutura da palavra é o que me permite conectar o <em>como</em> técnico ao{' '}
              <em>porquê</em> estratégico.
              <cite>— Marcelo Gonçalves</cite>
            </blockquote>
          </div>

          <h2 className="sobre-section-spacer">Por que este blog existe</h2>
          <p>
            Este blog é onde transformo a prática em conteúdo: análises profundas, tutoriais e
            bastidores de uma arquitetura serverless construída <em>quase</em> 100% com IA. Cada post
            é uma oportunidade de mostrar — com código real e decisões justificadas — como a engenharia
            humana ainda é o que separa um protótipo gerado de um sistema confiável.
          </p>
        </section>

        {/* ── SIDEBAR ── */}
        <aside className="sobre-sidebar">

          {/* Certificações */}
          <div className="sobre-widget">
            <div className="sobre-widget-label">Certificações Técnicas</div>
            <div className="sobre-cert-list">
              {CERTS.map((cert) => (
                <a
                  key={cert.id}
                  href={`https://www.credly.com/badges/${cert.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sobre-cert-card"
                  aria-label={`Ver credencial: ${cert.nome} — ${cert.nivel}`}
                >
                  <img src={cert.imagem} alt={cert.abbr} className="sobre-cert-badge-img" />
                  <div className="sobre-cert-info">
                    <strong>{cert.nome}</strong>
                    <span>{cert.nivel}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Formação */}
          <div className="sobre-widget">
            <div className="sobre-widget-label">Formação Acadêmica</div>
            <div className="sobre-edu-list">
              {FORMACAO.map((item) => (
                <div key={item.titulo} className="sobre-edu-card">
                  <div className="sobre-edu-badge">
                    <i className={`fas ${item.icon}`} aria-hidden="true" />
                  </div>
                  <div className="sobre-edu-info">
                    <h4>{item.titulo}</h4>
                    <span>{item.subtitulo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div className="sobre-widget">
            <div className="sobre-widget-label">Idiomas</div>
            <div className="sobre-lang-list">
              {LANGUAGES.map((lang) => (
                <div key={lang.nome} className="sobre-lang-card">
                  <span className="sobre-lang-flag" aria-hidden="true">{lang.flag}</span>
                  <div className="sobre-lang-info">
                    <strong>{lang.nome}</strong>
                    <span>{lang.nivel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Serviços */}
          <div className="sobre-talk-widget">
            <h4>Vamos conversar?</h4>
            <p>
              Precisa de apoio em arquitetura AWS, FinOps ou DevOps? Agende uma chamada inicial
              e veja como posso ajudar.
            </p>
            <Link href="/servicos" className="sobre-talk-btn">
              Ver Serviços →
            </Link>
          </div>

        </aside>
      </div>

      <NewsletterCTA />
    </>
  );
}
