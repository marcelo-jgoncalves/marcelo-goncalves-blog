import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/api'; // Usando a função centralizada
import PostCard from '@/components/ui/PostCard';
import AdSenseBanner from '@/components/ui/AdSenseBanner';

export const metadata: Metadata = {
  title: 'Todos os Artigos | IA Decifrada',
  description: 'Explore nosso arquivo completo de tutoriais AWS, análises de IA e engenharia de software.',
};

export const revalidate = 3600;

export default async function ArtigosPage() {
  let posts = [];

  try {
    const data = await getAllPosts();
    posts = data.posts || [];
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
    // Em caso de erro, posts permanece array vazio [], não quebra a página
  }

  return (
    <>
      {/* 1. Search Hero */}
      <section className="search-hero">
        <div className="search-header-content">
          <h1>Explore Nossos Artigos</h1>
          <form className="archive-search-bar" action="/busca" method="get">
            <input 
              type="search" 
              name="q" 
              className="search-input" 
              placeholder="Buscar por AWS, Terraform, RAG..." 
              aria-label="Buscar artigos"
              required
            />
            <button type="submit" className="search-button" aria-label="Pesquisar">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </section>

      {/* 2. Grid de Posts */}
      <section className="post-grid-container">
        <div className="container">
            
            <div style={{ marginBottom: '60px' }}>
                <AdSenseBanner />
            </div>

            <div className="posts-grid">
                {posts.length > 0 ? (
                    posts.map((post: any) => (
                        <PostCard key={post.slug} post={post} />
                    ))
                ) : (
                    <p className="text-center col-span-full" style={{ color: '#666', padding: '40px 0' }}>
                        Nenhum artigo encontrado no momento.
                    </p>
                )}
            </div>
            
            {/* Paginação Estática (Visual) */}
            {posts.length > 0 && (
              <nav className="pagination">
                  <span className="page-numbers current">1</span>
                  <Link href="/artigos/pagina/2" className="page-numbers">2</Link>
                  <Link href="/artigos/pagina/3" className="page-numbers">3</Link>
                  <span className="page-numbers dots">...</span>
                  <Link href="/artigos/pagina/2" className="page-numbers">Próxima &rarr;</Link>
              </nav>
            )}

            <div style={{ paddingTop: '40px' }}>
                <AdSenseBanner />
            </div>

        </div>
      </section>

      {/* 3. CTA Newsletter */}
      <section className="cta">
        <div className="container">
            <h2>Quer se aprofundar em Inteligência Artificial?</h2>
            <p>Inscreva-se na nossa newsletter e receba análises exclusivas e os melhores artigos da semana direto no seu email.</p>
            <Link href="/newsletter" className="btn-outline">Inscrever-se agora</Link>
        </div>
      </section>
    </>
  );
}