import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

// Libs e Utils
import { getPost } from '@/lib/api';
import { processPostContent, renderPostWithInjections } from '@/lib/postUtils';

// Componentes UI
import AuthorBox from '@/components/ui/AuthorBox';
import TOC from '@/components/ui/TOC';
import ServiceCallout from '@/components/ui/ServiceCallout';
import ShareButtons from '@/components/ui/ShareButtons';
import SuperDestaque from '@/components/ui/SuperDestaque'; // Componente de CTA Full-Width
import AdsenseSidebar from '@/components/ui/AdsenseSidebar';
import AdsenseInArticle from '@/components/ui/AdsenseInArticle'; 
import PopularPostsSection from '@/components/ui/PopularPostsSection'; // Componente de Populares


// ATUALIZADO (Next.js 15): params é uma Promise agora
interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Geração de Metadados SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ATUALIZADO: Aguardamos os params antes de usar
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

// 2. Componente da Página
export default async function PostPage({ params }: Props) {
  // ATUALIZADO: Aguardamos os params antes de usar
  const { slug } = await params;

  // Busca dados na API
  const data = await getPost(slug);

  if (!data || !data.post) {
    notFound();
  }

  const { post } = data;

  // Processa o HTML para gerar IDs e extrair Títulos
  const { modifiedHtml, headings } = processPostContent(post.conteudo_html);

  // Prepara os componentes para injeção 
  const injections = {
    ServiceComponent: <ServiceCallout />,
    
    // CORREÇÃO DE INJEÇÃO: Passamos o componente AdsenseInArticle (in-content)
    AdSenseComponent: <AdsenseInArticle blockId="post-in-article-300x250" variant="in-content" />,
  };

  const renderedContent = renderPostWithInjections(modifiedHtml, injections);

  return (
    <>
      {/* --- HEADER DO ARTIGO (Hero) --- */}
      <section className="article-header">
        <div className="container">
          {/* Tag / Categoria */}
          <span className="post-tag">
             {post.categoria_slug || 'Artigo'}
          </span>

          <h1 className="article-title">{post.titulo}</h1>

          {/* Meta Dados */}
          <div className="article-meta">
            <span><i className="fas fa-user-circle"></i> Por Marcelo Gonçalves</span>
            <span>
                <i className="far fa-calendar-alt"></i> 
                {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
            </span>
            <span><i className="far fa-clock"></i> {post.tempo_leitura_min} min de leitura</span>
          </div>
        </div>
      </section>

      {/* --- IMAGEM DE DESTAQUE --- */}
      {post.imagem_destaque_url && (
        <div className="featured-image-container">
          <img 
            src={post.imagem_destaque_url} 
            alt={post.imagem_destaque_alt_text || post.titulo} 
            className="featured-image"
          />
        </div>
      )}

      {/* --- GRID PRINCIPAL (Conteúdo + Sidebar) --- */}
      <div className="article-grid">
        
        {/* COLUNA ESQUERDA: Conteúdo do Post */}
        <article>
            <div className="post-body-wrapper">
                
                {/* 1. RESUMO/LEAD */}
                {/* O .post-lead AGORA NÃO TEM MAIS BORDA INFERIOR NO CSS */}
                {post.resumo && (
                  <p className="post-lead">
                    {post.resumo}
                  </p>
                )}
                
                {/* 2. CORREÇÃO DE POSIÇÃO: TOC MOBILE APARECE AQUI, APÓS O RESUMO */}
                {headings.length > 0 && (
                    <TOC headings={headings} variant="mobile" />
                )}

                {/* 3. INJEÇÃO DO BANNER HORIZONTAL E LINHA DIVISÓRIA */}
                {/* Usa a variante 'summary-divider' para renderizar o banner 728x90 */}
                <AdsenseInArticle blockId="summary-leaderboard-728x90" variant="summary-divider" />
                
                {/* 4. CONTEÚDO PRINCIPAL */}
                <div className="post-content">
                    {renderedContent}
                </div>

            </div>
            
            {/* 5. SHARE BUTTONS E AUTHOR BOX */}
            <ShareButtons title={post.titulo} slug={post.slug} />
            <AuthorBox authorId={post.autor_id} /> 
            
            {/* 6. SEÇÃO POPULARES: Limitado a 4 cards e layout de 2 colunas */}
            <PopularPostsSection limit={4} variant="post" /> 
            
        </article>

        {/* COLUNA DIREITA: Sidebar (Desktop Only via CSS) */}
        <aside className="sidebar">
            <div className="sticky-wrapper">
                
                {/* Widget 1: Índice Desktop */}
                <TOC headings={headings} variant="desktop" />

                {/* Widget 2: CTA Serviços Desktop */}
                <ServiceCallout />

                {/* Widget 3: AdSense Vertical (AGORA USANDO O COMPONENTE) */}
                <AdsenseSidebar blockId="sidebar-300x600" />

                {/* Widget 4: Newsletter */}
                <div className="sidebar-widget widget-newsletter">
                    <div className="card-icon-wrapper">
                        <i className="far fa-envelope"></i>
                    </div>
                    <span className="card-title">Newsletter VIP</span>
                    <p className="card-desc">Receba análises exclusivas de IA e AWS direto no seu e-mail.</p>
                    <Link href="/newsletter" className="btn-full btn-primary">
                        Inscrever-se
                    </Link>
                </div>

            </div>
        </aside>

      </div>
      
      {/* --- CTA DO PROJETO (Super Destaque) --- */}
      {/* POSIÇÃO CORRIGIDA: FORA DO article-grid para ocupar a largura total (full-width) */}
      <SuperDestaque />

    </>
  );
}