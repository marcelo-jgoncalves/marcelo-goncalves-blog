// frontend/components/ui/PopularPostsWidget.tsx

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPopularPosts } from '@/lib/api';
import './PopularPostsWidget.css';

interface PopularPost {
  slug: string;
  titulo: string;
  imagem_destaque_url?: string;
}

interface PopularPostsWidgetProps {
  // Permite injetarmos uma classe modificadora (ex: popular-widget--mobile)
  className?: string; 
}

// 1. O Skeleton State (Pilar: Performance e Zero CLS)
function PopularPostsSkeleton() {
  // Mockamos 4 itens para preencher o espaço enquanto carrega
  const skeletonItems = Array.from({ length: 4 });

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
  const { posts } = await getPopularPosts().catch(() => ({ posts: [] }));
  const topPosts: PopularPost[] = (posts || []).slice(0, 4); // Limitamos a 4 na lateral para não ficar massante

  if (topPosts.length === 0) return null;

  return (
    <ul className="popular-widget__list">
      {topPosts.map((post) => (
        <li key={post.slug} className="popular-widget__item">
          <Link href={`/post/${post.slug}`} className="popular-widget__link">
            
            {post.imagem_destaque_url && (
              <div className="popular-widget__image-wrapper">
                <Image
                  src={post.imagem_destaque_url}
                  alt={`Ler artigo: ${post.titulo}`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 350px" // Mobile: full width, Desktop: tamanho da sidebar
                  className="popular-widget__image"
                  loading="lazy" // Sidebar não é prioridade de LCP, preservamos banda
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