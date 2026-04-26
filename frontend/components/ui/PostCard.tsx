import Link from 'next/link';

interface PostCardProps {
  post: {
    slug: string;
    titulo: string;
    resumo: string;
    imagem_destaque_url: string;
    imagem_destaque_alt_text?: string;
    categoria_slug: string;
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
        role="img"
        aria-label={post.imagem_destaque_alt_text || post.titulo}
      />

      <div className="card-content">
        <span className="post-tag">{post.categoria_slug}</span>
        
        <h3>
          <Link href={`/post/${post.slug}`}>
            {post.titulo}
          </Link>
        </h3>
        
        <p>{post.resumo}</p>
        
        <Link href={`/post/${post.slug}`} className="read-more">
          Ler mais →
        </Link>
      </div>
    </article>
  );
}