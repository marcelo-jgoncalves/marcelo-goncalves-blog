import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByCategory } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import Pagination from '@/components/ui/Pagination';
import AdSenseBanner from '@/components/ui/AdSenseBanner';
import NewsletterCTA from '@/components/ui/NewsletterCTA';

// 1. Configuração de Cache (ISR)
export const revalidate = 60;

// 2. Mapa de Metadados (Fallback visual)
const CATEGORY_META: Record<string, { title: string; description: string }> = {
  'tutoriais-aws': {
    title: 'Tutoriais AWS',
    description: 'Guias práticos e tutoriais passo a passo para construir e implantar soluções de IA 100% serverless na nuvem da AWS.'
  },
  'inteligencia-artificial': {
    title: 'Inteligência Artificial',
    description: 'Análises de modelos como GPT-4, Llama 3 e o futuro da IA generativa.'
  },
  'cloud-computing': {
    title: 'Cloud Computing',
    description: 'Arquitetura serverless, serviços gerenciados e otimização de custos.'
  },
  'devops-automacao': {
    title: 'DevOps & Automação',
    description: 'Pipelines de CI/CD, Terraform e infraestrutura como código (IaC).'
  },
  'seguranca-na-nuvem': {
    title: 'Segurança',
    description: 'Melhores práticas de IAM, redes e proteção de dados em ambientes cloud.'
  },
  'engenharia-de-software': {
    title: 'Engenharia',
    description: 'Design patterns, arquitetura limpa e boas práticas de desenvolvimento.'
  },
  'noticias-e-mercado': {
    title: 'Notícias & Mercado',
    description: 'As últimas atualizações e o impacto da tecnologia nos negócios.'
  }
};

// 3. Tipagem das Props
interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 4. Metadados SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const meta = CATEGORY_META[resolvedParams.slug];
  if (!meta) return { title: 'Categoria Não Encontrada | IA Decifrada' };
  return {
    title: `Artigos sobre ${meta.title} | IA Decifrada`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { slug } = resolvedParams;
  const nextToken = typeof resolvedSearchParams.nextToken === 'string' ? resolvedSearchParams.nextToken : undefined;

  let posts = [];
  let nextPageToken = undefined;
  
  // Busca na API
  try {
    const data = await getPostsByCategory(slug, nextToken);
    if (data) {
      posts = data.posts || [];
      nextPageToken = data.nextToken;
    }
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    // Se der erro grave, não faz notFound() direto, deixa renderizar vazio para debug
  }

  // Se não tem no mapa, usa fallback genérico formatado
  const meta = CATEGORY_META[slug] || {
    title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: `Artigos e tutoriais sobre ${slug.replace(/-/g, ' ')}.`
  };

  return (
    <>
      {/* Hero da Categoria (Fiel ao Protótipo pgn-categoria-v1.0.html) */}
      <section className="search-hero"> {/* Reutilizando classe do globals.css que bate com o estilo */}
        <div className="search-header-content">
          <h1 style={{ marginBottom: '20px' }}>
            Artigos na Categoria: <span className="highlight">{meta.title}</span>
          </h1>
          <p className="search-results-subtitle">
            {meta.description}
          </p>
        </div>
      </section>

      {/* Grid de Posts */}
      <section className="post-grid-container">
        <div className="container">
          
          <div className="adsense-banner">
             <AdSenseBanner />
          </div>

          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              // Estado Vazio (Centralizado)
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '20px' }}>
                  Ainda não publicamos artigos nesta categoria.
                </p>
                <Link href="/artigos" style={{ color: 'var(--aws-orange)', fontWeight: 600, fontSize: '1.1rem' }}>
                  Ver todos os artigos &rarr;
                </Link>
              </div>
            )}
          </div>
          
          <Pagination 
            nextToken={nextPageToken} 
            basePath={`/categoria/${slug}`} 
          />

          <div style={{ paddingTop: '40px', paddingBottom: 0 }}>
             <AdSenseBanner />
          </div>

        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}