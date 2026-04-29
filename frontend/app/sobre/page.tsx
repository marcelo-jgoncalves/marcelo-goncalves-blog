import './sobre.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAuthor, getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import PageHero from '@/components/ui/PageHero';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const FALLBACK_DESC = 'Conheça Marcelo Gonçalves, especialista em AWS com mais de 8 anos de experiência, Mestre em Linguística e criador do blog IA Decifrada.';

export async function generateMetadata(): Promise<Metadata> {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const autor = authorData?.autor;
  const nome = autor?.nome_exibicao || 'Marcelo Gonçalves';
  const desc = autor?.bio ? autor.bio.substring(0, 160) : FALLBACK_DESC;
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
  const [authorData, popularData] = await Promise.all([
    getAuthor(AUTOR_ID).catch(() => null),
    getPopularPosts().catch(() => ({ posts: [] })),
  ]);

  // Dados do Autor (API)
  const author = authorData?.autor || {};
  const popularPosts = popularData.posts || [];

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

      {/* 1. Hero da Missão */}
      <PageHero>
        <h1 className="hero-title">
          Sobre Mim e <span className="highlight">O Projeto</span>
        </h1>
        <p className="hero-subtitle">
          Minha missão é provar que a união da experiência humana em engenharia e linguística com o poder da IA pode criar conteúdo técnico de valor inigualável.
        </p>
      </PageHero>

      {/* 2. Biografia (Texto Longo Fixo + Dados API) */}
      <section className="container">
        <div className="bio-section">
          
          {/* Avatar (Vem da API) */}
          <div className="bio-avatar" aria-label="Foto de Marcelo Gonçalves">
            {avatarUrl ? (
                <img src={avatarUrl} alt={author.nome_exibicao || "Marcelo Gonçalves"} />
            ) : (
                <i className="fa-solid fa-user" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            )}
          </div>
          
          <div className="bio-content">
            <h2>Meu Nome é {author.nome_exibicao || "Marcelo Gonçalves"}</h2>
            
            {/* CORREÇÃO: Texto fixo conforme o protótipo v1.3.
                Isso garante que a história completa apareça, ignorando a bio curta do banco de dados.
            */}
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
              Este blog nasceu no exato momento em que minhas duas paixões colidiram. Hoje, o mundo da tecnologia é dominado por &quot;Modelos de Linguagem&quot; (LLMs). Eu percebi que não era apenas um engenheiro que sabia automatizar sistemas. Eu era a ponte. Sou o especialista em AWS que entende de arquitetura <i>e</i> o linguista que entende a fundação por trás dos modelos. Sou o professor que pode, de fato, &quot;decifrar&quot; os tópicos mais complexos.
            </p>

            {/* Redes Sociais (Vêm da API) */}
            <div className="bio-social-links">
                <a href={linkedinUrl} title="LinkedIn" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                <a href={githubUrl} title="GitHub" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
            </div>
          </div>

          {/* 3. CTA de Serviços Integrado na Bio */}
          <div className="bio-cta-section">
             <h3>Vamos Trabalhar Juntos?</h3>
             <p>Precisa de ajuda com a sua arquitetura AWS e automação?</p>
             <Link href="/servicos" className="btn-outline-dark">
                Veja Meus Serviços de Consultoria
             </Link>
          </div>

        </div>
      </section>

      {/* 4. História do Blog (Super Destaque) */}
      <section className="super-destaque">
        <div className="container">
            <h2>Por que &quot;<span className="highlight">quase</span>&quot; 100% com IA?</h2>
            <p>
                Este projeto é minha prova de que a IA é uma ferramenta poderosa, mas a direção, a experiência e a curadoria humana são o que garantem a qualidade. Acompanhe a jornada onde documento exatamente o que a IA fez bem e onde eu, como engenheiro e linguista, tive que assumir o controle.
            </p>
            <Link href="/o-projeto" className="btn btn-primary">
                Acompanhe a jornada aqui &rarr;
            </Link>
        </div>
      </section>

      {/* 5. Populares */}
      <section className="container" style={{ padding: '60px 20px', backgroundColor: '#fdfdfd' }}>
        <div className="section-header">
            <h2>Comece por aqui</h2>
            <p>Meus artigos mais populares</p>
        </div>
        <div className="posts-grid">
            {popularPosts.length > 0 ? (
                popularPosts.slice(0, 3).map((post: any) => (
                    <PostCard key={post.slug} post={post} />
                ))
            ) : (
                <p className="text-center w-full text-gray-500">Carregando sugestões...</p>
            )}
        </div>
      </section>

      {/* 6. CTA Newsletter */}
      <NewsletterCTA />
    </>
  );
}