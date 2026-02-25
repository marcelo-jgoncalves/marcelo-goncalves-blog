// frontend/components/ui/TimelineCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReadMoreLink from './ReadMoreLink';

interface TimelineCardProps {
  post: {
    slug: string;
    titulo: string;
    resumo: string;
    data_publicacao: string;
    imagem_destaque_url?: string;
  };
  isPriority?: boolean; // Usado para a primeira imagem carregar mais rápido (LCP)
}

export default function TimelineCard({ post, isPriority = false }: TimelineCardProps) {
  // Lógica de formatação da data isolada no componente
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
        <div className="op-card-image">
          <Image 
            src={post.imagem_destaque_url} 
            alt={`Capa do artigo: ${post.titulo}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
            priority={isPriority} 
            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
          />
        </div>
      )}

      <div className="op-card-body">
        <h2>
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