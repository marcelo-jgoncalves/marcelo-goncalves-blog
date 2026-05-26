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
import TOC from '@/components/ui/TOC';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import AdsenseInArticle from '@/components/ui/AdsenseInArticle';
import RelatedPostsSection from '@/components/ui/RelatedPostsSection';
import CopyCodeLogic from '@/components/ui/CopyCodeLogic';
import BlogSidebar from '@/components/ui/BlogSidebar';
import ServiceCallout from '@/components/ui/ServiceCallout';
import NewsletterWidget from '@/components/ui/NewsletterWidget';
import NewsletterSidebarWidget from '@/components/ui/NewsletterSidebarWidget';
import PostFooter from '@/components/post/PostFooter';

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
              className="post-tag-header"
            >
              {category.icone_fa && <i className={`${category.icone_fa}`} aria-hidden="true" />}
              {category.nome_exibicao}
            </Link>
          ) : (
            <Link href={`/categoria/${post.categoria_slug}`} className="post-tag">
              {post.categoria_slug || 'Artigo'}
            </Link>
          )}

          <h1 className="article-title">{post.titulo}</h1>

          <div className="article-meta">
            <span><i className="fas fa-user-circle" aria-hidden="true" /> Por <span className="meta-author-name">{autorNome}</span></span>
            <span>
              <i className="far fa-calendar-alt" aria-hidden="true" />
              <time dateTime={post.data_publicacao} className="meta-date">
                {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
              </time>
            </span>
            <span><i className="far fa-clock" aria-hidden="true" /> <span className="meta-time">{post.tempo_leitura_min || 5} min de leitura</span></span>
          </div>
        </div>

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
      </header>

      <div className="container article-grid">
        <main className="main-content-column">
            <div className="post-body-wrapper">
                {post.resumo && (
                  <div className="post-intro-card">
                    <div className="eyebrow" style={{ color: 'var(--accent)' }}>Introdução</div>
                    <p className="post-lead">{post.resumo}</p>
                  </div>
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

                <PostFooter
                  author={{
                    name: autorNome,
                    bio: autor?.bio || 'é Engenheiro Cloud especialista em AWS e DevOps.',
                    avatarInitials: 'MG',
                    profileUrl: '/sobre',
                  }}
                  shareUrls={{
                    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`,
                    twitter: `https://x.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.titulo)}`,
                    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${post.titulo} - ${canonicalUrl}`)}`,
                    currentPageUrl: canonicalUrl,
                  }}
                />
                <RelatedPostsSection />
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
            <NewsletterSidebarWidget />
            <ServiceCallout />
        </BlogSidebar>
      </div>

      <NewsletterCTA />
    </article>
  );
}