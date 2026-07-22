import './not-found.css';
import { getPopularPosts } from '@/lib/api';
import PostCard, { type PostCardProps } from '@/components/ui/PostCard';
import PageHero from '@/components/ui/PageHero';
import SearchBar from '@/components/ui/SearchBar';

// Metadados são automáticos no not-found, mas podemos definir o título via layout se necessário,
// ou confiar no padrão. Como é um Server Component, fazemos o fetch aqui.

export default async function NotFound() {
  // Busca populares para retenção (fallback seguro para array vazio)
  const popularData = await getPopularPosts().catch(() => ({ posts: [] }));
  const popularPosts: PostCardProps['post'][] = popularData.posts || [];

  return (
    <>
      <PageHero
        singleColumn
        className="error-hero"
        dataAudit="error-hero"
        eyebrow="Erro 404"
        title="Página não encontrada"
        subtitle="Ops! Parece que o link que você seguiu está quebrado ou a página que você procurava foi removida."
      >
        <SearchBar ariaLabel="Buscar artigos" placeholder="Buscar por AWS, Terraform, RAG…" />
      </PageHero>

      {popularPosts.length > 0 && (
        <section className="wrap error-section">
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Sugestões</div>
              <h2 className="sec-t">Comece pelos artigos mais populares</h2>
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
  );
}
