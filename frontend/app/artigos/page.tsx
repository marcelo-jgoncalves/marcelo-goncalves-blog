/* frontend/app/artigos/artigos.tsx */


import { getAllPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import BlogSidebar from '@/components/ui/BlogSidebar';
import AdsenseInArticle from '@/components/ui/AdsenseInArticle';
import ServiceCallout from '@/components/ui/ServiceCallout';
import PageHero from '@/components/ui/PageHero';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import React from 'react';
import './artigos.css';

export const metadata = {
  title: 'Todos os Artigos | IA Decifrada',
  description: 'Explore nosso arquivo completo de tutoriais AWS, análises de IA e engenharia de software.',
};

// ISR: Revalidação a cada 60 segundos para performance serverless na AWS
export const revalidate = 60;

interface ArtigosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArtigosPage({ searchParams }: ArtigosPageProps) {
  const params = await searchParams;
  const nextToken = typeof params.nextToken === 'string' ? params.nextToken : undefined;

  let posts = [];
  let nextPageToken = undefined;

  try {
    const data = await getAllPosts(nextToken);
    posts = data?.posts || [];
    nextPageToken = data?.nextToken;
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
  }

  return (
    <div className="op-artigos-layout-root">
      {/* 1. HERO SECTION */}
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </PageHero>

      {/* 2. MAIN LAYOUT - Grid Editorial + Sidebar */}
      <div className="page-layout container">
        <main className="op-articles-feed" aria-label="Lista de artigos de engenharia">
          
          <div className="op-posts-grid">
            {posts.length > 0 ? (
              posts.map((post: any, index: number) => (
                <React.Fragment key={post.slug}>
                  <PostCard post={post} />
                  
                  {/* Injeção Estratégica Anti-Buraco: Após o 4º e 8º card */}
                  {(index === 3 || index === 7) && (
                    <div className="op-in-grid-ad">
                      <AdsenseInArticle 
                        blockId={`list-feed-ad-${index}`} 
                        variant="in-content"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className="op-empty-message">Nenhum artigo encontrado no momento.</p>
            )}
          </div>
          
          <Pagination nextToken={nextPageToken} basePath="/artigos" />
        </main>

        {/* SIDEBAR - ServiceCallout em 1º lugar (CRO) */}
        <BlogSidebar adsenseBlockId="artigos-sidebar-primary">
            <ServiceCallout />
        </BlogSidebar>
      </div>

      <NewsletterCTA />
    </div>
  );
}