/* frontend/app/artigos/page.tsx */

import { getAllPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import BlogSidebar from '@/components/ui/BlogSidebar';
import AdSenseBanner from '@/components/ui/AdSenseBanner';
import ServiceCallout from '@/components/ui/ServiceCallout';
import PageHero from '@/components/ui/PageHero';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import './artigos.css';

export const metadata = {
  title: 'Todos os Artigos | IA Decifrada',
  description: 'Explore nosso arquivo completo de tutoriais AWS, análises de IA e engenharia de software.',
};

export const revalidate = 300;

interface ArtigosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArtigosPage({ searchParams }: ArtigosPageProps) {
  const params = await searchParams;
  const nextToken = typeof params.nextToken === 'string' ? params.nextToken : undefined;

  let posts: any[] = [];
  let nextPageToken = undefined;

  try {
    const data = await getAllPosts(nextToken, 12);
    posts = data?.posts || [];
    nextPageToken = data?.nextToken;
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
  }

  const firstHalf  = posts.slice(0, 6);
  const secondHalf = posts.slice(6);

  return (
    <div className="op-artigos-layout-root">

      {/* 1. HERO */}
      <PageHero as="header">
        <h1 className="op-hero-title">Explore Nossos Artigos</h1>
        <form className="op-search-form" action="/busca" method="get" role="search">
          <input
            type="search"
            name="q"
            className="op-search-input"
            placeholder="Buscar por AWS, Terraform, RAG..."
            aria-label="Buscar artigos"
            required
          />
          <button type="submit" className="op-search-btn" aria-label="Pesquisar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>
      </PageHero>

      {/* 2. MAIN LAYOUT */}
      <div className="page-layout container">
        <main className="op-articles-feed" aria-label="Lista de artigos de engenharia">

          {/* Banner após hero */}
          <AdSenseBanner />

          {posts.length === 0 ? (
            <p className="op-empty-message">Nenhum artigo encontrado no momento.</p>
          ) : (
            <>
              {/* 1º grupo: pares 1–3 */}
              <div className="op-posts-grid">
                {firstHalf.map((post: any) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>

              {/* Banner após 3º par */}
              <AdSenseBanner />

              {/* 2º grupo: pares 4–6 */}
              {secondHalf.length > 0 && (
                <div className="op-posts-grid">
                  {secondHalf.map((post: any) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}

          <Pagination nextToken={nextPageToken} basePath="/artigos" />
        </main>

        <BlogSidebar adsenseBlockId="artigos-sidebar-primary">
          <ServiceCallout />
        </BlogSidebar>
      </div>

      <NewsletterCTA />
    </div>
  );
}
