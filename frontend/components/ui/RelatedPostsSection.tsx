// frontend/components/ui/RelatedPostsSection.tsx
// TODO: receber `categoriaSlug` como prop e buscar posts pela categoria.
//       Trocar getPopularPosts() por getPostsByCategory(categoriaSlug, { limit: 3 })
//       quando o endpoint estiver integrado.

import Link from 'next/link';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import CategoryTag from '@/components/ui/CategoryTag';
import { getPopularPosts } from '@/lib/api';
import './RelatedPostsSection.css';

interface RelatedPost {
  slug: string;
  titulo: string;
  resumo?: string;
  categoria_slug?: string;
  imagem_destaque_url?: string;
  imagem_lqip_base64?: string;
  tempo_leitura_min?: number;
  data_publicacao?: string;
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
          <CategoryTag text={slugToName(post.categoria_slug)} />
        )}
        <h3 className="related-card__title" title={post.titulo}>{post.titulo}</h3>
        <div className="related-card__meta">
          {post.tempo_leitura_min && (
            <span className="related-card__meta-item">
              <i className="far fa-clock" aria-hidden="true" />
              {post.tempo_leitura_min} min
            </span>
          )}
          {post.data_publicacao && (
            <span className="related-card__meta-item">
              <i className="far fa-calendar" aria-hidden="true" />
              {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function RelatedPostsSection() {
  // TODO: substituir por getPostsByCategory(categoriaSlug, { limit: 4 })
  const { posts } = await getPopularPosts(6).catch(() => ({ posts: [] }));
  const related: RelatedPost[] = (posts || []).slice(0, 6);

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
