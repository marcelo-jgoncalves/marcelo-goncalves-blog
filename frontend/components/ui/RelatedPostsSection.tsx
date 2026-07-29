import Link from 'next/link';
import PostCard from '@/components/ui/PostCard';
import { getPopularPosts } from '@/lib/api';
import './RelatedPostsSection.css';

type RelatedPost = NonNullable<Parameters<typeof PostCard>[0]['post']>;

interface RelatedPostsSectionProps {
  excludeSlug?: string;
}

export default async function RelatedPostsSection({ excludeSlug }: RelatedPostsSectionProps) {
  const { posts }: { posts: RelatedPost[] } = await getPopularPosts(4).catch(() => ({ posts: [] }));
  const related: RelatedPost[] = (posts || []).filter((p) => p.slug !== excludeSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="post-wide post-related" data-audit="post-related">
      <div className="post-r-head" data-audit="post-r-head">
        <div>
          <h2>Continue explorando</h2>
        </div>
        <Link className="post-r-all post-r-all-desktop" href="/todos-artigos">Todos os artigos →</Link>
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
        <Link className="post-r-all-mobile" href="/todos-artigos">Todos os artigos <span className="arrow">→</span></Link>
      </div>
    </div>
  );
}
