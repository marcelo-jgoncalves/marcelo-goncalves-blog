/* frontend/components/ui/PostCard.tsx */
import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import './PostCard.css';

interface PostCardProps {
  post: {
    slug: string;
    titulo: string;
    resumo: string;
    imagem_destaque_url: string;
    imagem_lqip_base64?: string;
    categoria_slug: string;
    categoria?: {
      nome_exibicao: string;
      icone_fa?: string;
    };
    data_publicacao?: string;
    tempo_leitura_min?: number;
  };
  isPriority?: boolean;
}

function slugToName(slug?: string): string {
  if (!slug) return '';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function PostCard({ post, isPriority = false }: PostCardProps) {
  const categoriaNome = post.categoria?.nome_exibicao || slugToName(post.categoria_slug);

  return (
    <Link href={`/post/${post.slug}`} className="post-card" aria-label={post.titulo}>

      {post.imagem_destaque_url && (
        <div className="post-card__image-wrapper">
          <ResponsiveImage
            src={post.imagem_destaque_url}
            alt={`Imagem de capa: ${post.titulo}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="post-card__image"
            priority={isPriority}
            lqip={post.imagem_lqip_base64}
          />
        </div>
      )}

      <div className="post-card__content">
        {categoriaNome && (
          <span className="post-card__category">{categoriaNome}</span>
        )}

        <h3 className="post-card__title">{post.titulo}</h3>

        {post.resumo && (
          <p className="post-card__excerpt">{post.resumo}</p>
        )}

        <span className="post-card__cta">Ler artigo →</span>
      </div>

    </Link>
  );
}
