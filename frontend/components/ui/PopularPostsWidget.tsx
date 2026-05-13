// frontend/components/ui/PopularPostsWidget.tsx

import { Suspense } from 'react';
import Link from 'next/link';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { getPopularPosts } from '@/lib/api';
import './PopularPostsWidget.css';

interface PopularPost {
  slug: string;
  titulo: string;
  imagem_destaque_url?: string;
  imagem_lqip_base64?: string;
}

interface PopularPostsWidgetProps {
  // Permite injetarmos uma classe modificadora (ex: popular-widget--mobile)
  className?: string; 
}

// 1. O Skeleton State (Pilar: Performance e Zero CLS)
function PopularPostsSkeleton() {
  // Mockamos 4 itens para preencher o espaço enquanto carrega
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className="popular-widget__list" aria-hidden="true">
      {skeletonItems.map((_, index) => (
        <div key={index} className="popular-widget__item">
          <div className="popular-widget__image-wrapper popular-widget__skeleton-pulse" />
          <div className="popular-widget__skeleton-text popular-widget__skeleton-pulse" />
          <div className="popular-widget__skeleton-text popular-widget__skeleton-pulse" style={{ width: '80%' }} />
        </div>
      ))}
    </div>
  );
}

// 2. O Componente Assíncrono (Pilar: React/Next.js Best Practices)
async function PopularPostsList() {
  const { posts } = await getPopularPosts(5).catch(() => ({ posts: [] }));
  const topPosts: PopularPost[] = (posts || []).slice(0, 5);

  if (topPosts.length === 0) return null;

  return (
    <ul className="popular-widget__list">
      {topPosts.map((post, index) => (
        <li key={post.slug} className="popular-widget__item">
          <Link href={`/post/${post.slug}`} className="popular-widget__link">

            {post.imagem_destaque_url && (
              <div className="popular-widget__image-wrapper">
                <span className="popular-widget__rank" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <ResponsiveImage
                  src={post.imagem_destaque_url}
                  alt={`Ler artigo: ${post.titulo}`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 350px"
                  className="popular-widget__image"
                  lqip={post.imagem_lqip_base64}
                />
              </div>
            )}

            <h4 className="popular-widget__post-title">{post.titulo}</h4>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// 3. O Wrapper Principal (Pilar: SEO e Semântica)
export default function PopularPostsWidget({ className = '' }: PopularPostsWidgetProps) {
  // Pilar React: Composição limpa de classes
  const widgetClass = `popular-widget ${className}`.trim();

  return (
    <section className={widgetClass} aria-labelledby="popular-widget-title">
      <h3 id="popular-widget-title" className="popular-widget__title">
        Mais Lidos
      </h3>
      
      <Suspense fallback={<PopularPostsSkeleton />}>
        <PopularPostsList />
      </Suspense>
    </section>
  );
}