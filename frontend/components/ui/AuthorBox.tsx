import Link from 'next/link';

interface AuthorBoxProps {
  author: {
    nome_exibicao: string;
    bio: string;
    foto_avatar_url?: string; // Pode ser undefined/null
    linkedin_url?: string;
    github_url?: string;
  };
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  // Verifica se a URL é válida (não nula e não vazia)
  const hasAvatar = author.foto_avatar_url && author.foto_avatar_url.trim() !== '';

  return (
    <section className="author-box">
      <div className="author-avatar">
        {hasAvatar ? (
          <img 
            src={author.foto_avatar_url} 
            alt={author.nome_exibicao} 
            // As classes CSS agora controlam o tamanho e radius
          />
        ) : (
          /* Fallback visual: Ícone centralizado */
          <div className="author-avatar-placeholder">
            <i className="fas fa-user"></i>
          </div>
        )}
      </div>

      <div className="author-info">
        <h4>{author.nome_exibicao}</h4>
        
        {/* Bio HTML */}
        <div dangerouslySetInnerHTML={{ __html: author.bio }} />
        
        {/* Link CTA de Serviços (Com classes CSS em vez de style inline) */}
        <p className="cta-servicos">
            Precisa de um especialista?{' '}
            <Link href="/servicos" className="cta-link">
              Clique aqui para saber como posso ajudar
            </Link>.
        </p>

        <div className="author-social">
          {author.linkedin_url && (
            <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          )}
          {author.github_url && (
            <a href={author.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}