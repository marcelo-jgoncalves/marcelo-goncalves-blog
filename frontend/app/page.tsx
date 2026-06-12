/**frontend/app/page.tsx */

import './home.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts, getPopularPosts, getPostsByCategory, getProjectPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import { formatDateShort } from '@/lib/format';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME } from '@/lib/config';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | ${AUTHOR_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | ${AUTHOR_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
  },
  twitter: {
    title: `${SITE_NAME} | ${AUTHOR_NAME}`,
    description: SITE_DESCRIPTION,
  },
};

const HERO_PILLS = [
  { label: 'IA Aplicada', href: '/categoria/inteligencia-artificial', active: true },
  { label: 'DevOps', href: '/categoria/devops-automacao' },
  { label: 'Cloud · AWS', href: '/categoria/cloud-computing' },
  { label: 'Engenharia', href: '/categoria/engenharia-de-software' },
  { label: 'Bastidores', href: '/o-projeto' },
];

const STATS = [
  { v: '50+', l: 'Artigos publicados' },
  { v: '4', l: 'Categorias' },
  { v: '~100%', l: 'Construído com IA' },
  { v: '12 mo', l: 'Em produção' },
];

interface HomePost {
  slug: string;
  titulo: string;
  resumo?: string;
  categoria_slug: string;
  categoria?: {
    nome_exibicao: string;
  };
  data_publicacao?: string;
  tempo_leitura_min?: number;
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

  const heroFeature = popular[0] || recent[0];
  const mlFeature1 = popular[0];
  const mlFeature2 = popular[1];
  const mlList = popular.slice(2, 5);

  const iaBig = ia[0];
  const iaStack = ia.slice(1, 5);

