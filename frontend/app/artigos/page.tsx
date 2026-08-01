
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts, getPopularPosts, getPostsByCategory, getProjectPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import AdvisoryCta from '@/components/ui/AdvisoryCta';
import ReadArticle from '@/components/ui/ReadArticle';
import PageHero from '@/components/ui/PageHero';
import { formatDateShort, categoryName } from '@/lib/format';
import { SITE_URL, SITE_NAME, BLOG_DESCRIPTION } from '@/lib/config';
import styles from './artigos.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: `Artigos | ${SITE_NAME}` },
  description: BLOG_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/artigos` },
  openGraph: {
    title: `Artigos | ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/artigos`,
    type: 'website',
  },
  twitter: {
    title: `Artigos | ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
  },
};

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

export default async function ArtigosPage() {
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
    <>
      {/* Hero */}
      <PageHero
        className={`home-hero ${styles.homeHero}`}
        dataAudit="home-hero"
        eyebrow="Blog · Build in Public"
        title={<>Engenharia, Cloud, Automação e IA aplicadas a <em>necessidades reais</em></>}
        subtitle="Conteúdo técnico construído a partir da prática: custos, performance, observabilidade, automação e transformação operacional."
        right={
          <Link className={`home-proj-panel ${styles.homeProjPanel}`} href="/o-projeto" data-audit="home-proj-panel">
            <div className={styles.homePpLabel}><span className={styles.homePpDot}></span>Construído em público</div>
            <h2>Acompanhe a construção desta plataforma</h2>
            <p className={styles.homePcSub}>Cada decisão de arquitetura documentada. Custos reais, código real, processo aberto desde o dia zero.</p>
            <div className={styles.homePpStats}>
              <div className={styles.homePpStat}><span className={styles.homePpV}>100%</span><span className={styles.homePpL}>Serverless</span></div>
              <div className={styles.homePpStat}><span className={styles.homePpV}>Infra</span><span className={styles.homePpL}>como código</span></div>
              <div className={styles.homePpStat}><span className={styles.homePpV}>AWS</span><span className={styles.homePpL}>10+ Serviços</span></div>
              <div className={styles.homePpStat}><span className={styles.homePpV}>IA</span><span className={styles.homePpL}>como copiloto</span></div>
            </div>
            <span className={`btn ${styles.homePpBtn}`}>Ver o projeto</span>
          </Link>
        }
      />

      {/* Mais Lidos */}
      {popular.length > 0 && (
        <section className={styles.homeSection} id="mais-lidos">
          <div className="wrap">
            <div className="sec-head-row sec-head-row--center">
              <div className="left">
                <div className="sec-ey sec-ey--dual">Mais lidos</div>
                <h2 className="sec-t">Posts que mais engajaram</h2>
                <p className="sec-desc">Os que mais geraram leitura, debate e compartilhamentos. Comece por aqui.</p>
              </div>
            </div>
            <div className={styles.homeMlGrid} data-audit="home-ml-grid">
              {mlFeature1 && (
                <div className={styles.homeMlFeature}>
                  <div className={styles.homeMlRankLabel}>Mais lido · #1</div>
                  <Link className={`home-ml-card ${styles.homeMlCard}`} href={`/post/${mlFeature1.slug}`} data-audit="home-ml-card">
                    <div className={styles.homeMlNumBg} aria-hidden="true">01</div>
                    <div className={styles.homeMlCardInner}>
                      <span className={styles.homeMlCardCat}>{categoryName(mlFeature1)}</span>
                      <h3 className={styles.homeMlCardTitle}>{mlFeature1.titulo}</h3>
                      {mlFeature1.resumo && <p className={styles.homeMlCardExcerpt}>{mlFeature1.resumo}</p>}
                      <div className={styles.homeMlCardFoot}>
                        <div className={styles.homeMlCardMeta}>
                          <span>{formatDateShort(mlFeature1.data_publicacao)}</span>
                          <span>{mlFeature1.tempo_leitura_min || 5} min de leitura</span>
                        </div>
                        <span className={styles.homeMlCardRead}><ReadArticle /></span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {mlFeature2 && (
                <div className={styles.homeMlFeature}>
                  <div className={styles.homeMlRankLabel}>Mais lido · #2</div>
                  <Link className={`home-ml-card ${styles.homeMlCard}`} href={`/post/${mlFeature2.slug}`}>
                    <div className={styles.homeMlNumBg} aria-hidden="true">02</div>
                    <div className={styles.homeMlCardInner}>
                      <span className={styles.homeMlCardCat}>{categoryName(mlFeature2)}</span>
                      <h3 className={styles.homeMlCardTitle}>{mlFeature2.titulo}</h3>
                      {mlFeature2.resumo && <p className={styles.homeMlCardExcerpt}>{mlFeature2.resumo}</p>}
                      <div className={styles.homeMlCardFoot}>
                        <div className={styles.homeMlCardMeta}>
                          <span>{formatDateShort(mlFeature2.data_publicacao)}</span>
                          <span>{mlFeature2.tempo_leitura_min || 5} min de leitura</span>
                        </div>
                        <span className={styles.homeMlCardRead}><ReadArticle /></span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {mlList.length > 0 && (
                <div className={styles.homeMlList} data-audit="home-ml-list">
                  {mlList.map((post: HomePost, i: number) => (
                    <Link key={post.slug} className={`home-ml-item ${styles.homeMlItem}`} href={`/post/${post.slug}`}>
                      <span className={styles.homeMlItemNum} aria-hidden="true">{String(i + 3).padStart(2, '0')}</span>
                      <div className={styles.homeMlItemBody}>
                        <span className={styles.homeMlItemCat}>{categoryName(post)}</span>
                        <span className={styles.homeMlItemTitle}>{post.titulo}</span>
                        <div className={styles.homeMlItemMeta}>
                          <span>{formatDateShort(post.data_publicacao)}</span>
                          <span>{post.tempo_leitura_min || 5} min</span>
                        </div>
                      </div>
                      <span className={styles.homeMlItemArrow} aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Postagens Recentes */}
      <section className={`${styles.homeSection} ${styles.homeSectionSurface}`} id="recentes">
        <div className="wrap">
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Postagens recentes</div>
              <h2 className="sec-t">Direto do forno</h2>
              <p className="sec-desc">Últimos artigos publicados.<br />Problemas reais. Soluções aplicadas. Aprendizados compartilhados.</p>
            </div>
          </div>
          <div className={styles.homePostsGrid} data-audit="home-posts-grid">
            {recent.map((post: HomePost, i: number) => (
              <PostCard key={post.slug} post={post} dataAudit={i === 0 ? 'home-post-card' : undefined} />
            ))}
          </div>
          <div className={styles.homePostsCta}>
            <Link className={`btn ${styles.homeBtnOutlinePetrol}`} href="/todos-artigos">Todos os artigos</Link>
          </div>
        </div>
      </section>

      {/* Posts sobre IA */}
      {ia.length > 0 && (
        <section className={styles.homeIaSection} id="ia">
          <div className="wrap">
            <div className={`${styles.homeIaSecHeadRow} ${styles.homeIaSecHeadRowCenter}`}>
              <div className="left">
                <div className={`${styles.homeIaEy} ${styles.homeIaEyDual}`}>Inteligência Artificial</div>
                <h2 className={styles.homeIaTitle}>IA aplicada, sem hype</h2>
                <p className={styles.homeIaDesc}>Onde a IA realmente acelera, onde atrapalha, e o que ninguém te conta sobre usar modelos em produção.</p>
              </div>
            </div>
            <div className={styles.homeIaGrid} data-audit="home-ia-grid">
              {iaBig && (
                <Link className={`home-ia-big ${styles.homeIaBig}`} href={`/post/${iaBig.slug}`} data-audit="home-ia-big">
                  <div className={styles.homeIaBigCover}>
                    {iaBig.imagem_destaque_url && (
                      <ResponsiveImage
                        src={iaBig.imagem_destaque_url}
                        alt={iaBig.imagem_destaque_alt_text || iaBig.titulo}
                        fill
                        lqip={iaBig.imagem_lqip_base64}
                      />
                    )}
                    <span className={styles.homeIaBigCoverTag}>{categoryName(iaBig)}</span>
                  </div>
                  <div className={styles.homeIaBigBody}>
                    <span className={styles.homeIaBigCat}>{categoryName(iaBig)}</span>
                    <h3 className={styles.homeIaBigTitle}>{iaBig.titulo}</h3>
                    {iaBig.resumo && <p className={styles.homeIaBigExcerpt}>{iaBig.resumo}</p>}
                    <div className={styles.homeIaBigFoot}>
                      <div className={styles.homeIaBigMeta}>
                        <span>{formatDateShort(iaBig.data_publicacao)}</span>
                        <span>{iaBig.tempo_leitura_min || 5} min</span>
                      </div>
                      <span className={styles.homeIaRead}><ReadArticle /></span>
                    </div>
                  </div>
                </Link>
              )}
              {iaStack.length > 0 && (
                <div className={styles.homeIaStack}>
                  {iaStack.map((post: HomePost, i: number) => (
                    <Link key={post.slug} className={styles.homeIaSmall} href={`/post/${post.slug}`} data-audit={i === 0 ? 'home-ia-small' : undefined}>
                      <span className={styles.homeIaSmallCat}>{categoryName(post)}</span>
                      <h3 className={styles.homeIaSmallTitle}>{post.titulo}</h3>
                      {post.resumo && <p className={styles.homeIaSmallExcerpt}>{post.resumo}</p>}
                      <div className={styles.homeIaSmallFoot}>
                        <div className={styles.homeIaSmallMeta}>
                          <span>{formatDateShort(post.data_publicacao)}</span>
                          <span>{post.tempo_leitura_min || 5} min</span>
                        </div>
                        <span className={styles.homeIaRead}><ReadArticle /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.homeCtaEnd}>
              <Link className="btn" href="/categoria/inteligencia-artificial">Tudo sobre IA</Link>
            </div>
          </div>
        </section>
      )}

      {/* O Projeto */}
      {projeto.length > 0 && (
        <section className={`${styles.homeSection} ${styles.homeProjetoSection}`} id="projeto">
          <div className="wrap">
            <div className="sec-head-row sec-head-row--center">
              <div className="left">
                <div className="sec-ey sec-ey--dual">O Projeto · Build in Public</div>
                <h2 className="sec-t">Bastidores da plataforma</h2>
                <p className="sec-desc">Decisões, erros e custos documentados em tempo real. Um registro honesto de como se constrói uma plataforma editorial moderna.</p>
              </div>
            </div>
            <div className={styles.homeProjetoGrid} data-audit="home-projeto-grid">
              {projeto.map((post: HomePost) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className={styles.homeCtaEnd}>
              <Link className={`btn ${styles.homeBtnClayHero}`} href="/o-projeto">Acompanhe a jornada</Link>
            </div>
          </div>
        </section>
      )}

      <AdvisoryCta
        eyebrow="Do blog para o seu projeto"
        title="Gosta do que lê aqui? Aplico o mesmo na sua empresa."
        description="Tudo que você vê neste blog nasce de projetos reais. Se sua empresa enfrenta um desafio parecido com os que aparecem por aqui, ajudamos a resolver."
      />
    </>
  );
}
