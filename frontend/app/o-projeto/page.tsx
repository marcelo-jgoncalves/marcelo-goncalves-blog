/** frontend/app/o-projeto/page.tsx */

export const revalidate = 3600;

import React from 'react';
import { getProjectPosts } from "../../lib/api";
import Pagination from "../../components/ui/Pagination";
import SystemStatus from "../../components/ui/SystemStatus";
import BlogSidebar from "../../components/ui/BlogSidebar";
import AdsenseInArticle from '@/components/ui/AdsenseInArticle';
import TechRibbon from "../../components/ui/TechRibbon";
import TimelineCard from "../../components/ui/TimelineCard";
import PageHero from '@/components/ui/PageHero';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import './o-projeto.css';

export interface ProjectPost {
  id?: string;
  slug: string;
  titulo: string;       
  resumo: string;       
  data_publicacao: string; 
  imagem_destaque_url?: string; 
  categoria?: {
    nome_exibicao: string;
    icone_fa?: string;
  };
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata = {
  title: 'O Projeto | Construindo um Blog com IA e Serverless',
  description: 'Acompanhe a jornada, os desafios técnicos, custos e aprendizados de construir um blog de alta performance do zero usando IA, AWS e OpenNext.',
  openGraph: {
    title: 'O Projeto | Construindo um Blog com IA',
    description: 'Acompanhe a jornada, os desafios técnicos, custos e aprendizados de construir um blog de alta performance do zero.',
    type: 'website',
  }
};

export default async function OProjetoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextToken = typeof params.nextToken === 'string' ? params.nextToken : undefined;

  const data = await getProjectPosts(nextToken);
  const posts: ProjectPost[] = data?.posts || [];
  const returnedNextToken = data?.nextToken;

  return (
    <>
      {/* 1. HERO */}
      <PageHero>
        <h1 className="hero-title">
          O Projeto: Construindo um Blog <span className="accent">quase</span> 100% com IA
        </h1>
        <p className="hero-subtitle">
          Acompanhe a jornada, os desafios técnicos, os custos e os aprendizados.
        </p>
      </PageHero>

      {/* 2. TECH RIBBON */}
      <TechRibbon />

      {/* 3. MAIN LAYOUT (Semântico) */}
      <main className="container op-main-layout">
        
        {/* Coluna Esquerda: Timeline Feed */}
        <div className="main-content-column op-timeline-feed">
          {posts.length > 0 ? (
              posts.map((post, index) => (
                <React.Fragment key={post.id || post.slug}>
                  <TimelineCard 
                    post={post} 
                    isPriority={index === 0} 
                  />
                  {/* INJEÇÃO DO ADSENSE APÓS O 4º POST */}
                  {(index === 3 || index === 7) && (
                    <div className="op-feed-ad-wrapper">
                      <AdsenseInArticle 
                        blockId={`post-in-article-300x250-${index}`}
                        variant="in-content"
                      />
                  </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className="op-empty-state">Nenhuma atualização do projeto publicada ainda.</p>
            )}

          <Pagination nextToken={returnedNextToken} basePath="/o-projeto" />
        </div>

        {/* Coluna Direita: Sidebar */}
        <BlogSidebar>
          <SystemStatus />
        </BlogSidebar>
      </main>

      <NewsletterCTA />
    </>
  );
}