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
    data_publicacao?: string;
    tempo_leitura_min?: number;
  };
  isPriority?: boolean;
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = d.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
  const year = String(d.getUTCFullYear()).slice(-2);
  return `${day} ${month} '${year}`;
}

function slugToName(slug?: string): string {
  if (!slug) return '';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function PostCard({ post, isPriority = false }: PostCardProps) {
  const date = formatDate(post.data_publicacao);
  const categoriaNome = post.categoria?.nome_exibicao || slugToName(post.categoria_slug);
  const categoriaSlug = post.categoria_slug;

  return (
    <article className="post-card">
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

      <div className="post-card__content">

        {/* Badge + data no topo */}
        <div className="post-card__meta-row">
          {categoriaSlug && (
            <CategoryBadge
              nome={categoriaNome}
              slug={categoriaSlug}
              icone_fa={post.categoria?.icone_fa}
              size="sm"
            />
          )}
          {date && (
            <div className="post-card__meta-info" aria-label="Data de publicação">
              <span>
                <i className="far fa-calendar-alt" aria-hidden="true" />
                {date}
              </span>
            </div>
          )}
        </div>

        <h3 className="post-card__title">
          <Link href={`/post/${post.slug}`} className="post-card__title-link">
            {post.titulo}
          </Link>
        </h3>

        <p className="post-card__excerpt">{post.resumo}</p>

        {/* Footer: tempo de leitura (esquerda) + Ler mais (direita) */}
        <div className="post-card__footer">
          {post.tempo_leitura_min && (
            <span className="post-card__read-time" aria-label="Tempo de leitura">
              <i className="far fa-clock" aria-hidden="true" />
              {post.tempo_leitura_min} min
            </span>
          )}
          <ReadMoreLink
            href={`/post/${post.slug}`}
            ariaLabel={`Ler post completo sobre ${post.titulo}`}
          />
        </div>
      </div>
    </article>
  );
}