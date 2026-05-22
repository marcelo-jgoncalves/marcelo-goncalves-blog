// frontend/components/ui/RelatedPostsSection.tsx
// TODO: receber `categoriaSlug` como prop e buscar posts pela categoria.
//       Trocar getPopularPosts() por getPostsByCategory(categoriaSlug, { limit: 3 })
//       quando o endpoint estiver integrado.

import Link from 'next/link';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { getPopularPosts } from '@/lib/api';
import './RelatedPostsSection.css';

interface RelatedPost {
  slug: string;
  titulo: string;
  resumo?: string;
  categoria_slug?: string;
  imagem_destaque_url?: string;
  imagem_lqip_base64?: string;
}

function slugToName(slug?: string): string {
  if (!slug) return '';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function RelatedPostCard({ post }: { post: RelatedPost }) {
  return (
    <Link href={`/post/${post.slug}`} className="related-card" aria-label={post.titulo}>
      {post.imagem_destaque_url && (
        <div className="related-card__image-wrapper">
          <ResponsiveImage
            src={post.imagem_destaque_url}
            alt={post.titulo}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="related-card__image"
            lqip={post.imagem_lqip_base64}
          />
        </div>
      )}
      <div className="related-card__body">
        {post.categoria_slug && (
          <span className="related-card__category">
            {slugToName(post.categoria_slug)}
          </span>
        )}
        <h3 className="related-card__title">{post.titulo}</h3>
        {post.resumo && (
          <p className="related-card__desc">{post.resumo}</p>
        )}
        <span className="related-card__cta">Ler artigo →</span>
      </div>
    </Link>
  );
}

export default async function RelatedPostsSection() {
  // TODO: substituir por getPostsByCategory(categoriaSlug, { limit: 4 })
  const { posts } = await getPopularPosts(4).catch(() => ({ posts: [] }));
  const related: RelatedPost[] = (posts || []).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="related-posts-section">
      <div className="related-posts-section__header">
        <div className="related-posts-section__bar" aria-hidden="true" />
        <h2 className="related-posts-section__title">Continue explorando</h2>
      </div>

      <div className="related-posts-section__grid">
        {related.map((post) => (
          <RelatedPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
