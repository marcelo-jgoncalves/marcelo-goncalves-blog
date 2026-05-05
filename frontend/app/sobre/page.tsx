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

const FORMACAO = [
  {
    icon: 'fa-graduation-cap',
    titulo: 'Licenciatura em Letras',
    descricao: 'Base acadêmica em linguagem, comunicação e análise de sistemas complexos de sentido.',
  },
  {
    icon: 'fa-microscope',
    titulo: 'Mestrado em Linguística',
    descricao: 'Pesquisa em cognição e estrutura da linguagem — a fundação que hoje se traduz em clareza técnica.',
  },
  {
    icon: 'fa-chalkboard',
    titulo: '15+ Anos como Professor',
    descricao: 'Transformar complexidade em clareza é a habilidade central em tudo que faço, do código ao artigo.',
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

      {/* 1. Hero — mantido da versão anterior */}
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

        {/* 2. Bio — foto à esquerda, texto à direita */}
        <div className="sobre-bio">
          <div className="sobre-photo">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={`Foto de ${nome}`} />
            ) : (
              <div className="sobre-photo-placeholder">
                <i className="fa-solid fa-user" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="sobre-bio__text">
            <h2>{nome}</h2>
            <p className="sobre-subtitle">Arquiteto de Cloud • Especialista em AWS • Professor</p>

            <p>
              Especialista em arquitetura de sistemas em nuvem com mais de 8 anos de experiência
              projetando e escalando ambientes na AWS para empresas como <strong>Accenture</strong>,{' '}
              <strong>Anynines</strong> e <strong>Credisis</strong>.
            </p>
            <p>
              Antes de trabalhar com cloud, eu já era <strong>professor há mais de 15 anos</strong> e
              um acadêmico da palavra — formado em Letras, com Mestrado em Linguística. A convergência
              dessas duas áreas é o que diferencia cada artigo deste blog.
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
        </div>

        {/* 3. Formação — 3 cards lado a lado, estilo category card */}
        <div className="sobre-section">
          <h2 className="sobre-section-title">Formação</h2>
          <div className="sobre-formacao-grid">
            {FORMACAO.map((item) => (
              <div key={item.titulo} className="sobre-formacao-card">
                <div className="sobre-formacao-icon">
                  <i className={`fas ${item.icon}`} aria-hidden="true" />
                </div>
                <h3>{item.titulo}</h3>
                <p>{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Certificações — grid com badges locais */}
        <div className="sobre-section">
          <h2 className="sobre-section-title">Certificações</h2>
          <div className="sobre-certs">
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
                <span className="sobre-cert-nome">{cert.nome}</span>
                <span className="sobre-cert-nivel">{cert.nivel}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 5. Sobre este blog */}
        <div className="sobre-section">
          <h2 className="sobre-section-title">Sobre este blog</h2>
          <p>
            Este blog é onde decisões arquiteturais reais são traduzidas em conteúdo prático e aplicável.
          </p>
          <p>
            Sem superficialidade. Sem teoria desnecessária. Apenas o que funciona em produção — com o
            custo, a segurança e a escala que os ambientes reais exigem.
          </p>
        </div>

        {/* 6. Diferencial */}
        <div className="sobre-section">
          <h2 className="sobre-section-title">Diferencial</h2>
          <p>Minha base não é apenas engenharia.</p>
          <p>
            Sou formado em Letras, com Mestrado em Linguística, e professor há mais de 15 anos.
            Antes de trabalhar com cloud, eu já trabalhava com sistemas — sistemas de linguagem.
          </p>
          <p>
            <strong>
              Hoje, com a ascensão dos modelos de linguagem, essas duas áreas convergiram.
            </strong>
          </p>
          <p>
            Isso me permite enxergar arquitetura de forma estrutural, indo além da implementação técnica
            e conectando o como ao porquê de cada decisão.
          </p>
        </div>

      </div>

      <NewsletterCTA />
    </>
  );
}
