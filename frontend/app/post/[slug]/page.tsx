import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// Libs e Utils
import { getPost } from '@/lib/api';
import { processFullPostContent } from '@/lib/postUtils';

// Componentes UI
import AuthorBox from '@/components/ui/AuthorBox';
import TOC from '@/components/ui/TOC';
import ServiceCallout from '@/components/ui/ServiceCallout';
import ShareButtons from '@/components/ui/ShareButtons';
import SuperDestaque from '@/components/ui/SuperDestaque'; 
import AdsenseSidebar from '@/components/ui/AdsenseSidebar';
import AdsenseInArticle from '@/components/ui/AdsenseInArticle'; 
import PopularPostsSection from '@/components/ui/PopularPostsSection';
import CopyCodeLogic from '@/components/ui/CopyCodeLogic'; // Ativa o JS de cópia no cliente

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * 1. GERAÇÃO DE METADADOS SEO
 * Executado no servidor para garantir crawlers e redes sociais recebam as tags corretas.
 */
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

/**
 * 2. COMPONENTE PRINCIPAL DA PÁGINA (Server Component)
 */
export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  // Busca dados na API (AWS Lambda via API Gateway)
  const data = await getPost(slug);

  if (!data || !data.post) {
    notFound();
  }

  const { post } = data;

  /**
   * PIPELINE DE PROCESSAMENTO (Server-Side)
   * Realiza Syntax Highlighting (Shiki), extrai IDs para o TOC
   * e prepara placeholders para injeção de componentes.
   */
  const { contentHtml, headings } = await processFullPostContent(post.conteudo_html);

  /**
   * FUNÇÃO DE RENDERIZAÇÃO DE CONTEÚDO
   * Converte a string HTML processada em elementos React,
   * substituindo marcadores específicos por componentes interativos.
   */
  const renderFinalContent = () => {
    // Divide a string nos pontos onde existem placeholders de injeção
    const parts = contentHtml.split(/(<div id="inject-.*-placeholder"><\/div>)/);

    return parts.map((part, index) => {
      // Injeção dinâmica do Callout de Serviços (Mobile Only via CSS)
      if (part === '<div id="inject-service-placeholder"></div>') {
        return (
          <div key="inject-service" className="mobile-only-injection"> 
            <ServiceCallout />
          </div>
        );
      }

      // Injeção dinâmica de AdSense no meio do texto
      if (part === '<div id="inject-ads-placeholder"></div>') {
        return (
          <div key="inject-ads" className="my-8">
            <AdsenseInArticle blockId="post-in-article-300x250" variant="in-content" />
          </div>
        );
      }

      // Ignora partes vazias resultantes do split por Regex
      if (part.trim() === '') return null;

      // Renderiza o bloco de HTML (incluindo o código colorido pelo Shiki)
      return <div key={`content-part-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return (
    <>
      {/* Adiciona a lógica de interatividade para os botões "Copiar" nos blocos de código */}
      <CopyCodeLogic />

      {/* --- HEADER DO ARTIGO (Hero Section) --- */}
      <section className="article-header">
        <div className="container">
          <span className="post-tag">
             {post.categoria_slug || 'Artigo'}
          </span>

          <h1 className="article-title">{post.titulo}</h1>

          {/* Meta informações do post */}
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
        <div className="featured-image-container" style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          <Image
            src={post.imagem_destaque_url}
            alt={post.imagem_destaque_alt_text || post.titulo}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ objectFit: 'cover' }}
            className="featured-image"
          />
        </div>
      )}

      {/* --- GRID PRINCIPAL (Conteúdo + Sidebar) --- */}
      <div className="article-grid">
        
        <article>
            <div className="post-body-wrapper">
                
                {/* Lead/Resumo do post */}
                {post.resumo && (
                  <p className="post-lead">{post.resumo}</p>
                )}
                
                {/* Sumário para navegação Mobile */}
                {headings.length > 0 && (
                    <TOC headings={headings} variant="mobile" />
                )}

                {/* Banner de Anúncio superior */}
                <AdsenseInArticle blockId="summary-leaderboard-728x90" variant="summary-divider" />
                
                {/* Renderização do conteúdo principal processado */}
                <div className="post-content">
                    {renderFinalContent()}
                </div>

            </div>
            
            {/* Elementos de rodapé do artigo */}
            <ShareButtons title={post.titulo} slug={post.slug} />
            <AuthorBox authorId={post.autor_id} /> 
            
            {/* Seção de posts sugeridos */}
            <PopularPostsSection limit={4} variant="post" /> 
            
        </article>

        {/* --- SIDEBAR (Desktop) --- */}
        <aside className="sidebar">
            <div className="sticky-wrapper">
                {/* Sumário para Desktop */}
                <TOC headings={headings} variant="desktop" />
                
                {/* Callout de Serviços */}
                <ServiceCallout />
                
                {/* Anúncio Vertical da Sidebar */}
                <AdsenseSidebar blockId="sidebar-300x600" />

                {/* Widget de Newsletter */}
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
      
      {/* Seção de destaque final (Call to Action global) */}
      <SuperDestaque />
    </>
  );
}