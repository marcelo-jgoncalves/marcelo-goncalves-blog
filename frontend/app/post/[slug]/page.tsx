import './post.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { getPost, getAuthor } from '@/lib/api';
import { processFullPostContent } from '@/lib/postUtils';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

// Componentes UI
import AuthorBox from '@/components/ui/AuthorBox';
import TOC from '@/components/ui/TOC';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import AdsenseInArticle from '@/components/ui/AdsenseInArticle'; 
import PopularPostsSection from '@/components/ui/PopularPostsSection';
import CopyCodeLogic from '@/components/ui/CopyCodeLogic'; 
import ShareButtons from '@/components/ui/ShareButtons';
import BlogSidebar from '@/components/ui/BlogSidebar';
import ServiceCallout from '@/components/ui/ServiceCallout';
import NewsletterWidget from '@/components/ui/NewsletterWidget';

export const revalidate = 60;

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

  const canonicalUrl = `${SITE_URL}/post/${data.post.slug}`;

  return {
    title: { absolute: `${data.post.titulo} | ${autorNome}` },
    description: data.post.resumo,
    authors: [{ name: autorNome, url: autorUrl }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: data.post.titulo,
      description: data.post.resumo,
      url: canonicalUrl,
      type: 'article',
      publishedTime: data.post.data_publicacao,
      modifiedTime: data.post.data_atualizacao || data.post.data_publicacao,
      authors: [autorNome],
      siteName: SITE_NAME,
      locale: 'pt_BR',
      ...(data.post.imagem_destaque_url && {
        images: [
          {
            url: data.post.imagem_destaque_url,
            width: 1200,
            height: 630,
            alt: data.post.imagem_destaque_alt_text || `Capa do artigo: ${data.post.titulo}`,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: data.post.titulo,
      description: data.post.resumo,
      creator: AUTHOR_TWITTER,
    },
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

  const canonicalUrl = `${SITE_URL}/post/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titulo,
    "description": post.resumo,
    "image": post.imagem_destaque_url ? [post.imagem_destaque_url] : [],
    "datePublished": post.data_publicacao,
    "dateModified": post.data_atualizacao || post.data_publicacao,
    "url": canonicalUrl,
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "author": [{
      "@type": "Person",
      "name": autorNome,
      "url": autor?.linkedin_url || autor?.github_url || "",
    }],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Artigos", "item": `${SITE_URL}/artigos` },
      ...(post.categoria_slug ? [{
        "@type": "ListItem",
        "position": 3,
        "name": category?.nome_exibicao || post.categoria_slug,
        "item": `${SITE_URL}/categoria/${post.categoria_slug}`,
      }] : []),
      { "@type": "ListItem", "position": post.categoria_slug ? 4 : 3, "name": post.titulo, "item": canonicalUrl },
    ],
  };

  const renderFinalContent = () => {
    // ... [MANTENHA A SUA LÓGICA ORIGINAL DO renderFinalContent AQUI INTACTA] ...
    const parts = contentHtml.split(/(<div id="inject-.*-placeholder"><\/div>)/);

    return parts.map((part, index) => {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      
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
                <time dateTime={post.data_publicacao}>
                  {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
                </time>
            </span>
            <span><i className="far fa-clock" aria-hidden="true"></i> {post.tempo_leitura_min || 5} min de leitura</span>
          </div>
        </div>
      </header>

      {post.imagem_destaque_url && (
        <div className="featured-image-container">
          <ResponsiveImage
            src={post.imagem_destaque_url}
            alt={post.imagem_destaque_alt_text || post.titulo}
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
                <div className="post-mobile-extras">
                  <ServiceCallout />
                  <NewsletterWidget />
                </div>
                
                <ShareButtons title={post.titulo} slug={post.slug} />
                <AuthorBox authorId={post.autor_id} /> 
                <PopularPostsSection limit={4} variant="post" /> 
            </footer>
        </main>

        <BlogSidebar
            adsenseBlockId="sidebar-300x600"
            showNewsletter={false}
            showProjeto={true}
        >
            {headings.length > 0 && (
                <TOC headings={headings} variant="desktop" />
            )}
            <ServiceCallout />
        </BlogSidebar>
      </div>
      
      <NewsletterCTA />
    </article>
  );
}