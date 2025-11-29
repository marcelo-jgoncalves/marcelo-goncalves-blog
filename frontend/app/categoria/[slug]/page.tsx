import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostCard from '@/components/ui/PostCard';
import AdSenseBanner from '@/components/ui/AdSenseBanner';

// Revalidação a cada 1 hora
export const revalidate = 3600;

// Interface para tipar a resposta da API
interface CategoryPageData {
  categoria: {
    nome_exibicao: string;
    descricao_seo: string;
    icone_fa: string; // Ex: "fa-solid fa-cloud"
  };
  posts: any[];
}

// Busca os dados da categoria e dos posts
async function getCategoryData(slug: string): Promise<CategoryPageData | null> {
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/categoria/${slug}`;
  
  try {
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Erro ao buscar categoria ${slug}:`, error);
    return null;
  }
}

// Gera o Metadata (Título e Descrição) dinâmico para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Await params necessário no Next.js 15
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data) {
    return { title: 'Categoria não encontrada | IA Decifrada' };
  }

  return {
    title: `${data.categoria.nome_exibicao} | IA Decifrada`,
    description: data.categoria.descricao_seo,
  };
}

// Componente da Página
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  // Se a categoria não existir na API, retorna 404
  if (!data) {
    notFound();
  }

  const { categoria, posts } = data;

  return (
    <>
      {/* 1. Category Hero */}
      <section className="hero-section"> {/* Reutilizando a classe do globals.css */}
        <div className="container">
          {/* Ícone da Categoria (Destaque visual) */}
          <div style={{ 
            fontSize: '3rem', 
            color: 'var(--aws-orange)', 
            marginBottom: '20px' 
          }}>
            <i className={categoria.icone_fa}></i>
          </div>

          <h1 className="hero-title">
            Artigos sobre: <span className="highlight">{categoria.nome_exibicao}</span>
          </h1>
          
          <p className="hero-subtitle">
            {categoria.descricao_seo}
          </p>
        </div>
      </section>

      {/* 2. Grid de Posts */}
      <section className="container" style={{ padding: '80px 20px' }}>
        
        {/* Banner Superior */}
        <div style={{ marginBottom: '60px' }}>
            <AdSenseBanner />
        </div>

        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post: any) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
              Ainda não há artigos nesta categoria.
            </p>
            <Link href="/artigos" className="btn btn-outline" style={{ color: 'var(--aws-dark)', borderColor: 'var(--aws-dark)' }}>
              Ver todos os artigos
            </Link>
          </div>
        )}

        {/* Paginação (Estática por enquanto, igual à página /artigos) */}
        {posts.length > 0 && (
          <nav className="pagination">
              <span className="page-numbers current">1</span>
              <Link href={`/categoria/${slug}/pagina/2`} className="page-numbers">2</Link>
              <Link href={`/categoria/${slug}/pagina/2`} className="page-numbers">Próxima &rarr;</Link>
          </nav>
        )}

        {/* Banner Inferior */}
        <div style={{ paddingTop: '40px' }}>
            <AdSenseBanner />
        </div>

      </section>

      {/* 3. CTA Newsletter */}
      <section className="cta">
        <div className="container">
            <h2>Quer dominar {categoria.nome_exibicao}?</h2>
            <p>Inscreva-se na nossa newsletter e receba os melhores guias e tutoriais diretamente no seu email.</p>
            <Link href="/newsletter" className="btn-outline">Inscrever-se agora</Link>
        </div>
      </section>
    </>
  );
}