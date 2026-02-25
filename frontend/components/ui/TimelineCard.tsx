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

  // frontend/components/ui/TimelineCard.tsx

// ... (mantenha os imports e a lógica de data)

return (
  <article className="op-project-card">
    <div className="op-card-header" style={{ padding: '1rem 1.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <i className="far fa-calendar-alt" aria-hidden="true" style={{ color: 'var(--aws-orange)' }}></i>
      <time dateTime={post.data_publicacao}>{dataFormatada}</time>
    </div>

    {post.imagem_destaque_url && (
      <Link 
        href={`/post/${post.slug}`} 
        className="op-card-image" 
        style={{ position: 'relative', display: 'block', height: '200px', overflow: 'hidden' }}
      >
        <Image 
          src={post.imagem_destaque_url} 
          alt={`Capa do artigo: ${post.titulo}`}
          fill
          /* A matemática do LCP otimizado para o Mobile + Respiro do Container */
          sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 66vw, 400px"
          priority={isPriority} 
          quality={80} 
          style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
        />
      </Link>
    )}

    <div className="op-card-body">
      <h2>
        <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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