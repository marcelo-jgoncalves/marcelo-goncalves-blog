// frontend/app/post/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAuthor } from '@/lib/api';
import AuthorBox from '@/components/ui/AuthorBox';
import TOCBox from '@/components/ui/TOCBox';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import PopularPostsSection from '@/components/ui/PopularPostsSection'; // 1. Importação

// --- CORREÇÃO PARA NEXT.JS 15 ---
type Params = Promise<{ slug: string }>;

interface PageProps {
  params: Params;
}

// 1. Gera Metadados para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    
    const data = await getPost(slug);
    if (!data || !data.post) {
      return { title: 'Post não encontrado | IA Decifrada' };
    }
    return {
      title: `${data.post.titulo} | IA Decifrada`,
      description: data.post.resumo,
    };
  } catch (e) {
    return { title: 'Erro | IA Decifrada' };
  }
}

// 2. Componente da Página
export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const postData = await getPost(slug);

  if (!postData || !postData.post) {
    notFound();
  }

  const { post } = postData;

  const authorData = await getAuthor(post.autor_id);
  const author = authorData?.autor || { 
    nome_exibicao: 'Autor Desconhecido', 
    bio: '', 
    foto_avatar_url: '' 
  };

  const formattedDate = new Date(post.data_publicacao).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <section className="post-hero">
        <div className="post-header-content container">
          <Link href={`/categoria/${post.categoria_slug}`} className="btn btn-primary" style={{ padding: '5px 12px', fontSize: '0.8rem', marginBottom: '20px' }}>
            {post.categoria_slug}
          </Link>
          
          <h1>{post.titulo}</h1>
          
          <div className="post-meta" style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#555', marginTop: '15px' }}>
            <span>
              <i className="fas fa-user" style={{ color: 'var(--aws-orange)', marginRight: '5px' }}></i>
              Por <strong>{author.nome_exibicao}</strong>
            </span>
            <span>
              <i className="fas fa-calendar-alt" style={{ color: 'var(--aws-orange)', marginRight: '5px' }}></i>
              {formattedDate}
            </span>
            <span>
              <i className="fas fa-clock" style={{ color: 'var(--aws-orange)', marginRight: '5px' }}></i>
              {post.tempo_leitura_min} min de leitura
            </span>
          </div>
        </div>
      </section>

      <article className="post-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <section style={{ margin: '30px 0' }}>
          <div className="adsense-placeholder">
            [ADSENSE LEADERBOARD - 728x90]
          </div>
        </section>

        {post.imagem_destaque_url && (
          <img 
            src={post.imagem_destaque_url} 
            alt={post.imagem_destaque_alt_text || post.titulo} 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '400px', 
              objectFit: 'cover', 
              borderRadius: '10px',
              border: '1px solid var(--gray-border)',
              marginBottom: '30px'
            }} 
          />
        )}

        <div className="post-content">
            <TOCBox />
            <div dangerouslySetInnerHTML={{ __html: post.conteudo_html }} />
        </div>

        <aside style={{ margin: '40px auto', display: 'flex', justifyContent: 'center' }}>
            <div className="adsense-placeholder-box">
                [ADSENSE IN-ARTICLE]
            </div>
        </aside>
        
        <AuthorBox author={author} />
      </article>

      {/* 2. Seção de Populares (Inserida antes do CTA) */}
      <PopularPostsSection />

      <NewsletterCTA />
    </>
  );
}