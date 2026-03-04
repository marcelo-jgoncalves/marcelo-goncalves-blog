// frontend/components/ui/TimelineCard.tsx// frontend/components/ui/TimelineCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import ReadMoreLink from './ReadMoreLink';
import './TimelineCard.css';

interface TimelineCardProps {
  post: {
    slug: string;
    titulo: string;
    resumo: string;
    data_publicacao: string;
    imagem_destaque_url?: string;
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
      
      {/* 🚀 Estilos inline removidos. Delegação total para o .op-card-header */}
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
          <Image 
            src={post.imagem_destaque_url} 
            alt={`Capa do artigo: ${post.titulo}`}
            fill
            sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 66vw, 400px"
            priority={isPriority} 
            quality={80} 
            // objectFit e transition mantidos aqui pois são props específicas de comportamento de imagem
            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
          />
        </Link>
      )}

      <div className="op-card-body">
        <h2>
          {/* 🚀 textDecoration e color removidos daqui. Delegados para o TimelineCard.css (.op-card-body h2 a) */}
          <Link href={`/post/${post.slug}`}>
            {post.titulo}
          </Link>
        </h2>
        <p>{post.resumo}</p>
      </div>

      <div className="op-card-footer">
        <ReadMoreLink href={`/post/${post.slug}`} />
      </div>
    </article>
  );
}