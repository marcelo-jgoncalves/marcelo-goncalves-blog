/* frontend/components/ui/PostCard.tsx */

import Link from 'next/link';
import ReadMoreLink from './ReadMoreLink';

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
}

export default function PostCard({ post }: PostCardProps) {
  // Garante que a URL da imagem seja válida para CSS (escapa aspas simples)
  const bgImage = post.imagem_destaque_url 
    ? `url('${post.imagem_destaque_url}')` 
    : 'none';

  return (
    <article className="post-card">
      {/* Usando DIV para imagem (igual ao protótipo) */}
      <div 
        className="post-image" 
        style={{ backgroundImage: bgImage }}
      ></div>

      <div className="card-content">
        <h3>
          <Link href={`/post/${post.slug}`}>
            {post.titulo}
          </Link>
        </h3>
        
        <p>{post.resumo}</p>
        
        {/* Aqui entra o nosso novo componente global! */}
        <ReadMoreLink href={`/post/${post.slug}`} />
      </div>
    </article>
  );
}