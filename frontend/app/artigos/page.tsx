/* frontend/app/artigos/page.tsx */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import AdSenseBanner from '@/components/ui/AdSenseBanner';
import PageHero from '@/components/ui/PageHero';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
import './artigos.css';

const DESCRIPTION = 'Explore o arquivo completo de tutoriais AWS, análises de IA generativa e engenharia de software.';

export const metadata: Metadata = {
  title: { absolute: `Todos os Artigos | ${SITE_NAME}` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/artigos` },
  openGraph: {
    title: `Todos os Artigos | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/artigos`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Todos os Artigos | ${SITE_NAME}`,
    description: DESCRIPTION,
    creator: AUTHOR_TWITTER,
  },
};

export const revalidate = 300;

interface ArtigosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LIMIT = 12;

export default async function ArtigosPage({ searchParams }: ArtigosPageProps) {
  const params = await searchParams;
  const nextToken    = typeof params.nextToken    === 'string' ? params.nextToken    : undefined;
  const prevTokens   = typeof params.prevTokens   === 'string' ? params.prevTokens   : '';
  const page         = typeof params.page         === 'string' ? Math.max(1, parseInt(params.page)) : 1;

  let posts: any[] = [];
  let nextPageToken: string | undefined;
  let totalCount = 0;

  try {
    const data = await getAllPosts(nextToken, LIMIT);
    posts         = data?.posts      || [];
    nextPageToken = data?.nextToken  ?? undefined;
    totalCount    = data?.totalCount ?? 0;
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
  }

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / LIMIT) : 0;

  const firstHalf  = posts.slice(0, 6);
  const secondHalf = posts.slice(6);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Artigos", "item": `${SITE_URL}/artigos` },
    ],
  };

  return (
    <div className="op-artigos-layout-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* 1. HERO */}
      <PageHero as="header">
        <h1 className="op-hero-title">Explore Nossos Artigos</h1>

        <p className="op-hero-desc">
          Conteúdo prático sobre AWS, Serverless, DevOps e Arquitetura de Nuvem
          para profissionais que querem construir soluções modernas.
        </p>

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

        <nav className="op-hero-tags" aria-label="Filtrar por categoria">
          <Link href="/categoria/inteligencia-artificial" className="op-hero-tag">IA Generativa</Link>
          <Link href="/categoria/cloud-computing"         className="op-hero-tag">AWS & Cloud</Link>
          <Link href="/categoria/devops-automacao"        className="op-hero-tag">DevOps</Link>
          <Link href="/categoria/seguranca-na-nuvem"      className="op-hero-tag">Segurança</Link>
          <Link href="/categoria/engenharia-de-software"  className="op-hero-tag">Engenharia</Link>
        </nav>
      </PageHero>

      {/* 2. MAIN LAYOUT */}
      <div className="page-layout container">
        <main className="op-articles-feed" aria-label="Lista de artigos de engenharia">

          {/* Banner após hero; oculto no mobile */}
          <AdSenseBanner hideOnMobile />

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

        </main>

      </div>

      <Pagination
        basePath="/artigos"
        page={page}
        totalPages={totalPages}
        nextToken={nextPageToken}
        currentPageToken={nextToken}
        prevTokens={prevTokens}
      />

      <NewsletterCTA />
    </div>
  );
}
