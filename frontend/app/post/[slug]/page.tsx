import './post.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
import ShareButtons from '@/components/ui/ShareButtons';
import BlogSidebar from '@/components/ui/BlogSidebar';
import ServiceCallout from '@/components/ui/ServiceCallout';
import NewsletterWidget from '@/components/ui/NewsletterWidget';

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

  const { post, category } = data;
  const { contentHtml, headings } = await processFullPostContent(post.conteudo_html);

  const renderFinalContent = () => {
    const parts = contentHtml.split(/(<div id="inject-.*-placeholder"><\/div>)/);

    return parts.map((part, index) => {
      if (part === '<div id="inject-service-placeholder"></div>') return null; 

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
          // ⚠️ Nota: suppressHydrationWarning é mantido por enquanto para evitar quebra de produção,
          // mas deve ser investigado na camada de processamento de HTML.
          suppressHydrationWarning={true} 
        />
      );
    });
  };

  return (
    <article> {/* 🚀 SEO Power Move: Article agora encapsula todo o contexto */}
      <CopyCodeLogic />

      <header className="article-header">
        <div className="container">
          {category ? (
            <Link 
              href={`/categoria/${category.categoria_slug}`} 
              className="post-tag-header hover:opacity-80 transition-opacity" 
              style={{ textDecoration: 'none' }}
            >              
              {category.icone_fa && <i className={`${category.icone_fa} mr-2`} aria-hidden="true"></i>}
              {category.nome_exibicao}
            </Link>
          ) : (
            <span className="post-tag">
              {post.categoria_slug || 'Artigo'}
            </span>
          )}
          
          <h1 className="article-title">{post.titulo}</h1>
          
          <div className="article-meta">
            <span><i className="fas fa-user-circle" aria-hidden="true"></i> Por Marcelo Gonçalves</span>
            <span>
                <i className="far fa-calendar-alt" aria-hidden="true"></i> 
                {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
            </span>
            <span><i className="far fa-clock" aria-hidden="true"></i> {post.tempo_leitura_min || 5} min de leitura</span>
          </div>
        </div>
      </header>

      {post.imagem_destaque_url && (
        <div className="featured-image-container">
          <Image 
            src={post.imagem_destaque_url} 
            alt={post.imagem_destaque_alt_text || ""} // Fallback vazio se for decorativa, melhor para a11y
            priority
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 960px, 960px"
            className="featured-image"
          />
        </div>
      )}

      <div className="container article-grid">
        <main className="main-content-column">
            <div className="post-body-wrapper">
                {post.resumo && (
                  <p className="post-lead">{post.resumo}</p>
                )}
                
                {headings.length > 0 && (
                    <TOC headings={headings} variant="mobile" />
                )}

                <AdsenseInArticle blockId="summary-leaderboard-728x90" variant="summary-divider" />
                
                <div className="post-content">
                  {renderFinalContent()}
                </div>
            </div>

            <footer className="post-footer-safe-zone mt-8">
                <div className="mobile-only flex flex-col gap-8 mb-8">
                  <ServiceCallout />
                  <NewsletterWidget />
                </div>
                
                <ShareButtons title={post.titulo} slug={post.slug} />
                <AuthorBox authorId={post.autor_id} /> 
                <PopularPostsSection limit={4} variant="post" /> 
            </footer>
        </main>

        <BlogSidebar adsenseBlockId="sidebar-300x600">
            {headings.length > 0 && (
                <TOC headings={headings} variant="desktop" />
            )}
            <div className="mt-8">
              <ServiceCallout />
            </div>
        </BlogSidebar>
      </div>
      
      <SuperDestaque />
    </article>
  );
}