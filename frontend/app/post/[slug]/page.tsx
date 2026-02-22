/* frontend/app/post[slug]/page.tsx */ 

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

// Libs e Utils
import { getPost } from '@/lib/api';
import { processFullPostContent } from '@/lib/postUtils';

// Componentes UI
import AuthorBox from '@/components/ui/AuthorBox';
import TOC from '@/components/ui/TOC';
import SuperDestaque from '@/components/ui/SuperDestaque'; 
import AdsenseInArticle from '@/components/ui/AdsenseInArticle'; 
import PopularPostsSection from '@/components/ui/PopularPostsSection';
import CopyCodeLogic from '@/components/ui/CopyCodeLogic'; 
import ShareButtonsWrapper from '@/components/ui/ShareButtonsWrapper';
import BlogSidebar from '@/components/ui/BlogSidebar';
import ServiceCallout from '@/components/ui/ServiceCallout';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data || !data.post) return { title: 'Post não encontrado' };

  return {
    title: `${data.post.titulo} | Marcelo Gonçalves`,
    description: data.post.resumo,
    openGraph: {
        images: [data.post.imagem_destaque_url]
    }
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPost(slug);

  if (!data || !data.post) {
    notFound();
  }

  // 🚀 AQUI ESTÁ A CORREÇÃO: Extraímos a categoria do payload
  const { post, category } = data;
  const { contentHtml, headings } = await processFullPostContent(post.conteudo_html);

  const renderFinalContent = () => {
    const parts = contentHtml.split(/(<div id="inject-.*-placeholder"><\/div>)/);

    return parts.map((part, index) => {
      if (part === '<div id="inject-service-placeholder"></div>') {
        return (
          <div key="inject-service" className="lg:hidden"> 
            <ServiceCallout />
          </div>
        );
      }

      if (part === '<div id="inject-ads-placeholder"></div>') {
        return (
          <div key="inject-ads" className="my-8">
            <AdsenseInArticle blockId="post-in-article-300x250" variant="in-content" />
          </div>
        );
      }

      if (part.trim() === '') return null;

      return (
        <div 
          key={`content-part-${index}`} 
          className="post-content-part" 
          dangerouslySetInnerHTML={{ __html: part }} 
          suppressHydrationWarning={true} 
        />
      );
    });
  };

  return (
    <>
      <CopyCodeLogic />

      <section className="article-header">
        <div className="container">
          
          {/* 🚀 BADGE DINÂMICO DA CATEGORIA COM FALLBACK */}
          {category ? (
                <Link href={`/categoria/${category.categoria_slug}`} className="post-tag-header hover:opacity-80 transition-opacity" style={{ textDecoration: 'none' }}>              {category.icone_fa && <i className={`${category.icone_fa} mr-2`}></i>}
              {category.nome_exibicao}
            </Link>
          ) : (
            <span className="post-tag">
              {post.categoria_slug || 'Artigo'}
            </span>
          )}
          
          <h1 className="article-title">{post.titulo}</h1>
          <div className="article-meta">
            <span><i className="fas fa-user-circle"></i> Por Marcelo Gonçalves</span>
            <span>
                <i className="far fa-calendar-alt"></i> 
                {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
            </span>
            <span><i className="far fa-clock"></i> {post.tempo_leitura_min || 5} min de leitura</span>
          </div>
        </div>
      </section>

      {post.imagem_destaque_url && (
        <div className="featured-image-container">
          <img 
            src={post.imagem_destaque_url} 
            alt={post.imagem_destaque_alt_text || post.titulo} 
            className="featured-image"
          />
        </div>
      )}

      {/* GRID PRINCIPAL */}
      <div className="container article-grid">
        <div className="main-content-column">
            <article>
                <div className="post-body-wrapper">
                    {post.resumo && (
                      <div className="post-lead">{post.resumo}</div>
                    )}
                    
                    {headings.length > 0 && (
                        <TOC headings={headings} variant="mobile" />
                    )}

                    <AdsenseInArticle blockId="summary-leaderboard-728x90" variant="summary-divider" />
                    
                    <div className="post-content">
                      {renderFinalContent()}
                    </div>
                </div>
            </article>

            <div className="post-footer-safe-zone mt-8">
                <ShareButtonsWrapper title={post.titulo} slug={post.slug} />
                <AuthorBox authorId={post.autor_id} /> 
                <PopularPostsSection limit={4} variant="post" /> 
            </div>
        </div>

        {/* SIDEBAR (Intacta) */}
        <BlogSidebar adsenseBlockId="sidebar-300x600">
            {/* O Índice (TOC) é o único elemento dinâmico aqui */}
            {headings.length > 0 && (
                <TOC headings={headings} variant="desktop" />
            )}
        </BlogSidebar>
      </div>
      
      <SuperDestaque />
    </>
  );
}