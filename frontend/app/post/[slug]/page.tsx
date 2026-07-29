import './post.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { getPost, getAuthor, getAllPosts } from '@/lib/api';
import { processFullPostContent } from '@/lib/postUtils';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER, AUTHOR_LINKEDIN_URL, AUTHOR_GITHUB_URL } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import Breadcrumb from '@/components/ui/Breadcrumb';
import AdsenseInArticle from '@/components/ui/AdsenseInArticle';
import RelatedPostsSection from '@/components/ui/RelatedPostsSection';
import CopyCodeLogic from '@/components/ui/CopyCodeLogic';
import PostFooter from '@/components/post/PostFooter';
import ShareRail from '@/components/post/ShareRail';
import TableOfContents from '@/components/post/TableOfContents';

export const revalidate = 60;

// Without this, the [slug] route never enters Next.js's ISR system — the
// `revalidate` above becomes a silent no-op and every post page renders
// via pure SSR on every request (CloudFront never caches, Cache-Control
// becomes no-store). Confirmed in production: dynamicRoutes was empty in
// prerender-manifest.json before this fix.
export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  let nextToken: string | undefined;

  do {
    const data = await getAllPosts(nextToken, 100).catch(() => null);
    if (!data?.posts?.length) break;
    slugs.push(...data.posts.map((post: { slug: string }) => ({ slug: post.slug })));
    nextToken = data.nextToken ?? undefined;
  } while (nextToken);

  return slugs;
}

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

  const authorData = await getAuthor(post.autor_id || 'marcelo-goncalves');
  const autor = authorData?.autor;
  const autorNome = autor?.nome_exibicao || 'Marcelo Gonçalves';

  const canonicalUrl = `${SITE_URL}/post/${post.slug}`;
  const categoryLabel = category?.nome_exibicao || post.categoria_slug || 'Artigo';
  const categorySlug = category?.categoria_slug || post.categoria_slug;

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
      ...(categorySlug ? [{
        "@type": "ListItem",
        "position": 3,
        "name": categoryLabel,
        "item": `${SITE_URL}/categoria/${categorySlug}`,
      }] : []),
      { "@type": "ListItem", "position": categorySlug ? 4 : 3, "name": post.titulo, "item": canonicalUrl },
    ],
  };

  const renderFinalContent = () => {
    const renderParts = (html: string, keyPrefix: string) => {
      if (!html.trim()) return null;
      const parts = html.split(/(<div id="inject-.*-placeholder"><\/div>)/);
      return parts.map((part, index) => {
        if (part === '<div id="inject-ads-placeholder"></div>') {
          return (
            <div key={`${keyPrefix}-inject-ads-${index}`} className="post-adslot">
              <AdsenseInArticle blockId="post-in-article-300x250" variant="in-content" />
            </div>
          );
        }
        if (part.trim() === '') return null;
        return (
          <div
            key={`${keyPrefix}-${index}`}
            className="post-content-part"
            dangerouslySetInnerHTML={{ __html: part }}
            suppressHydrationWarning={true}
          />
        );
      });
    };

    const firstParaEnd = contentHtml.indexOf('</p>');
    if (firstParaEnd === -1) {
      return renderParts(contentHtml, 'content');
    }

    const htmlBefore = contentHtml.slice(0, firstParaEnd + 4);
    const htmlAfter = contentHtml.slice(firstParaEnd + 4);

    return (
      <>
        {renderParts(htmlBefore, 'before')}
        <div className="post-adslot">
          <AdsenseInArticle blockId="summary-leaderboard-728x90" variant="summary-divider" />
        </div>
        {renderParts(htmlAfter, 'after')}
      </>
    );
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }} />

      <CopyCodeLogic />

      <section className="post-hero" data-audit="post-hero">
        <div className="post-hero-in" data-audit="post-hero-in">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Artigos', href: '/artigos' },
              ...(categorySlug ? [{ label: categoryLabel, href: `/categoria/${categorySlug}` }] : []),
            ]}
          />

          {categorySlug ? (
            <Link href={`/categoria/${categorySlug}`} className="post-cat-pill">
              {categoryLabel}
            </Link>
          ) : (
            <span className="post-cat-pill">{categoryLabel}</span>
          )}

          <h1 className="post-hero-title">{post.titulo}</h1>

          {(post.subtitulo || post.resumo) && <p className="post-hero-sub">{post.subtitulo || post.resumo}</p>}

          <div className="post-byline">
            <div className="post-avatar" aria-hidden="true">MG</div>
            <div className="post-byline-who">
              <div className="post-byline-name">{autorNome}</div>
            </div>
            <span className="post-byline-dot" aria-hidden="true" />
            <span className="post-byline-meta">
              <FontAwesomeIcon icon={faCalendar} aria-hidden="true" />
              <time dateTime={post.data_publicacao}>
                {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
              </time>
            </span>
            <span className="post-byline-dot" aria-hidden="true" />
            <span className="post-byline-meta">
              <FontAwesomeIcon icon={faClock} aria-hidden="true" />
              {post.tempo_leitura_min || 5} min de leitura
            </span>
          </div>
        </div>

        {post.imagem_destaque_url && (
          <div className="post-cover">
            <div className="post-cover-frame" data-audit="post-cover-frame">
              <ResponsiveImage
                src={post.imagem_destaque_url}
                alt={post.imagem_destaque_alt_text || post.titulo}
                priority
                fill
                sizes="(max-width: 1080px) 100vw, 1080px"
                lqip={post.imagem_lqip_base64}
              />
            </div>
          </div>
        )}
      </section>

      <div className="post-layout" data-audit="post-layout">
        <TableOfContents headings={headings} readingTimeMin={post.tempo_leitura_min || 5} />

        <div className="post-article">
          <div className="post-content">
            {post.resumo && <p className="post-lead">{post.resumo}</p>}
            {renderFinalContent()}
          </div>
        </div>

        <ShareRail
          currentPageUrl={canonicalUrl}
          linkedinUrl={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
          twitterUrl={`https://x.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.titulo)}`}
        />
      </div>

      {/* CTA CONTEXTUAL — editorial compacto */}
      <section className="wrap post-cta-editorial" data-audit="post-cta-editorial">
        <div className="post-cta-in">
          <div className="sec-ey sec-ey--dual">Aplicação prática</div>
          <h2>Precisa aplicar esse tipo de engenharia na sua operação?</h2>
          <p>Conheça as frentes de atuação da consultoria ou apresente o contexto que sua empresa precisa resolver.</p>
          <div className="post-cta-actions">
            <Link className="btn" href="/servicos">Conhecer os serviços</Link>
            <Link className="btn btn-petrol" href="/contato">Apresentar um desafio</Link>
          </div>
        </div>
      </section>

      <div className="post-wide">
        <PostFooter
          author={{
            name: autorNome,
            role: 'Fundador e líder técnico',
            bio: autor?.bio || 'Engenheiro de Cloud e DevOps com mais de dez anos de experiência em tecnologia, atuando com AWS, automação, sistemas e confiabilidade.',
            avatarInitials: 'MG',
          }}
          social={{
            linkedin_url: autor?.linkedin_url || AUTHOR_LINKEDIN_URL,
            github_url: autor?.github_url || AUTHOR_GITHUB_URL,
            instagram_url: autor?.instagram_url,
          }}
        />
      </div>

      <RelatedPostsSection excludeSlug={post.slug} />
    </article>
  );
}