  return (
    <>
      {/* Hero */}
      <section className="home-hero" data-audit="home-hero">
        <div className="home-hero-in" data-audit="home-hero-in">
          <div className="home-hero-left">
            <div className="home-hero-ey">Blog · Engenharia &amp; IA · Build in Public</div>
            <h1>Engenharia, IA e AWS — <em>na prática,</em> sem filtro</h1>
            <p className="home-hero-sub">Decisões reais de arquitetura, custos expostos, código em produção. Um blog construído do zero — e documentado em cada passo.</p>
            <div className="home-hero-pills">
              {HERO_PILLS.map((pill) => (
                <Link key={pill.href} href={pill.href} className={`home-hpill${pill.active ? ' home-hpill--active' : ''}`}>
                  {pill.label}
                </Link>
              ))}
            </div>
            <div className="home-hero-actions">
              <Link href="/artigos" className="home-btn-clay-hero">Ver todos os artigos <span className="arrow">→</span></Link>
              <Link href="/o-projeto" className="home-btn-ghost">O Projeto →</Link>
            </div>
          </div>
          <div className="home-hero-right">
            {heroFeature && (
              <article className="home-hero-feature" data-audit="home-hero-feature">
                <div className="home-hf-cover">
                  <span className="home-hf-badge">Em destaque</span>
                  <span className="home-hf-cover-tag">{categoryName(heroFeature)}</span>
                </div>
                <div className="home-hf-body">
                  <h2 className="home-hf-title">{heroFeature.titulo}</h2>
                  {heroFeature.resumo && <p className="home-hf-excerpt">{heroFeature.resumo}</p>}
                  <div className="home-hf-foot">
                    <div className="home-hf-meta">
                      <span>{AUTHOR_NAME}</span>
                      <span>{formatDateShort(heroFeature.data_publicacao)}</span>
                      <span>{heroFeature.tempo_leitura_min || 5} min</span>
                    </div>
                    <Link className="home-hf-read" href={`/post/${heroFeature.slug}`}>Ler artigo →</Link>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
        <div className="home-stats-strip" data-audit="home-stats-strip">
          {STATS.map((stat) => (
            <div key={stat.l} className="home-stat-item">
              <span className="v">{stat.v}</span>
              <span className="l">{stat.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mais Lidos */}
      {popular.length > 0 && (
        <section className="home-section" id="mais-lidos">
          <div className="wrap">
            <div className="sec-head-row">
              <div className="left">
                <div className="sec-ey">Mais lidos</div>
                <h2 className="sec-t">Os que mais engajaram</h2>
                <p className="sec-desc">Os artigos que mais geraram leitura, debate e compartilhamentos — um bom ponto de partida.</p>
              </div>
              <Link className="sec-link" href="/artigos">Ver ranking completo →</Link>
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
                        <Link className="home-ml-card-read" href={`/post/${mlFeature1.slug}`}>Ler →</Link>
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
                        <Link className="home-ml-card-read" href={`/post/${mlFeature2.slug}`}>Ler →</Link>
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
                      <span className="home-ml-item-arrow">→</span>
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
              <p className="sec-desc">Os últimos artigos publicados — decisões tomadas, erros cometidos e aprendizados registrados em tempo real.</p>
            </div>
            <Link className="sec-link" href="/artigos">Todos os artigos →</Link>
          </div>
          <div className="home-posts-grid" data-audit="home-posts-grid">
            {recent.map((post: HomePost, i: number) => (
              <PostCard key={post.slug} post={post} dataAudit={i === 0 ? 'home-post-card' : undefined} />
            ))}
          </div>
          <div className="home-posts-cta">
            <Link className="home-btn-outline-petrol" href="/artigos">Ver todos os artigos <span className="arrow">→</span></Link>
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
                <h2 className="home-ia-title">IA aplicada — sem hype</h2>
                <p className="home-ia-desc">Onde a IA realmente acelera, onde atrapalha, e o que ninguém te conta sobre usar modelos em produção.</p>
              </div>
              <Link className="home-ia-link" href="/categoria/inteligencia-artificial">Ver todos os posts de IA →</Link>
            </div>
            <div className="home-ia-grid" data-audit="home-ia-grid">
              {iaBig && (
                <article className="home-ia-big" data-audit="home-ia-big">
                  <div className="home-ia-big-cover">
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
                      <Link className="home-ia-read" href={`/post/${iaBig.slug}`}>Ler artigo →</Link>
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
                        <Link className="home-ia-read" href={`/post/${post.slug}`}>Ler →</Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
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
                <h2 className="sec-t">Bastidores em tempo real</h2>
                <p className="sec-desc">Cada decisão, cada erro, cada custo — documentados ao vivo. Um registro honesto de como se constrói uma plataforma editorial com AWS e IA.</p>
              </div>
              <Link className="sec-link" href="/o-projeto">Ver toda a jornada →</Link>
            </div>
            <div className="home-projeto-grid" data-audit="home-projeto-grid">
              {projeto.map((post: HomePost) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="home-projeto-cta-strip" data-audit="home-projeto-cta-strip">
              <div className="home-projeto-cta-left">
                <div className="home-projeto-cta-label"><span className="dot" />Em produção · Fase 1</div>
                <div className="home-projeto-cta-title">Acompanhe a jornada completa</div>
                <div className="home-projeto-cta-stats">
                  <div className="home-projeto-cta-stat"><span className="pv">12</span><span className="pl">Posts publicados</span></div>
                  <div className="home-projeto-cta-stat"><span className="pv">~100%</span><span className="pl">Com IA</span></div>
                  <div className="home-projeto-cta-stat"><span className="pv">12 mo</span><span className="pl">Em produção</span></div>
                </div>
              </div>
              <Link className="home-btn-clay-strip" href="/o-projeto">Ver O Projeto <span className="arrow">→</span></Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Assessoria */}
      <section className="home-cta-adv" id="assessoria">
        <div className="home-cta-adv-in" data-audit="home-cta-adv-in">
          <div className="home-cta-content">
            <div className="home-cta-ey">Serviços · Consultoria</div>
            <h2>Precisa de ajuda para <em>construir</em> ou escalar na nuvem?</h2>
            <p className="home-cta-desc">Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa.</p>
            <ul className="home-cta-points">
              <li>
                <span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></span>
                <span>Arquitetura <b>AWS</b> sob medida, sem desperdício de custo</span>
              </li>
              <li>
                <span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></span>
                <span>Automação e <b>CI/CD</b> de ponta a ponta em código</span>
              </li>
              <li>
                <span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></span>
                <span>Adoção de <b>IA</b> com foco em resultado, não em hype</span>
              </li>
            </ul>
          </div>
          <div className="home-cta-card-wrap">
            <div className="home-adv-card" data-audit="home-adv-card">
              <div className="home-adv-tagline"><span className="dot" />Disponível para novos projetos</div>
              <h3>Conheça todos os serviços</h3>
              <p className="home-adv-sub">Arquitetura, DevOps, FinOps, Serverless e mais — veja como posso ajudar o seu projeto.</p>
              <div className="home-adv-svc">
                <span>Cloud · AWS</span><span>DevOps</span><span>IA aplicada</span><span>Mentoria</span>
              </div>
              <Link className="home-btn-adv" href="/servicos">Ver todos os serviços <span className="arrow">→</span></Link>
              <div className="home-adv-reassure">10 frentes de atuação · diagnóstico gratuito</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
