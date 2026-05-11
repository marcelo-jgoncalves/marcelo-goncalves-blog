import './sobre.css';
import type { Metadata } from 'next';
import { getAuthor } from '@/lib/api';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import PageHero from '@/components/ui/PageHero';
import AvatarImage from '@/components/ui/AvatarImage';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const FALLBACK_DESC = 'Conheça Marcelo Gonçalves, especialista em AWS com mais de 8 anos de experiência, Mestre em Linguística e criador do blog.';

const EXPERTISE_AREAS = [
  {
    titulo: 'Arquitetura AWS',
    descricao: 'Design de soluções seguras e escaláveis seguindo o Well-Architected Framework.',
    icon: 'fa-cloud',
  },
  {
    titulo: 'DevOps & Automação',
    descricao: 'Infraestrutura como Código (Terraform) e pipelines de CI/CD eficientes.',
    icon: 'fa-code-branch',
  },
  {
    titulo: 'Serverless',
    descricao: 'Arquiteturas orientadas a eventos com Lambda, API Gateway e DynamoDB.',
    icon: 'fa-bolt',
  },
  {
    titulo: 'FinOps',
    descricao: 'Governança financeira e otimização de custos para máxima eficiência na nuvem.',
    icon: 'fa-chart-line',
  },
];

const FORMACAO = [
  {
    icon: 'fa-book-open',
    titulo: 'Letras + Mestrado em Linguística',
    descricao: 'Base analítica voltada para estrutura, interpretação e sistemas complexos.',
  },
  {
    icon: 'fa-graduation-cap',
    titulo: 'Sistemas de Informação',
    descricao: 'Graduação com foco em desenvolvimento e arquitetura de sistemas.',
  },
  {
    icon: 'fa-cloud',
    titulo: 'Pós em Arquitetura Cloud',
    descricao: 'Especialização em soluções escaláveis e modernas na nuvem.',
  },
];

const CERTS = [
  {
    id: '5326ba20-c51f-4565-a7fc-36fcc3fccf7d',
    nome: 'AWS Cloud Practitioner',
    nivel: 'Foundational',
    imagem: '/static/badges/pactitioner.png',
  },
  {
    id: '3d246d86-7316-43af-9094-f0f3459970ce',
    nome: 'AWS Solutions Architect',
    nivel: 'Associate',
    imagem: '/static/badges/solutions.png',
  },
  {
    id: '9b4b2ee7-9fd5-4a71-8b4a-40f1d6aac606',
    nome: 'AWS SysOps Administrator',
    nivel: 'Associate',
    imagem: '/static/badges/sysops.png',
  },
  {
    id: 'eb295814-0c5c-4961-a685-84c80e779439',
    nome: 'HashiCorp Terraform',
    nivel: 'Certified Associate',
    imagem: '/static/badges/terraform.png',
  },
  {
    id: '02d3ce05-a8d2-4b85-9dde-b14c22e10397',
    nome: 'Splunk Core',
    nivel: 'Certified Power User',
    imagem: '/static/badges/splunk.png',
  },
];

const LANGUAGES = [
  { nome: 'Português', nivel: 'Nativo', flag: '🇧🇷' },
  { nome: 'Inglês',    nivel: 'Fluente', flag: '🇺🇸' },
  { nome: 'Alemão',   nivel: 'Intermediário', flag: '🇩🇪' },
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
    twitter: {
      card: 'summary_large_image',
      title: `Sobre Mim | ${nome}`,
      description: desc,
      creator: AUTHOR_TWITTER,
    },
  };
}

