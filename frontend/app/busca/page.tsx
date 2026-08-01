import { searchPosts, getPopularPosts } from '@/lib/api';
import PostCard, { type PostCardProps } from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import PageHero from '@/components/ui/PageHero';
import SearchBar from '@/components/ui/SearchBar';
import { SITE_NAME } from '@/lib/config';
import styles from './busca.module.css';

// SEO: don't index internal search results
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const term = params.q || 'Busca';
  return {
    // absolute (não string simples): sem isso, o template "%s | SITE_NAME"
    // do layout raiz aplica em cima de um título que já inclui SITE_NAME,
    // duplicando o nome do site na aba do navegador.
    title: { absolute: `Resultados para "${term}" | ${SITE_NAME}` },
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
        // --- SCENARIO A: Found Results ---
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
          <section className={`wrap ${styles.buscaSection}`} id="busca-resultados">
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className={styles.buscaPagWrap}>
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
        // --- SCENARIO B: Nothing Found (Retention Layout) ---
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
            <section className={`wrap ${styles.buscaSection}`}>
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
