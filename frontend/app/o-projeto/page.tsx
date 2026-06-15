/* frontend/app/o-projeto/page.tsx
   Redesign 2026 (petrol/clay/ivory) — réplica de specs/ESPECIFICACAO-O-PROJETO.md
   e e2e/visual-audit/fixtures/projeto.html, com dados reais do projeto. */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectPosts } from '@/lib/api';
import Pagination from '@/components/ui/Pagination';
import { formatDateShort } from '@/lib/format';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
import './o-projeto.css';

const DESCRIPTION = 'Acompanhe a jornada, os desafios técnicos, custos e aprendizados de construir um blog de alta performance do zero usando IA, AWS e OpenNext.';

export const metadata: Metadata = {
  title: { absolute: `O Projeto | ${SITE_NAME}` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/o-projeto` },
  openGraph: {
    title: `O Projeto | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/o-projeto`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `O Projeto | ${SITE_NAME}`,
    description: DESCRIPTION,
    creator: AUTHOR_TWITTER,
  },
};

export const revalidate = 300;

interface ProjectPost {
  slug: string;
  titulo: string;
  resumo?: string;
  categoria_slug?: string;
  categoria?: { nome_exibicao: string };
  data_publicacao?: string;
  tempo_leitura_min?: number;
}

function categoryName(post: ProjectPost): string {
  if (post?.categoria?.nome_exibicao) return post.categoria.nome_exibicao;
  return (post?.categoria_slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
}

const PRINCIPLES = [
  { t: 'Transparência radical', d: 'Custos, erros e decisões erradas são tão importantes quanto os acertos.' },
  { t: 'IA como copiloto real', d: 'Não como hype — como ferramenta com limitações documentadas.' },
  { t: 'Engenharia em produção', d: 'Arquitetura que precisa funcionar de verdade, não só em demos.' },
  { t: 'Sem pular etapas', d: 'Do primeiro commit ao primeiro real de receita — tudo documentado.' },
];

const ROADMAP = [
  { num: 'E-01', status: 'doing', statusLabel: 'Em andamento', title: 'Sistema de comentários nativo', desc: 'Discussão integrada nos posts, sem dependência de ferramentas de terceiros. Autenticação leve, moderação simples.', foot: 'Previsão · Q1 2026' },
  { num: 'E-02', status: 'doing', statusLabel: 'Em andamento', title: 'Design system documentado', desc: 'Tokens de cor, tipografia e componentes formalizados. Base para a plataforma escalar sem inconsistência visual.', foot: 'Previsão · Q1 2026' },
  { num: 'P-01', status: 'planned', statusLabel: 'Planejado', title: 'Newsletter automatizada', desc: 'Cada novo post entregue por e-mail. Avaliando Beehiiv vs. solução própria com SES — com os critérios publicados no blog.', foot: 'Previsão · Q1 2026' },
  { num: 'P-02', status: 'planned', statusLabel: 'Planejado', title: 'Monetização com AdSense', desc: 'Integração e posicionamento de anúncios sem destruir a leitura. Métricas de receita publicadas mensalmente.', foot: 'Previsão · Q2 2026' },
  { num: 'P-03', status: 'planned', statusLabel: 'Planejado', title: 'Busca nativa', desc: 'Search sem dependência de Algolia ou Elasticsearch. Explorando solução com embeddings e busca semântica no próprio banco.', foot: 'Previsão · Q2 2026' },
  { num: 'F-01', status: 'future', statusLabel: 'Futuro', title: 'Dashboard público de métricas', desc: 'Tráfego, custo AWS, receita e crescimento — ao vivo, visíveis para qualquer visitante. A transparência radical na prática.', foot: 'Sem data definida' },
];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LIMIT = 6;

export default async function OProjetoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextToken  = typeof params.nextToken  === 'string' ? params.nextToken  : undefined;
  const prevTokens = typeof params.prevTokens === 'string' ? params.prevTokens : '';
  const page       = typeof params.page       === 'string' ? Math.max(1, parseInt(params.page)) : 1;

  const data = await getProjectPosts(nextToken, LIMIT).catch(() => null);
  const posts: ProjectPost[] = data?.posts || [];
  const nextPageToken = data?.nextToken ?? undefined;
  const totalCount: number = data?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / LIMIT) : 0;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "O Projeto", "item": `${SITE_URL}/o-projeto` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* HERO */}
      <section className="op-hero" data-audit="op-hero">
        <div className="op-hero-in" data-audit="op-hero-in">
          <div className="op-hero-left">
            <div className="op-ey">O Projeto · Build in Public</div>
            <h1>Construindo este blog em público, <em>do zero</em></h1>
            <p className="op-sub">Cada decisão de arquitetura, cada erro, cada custo — documentados em tempo real. Um registro honesto de como se constrói uma plataforma editorial com AWS e IA.</p>
            <div className="op-hero-actions">
              <a className="op-btn-clay-hero" href="#timeline">Ver a jornada <span className="op-arrow">→</span></a>
              <span className="op-status-badge"><span className="op-status-dot"></span>Em produção · Fase 1</span>
            </div>
          </div>
          <div className="op-hero-stat" data-audit="op-hero-stat">
            <div className="op-hstat-item">
              <span className="op-big">{totalCount}</span>
              <span className="op-cap">posts publicados</span>
            </div>
            <div className="op-hstat-item op-clay-item">
              <span className="op-big op-clay-num">{ROADMAP.length}</span>
              <span className="op-cap op-clay-cap">próximas etapas</span>
            </div>
          </div>
        </div>
        <div className="op-stats-strip" data-audit="op-stats-strip">
          <div className="op-stat-item">
            <span className="op-v">{totalCount}</span>
            <span className="op-l">Posts publicados</span>
          </div>
          <div className="op-stat-item">
            <span className="op-v">4 mo</span>
            <span className="op-l">Em produção</span>
          </div>
          <div className="op-stat-item">
            <span className="op-v">12</span>
            <span className="op-l">Serviços AWS</span>
          </div>
          <div className="op-stat-item">
            <span className="op-v">~100%</span>
            <span className="op-l">Construído com IA</span>
          </div>
        </div>
      </section>

      <div className="op-wrap">

        {/* SOBRE O PROJETO */}
        <div className="op-about-strip" data-audit="op-about-strip">
          <div className="op-left">
            <div className="op-ey2">O que é isso</div>
            <h2>Um blog que documenta a própria construção</h2>
            <p>A premissa é simples: construir uma plataforma editorial completa na AWS, usando IA em cada etapa — e publicar tudo. Cada artigo é um registro real de uma decisão tomada, não um tutorial polido a posteriori.</p>
            <p>Nada de <strong>resultados sem o processo</strong>. Os erros ficam. Os custos aparecem. As trocas de stack acontecem ao vivo.</p>
          </div>
          <div className="op-right">
            {PRINCIPLES.map((p, i) => (
              <div className="op-principle" key={p.t} data-audit={i === 0 ? 'op-principle' : undefined}>
                <div className="op-tile">{String(i + 1).padStart(2, '0')}</div>
                <div className="op-txt">
                  <div className="op-t">{p.t}</div>
                  <div className="op-d">{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIMELINE DE POSTS */}
        <section className="op-section" id="timeline">
          <div className="op-sec-header" data-audit="op-sec-header">
            <div>
              <div className="op-sec-eyebrow">A jornada</div>
              <h2 className="op-sec-title">Tudo que foi documentado</h2>
              <p className="op-sec-desc">Em ordem cronológica — cada post é um registro real de uma decisão, erro ou aprendizado.</p>
            </div>
            <div>
              <div className="op-count"><strong>{totalCount}</strong> posts publicados</div>
            </div>
          </div>

          {posts.length === 0 ? (
            <p className="op-empty-state">Nenhuma atualização do projeto publicada ainda.</p>
          ) : (
            <div className="op-timeline">
              {posts.map((post, i) => {
                const num = (page - 1) * LIMIT + i + 1;
                const isLatest = page === totalPages && i === posts.length - 1;
                return (
                  <div className={`op-tl-entry${isLatest ? ' op-latest' : ''}`} key={post.slug}>
                    <div className="op-tl-card" data-audit={i === 0 ? 'op-tl-card' : undefined}>
                      <div className="op-tl-num-bg">{String(num).padStart(2, '0')}</div>
                      <div className="op-tl-card-top">
                        <span className="op-tl-cat">{categoryName(post)}</span>
                        {isLatest ? (
                          <span className="op-tl-badge op-latest-tag">Mais recente</span>
                        ) : (
                          <span className="op-tl-badge op-pub">Publicado</span>
                        )}
                      </div>
                      <h3>{post.titulo}</h3>
                      {post.resumo && <p>{post.resumo}</p>}
                      <div className="op-tl-card-foot">
                        <div className="op-meta">
                          <span>{formatDateShort(post.data_publicacao)}</span>
                          <span>{post.tempo_leitura_min || 5} min</span>
                        </div>
                        <Link className="op-read" href={`/post/${post.slug}`}>Ler artigo →</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="op-pag-wrap">
            <Pagination
              basePath="/o-projeto"
              page={page}
              totalPages={totalPages}
              nextToken={nextPageToken}
              currentPageToken={nextToken}
              prevTokens={prevTokens}
              scrollToId="timeline"
            />
          </div>
        </section>

        {/* PRÓXIMAS ETAPAS */}
        <section className="op-section" id="roadmap">
          <div className="op-sec-header">
            <div>
              <div className="op-sec-eyebrow">O que vem por aí</div>
              <h2 className="op-sec-title">Próximas etapas</h2>
              <p className="op-sec-desc">Visão de alto nível do que está sendo construído agora e o que está planejado para os próximos meses.</p>
            </div>
          </div>

          <div className="op-roadmap-grid" data-audit="op-roadmap-grid">
            {ROADMAP.map((item, i) => (
              <div className={`op-rm-card op-${item.status}`} key={item.num} data-audit={i === 0 ? 'op-rm-card' : undefined}>
                <div className="op-rm-top">
                  <span className="op-rm-num">{item.num}</span>
                  <span className={`op-rm-status op-s-${item.status}`}>
                    {item.status === 'doing' && <span className="op-sdot"></span>}
                    {item.statusLabel}
                  </span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                <div className="op-rm-foot">{item.foot}</div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* CTA ASSESSORIA */}
      <section className="op-cta-adv" id="assessoria" data-audit="op-cta-adv">
        <div className="op-cta-adv-in" data-audit="op-cta-adv-in">
          <div>
            <div className="op-cta-ey">Assessoria &amp; Consultoria</div>
            <h2>Precisa de ajuda para <em>construir</em> ou escalar na nuvem?</h2>
            <p className="op-cta-desc">Levo a mesma engenharia que você lê aqui para o seu projeto — da arquitetura ao deploy, com IA acelerando cada etapa.</p>
            <ul className="op-points">
              <li>
                <span className="op-ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                <span>Arquitetura <b>AWS</b> sob medida, sem desperdício de custo</span>
              </li>
              <li>
                <span className="op-ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                <span>Automação e <b>CI/CD</b> de ponta a ponta em código</span>
              </li>
              <li>
                <span className="op-ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                <span>Adoção de <b>IA</b> com foco em resultado, não em hype</span>
              </li>
            </ul>
          </div>
          <div>
            <div className="op-adv-card" data-audit="op-adv-card">
              <div className="op-tagline"><span className="op-tagline-dot"></span>Disponível para novos projetos</div>
              <h3>Vamos conversar sobre o seu</h3>
              <p className="op-adv-sub">Diagnóstico inicial gratuito. Conte o desafio e eu retorno com um plano objetivo.</p>
              <div className="op-svc">
                <span>Cloud · AWS</span>
                <span>DevOps</span>
                <span>IA aplicada</span>
                <span>Mentoria</span>
              </div>
              <Link className="op-btn-adv" href="/servicos">Conhecer a assessoria <span className="op-arrow">→</span></Link>
              <div className="op-reassure">Resposta em até 24h · sem compromisso</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