export default async function SobrePage() {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const author = authorData?.autor || {};
  const linkedinUrl = author.linkedin_url || '#';
  const githubUrl = author.github_url || '#';
  const avatarUrl = author.foto_avatar_url;
  const nome = author.nome_exibicao || 'Marcelo Gonçalves';

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

      {/* 1. Hero */}
      <PageHero>
        <h1 className="hero-title">
          Sobre Mim e <span className="highlight">O Projeto</span>
        </h1>
        <p className="hero-subtitle">
          Minha missão é provar que a união da experiência humana em engenharia e linguística
          com o poder da IA pode criar conteúdo técnico de valor inigualável.
        </p>
      </PageHero>

      <div className="sobre-container container">

        {/* 2. Profile — foto + nome + tagline */}
        <section className="sobre-profile">
          <div className="sobre-profile__photo">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={`Foto de ${nome}`} />
            ) : (
              <div className="sobre-photo-placeholder">
                <i className="fa-solid fa-user" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="sobre-profile__text">
            <span className="sobre-tagline">Engenheiro de Cloud &amp; Especialista AWS</span>
            <h2 className="sobre-nome">{nome}</h2>
            <p>
              Arquiteto focado em alta disponibilidade e eficiência com mais de 8 anos de experiência
              resolvendo desafios técnicos complexos no ecossistema AWS.
            </p>
            <div className="sobre-social">
              <a href={linkedinUrl} title="LinkedIn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" aria-hidden="true" />
              </a>
              <a href={githubUrl} title="GitHub" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* 3. Main layout: trajetória + sidebar */}
        <div className="sobre-layout">

          {/* Coluna principal */}
          <main className="sobre-main">

            <section className="sobre-section">
              <h2 className="sobre-section-title">Trajetória Profissional</h2>
              <p>
                Com <strong>mais de 8 anos de experiência</strong> no ecossistema de tecnologia, atuo como
                Engenheiro de Cloud projetando infraestruturas que sustentam negócios em escala. Minha
                carreira é definida pela busca de resiliência, automação e eficiência.
              </p>
              <p>
                Colaborei com empresas líderes no <strong>Brasil e no exterior</strong>, como{' '}
                <strong>Accenture</strong>, <strong>Anynines</strong> e <strong>Credisis</strong>. Essa
                atuação internacional me permitiu refinar metodologias que equilibram agilidade técnica com
                governança corporativa.
              </p>

              <p className="sobre-expertise-intro">Essas são, resumidamente, as áreas em que atuo:</p>

              <div className="sobre-expertise-grid">
                {EXPERTISE_AREAS.map((area) => (
                  <div key={area.titulo} className="sobre-expertise-card">
                    <i className={`fas ${area.icon}`} aria-hidden="true" />
                    <h4>{area.titulo}</h4>
                    <p>{area.descricao}</p>
                  </div>
                ))}
              </div>

              <p>
                Como <strong>professor há mais de 15 anos</strong>, acredito que a tecnologia só atinge seu
                potencial máximo quando é comunicada com clareza. Meu objetivo é mentorar e traduzir
                conceitos complexos em conteúdo aplicável.
              </p>
            </section>

            {/* Caixa do diferencial */}
            <div className="sobre-differential">
              <h3>O Diferencial Linguístico</h3>
              <p>
                &ldquo;Minha base não é apenas engenharia. Sou formado em Letras, com Mestrado em
                Linguística. No mundo atual, onde a IA e os modelos de linguagem dominam a arquitetura,
                entender a estrutura da palavra é o que me permite conectar o <em>como</em> técnico ao{' '}
                <em>porquê</em> estratégico.&rdquo;
              </p>
            </div>

            <section className="sobre-section">
              <h2 className="sobre-section-title">Sobre este blog</h2>
              <p>
                Este blog é onde decisões arquiteturais reais são traduzidas em conteúdo prático e aplicável.
              </p>
              <p>
                Sem superficialidade. Sem teoria desnecessária. Apenas o que funciona em produção — com o
                custo, a segurança e a escala que os ambientes reais exigem.
              </p>
            </section>

          </main>

          {/* Sidebar */}
          <aside className="sobre-sidebar">

            {/* Certificações */}
            <div className="sobre-sidebar-group">
              <span className="sobre-sidebar-label">Certificações Técnicas</span>
              <div className="sobre-certs-list">
                {CERTS.map((cert) => (
                  <a
                    key={cert.id}
                    href={`https://www.credly.com/badges/${cert.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sobre-cert-card"
                    aria-label={`Ver credencial: ${cert.nome} — ${cert.nivel}`}
                  >
                    <img
                      src={cert.imagem}
                      alt={`${cert.nome} — ${cert.nivel}`}
                      className="sobre-cert-badge"
                    />
                    <div className="sobre-cert-info">
                      <strong>{cert.nome}</strong>
                      <span>{cert.nivel}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Formação */}
            <div className="sobre-sidebar-group">
              <span className="sobre-sidebar-label">Formação Acadêmica</span>
              <div className="sobre-edu-list">
                {FORMACAO.map((item) => (
                  <div key={item.titulo} className="sobre-edu-card">
                    <i className={`fas ${item.icon}`} aria-hidden="true" />
                    <div>
                      <h4>{item.titulo}</h4>
                      <p>{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Idiomas */}
            <div className="sobre-sidebar-group">
              <span className="sobre-sidebar-label">Idiomas</span>
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

          </aside>
        </div>

      </div>

      <NewsletterCTA />
    </>
  );
}
