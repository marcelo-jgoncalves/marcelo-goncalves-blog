/* frontend/app/o-projeto/page.tsx
   Redesign 2026 (petrol/clay/ivory) — réplica de specs/ESPECIFICACAO-O-PROJETO.md
   e e2e/visual-audit/fixtures/projeto.html, com dados reais do projeto. */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectPosts } from '@/lib/api';
import Pagination from '@/components/ui/Pagination';
import { formatDateShort } from '@/lib/format';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import CtaAssessoria from '@/components/ui/CtaAssessoria';
import LerArtigo from '@/components/ui/LerArtigo';
import PageHero from '@/components/ui/PageHero';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import IconTile from '@/components/ui/IconTile';
import { IconCICD } from '@/components/ui/InstitutionalIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBrain, faGear } from '@fortawesome/free-solid-svg-icons';
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
  imagem_destaque_url?: string;
  imagem_destaque_alt_text?: string;
  imagem_lqip_base64?: string;
}

function categoryName(post: ProjectPost): string {
  if (post?.categoria?.nome_exibicao) return post.categoria.nome_exibicao;
  return (post?.categoria_slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
}

const PRINCIPLES = [
  {
    t: 'Transparência radical',
    d: 'Custos, erros e decisões erradas são tão importantes quanto os acertos.',
    icon: <FontAwesomeIcon icon={faEye} />,
  },
  {
    t: 'IA como copiloto real',
    d: 'Não como hype, mas como ferramenta com limitações documentadas.',
    icon: <FontAwesomeIcon icon={faBrain} />,
  },
  {
    t: 'Engenharia em produção',
    d: 'Arquitetura que precisa funcionar de verdade, não só em demos.',
    icon: <FontAwesomeIcon icon={faGear} />,
  },
  {
    t: 'Sem pular etapas',
    d: 'Do primeiro commit ao primeiro real de receita, tudo documentado.',
    icon: <IconCICD />,
  },
];

const ROADMAP = [
  { num: 'P-01', status: 'planned', statusLabel: 'Planejado', title: 'Google Analytics', desc: 'Introdução de métricas reais de audiência, base para toda decisão de conteúdo e distribuição que vem a seguir.', foot: 'Previsão · Q1 2026', span: 4 },
  { num: 'P-02', status: 'planned', statusLabel: 'Planejado', title: 'Automação para LinkedIn', desc: 'Cada novo post publicado gera automaticamente uma versão adaptada para LinkedIn, ampliando alcance, fortalecendo autoridade e criando um canal recorrente de aquisição.', foot: 'Previsão · Q1 2026', span: 5 },
  { num: 'P-03', status: 'planned', statusLabel: 'Planejado', title: 'Automação para Instagram', desc: 'Mesma lógica do LinkedIn: adaptação automática do post original por IA e publicação direta na rede.', foot: 'Previsão · Q1 2026', span: 3 },
  { num: 'P-04', status: 'planned', statusLabel: 'Planejado', title: 'Newsletter automatizada', desc: 'Entrega automática de novos conteúdos por e-mail. Construção de audiência própria, sem dependência exclusiva de algoritmos, com foco em retenção e relacionamento.', foot: 'Previsão · Q1 2026', span: 5 },
  { num: 'P-05', status: 'planned', statusLabel: 'Planejado', title: 'Resumos com IA', desc: 'Síntese inteligente para cada artigo, facilitando leitura rápida, consumo técnico e navegação eficiente, sem perder profundidade no conteúdo completo.', foot: 'Previsão · Q2 2026', span: 4 },
  { num: 'P-06', status: 'planned', statusLabel: 'Planejado', title: 'Versão em inglês', desc: 'Expansão internacional com tradução assistida por IA e revisão humana, linguística e cultural, de cada artigo do blog.', foot: 'Previsão · Q2 2026', span: 3 },
  { num: 'P-07', status: 'planned', statusLabel: 'Planejado', title: 'Atendimento via WhatsApp com IA', desc: 'Triagem inicial automatizada por IA direto no WhatsApp, com escalonamento para atendimento humano quando necessário.', foot: 'Previsão · Q2 2026', span: 4 },
  { num: 'P-08', status: 'planned', statusLabel: 'Planejado', title: 'Nutrição automatizada de leads', desc: 'Sequência automatizada por IA a partir da assinatura da newsletter, combinada a gatilhos por comportamento de leitura, conduzindo o contato até o diagnóstico de consultoria.', foot: 'Previsão · Q3 2026', span: 8 },
  { num: 'F-01', status: 'future', statusLabel: 'Futuro', title: 'Ebook proprietário', desc: 'Material estruturado com os aprendizados e frameworks do projeto. Primeiro produto editorial pago da plataforma e base para novos cursos e materiais premium.', foot: 'Sem data definida', span: 6 },
  { num: 'F-02', status: 'future', statusLabel: 'Futuro', title: 'Ebook em inglês', desc: 'Versão traduzida do ebook proprietário, com revisão humana, para expansão do produto a mercados internacionais.', foot: 'Sem data definida', span: 6 },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }} />

      {/* HERO */}
      <PageHero
        singleColumn
        className="op-hero"
        dataAudit="op-hero"
        eyebrow="O Projeto · Build in Public"
        title={<>Mais que um blog. Uma <em>plataforma editorial</em> completa e construída para escalar com baixo custo.</>}
        subtitle="Cada decisão de arquitetura, cada erro, cada custo e cada automação documentados em tempo real. Um registro honesto de como construir uma plataforma com cloud, IA e engenharia aplicada."
      >
        <div className="op-hero-actions">
          <span className="op-status-badge"><span className="op-status-dot"></span>Em produção · Fase 1</span>
        </div>
      </PageHero>

      <div className="op-wrap">

        {/* SOBRE O PROJETO */}
        <div className="op-about-strip" data-audit="op-about-strip">
          <div className="op-left">
            <div className="op-ey2">O que é isso</div>
            <h2>Um blog que documenta a própria construção</h2>
            <p>A premissa é simples: construir uma plataforma editorial completa na AWS, usando IA em cada etapa e publicar tudo. Cada artigo é um registro real de uma decisão tomada, não um tutorial polido a posteriori.</p>
            <p>Nada de <strong>resultados sem o processo</strong>. Os erros ficam. Os custos aparecem. As trocas de stack acontecem ao vivo.</p>
          </div>
          <div className="op-right">
            {PRINCIPLES.map((p, i) => (
              <div className="op-principle" key={p.t} data-audit={i === 0 ? 'op-principle' : undefined}>
                <IconTile icon={p.icon} variant="petrol" />
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
          <div className="sec-head-row sec-head-row--center" data-audit="op-sec-header">
            <div className="left">
              <div className="sec-ey sec-ey--dual">A jornada</div>
              <h2 className="sec-t">Tudo que foi documentado</h2>
              <p className="sec-desc">Em ordem cronológica: cada post é um registro real de uma decisão, erro ou aprendizado.</p>
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
                    <Link className="op-tl-card" href={`/post/${post.slug}`} data-audit={i === 0 ? 'op-tl-card' : undefined}>
                      <div className="op-tl-num-bg">{String(num).padStart(2, '0')}</div>
                      {post.imagem_destaque_url && (
                        <div className="op-tl-cover">
                          <ResponsiveImage
                            src={post.imagem_destaque_url}
                            alt={post.imagem_destaque_alt_text || post.titulo}
                            fill
                            lqip={post.imagem_lqip_base64}
                          />
                        </div>
                      )}
                      <div className="op-tl-body">
                        <div className="op-tl-card-top">
                          <span className="op-tl-cat">{categoryName(post)}</span>
                          {isLatest && <span className="op-tl-badge op-latest-tag">Mais recente</span>}
                        </div>
                        <h3>{post.titulo}</h3>
                        {post.resumo && <p>{post.resumo}</p>}
                        <div className="op-tl-card-foot">
                          <div className="op-meta">
                            <span>{formatDateShort(post.data_publicacao)}</span>
                            <span>{post.tempo_leitura_min || 5} min</span>
                          </div>
                          <span className="op-read"><LerArtigo /></span>
                        </div>
                      </div>
                    </Link>
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

      </div>

      {/* PRÓXIMAS ETAPAS */}
      <section className="op-section op-section--surface" id="roadmap">
        <div className="op-wrap">
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">O que vem por aí</div>
              <h2 className="sec-t">Próximas etapas</h2>
              <p className="sec-desc">Visão de alto nível do que está sendo construído agora e o que está planejado para os próximos meses.</p>
            </div>
          </div>

          <div className="op-roadmap-grid" data-audit="op-roadmap-grid">
            {ROADMAP.map((item, i) => (
              <div
                className={`op-rm-card op-${item.status}`}
                style={{ gridColumn: `span ${item.span}` }}
                key={item.num}
                data-audit={i === 0 ? 'op-rm-card' : undefined}
              >
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
        </div>
      </section>

      <CtaAssessoria
        eyebrow="Viu como trabalhamos"
        title="É assim que construímos, inclusive para o seu negócio."
        description="Cada decisão documentada aqui reflete como trabalhamos na prática: transparência, engenharia sólida e foco em resultado. Vamos aplicar isso ao seu projeto."
      />
    </>
  );
}
