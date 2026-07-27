/* frontend/app/todos-artigos/page.tsx */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getRecentPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { formatDateShort, categoryName } from '@/lib/format';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import LerArtigo from '@/components/ui/LerArtigo';
import PageHero from '@/components/ui/PageHero';
import SearchBar from '@/components/ui/SearchBar';
import './todos-artigos.css';

const TITLE = 'Todos os artigos sobre Cloud, Automação, IA e Engenharia | Marcelo Gonçalves';
const DESCRIPTION = 'Artigos técnicos e aprendizados de produção sobre AWS, DevOps, confiabilidade, automação, inteligência artificial e engenharia de software.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/todos-artigos` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/todos-artigos`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
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

interface TodosArtigosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LIMIT = 12;

export default async function TodosArtigosPage({ searchParams }: TodosArtigosPageProps) {
  const params = await searchParams;
  const nextToken  = typeof params.nextToken  === 'string' ? params.nextToken  : undefined;
  const prevTokens = typeof params.prevTokens === 'string' ? params.prevTokens : '';
  const page       = typeof params.page       === 'string' ? Math.max(1, parseInt(params.page)) : 1;

  const [allData, recentData] = await Promise.all([
    getAllPosts(nextToken, LIMIT).catch(() => null),
    getRecentPosts(1).catch(() => ({ posts: [] })),
  ]);

  const posts: ArtigoPost[] = allData?.posts || [];
  const nextPageToken = allData?.nextToken ?? undefined;
  const totalCount = allData?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / LIMIT) : 0;

  const recent: ArtigoPost[] = recentData?.posts || [];

  // Destaque só aparece na primeira página (sem cursor/página anterior aplicada)
  const feature = page === 1 && !nextToken ? recent[0] : undefined;

  // Exclui o destaque da grade, caso ele também apareça nos resultados paginados
  const gridPosts = feature ? posts.filter((p) => p.slug !== feature.slug) : posts;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Artigos", "item": `${SITE_URL}/artigos` },
      { "@type": "ListItem", "position": 3, "name": "Todos os artigos", "item": `${SITE_URL}/todos-artigos` },
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
        eyebrow="Artigos"
        title="Engenharia aplicada, decisões técnicas e aprendizados de produção."
        subtitle="Um acervo de aprendizados reais sobre cloud, automação, inteligência artificial e operações, do problema à solução."
      />

      {/* DESTAQUE */}
      {feature && (
        <section className="wrap art-masthead" data-audit="art-masthead">
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
                <span className="art-f-meta">
                  {formatDateShort(feature.data_publicacao)} · {feature.tempo_leitura_min || 5} min de leitura
                </span>
                <LerArtigo color="var(--petrol)" />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* BUSCA */}
      <section className="art-search-section" data-audit="art-search">
        <div className="wrap art-search-in">
          <label className="art-search-label" htmlFor="art-search-input">Pesquisar artigos</label>
          <SearchBar
            name="q"
            ariaLabel="Pesquisar artigos"
            placeholder="Busque por tema, tecnologia ou problema"
            dataAudit="art-search-bar"
          />
        </div>
      </section>

      {/* GRADE PRINCIPAL */}
      <section className="wrap art-section art-section--paginated">
        <div className="sec-head-row sec-head-row--center">
          <div className="left">
            <h2 className="sec-t" id="art-grid-title">Todos os artigos</h2>
            {totalCount > 0 && (
              <p className="art-count">
                {totalCount === 1 ? '1 artigo encontrado' : `${totalCount} artigos encontrados`}
              </p>
            )}
          </div>
        </div>

        {gridPosts.length > 0 ? (
          <div className="posts-grid art-grid" id="art-grid" data-audit="art-grid">
            {gridPosts.map((post) => (
              <PostCard key={post.slug} post={post} dataCat={post.categoria_slug} />
            ))}
          </div>
        ) : (
          <div className="art-empty show" id="art-empty">
            <div className="art-e-t">Novos artigos estão em preparação.</div>
            <div className="art-e-s">O conteúdo será publicado quando estiver revisado e pronto para leitura.</div>
          </div>
        )}

        <div className="art-load-wrap">
          <Pagination
            basePath="/todos-artigos"
            page={page}
            totalPages={totalPages}
            nextToken={nextPageToken}
            currentPageToken={nextToken}
            prevTokens={prevTokens}
            scrollToId="art-grid-title"
          />
        </div>
      </section>

      {/* CTA EDITORIAL COMPACTO */}
      <section className="wrap art-cta-editorial" data-audit="art-cta-editorial">
        <div className="art-cta-in">
          <div className="sec-ey sec-ey--dual">Aplicação prática</div>
          <h2>Precisa transformar um desafio técnico em uma solução para a operação?</h2>
          <p>Conheça as frentes de atuação da consultoria ou apresente o contexto que sua empresa precisa resolver.</p>
          <div className="art-cta-actions">
            <Link className="btn" href="/servicos">Conhecer os serviços</Link>
            <Link className="btn btn-petrol" href="/contato">Apresentar um desafio</Link>
          </div>
        </div>
      </section>
    </>
  );
}
