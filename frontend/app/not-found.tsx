import './not-found.css';
import Link from 'next/link';
import { getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import NewsletterCTA from '@/components/ui/NewsletterCTA';

// Metadados são automáticos no not-found, mas podemos definir o título via layout se necessário,
// ou confiar no padrão. Como é um Server Component, fazemos o fetch aqui.

export default async function NotFound() {
  // Busca populares para retenção (fallback seguro para array vazio)
  const popularData = await getPopularPosts().catch(() => ({ posts: [] }));
  const popularPosts = popularData.posts || [];

  return (
    <>
      {/* 1. Hero de Erro */}
      <section className="error-hero">
        <div className="error-header-content">
          <div className="error-404-text">404</div>
          <h1>Página Não Encontrada</h1>
          <p className="error-subtitle">
            Ops! Parece que o link que você seguiu está quebrado ou a página que você procurava foi removida.
          </p>
        </div>
      </section>

      {/* 2. Busca de Retenção */}
      <section className="search-retention-container">
        <div className="container" style={{ padding: 0 }}> 
            <h2 className="retention-title">Tente buscar pelo assunto:</h2>
            <form className="archive-search-bar" action="/busca" method="get">
                <input 
                  type="search" 
                  name="q" 
                  className="search-input" 
                  placeholder="Buscar por AWS, Terraform, RAG..." 
                  aria-label="Buscar artigos"
                  required
                />
                <button type="submit" className="search-button">
                    <i className="fas fa-search"></i>
                </button>
            </form>
        </div>
      </section>

      {/* 3. Sugestões (Populares) */}
      <section className="container" style={{ padding: '60px 20px', marginTop: '40px' }}>
        <div className="section-header">
            {/* Reutilizando a classe visual do título de retenção */}
            <h2 className="retention-title" style={{ marginTop: 0 }}>
              Ou comece por um dos nossos artigos mais populares:
            </h2>
        </div>
        
        <div className="posts-grid">
            {popularPosts.length > 0 ? (
                popularPosts.slice(0, 3).map((post: any) => (
                    <PostCard key={post.slug} post={post} />
                ))
            ) : (
                <p className="text-center w-full text-gray-500">Carregando sugestões...</p>
            )}
        </div>
      </section>

      {/* 4. CTA Newsletter */}
      <NewsletterCTA />
    </>
  );
}