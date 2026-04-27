/* frontend/components/ui/PostCard.tsx */
import Link from 'next/link';
import ReadMoreLink from './ReadMoreLink';
import CategoryBadge from './CategoryBadge';
import ResponsiveImage from './ResponsiveImage';
import './PostCard.css';

interface PostCardProps {
  post: {
    slug: string;
    titulo: string;
    resumo: string;
    imagem_destaque_url: string;
    categoria_slug: string;
    categoria?: {
      nome_exibicao: string;
      icone_fa?: string;
    };
  };
  isPriority?: boolean; // 👈 Otimização de LCP (Pilar Performance)
}

export default function PostCard({ post, isPriority = false }: PostCardProps) {
  return (
    <article className="post-card">
      
      {/* Wrapper de Imagem com Next/Image (Pilar: Performance & Vitals) */}
      <div className="post-card__image-wrapper">
        {post.imagem_destaque_url && (
          <ResponsiveImage
            src={post.imagem_destaque_url}
            alt={`Imagem de capa para o artigo: ${post.titulo}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="post-card__image"
            priority={isPriority}
          />
        )}
      </div>

      {/* Conteúdo do Card */}
      <div className="post-card__content">
        
        {/* Pilar SEO On-Page: Injeção do Badge de Categoria */}
        {post.categoria && (
          <div>
            <CategoryBadge 
              nome={post.categoria.nome_exibicao}
              slug={post.categoria_slug}
              icone_fa={post.categoria.icone_fa}
              size="sm"
            />
          </div>
        )}

        <h3 className="post-card__title">
          <Link href={`/post/${post.slug}`} className="post-card__title-link">
            {post.titulo}
          </Link>
        </h3>
        
        <p className="post-card__excerpt">{post.resumo}</p>
        
        {/* Componente Global Injetado com Contexto de SEO */}
        <ReadMoreLink 
          href={`/post/${post.slug}`} 
          ariaLabel={`Ler post completo sobre ${post.titulo}`}
          className="post-card__read-more"
        />
      </div>
    </article>
  );
}