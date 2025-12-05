import Link from 'next/link';
import { getProjectPosts } from '@/lib/api';
import Pagination from '@/components/ui/Pagination';
import NewsletterCTA from '@/components/ui/NewsletterCTA';

export const metadata = {
  title: 'O Projeto | Construindo um Blog com IA na AWS',
  description: 'Acompanhe a jornada, os desafios técnicos e os custos de construir este blog do zero usando arquitetura Serverless.',
};

export const revalidate = 60;

interface ProjetoPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjetoPage({ searchParams }: ProjetoPageProps) {
  const params = await searchParams;
  const nextToken = typeof params.nextToken === 'string' ? params.nextToken : undefined;

  let posts = [];
  let nextPageToken = undefined;

  try {
    const data = await getProjectPosts(nextToken);
    posts = data.posts || [];
    nextPageToken = data.nextToken;
  } catch (error) {
    console.error("Erro ao carregar projeto:", error);
  }

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            O Projeto: Construindo um Blog <span className="highlight">quase</span> 100% com IA
          </h1>
          <p className="hero-subtitle">
            Acompanhe a jornada, os desafios técnicos, os custos e os aprendizados de construir este blog do zero, usando IA em cada etapa da arquitetura 100% serverless na AWS.
          </p>
        </div>
      </section>

      <div className="container">
        
        {/* 1. BANNER SUPERIOR (Fora da Timeline, Alinhado via Wrapper) */}
        <div className="timeline-banner-wrapper">
            <div className="adsense-placeholder" style={{ width: '100%', height: '90px' }}>
                [ADSENSE LEADERBOARD - ALINHADO]
            </div>
        </div>

        {/* 2. TIMELINE (Apenas Posts) */}
        <div className="timeline-grid">
          
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post.slug} className="timeline-row">
                
                {/* Coluna 1: Bolinha */}
                <div className="timeline-cell-dot">
                  <div className="timeline-dot"></div>
                </div>

                {/* Coluna 2: Card */}
                <div className="timeline-cell-content">
                  <article className="timeline-card">
                    <span className="post-tag" style={{ marginBottom: '10px', display: 'inline-block' }}>
                      {post.categoria_slug}
                    </span>
                    <h2>
                      <Link href={`/post/${post.slug}`}>
                        {post.titulo}
                      </Link>
                    </h2>
                    <p style={{ color: '#666', fontSize: '1rem' }}>
                      {post.resumo}
                    </p>
                    <Link href={`/post/${post.slug}`} className="read-more" style={{ marginTop: '15px', display: 'inline-block', color: 'var(--aws-orange)', fontWeight: 600 }}>
                      Ler capítulo completo &rarr;
                    </Link>
                  </article>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10" style={{ gridColumn: '2 / 3' }}>
              <p>Os capítulos desta série estão sendo escritos. Volte em breve!</p>
            </div>
          )}

        </div>

        <Pagination nextToken={nextPageToken} basePath="/o-projeto" />

        {/* 3. BANNER INFERIOR (Alinhado via Wrapper) */}
        <div className="timeline-banner-wrapper" style={{ margin: '40px auto 60px auto' }}>
             <div className="adsense-placeholder" style={{ width: '100%', height: '90px' }}>
                [ADSENSE LEADERBOARD - ALINHADO]
            </div>
        </div>

      </div>

      <section style={{ padding: '80px 20px', backgroundColor: '#f8fafc', textAlign: 'center', marginTop: '60px' }}>
        <div className="container">
            <h2 style={{ fontSize: '2rem', marginBottom: '15px', fontFamily: 'var(--font-space-grotesk)', color: 'var(--aws-dark)' }}>
                Pronto para levar seu projeto para o próximo nível?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#555', maxWidth: '700px', margin: '0 auto 30px' }}>
                Vamos conversar. Agende uma chamada inicial de 30 minutos (sem custo) para discutirmos a sua arquitetura e os seus objetivos de negócio.
            </p>
            <Link href="/servicos" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 35px' }}>
                Agendar Chamada &rarr;
            </Link>
        </div>
      </section>
    </>
  );
}