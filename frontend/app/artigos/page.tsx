import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import AdSenseBanner from '@/components/ui/AdSenseBanner';

// Metadados para SEO
export const metadata = {
  title: 'Todos os Artigos | IA Decifrada',
  description: 'Explore nosso arquivo completo de tutoriais AWS, análises de IA e engenharia de software.',
};

// ISR: Revalidar a cada 60 segundos (consistente com a Home)
export const revalidate = 60;

interface ArtigosPageProps {
  // No Next.js 15, searchParams é uma Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArtigosPage({ searchParams }: ArtigosPageProps) {
  // 1. Resolvemos os parâmetros da URL (Next.js 15)
  const params = await searchParams;
  const nextToken = typeof params.nextToken === 'string' ? params.nextToken : undefined;

  let posts = [];
  let nextPageToken = undefined;

  // 2. Buscamos os dados passando o token de paginação
  try {
    const data = await getAllPosts(nextToken);
    posts = data.posts || [];
    nextPageToken = data.nextToken;
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
  }

  return (
    <>
      {/* 1. Search Hero Section */}
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
          
          {/* AdSense Topo */}
          <div className="adsense-banner">
             <AdSenseBanner />
          </div>

          {/* Grid */}
          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              <p className="col-span-full text-center" style={{ color: '#666', padding: '40px 0' }}>
                Nenhum artigo encontrado no momento.
              </p>
            )}
          </div>
          
          {/* Nova Paginação Funcional (com nextToken) */}
          <Pagination nextToken={nextPageToken} basePath="/artigos" />

          {/* AdSense Fundo */}
          <div style={{ paddingTop: '40px', paddingBottom: 0 }}>
             <AdSenseBanner />
          </div>

        </div>
      </section>

      {/* 3. CTA Newsletter */}
      <section className="cta">
        <div className="container">
          <h2>Quer se aprofundar em Inteligência Artificial?</h2>
          <p>
            Inscreva-se na nossa newsletter e receba análises exclusivas e os melhores artigos da semana direto no seu email.
          </p>
          <Link href="/newsletter" className="btn-outline">
            Inscrever-se agora
          </Link>
        </div>
      </section>
    </>
  );
}