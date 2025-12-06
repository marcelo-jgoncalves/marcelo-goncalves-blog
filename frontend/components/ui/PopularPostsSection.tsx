// frontend/components/ui/PopularPostsSection.tsx
import Link from 'next/link';
import { getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';

export default async function PopularPostsSection() {
  // Busca os dados diretamente no componente (Server Component)
  const data = await getPopularPosts().catch(() => ({ posts: [] }));
  const popularPosts = data.posts || [];

  // Se não houver posts, não renderiza a seção (evita espaço em branco inútil)
  if (popularPosts.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#fdfdfd', borderTop: '1px solid var(--gray-border)' }}>
      <div className="container">
        <div className="section-header">
          <h2>Populares & Mais Lidos</h2>
          <p>O conteúdo que a comunidade mais acessou</p>
        </div>

        <div className="posts-grid">
          {popularPosts.map((post: any) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}