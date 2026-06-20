// frontend/components/ui/RelatedPostsSection.tsx
import Link from 'next/link';
import PostCard from '@/components/ui/PostCard';
import { getPopularPosts } from '@/lib/api';
import './RelatedPostsSection.css';

type RelatedPost = NonNullable<Parameters<typeof PostCard>[0]['post']>;

export default async function RelatedPostsSection() {
  const { posts } = await getPopularPosts(3).catch(() => ({ posts: [] }));
  const related: RelatedPost[] = (posts || []).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="post-wide post-related" data-audit="post-related">
      <div className="post-r-head" data-audit="post-r-head">
        <div>
          <div className="post-r-eyebrow">Continue explorando</div>
          <h2>Mais sobre IA &amp; engenharia</h2>
        </div>
        <Link className="post-r-all post-r-all-desktop" href="/artigos">Todos os artigos →</Link>
      </div>
      <div className="post-r-grid" data-audit="post-r-grid">
        {related.map((post) => (
          <PostCard
            key={post.slug}
            post={{ ...post, categoria_slug: post.categoria_slug || '' }}
            dataAudit="post-r-card"
          />
        ))}
      </div>
      <div className="post-r-all-mobile-wrap">
        <Link className="post-r-all-mobile" href="/artigos">Todos os artigos <span className="arrow">→</span></Link>
      </div>
    </div>
  );
}
