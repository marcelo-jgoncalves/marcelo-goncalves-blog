/* frontend/app/artigos/page.tsx */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getRecentPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { formatDateShort } from '@/lib/format';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import LerArtigo from '@/components/ui/LerArtigo';
import PageHero from '@/components/ui/PageHero';
import SearchBar from '@/components/ui/SearchBar';
import './artigos.css';

const DESCRIPTION = 'Explore o arquivo completo de tutoriais AWS, análises de IA generativa e engenharia de software, quase 100% construído com IA.';

export const metadata: Metadata = {
  title: { absolute: `Todos os Artigos | ${SITE_NAME}` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/artigos` },
  openGraph: {
    title: `Todos os Artigos | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/artigos`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Todos os Artigos | ${SITE_NAME}`,
    description: DESCRIPTION,
    creator: AUTHOR_TWITTER,
  },
};

export const revalidate = 300;

interface ArtigoPost {
  slug: string;
  titulo: string;
  resumo?: string;
  categoria_slug: string;
  categoria?: { nome_exibicao: string };
  subcategoria_nome?: string;
  data_publicacao?: string;
  tempo_leitura_min?: number;
  imagem_destaque_url?: string;
  imagem_destaque_alt_text?: string;
  imagem_lqip_base64?: string;
}

function categoryName(post: ArtigoPost): string {
  if (post?.categoria?.nome_exibicao) return post.categoria.nome_exibicao;
  return (post?.categoria_slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
}

interface ArtigosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LIMIT = 12;

export default async function ArtigosPage({ searchParams }: ArtigosPageProps) {
  const params = await searchParams;
  const nextToken  = typeof params.nextToken  === 'string' ? params.nextToken  : undefined;
  const prevTokens = typeof params.prevTokens === 'string' ? params.prevTokens : '';
  const page       = typeof params.page       === 'string' ? Math.max(1, parseInt(params.page)) : 1;

  const [allData, recentData] = await Promise.all([
    getAllPosts(nextToken, LIMIT).catch(() => null),
    getRecentPosts(3).catch(() => ({ posts: [] })),
  ]);

  const posts: ArtigoPost[] = allData?.posts || [];
  const nextPageToken = allData?.nextToken ?? undefined;
  const totalCount = allData?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / LIMIT) : 0;

  const recent: ArtigoPost[] = recentData?.posts || [];

  const feature = recent[0];
  const twoup = recent.slice(1, 3);

  const grid1 = posts.slice(0, 6);
  const grid2 = posts.slice(6, 12);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Artigos", "item": `${SITE_URL}/artigos` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }} />

      {/* HERO */}
      <PageHero
        singleColumn
        className="art-hero"
        dataAudit="art-hero"
        eyebrow="Arquivo · Todos os artigos"
        title="Engenharia aplicada, aprendizados reais e bastidores de projetos em produção"
        subtitle="Conteúdos sobre cloud, automação, IA e operações, construídos a partir de desafios reais, decisões técnicas e soluções colocadas em prática."
      >
        <SearchBar ariaLabel="Buscar artigos" />
      </PageHero>


      {/* MASTHEAD (destaque + mini cards) */}
      {(feature || twoup.length > 0) && (
        <section className="wrap art-masthead" data-audit="art-masthead">
          {feature && (
            <Link className="art-feature" href={`/post/${feature.slug}`} data-audit="art-feature">
              <div className="art-f-cover">
                {feature.imagem_destaque_url && (
                  <ResponsiveImage
                    src={feature.imagem_destaque_url}
                    alt={feature.imagem_destaque_alt_text || feature.titulo}
                    fill
                    priority
                    lqip={feature.imagem_lqip_base64}
                  />
                )}
                <span className="art-f-badge">Em destaque</span>
                <span className="art-f-cover-tag">{categoryName(feature)}</span>
              </div>
              <div className="art-f-body">
                <div className="art-f-cat">{categoryName(feature)}</div>
                <h2>{feature.titulo}</h2>
                {feature.resumo && <p>{feature.resumo}</p>}
                <div className="art-f-foot">
                  <div className="art-f-avatar">MG</div>
                  <div className="art-f-who">
                    <span className="art-f-name">Marcelo Gonçalves</span>
                    <span className="art-f-meta">{formatDateShort(feature.data_publicacao)} · {feature.tempo_leitura_min || 5} min</span>
                  </div>
                  <LerArtigo color="var(--petrol)" />
                </div>
              </div>
            </Link>
          )}
          <div className="art-twoup" data-audit="art-twoup">
            {twoup.map((post, i) => (
              <Link
                key={post.slug}
                className="art-mini"
                href={`/post/${post.slug}`}
                data-audit={i === 0 ? 'art-mini' : undefined}
              >
                <div className={`art-m-cover ${i === 0 ? 't-soft' : 't-clay'}`}>
                  {post.imagem_destaque_url && (
                    <ResponsiveImage
                      src={post.imagem_destaque_url}
                      alt={post.imagem_destaque_alt_text || post.titulo}
                      fill
                      lqip={post.imagem_lqip_base64}
                    />
                  )}
                </div>
                <div className="art-m-body">
                  <span className="art-m-cat">{categoryName(post)}</span>
                  <span className="art-m-title">{post.titulo}</span>
                  <div className="art-m-foot">
                    <span>{formatDateShort(post.data_publicacao)} · {post.tempo_leitura_min || 5} min</span>
                    <LerArtigo />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* GRADE PRINCIPAL — 1ª metade */}
      <section className="wrap art-section">
        <div className="sec-head-row sec-head-row--center">
          <div className="left">
            <div className="sec-ey sec-ey--dual">O arquivo</div>
            <h2 className="sec-t" id="art-grid-title">Todos os artigos</h2>
          </div>
        </div>

        <div className="posts-grid art-grid" id="art-grid" data-audit="art-grid">
          {grid1.map((post) => (
            <PostCard key={post.slug} post={post} dataCat={post.categoria_slug} />
          ))}
        </div>
      </section>

      {/* MAKING OF — O PROJETO */}
      <section className="svc-makingof">
        <div className="svc-makingof-in">
          <div className="svc-mo-text">
            <div className="sec-ey sec-ey--dual">Prova viva</div>
            <h2>Quer saber como esta plataforma foi construída? Veja o <em>making of</em>.</h2>
            <p className="svc-mo-sub">Da infraestrutura serverless ao frontend Next.js, tudo documentado desde o primeiro commit.</p>
            <Link className="btn svc-mo-cta" href="/o-projeto">Conheça &quot;O Projeto&quot;</Link>
          </div>
        </div>
      </section>

      {/* GRADE PRINCIPAL — 2ª metade */}
      <section className="wrap art-section art-section--paginated">
        {grid2.length > 0 && (
          <div className="posts-grid art-grid" id="art-grid2" data-audit="art-grid2">
            {grid2.map((post) => (
              <PostCard key={post.slug} post={post} dataCat={post.categoria_slug} />
            ))}
          </div>
        )}

        <div className="art-empty" id="art-empty">
          <div className="art-e-t">Nenhum artigo nesta categoria ainda</div>
          <div className="art-e-s">Tente outro filtro ou volte para &quot;Todos&quot;.</div>
        </div>

        <div className="art-load-wrap">
          <Pagination
            basePath="/artigos"
            page={page}
            totalPages={totalPages}
            nextToken={nextPageToken}
            currentPageToken={nextToken}
            prevTokens={prevTokens}
            scrollToId="art-grid-title"
          />
        </div>
      </section>

      <CtaAssessoria
        eyebrow="Além dos artigos"
        title="Prefere aplicar isso direto no seu projeto?"
        description="Nem todo desafio cabe num artigo. Se você quer aplicar essas técnicas na sua operação, sem tentativa e erro, ajudamos diretamente."
      />
    </>
  );
}
