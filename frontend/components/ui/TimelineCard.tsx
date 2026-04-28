/* frontend/components/ui/TimelineCard.tsx */
import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import ReadMoreLink from './ReadMoreLink';
import CategoryBadge from './CategoryBadge';
import './TimelineCard.css';

interface TimelineCardProps {
  post: {
    slug: string;
    titulo: string;
    resumo: string;
    data_publicacao: string;
    imagem_destaque_url?: string;
    categoria_slug?: string;
    categoria?: {
      nome_exibicao: string;
      icone_fa?: string;
    };
  };
  isPriority?: boolean; 
}

export default function TimelineCard({ post, isPriority = false }: TimelineCardProps) {
  
  let dataFormatada = 'Data indisponível';
  if (post.data_publicacao) {
    const dateObj = new Date(post.data_publicacao);
    const dia = String(dateObj.getUTCDate()).padStart(2, '0'); 
    const mes = dateObj.toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' });
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const ano = dateObj.getUTCFullYear();
    dataFormatada = `${dia} de ${mesCapitalizado}, ${ano}`;
  }

  return (
    <article className="op-project-card">
      
      <div className="op-card-header">
        <i className="far fa-calendar-alt" aria-hidden="true"></i>
        <time dateTime={post.data_publicacao}>{dataFormatada}</time>
      </div>

      {post.imagem_destaque_url && (
        <Link
          href={`/post/${post.slug}`}
          className="op-card-image"
          aria-label={`Ler artigo: ${post.titulo}`}
        >
          <ResponsiveImage
            src={post.imagem_destaque_url}
            alt={`Capa do artigo: ${post.titulo}`}
            fill
            sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 66vw, 400px"
            priority={isPriority}
          />
        </Link>
      )}

      {/* A Mágica: Este contêiner continua sendo display: block (conforme JSON), 
        mantendo todo o seu visual original. 
      */}
      <div className="op-card-body">
        
        {/* Pilar SEO: Injeção do Badge */}
        {post.categoria && post.categoria_slug && (
          <div className="op-card-badge-wrapper">
            <CategoryBadge 
              nome={post.categoria.nome_exibicao}
              slug={post.categoria_slug}
              icone_fa={post.categoria.icone_fa}
              size="sm"
            />
          </div>
        )}

        <h2>
          <Link href={`/post/${post.slug}`}>
            {post.titulo}
          </Link>
        </h2>
        <p>{post.resumo}</p>
      </div>

      <div className="op-card-footer">
        <ReadMoreLink 
          href={`/post/${post.slug}`} 
          ariaLabel={`Ler artigo completo sobre ${post.titulo}`}
        />
      </div>
    </article>
  );
}