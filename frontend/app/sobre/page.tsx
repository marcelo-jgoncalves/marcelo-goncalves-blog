import './sobre.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { getAuthor } from '@/lib/api';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import PageHero from '@/components/ui/PageHero';
import PageCTA from '@/components/ui/PageCTA';
import AvatarImage from '@/components/ui/AvatarImage';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const FALLBACK_DESC = 'Conheça Marcelo Gonçalves, especialista em AWS com mais de 8 anos de experiência, Mestre em Linguística e criador do blog.';

const FORMACAO = [
  {
    icon: 'fa-graduation-cap',
    titulo: 'Licenciatura em Letras',
    descricao: 'Base acadêmica em linguagem, comunicação e análise textual — a fundação da minha forma de pensar e ensinar.',
  },
  {
    icon: 'fa-microscope',
    titulo: 'Mestrado em Linguística',
    descricao: 'Pesquisa aprofundada em linguagem e cognição, com foco na estrutura dos sistemas complexos de comunicação.',
  },
  {
    icon: 'fa-chalkboard',
    titulo: '15+ Anos como Professor',
    descricao: 'Ensinar é traduzir o complexo em simples — habilidade central em tudo que faço, do código ao artigo.',
  },
];

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

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.nome_exibicao || 'Marcelo Gonçalves',
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
          Minha missão é provar que a união da experiência humana em engenharia e linguística com o poder da IA pode criar conteúdo técnico de valor inigualável.
        </p>
      </PageHero>

      {/* 2. Bio — fullwidth, sem sidebar */}
      <section className="sobre-bio">
        <div className="sobre-bio__inner container">
          <div className="sobre-bio__avatar" aria-label="Foto de Marcelo Gonçalves">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={author.nome_exibicao || 'Marcelo Gonçalves'} />
            ) : (
              <div className="sobre-bio__avatar-placeholder">
                <i className="fa-solid fa-user" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="sobre-bio__content">
            <h2>Meu Nome é {author.nome_exibicao || 'Marcelo Gonçalves'}</h2>

            <p>
              Eu sou, acima de tudo, um apaixonado por duas áreas que parecem distantes, mas que hoje definem o nosso futuro: <b>sistemas complexos e linguagem.</b>
            </p>
            <p>
              Minha carreira técnica foi construída sobre uma base de mais de 8 anos como especialista em nuvem. Meu foco sempre foi a <b>automação e a criação de arquiteturas escaláveis na AWS</b>. Tive o privilégio de desenhar e implementar soluções robustas para empresas globais como a <b>Accenture</b> e líderes de tecnologia como <b>Anynines</b> e <b>Credisis</b>. Como engenheiro, minha paixão é construir sistemas que funcionam, que escalam e que são seguros.
            </p>
            <p>
              Mas minha jornada não começou na engenharia. Muito antes de escrever minha primeira linha de Terraform, eu já era <b>professor (uma paixão que exerço há mais de 15 anos)</b> e um acadêmico da palavra. Sou <b>formado em Letras</b> e possuo um <b>Mestrado em Linguística</b>.
            </p>
            <p>
              Este blog nasceu no exato momento em que minhas duas paixões colidiram. Sou o especialista em AWS que entende de arquitetura <i>e</i> o linguista que entende a fundação por trás dos modelos — o professor que pode, de fato, &quot;decifrar&quot; os tópicos mais complexos.
            </p>

            <div className="sobre-bio__social">
              <a href={linkedinUrl} title="LinkedIn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" aria-hidden="true" />
              </a>
              <a href={githubUrl} title="GitHub" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Formação — cards estilo category card, lado a lado */}
      <section className="sobre-formacao">
        <div className="container">
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
      </section>

      {/* 4. Certificações AWS — Credly badges oficiais */}
      <section className="sobre-certs">
        <div className="container">
          <h2 className="sobre-section-title">Certificações AWS</h2>
          <div className="sobre-certs-grid">
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
        </div>
        <Script src="https://cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
      </section>

      {/* 5. CTA para serviços */}
      <PageCTA
        title="Vamos trabalhar juntos?"
        body="Agende uma chamada inicial de 30 minutos. Sem custo, sem compromisso — só clareza sobre como posso ajudar."
        linkHref="/servicos"
        linkText="Ver Serviços de Consultoria →"
      />

      {/* 6. Newsletter */}
      <NewsletterCTA />
    </>
  );
}
