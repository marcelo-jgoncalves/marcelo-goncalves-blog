// frontend/components/ui/PopularPostsWidget.tsx

import { Suspense } from 'react';
import Link from 'next/link';
import { getPopularPosts } from '@/lib/api';
import Eyebrow from './Eyebrow';
import CategoryTag from './CategoryTag';
import './PopularPostsWidget.css';

interface PopularPost {
  slug: string;
  titulo: string;
  categoria_slug?: string;
}

interface PopularPostsWidgetProps {
  className?: string;
}

function slugToName(slug?: string): string {
  if (!slug) return '';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function PopularPostsSkeleton() {
  return (
    <div className="popular-widget__list" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="popular-widget__item--skeleton">
          <div className="popular-widget__skeleton-rank popular-widget__skeleton-pulse" />
          <div className="popular-widget__skeleton-body">
            <div className="popular-widget__skeleton-line popular-widget__skeleton-pulse" style={{ width: '55%', height: '10px' }} />
            <div className="popular-widget__skeleton-line popular-widget__skeleton-pulse" style={{ width: '100%' }} />
            <div className="popular-widget__skeleton-line popular-widget__skeleton-pulse" style={{ width: '75%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

async function PopularPostsList() {
  const { posts } = await getPopularPosts(5).catch(() => ({ posts: [] }));
  const topPosts: PopularPost[] = (posts || []).slice(0, 5);

  if (topPosts.length === 0) return null;

  return (
    <>
      <ul className="popular-widget__list">
        {topPosts.map((post, index) => (
          <li key={post.slug}>
            <Link href={`/post/${post.slug}`} className="popular-widget__link">
              <div className="number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="popular-widget__body">
                {post.categoria_slug && (
                  <CategoryTag text={slugToName(post.categoria_slug)} />
                )}
                <h4 className="popular-widget__post-title">{post.titulo}</h4>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function PopularPostsWidget({ className = '' }: PopularPostsWidgetProps) {
  const widgetClass = `popular-widget ${className}`.trim();

  return (
    <section className={widgetClass} aria-labelledby="popular-widget-title">
      <Eyebrow text="Mais lidos" />
      <h3 id="popular-widget-title" className="popular-widget__title">
        Postagens<br />mais<br />lidas da<br />plataforma
      </h3>
      <Suspense fallback={<PopularPostsSkeleton />}>
        <PopularPostsList />
      </Suspense>
    </section>
  );
}
