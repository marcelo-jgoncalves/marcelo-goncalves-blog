import './busca.css';
import { searchPosts, getPopularPosts } from '@/lib/api';
import PostCard, { type PostCardProps } from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import PageHero from '@/components/ui/PageHero';
import SearchBar from '@/components/ui/SearchBar';
import { SITE_NAME } from '@/lib/config';

// SEO: Não indexar resultados de busca interna
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const term = params.q || 'Busca';
  return {
    title: `Resultados para "${term}" | ${SITE_NAME}`,
    description: `Resultados da busca por ${term}.`,
    robots: 'noindex, follow',
  };
}

export const revalidate = 60;

interface BuscaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuscaPage({ searchParams }: BuscaPageProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const nextToken = typeof params.nextToken === 'string' ? params.nextToken : undefined;

  let posts: PostCardProps['post'][] = [];
  let popularPosts: PostCardProps['post'][] = [];
  let nextPageToken = undefined;

  // Busca em paralelo
  const [searchData, popularData] = await Promise.all([
    q ? searchPosts(q, nextToken) : Promise.resolve({ posts: [], nextToken: undefined }),
    getPopularPosts().catch(() => ({ posts: [] }))
  ]);

  posts = searchData.posts || [];
  nextPageToken = searchData.nextToken;
  popularPosts = popularData.posts || [];

  const hasResults = posts.length > 0;

  const searchForm = <SearchBar defaultValue={q} />;

  return (
    <>
      {hasResults ? (
        // --- CENÁRIO A: Encontrou Resultados ---
        <>
          <PageHero
            singleColumn
            className="busca-hero"
            dataAudit="busca-hero"
            eyebrow="Resultados da busca"
            title={<>Resultados para <em>&ldquo;{q}&rdquo;</em></>}
            subtitle="Encontramos estes artigos para sua pesquisa."
          >
            {searchForm}
          </PageHero>
          <section className="wrap busca-section" id="busca-resultados">
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="busca-pag-wrap">
              <Pagination
                nextToken={nextPageToken}
                basePath="/busca"
                currentPageToken={nextToken}
                scrollToId="busca-resultados"
              />
            </div>
          </section>
        </>
      ) : (
        // --- CENÁRIO B: Nada Encontrado (Layout de Retenção) ---
        <>
          <PageHero
            singleColumn
            className="busca-hero"
            dataAudit="busca-hero-empty"
            eyebrow="Busca"
            title={<>Ainda não escrevi sobre <em>&ldquo;{q}&rdquo;</em></>}
            subtitle="Mas talvez este seja um ótimo tema para um futuro post. Que tal tentar um outro termo?"
          >
            {searchForm}
          </PageHero>
          {popularPosts.length > 0 && (
            <section className="wrap busca-section">
              <div className="sec-head-row sec-head-row--center">
                <div className="left">
                  <div className="sec-ey sec-ey--dual">Sugestões</div>
                  <h2 className="sec-t">Comece pelos artigos mais lidos</h2>
                </div>
              </div>
              <div className="posts-grid">
                {popularPosts.slice(0, 3).map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
