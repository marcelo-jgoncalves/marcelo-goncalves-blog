import './busca.css';
import Link from 'next/link';
import { searchPosts, getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import AdSenseBanner from '@/components/ui/AdSenseBanner';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import PageHero from '@/components/ui/PageHero';
import BlogSidebar from '@/components/ui/BlogSidebar';
import ServiceCallout from '@/components/ui/ServiceCallout';

// SEO: Não indexar resultados de busca interna
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const term = params.q || 'Busca';
  return {
    title: `Resultados para "${term}" | IA Decifrada`,
    description: `Resultados da busca por ${term}.`,
    robots: 'noindex, follow',
  };
}

export const revalidate = 60;

interface BuscaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuscaPage({ searchParams }: BuscaPageProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const nextToken = typeof params.nextToken === 'string' ? params.nextToken : undefined;

  let posts = [];
  let popularPosts = [];
  let nextPageToken = undefined;

  // Busca em paralelo
  const [searchData, popularData] = await Promise.all([
    q ? searchPosts(q, nextToken) : Promise.resolve({ posts: [], nextToken: undefined }),
    getPopularPosts().catch(() => ({ posts: [] }))
  ]);

  posts = searchData.posts || [];
  nextPageToken = searchData.nextToken;
  popularPosts = popularData.posts || [];

  const hasResults = posts.length > 0;

  return (
    <>
      {hasResults ? (
        // --- CENÁRIO A: Encontrou Resultados ---
        <>
          <PageHero>
            <h1>
              Resultados para: <span className="highlight">{q}</span>
            </h1>
            <p className="search-results-subtitle">
              Encontramos estes artigos para sua pesquisa.
            </p>
          </PageHero>
          <div className="page-layout container">
            <main>
              <AdSenseBanner />
              <div className="posts-grid">
                {posts.map((post: any) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
              <Pagination nextToken={nextPageToken} basePath="/busca" />
            </main>
            <BlogSidebar>
              <ServiceCallout />
            </BlogSidebar>
          </div>
        </>
      ) : (
        // --- CENÁRIO B: Nada Encontrado (Layout de Retenção) ---
        <>
          <style dangerouslySetInnerHTML={{__html: `
            .search-icon-container { font-size: 5rem; color: var(--aws-dark); margin-bottom: 20px; position: relative; display: inline-block; }
            .search-icon-container .fa-robot { text-shadow: 3px 3px 0px rgba(59, 95, 138, 0.2); }
            .question-mark { position: absolute; top: -10px; right: -15px; font-size: 3rem; color: var(--accent); animation: float 2s ease-in-out infinite; }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            .search-hero-404 { padding: 60px 20px; text-align: center; background: linear-gradient(180deg, rgba(248,250,252,0) 0%, rgba(248,250,252,1) 100%); }
          `}} />
          <section className="search-hero-404">
            <div className="container">
              <div className="search-icon-container">
                <i className="fa-solid fa-robot fa-bounce" style={{ animationDuration: '3s', animationIterationCount: '2' }}></i>
                <i className="fa-solid fa-question question-mark"></i>
              </div>
              <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
                Oops! Ainda não escrevi sobre &ldquo;<span className="highlight">{q}</span>&rdquo;.
              </h1>
              <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto 40px', fontSize: '1.1rem' }}>
                Mas talvez este seja um ótimo tema para um futuro post. Que tal tentar um outro termo?
              </p>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form className="archive-search-bar" action="/busca" method="get">
                  <input type="text" name="q" className="search-input" placeholder="Tente buscar por 'AWS', 'RAG'..." defaultValue={q} aria-label="Buscar no blog" />
                  <button type="submit" className="search-button" aria-label="Pesquisar">
                    <i className="fas fa-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </section>
          <div className="page-layout container">
            <main>
              <div className="section-header">
                <h2>Ou comece pelos artigos mais lidos:</h2>
              </div>
              <div className="posts-grid">
                {popularPosts.length > 0 ? (
                  popularPosts.slice(0, 3).map((post: any) => (
                    <PostCard key={post.slug} post={post} />
                  ))
                ) : null}
              </div>
            </main>
            <BlogSidebar>
              <ServiceCallout />
            </BlogSidebar>
          </div>
        </>
      )}

      {/* Componente Reutilizável de Newsletter */}
      <NewsletterCTA />
    </>
  );
}