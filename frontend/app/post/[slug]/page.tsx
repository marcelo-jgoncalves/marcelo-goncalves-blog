import './post.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Libs e Utils
import { getPost, getAuthor } from '@/lib/api';
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
  const authorData = await getAuthor(data.post.autor_id || 'marcelo-goncalves');
  const autorNome = authorData?.autor?.nome_exibicao || 'Marcelo Gonçalves';
  const autorUrl = authorData?.autor?.linkedin_url || '';

  return {
    title: `${data.post.titulo} | ${autorNome}`,
    description: data.post.resumo,
    authors: [{ name: autorNome, url: autorUrl }], 
    openGraph: {
        title: data.post.titulo,
        description: data.post.resumo,
        type: 'article',
        publishedTime: data.post.data_publicacao,
        authors: [autorNome],
        images: [
          {
            url: data.post.imagem_destaque_url,
            alt: data.post.imagem_destaque_alt_text || `Capa do artigo: ${data.post.titulo}`
          }
        ]
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

  // 🚀 ARQUITETURA: Busca o autor dinamicamente para garantir consistência em toda a página
  const authorData = await getAuthor(post.autor_id || 'marcelo-goncalves');
  const autor = authorData?.autor;
  const autorNome = autor?.nome_exibicao || 'Marcelo Gonçalves';

  // 🚀 SEO TÉCNICO: Gerando o Schema.org (JSON-LD) de "BlogPosting"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titulo,
    "description": post.resumo,
    "image": post.imagem_destaque_url ? [post.imagem_destaque_url] : [],
    "datePublished": post.data_publicacao,
    "dateModified": post.data_atualizacao || post.data_publicacao, // Crucial para SEO de frescor de conteúdo
    "author": [{
        "@type": "Person",
        "name": autorNome,
        "url": autor?.linkedin_url || autor?.github_url || "" // Conecta ao grafo de conhecimento
    }]
  };

  const renderFinalContent = () => {
    // ... [MANTENHA A SUA LÓGICA ORIGINAL DO renderFinalContent AQUI INTACTA] ...
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
          suppressHydrationWarning={true} 
        />
      );
    });
  };

  return (
    <article>
      {/* 🚀 INJEÇÃO DO SCRIPT JSON-LD: O Google vai ler isso antes de renderizar a página */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
            {/* 🚀 ZERO REGRESSÃO: Autor agora é dinâmico e consistente com a AuthorBox */}
            <span><i className="fas fa-user-circle" aria-hidden="true"></i> Por {autorNome}</span>
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
            <ServiceCallout /> 
        </BlogSidebar>
      </div>
      
      <SuperDestaque />
    </article>
  );
}