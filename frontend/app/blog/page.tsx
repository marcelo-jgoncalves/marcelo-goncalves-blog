/**frontend/app/blog/page.tsx */

import './blog.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts, getPopularPosts, getPostsByCategory, getProjectPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import LerArtigo from '@/components/ui/LerArtigo';
import PageHero from '@/components/ui/PageHero';
import { formatDateShort } from '@/lib/format';
import { SITE_URL, SITE_NAME, BLOG_DESCRIPTION } from '@/lib/config';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: `Blog | ${SITE_NAME}` },
  description: BLOG_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
  twitter: {
    title: `Blog | ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
  },
};

const STATS = [
  { v: '50+', l: 'Artigos publicados' },
  { v: '4', l: 'Categorias' },
  { v: '100%', l: 'conteúdo original' },
  { v: 'Casos Reais', l: 'Do problema à solução' },
];

interface HomePost {
  slug: string;
  titulo: string;
  resumo?: string;
  categoria_slug: string;
  categoria?: {
    nome_exibicao: string;
  };
  subcategoria_nome?: string;
  data_publicacao?: string;
  tempo_leitura_min?: number;
  imagem_destaque_url?: string;
  imagem_destaque_alt_text?: string;
  imagem_lqip_base64?: string;
}

function categoryName(post: HomePost): string {
  if (post?.categoria?.nome_exibicao) return post.categoria.nome_exibicao;
  return (post?.categoria_slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export default async function Home() {
  const [popularData, recentData, iaData, projetoData] = await Promise.all([
    getPopularPosts(5).catch(() => ({ posts: [] })),
    getRecentPosts(6).catch(() => ({ posts: [] })),
    getPostsByCategory('inteligencia-artificial', undefined, 5).catch(() => null),
    getProjectPosts(undefined, 3).catch(() => ({ posts: [] })),
  ]);

  const popular: HomePost[] = popularData?.posts || [];
  const recent: HomePost[] = recentData?.posts || [];
  const ia: HomePost[] = iaData?.posts || [];
  const projeto: HomePost[] = projetoData?.posts || [];

  const mlFeature1 = popular[0];
  const mlFeature2 = popular[1];
  const mlList = popular.slice(2, 5);

  const iaBig = ia[0];
  const iaStack = ia.slice(1, 5);

  return (
    <div className="theme-dark">
      {/* Hero */}
      <PageHero
        className="home-hero"
        dataAudit="home-hero"
        eyebrow="Blog · Build in Public"
        title="Cloud, Automação e IA aplicadas a problemas reais"
        subtitle="Conteúdo técnico construído a partir da prática: custos, performance, observabilidade, automação e transformação operacional."
        right={
          <Link className="home-proj-panel" href="/o-projeto" data-audit="home-proj-panel">
            <div className="home-pp-label"><span className="home-pp-dot"></span>Construído em público</div>
            <h2>Acompanhe a construção do blog</h2>
            <p className="home-pc-sub">Cada decisão de arquitetura documentada. Custos reais, código real, processo aberto desde o dia zero.</p>
            <div className="home-pp-stats">
              <div className="home-pp-stat"><span className="home-pp-v">100%</span><span className="home-pp-l">Serverless</span></div>
              <div className="home-pp-stat"><span className="home-pp-v">Infra</span><span className="home-pp-l">como código</span></div>
              <div className="home-pp-stat"><span className="home-pp-v">AWS</span><span className="home-pp-l">10+ Serviços</span></div>
              <div className="home-pp-stat"><span className="home-pp-v">IA</span><span className="home-pp-l">como copiloto</span></div>
            </div>
            <span className="home-pp-btn">Ver o projeto <span className="home-pp-arrow" aria-hidden="true">→</span></span>
          </Link>
        }
        statsStrip={
          <div className="home-stats-strip" data-audit="home-stats-strip">
            {STATS.map((stat) => (
              <div key={stat.l} className="home-stat-item">
                <span className="v">{stat.v}</span>
                <span className="l">{stat.l}</span>
              </div>
            ))}
          </div>
        }
      >
        <div className="home-hero-actions">
          <Link href="/artigos" className="home-btn-ghost">Todos os artigos <span aria-hidden="true">→</span></Link>
        </div>
      </PageHero>

      {/* Mais Lidos */}
      {popular.length > 0 && (
        <section className="home-section" id="mais-lidos">
          <div className="wrap">
            <div className="sec-head-row">
              <div className="left">
                <div className="sec-ey">Mais lidos</div>
                <h2 className="sec-t">Posts que mais engajaram</h2>
                <p className="sec-desc">Os que mais geraram leitura, debate e compartilhamentos. Comece por aqui.</p>
              </div>
            </div>
            <div className="home-ml-grid" data-audit="home-ml-grid">
              {mlFeature1 && (
                <div className="home-ml-feature">
                  <div className="home-ml-rank-label">Mais lido · #1</div>
                  <article className="home-ml-card" data-audit="home-ml-card">
                    <div className="home-ml-num-bg">01</div>
                    <div className="home-ml-card-inner">
                      <span className="home-ml-card-cat">{categoryName(mlFeature1)}</span>
                      <h3 className="home-ml-card-title">{mlFeature1.titulo}</h3>
                      {mlFeature1.resumo && <p className="home-ml-card-excerpt">{mlFeature1.resumo}</p>}
                      <div className="home-ml-card-foot">
                        <div className="home-ml-card-meta">
                          <span>{formatDateShort(mlFeature1.data_publicacao)}</span>
                          <span>{mlFeature1.tempo_leitura_min || 5} min de leitura</span>
                        </div>
                        <Link className="home-ml-card-read" href={`/post/${mlFeature1.slug}`} aria-label={`Ler artigo: ${mlFeature1.titulo}`}><LerArtigo /></Link>
                      </div>
                    </div>
                  </article>
                </div>
              )}
              {mlFeature2 && (
                <div className="home-ml-feature">
                  <div className="home-ml-rank-label">Mais lido · #2</div>
                  <article className="home-ml-card">
                    <div className="home-ml-num-bg">02</div>
                    <div className="home-ml-card-inner">
                      <span className="home-ml-card-cat">{categoryName(mlFeature2)}</span>
                      <h3 className="home-ml-card-title">{mlFeature2.titulo}</h3>
                      {mlFeature2.resumo && <p className="home-ml-card-excerpt">{mlFeature2.resumo}</p>}
                      <div className="home-ml-card-foot">
                        <div className="home-ml-card-meta">
                          <span>{formatDateShort(mlFeature2.data_publicacao)}</span>
                          <span>{mlFeature2.tempo_leitura_min || 5} min de leitura</span>
                        </div>
                        <Link className="home-ml-card-read" href={`/post/${mlFeature2.slug}`} aria-label={`Ler artigo: ${mlFeature2.titulo}`}><LerArtigo /></Link>
                      </div>
                    </div>
                  </article>
                </div>
              )}
              {mlList.length > 0 && (
                <div className="home-ml-list" data-audit="home-ml-list">
                  {mlList.map((post: HomePost, i: number) => (
                    <Link key={post.slug} className="home-ml-item" href={`/post/${post.slug}`}>
                      <span className="home-ml-item-num">{String(i + 3).padStart(2, '0')}</span>
                      <div className="home-ml-item-body">
                        <span className="home-ml-item-cat">{categoryName(post)}</span>
                        <span className="home-ml-item-title">{post.titulo}</span>
                        <div className="home-ml-item-meta">
                          <span>{formatDateShort(post.data_publicacao)}</span>
                          <span>{post.tempo_leitura_min || 5} min</span>
                        </div>
                      </div>
                      <span className="home-ml-item-arrow" aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Postagens Recentes */}
      <section className="home-section home-section--surface" id="recentes">
        <div className="wrap">
          <div className="sec-head-row">
            <div className="left">
              <div className="sec-ey">Postagens recentes</div>
              <h2 className="sec-t">Direto do forno</h2>
              <p className="sec-desc">Últimos artigos publicados.<br />Problemas reais. Soluções aplicadas. Aprendizados compartilhados.</p>
            </div>
          </div>
          <div className="home-posts-grid" data-audit="home-posts-grid">
            {recent.map((post: HomePost, i: number) => (
              <PostCard key={post.slug} post={post} dataAudit={i === 0 ? 'home-post-card' : undefined} />
            ))}
          </div>
          <div className="home-posts-cta">
            <Link className="home-btn-outline-petrol" href="/artigos">Todos os artigos <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      {/* Posts sobre IA */}
      {ia.length > 0 && (
        <section className="home-ia-section" id="ia">
          <div className="wrap">
            <div className="home-ia-sec-head-row">
              <div className="left">
                <div className="home-ia-ey">Inteligência Artificial</div>
                <h2 className="home-ia-title">IA aplicada, sem hype</h2>
                <p className="home-ia-desc">Onde a IA realmente acelera, onde atrapalha, e o que ninguém te conta sobre usar modelos em produção.</p>
              </div>
              <Link className="home-ia-link sec-link-clay home-ia-link-desktop" href="/categoria/inteligencia-artificial">Tudo sobre IA →</Link>
            </div>
            <div className="home-ia-grid" data-audit="home-ia-grid">
              {iaBig && (
                <article className="home-ia-big" data-audit="home-ia-big">
                  <div className="home-ia-big-cover">
                    {iaBig.imagem_destaque_url && (
                      <ResponsiveImage
                        src={iaBig.imagem_destaque_url}
                        alt={iaBig.imagem_destaque_alt_text || iaBig.titulo}
                        fill
                        lqip={iaBig.imagem_lqip_base64}
                      />
                    )}
                    <span className="home-ia-big-cover-tag">{categoryName(iaBig)}</span>
                  </div>
                  <div className="home-ia-big-body">
                    <span className="home-ia-big-cat">{categoryName(iaBig)}</span>
                    <h3 className="home-ia-big-title">{iaBig.titulo}</h3>
                    {iaBig.resumo && <p className="home-ia-big-excerpt">{iaBig.resumo}</p>}
                    <div className="home-ia-big-foot">
                      <div className="home-ia-big-meta">
                        <span>{formatDateShort(iaBig.data_publicacao)}</span>
                        <span>{iaBig.tempo_leitura_min || 5} min</span>
                      </div>
                      <Link className="home-ia-read" href={`/post/${iaBig.slug}`} aria-label={`Ler artigo: ${iaBig.titulo}`}><LerArtigo /></Link>
                    </div>
                  </div>
                </article>
              )}
              {iaStack.length > 0 && (
                <div className="home-ia-stack">
                  {iaStack.map((post: HomePost, i: number) => (
                    <article key={post.slug} className="home-ia-small" data-audit={i === 0 ? 'home-ia-small' : undefined}>
                      <span className="home-ia-small-cat">{categoryName(post)}</span>
                      <h3 className="home-ia-small-title">{post.titulo}</h3>
                      <div className="home-ia-small-foot">
                        <div className="home-ia-small-meta">
                          <span>{formatDateShort(post.data_publicacao)}</span>
                          <span>{post.tempo_leitura_min || 5} min</span>
                        </div>
                        <Link className="home-ia-read" href={`/post/${post.slug}`} aria-label={`Ler artigo: ${post.titulo}`}><LerArtigo /></Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
            <Link className="home-ia-link sec-link-clay home-ia-link-mobile" href="/categoria/inteligencia-artificial">Tudo sobre IA →</Link>
          </div>
        </section>
      )}

      {/* O Projeto */}
      {projeto.length > 0 && (
        <section className="home-section home-projeto-section" id="projeto">
          <div className="wrap">
            <div className="sec-head-row">
              <div className="left">
                <div className="sec-ey">O Projeto · Build in Public</div>
                <h2 className="sec-t">Bastidores da plataforma</h2>
                <p className="sec-desc">Decisões, erros e custos documentados em tempo real. Um registro honesto de como se constrói uma plataforma editorial moderna.</p>
              </div>
              <Link className="home-btn-clay-hero home-btn-clay-hero-desktop" href="/o-projeto">Acompanhe a jornada <span className="arrow" aria-hidden="true">→</span></Link>
            </div>
            <div className="home-projeto-grid" data-audit="home-projeto-grid">
              {projeto.map((post: HomePost) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Link className="home-btn-clay-hero home-btn-clay-hero-mobile" href="/o-projeto">Acompanhe a jornada <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </section>
      )}

      <CtaAssessoria />
    </div>
  );
}
