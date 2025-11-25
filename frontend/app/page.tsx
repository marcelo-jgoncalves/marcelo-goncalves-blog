import Link from 'next/link';
import { getRecentPosts, getPopularPosts } from '@/lib/api'; // Importe getPopularPosts
import PostCard from '@/components/ui/PostCard';

export const revalidate = 60;

export default async function Home() {
  // Busca dados em paralelo
  const [recentData, popularData] = await Promise.all([
    getRecentPosts(),
    getPopularPosts().catch(() => ({ posts: [] })) // Tratamento de erro suave
  ]);

  const recentPosts = recentData.posts || [];
  const popularPosts = popularData.posts || [];

  return (
    <>
      {/* 1. Hero Section (CSS corrigido para degradê) */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Desvendando a Inteligência Artificial, AWS e DevOps detalhe por detalhe
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px', maxWidth: '700px', margin: '0 auto 30px', fontFamily: 'var(--font-inter)' }}>
            Análises profundas, tutoriais práticos e as últimas notícias do mundo da tecnologia, da AWS à OpenAI.
          </p>
          <Link href="/artigos" className="btn btn-primary">
            Ver Todos os Artigos
          </Link>
        </div>
      </section>

      {/* 2. AdSense */}
      <section style={{ padding: '30px 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <div className="container">
          <div className="adsense-placeholder">
            [ADSENSE LEADERBOARD]
          </div>
        </div>
      </section>

      {/* 3. Últimos Artigos */}
      <section className="container" style={{ padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--aws-dark)' }}>Últimos Artigos</h2>
          <p style={{ color: '#666' }}>O conteúdo mais recente sobre IA e Nuvem</p>
        </div>

        <div className="posts-grid">
          {recentPosts.map((post: any) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <div style={{ textAlign: 'right', marginTop: '25px' }}>
          <Link href="/artigos" style={{ color: 'var(--aws-orange)', fontWeight: 600, textDecoration: 'none' }}>
            Ver todos os artigos →
          </Link>
        </div>
      </section>

      {/* 4. Super Destaque: "O Projeto" (Atualizado) */}
      <section className="super-destaque">
        <div className="container">
          <h2>
            Um Blog sobre as tecnologias do futuro, construído <span className="highlight">quase</span> 100% com IA.
          </h2>
          {/* Ajuste: Removida a opacidade e definida a cor branca pura */}
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#ffffff', 
            opacity: 1, 
            maxWidth: '900px', 
            margin: '0 auto 30px', 
            fontFamily: 'var(--font-inter)' 
          }}>
            Acompanhe a jornada, os desafios e os custos reais de construir este site do zero na AWS.
          </p>
          <Link href="/o-projeto" className="btn btn-primary">
            Conheça "O Projeto" →
          </Link>
        </div>
      </section>

      {/* --- INSERIR APÓS O FECHAMENTO DA SECTION .super-destaque --- */}

      {/* 5. Populares & Mais Lidos */}
      <section style={{ padding: '80px 20px', backgroundColor: '#fdfdfd' }}>
        <div className="container">
          
          {/* Cabeçalho da Seção */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--aws-dark)' }}>
              Populares & Mais Lidos
            </h2>
            <p style={{ color: '#666', fontFamily: 'var(--font-inter)' }}>
              O conteúdo que a comunidade mais acessou
            </p>
          </div>

          {/* Grid de Posts */}
          <div className="posts-grid">
            {popularPosts.length > 0 ? (
              popularPosts.map((post: any) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              /* Fallback para visualização enquanto não há dados na API */
              <p className="text-center col-span-full" style={{ color: '#999', textAlign: 'center', width: '100%' }}>
                Carregando destaques ou sem dados disponíveis...
              </p>
            )}
          </div>

        </div>
      </section>

      {/* 6. Categorias (Layout atualizado) */}
      <section className="container" style={{ padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--aws-dark)' }}>Explore os Tópicos</h2>
        </div>
        {/* ... (O grid de categorias permanece o mesmo, mas com ícones ajustados se quiser) ... */}
        <div className="posts-grid">
            <div className="post-card" style={{ padding: '30px', textAlign: 'center' }}>
                <i className="fas fa-brain" style={{ fontSize: '2rem', color: 'var(--aws-orange)', marginBottom: '15px' }}></i>
                <h3>IA Generativa</h3>
            </div>
            <div className="post-card" style={{ padding: '30px', textAlign: 'center' }}>
                <i className="fas fa-cloud" style={{ fontSize: '2rem', color: 'var(--aws-orange)', marginBottom: '15px' }}></i>
                <h3>Tutoriais AWS</h3>
            </div>
            <div className="post-card" style={{ padding: '30px', textAlign: 'center' }}>
                <i className="fas fa-gears" style={{ fontSize: '2rem', color: 'var(--aws-orange)', marginBottom: '15px' }}></i>
                <h3>Engenharia & MLOps</h3>
            </div>
        </div>
      </section>

      {/* 7. CTA Newsletter */}
      <section className="cta" style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'var(--aws-dark)', color: 'white' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Quer se aprofundar?</h2>
          <p style={{ marginBottom: '30px', fontFamily: 'var(--font-inter)' }}>Receba análises exclusivas direto no seu e-mail.</p>
          <Link href="/newsletter" className="btn-outline">
            Inscrever-se agora
          </Link>
        </div>
      </section>
    </>
  );
}