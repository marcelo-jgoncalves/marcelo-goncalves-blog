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
      <section className="art-hero" data-audit="art-hero">
        <div className="art-hero-in" data-audit="art-hero-in">
          <div className="art-hero-left">
            <div className="art-ey">Arquivo · Todos os artigos</div>
            <h1>Tudo que escrevi, reunido <em>num só lugar</em></h1>
            <p className="art-sub">Tutoriais, bastidores e decisões reais de um blog construído do zero na AWS — quase 100% com IA. Busque, filtre e vá fundo.</p>

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
          </div>

          <div className="art-hero-right">
            <Link className="art-proj-card" href="/o-projeto" aria-label="Conhecer O Projeto" data-audit="art-proj-card">
              <div className="art-proj-label"><span className="art-dot"></span>Construído em público</div>
              <h2>Veja como este blog foi <em>construído</em></h2>
              <p className="art-pc-sub">Da infra serverless ao deploy — cada decisão documentada e os custos expostos, quase tudo com IA.</p>
              <div className="art-proj-stats">
                <div className="art-proj-stat"><span className="art-v art-clay">~100%</span><span className="art-l">Com IA</span></div>
                <div className="art-proj-stat"><span className="art-v">100%</span><span className="art-l">Serverless</span></div>
                <div className="art-proj-stat"><span className="art-v">12 mo</span><span className="art-l">Em produção</span></div>
              </div>
              <span className="art-proj-btn">Conhecer O Projeto <span className="art-arrow">→</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* FILTROS (sticky) */}
      <ArtigosFilters categories={CATEGORIES} totalCount={totalCount} renderedCount={posts.length} />

      {/* MASTHEAD (destaque) */}
      {feature && (
        <section className="wrap art-masthead" data-audit="art-masthead">
          <article className="art-feature" data-audit="art-feature">
            <Link className="art-f-cover" href={`/post/${feature.slug}`} aria-label="Abrir artigo em destaque">
              {feature.imagem_destaque_url && (
                <ResponsiveImage
                  src={feature.imagem_destaque_url}
                  alt={feature.imagem_destaque_alt_text || feature.titulo}
                  fill
                  priority
                  lqip={feature.imagem_lqip_base64}
                />
              )}
              <span className="art-f-badge">★ Em destaque</span>
              <span className="art-f-cover-tag">{categoryName(feature)}</span>
            </Link>
            <div className="art-f-body">
              <span className="art-f-cat">{categoryName(feature)}</span>
              <h2>{feature.titulo}</h2>
              {feature.resumo && <p>{feature.resumo}</p>}
              <div className="art-f-foot">
                <div className="art-f-avatar">MG</div>
                <div className="art-f-who">
                  <span className="art-f-name">{AUTHOR_NAME}</span>
                  <span className="art-f-meta">{formatDateShort(feature.data_publicacao)} · {feature.tempo_leitura_min || 5} min</span>
                </div>
                <Link className="art-f-read" href={`/post/${feature.slug}`}>Ler artigo →</Link>
              </div>
            </div>
          </article>

          {twoup.length > 0 && (
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
                      <span className="art-more">Ler →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* GRADE PRINCIPAL — 1ª metade */}
      <section className="wrap art-section after-sticky">
        <div className="sec-head-row">
          <div className="left">
            <div className="sec-ey">O arquivo</div>
            <h2 className="sec-t" id="art-grid-title">Todos os artigos</h2>
          </div>
          <Link className="sec-link" href="/artigos">Ver índice por ano →</Link>
        </div>

        <div className="posts-grid art-grid" id="art-grid" data-audit="art-grid">
          {grid1.map((post) => (
            <PostCard key={post.slug} post={post} dataCat={post.categoria_slug} />
          ))}
        </div>
      </section>

      {/* CLÁSSICOS DO BLOG */}
      {popular.length > 0 && (
        <section className="art-readband" data-audit="art-readband">
          <div className="wrap">
            <div className="art-rb-head">
              <div>
                <div className="art-rb-ey">Mais lidos de sempre</div>
                <h2 className="art-rb-title">Os clássicos do blog</h2>
              </div>
              <Link className="art-rb-link" href="/artigos">Ver ranking completo →</Link>
            </div>
            <div className="art-rb-list" data-audit="art-rb-list">
              {popular.slice(0, 4).map((post, i) => (
                <Link key={post.slug} className="art-rb-item" href={`/post/${post.slug}`}>
                  <span className="art-rb-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="art-rb-body">
                    <span className="art-rb-cat">{categoryName(post)}</span>
                    <span className="art-rb-t">{post.titulo}</span>
                    <div className="art-rb-meta">
                      <span>{formatDateShort(post.data_publicacao)}</span>
                      <span>{post.tempo_leitura_min || 5} min</span>
                    </div>
                  </div>
                  <span className="art-rb-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* ASSESSORIA CTA */}
      <section className="art-cta-adv" id="assessoria" data-audit="art-cta-adv">
        <div className="art-cta-adv-in" data-audit="art-cta-adv-in">
          <div className="art-cta-left">
            <div className="art-cta-ey">Assessoria &amp; Consultoria</div>
            <h2>Precisa de ajuda para <em>construir</em> ou escalar na nuvem?</h2>
            <p className="art-cta-desc">Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa.</p>
            <ul className="art-cta-points">
              <li>
                <span className="art-ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                <span>Arquitetura <b>AWS</b> sob medida, sem desperdício de custo</span>
              </li>
              <li>
                <span className="art-ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                <span>Automação e <b>CI/CD</b> de ponta a ponta em código</span>
              </li>
              <li>
                <span className="art-ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                <span>Adoção de <b>IA</b> com foco em resultado, não em hype</span>
              </li>
            </ul>
          </div>
          <div className="art-adv-card" data-audit="art-adv-card">
            <div className="art-adv-tagline"><span className="art-dot"></span>Disponível para novos projetos</div>
            <h3>Vamos conversar sobre o seu</h3>
            <p className="art-adv-sub">Diagnóstico inicial gratuito. Conte o desafio e eu retorno com um plano objetivo.</p>
            <div className="art-svc-tags">
              <span>Cloud · AWS</span>
              <span>DevOps</span>
              <span>IA aplicada</span>
              <span>Mentoria</span>
            </div>
            <Link className="art-btn-adv" href="/servicos">Conhecer a assessoria <span className="art-arrow">→</span></Link>
            <div className="art-reassure">Resposta em até 24h · sem compromisso</div>
          </div>
        </div>
      </section>
    </>
  );
}
