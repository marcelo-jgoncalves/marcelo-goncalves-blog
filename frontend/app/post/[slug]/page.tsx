import './post.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAuthor } from '@/lib/api';
import { processFullPostContent } from '@/lib/postUtils';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER, AUTHOR_LINKEDIN_URL, AUTHOR_GITHUB_URL } from '@/lib/config';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import AdsenseInArticle from '@/components/ui/AdsenseInArticle';
import RelatedPostsSection from '@/components/ui/RelatedPostsSection';
import CopyCodeLogic from '@/components/ui/CopyCodeLogic';
import PostFooter from '@/components/post/PostFooter';
import ShareRail from '@/components/post/ShareRail';
import ReadingProgress from '@/components/post/ReadingProgress';
import TableOfContents from '@/components/post/TableOfContents';

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

  // Busca o autor dinamicamente para garantir consistência em toda a página
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <ReadingProgress />
      <CopyCodeLogic />

      <section className="post-hero" data-audit="post-hero">
        <div className="post-hero-in" data-audit="post-hero-in">
          <nav className="post-crumbs" aria-label="breadcrumb">
            <Link href="/">Home</Link>
            <span className="post-crumb-sep">/</span>
            <Link href="/artigos">Artigos</Link>
            {categorySlug && (
              <>
                <span className="post-crumb-sep">/</span>
                <Link href={`/categoria/${categorySlug}`}>{categoryLabel}</Link>
              </>
            )}
          </nav>

          {categorySlug ? (
            <Link href={`/categoria/${categorySlug}`} className="post-cat-pill">
              {category?.icone_fa && <i className={category.icone_fa} aria-hidden="true" />}
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
              <div className="post-byline-role">Cloud Engineer · AWS</div>
            </div>
            <span className="post-byline-dot" aria-hidden="true" />
            <span className="post-byline-meta">
              <i className="far fa-calendar" aria-hidden="true" />
              <time dateTime={post.data_publicacao}>
                {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
              </time>
            </span>
            <span className="post-byline-dot" aria-hidden="true" />
            <span className="post-byline-meta">
              <i className="far fa-clock" aria-hidden="true" />
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

      <div className="post-wide">
        <PostFooter
          author={{
            name: autorNome,
            bio: autor?.bio || 'é Engenheiro Cloud especialista em AWS e DevOps.',
            avatarInitials: 'MG',
            profileUrl: '/sobre',
          }}
          social={{
            linkedin_url: autor?.linkedin_url || AUTHOR_LINKEDIN_URL,
            github_url: autor?.github_url || AUTHOR_GITHUB_URL,
            instagram_url: autor?.instagram_url,
          }}
        />
      </div>

      <RelatedPostsSection />

      <section className="post-cta-adv" id="assessoria" data-audit="post-cta-adv">
        <div className="post-cta-adv-in" data-audit="post-cta-adv-in">
          <div>
            <div className="post-cta-ey">Assessoria</div>
            <h2>Precisa de ajuda para <em>construir</em> ou escalar na nuvem?</h2>
            <p className="post-cta-desc">
              Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa.
            </p>
            <ul className="post-cta-points">
              <li>
                <span className="ck">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span>Arquitetura <b>AWS</b> sob medida, sem desperdício de custo</span>
              </li>
              <li>
                <span className="ck">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span>Automação e <b>CI/CD</b> de ponta a ponta em código</span>
              </li>
              <li>
                <span className="ck">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span>Adoção de <b>IA</b> com foco em resultado, não em hype</span>
              </li>
            </ul>
          </div>

          <div className="post-adv-card" data-audit="post-adv-card">
            <div className="post-adv-tagline">
              <span className="dot" aria-hidden="true" />
              Disponível para novos projetos
            </div>
            <h3>Vamos conversar sobre o seu</h3>
            <p className="post-adv-sub">
              Diagnóstico inicial gratuito. Conte o desafio e eu retorno com um plano objetivo.
            </p>
            <div className="post-adv-svc">
              <span>Cloud · AWS</span>
              <span>DevOps</span>
              <span>IA aplicada</span>
              <span>Mentoria</span>
            </div>
            <a className="post-adv-btn" href="/servicos">
              Conhecer a assessoria <span className="arrow">→</span>
            </a>
            <div className="post-adv-reassure">Resposta em até 24h · sem compromisso</div>
          </div>
        </div>
      </section>
    </article>
  );
}
