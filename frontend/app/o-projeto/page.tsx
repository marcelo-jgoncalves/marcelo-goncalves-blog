/** frontend/app/o-projeto/page.tsx */

export const revalidate = 3600;

import React from 'react';
import type { Metadata } from 'next';
import { getProjectPosts } from "../../lib/api";
import Pagination from "../../components/ui/Pagination";
import BlogSidebar from "../../components/ui/BlogSidebar";
import ServiceCallout from "../../components/ui/ServiceCallout";
import AdSenseBanner from '@/components/ui/AdSenseBanner';
import TechRibbon from "../../components/ui/TechRibbon";
import TimelineCard from "../../components/ui/TimelineCard";
import PageHero from '@/components/ui/PageHero';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
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

const DESCRIPTION = 'Acompanhe a jornada, os desafios técnicos, custos e aprendizados de construir um blog de alta performance do zero usando IA, AWS e OpenNext.';

export const metadata: Metadata = {
  title: { absolute: `O Projeto | ${SITE_NAME}` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/o-projeto` },
  openGraph: {
    title: `O Projeto | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/o-projeto`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `O Projeto | ${SITE_NAME}`,
    description: DESCRIPTION,
    creator: AUTHOR_TWITTER,
  },
};

export default async function OProjetoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextToken     = typeof params.nextToken   === 'string' ? params.nextToken   : undefined;
  const prevTokens    = typeof params.prevTokens  === 'string' ? params.prevTokens  : '';
  const page          = typeof params.page        === 'string' ? Math.max(1, parseInt(params.page)) : 1;

  const LIMIT = 6;
  const data = await getProjectPosts(nextToken, LIMIT);
  const posts: ProjectPost[] = data?.posts || [];
  const returnedNextToken = data?.nextToken;
  const totalCount: number = data?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / LIMIT) : 0;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "O Projeto", "item": `${SITE_URL}/o-projeto` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* 1. HERO */}
      <PageHero>
        <p className="hero-eyebrow">Bastidores & Documentação</p>
        <h1 className="hero-title">
          O Projeto: Construindo um Blog <span className="accent">quase</span> 100% com IA
        </h1>
        <p className="hero-subtitle">
          Acompanhe a jornada, os desafios técnicos, os custos e os aprendizados.
        </p>
      </PageHero>

      {/* 2. TECH RIBBON */}
      <TechRibbon />

      {/* 3. MAIN LAYOUT */}
      <main className="container op-main-layout">

        {/* Coluna Esquerda: Timeline Feed */}
        <div className="main-content-column op-timeline-feed">

          {/* Banner alinhado ao topo da sidebar; oculto no mobile */}
          <AdSenseBanner hideOnMobile />

          {posts.length === 0 ? (
            <p className="op-empty-state">Nenhuma atualização do projeto publicada ainda.</p>
          ) : (
            posts.map((post, index) => (
              <React.Fragment key={post.id || post.slug}>
                <TimelineCard post={post} isPriority={index === 0} />
                {/* Banner após o 3º card */}
                {index === 2 && <AdSenseBanner />}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Coluna Direita: Sidebar */}
        <BlogSidebar>
          <ServiceCallout />
        </BlogSidebar>
      </main>

      <Pagination
        basePath="/o-projeto"
        nextToken={returnedNextToken}
        page={page}
        totalPages={totalPages}
        currentPageToken={nextToken}
        prevTokens={prevTokens}
      />

      <NewsletterCTA />
    </>
  );
}
