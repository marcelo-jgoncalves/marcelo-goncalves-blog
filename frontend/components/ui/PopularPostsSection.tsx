// frontend/components/ui/PopularPostsSection.tsx

import Link from 'next/link';
import { getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard'; 

interface PopularPostsSectionProps {
  // Define o número máximo de posts a serem exibidos (4 ou 6)
  limit?: number; 
  // Define o layout do grid (post deve ser 2 colunas, home deve ser 3)
  variant: 'home' | 'post'; 
}

export default async function PopularPostsSection({ 
  limit = 6, // Padrão é 6 (para Home ou arquivo)
  variant,
}: PopularPostsSectionProps) {
  
  // Desestruturamos a resposta do fetch
  const { posts } = await getPopularPosts().catch(() => ({ posts: [] }));
  
  // Aplicamos o limite de posts
  const popularPosts = (posts || []).slice(0, limit); 

  // Se não houver posts ou posts suficientes, não renderiza a seção
  if (popularPosts.length === 0) {
    return null;
  }

  // Define a classe do grid dinamicamente (para 2 colunas ou 3 colunas)
  const gridClass = variant === 'post' 
    ? 'popular-posts-grid-post' 
    : 'popular-posts-grid-home'; // Usaremos 'popular-posts-grid-home' para 3 colunas

  return (
    <section className="popular-articles-section-wrapper">
      
      <div className="popular-section-content-wrapper">
        
        <div className="popular-section-header">
          <h2>Populares & Mais Lidos</h2>
          <p>O conteúdo que a comunidade mais acessou</p>
        </div>

        {/* Usa a classe dinâmica do grid */}
        <div className={gridClass}>
          {popularPosts.map((post: any) => (
            <PostCard key={post.slug} post={post} /> 
          ))}
        </div>
        
      </div>
    </section>
  );
}