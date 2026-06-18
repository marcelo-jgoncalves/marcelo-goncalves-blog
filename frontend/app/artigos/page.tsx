/* frontend/app/artigos/page.tsx */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getPopularPosts, getRecentPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import ArtigosFilters from '@/components/ui/ArtigosFilters';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { formatDateShort } from '@/lib/format';
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_TWITTER } from '@/lib/config';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import LerArtigo from '@/components/ui/LerArtigo';
import PageHero from '@/components/ui/PageHero';
import './artigos.css';

const DESCRIPTION = 'Explore o arquivo completo de tutoriais AWS, análises de IA generativa e engenharia de software — quase 100% construído com IA.';

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

const CATEGORIES = [
  { slug: 'inteligencia-artificial', label: 'Inteligência Artificial' },
  { slug: 'cloud-computing', label: 'Cloud Computing' },
  { slug: 'devops-automacao', label: 'DevOps & Automação' },
  { slug: 'engenharia-de-software', label: 'Engenharia' },
  { slug: 'tutoriais-aws', label: 'Tutoriais AWS' },
  { slug: 'seguranca-na-nuvem', label: 'Segurança' },
  { slug: 'noticias-e-mercado', label: 'Notícias & Mercado' },
];

interface ArtigosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LIMIT = 12;

export default async function ArtigosPage({ searchParams }: ArtigosPageProps) {
  const params = await searchParams;
  const nextToken  = typeof params.nextToken  === 'string' ? params.nextToken  : undefined;
  const prevTokens = typeof params.prevTokens === 'string' ? params.prevTokens : '';
  const page       = typeof params.page       === 'string' ? Math.max(1, parseInt(params.page)) : 1;

  const [allData, popularData, recentData] = await Promise.all([
    getAllPosts(nextToken, LIMIT).catch(() => null),
    getPopularPosts(4).catch(() => ({ posts: [] })),
    getRecentPosts(3).catch(() => ({ posts: [] })),
  ]);

  const posts: ArtigoPost[] = allData?.posts || [];
  const nextPageToken = allData?.nextToken ?? undefined;
  const totalCount = allData?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / LIMIT) : 0;

  const popular: ArtigoPost[] = popularData?.posts || [];
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* HERO */}
      <PageHero
        className="art-hero"
        dataAudit="art-hero"
        eyebrow="Arquivo · Todos os artigos"
        title={<>Tudo que escrevi, reunido <em>num só lugar</em></>}
        subtitle="Tutoriais, bastidores e soluções para problemas reais. Do dia a dia com AWS e IA ao processo de construção desta plataforma."
        right={feature ? (
          <article className="art-hf-card" data-audit="art-hero-feature">
            <div className="art-hf-cover">
              {feature.imagem_destaque_url && (
                <ResponsiveImage
                  src={feature.imagem_destaque_url}
                  alt={feature.imagem_destaque_alt_text || feature.titulo}
                  fill
                  priority
                  lqip={feature.imagem_lqip_base64}
                />
              )}
              <span className="art-hf-badge">Em destaque</span>
              <span className="art-hf-cover-tag">{categoryName(feature)}</span>
            </div>
            <div className="art-hf-body">
              <h2 className="art-hf-title">{feature.titulo}</h2>
              {feature.resumo && <p className="art-hf-excerpt">{feature.resumo}</p>}
              <div className="art-hf-foot">
                <div className="art-hf-meta">
                  <span>{formatDateShort(feature.data_publicacao)}</span>
                  <span>{feature.tempo_leitura_min || 5} min</span>
                </div>
                <Link className="art-hf-read" href={`/post/${feature.slug}`}><LerArtigo /></Link>
              </div>
            </div>
          </article>
        ) : undefined}
      >
        <form className="art-search" action="/busca" method="get" role="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input type="search" name="q" placeholder="Buscar por título, tema ou tecnologia…" aria-label="Buscar artigos" required />
          <span className="art-kbd">⌘K</span>
        </form>
        <div className="art-hero-stats">
          <span><b>{totalCount}</b> artigos</span>
          <span className="art-pipe"></span>
          <span><b>{CATEGORIES.length}</b> categorias</span>
          <span className="art-pipe"></span>
          <span>Atualizado <b>semanalmente</b></span>
        </div>
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
      <section className="wrap art-section after-sticky">
        <div className="sec-head-row">
          <div className="left">
            <div className="sec-ey">O arquivo</div>
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
          <div className="svc-mo-left">
            <div className="svc-mo-ey">Prova viva</div>
            <h2>Quer saber como esta plataforma foi construída? Veja o <em>making of</em>.</h2>
            <p>Da infraestrutura serverless ao frontend Next.js, tudo documentado desde o primeiro commit.</p>
            <Link className="svc-mo-cta" href="/o-projeto">Conheça &quot;O Projeto&quot; <span className="svc-arrow">→</span></Link>
          </div>
          <div className="svc-mo-right">
            <div className="proof-card">
              <div className="proof-label"><span className="dot"></span>Construído em público</div>
              <div className="proof-body">
                <div className="proof-stack">
                  <div className="proof-item">
                    <span className="pi-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" /></svg>
                    </span>
                    <span className="pi-txt">
                      <span className="pi-t">Backend 100% serverless</span>
                      <span className="pi-d">Lambda · API Gateway · DynamoDB</span>
                    </span>
                  </div>
                  <div className="proof-item">
                    <span className="pi-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
                    </span>
                    <span className="pi-txt">
                      <span className="pi-t">Deploy e infra por código</span>
                      <span className="pi-d">GitHub Actions · Terraform</span>
                    </span>
                  </div>
                  <div className="proof-item">
                    <span className="pi-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="M7 16V9M11.5 16V5M16 16v-4" /></svg>
                    </span>
                    <span className="pi-txt">
                      <span className="pi-t">Observabilidade de ponta a ponta</span>
                      <span className="pi-d">X-Ray · CloudWatch · Logs estruturados</span>
                    </span>
                  </div>
                  <div className="proof-item">
                    <span className="pi-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.4-.7 2.6-1.8 3.3L16 21H8l1.8-11.7A4 4 0 0 1 8 6a4 4 0 0 1 4-4z" /><path d="M9 21h6" /></svg>
                    </span>
                    <span className="pi-txt">
                      <span className="pi-t">IA como copiloto</span>
                      <span className="pi-d">Claude · Cursor · Automações</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRADE PRINCIPAL — 2ª metade */}
      <section className="wrap art-section after-sticky art-section-end">
        {grid2.length > 0 && (
          <div className="posts-grid art-grid" id="art-grid2" data-audit="art-grid2">
            {grid2.map((post) => (
              <PostCard key={post.slug} post={post} dataCat={post.categoria_slug} />
            ))}
          </div>
        )}

        <div className="art-empty" id="art-empty">
          <div className="art-e-t">Nenhum artigo nesta categoria ainda</div>
          <div className="art-e-s">Tente outro filtro — ou volte para &quot;Todos&quot;.</div>
        </div>

        <div className="art-load-wrap">
          <Pagination
            basePath="/artigos"
            page={page}
            totalPages={totalPages}
            nextToken={nextPageToken}
            currentPageToken={nextToken}
            prevTokens={prevTokens}
          />
        </div>
      </section>

      <CtaAssessoria />
    </>
  );
}
