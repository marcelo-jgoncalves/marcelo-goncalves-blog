import './sobre.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { getAuthor } from '@/lib/api';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import AvatarImage from '@/components/ui/AvatarImage';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const FALLBACK_DESC = 'Conheça Marcelo Gonçalves, especialista em AWS com mais de 8 anos de experiência, Mestre em Linguística e criador do blog.';

const CREDLY_BADGES = [
  '5326ba20-c51f-4565-a7fc-36fcc3fccf7d',
  '3d246d86-7316-43af-9094-f0f3459970ce',
  '9b4b2ee7-9fd5-4a71-8b4a-40f1d6aac606',
  'eb295814-0c5c-4961-a685-84c80e779439',
  '02d3ce05-a8d2-4b85-9dde-b14c22e10397',
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

      <div className="sobre-container container">

        {/* HERO — foto à esquerda, texto à direita */}
        <div className="sobre-hero">
          <div className="sobre-photo">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={`Foto de ${nome}`} />
            ) : (
              <div className="sobre-photo-placeholder">
                <i className="fa-solid fa-user" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="sobre-hero__text">
            <h1>{nome}</h1>
            <p className="sobre-subtitle">Arquiteto de Cloud • Especialista em AWS • Professor</p>

            <p>
              Especialista em arquitetura de sistemas em nuvem com mais de 8 anos de experiência
              projetando e escalando ambientes na AWS para empresas como <strong>Accenture</strong>,{' '}
              <strong>Anynines</strong> e <strong>Credisis</strong>.
            </p>
            <p>
              Foco em segurança, eficiência de custos e arquiteturas resilientes para ambientes
              de produção — de startups a operações globais.
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

        {/* FORMAÇÃO */}
        <div className="sobre-section">
          <h2>Formação</h2>

          <div className="sobre-cards-two">
            <div className="sobre-card">
              <strong>Licenciatura em Letras</strong>
              <p>Graduação com foco em linguagem, comunicação e análise de sistemas complexos de sentido.</p>
            </div>
            <div className="sobre-card">
              <strong>Mestrado em Linguística</strong>
              <p>Pesquisa aprofundada em cognição e estrutura da linguagem — base que hoje se traduz em clareza técnica.</p>
            </div>
          </div>

          <div className="sobre-card sobre-card--wide">
            <strong>15+ Anos como Professor</strong>
            <p>
              Ensinar é a habilidade de transformar complexidade em clareza. Exercida em sala de aula por mais de 15 anos,
              é o que hoje diferencia cada artigo deste blog.
            </p>
          </div>
        </div>

        {/* CERTIFICAÇÕES — badges Credly oficiais */}
        <div className="sobre-section">
          <h2>Certificações</h2>

          <div className="sobre-certs">
            {CREDLY_BADGES.map((id) => (
              <div
                key={id}
                data-iframe-width="150"
                data-iframe-height="270"
                data-share-badge-id={id}
                data-share-badge-host="https://www.credly.com"
              />
            ))}
          </div>
          <Script src="https://cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
        </div>

        {/* SOBRE ESTE BLOG */}
        <div className="sobre-section">
          <h2>Sobre este blog</h2>
          <p>
            Este blog é onde decisões arquiteturais reais são traduzidas em conteúdo prático e aplicável.
          </p>
          <p>
            Sem superficialidade. Sem teoria desnecessária. Apenas o que funciona em produção — com o
            custo, a segurança e a escala que os ambientes reais exigem.
          </p>
        </div>

        {/* DIFERENCIAL */}
        <div className="sobre-section">
          <h2>Diferencial</h2>
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

        {/* CTA FINAL */}
        <div className="sobre-cta">
          <h3>Auditoria de Arquitetura AWS</h3>
          <p>
            Identifique falhas invisíveis na sua infraestrutura antes que elas impactem custo,
            segurança ou disponibilidade.
          </p>
          <p>Minha auditoria é direta, técnica e focada em resultado.</p>
          <a
            href={`mailto:marcelo.mjgoncalves@gmail.com?subject=Auditoria%20AWS`}
            className="sobre-cta__btn"
          >
            Solicitar análise
          </a>
        </div>

      </div>

      <NewsletterCTA />
    </>
  );
}
