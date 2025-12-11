import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react'; // Adicionado para uso em JSX

// Libs e Utils
import { getPost } from '@/lib/api';
import { processPostContent, renderPostWithInjections } from '@/lib/postUtils';

// Componentes UI
import AuthorBox from '@/components/ui/AuthorBox';
import TOC from '@/components/ui/TOC'; // Importação única e correta
import ServiceCallout from '@/components/ui/ServiceCallout';
import ShareButtons from '@/components/ui/ShareButtons';
// A importação de TOC duplicada foi removida

// Placeholder para o AdSense (necessário para a injeção)
const AdSensePlaceholder = () => (
  <div className="adsense-vertical" style={{ height: '250px', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
    <span className="text-sm font-medium">[PUBLICIDADE IN-ARTICLE]</span>
  </div>
);

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

  // Prepara os componentes para injeção (AGORA SÓ COM INJEÇÕES DE CONTEÚDO)
  const injections = {
    ServiceComponent: <ServiceCallout />,
    AdSenseComponent: <AdSensePlaceholder />,
    // O TOC Component foi removido daqui e será renderizado diretamente abaixo do resumo
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
                {post.resumo && (
                  <p className="post-lead">
                    {post.resumo}
                  </p>
                )}
                
                {/* 2. CORREÇÃO DE POSIÇÃO: TOC MOBILE APARECE AQUI, APÓS O RESUMO */}
                {headings.length > 0 && (
                    <TOC headings={headings} variant="mobile" />
                )}

                {/* 3. CONTEÚDO PRINCIPAL */}
                <div className="post-content">
                    {renderedContent}
                </div>

            </div>
            
            <ShareButtons title={post.titulo} slug={post.slug} />
            <AuthorBox authorId={post.autor_id} /> 
        </article>

        {/* COLUNA DIREITA: Sidebar (Desktop Only via CSS) */}
        <aside className="sidebar">
            <div className="sticky-wrapper">
                
                {/* Widget 1: Índice Desktop */}
                <TOC headings={headings} variant="desktop" />

                {/* Widget 2: CTA Serviços Desktop */}
                <ServiceCallout />

                {/* Widget 3: AdSense Vertical */}
                <div className="sidebar-widget" style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
                    <div className="adsense-vertical">
                        [ADSENSE VERTICAL]
                    </div>
                </div>

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

      {/* --- SUPER CTA (Final da Página) --- */}
      <section className="cta">
        <div className="container">
            <h2>Quer se aprofundar em IA, AWS e DevOps?</h2>
            <p>Inscreva-se na nossa newsletter e receba análises exclusivas e os melhores artigos da semana.</p>
            <Link href="/newsletter" className="btn btn-outline">
                Inscrever-se agora
            </Link>
        </div>
      </section>
    </>
  );
}